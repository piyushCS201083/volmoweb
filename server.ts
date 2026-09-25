/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure TypeScript resolution works when run with either `node server.ts` or `tsx server.ts`
const hasTsx = Boolean(
  (process as any).execArgv?.some((arg: string) => arg.includes("tsx")) ||
    process.env.__BOOTSTRAPPED_WITH_TSX__
);

if (!hasTsx && !process.env.TSX_LOADED) {
  process.env.__BOOTSTRAPPED_WITH_TSX__ = "true";
  const child = spawn(
    process.execPath,
    ["--import", "tsx", __filename, ...process.argv.slice(2)],
    {
      stdio: "inherit",
      env: process.env,
    }
  );
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 0);
  });
} else {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

async function startServer() {
  const { createExpressApp } = await import("./server/app");
  const { SERVER_CONFIG } = await import("./server/config");
  const http = await import("node:http");
  const app = createExpressApp();
  const server = http.createServer(app);
  const isProduction = process.env.NODE_ENV === "production";
  const isStandaloneBackend = process.env.STANDALONE_BACKEND === "true";

  if (!isProduction && !isStandaloneBackend) {
    // Development mode: Vite running in middleware mode
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: __dirname,
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);

    // Fallback for HTML serving in development mode
    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api")) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    console.log("[Dev Server] Vite middleware mounted for hot development");
  } else if (!isStandaloneBackend) {
    // Production mode: Serve built client assets
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      const express = await import("express");
      app.use(express.default.static(distPath));
      app.get("*", (req, res, next) => {
        if (req.originalUrl.startsWith("/api")) {
          return next();
        }
        res.sendFile(path.resolve(distPath, "index.html"));
      });
      console.log("[Prod Server] Serving static build from dist/");
    } else {
      console.warn("[Prod Server] 'dist' folder not found. Please run 'npm run build' first.");
    }
  } else {
    console.log("[Standalone Mode] Running as dedicated backend API server");
  }

  server.listen(SERVER_CONFIG.PORT, SERVER_CONFIG.HOST, () => {
    console.log(
      `[Volmo Server] Running on http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT} in ${SERVER_CONFIG.NODE_ENV} mode`
    );
    console.log(
      `[Volmo Server] Backend APIs available at http://${SERVER_CONFIG.HOST}:${SERVER_CONFIG.PORT}/api/`
    );
  });

  return server;
}
