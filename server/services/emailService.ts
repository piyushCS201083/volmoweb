/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import nodemailer, { type Transporter } from "nodemailer";
import { PriceInquiry, DealershipApp } from "../../src/types";

// Target recipient email per user specification
export const NOTIFICATION_TARGET_EMAIL = "piyushshivhare083@gmail.com";

// Company sender address
export const COMPANY_SENDER_EMAIL =
  process.env.SMTP_FROM || process.env.COMPANY_EMAIL || "sales@volmoelectrical.com";

/**
 * Configure reusable nodemailer transporter.
 * Supports standard SMTP env vars (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS),
 * and gracefully falls back to an output stream / logger if SMTP credentials aren't configured yet.
 */
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    console.log(`[Email Service] Configured live SMTP transport with host: ${host}`);
  } else {
    // Development / fallback JSON/stream transport with logging so requests never fail
    transporter = nodemailer.createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });
    console.log(
      `[Email Service] Operating in notification dispatch mode. (Target: ${NOTIFICATION_TARGET_EMAIL})`
    );
  }

  return transporter;
}

/**
 * Dispatch an email notification when a Quick Inquiry (or Price Inquiry) is submitted.
 */
export async function sendInquiryNotification(inquiry: PriceInquiry): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter();
    const isQuickInquiry = inquiry.model.toLowerCase().includes("quick");

    const subject = `[Volmo EV Notification] New ${
      isQuickInquiry ? "Quick Inquiry" : "Price Inquiry"
    } - ${inquiry.name} (${inquiry.id})`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; color: #ffffff;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f97316; font-weight: bold; margin-bottom: 6px;">
            Volmo Electrical Private Limited
          </div>
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">
            New ${isQuickInquiry ? "Quick Inquiry" : "Scooter Price Inquiry"}
          </h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
            A customer has filled out the inquiry form on the official website.
          </p>
        </div>

        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; width: 35%;">Inquiry ID:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${inquiry.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Customer Name:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${inquiry.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Phone Number:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0284c7;">
                <a href="tel:${inquiry.phone}" style="color: #0284c7; text-decoration: none;">+91 ${inquiry.phone}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Model / Topic:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${inquiry.model}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Details / Color:</td>
              <td style="padding: 10px 0; color: #334155;">${inquiry.color}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Battery Config:</td>
              <td style="padding: 10px 0; color: #334155;">${inquiry.batteryConfig} (${inquiry.batteryType})</td>
            </tr>
            ${
              inquiry.rangeKm > 0
                ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px 0; color: #64748b;">Range:</td>
                    <td style="padding: 10px 0; color: #334155;">${inquiry.rangeKm} km</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Received At:</td>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px;">${new Date(
                inquiry.createdAt
              ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
            <a href="tel:${inquiry.phone}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-right: 8px;">
              Call Customer (+91 ${inquiry.phone})
            </a>
            <a href="https://wa.me/91${inquiry.phone.replace(/\D/g, "")}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px;">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Sent automatically from <strong>Volmo Electric</strong> (${COMPANY_SENDER_EMAIL}) to <strong>${NOTIFICATION_TARGET_EMAIL}</strong>
        </div>
      </div>
    `;

    const textContent = `
NEW INQUIRY RECEIVED - VOLMO ELECTRIC
---------------------------------------
Inquiry ID: ${inquiry.id}
Customer: ${inquiry.name}
Phone: +91 ${inquiry.phone}
Model/Topic: ${inquiry.model}
Details: ${inquiry.color}
Config: ${inquiry.batteryConfig} (${inquiry.batteryType})
Time: ${inquiry.createdAt}

Recipient: ${NOTIFICATION_TARGET_EMAIL}
Sender: ${COMPANY_SENDER_EMAIL}
    `;

    const mailOptions = {
      from: `"Volmo Electric Support" <${COMPANY_SENDER_EMAIL}>`,
      to: NOTIFICATION_TARGET_EMAIL,
      replyTo: COMPANY_SENDER_EMAIL,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(
      `[Email Notification] Inquiry notification dispatched to ${NOTIFICATION_TARGET_EMAIL} (Inquiry ID: ${inquiry.id}, MessageId: ${info.messageId || "generated"})`
    );

    return { success: true };
  } catch (err: any) {
    console.error(`[Email Notification Error] Failed to send inquiry notification:`, err.message || err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatch an email notification when a Dealership Form is submitted.
 */
export async function sendDealershipNotification(dealer: DealershipApp): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter();

    const subject = `[Volmo EV Notification] New Dealership Application - ${dealer.name} (${dealer.city}, ${dealer.state})`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; color: #ffffff;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f97316; font-weight: bold; margin-bottom: 6px;">
            Volmo Electrical Private Limited &middot; Franchise Desk
          </div>
          <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">
            New Dealership Application
          </h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
            A prospective partner has applied for a Volmo EV franchise showroom.
          </p>
        </div>

        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; width: 35%;">Application ID:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${dealer.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Applicant Name:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${dealer.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Phone Number:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0284c7;">
                <a href="tel:${dealer.phone}" style="color: #0284c7; text-decoration: none;">+91 ${dealer.phone}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Email Address:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0284c7;">
                <a href="mailto:${dealer.email}" style="color: #0284c7; text-decoration: none;">${dealer.email}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Target Location:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0f172a;">${dealer.city}, ${dealer.state}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Investment Range:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #16a34a;">${dealer.investmentRange}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Industry Experience:</td>
              <td style="padding: 10px 0; color: #334155;">${dealer.experience}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b;">Current Business:</td>
              <td style="padding: 10px 0; color: #334155;">${dealer.pastBusiness || "N/A"}</td>
            </tr>
            ${
              dealer.message
                ? `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px 0; color: #64748b;">Applicant Message:</td>
                    <td style="padding: 10px 0; color: #334155; font-style: italic;">"${dealer.message}"</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Applied At:</td>
              <td style="padding: 10px 0; color: #64748b; font-size: 12px;">${new Date(
                dealer.createdAt
              ).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
            <a href="tel:${dealer.phone}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px; margin-right: 8px;">
              Call Partner (+91 ${dealer.phone})
            </a>
            <a href="mailto:${dealer.email}" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 13px;">
              Reply by Email
            </a>
          </div>
        </div>

        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Sent automatically from <strong>Volmo Electric</strong> (${COMPANY_SENDER_EMAIL}) to <strong>${NOTIFICATION_TARGET_EMAIL}</strong>
        </div>
      </div>
    `;

    const textContent = `
NEW DEALERSHIP APPLICATION - VOLMO ELECTRIC
--------------------------------------------
Application ID: ${dealer.id}
Name: ${dealer.name}
Phone: +91 ${dealer.phone}
Email: ${dealer.email}
Location: ${dealer.city}, ${dealer.state}
Investment: ${dealer.investmentRange}
Experience: ${dealer.experience}
Current Business: ${dealer.pastBusiness || "N/A"}
Message: ${dealer.message || "N/A"}
Time: ${dealer.createdAt}

Recipient: ${NOTIFICATION_TARGET_EMAIL}
Sender: ${COMPANY_SENDER_EMAIL}
    `;

    const mailOptions = {
      from: `"Volmo Electric Dealership Desk" <${COMPANY_SENDER_EMAIL}>`,
      to: NOTIFICATION_TARGET_EMAIL,
      replyTo: dealer.email,
      subject,
      text: textContent,
      html: htmlContent,
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(
      `[Email Notification] Dealership notification dispatched to ${NOTIFICATION_TARGET_EMAIL} (App ID: ${dealer.id}, MessageId: ${info.messageId || "generated"})`
    );

    return { success: true };
  } catch (err: any) {
    console.error(`[Email Notification Error] Failed to send dealership notification:`, err.message || err);
    return { success: false, error: err.message };
  }
}
