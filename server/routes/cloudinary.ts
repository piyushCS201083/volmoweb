/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import {
  testCloudinaryConnection,
  uploadImageToCloudinary,
  uploadRawDataToCloudinary,
  fetchRawDataFromCloudinary,
  listCloudinaryImages,
  deleteImageFromCloudinary,
  CLOUDINARY_FOLDERS,
} from "../services/cloudinary";
import { storage } from "../storage";
import { CLOUDINARY_CONFIG } from "../config";

const router = Router();

// GET /api/cloudinary/status - Test Cloudinary connection & cloud name
router.get("/status", async (_req: Request, res: Response) => {
  const result = await testCloudinaryConnection();
  return res.json({
    ...result,
    cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
    hasApiKey: Boolean(CLOUDINARY_CONFIG.API_KEY),
    folders: CLOUDINARY_FOLDERS,
  });
});

// POST /api/cloudinary/upload - Upload single image directly to Cloudinary
router.post("/upload", async (req: Request, res: Response) => {
  try {
    const { image, folder, publicId } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Missing image data" });
    }

    const result = await uploadImageToCloudinary(image, {
      folder: folder || CLOUDINARY_FOLDERS.ASSETS,
      publicId,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error || "Upload failed" });
    }

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to upload to Cloudinary" });
  }
});

// GET /api/cloudinary/images - List images in Cloudinary library
router.get("/images", async (req: Request, res: Response) => {
  try {
    const folder = (req.query.folder as string) || CLOUDINARY_FOLDERS.ASSETS;
    const maxResults = parseInt((req.query.limit as string) || "60", 10);
    const result = await listCloudinaryImages(folder, maxResults);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to list Cloudinary images" });
  }
});

// DELETE /api/cloudinary/image - Delete image from Cloudinary
router.delete("/image", async (req: Request, res: Response) => {
  try {
    const publicId = req.query.publicId as string;
    if (!publicId) {
      return res.status(400).json({ error: "Missing publicId parameter" });
    }
    const success = await deleteImageFromCloudinary(publicId);
    return res.json({ success, publicId });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/cloudinary/sync-all-to-cloud - Master sync of all data (leads, config, assets) to Cloudinary
router.post("/sync-all-to-cloud", async (_req: Request, res: Response) => {
  try {
    console.log("[Cloudinary API] Starting master sync to cloud database...");

    // 1. Sync Site Config to Cloudinary
    const config = storage.getConfig();
    const configSync = await uploadRawDataToCloudinary(
      config,
      "site-config",
      CLOUDINARY_FOLDERS.DATA
    );

    // 2. Sync Leads (Inquiries & Dealers) to Cloudinary
    const leads = storage.getLeads();
    const inquiriesSync = await uploadRawDataToCloudinary(
      leads.inquiries,
      "inquiries",
      CLOUDINARY_FOLDERS.DATA
    );
    const dealersSync = await uploadRawDataToCloudinary(
      leads.dealers,
      "dealers",
      CLOUDINARY_FOLDERS.DATA
    );

    // Upload individual leads for permanent granularity
    let individualUploaded = 0;
    for (const inq of leads.inquiries.slice(0, 50)) {
      await uploadRawDataToCloudinary(inq, `inquiry_${inq.id}`, CLOUDINARY_FOLDERS.LEADS);
      individualUploaded++;
    }

    for (const dlr of leads.dealers.slice(0, 50)) {
      await uploadRawDataToCloudinary(dlr, `dealer_${dlr.id}`, CLOUDINARY_FOLDERS.LEADS);
      individualUploaded++;
    }

    return res.json({
      success: true,
      message: "Data and form submissions successfully saved to Cloudinary Cloud Database!",
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
      configUrl: configSync.url,
      inquiriesUrl: inquiriesSync.url,
      dealersUrl: dealersSync.url,
      inquiriesCount: leads.inquiries.length,
      dealersCount: leads.dealers.length,
      individualUploaded,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cloudinary API] Master sync error:", error);
    return res.status(500).json({ error: error.message || "Cloud sync failed" });
  }
});

// POST /api/cloudinary/sync-local-images - Migrate local scooter/branding assets to Cloudinary
router.post("/sync-local-images", async (_req: Request, res: Response) => {
  try {
    const imagesDir = path.resolve(process.cwd(), "src/assets/images");
    if (!fs.existsSync(imagesDir)) {
      return res.json({ success: true, migrated: [], count: 0 });
    }

    const files = fs.readdirSync(imagesDir);
    const migrated: Array<{ localName: string; localPath: string; cloudUrl: string; publicId: string }> = [];

    for (const file of files) {
      if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) continue;

      const fullPath = path.join(imagesDir, file);
      const publicId = file.replace(/\.[^/.]+$/, "");
      
      const uploadRes = await uploadImageToCloudinary(fullPath, {
        folder: CLOUDINARY_FOLDERS.ASSETS,
        publicId,
        overwrite: false, // Don't re-upload if already exists
      });

      if (uploadRes.success) {
        migrated.push({
          localName: file,
          localPath: `/src/assets/images/${file}`,
          cloudUrl: uploadRes.secureUrl,
          publicId: uploadRes.publicId,
        });
      }
    }

    return res.json({
      success: true,
      count: migrated.length,
      migrated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to migrate local images" });
  }
});

// GET /api/cloudinary/cloud-db - Retrieve cloud database records
router.get("/cloud-db", async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || "all";
    const result: Record<string, any> = {};

    if (type === "all" || type === "inquiries") {
      const inq = await fetchRawDataFromCloudinary("inquiries", CLOUDINARY_FOLDERS.DATA);
      if (inq.success) result.inquiries = inq.data;
    }

    if (type === "all" || type === "dealers") {
      const dlr = await fetchRawDataFromCloudinary("dealers", CLOUDINARY_FOLDERS.DATA);
      if (dlr.success) result.dealers = dlr.data;
    }

    if (type === "all" || type === "config") {
      const cfg = await fetchRawDataFromCloudinary("site-config", CLOUDINARY_FOLDERS.DATA);
      if (cfg.success) result.config = cfg.data;
    }

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
