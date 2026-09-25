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

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages, model = "gemini-3.1-flash-lite" } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request: 'messages' array is required with at least one message.",
      });
    }

    // Supported models in modern @google/genai:
    // gemini-3.1-flash-lite for fast responses, gemini-3.8-flash for complex queries
    const allowedModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    const selectedModel = allowedModels.includes(model) ? model : "gemini-3.1-flash-lite";

    // Format message history for @google/genai
    const contents = messages.map((msg: ChatMessage) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: String(msg.content || "") }],
    }));

    // Ensure the last message is from the user
    if (contents[contents.length - 1].role !== "user") {
      return res.status(400).json({ error: "The last message in history must be from the user." });
    }

    // Call Gemini API through the shared SDK client on server-side
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: VOLMO_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I'm ready to assist with any technical or FAQ questions on Volmo electric scooters!";

    return res.json({
      success: true,
      model: selectedModel,
      reply: replyText,
    });
  } catch (error: any) {
    console.error("[Chatbot Error]", error);

    // If API key is missing or quota is reached in dev, provide a helpful fallback answer
    const fallbackAnswers: Record<string, string> = {
      rto: "Volmo electric scooters are 100% RTO-Free! Under CMVR rules in India, vehicles with motor power ≤250W and max speed ≤25 km/h do not require RTO registration, road tax, or driving licenses.",
      battery: "Volmo provides both Lead-Acid Graphene arrays (48V, 60V, 72V with 1-year warranty) and high-density Lithium-Ion/LFP packs (60V 24Ah to 72V 60Ah with 3-year warranty and Smart BMS).",
      charger: "Our German-technology chargers include automatic CCCV floating cutoff and a dedicated 69.0V cutoff for LFP batteries to prevent cell degradation.",
      range: "Real-world certified range ranges from 55-65 km on our 60V 24Ah packs up to 140-160 km on our top-tier 72V 60Ah Lithium-Ion packs.",
    };

    const userLastMsg = (req.body?.messages?.slice(-1)?.[0]?.content || "").toLowerCase();
    let intelligentFallback = "Hello! I am the Volmo Electric AI Assistant. We offer 5 RTO-free scooter models (Vista, Glider, Classic, Phantom, Pulse) and advanced battery solutions. How can I assist you with range, battery specs, or dealer questions today?";

    if (userLastMsg.includes("rto") || userLastMsg.includes("license") || userLastMsg.includes("registration")) {
      intelligentFallback = fallbackAnswers.rto;
    } else if (userLastMsg.includes("battery") || userLastMsg.includes("lithium") || userLastMsg.includes("graphene")) {
      intelligentFallback = fallbackAnswers.battery;
    } else if (userLastMsg.includes("charger") || userLastMsg.includes("charging") || userLastMsg.includes("cutoff")) {
      intelligentFallback = fallbackAnswers.charger;
    } else if (userLastMsg.includes("range") || userLastMsg.includes("mileage") || userLastMsg.includes("km")) {
      intelligentFallback = fallbackAnswers.range;
    }

    return res.json({
      success: true,
      model: "volmo-fallback",
      reply: intelligentFallback,
      note: error.message ? `Handled with EV knowledge fallback: ${error.message}` : undefined,
    });
  }
});

export default router;
