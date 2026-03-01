import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";
import { supabaseAdmin } from "./supabase";
import { User } from "@shared/schema";

const PostgresSessionStore = connectPg(session);

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) return res.status(401).send();
  next();
}

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD not set, skipping admin seed");
    return;
  }

  const existing = await storage.getUserByUsername(adminEmail);
  if (!existing) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });
    if (error && !error.message.includes("already registered")) {
      console.error("Failed to create admin in Supabase Auth:", error.message);
      return;
    }
    await storage.createUser({
      username: adminEmail,
      password: "",
      displayName: "Administrator",
      isAdmin: true,
    });
    console.log("Admin account created");
  } else {
    if (!existing.isAdmin) {
      await storage.updateUserAdmin(existing.id, true);
    }
    console.log("Admin account already exists");
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "r3pl1t_s3cr3t",
    resave: false,
    saveUninitialized: false,
    store: new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
  }

  app.use(session(sessionSettings));

  app.post("/api/register", async (req, res) => {
    try {
      const { username, password, displayName, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        return res.status(400).json({ message: "Please enter a valid email address" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const validRole = role === "provider" ? "provider" : "client";

      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: username,
        password,
        email_confirm: true,
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return res.status(400).json({ message: "An account with this email already exists" });
        }
        return res.status(400).json({ message: error.message });
      }

      const user = await storage.createUser({
        username,
        displayName: displayName || null,
        password: "",
        role: validRole,
      });

      const { password: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (err: any) {
      console.error("Register error:", err);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password, role } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: username,
        password,
      });

      if (error || !data.user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "User not found in database" });
      }

      if (role && user.role !== role) {
        const label = role === "provider" ? "provider" : "client";
        return res.status(401).json({ message: `This account is not registered as a ${label}` });
      }

      req.session.userId = user.id;
      const { password: _, ...safeUser } = user;
      res.status(200).json(safeUser);
    } catch (err: any) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.clearCookie("connect.sid");
      res.sendStatus(200);
    });
  });

  app.get("/api/user", async (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.sendStatus(401);
    }
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  });
}
