/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, MessageCircle, Sparkles, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { VOLMO_WHATSAPP_DISPLAY, openWhatsApp } from "../utils/whatsapp";

interface WhatsAppChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  sourceContext?: string;
}

const PRESET_MESSAGES = [
  {
    label: "🛵 Scooter Price & Test Ride",
    text: "Hello Volmo Electric, I would like to inquire about your electric scooter models (Vista, Glider, Classic, Phantom, Pulse), latest price quotes, and book a test ride.",
  },
  {
    label: "⚡ Battery & Charger Inquiry",
    text: "Hello Volmo Electric, I need specifications, pricing, and warranty details for your custom Lithium-ion & Lead-acid battery packs and smart chargers.",
  },
  {
    label: "🏪 Dealership / Franchise",
    text: "Hello Volmo Electric, I am interested in opening an authorized Volmo EV Dealership showroom in my city. Please share dealership brochure and partnership criteria.",
  },
  {
    label: "💬 General Support Query",
    text: "Hello Volmo Electric, I have an inquiry regarding your RTO-free electric two-wheelers and service network.",
  },
];

export default function WhatsAppChatModal({
  isOpen,
  onClose,
  initialMessage = "",
  sourceContext,
}: WhatsAppChatModalProps) {
  const defaultText =
    initialMessage.trim() ||
    "Hello Volmo Electric, I would like to inquire about your electric scooters and request pricing details.";

  const [message, setMessage] = useState(defaultText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessage(
        initialMessage.trim() ||
          "Hello Volmo Electric, I would like to inquire about your electric scooters and request pricing details."
      );
      setCopied(false);
    }
  }, [isOpen, initialMessage]);

  const handleSend = () => {
    openWhatsApp(message);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 text-slate-800"
          >
            {/* WhatsApp Green Top Header */}
            <div className="bg-[#25D366] text-white p-5 sm:p-6 relative">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black tracking-tight text-white">
                      Chat on WhatsApp
                    </h3>
                    <span className="inline-flex items-center gap-1 bg-white/25 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-white/90 text-xs font-semibold mt-0.5">
                    Volmo Electric Sales &amp; Technical Desk &middot; {VOLMO_WHATSAPP_DISPLAY}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 text-left">
              {sourceContext && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Inquiry Reference:</span>
                  <span className="font-bold text-slate-800">{sourceContext}</span>
                </div>
              )}

              {/* Quick Preset Prompts */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Choose a preset or customize below:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setMessage(preset.text)}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer ${
                        message === preset.text
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <span className="block">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizable Message Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Customizable WhatsApp Message
                  </label>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy text</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your custom message here to send to +91 9009156696 on WhatsApp..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 leading-relaxed font-sans"
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>Direct phone recipient: +91 9009156696</span>
                  <span>{message.length} characters</span>
                </div>
              </div>

              {/* Security & Response Info */}
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500">
                <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                <span>Redirects directly to WhatsApp chat with verified Volmo Electrical Pvt Ltd.</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={handleSend}
                  className="flex-1 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
                  </svg>
                  <span>Open WhatsApp &amp; Send Message</span>
                  <ExternalLink size={13} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-auto px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
