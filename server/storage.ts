/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { SERVER_CONFIG } from "./config";
import {
  MODELS_DATA,
  PULSE_DATA,
  COMMON_FEATURES,
  CONTACT_INFO,
  DEFAULT_HERO_CONFIG,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_SHOWROOMS,
  DEFAULT_BRANDING,
  DEFAULT_SITE_SECTIONS,
  DEFAULT_ACCESSORIES,
  LEAD_ACID_GRAPHENE_BATTERIES,
  LITHIUM_LFP_BATTERY_MODELS,
  CHARGER_MODELS,
  DEFAULT_ACCESSORIES_PAGE_CONFIG,
  DEFAULT_BATTERY_CHARGER_PAGE_CONFIG,
} from "../src/data";
import { PriceInquiry, DealershipApp } from "../src/types";

// Ensure data directory exists
if (!fs.existsSync(SERVER_CONFIG.DATA_DIR)) {
  fs.mkdirSync(SERVER_CONFIG.DATA_DIR, { recursive: true });
}

const CONFIG_FILE = path.join(SERVER_CONFIG.DATA_DIR, "site-config.json");
const LEADS_FILE = path.join(SERVER_CONFIG.DATA_DIR, "leads.json");
const AUTH_FILE = path.join(SERVER_CONFIG.DATA_DIR, "auth.json");

// Default Auth
interface AuthData {
  adminPassword: string;
  sessions: string[];
}

const DEFAULT_AUTH: AuthData = {
  adminPassword: SERVER_CONFIG.DEFAULT_ADMIN_PASSWORD,
  sessions: [],
};

// Default Leads
interface LeadsData {
  inquiries: PriceInquiry[];
  dealers: DealershipApp[];
}

