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
  process.argv[1]?.includes("tsx") ||
    (process as any).execArgv?.some((arg: string) => arg.includes("tsx")) ||
    process.env.__BOOTSTRAPPED_WITH_TSX__ ||
    process.env.TSX_LOADED
);

if (!hasTsx && !process.env.TSX_LOADED) {
  process.env.__BOOTSTRAPPED_WITH_TSX__ = "true";
  process.env.TSX_LOADED = "true";
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
  const isStandaloneBackend = process.env.STANDALONE_BACKEND === "true";
  const distPath = path.resolve(__dirname, "dist");
  const distIndexPath = path.resolve(distPath, "index.html");

  if (!isStandaloneBackend && !fs.existsSync(distIndexPath)) {
    console.log("[Server] Compiling frontend static bundle with Vite for robust production delivery...");
    try {
      const { execSync } = await import("node:child_process");
      execSync("npx vite build", { stdio: "inherit", cwd: __dirname });
    } catch (e: any) {
      console.warn("[Server] Vite build notice:", e.message);
    }
  }

  if (!isStandaloneBackend && fs.existsSync(distIndexPath)) {
    // Serve compiled static bundle from dist/ for fast, reliable loading without HMR WebSocket overhead
    const express = await import("express");
    app.use(
      express.default.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.endsWith("index.html")) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          }
        },
      })
    );
    app.get("*", (req, res, next) => {
      if (
        req.originalUrl.startsWith("/api") ||
        req.originalUrl.startsWith("/uploads") ||
        req.originalUrl.startsWith("/src/assets/images") ||
        req.originalUrl.startsWith("/assets/images") ||
        req.originalUrl.startsWith("/images") ||
        req.originalUrl.startsWith("/assets/")
      ) {
        return next();
      }
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(distIndexPath);
    });
    console.log("[Server] Serving compiled static build from dist/");
  } else if (!isStandaloneBackend) {
    // Fallback development mode: Vite running in middleware mode
    process.env.DISABLE_HMR = "true";
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root: __dirname,
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      if (
        req.originalUrl.startsWith("/api") ||
        req.originalUrl.startsWith("/uploads") ||
        req.originalUrl.startsWith("/src/assets/images") ||
        req.originalUrl.startsWith("/assets/images") ||
        req.originalUrl.startsWith("/images")
      ) {
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

    console.log("[Dev Server] Vite middleware mounted");
  } else {
    console.log("[Standalone Mode] Running as dedicated backend API server");
    app.get("/", (_req, res) => {
      res.json({
        service: "Volmo Electric Backend API",
        status: "online",
        timestamp: new Date().toISOString(),
        endpoints: {
          health: "/api/health",
          auth: "/api/auth",
          leads: "/api/leads",
          config: "/api/config",
        },
      });
    });
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
