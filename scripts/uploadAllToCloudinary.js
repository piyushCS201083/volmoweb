/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLOUD_NAME = "oz1mkn2s";
const API_KEY = "458683116565521";
const API_SECRET = "doPaTXHlqqd9OeIMCNxj-rnpxrI";

const imagesDir = path.resolve(__dirname, "../src/assets/images");
const files = fs.readdirSync(imagesDir);

console.log(`Found ${files.length} images in ${imagesDir}. Starting upload to Cloudinary...`);

const mapping = {};

async function uploadFile(filename) {
  const filePath = path.join(imagesDir, filename);
  const ext = path.extname(filename);
  const cleanId = filename.replace(/\.[^/.]+$/, "");
  const publicId = `volmo_assets/${cleanId}`;

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

  const fileData = fs.readFileSync(filePath);
  let mime = "image/jpeg";
  if (ext === ".png") mime = "image/png";
  else if (ext === ".webp") mime = "image/webp";
  else if (ext === ".svg") mime = "image/svg+xml";

  const dataUri = `data:${mime};base64,${fileData.toString("base64")}`;

  const formData = new FormData();
  formData.append("file", dataUri);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");
  formData.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (json.secure_url) {
    mapping[`/src/assets/images/${filename}`] = json.secure_url;
    mapping[filename] = json.secure_url;
    console.log(`✓ Uploaded ${filename} -> ${json.secure_url}`);
    return json.secure_url;
  } else {
    console.error(`✗ Failed ${filename}:`, json);
    return null;
  }
}

async function run() {
  for (const file of files) {
    if (!/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) continue;
    try {
      await uploadFile(file);
    } catch (e) {
      console.error(`Error uploading ${file}:`, e.message);
    }
  }

  // Save mapping to a json file
  const outPath = path.resolve(__dirname, "../src/data/cloudinaryImageMap.json");
  fs.writeFileSync(outPath, JSON.stringify(mapping, null, 2), "utf-8");
  console.log(`Done! Saved image URL map with ${Object.keys(mapping).length / 2} items to ${outPath}`);
}

run();
