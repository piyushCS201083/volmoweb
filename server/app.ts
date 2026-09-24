/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { SERVER_CONFIG } from "./config";
import { apiRouter } from "./routes/index";

export function createExpressApp(): Express {
  const app = express();

  // Cross-Origin Resource Sharing (CORS) - Allows frontend deployed separately to access this API
  app.use(
    cors({
      origin: SERVER_CONFIG.CORS_ORIGIN === "*" ? true : SERVER_CONFIG.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // Body parsers with high limit for Base64 scooter photo uploads in the CMS
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Mount API endpoints
  app.use("/api", apiRouter);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[Backend Error]", err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  });

  return app;
}
