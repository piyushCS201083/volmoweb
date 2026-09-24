/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PriceInquiry, DealershipApp } from "../types";

// Deployed server URL on Render
export const RENDER_BACKEND_URL = "https://volmoweb-1.onrender.com";

// Base API URL supports standalone frontend deployment via VITE_API_URL or defaults to the deployed Render server
export const API_BASE_URL = (
  ((import.meta as any).env?.VITE_API_URL as string) ||
  RENDER_BACKEND_URL
).replace(/\/$/, "");

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
      model: "gemini-3.5-flash" | "gemini-3.1-flash-lite" | "gemini-3.8-flash" = "gemini-3.5-flash"
    ): Promise<{ success: boolean; model: string; reply: string }> {
      return request<{ success: boolean; model: string; reply: string }>("/api/chatbot/chat", {
        method: "POST",
        body: JSON.stringify({ messages, model }),
      });
    },
  },

  getBaseUrl(): string {
    return API_BASE_URL;
  },
};
