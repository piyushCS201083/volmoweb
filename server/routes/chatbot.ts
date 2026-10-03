/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { ai, VOLMO_SYSTEM_INSTRUCTION } from "../services/gemini";

const router = Router();

interface ChatMessage {
  role: "user" | "model" | "assistant";
  content: string;
}

export function buildVolmoTechnicalReply(userMessage: string): string {
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

  if (q.includes("dealer") || q.includes("franchise") || q.includes("showroom") || q.includes("contact") || q.includes("price")) {
    return [
      "**Pricing, Test Rides & Dealership Inquiries:**",
      "",
      "* **Direct Sales & Support:** Call **+91 82333 33346** or email **sales@volmoelectrical.com**.",
      "* **Custom Price Quote:** Click **Get Price Inquiry** on any scooter card to choose your preferred model, color, and battery pack (Lead-Acid Graphene or Lithium-Ion).",
      "* **Dealership Opportunities:** We are expanding across India! Click **Apply for Dealership** in the navigation bar to submit your showroom application.",
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

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages, model = "gemini-3.1-flash-lite" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: 'messages' array is required with at least one message.",
      });
    }

    const allowedModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    const selectedModel = allowedModels.includes(model) ? model : "gemini-3.1-flash-lite";

    const contents = messages.map((msg: ChatMessage) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: String(msg.content || "") }],
    }));

    if (contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "The last message in history must be from the user." });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: VOLMO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText =
      response.text ||
      buildVolmoTechnicalReply(req.body?.messages?.slice(-1)?.[0]?.content || "");

    return res.json({
      success: true,
      model: selectedModel,
      reply: replyText,
    });
  } catch (error: any) {
    const userLastMsg = req.body?.messages?.slice(-1)?.[0]?.content || "";
    const intelligentFallback = buildVolmoTechnicalReply(userLastMsg);

    return res.json({
      success: true,
      model: req.body?.model || "gemini-3.1-flash-lite",
      reply: intelligentFallback,
    });
  }
});

export default router;
