import { db } from "./db";
import {
  users, providers, plans, guests,
  type User, type InsertUser,
  type Provider, type InsertUser as InsertProvider, // Alias for consistency if needed, but schema uses createInsertSchema(providers)
  type Plan, type Guest, type InsertGuest,
  moodBoards, moodBoardItems,
  type MoodBoard, type MoodBoardItem, type InsertMoodBoard, type InsertMoodBoardItem
} from "@shared/schema";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Auth & Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;

  updateUserAdmin(id: number, isAdmin: boolean): Promise<void>;
  updateUserPassword(id: number, hashedPassword: string): Promise<void>;
  updateUserServiceCategory(id: number, serviceCategory: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>;

  // Providers
  getProviders(category?: string, city?: string): Promise<Provider[]>;
  getProvider(id: number): Promise<Provider | undefined>;
  seedProviders(): Promise<void>;
  deleteProvider(id: number): Promise<void>;

  // Plans
  createPlan(plan: any): Promise<Plan>; // simplified type for storage
  getPlans(userId: number): Promise<Plan[]>;

  // Guests
  getGuests(userId: number): Promise<Guest[]>;
  createGuest(guest: InsertGuest & { userId: number }): Promise<Guest>;
  deleteGuest(id: number, userId: number): Promise<void>;

  // Mood Boards
  getMoodBoards(userId: number): Promise<MoodBoard[]>;
  getMoodBoard(id: number): Promise<MoodBoard | undefined>;
  createMoodBoard(board: InsertMoodBoard & { userId: number }): Promise<MoodBoard>;
  getMoodBoardItems(boardId: number): Promise<MoodBoardItem[]>;
  addMoodBoardItem(item: InsertMoodBoardItem): Promise<MoodBoardItem>;
  deleteMoodBoardItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserAdmin(id: number, isAdmin: boolean): Promise<void> {
    await db.update(users).set({ isAdmin }).where(eq(users.id, id));
  }

  async updateUserPassword(id: number, hashedPassword: string): Promise<void> {
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, id));
  }

  async updateUserServiceCategory(id: number, serviceCategory: string): Promise<User> {
    const [user] = await db.update(users).set({ serviceCategory }).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(guests).where(eq(guests.userId, id));
    await db.delete(plans).where(eq(plans.userId, id));
    await db.delete(users).where(eq(users.id, id));
  }

  // Providers
  async getProviders(category?: string, city?: string): Promise<Provider[]> {
    let query = db.select().from(providers);
    const conditions = [];
    if (category) conditions.push(eq(providers.category, category));
    if (city) conditions.push(eq(providers.city, city));
    
    if (conditions.length > 0) {
      // @ts-ignore - spread arguments issue with and()
      return await query.where(and(...conditions));
    }
    return await query;
  }

  async getProvider(id: number): Promise<Provider | undefined> {
    const [provider] = await db.select().from(providers).where(eq(providers.id, id));
    return provider;
  }

  async deleteProvider(id: number): Promise<void> {
    await db.delete(providers).where(eq(providers.id, id));
  }

  async seedProviders(): Promise<void> {
    const count = await db.select().from(providers);
    if (count.length > 0) return;

    // Mock Data
    const mockProviders = [
      {
        category: "traiteur",
        name: "Traiteur Maghreb Feasts",
        description: "Authentic Moroccan cuisine with royal service.",
        city: "Casablanca",
        priceMin: 300,
        priceMax: 800,
        images: ["https://images.unsplash.com/photo-1555244162-803834f70033?w=800", "https://images.unsplash.com/photo-1547573854-ea9427f85d29?w=800"],
        packages: [{ name: "Royal", price: 600, features: ["Pastilla", "Mechoui", "Tea"] }]
      },
      {
        category: "hall",
        name: "Palais des Roses",
        description: "Luxurious hall with crystal chandeliers.",
        city: "Rabat",
        priceMin: 15000,
        priceMax: 40000,
        images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800", "https://images.unsplash.com/photo-1519225421980-715cb0202128?w=800"],
        packages: [{ name: "Full Night", price: 20000, features: ["Decoration", "Lighting"] }]
      },
      {
        category: "dj",
        name: "DJ Youssef Ambiance",
        description: "Best Chaabi and Sharqi mixes.",
        city: "Marrakech",
        priceMin: 2000,
        priceMax: 5000,
        images: ["https://images.unsplash.com/photo-1571266028243-371695063ad6?w=800"],
        packages: [{ name: "Evening", price: 3000, features: ["Sound System", "Lights"] }]
      },
      {
        category: "cameraman",
        name: "Lens Memories",
        description: "Cinematic 4K wedding films.",
        city: "Tangier",
        priceMin: 4000,
        priceMax: 10000,
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
        packages: [{ name: "Gold", price: 6000, features: ["Drone", "Photo Album"] }]
      },
      // Add a few more to make "AI" selection interesting
      {
        category: "traiteur",
        name: "Atlas Catering",
        description: "Modern touch on traditional dishes.",
        city: "Marrakech",
        priceMin: 250,
        priceMax: 600,
        images: ["https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800"],
        packages: [{ name: "Standard", price: 400, features: ["Chicken Tagine", "Fruits"] }]
      },
    ];

    for (const p of mockProviders) {
      await db.insert(providers).values(p as any);
    }
  }

  // Plans
  async createPlan(plan: any): Promise<Plan> {
    const [newPlan] = await db.insert(plans).values(plan).returning();
    return newPlan;
  }

  async getPlans(userId: number): Promise<Plan[]> {
    return await db.select().from(plans).where(eq(plans.userId, userId));
  }

  // Guests
  async getGuests(userId: number): Promise<Guest[]> {
    return await db.select().from(guests).where(eq(guests.userId, userId));
  }

  async createGuest(guest: InsertGuest & { userId: number }): Promise<Guest> {
    const [newGuest] = await db.insert(guests).values(guest).returning();
    return newGuest;
  }

  async deleteGuest(id: number, userId: number): Promise<void> {
    await db.delete(guests).where(and(eq(guests.id, id), eq(guests.userId, userId)));
  }

  // Mood Boards
  async getMoodBoards(userId: number): Promise<MoodBoard[]> {
    return await db.select().from(moodBoards).where(eq(moodBoards.userId, userId));
  }

  async getMoodBoard(id: number): Promise<MoodBoard | undefined> {
    const [board] = await db.select().from(moodBoards).where(eq(moodBoards.id, id));
    return board;
  }

  async createMoodBoard(board: InsertMoodBoard & { userId: number }): Promise<MoodBoard> {
    const [newBoard] = await db.insert(moodBoards).values(board).returning();
    return newBoard;
  }

  async getMoodBoardItems(boardId: number): Promise<MoodBoardItem[]> {
    return await db.select().from(moodBoardItems).where(eq(moodBoardItems.boardId, boardId));
  }

  async addMoodBoardItem(item: InsertMoodBoardItem): Promise<MoodBoardItem> {
    const [newItem] = await db.insert(moodBoardItems).values(item).returning();
    return newItem;
  }

  async deleteMoodBoardItem(id: number): Promise<void> {
    await db.delete(moodBoardItems).where(eq(moodBoardItems.id, id));
  }
}

export const storage = new DatabaseStorage();