const DEFAULT_LEADS: LeadsData = {
  inquiries: [
    {
      id: "I-98231",
      name: "Suresh Sharma",
      phone: "9826019283",
      model: "glider",
      color: "Ocean Blue",
      batteryType: "LA",
      batteryConfig: "Lead-Acid Pack: 60V / 28Ah (1 Year Warranty)",
      rangeKm: 60,
      status: "new",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: "I-44912",
      name: "Pooja Verma",
      phone: "9893452109",
      model: "classic",
      color: "Pearl White",
      batteryType: "LI",
      batteryConfig: "Lithium-Ion Pack: Ultra-Range (3 Years Warranty)",
      rangeKm: 80,
      status: "contacted",
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: "I-12904",
      name: "Rohan Gupta",
      phone: "9111822304",
      model: "vista",
      color: "Midnight Black",
      batteryType: "LI",
      batteryConfig: "Lithium-Ion Pack: High-Density (3 Years Warranty)",
      rangeKm: 100,
      status: "completed",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ],
  dealers: [
    {
      id: "D-89402",
      name: "Prakash Auto Agency",
      email: "contact@prakashauto.com",
      phone: "8889212001",
      city: "Indore",
      state: "Madhya Pradesh",
      experience: "12 Years in Two-Wheeler Franchise",
      pastBusiness: "Authorized sub-dealer for major ICE Scooter brand. Handling 200+ unit sales monthly.",
      investmentRange: "₹25 Lakhs - ₹50 Lakhs",
      message: "Interested in establishing a flagship Volmo showroom on MG Road, Indore. Highly interested in RTO-free models.",
      status: "applied",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: "D-10294",
      name: "Singh Electric Mobiles",
      email: "singh.electric@gmail.com",
      phone: "9425102831",
      city: "Bhopal",
      state: "Madhya Pradesh",
      experience: "3 Years in Battery Spare Parts Distribution",
      pastBusiness: "Distributor of Lead-Acid and Lithium EV battery packs in central India.",
      investmentRange: "₹15 Lakhs - ₹25 Lakhs",
      message: "Seeking exclusive dealership for Bhopal. Ready to set up workshop and charging points.",
      status: "reviewing",
      createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
  ],
};

export const getDefaultSiteConfig = () => ({
  models: MODELS_DATA,
  pulse: PULSE_DATA,
  features: COMMON_FEATURES,
  contact: CONTACT_INFO,
  hero: DEFAULT_HERO_CONFIG,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
  showrooms: DEFAULT_SHOWROOMS,
  branding: DEFAULT_BRANDING,
  sections: DEFAULT_SITE_SECTIONS,
  accessories: DEFAULT_ACCESSORIES,
  leadAcidBatteries: LEAD_ACID_GRAPHENE_BATTERIES,
  lithiumBatteries: LITHIUM_LFP_BATTERY_MODELS,
  chargers: CHARGER_MODELS,
  accessoriesPage: DEFAULT_ACCESSORIES_PAGE_CONFIG,
  batteryChargerPage: DEFAULT_BATTERY_CHARGER_PAGE_CONFIG,
});

class StorageService {
  private configCache: any = null;
  private leadsCache: LeadsData | null = null;
  private authCache: AuthData | null = null;

  // Read site config
  getConfig(): any {
    if (this.configCache) return this.configCache;
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
        this.configCache = JSON.parse(raw);
        return this.configCache;
      }
    } catch (e) {
      console.error("[Storage] Failed to read config file, generating defaults:", e);
    }
    const def = getDefaultSiteConfig();
    this.saveConfig(def);
    return def;
  }

  // Save site config
  saveConfig(data: any): void {
    this.configCache = data;
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("[Storage] Failed to save config file:", e);
    }
  }

  // Reset site config
  resetConfig(): any {
    const def = getDefaultSiteConfig();
    this.saveConfig(def);
    return def;
  }

  // Read Leads
  getLeads(): LeadsData {
    if (this.leadsCache) return this.leadsCache;
    try {
      if (fs.existsSync(LEADS_FILE)) {
        const raw = fs.readFileSync(LEADS_FILE, "utf-8");
        this.leadsCache = JSON.parse(raw);
        return this.leadsCache!;
      }
    } catch (e) {
      console.error("[Storage] Failed to read leads file:", e);
    }
    this.saveLeads(DEFAULT_LEADS);
    return DEFAULT_LEADS;
  }

  // Save Leads
  saveLeads(data: LeadsData): void {
    this.leadsCache = data;
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("[Storage] Failed to save leads file:", e);
    }
  }

  // Inquiry operations
  addInquiry(inquiry: PriceInquiry): PriceInquiry {
    const leads = this.getLeads();
    leads.inquiries.unshift(inquiry);
    this.saveLeads(leads);
    return inquiry;
  }

  updateInquiry(id: string, updates: Partial<PriceInquiry>): PriceInquiry | null {
    const leads = this.getLeads();
    const idx = leads.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    leads.inquiries[idx] = { ...leads.inquiries[idx], ...updates };
    this.saveLeads(leads);
    return leads.inquiries[idx];
  }

  deleteInquiry(id: string): boolean {
    const leads = this.getLeads();
    const before = leads.inquiries.length;
    leads.inquiries = leads.inquiries.filter((i) => i.id !== id);
    if (leads.inquiries.length !== before) {
      this.saveLeads(leads);
      return true;
    }
    return false;
  }

  // Dealer operations
  addDealer(dealer: DealershipApp): DealershipApp {
    const leads = this.getLeads();
    leads.dealers.unshift(dealer);
    this.saveLeads(leads);
    return dealer;
  }

  updateDealer(id: string, updates: Partial<DealershipApp>): DealershipApp | null {
    const leads = this.getLeads();
    const idx = leads.dealers.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    leads.dealers[idx] = { ...leads.dealers[idx], ...updates };
    this.saveLeads(leads);
    return leads.dealers[idx];
  }

  deleteDealer(id: string): boolean {
    const leads = this.getLeads();
    const before = leads.dealers.length;
    leads.dealers = leads.dealers.filter((d) => d.id !== id);
    if (leads.dealers.length !== before) {
      this.saveLeads(leads);
      return true;
    }
    return false;
  }

  // Auth Operations
  getAuth(): AuthData {
    if (this.authCache) return this.authCache;
    try {
      if (fs.existsSync(AUTH_FILE)) {
        const raw = fs.readFileSync(AUTH_FILE, "utf-8");
        this.authCache = JSON.parse(raw);
        return this.authCache!;
      }
    } catch (e) {
      console.error("[Storage] Failed to read auth file:", e);
    }
    this.saveAuth(DEFAULT_AUTH);
    return DEFAULT_AUTH;
  }

  saveAuth(data: AuthData): void {
    this.authCache = data;
    try {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error("[Storage] Failed to save auth file:", e);
    }
  }

  updatePassword(newPass: string): void {
    const auth = this.getAuth();
    auth.adminPassword = newPass;
    this.saveAuth(auth);
  }

  createSession(): string {
    const auth = this.getAuth();
    const token = "session_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
    auth.sessions.push(token);
    // Keep max 20 active sessions
    if (auth.sessions.length > 20) {
      auth.sessions = auth.sessions.slice(-20);
    }
    this.saveAuth(auth);
    return token;
  }

  verifySession(token: string): boolean {
    const auth = this.getAuth();
    return auth.sessions.includes(token);
  }
}

export const storage = new StorageService();
