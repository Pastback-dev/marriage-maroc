import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, seedAdmin, requireAuth } from "./auth";
import { api } from "@shared/routes";
import { User } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

async function getSessionUser(req: Request): Promise<User | undefined> {
  if (!req.session.userId) return undefined;
  return await storage.getUser(req.session.userId);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  await storage.seedProviders();
  await seedAdmin();

  async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).send();
    if (!user.isAdmin) return res.status(403).json({ message: "Admin access required" });
    (req as any).currentUser = user;
    next();
  }

  async function requireProvider(req: Request, res: Response, next: NextFunction) {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).send();
    if (user.role !== "provider") return res.status(403).json({ message: "Provider access required" });
    (req as any).currentUser = user;
    next();
  }

  async function requireAnyAuth(req: Request, res: Response, next: NextFunction) {
    const user = await getSessionUser(req);
    if (!user) return res.status(401).send();
    (req as any).currentUser = user;
    next();
  }

  // Admin API Routes
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const allProviders = await storage.getProviders();
    const categoryCounts: Record<string, number> = {};
    for (const p of allProviders) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    res.json({ userCount: allUsers.length, providerCount: allProviders.length, categoryCounts });
  });

  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    const safeUsers = allUsers.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    const targetId = Number(req.params.id);
    const currentUser = (req as any).currentUser as User;
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
    await storage.deleteProvider(Number(req.params.id));
    res.status(200).json({ message: "Provider deleted" });
  });

  // Provider Profile Routes
  app.patch("/api/provider/service-category", requireProvider, async (req, res) => {
    const user = (req as any).currentUser as User;
    const validCategories = ["traiteur", "hall", "dj", "cameraman", "neggafa", "decoration"];
    const { serviceCategory } = req.body;
    if (!serviceCategory || !validCategories.includes(serviceCategory)) {
      return res.status(400).json({ message: "Invalid service category" });
    }
    const updatedUser = await storage.updateUserServiceCategory(user.id, serviceCategory);
    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  });

  app.patch("/api/provider/city", requireProvider, async (req, res) => {
    const user = (req as any).currentUser as User;
    const { city } = req.body;
    if (!city || typeof city !== "string") {
      return res.status(400).json({ message: "Invalid city" });
    }
    const updatedUser = await storage.updateUserCity(user.id, city);
    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  });

  // Provider Photos
  app.get("/api/provider/photos", requireProvider, async (req, res) => {
    const user = (req as any).currentUser as User;
    const photos = await storage.getProviderPhotos(user.id);
    res.json(photos);
  });

  app.post("/api/provider/photos", requireProvider, upload.single("photo"), async (req, res) => {
    const user = (req as any).currentUser as User;
    if (!req.file) return res.status(400).json({ message: "No image file uploaded" });

    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      const imageUrl = await storage.uploadProviderPhotoToStorage(
        req.file.buffer,
        fileName,
        req.file.mimetype,
      );

      const description = req.body.description || null;
      const photo = await storage.addProviderPhoto({ userId: user.id, imageUrl, description });
      res.status(201).json(photo);
    } catch (err: any) {
      console.error("Photo upload error:", err);
      res.status(500).json({ message: err.message || "Upload failed" });
    }
  });

  app.patch("/api/provider/photos/:id", requireProvider, async (req, res) => {
    const user = (req as any).currentUser as User;
    const { description } = req.body;
    if (typeof description !== "string") return res.status(400).json({ message: "Description is required" });
    const updated = await storage.updateProviderPhotoDescription(Number(req.params.id), user.id, description);
    if (!updated) return res.status(404).json({ message: "Photo not found" });
    res.json(updated);
  });

  app.delete("/api/provider/photos/:id", requireProvider, async (req, res) => {
    const user = (req as any).currentUser as User;
    await storage.deleteProviderPhoto(Number(req.params.id), user.id);
    res.status(200).json({ message: "Photo deleted" });
  });

  // Providers
  app.get(api.providers.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const city = req.query.city as string | undefined;
    const providersList = await storage.getProviders(category, city);
    res.json(providersList);
  });

  app.get(api.providers.get.path, async (req, res) => {
    const provider = await storage.getProvider(Number(req.params.id));
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  });

  // Plans
  app.post(api.plans.create.path, requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const input = api.plans.create.input.parse(req.body);

    const budgetAlloc = {
      traiteur: input.totalBudget * 0.4,
      hall: input.totalBudget * 0.3,
      dj: input.totalBudget * 0.1,
      cameraman: input.totalBudget * 0.1,
    };

    const allTraiteurs = await storage.getProviders("traiteur");
    const allHalls = await storage.getProviders("hall");
    const allDjs = await storage.getProviders("dj");
    const allCams = await storage.getProviders("cameraman");

    const pickBest = (items: any[]) => {
      if (!items.length) return null;
      return items[Math.floor(Math.random() * items.length)];
    };

    const suggestedTraiteur = pickBest(allTraiteurs);
    const suggestedHall = pickBest(allHalls);
    const suggestedDj = pickBest(allDjs);
    const suggestedCam = pickBest(allCams);

    const breakdown = {
      traiteur: suggestedTraiteur,
      hall: suggestedHall,
      dj: suggestedDj,
      cameraman: suggestedCam,
    };

    const cost =
      (suggestedTraiteur ? suggestedTraiteur.priceMin * input.guestCount : 0) +
      (suggestedHall ? suggestedHall.priceMin : 0) +
      (suggestedDj ? suggestedDj.priceMin : 0) +
      (suggestedCam ? suggestedCam.priceMin : 0);

    const selectedProviders = {
      traiteur: suggestedTraiteur?.id,
      hall: suggestedHall?.id,
      dj: suggestedDj?.id,
      cameraman: suggestedCam?.id,
    };

    const newPlan = await storage.createPlan({
      userId: user.id,
      guestCount: input.guestCount,
      totalBudget: input.totalBudget,
      city: input.city,
      weddingStyle: input.weddingStyle,
      selectedProviders,
      totalCost: cost,
    });

    res.status(201).json({ ...newPlan, breakdown });
  });

  app.get(api.plans.list.path, requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const plansList = await storage.getPlans(user.id);
    res.json(plansList);
  });

  // Guests
  app.get(api.guests.list.path, requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const guestsList = await storage.getGuests(user.id);
    res.json(guestsList);
  });

  app.post(api.guests.create.path, requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const input = api.guests.create.input.parse(req.body);
    const guest = await storage.createGuest({ ...input, userId: user.id });
    res.status(201).json(guest);
  });

  app.delete(api.guests.delete.path, requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    await storage.deleteGuest(Number(req.params.id), user.id);
    res.status(200).send();
  });

  // Payment Mock
  app.post(api.payment.process.path, async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    res.json({ success: true, message: "Transaction saved successfully (Mock)" });
  });

  // Mood Boards
  app.get("/api/moodboards", requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const boards = await storage.getMoodBoards(user.id);
    res.json(boards);
  });

  app.post("/api/moodboards", requireAnyAuth, async (req, res) => {
    const user = (req as any).currentUser as User;
    const board = await storage.createMoodBoard({ ...req.body, userId: user.id });
    res.status(201).json(board);
  });

  app.get("/api/moodboards/:id/items", requireAnyAuth, async (req, res) => {
    const items = await storage.getMoodBoardItems(Number(req.params.id));
    res.json(items);
  });

  app.post("/api/moodboards/:id/items", requireAnyAuth, async (req, res) => {
    const item = await storage.addMoodBoardItem({ ...req.body, boardId: Number(req.params.id) });
    res.status(201).json(item);
  });

  app.delete("/api/moodboard-items/:id", requireAnyAuth, async (req, res) => {
    await storage.deleteMoodBoardItem(Number(req.params.id));
    res.status(200).send();
  });

  return httpServer;
}
