/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PriceInquiry, DealershipApp } from "../types";

// Live Render backend URL
export const RENDER_BACKEND_URL = "https://volmoweb-2.onrender.com";

// Base API URL: In browser environments, always use relative URLs ("") so requests hit the current server (/api/*)
export const API_BASE_URL = typeof window !== "undefined" ? "" : RENDER_BACKEND_URL;

function getClientSideChatbotFallback(userMessage: string): string {
  const q = (userMessage || "").toLowerCase();

  if (q.includes("rto") || q.includes("license") || q.includes("registration") || q.includes("challan") || q.includes("helmet")) {
    return [
      "**No driving license or RTO registration is required** for Volmo electric scooters!",
      "",
      "* **CMVR Exemption:** Under Central Motor Vehicles Rules (India), electric 2-wheelers with motor power **≤ 250W** and top speed **≤ 25 km/h** are 100% exempt from RTO registration, road tax, and driving license requirements.",
      "* **Who Can Ride:** Ideal for students, daily commuters, homemakers, and senior citizens.",
      "* **Safety Recommendation:** We strongly recommend wearing a standard safety helmet for every ride.",
    ].join("\n");
  }

  if (q.includes("compare") || (q.includes("graphene") && q.includes("lithium")) || q.includes("vs")) {
    return [
      "Here is how **Lead-Acid Graphene** compares with **Lithium-Ion (LFP)** battery packs:",
      "",
      "* **Lead-Acid Graphene (48V / 60V / 72V 28Ah):**",
      "  - **Warranty:** 1-Year Factory Warranty",
      "  - **Range:** 55 km to 85 km per charge",
      "  - **Best For:** Budget-conscious riders seeking rugged, heavy-duty thermal stability",
      "* **Lithium-Ion LFP (60V 24Ah up to 72V 60Ah):**",
      "  - **Warranty:** 3-Year Comprehensive Warranty",
      "  - **Range:** 60 km up to **160 km** per charge",
      "  - **Best For:** Long-range riders wanting 3x cycle life, lightweight handling, and Smart BMS cell balancing",
    ].join("\n");
  }

  if (q.includes("72v") || q.includes("60ah") || q.includes("range") || q.includes("mileage") || q.includes("km")) {
    return [
      "**Volmo Certified Range & Battery Configurations:**",
      "",
      "* **60V 24Ah / 28Ah Pack:** 55 – 65 km real-world range",
      "* **60V 30Ah / 34Ah Pack:** 70 – 90 km real-world range",
      "* **72V 30Ah / 42Ah Pack:** 80 – 115 km real-world range",
      "* **72V 60Ah Ultra-Range LFP Pack:** **140 – 160 km** per single charge with active Smart BMS thermal protection and 3-year warranty.",
    ].join("\n");
  }

  if (q.includes("69v") || q.includes("charger") || q.includes("cutoff") || q.includes("charging")) {
    return [
      "**Why the 69.0V Precision Cutoff Charger is Essential:**",
      "",
      "* **Zero-Overshoot Protection:** LFP (Lithium Iron Phosphate) cells reach full charge at **3.65V per cell** (69.0V for a 19S/60V nominal LFP architecture). Exceeding this voltage causes cell swelling and BMS lockouts.",
      "* **6-Stage CCCV Charging:** Our German-technology MOSFET charger automatically transitions from Constant Current to Constant Voltage and shuts off completely at **69.0V**.",
      "* **Thermal & Surge Safety:** Built-in reverse-polarity, short-circuit, and auto-cooldown fan protection.",
    ].join("\n");
  }

  if (q.includes("cost") || q.includes("petrol") || q.includes("saving") || q.includes("expense") || q.includes("electricity")) {
    return [
      "**Running Cost: Volmo EV vs. Petrol Scooter**",
      "",
      "* **Volmo Electric Scooter:** Only **₹0.15 to ₹0.20 per km** (approx. 1.5 – 2 units of electricity per full charge).",
      "* **Conventional Petrol Scooter:** **₹2.50 to ₹3.00+ per km** at current fuel prices.",
      "* **Annual Savings:** Riding 40 km daily saves over **₹32,000 – ₹40,000 every year**, with zero engine oil changes or clutch maintenance!",
    ].join("\n");
  }

  if (q.includes("phantom") || q.includes("vista") || q.includes("glider") || q.includes("classic") || q.includes("pulse") || q.includes("model") || q.includes("scooter")) {
    return [
      "**Volmo Electric Scooter Fleet (All 100% RTO-Free):**",
      "",
      "* **Volmo Phantom:** Aggressive sport styling, twin angular LED headlamps, high-torque BLDC hub motor tuned for flyovers and steep inclines, dual disc brakes.",
      "* **Volmo Vista:** Aerodynamic daily city commuter with nimble handling and dual front storage pockets.",
      "* **Volmo Glider:** Extended wheelbase family cruiser with dual hydraulic rear suspension and contoured comfort seat.",
      "* **Volmo Classic:** Timeless retro styling with chrome accents, reinforced tubular frame, and wide legroom.",
      "* **Volmo Pulse:** Bold dual-tone youth commuter with instant throttle response and USB mobile charging.",
    ].join("\n");
  }

  return [
    "Welcome to **Volmo Electrical Pvt Ltd**! Here are key highlights of our electric mobility lineup:",
    "",
    "* **5 RTO-Free Scooter Models:** Vista, Glider, Classic, Phantom, and Pulse (No license or registration required).",
    "* **Custom Battery Options:** Choose between **Lead-Acid Graphene** (1-Year Warranty) and **Lithium-Ion LFP** up to **72V 60Ah** (140–160 km range, 3-Year Warranty).",
    "* **Ultra-Low Running Cost:** Just **15–20 paise per km** with German-tech 69.0V precision smart chargers.",
    "",
    "Ask me about **models, battery range, charging technology, RTO rules, or dealership applications**!",
  ].join("\n");
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("volmo_auth_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new ApiError(data?.error || `Request failed with status ${res.status}`, res.status);
    }

    return data as T;
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || "Network request failed", 0);
  }
}

