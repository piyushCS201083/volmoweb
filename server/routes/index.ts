/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router } from "express";
import authRoutes from "./auth";
import leadsRoutes from "./leads";
import configRoutes from "./config";
import healthRoutes from "./health";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/leads", leadsRoutes);
apiRouter.use("/config", configRoutes);
apiRouter.use("/health", healthRoutes);
