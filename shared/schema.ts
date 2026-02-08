import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users for local auth
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // using as email
  password: text("password").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wedding Service Providers
export const providers = pgTable("providers", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'traiteur', 'hall', 'dj', 'cameraman'
  name: text("name").notNull(),
  description: text("description").notNull(),
  city: text("city").notNull(),
  priceMin: integer("price_min").notNull(),
  priceMax: integer("price_max").notNull(),
  images: text("images").array().notNull(), // Array of image URLs
  packages: jsonb("packages").$type<{name: string, price: number, features: string[]}[]>().notNull(),
  rating: integer("rating").default(5),
  contactInfo: text("contact_info"),
});

// Wedding Plans (The "AI" result)
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Foreign key to users
  guestCount: integer("guest_count").notNull(),
  totalBudget: integer("total_budget").notNull(),
  city: text("city").notNull(),
  weddingStyle: text("wedding_style").notNull(),
  // Storing selected provider IDs
  selectedProviders: jsonb("selected_providers").$type<{
    traiteur?: number,
    hall?: number,
    dj?: number,
    cameraman?: number
  }>(),
  totalCost: integer("total_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Guests
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id"), // Optional link to a specific plan
  name: text("name").notNull(),
  type: text("type").notNull(), // 'local' or 'foreign'
  pricePerGuest: integer("price_per_guest").default(0),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProviderSchema = createInsertSchema(providers).omit({ id: true });
export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true, selectedProviders: true, totalCost: true });
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Provider = typeof providers.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

// API Request/Response Types
export type LoginRequest = Pick<InsertUser, "username" | "password">;
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
  }
};
