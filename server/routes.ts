import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize Auth
  setupAuth(app);

  // Seed data on startup
  await storage.seedProviders();

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
      userId: req.user!.id,
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
    const plans = await storage.getPlans(req.user!.id);
    res.json(plans);
  });

  // Guests
  app.get(api.guests.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const guests = await storage.getGuests(req.user!.id);
    res.json(guests);
  });

  app.post(api.guests.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const input = api.guests.create.input.parse(req.body);
    const guest = await storage.createGuest({ ...input, userId: req.user!.id });
    res.status(201).json(guest);
  });

  app.delete(api.guests.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    await storage.deleteGuest(Number(req.params.id), req.user!.id);
    res.status(200).send();
  });

  // Payment Mock
  app.post(api.payment.process.path, async (req, res) => {
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    res.json({ success: true, message: "Transaction saved successfully (Mock)" });
  });

  return httpServer;
}
