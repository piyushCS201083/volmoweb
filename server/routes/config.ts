/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { storage } from "../storage";

const router = Router();

// GET /api/config
router.get("/", (req: Request, res: Response) => {
  try {
    const config = storage.getConfig();
    return res.json({ success: true, data: config });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch site configuration" });
  }
});

// PUT /api/config
router.put("/", (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== "object") {
      return res.status(400).json({ error: "Invalid configuration object provided" });
    }

    storage.saveConfig(newConfig);
    console.log("[Backend API] Site configuration updated completely");
    return res.json({ success: true, message: "Site configuration saved successfully", data: newConfig });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update configuration" });
  }
});

// PATCH /api/config/:section
router.patch("/:section", (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;

    const currentConfig = storage.getConfig();
    currentConfig[section] = sectionData;
    storage.saveConfig(currentConfig);

    console.log(`[Backend API] Site section '${section}' updated successfully`);
    return res.json({
      success: true,
      message: `Section ${section} updated successfully`,
      data: currentConfig[section],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || `Failed to update section ${req.params.section}` });
  }
});

// POST /api/config/reset
router.post("/reset", (req: Request, res: Response) => {
  try {
    const resetData = storage.resetConfig();
    console.log("[Backend API] Factory defaults restored for site configuration");
    return res.json({
      success: true,
      message: "Site configuration reset to factory defaults successfully",
      data: resetData,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to reset configuration" });
  }
});

export default router;
