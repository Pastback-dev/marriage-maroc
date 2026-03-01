import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, seedAdmin } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";
import { User } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Auth
  setupAuth(app);

  // Seed data on startup
  await storage.seedProviders();
  await seedAdmin();

  // Admin middleware
  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });
    next();
  }

  // Admin API Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const allProviders = await storage.getProviders();
    const userCount = allUsers.length;
    const providerCount = allProviders.length;
    const categoryCounts: Record<string, number> = {};
    for (const p of allProviders) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    res.json({ userCount, providerCount, categoryCounts });
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const safeUsers = allUsers.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const targetId = Number(req.params.id);
    const currentUser = req.user as User;
    if (targetId === currentUser.id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    await storage.deleteUser(targetId);
    res.status(200).json({ message: "User deleted" });
  });

  app.get("/api/admin/providers", requireAdmin, async (req, res) => {
    const allProviders = await storage.getProviders();
    res.json(allProviders);
  });

  app.delete("/api/admin/providers/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await storage.deleteProvider(id);
    res.status(200).json({ message: "Provider deleted" });
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  // Provider Profile Routes
  app.patch("/api/provider/service-category", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });

    const validCategories = ["traiteur", "hall", "dj", "cameraman", "neggafa", "decoration"];
    const { serviceCategory } = req.body;
    if (!serviceCategory || !validCategories.includes(serviceCategory)) {
      return res.status(400).json({ message: "Invalid service category" });
    }

    const updatedUser = await storage.updateUserServiceCategory(user.id, serviceCategory);
    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  });

  app.patch("/api/provider/city", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });

    const { city } = req.body;
    if (!city || typeof city !== "string") {
      return res.status(400).json({ message: "Invalid city" });
    }

    const updatedUser = await storage.updateUserCity(user.id, city);
    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  });

  // Provider Photos
  app.get("/api/provider/photos", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });
    const photos = await storage.getProviderPhotos(user.id);
    res.json(photos);
  });

  app.post("/api/provider/photos", upload.single("photo"), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });
    if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;
    const description = req.body.description || null;

    const photo = await storage.addProviderPhoto({
      userId: user.id,
      imageUrl,
      description,
    });
    res.status(201).json(photo);
  });

  app.patch("/api/provider/photos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });

    const { description } = req.body;
    if (typeof description !== "string") return res.status(400).json({ message: "Description is required" });

    const updated = await storage.updateProviderPhotoDescription(Number(req.params.id), user.id, description);
    if (!updated) return res.status(404).json({ message: "Photo not found" });
    res.json(updated);
  });

  app.delete("/api/provider/photos/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const user = req.user as User;
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });

    await storage.deleteProviderPhoto(Number(req.params.id), user.id);
    res.status(200).json({ message: "Photo deleted" });
  });

  // API Routes

  // Providers
  app.get(api.providers.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const city = req.query.city as string | undefined;
    const providers = await storage.getProviders(category, city);
    res.json(providers);
  });

  app.get(api.providers.get.path, async (req, res) => {
    const provider = await storage.getProvider(Number(req.params.id));
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  });

  // Plans (AI Planner Mock)
  app.post(api.plans.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    
    const input = api.plans.create.input.parse(req.body);
    
    // Mock AI Logic
    const budgetPerGuest = input.totalBudget / input.guestCount;
    
    // Simple allocation strategy
    // Traiteur: 40%, Hall: 30%, DJ: 10%, Cameraman: 10%, Misc: 10%
    const budgetAlloc = {
      traiteur: input.totalBudget * 0.4,
      hall: input.totalBudget * 0.3,
      dj: input.totalBudget * 0.1,
      cameraman: input.totalBudget * 0.1,
    };

    // Find best fitting providers (very simple mock logic)
    // In a real app, this would query DB with price ranges
    const allTraiteurs = await storage.getProviders('traiteur');
    const allHalls = await storage.getProviders('hall');
    const allDjs = await storage.getProviders('dj');
    const allCams = await storage.getProviders('cameraman');

    // Helper to pick closest price
    const pickBest = (items: any[], targetBudget: number) => {
       if (!items.length) return null;
       // Just pick the first one for MVP simplicity or random
       return items[Math.floor(Math.random() * items.length)];
    };

    const suggestedTraiteur = pickBest(allTraiteurs, budgetAlloc.traiteur);
    const suggestedHall = pickBest(allHalls, budgetAlloc.hall);
    const suggestedDj = pickBest(allDjs, budgetAlloc.dj);
    const suggestedCam = pickBest(allCams, budgetAlloc.cameraman);

    const breakdown = {
      traiteur: suggestedTraiteur,
      hall: suggestedHall,
      dj: suggestedDj,
      cameraman: suggestedCam
    };

    // Calculate total cost
    // Use min price * guest count for traiteur, flat min price for others
    const cost = 
      (suggestedTraiteur ? suggestedTraiteur.priceMin * input.guestCount : 0) +
      (suggestedHall ? suggestedHall.priceMin : 0) +
      (suggestedDj ? suggestedDj.priceMin : 0) +
      (suggestedCam ? suggestedCam.priceMin : 0);

    const selectedProviders = {
      traiteur: suggestedTraiteur?.id,
      hall: suggestedHall?.id,
      dj: suggestedDj?.id,
      cameraman: suggestedCam?.id
    };

    const planData = {
      userId: (req.user as any).id,
      guestCount: input.guestCount,
      totalBudget: input.totalBudget,
      city: input.city,
      weddingStyle: input.weddingStyle,
      selectedProviders,
      totalCost: cost
    };

    const newPlan = await storage.createPlan(planData);
    
    res.status(201).json({ ...newPlan, breakdown });
  });

  app.get(api.plans.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const plans = await storage.getPlans((req.user as any).id);
    res.json(plans);
  });

  // Guests
  app.get(api.guests.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const guests = await storage.getGuests((req.user as any).id);
    res.json(guests);
  });

  app.post(api.guests.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const input = api.guests.create.input.parse(req.body);
    const guest = await storage.createGuest({ ...input, userId: (req.user as any).id });
    res.status(201).json(guest);
  });

  app.delete(api.guests.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    await storage.deleteGuest(Number(req.params.id), (req.user as any).id);
    res.status(200).send();
  });

  // Payment Mock
  app.post(api.payment.process.path, async (req, res) => {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    res.json({ success: true, message: "Transaction saved successfully (Mock)" });
  });

  // Mood Boards
  app.get("/api/moodboards", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const boards = await storage.getMoodBoards((req.user as any).id);
    res.json(boards);
  });

  app.post("/api/moodboards", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const board = await storage.createMoodBoard({ ...req.body, userId: (req.user as any).id });
    res.status(201).json(board);
  });

  app.get("/api/moodboards/:id/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const items = await storage.getMoodBoardItems(Number(req.params.id));
    res.json(items);
  });

  app.post("/api/moodboards/:id/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const item = await storage.addMoodBoardItem({ ...req.body, boardId: Number(req.params.id) });
    res.status(201).json(item);
  });

  app.delete("/api/moodboard-items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    await storage.deleteMoodBoardItem(Number(req.params.id));
    res.status(200).send();
  });

  return httpServer;
}
