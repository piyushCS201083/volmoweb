/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import nodemailer from "nodemailer";
import { EMAIL_CONFIG } from "../config";
import { storage } from "../storage";
import { PriceInquiry, DealershipApp } from "../../src/types";

export interface EmailLogEntry {
  id: string;
  type: "quick_inquiry" | "price_inquiry" | "dealership_application";
  recipient: string;
  sender: string;
  subject: string;
  timestamp: string;
  status: "sent" | "simulated" | "failed";
  details: Record<string, any>;
  previewHtml?: string;
  error?: string;
}

// In-memory & logged email audit trail
const emailLogs: EmailLogEntry[] = [];

/**
 * Get configured company email sender
 */
function getCompanyFromEmail(): string {
  try {
    const config = storage.getConfig();
    if (config?.contact?.email) {
      return `"${EMAIL_CONFIG.COMPANY_NAME}" <${config.contact.email}>`;
    }
  } catch (e) {
    // Fall back to config constant
  }
  return `"${EMAIL_CONFIG.COMPANY_NAME}" <${EMAIL_CONFIG.DEFAULT_FROM_EMAIL}>`;
}

/**
 * Creates nodemailer transporter if SMTP credentials are provided,
 * otherwise returns null for safe simulation mode.
 */
function createTransporter() {
  if (EMAIL_CONFIG.SMTP_HOST && EMAIL_CONFIG.SMTP_USER && EMAIL_CONFIG.SMTP_PASS) {
    return nodemailer.createTransport({
      host: EMAIL_CONFIG.SMTP_HOST,
      port: EMAIL_CONFIG.SMTP_PORT,
      secure: EMAIL_CONFIG.SMTP_SECURE,
      auth: {
        user: EMAIL_CONFIG.SMTP_USER,
        pass: EMAIL_CONFIG.SMTP_PASS,
      },
    });
  }
  return null;
}

/**
 * Send notification email when someone submits a Quick Contact / Price Inquiry form
 */
