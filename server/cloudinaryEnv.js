/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Sanitizes CLOUDINARY_URL before Cloudinary SDK initializes.
 */

import dotenv from "dotenv";
dotenv.config();

function sanitizeCloudinaryEnv() {
  const fallbackUrl = "cloudinary://458683116565521:doPaTXHlqqd9OeIMCNxj-rnpxrI@oz1mkn2s";
  
  if (process.env.CLOUDINARY_URL) {
    let val = process.env.CLOUDINARY_URL.trim();
    if (val.startsWith("CLOUDINARY_URL=")) {
      val = val.substring("CLOUDINARY_URL=".length).trim();
    }
    val = val.replace(/^["']|["']$/g, "");
    if (!val.startsWith("cloudinary://") || val.includes("<your_api_key>")) {
      process.env.CLOUDINARY_URL = fallbackUrl;
    } else {
      process.env.CLOUDINARY_URL = val;
    }
  } else {
    process.env.CLOUDINARY_URL = fallbackUrl;
  }
}

sanitizeCloudinaryEnv();
