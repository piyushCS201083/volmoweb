/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Volmo Permanent Cloud Database & Cloudinary Asset Service
 * 
 * Stores all website data, form submissions, and media assets permanently
 * in Cloudinary Cloud (oz1mkn2s) so that changes and leads persist forever
 * and are immediately synchronized across all devices globally.
 */

import { PriceInquiry, DealershipApp } from "../types";
import imageMapJson from "../data/cloudinaryImageMap.json";

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "oz1mkn2s",
  API_KEY: "458683116565521",
  API_SECRET: "doPaTXHlqqd9OeIMCNxj-rnpxrI",
  BASE_DELIVERY_URL: "https://res.cloudinary.com/oz1mkn2s",
};

const IMAGE_MAP: Record<string, string> = imageMapJson as Record<string, string>;

/**
 * Resolves any image URL to its permanent Cloudinary CDN URL.
 * If already a Cloudinary URL or http URL, returns as-is.
 * If local path like /src/assets/images/..., resolves to the Cloudinary CDN URL.
 */
export function resolveCloudImageUrl(url?: string): string {
  if (!url) return "";
  let trimmed = url.trim();
  if (trimmed.startsWith("/http://") || trimmed.startsWith("/https://")) {
    trimmed = trimmed.substring(1);
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  // Look up in Cloudinary image map
  if (IMAGE_MAP[trimmed]) {
    return IMAGE_MAP[trimmed];
  }

  const basename = trimmed.split("/").pop() || "";
  if (IMAGE_MAP[basename]) {
    return IMAGE_MAP[basename];
  }

  // Check without query params or extensions
  const cleanBasename = basename.split("?")[0];
  if (IMAGE_MAP[cleanBasename]) {
    return IMAGE_MAP[cleanBasename];
  }

  const withoutExt = cleanBasename.replace(/\.[^/.]+$/, "");
  if (IMAGE_MAP[withoutExt]) {
    return IMAGE_MAP[withoutExt];
  }

  // Check if any key in IMAGE_MAP matches withoutExt
  for (const [key, mappedUrl] of Object.entries(IMAGE_MAP)) {
    if (key.includes(withoutExt) || (withoutExt && key.endsWith(withoutExt + ".jpg")) || key.endsWith(withoutExt + ".png")) {
      return mappedUrl;
    }
  }

  // Handle specific known asset names
  if (cleanBasename.includes("logo")) {
    return "https://res.cloudinary.com/oz1mkn2s/image/upload/v1791026866/volmo_assets/volmo_logo.png";
  }
  if (cleanBasename.includes("hero_banner")) {
    return "https://res.cloudinary.com/oz1mkn2s/image/upload/v1791026852/volmo_assets/volmo_hero_banner_1780063638602.jpg";
  }
  if (cleanBasename.includes("pulse")) {
    return "https://res.cloudinary.com/oz1mkn2s/image/upload/v1791026889/volmo_assets/volmo_pulse_premium_1780068389740.jpg";
  }

  // Fallback direct Cloudinary URL
  return `${CLOUDINARY_CONFIG.BASE_DELIVERY_URL}/image/upload/volmo_assets/${cleanBasename}`;
}

/**
 * Compute SHA-1 signature for Cloudinary API request using Web Crypto API
 */
async function generateSha1(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Upload an image (base64 Data URI) directly to Cloudinary cloud storage
 */
export async function uploadImageToCloud(
  imageSource: string,
  publicId?: string,
  folder: string = "volmo_assets"
): Promise<{ success: boolean; url: string; publicId: string; error?: string }> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const cleanPublicId = publicId
      ? `${folder}/${publicId.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_")}`
      : `${folder}/volmo_img_${timestamp}`;

    const paramsToSign = `invalidate=true&overwrite=true&public_id=${cleanPublicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.API_SECRET}`;
    const signature = await generateSha1(paramsToSign);

    const formData = new FormData();
    formData.append("file", imageSource);
    formData.append("api_key", CLOUDINARY_CONFIG.API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("public_id", cleanPublicId);
    formData.append("overwrite", "true");
    formData.append("invalidate", "true");
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      console.log(`[Cloudinary Cloud] Image uploaded permanently: ${data.secure_url}`);
      return {
        success: true,
        url: data.secure_url,
        publicId: data.public_id,
      };
    } else {
      console.error("[Cloudinary Cloud] Image upload error:", data);
      return {
        success: false,
        url: "",
        publicId: "",
        error: data.error?.message || "Failed to upload image to Cloudinary",
      };
    }
  } catch (err: any) {
    console.error("[Cloudinary Cloud] Upload failed:", err);
    return {
      success: false,
      url: "",
      publicId: "",
      error: err.message,
    };
  }
}

/**
 * Upload raw JSON data to Cloudinary cloud storage (acting as our persistent cloud database)
 */