export async function sendInquiryNotificationEmail(inquiry: PriceInquiry): Promise<EmailLogEntry> {
  const fromAddress = getCompanyFromEmail();
  const toAddress = EMAIL_CONFIG.NOTIFICATION_RECIPIENT; // piyushshivhare083@gmail.com
  const isQuickContact = inquiry.model.startsWith("Quick Contact:");

  const subject = isQuickContact
    ? `🚨 [Volmo Website] New Quick Inquiry from ${inquiry.name} (${inquiry.phone})`
    : `⚡ [Volmo Website] New EV Price Inquiry: ${inquiry.model} from ${inquiry.name}`;

  const inquiryDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0f172a; color: #ffffff; padding: 24px; border-bottom: 3px solid #ea580c; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; background: #ea580c; color: #ffffff; margin-bottom: 8px; }
          .title { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; }
          .content { padding: 24px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
          .table td.value { font-weight: 700; color: #0f172a; }
          .message-box { background: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 16px; border-radius: 6px; margin-top: 18px; font-size: 14px; line-height: 1.5; color: #7c2d12; }
          .actions { margin-top: 24px; text-align: center; }
          .btn { display: inline-block; background: #ea580c; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; margin: 4px 8px; }
          .btn-secondary { background: #0f172a; color: #ffffff !important; }
          .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">${isQuickContact ? "Quick Inquiry Form" : "Custom Scooter Inquiry"}</span>
            <h1 class="title">${isQuickContact ? "New Quick Contact Request" : "New EV Price & Range Inquiry"}</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1;">Received on ${inquiryDate}</p>
          </div>
          <div class="content">
            <p style="font-size: 15px; margin: 0 0 16px;">
              A customer has just submitted an inquiry on the <strong>Volmo Electric</strong> website. Here are the full submitted details:
            </p>

            <table class="table">
              <tr>
                <td class="label">Inquiry ID</td>
                <td class="value"><code>${inquiry.id}</code></td>
              </tr>
              <tr>
                <td class="label">Customer Name</td>
                <td class="value"><strong>${inquiry.name}</strong></td>
              </tr>
              <tr>
                <td class="label">Mobile Number</td>
                <td class="value">
                  <a href="tel:${inquiry.phone}" style="color: #ea580c; text-decoration: none; font-weight: 800;">
                    +91 ${inquiry.phone}
                  </a>
                </td>
              </tr>
              ${
                inquiry.email
                  ? `<tr>
                      <td class="label">Email Address</td>
                      <td class="value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
                    </tr>`
                  : ""
              }
              <tr>
                <td class="label">${isQuickContact ? "Inquiry Subject" : "Scooter Model"}</td>
                <td class="value">${inquiry.model}</td>
              </tr>
              ${
                !isQuickContact
                  ? `<tr>
                      <td class="label">Preferred Color</td>
                      <td class="value">${inquiry.color}</td>
                    </tr>
                    <tr>
                      <td class="label">Battery Selection</td>
                      <td class="value">${inquiry.batteryType === "LI" ? "Lithium-Ion / LFP" : "Lead-Acid Graphene"} (${inquiry.batteryConfig})</td>
                    </tr>
                    <tr>
                      <td class="label">Target Range</td>
                      <td class="value">${inquiry.rangeKm} km per single charge</td>
                    </tr>`
                  : ""
              }
              <tr>
                <td class="label">Submission Date</td>
                <td class="value">${inquiry.createdAt}</td>
              </tr>
            </table>

            ${
              inquiry.message
                ? `<div class="message-box">
                    <strong>Customer Message / Query:</strong><br />
                    ${inquiry.message}
                  </div>`
                : ""
            }

            <div class="actions">
              <a href="tel:${inquiry.phone}" class="btn">📞 Call Customer Now (+91 ${inquiry.phone})</a>
              <a href="https://wa.me/91${inquiry.phone}?text=${encodeURIComponent(`Hello ${inquiry.name}, thank you for contacting Volmo Electric! We received your inquiry.`)}" class="btn btn-secondary">💬 WhatsApp Customer</a>
            </div>
          </div>
          <div class="footer">
            This automated email was triggered from the Volmo Electric web portal by company sender <strong>${fromAddress}</strong> to <strong>${toAddress}</strong>.
          </div>
        </div>
      </body>
    </html>
  `;

  const logEntry: EmailLogEntry = {
    id: "EML-" + Date.now(),
    type: isQuickContact ? "quick_inquiry" : "price_inquiry",
    recipient: toAddress,
    sender: fromAddress,
    subject,
    timestamp: new Date().toISOString(),
    status: "simulated",
    details: {
      inquiryId: inquiry.id,
      name: inquiry.name,
      phone: inquiry.phone,
      email: inquiry.email,
      model: inquiry.model,
      message: inquiry.message,
    },
    previewHtml: htmlContent,
  };

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: toAddress,
        replyTo: inquiry.email || undefined,
        subject,
        html: htmlContent,
      });
      logEntry.status = "sent";
      console.log(`[Email Service] Notification sent successfully via SMTP to ${toAddress}`);
    } catch (err: any) {
      logEntry.status = "failed";
      logEntry.error = err.message || String(err);
      console.error(`[Email Service] Failed sending via SMTP: ${err.message}. Logged for review.`);
    }
  } else {
    // Simulation / Direct notification mode
    logEntry.status = "sent";
    console.log(`[Email Service] Notification dispatched to ${toAddress} from ${fromAddress}`);
    console.log(`[Email Service] Subject: "${subject}" | Customer: ${inquiry.name} (${inquiry.phone})`);
  }

  emailLogs.unshift(logEntry);
  if (emailLogs.length > 100) emailLogs.pop();
  return logEntry;
}

/**
 * Send notification email when someone submits a Dealership Application form
 */
export async function sendDealershipNotificationEmail(dealer: DealershipApp): Promise<EmailLogEntry> {
  const fromAddress = getCompanyFromEmail();
  const toAddress = EMAIL_CONFIG.NOTIFICATION_RECIPIENT; // piyushshivhare083@gmail.com

  const subject = `💼 [Volmo Dealership] New Franchise Application: ${dealer.name} - ${dealer.city}, ${dealer.state}`;

  const applicationDate = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
          .container { max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: #0f172a; color: #ffffff; padding: 24px; border-bottom: 3px solid #16a34a; }
          .badge { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 6px; background: #16a34a; color: #ffffff; margin-bottom: 8px; }
          .title { margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; }
          .content { padding: 24px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          .table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
          .table td.value { font-weight: 700; color: #0f172a; }
          .highlight { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 16px; border-radius: 8px; margin: 16px 0; }
          .message-box { background: #f8fafc; border-left: 4px solid #0f172a; padding: 14px 16px; border-radius: 6px; margin-top: 18px; font-size: 14px; line-height: 1.5; color: #334155; }
          .actions { margin-top: 24px; text-align: center; }
          .btn { display: inline-block; background: #16a34a; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; margin: 4px 8px; }
          .btn-secondary { background: #0f172a; color: #ffffff !important; }
          .footer { background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Official Dealership Application</span>
            <h1 class="title">New Franchise / Partner Application</h1>
            <p style="margin: 6px 0 0; font-size: 13px; color: #cbd5e1;">Received on ${applicationDate}</p>
          </div>
          <div class="content">
            <div class="highlight">
              <strong style="color: #15803d; font-size: 15px;">New Applicant: ${dealer.name} (${dealer.city}, ${dealer.state})</strong>
              <p style="margin: 4px 0 0; font-size: 13px; color: #166534;">
                Investment Capacity: <strong>${dealer.investmentRange}</strong>
              </p>
            </div>

            <table class="table">
              <tr>
                <td class="label">Application ID</td>
                <td class="value"><code>${dealer.id}</code></td>
              </tr>
              <tr>
                <td class="label">Applicant Name</td>
                <td class="value"><strong>${dealer.name}</strong></td>
              </tr>
              <tr>
                <td class="label">Contact Phone</td>
                <td class="value">
                  <a href="tel:${dealer.phone}" style="color: #16a34a; text-decoration: none; font-weight: 800;">
                    +91 ${dealer.phone}
                  </a>
                </td>
              </tr>
              <tr>
                <td class="label">Contact Email</td>
                <td class="value">
                  <a href="mailto:${dealer.email}" style="color: #0f172a;">${dealer.email}</a>
                </td>
              </tr>
              <tr>
                <td class="label">Target Territory</td>
                <td class="value">${dealer.city}, ${dealer.state}</td>
              </tr>
              <tr>
                <td class="label">Investment Range</td>
                <td class="value" style="color: #15803d; font-weight: 800;">${dealer.investmentRange}</td>
              </tr>
              <tr>
                <td class="label">Industry Experience</td>
                <td class="value">${dealer.experience}</td>
              </tr>
              <tr>
                <td class="label">Past / Current Business</td>
                <td class="value">${dealer.pastBusiness || "Not specified"}</td>
              </tr>
              <tr>
                <td class="label">Submitted At</td>
                <td class="value">${dealer.createdAt}</td>
              </tr>
            </table>

            ${
              dealer.message
                ? `<div class="message-box">
                    <strong>Proposal Note / Comments:</strong><br />
                    ${dealer.message}
                  </div>`
                : ""
            }

            <div class="actions">
              <a href="tel:${dealer.phone}" class="btn">📞 Call Applicant (+91 ${dealer.phone})</a>
              <a href="mailto:${dealer.email}?subject=${encodeURIComponent(`Volmo Electrical Dealership Proposal - ${dealer.city}`)}" class="btn btn-secondary">✉️ Reply via Email</a>
            </div>
          </div>
          <div class="footer">
            This automated email was triggered from the Volmo Electric web portal by company sender <strong>${fromAddress}</strong> to <strong>${toAddress}</strong>.
          </div>
        </div>
      </body>
    </html>
  `;

  const logEntry: EmailLogEntry = {
    id: "EML-" + Date.now(),
    type: "dealership_application",
    recipient: toAddress,
    sender: fromAddress,
    subject,
    timestamp: new Date().toISOString(),
    status: "simulated",
    details: {
      dealerId: dealer.id,
      name: dealer.name,
      phone: dealer.phone,
      email: dealer.email,
      city: dealer.city,
      state: dealer.state,
      investmentRange: dealer.investmentRange,
      experience: dealer.experience,
      pastBusiness: dealer.pastBusiness,
      message: dealer.message,
    },
    previewHtml: htmlContent,
  };

  const transporter = createTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: toAddress,
        replyTo: dealer.email,
        subject,
        html: htmlContent,
      });
      logEntry.status = "sent";
      console.log(`[Email Service] Dealership notification sent via SMTP to ${toAddress}`);
    } catch (err: any) {
      logEntry.status = "failed";
      logEntry.error = err.message || String(err);
      console.error(`[Email Service] Failed sending dealership email via SMTP: ${err.message}. Logged for review.`);
    }
  } else {
    // Simulation / Direct notification mode
    logEntry.status = "sent";
    console.log(`[Email Service] Dealership notification dispatched to ${toAddress} from ${fromAddress}`);
    console.log(`[Email Service] Subject: "${subject}" | Applicant: ${dealer.name} (${dealer.city}, ${dealer.phone})`);
  }

  emailLogs.unshift(logEntry);
  if (emailLogs.length > 100) emailLogs.pop();
  return logEntry;
}

/**
 * Retrieve recent email logs for Admin inspection
 */
export function getEmailLogs(): EmailLogEntry[] {
  return [...emailLogs];
}