export const api = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================
  auth: {
    async login(password: string): Promise<{ success: boolean; token?: string; message?: string }> {
      const res = await request<{ success: boolean; token: string; message: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      if (res.token) {
        localStorage.setItem("volmo_auth_token", res.token);
      }
      return res;
    },

    async verifySecurityQuestion(
      questionId: string,
      answer: string
    ): Promise<{ verified: boolean; message: string }> {
      return request<{ verified: boolean; message: string }>("/api/auth/verify-security", {
        method: "POST",
        body: JSON.stringify({ questionId, answer }),
      });
    },

    async resetPassword(
      questionId: string,
      answer: string,
      newPassword: string
    ): Promise<{ success: boolean; token?: string; message: string }> {
      const res = await request<{ success: boolean; token: string; message: string }>(
        "/api/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ questionId, answer, newPassword }),
        }
      );
      if (res.token) {
        localStorage.setItem("volmo_auth_token", res.token);
      }
      return res;
    },

    async changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<{ success: boolean; message: string }> {
      return request<{ success: boolean; message: string }>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },

    logout(): void {
      localStorage.removeItem("volmo_auth_token");
    },
  },

  // ==========================================
  // LEADS (INQUIRIES & DEALERSHIP APPLICATIONS)
  // ==========================================
  leads: {
    async getInquiries(params?: { status?: string; search?: string }): Promise<PriceInquiry[]> {
      const query = new URLSearchParams();
      if (params?.status && params.status !== "all") query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      const qs = query.toString() ? `?${query.toString()}` : "";

      const res = await request<{ success: boolean; count: number; data: PriceInquiry[] }>(
        `/api/leads/inquiries${qs}`
      );
      return res.data;
    },

    async submitInquiry(inquiry: Omit<PriceInquiry, "id" | "createdAt" | "status">): Promise<PriceInquiry> {
      const res = await request<{ success: boolean; message: string; data: PriceInquiry }>(
        "/api/leads/inquiries",
        {
          method: "POST",
          body: JSON.stringify(inquiry),
        }
      );
      return res.data;
    },

    async updateInquiryStatus(id: string, status: "new" | "contacted" | "completed"): Promise<PriceInquiry> {
      const res = await request<{ success: boolean; message: string; data: PriceInquiry }>(
        `/api/leads/inquiries/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );
      return res.data;
    },

    async deleteInquiry(id: string): Promise<boolean> {
      await request<{ success: boolean; message: string }>(`/api/leads/inquiries/${id}`, {
        method: "DELETE",
      });
      return true;
    },

    async getDealers(params?: { status?: string; search?: string }): Promise<DealershipApp[]> {
      const query = new URLSearchParams();
      if (params?.status && params.status !== "all") query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      const qs = query.toString() ? `?${query.toString()}` : "";

      const res = await request<{ success: boolean; count: number; data: DealershipApp[] }>(
        `/api/leads/dealers${qs}`
      );
      return res.data;
    },

    async submitDealer(dealer: Omit<DealershipApp, "id" | "createdAt" | "status">): Promise<DealershipApp> {
      const res = await request<{ success: boolean; message: string; data: DealershipApp }>(
        "/api/leads/dealers",
        {
          method: "POST",
          body: JSON.stringify(dealer),
        }
      );
      return res.data;
    },

    async updateDealerStatus(
      id: string,
      status: "applied" | "reviewing" | "approved" | "rejected"
    ): Promise<DealershipApp> {
      const res = await request<{ success: boolean; message: string; data: DealershipApp }>(
        `/api/leads/dealers/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );
      return res.data;
    },

    async deleteDealer(id: string): Promise<boolean> {
      await request<{ success: boolean; message: string }>(`/api/leads/dealers/${id}`, {
        method: "DELETE",
      });
      return true;
    },
  },

  // ==========================================
  // CMS CONFIGURATION
  // ==========================================
  config: {
    async getConfig(): Promise<any> {
      const res = await request<{ success: boolean; data: any }>("/api/config");
      return res.data;
    },

    async saveConfig(data: any): Promise<any> {
      const res = await request<{ success: boolean; message: string; data: any }>("/api/config", {
        method: "PUT",
        body: JSON.stringify(data),
      });
      return res.data;
    },

    async updateSection(section: string, data: any): Promise<any> {
      const res = await request<{ success: boolean; message: string; data: any }>(
        `/api/config/${section}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
        }
      );
      return res.data;
    },

    async resetConfig(): Promise<any> {
      const res = await request<{ success: boolean; message: string; data: any }>("/api/config/reset", {
        method: "POST",
      });
      return res.data;
    },
  },

  // ==========================================
  // HEALTH CHECK
  // ==========================================
  health: {
    async check(): Promise<{ status: string; uptime: number; service: string }> {
      return request<{ status: string; uptime: number; service: string }>("/api/health");
    },
  },

  // ==========================================
  // AI CHATBOT (GEMINI MULTI-TURN FAQ & TECH)
  // ==========================================
  chatbot: {
    async sendChat(
      messages: Array<{ role: "user" | "model" | "assistant"; content: string }>,
      model: "gemini-3.1-flash-lite" | "gemini-3.8-flash" = "gemini-3.1-flash-lite"
    ): Promise<{ success: boolean; model: string; reply: string }> {
      try {
        return await request<{ success: boolean; model: string; reply: string }>("/api/chatbot/chat", {
          method: "POST",
          body: JSON.stringify({ messages, model }),
        });
      } catch {
        const lastMsg = messages[messages.length - 1]?.content || "";
        return {
          success: true,
          model,
          reply: getClientSideChatbotFallback(lastMsg),
        };
      }
    },
  },

  // ==========================================
  // IMAGE & ASSET UPLOAD
  // ==========================================
  upload: {
    async uploadImage(
      image: string,
      filename?: string
    ): Promise<{ success: boolean; url: string; filename: string; size?: number }> {
      return request<{ success: boolean; url: string; filename: string; size?: number }>("/api/upload/image", {
        method: "POST",
        body: JSON.stringify({ image, filename }),
      });
    },

    async uploadBatch(
      images: Array<{ image: string; filename?: string; id?: string | number }>
    ): Promise<{
      success: boolean;
      results: Array<{ success: boolean; originalId?: string | number; url?: string; filename?: string; error?: string }>;
    }> {
      return request<{
        success: boolean;
        results: Array<{ success: boolean; originalId?: string | number; url?: string; filename?: string; error?: string }>;
      }>("/api/upload/batch", {
        method: "POST",
        body: JSON.stringify({ images }),
      });
    },
  },

  // ==========================================
  // CLOUDINARY CLOUD DATABASE & ASSET SERVICE
  // ==========================================
  cloudinary: {
    async getStatus(): Promise<{
      success: boolean;
      cloudName: string;
      hasApiKey: boolean;
      error?: string;
    }> {
      return request<{
        success: boolean;
        cloudName: string;
        hasApiKey: boolean;
        error?: string;
      }>("/api/cloudinary/status");
    },

    async uploadImage(
      image: string,
      folder?: string,
      publicId?: string
    ): Promise<{
      success: boolean;
      url: string;
      secureUrl: string;
      publicId: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
      error?: string;
    }> {
      return request<{
        success: boolean;
        url: string;
        secureUrl: string;
        publicId: string;
        format: string;
        width: number;
        height: number;
        bytes: number;
        error?: string;
      }>("/api/cloudinary/upload", {
        method: "POST",
        body: JSON.stringify({ image, folder, publicId }),
      });
    },

    async syncAllToCloud(): Promise<{
      success: boolean;
      message: string;
      cloudName: string;
      configUrl?: string;
      inquiriesUrl?: string;
      dealersUrl?: string;
      inquiriesCount?: number;
      dealersCount?: number;
      individualUploaded?: number;
      error?: string;
    }> {
      return request<{
        success: boolean;
        message: string;
        cloudName: string;
        configUrl?: string;
        inquiriesUrl?: string;
        dealersUrl?: string;
        inquiriesCount?: number;
        dealersCount?: number;
        individualUploaded?: number;
        error?: string;
      }>("/api/cloudinary/sync-all-to-cloud", {
        method: "POST",
      });
    },

    async syncLocalImages(): Promise<{
      success: boolean;
      count: number;
      migrated: Array<{ localName: string; localPath: string; cloudUrl: string; publicId: string }>;
    }> {
      return request<{
        success: boolean;
        count: number;
        migrated: Array<{ localName: string; localPath: string; cloudUrl: string; publicId: string }>;
      }>("/api/cloudinary/sync-local-images", {
        method: "POST",
      });
    },

    async listImages(folder = "volmo_assets"): Promise<{
      success: boolean;
      images: Array<{
        publicId: string;
        url: string;
        bytes: number;
        format: string;
        createdAt: string;
      }>;
    }> {
      return request<{
        success: boolean;
        images: Array<{
          publicId: string;
          url: string;
          bytes: number;
          format: string;
          createdAt: string;
        }>;
      }>(`/api/cloudinary/images?folder=${encodeURIComponent(folder)}`);
    },

    async getCloudDb(type: "all" | "inquiries" | "dealers" | "config" = "all"): Promise<{
      success: boolean;
      data: any;
    }> {
      return request<{ success: boolean; data: any }>(
        `/api/cloudinary/cloud-db?type=${encodeURIComponent(type)}`
      );
    },
  },

  getBaseUrl(): string {
    return API_BASE_URL;
  },
};
