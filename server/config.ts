/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SERVER_CONFIG = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  HOST: process.env.HOST || "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  DATA_DIR: process.env.DATA_DIR || path.resolve(__dirname, "data"),
  DEFAULT_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "1234",
};
