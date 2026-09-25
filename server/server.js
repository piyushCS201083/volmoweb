/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Standalone Node.js entry point for Render/production deployments.
 * This runs directly with native Node.js (node server.js).
 */

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = parseInt(process.env.PORT || "10000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "production";
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "piyushshivhare083@gmail.com";
const COMPANY_MAIL_FROM = process.env.COMPANY_MAIL_FROM || "sales@volmoelectrical.com";

// In-memory + file-backed lead & config storage for standalone deployment
const dataDir = process.env.DATA_DIR || path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (err) {
    console.warn("Could not create data directory, using in-memory mode:", err);
  }
}

// Enable CORS
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// In-memory collections with fallback persistence
let inquiries = [];
let dealers = [];
let siteConfig = null;

const inquiriesFile = path.join(dataDir, "inquiries.json");
const dealersFile = path.join(dataDir, "dealers.json");
const configFile = path.join(dataDir, "site-config.json");

try {
  if (fs.existsSync(inquiriesFile)) {
    inquiries = JSON.parse(fs.readFileSync(inquiriesFile, "utf-8"));
  }
  if (fs.existsSync(dealersFile)) {
    dealers = JSON.parse(fs.readFileSync(dealersFile, "utf-8"));
  }
  if (fs.existsSync(configFile)) {
    siteConfig = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  }
} catch (e) {
  console.warn("Warning reading persisted files:", e.message);
}

function saveInquiries() {
  try {
    fs.writeFileSync(inquiriesFile, JSON.stringify(inquiries, null, 2));
  } catch (e) {}
}

function saveDealers() {
  try {
    fs.writeFileSync(dealersFile, JSON.stringify(dealers, null, 2));
  } catch (e) {}
}

function saveConfig() {
  try {
    fs.writeFileSync(configFile, JSON.stringify(siteConfig, null, 2));
  } catch (e) {}
}

// Nodemailer Transporter helper
function createEmailTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

// Send Email Alert Helper
async function sendNotificationEmail(subject, htmlContent, textContent) {
  const transporter = createEmailTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${process.env.COMPANY_NAME || "Volmo Electrical"}" <${COMPANY_MAIL_FROM}>`,
        to: NOTIFICATION_EMAIL,
        subject,
        text: textContent,
        html: htmlContent,
      });
      console.log(`[Email Sent] Message ID: ${info.messageId} to ${NOTIFICATION_EMAIL}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("[Email Error]", error.message);
      return { success: false, error: error.message };
    }
  } else {
    console.log(`[Email Simulation] To: ${NOTIFICATION_EMAIL} | Subject: ${subject}`);
    return { success: true, simulated: true };
  }
}

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------

// Root Welcome / Health Discovery
app.get("/", (_req, res) => {
  res.json({
    service: "Volmo Electric Backend API",
    status: "online",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/login",
      leads: "/api/leads",
      config: "/api/config",
    },
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    emailConfigured: Boolean(process.env.SMTP_HOST),
    notificationRecipient: NOTIFICATION_EMAIL,
  });
});

// Auth Login
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body || {};
  const expectedPassword = process.env.ADMIN_PASSWORD || "1234";

  if (password === expectedPassword) {
    const token = `volmo_${Buffer.from(`${Date.now()}_admin`).toString("base64")}`;
    res.json({
      success: true,
      token,
      message: "Admin authentication successful",
    });
  } else {
    res.status(401).json({
      success: false,
      error: "Invalid admin password. Default is 1234 or your configured ADMIN_PASSWORD.",
    });
  }
});

// Inquiries / Leads (Customer Price Requests & Contact Form)
app.get("/api/leads/inquiries", (_req, res) => {
  res.json({
    success: true,
    data: inquiries,
    count: inquiries.length,
  });
});

app.post("/api/leads/inquiries", async (req, res) => {
  try {
    const { name, phone, email, city, model, notes, type } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: "Name and Phone are required." });
    }

    const newInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      phone,
      email: email || "",
      city: city || "",
      model: model || "General Inquiry",
      notes: notes || "",
      type: type || "price_quote",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    saveInquiries();

    // Trigger instant email notification to sales/admin
    const emailSubject = `⚡ New Customer Lead: ${name} (${model || "EV Scooter"})`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2563eb; margin-top: 0;">⚡ New Volmo Electric Inquiry</h2>
        <p>A new customer has requested information or a quotation:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px; border-bottom: 1px solid #eee;">Customer Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">City:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${city || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Model Interested:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${model || "General Inquiry"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Notes:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${notes || "None"}</td></tr>
        </table>
        <p style="font-size: 12px; color: #777;">Received via Volmo Electrical Website at ${newInquiry.createdAt}</p>
      </div>
    `;
    const emailText = `New Lead: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nModel: ${model}\nNotes: ${notes}`;

    sendNotificationEmail(emailSubject, emailHtml, emailText).catch((err) =>
      console.error("Async email dispatch error:", err)
    );

    res.status(201).json({
      success: true,
      message: "Inquiry received successfully! Our sales representative will contact you shortly.",
      data: newInquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dealership Applications
app.get("/api/leads/dealers", (_req, res) => {
  res.json({
    success: true,
    data: dealers,
    count: dealers.length,
  });
});

app.post("/api/leads/dealers", async (req, res) => {
  try {
    const { name, phone, email, city, state, experience, investmentCapacity, message } = req.body || {};
    if (!name || !phone || !city) {
      return res.status(400).json({ success: false, error: "Name, Phone, and City are required." });
    }

    const newDealer = {
      id: `dlr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      phone,
      email: email || "",
      city,
      state: state || "",
      experience: experience || "",
      investmentCapacity: investmentCapacity || "",
      message: message || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    dealers.unshift(newDealer);
    saveDealers();

    // Trigger instant email notification to dealership team
    const emailSubject = `🤝 New Dealership Franchise Application: ${name} (${city})`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #16a34a; margin-top: 0;">🤝 New Dealership Franchise Application</h2>
        <p>A new applicant has applied to become an authorized Volmo Electric dealer:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; font-weight: bold; width: 150px; border-bottom: 1px solid #eee;">Applicant Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">City / State:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${city} ${state ? `, ${state}` : ""}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Investment Capacity:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${investmentCapacity || "Not specified"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Prior Experience:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${experience || "N/A"}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Message:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message || "N/A"}</td></tr>
        </table>
        <p style="font-size: 12px; color: #777;">Received via Volmo Electrical Website at ${newDealer.createdAt}</p>
      </div>
    `;
    const emailText = `New Dealership Application: ${name}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nInvestment: ${investmentCapacity}`;

    sendNotificationEmail(emailSubject, emailHtml, emailText).catch((err) =>
      console.error("Async dealer email dispatch error:", err)
    );

    res.status(201).json({
      success: true,
      message: "Dealership application submitted successfully! Our franchise team will get in touch.",
      data: newDealer,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// CMS Configuration
app.get("/api/config", (_req, res) => {
  res.json({
    success: true,
    data: siteConfig,
  });
});

app.put("/api/config", (req, res) => {
  try {
    siteConfig = req.body;
    saveConfig();
    res.json({
      success: true,
      message: "Site configuration saved successfully",
      data: siteConfig,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`[Volmo Backend API] Server listening on http://${HOST}:${PORT} in ${NODE_ENV} mode`);
  console.log(`[Volmo Backend API] Notifications targeted to: ${NOTIFICATION_EMAIL}`);
  console.log(`[Volmo Backend API] Health check ready at http://${HOST}:${PORT}/api/health`);
});
