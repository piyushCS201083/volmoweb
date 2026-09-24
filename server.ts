/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createExpressApp } from "./server/app";
import { SERVER_CONFIG } from "./server/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createExpressApp();
  const isProduction = process.env.NODE_ENV === "production";
  const isStandaloneBackend = process.env.STANDALONE_BACKEND === "true";

  if (!isProduction && !isStandaloneBackend) {
    // Development mode: Vite running in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Dev Server] Vite middleware mounted for hot development");
  } else if (!isStandaloneBackend) {
    // Production mode: Serve built client assets
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      const express = await import("express");
      app.use(express.default.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
      console.log("[Prod Server] Serving static build from dist/");
    } else {
      console.warn("[Prod Server] 'dist' folder not found. Please run 'npm run build' first.");
    }
  } else {
    console.log("[Standalone Mode] Running as dedicated backend API server");
  }

  const server = app.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
    console.log(
      `[Volmo Server] Running on http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT} in ${SERVER_CONFIG.NODE_ENV} mode`
    );
    console.log(`[Volmo Server] Backend APIs available at http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/`);
  });

  return server;
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
