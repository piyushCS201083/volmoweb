/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { SERVER_CONFIG } from "../config";

const router = Router();

// Ensure upload directories exist
const dataUploadsDir = path.join(SERVER_CONFIG.DATA_DIR, "uploads");
if (!fs.existsSync(dataUploadsDir)) {
  fs.mkdirSync(dataUploadsDir, { recursive: true });
}

const publicUploadsDir = path.resolve(process.cwd(), "public", "uploads");
if (!fs.existsSync(publicUploadsDir)) {
  try {
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  } catch (e) {
    // Non-fatal if public folder is read-only in some container environments
  }
}

/**
 * Helper to parse Base64 image
 */
function parseBase64Image(dataString: string): { mimeType: string; extension: string; buffer: Buffer } | null {
  const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  let extension = "png";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) extension = "jpg";
  else if (mimeType.includes("webp")) extension = "webp";
  else if (mimeType.includes("svg")) extension = "svg";
  else if (mimeType.includes("gif")) extension = "gif";

  return { mimeType, extension, buffer };
}

// POST /api/upload/image
router.post("/image", (req: Request, res: Response) => {
  try {
    const { image, filename: preferredFilename } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Missing image data" });
    }

    const parsed = parseBase64Image(image);
    if (!parsed) {
      return res.status(400).json({ error: "Invalid Base64 image format. Expected data:image/...;base64,..." });
    }

    const timestamp = Date.now();
    const safeName = preferredFilename
      ? preferredFilename.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()
      : `volmo_cms_${timestamp}`;
    const filename = safeName.endsWith(`.${parsed.extension}`) ? safeName : `${safeName}.${parsed.extension}`;

    // Write to server data uploads
    const destPathData = path.join(dataUploadsDir, filename);
    fs.writeFileSync(destPathData, parsed.buffer);

    // Also write to public/uploads if accessible
    try {
      const destPathPublic = path.join(publicUploadsDir, filename);
      fs.writeFileSync(destPathPublic, parsed.buffer);
    } catch (err) {
      // Ignore if public is not directly writable
    }

    console.log(`[Upload API] Saved image: ${filename} (${parsed.buffer.length} bytes)`);

    return res.json({
      success: true,
      url: `/uploads/${filename}`,
      filename,
      size: parsed.buffer.length,
      mimeType: parsed.mimeType,
    });
  } catch (error: any) {
    console.error("[Upload API] Error saving image:", error);
    return res.status(500).json({ error: error.message || "Failed to save image" });
  }
});

// POST /api/upload/batch
router.post("/batch", (req: Request, res: Response) => {
  try {
    const { images } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ error: "Expected 'images' array in body" });
    }

    const results = images.map((item, idx) => {
      if (!item.image || typeof item.image !== "string") {
        return { success: false, error: "Missing image data" };
      }
      const parsed = parseBase64Image(item.image);
      if (!parsed) {
        return { success: false, error: "Invalid Base64" };
      }

      const timestamp = Date.now() + idx;
      const safeName = item.filename
        ? item.filename.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()
        : `volmo_cms_${timestamp}`;
      const filename = safeName.endsWith(`.${parsed.extension}`) ? safeName : `${safeName}.${parsed.extension}`;

      const destPathData = path.join(dataUploadsDir, filename);
      fs.writeFileSync(destPathData, parsed.buffer);

      try {
        const destPathPublic = path.join(publicUploadsDir, filename);
        fs.writeFileSync(destPathPublic, parsed.buffer);
      } catch (err) {}

      return {
        success: true,
        originalId: item.id || idx,
        url: `/uploads/${filename}`,
        filename,
      };
    });

    return res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Batch upload failed" });
  }
});

export default router;
