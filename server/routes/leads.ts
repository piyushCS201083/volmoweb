/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { PriceInquiry, DealershipApp } from "../../src/types";

const router = Router();

// ==========================================
// PRICE INQUIRIES (SCOOTERS)
// ==========================================

// GET /api/leads/inquiries
router.get("/inquiries", (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const leads = storage.getLeads();
    let result = [...leads.inquiries];

    if (status && status !== "all") {
      result = result.filter((i) => i.status === status);
    }

    if (typeof search === "string" && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.phone.includes(q) ||
          i.model.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch inquiries" });
  }
});

// POST /api/leads/inquiries
router.post("/inquiries", (req: Request, res: Response) => {
  try {
    const { name, phone, model, color, batteryType, batteryConfig, rangeKm } = req.body;

    if (!name || !phone || !model) {
      return res.status(400).json({ error: "Name, phone, and model are required" });
    }

    const newInquiry: PriceInquiry = {
      id: "I-" + Math.floor(10000 + Math.random() * 90000),
      name: String(name).trim(),
      phone: String(phone).trim(),
      model: String(model).trim(),
      color: String(color || "Standard"),
      batteryType: batteryType === "LI" ? "LI" : "LA",
      batteryConfig: String(batteryConfig || "Default Configuration"),
      rangeKm: Number(rangeKm) || 60,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    const saved = storage.addInquiry(newInquiry);
    console.log(`[Backend API] New scooter price inquiry saved: ${saved.id} - ${saved.name}`);

    return res.status(201).json({
      success: true,
      message: "Price inquiry saved successfully to backend database",
      data: saved,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to submit inquiry" });
  }
});

// PATCH /api/leads/inquiries/:id
router.patch("/inquiries/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["new", "contacted", "completed"].includes(status)) {
      return res.status(400).json({ error: "Valid status ('new', 'contacted', 'completed') is required" });
    }

    const updated = storage.updateInquiry(id, { status });
    if (!updated) {
      return res.status(404).json({ error: "Inquiry not found" });
    }

    return res.json({ success: true, message: "Inquiry updated", data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update inquiry" });
  }
});

// DELETE /api/leads/inquiries/:id
router.delete("/inquiries/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteInquiry(id);
    if (!deleted) {
      return res.status(404).json({ error: "Inquiry not found" });
    }
    return res.json({ success: true, message: `Inquiry ${id} deleted successfully` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to delete inquiry" });
  }
});

// ==========================================
// DEALERSHIP APPLICATIONS
// ==========================================

// GET /api/leads/dealers
router.get("/dealers", (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const leads = storage.getLeads();
    let result = [...leads.dealers];

    if (status && status !== "all") {
      result = result.filter((d) => d.status === status);
    }

    if (typeof search === "string" && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.phone.includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch dealership applications" });
  }
});

// POST /api/leads/dealers
router.post("/dealers", (req: Request, res: Response) => {
  try {
    const { name, email, phone, city, state, experience, pastBusiness, investmentRange, message } = req.body;

    if (!name || !email || !phone || !city || !state || !investmentRange) {
      return res.status(400).json({ error: "All required dealership fields must be filled" });
    }

    const newDealer: DealershipApp = {
      id: "D-" + Math.floor(10000 + Math.random() * 90000),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      city: String(city).trim(),
      state: String(state).trim(),
      experience: String(experience || "Automotive Franchise").trim(),
      pastBusiness: String(pastBusiness || "").trim(),
      investmentRange: String(investmentRange).trim(),
      message: message ? String(message).trim() : undefined,
      status: "applied",
      createdAt: new Date().toISOString(),
    };

    const saved = storage.addDealer(newDealer);
    console.log(`[Backend API] New dealership application saved: ${saved.id} - ${saved.name} (${saved.city})`);

    return res.status(201).json({
      success: true,
      message: "Dealership application registered successfully in backend database",
      data: saved,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to submit dealership application" });
  }
});

// PATCH /api/leads/dealers/:id
router.patch("/dealers/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["applied", "reviewing", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Valid status is required" });
    }

    const updated = storage.updateDealer(id, { status });
    if (!updated) {
      return res.status(404).json({ error: "Dealership application not found" });
    }

    return res.json({ success: true, message: "Dealership application updated", data: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update dealership application" });
  }
});

// DELETE /api/leads/dealers/:id
router.delete("/dealers/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = storage.deleteDealer(id);
    if (!deleted) {
      return res.status(404).json({ error: "Dealership application not found" });
    }
    return res.json({ success: true, message: `Dealership application ${id} deleted successfully` });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to delete dealership application" });
  }
});

export default router;
