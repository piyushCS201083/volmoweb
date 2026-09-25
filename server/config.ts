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

export const EMAIL_CONFIG = {
  // Destination email address specified by the user
  NOTIFICATION_RECIPIENT: process.env.NOTIFICATION_EMAIL || "piyushshivhare083@gmail.com",
  // Company mail sender info
  COMPANY_NAME: "Volmo Electrical",
  DEFAULT_FROM_EMAIL: process.env.COMPANY_MAIL_FROM || "sales@volmoelectrical.com",
  // SMTP credentials (optional from environment, e.g. Gmail App Password or custom SMTP)
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587", 10),
  SMTP_SECURE: process.env.SMTP_SECURE === "true",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
};
