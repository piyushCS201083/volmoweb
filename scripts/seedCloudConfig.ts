/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from "crypto";
import { storage } from "../server/storage";
import { CLOUDINARY_CONFIG } from "../server/config";

async function seed() {
  const config = storage.getConfig();

  const jsonStr = JSON.stringify(config, null, 2);
  const base64Data = Buffer.from(jsonStr).toString("base64");
  const dataUri = "data:application/json;base64," + base64Data;
  const publicId = "volmo_cloud_db/site-config";
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_CONFIG.API_SECRET}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const formData = new FormData();
  formData.append("file", dataUri);
  formData.append("api_key", CLOUDINARY_CONFIG.API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/raw/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  console.log("Seeded Cloudinary site-config successfully:", json.secure_url);
}

seed().catch(console.error);
