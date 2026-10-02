/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import "../cloudinaryEnv.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { CLOUDINARY_CONFIG } from "../config";

// Configure Cloudinary with user credentials
cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.CLOUD_NAME,
  api_key: CLOUDINARY_CONFIG.API_KEY,
  api_secret: CLOUDINARY_CONFIG.API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDERS = {
  ASSETS: "volmo_assets",
  SCOOTERS: "volmo_assets/scooters",
  BRANDING: "volmo_assets/branding",
  BATTERIES: "volmo_assets/batteries",
  ACCESSORIES: "volmo_assets/accessories",
  DATA: "volmo_cloud_db",
  LEADS: "volmo_cloud_db/leads",
};

/**
 * Ping Cloudinary to verify authentication and connection
 */
export async function testCloudinaryConnection(): Promise<{
  success: boolean;
  cloudName: string;
  message?: string;
  error?: string;
}> {
  try {
    const res = await cloudinary.api.ping();
    return {
      success: res.status === "ok",
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
      message: "Cloudinary connected successfully",
    };
  } catch (error: any) {
    console.error("[Cloudinary Service] Ping error:", error);
    return {
      success: false,
      cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
      error: error.message || "Failed to connect to Cloudinary",
    };
  }
}

/**
 * Upload an image (Data URL, local buffer, or remote URL) to Cloudinary
 */
export async function uploadImageToCloudinary(
  imageSource: string,
  options: {
    folder?: string;
    publicId?: string;
    tags?: string[];
    overwrite?: boolean;
  } = {}
): Promise<{
  success: boolean;
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  error?: string;
}> {
  try {
    const folder = options.folder || CLOUDINARY_FOLDERS.ASSETS;
    const cleanPublicId = options.publicId
      ? options.publicId.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")
      : undefined;

    const res: UploadApiResponse = await cloudinary.uploader.upload(imageSource, {
      folder,
      public_id: cleanPublicId,
      overwrite: options.overwrite ?? true,
      tags: ["volmo", ...(options.tags || [])],
      resource_type: "image",
    });

    console.log(`[Cloudinary Service] Image uploaded: ${res.public_id} -> ${res.secure_url}`);

    return {
      success: true,
      url: res.url,
      secureUrl: res.secure_url,
      publicId: res.public_id,
      format: res.format,
      width: res.width,
      height: res.height,
      bytes: res.bytes,
    };
  } catch (error: any) {
    console.error("[Cloudinary Service] Image upload failed:", error);
    return {
      success: false,
      url: "",
      secureUrl: "",
      publicId: "",
      format: "",
      width: 0,
      height: 0,
      bytes: 0,
      error: error.message || "Failed to upload image to Cloudinary",
    };
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const res = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    return res.result === "ok";
  } catch (error) {
    console.warn(`[Cloudinary Service] Delete failed for ${publicId}:`, error);
    return false;
  }
}

/**
 * Upload raw data/JSON to Cloudinary cloud storage
 */
export async function uploadRawDataToCloudinary(
  data: any,
  publicId: string,
  folder: string = CLOUDINARY_FOLDERS.DATA
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    const base64Data = Buffer.from(jsonString).toString("base64");
    const dataUri = `data:application/json;base64,${base64Data}`;

    const fullPublicId = `${folder}/${publicId.replace(/\.json$/, "")}`;

    const res = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      public_id: fullPublicId,
      overwrite: true,
      invalidate: true,
    });

    console.log(`[Cloudinary Service] Raw cloud data stored: ${fullPublicId} -> ${res.secure_url}`);

    return {
      success: true,
      url: res.secure_url,
    };
  } catch (error: any) {
    console.error(`[Cloudinary Service] Failed to upload raw data ${publicId}:`, error);
    return {
      success: false,
      error: error.message || "Failed to upload raw data to Cloudinary",
    };
  }
}

/**
 * Fetch raw data/JSON from Cloudinary cloud storage
 */
export async function fetchRawDataFromCloudinary<T = any>(
  publicId: string,
  folder: string = CLOUDINARY_FOLDERS.DATA
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const fullPublicId = `${folder}/${publicId.replace(/\.json$/, "")}`;
    const resource = await cloudinary.api.resource(fullPublicId, {
      resource_type: "raw",
    });

    if (resource && resource.secure_url) {
      // Fetch contents from secure URL
      const response = await fetch(resource.secure_url);
      if (response.ok) {
        const json = await response.json();
        return { success: true, data: json as T };
      }
    }

    return { success: false, error: "Resource not found" };
  } catch (error: any) {
    // If not found, return clean status without crashing
    return { success: false, error: error.message || "Not found on Cloudinary" };
  }
}

/**
 * List media assets from a Cloudinary folder
 */
export async function listCloudinaryImages(
  folder: string = CLOUDINARY_FOLDERS.ASSETS,
  maxResults: number = 60
): Promise<{
  success: boolean;
  images: Array<{
    publicId: string;
    url: string;
    format: string;
    bytes: number;
    createdAt: string;
    width: number;
    height: number;
  }>;
  error?: string;
}> {
  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: maxResults,
      resource_type: "image",
    });

    const images = (res.resources || []).map((r: any) => ({
      publicId: r.public_id,
      url: r.secure_url,
      format: r.format,
      bytes: r.bytes,
      createdAt: r.created_at,
      width: r.width,
      height: r.height,
    }));

    return { success: true, images };
  } catch (error: any) {
    console.error("[Cloudinary Service] List resources error:", error);
    return { success: false, images: [], error: error.message };
  }
}

export { cloudinary };
