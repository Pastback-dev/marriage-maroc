import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const rootDistPath = path.resolve(process.cwd(), "dist");
  
  if (!fs.existsSync(rootDistPath)) {
    throw new Error(
      `Could not find the build directory: ${rootDistPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(rootDistPath));

  // Standard Express catch-all for SPA routing
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(rootDistPath, "index.html"));
  });
}