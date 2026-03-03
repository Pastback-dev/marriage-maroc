"use client";

import { z } from "zod";

// ─── Zod Schemas ────────────────────────────────────────────────────────────

export const insertUserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2, "Name is required").optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.enum(["client", "provider"]).default("client"),
  serviceCategory: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
});

export const loginSchema = z.object({
  username: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const insertGuestSchema = z.object({
  userId: z.string(),
  planId: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(["local", "foreign"]),
  pricePerGuest: z.number().default(0),
  numberOfGuests: z.number().min(1).default(1),
  gender: z.enum(["male", "female", "both"]).default("male"),
  city: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  description: z.string().optional(),
});

export type InsertGuest = z.infer<typeof insertGuestSchema>;

// ─── TypeScript Types ────────────────────────────────────────────────────────

export type User = {
  id: string;
  username: string;
  displayName: string | null;
  phone: string | null;
  role: string;
  serviceCategory: string | null;
  city: string | null;
  description: string | null;
  priceMin: number | null;
  priceMax: number | null;
  isAdmin: boolean;
  createdAt: Date | null;
};

export type Provider = {
  id: number;
  category: string;
  name: string;
  description: string;
  city: string;
  priceMin: number;
  priceMax: number;
  images: string[];
  packages: { name: string; price: number; features: string[] }[];
  rating: number | null;
  contactInfo: string | null;
};

export type Plan = {
  id: number;
  userId: string;
  guestCount: number;
  totalBudget: number;
  city: string;
  weddingStyle: string;
  selectedProviders: {
    traiteur?: number;
    hall?: number;
    dj?: number;
    cameraman?: number;
  } | null;
  totalCost: number;
  createdAt: Date | null;
};

export type Guest = {
  id: number;
  userId: string;
  planId: number | null;
  name: string;
  type: string;
  pricePerGuest: number | null;
  numberOfGuests: number;
  gender: string;
  city: string | null;
  eventDate: string | null;
  eventTime: string | null;
  description: string | null;
};

export type InsertUser = z.infer<typeof insertUserSchema>;

export type LoginRequest = {
  username: string;
  password: string;
  role?: "client" | "provider";
};
export type RegisterRequest = InsertUser;

export type CreatePlanRequest = {
  guestCount: number;
  totalBudget: number;
  city: string;
  weddingStyle: string;
};

export type PlanResponse = Plan & {
  breakdown: {
    traiteur: Provider | null;
    hall: Provider | null;
    dj: Provider | null;
    cameraman: Provider | null;
  };
};