export async function saveRawDataToCloud(
  data: any,
  publicId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    // Base64 encode JSON UTF-8
    const base64Data = btoa(unescape(encodeURIComponent(jsonString)));
    const dataUri = `data:application/json;base64,${base64Data}`;

    const fullPublicId = `volmo_cloud_db/${publicId.replace(/\.json$/, "")}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `invalidate=true&overwrite=true&public_id=${fullPublicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.API_SECRET}`;
    const signature = await generateSha1(paramsToSign);

    const formData = new FormData();
    formData.append("file", dataUri);
    formData.append("api_key", CLOUDINARY_CONFIG.API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("public_id", fullPublicId);
    formData.append("overwrite", "true");
    formData.append("invalidate", "true");
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/raw/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.secure_url) {
      console.log(`[Cloudinary Cloud DB] Saved ${publicId}: ${result.secure_url}`);
      return { success: true, url: result.secure_url };
    } else {
      console.warn(`[Cloudinary Cloud DB] Warning saving ${publicId}:`, result);
      return { success: false, error: result.error?.message };
    }
  } catch (err: any) {
    console.warn(`[Cloudinary Cloud DB] Error saving raw data ${publicId}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch raw JSON data from Cloudinary cloud database (with cache-busting timestamp)
 */
export async function fetchRawDataFromCloud<T = any>(publicId: string): Promise<T | null> {
  try {
    const cleanId = publicId.replace(/\.json$/, "");
    const url = `${CLOUDINARY_CONFIG.BASE_DELIVERY_URL}/raw/upload/volmo_cloud_db/${cleanId}?_nocache=${Date.now()}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data as T;
    }
    return null;
  } catch (err: any) {
    // Non-fatal if first time or network glitch
    return null;
  }
}

// ==========================================
// HIGHER-LEVEL CLOUD DATABASE APIS
// ==========================================

/**
 * Fetch current website configuration from Cloudinary Cloud Database
 */
export async function getCloudSiteConfig(): Promise<any | null> {
  return fetchRawDataFromCloud("site-config");
}

/**
 * Save current website configuration permanently to Cloudinary Cloud Database
 */
export async function saveCloudSiteConfig(config: any): Promise<boolean> {
  const res = await saveRawDataToCloud(config, "site-config");
  return res.success;
}

/**
 * Fetch all price inquiries from Cloudinary Cloud Database
 */
export async function getCloudInquiries(): Promise<PriceInquiry[]> {
  const data = await fetchRawDataFromCloud<PriceInquiry[]>("inquiries");
  return Array.isArray(data) ? data : [];
}

/**
 * Save new Price Inquiry permanently to Cloudinary Cloud Database
 */
export async function submitCloudInquiry(inquiry: PriceInquiry): Promise<PriceInquiry> {
  try {
    // 1. Fetch current list from Cloudinary
    const current = await getCloudInquiries();
    const updated = [inquiry, ...current.filter((i) => i.id !== inquiry.id)];

    // 2. Save full list back to Cloudinary
    await saveRawDataToCloud(updated, "inquiries");

    // 3. Save individual record for permanent cloud lead archival
    await saveRawDataToCloud(inquiry, `leads/inquiry_${inquiry.id}`);

    // 4. Update local storage cache
    localStorage.setItem("volmo_inquiries_cache", JSON.stringify(updated));

    console.log(`[Cloud Database] Successfully persisted inquiry ${inquiry.id} to Cloudinary cloud`);
  } catch (err) {
    console.error("[Cloud Database] Error saving inquiry to Cloudinary:", err);
  }
  return inquiry;
}

/**
 * Fetch all dealership applications from Cloudinary Cloud Database
 */
export async function getCloudDealers(): Promise<DealershipApp[]> {
  const data = await fetchRawDataFromCloud<DealershipApp[]>("dealers");
  return Array.isArray(data) ? data : [];
}

/**
 * Save new Dealership Application permanently to Cloudinary Cloud Database
 */
export async function submitCloudDealerApp(dealer: DealershipApp): Promise<DealershipApp> {
  try {
    // 1. Fetch current list from Cloudinary
    const current = await getCloudDealers();
    const updated = [dealer, ...current.filter((d) => d.id !== dealer.id)];

    // 2. Save full list back to Cloudinary
    await saveRawDataToCloud(updated, "dealers");

    // 3. Save individual record for permanent cloud lead archival
    await saveRawDataToCloud(dealer, `leads/dealer_${dealer.id}`);

    // 4. Update local storage cache
    localStorage.setItem("volmo_dealers_cache", JSON.stringify(updated));

    console.log(`[Cloud Database] Successfully persisted dealership app ${dealer.id} to Cloudinary cloud`);
  } catch (err) {
    console.error("[Cloud Database] Error saving dealership app to Cloudinary:", err);
  }
  return dealer;
}
