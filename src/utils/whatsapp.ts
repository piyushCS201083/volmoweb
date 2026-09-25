/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const VOLMO_WHATSAPP_NUMBER = "9009156696";
export const VOLMO_WHATSAPP_DISPLAY = "+91 9009156696";
export const VOLMO_WHATSAPP_INTL = "919009156696";

/**
 * Builds the official universal WhatsApp link with an encoded message.
 */
export function getWhatsAppUrl(message: string = ""): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return `https://wa.me/${VOLMO_WHATSAPP_INTL}`;
  }
  return `https://wa.me/${VOLMO_WHATSAPP_INTL}?text=${encodeURIComponent(trimmed)}`;
}

/**
 * Opens WhatsApp in a new tab/window with the given message.
 */
export function openWhatsApp(message: string = ""): void {
  const url = getWhatsAppUrl(message);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
