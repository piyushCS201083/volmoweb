/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ClipboardCheck, Sparkles, AlertCircle } from "lucide-react";
import { PriceInquiry, BatteryType } from "../types";
import { useSiteConfig } from "../SiteConfigContext";
import { api } from "../services/api";

interface PriceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelId: string;
  initialColorName: string;
  initialBatteryType: BatteryType;
  initialBatteryRange: number; // e.g. 60 or 48
  onSubmitSuccess: (inquiry: PriceInquiry) => void;
}

export default function PriceInquiryModal({
  isOpen,
  onClose,
  initialModelId,
  initialColorName,
  initialBatteryType,
  initialBatteryRange,
  onSubmitSuccess,
}: PriceInquiryModalProps) {
  const { modelsData } = useSiteConfig();

  const [modelId, setModelId] = useState(initialModelId);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [color, setColor] = useState(initialColorName);
  const [batteryType, setBatteryType] = useState<BatteryType>(initialBatteryType);
  const [batteryRange, setBatteryRange] = useState<number>(initialBatteryRange);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync with props when they change (or modal opens)
  useEffect(() => {
    if (isOpen) {
      setModelId(initialModelId);
      setColor(initialColorName);
      setBatteryType(initialBatteryType);
      setBatteryRange(initialBatteryRange);
      setIsSubmitted(false);
    }
  }, [isOpen, initialModelId, initialColorName, initialBatteryType, initialBatteryRange]);

  const selectedModel = modelsData.find((m) => m.id === modelId) || modelsData[0];

  // Sync color when model changes
  useEffect(() => {
    if (selectedModel) {
      // Find if selected color is in new model's colors, otherwise set first color
      const hasColor = selectedModel.colors.some((c) => c.name === color);
      if (!hasColor) {
        setColor(selectedModel.colors[0]?.name || "");
      }
    }
  }, [modelId]);

  // Adjust battery range values dynamically when batteryType or model changes
  useEffect(() => {
    if (batteryType === "LA") {
      // For LA, range is pairs of 4 (48km), 5 (60km), 6 (72km)
      // If current range is not valid, reset to 60 (5 batteries)
      if (![48, 60, 72].includes(batteryRange)) {
        setBatteryRange(60);
      }
    } else {
      // For LI: ranges are 60, 80, 100, 120, 145, 180
      // Constraint: Vista and Glider can't support 120, 145, 180
      const isVistaOrGlider = modelId === "vista" || modelId === "glider";
      if (isVistaOrGlider) {
        if (![60, 80, 100].includes(batteryRange)) {
          setBatteryRange(80); // Reset within limits
        }
      } else {
        if (![60, 80, 100, 120, 145, 180].includes(batteryRange)) {
          setBatteryRange(100);
        }
      }
    }
  }, [batteryType, modelId]);

  // Real-time Validation Engine
  useEffect(() => {
    const nextErrors: Record<string, string> = {};

    if (touched.name) {
      if (!name.trim()) {
        nextErrors.name = "Your name is required";
      } else if (name.trim().length < 2) {
        nextErrors.name = "Name must be at least 2 characters";
      }
    }

    if (touched.phone) {
      if (!phone.trim()) {
        nextErrors.phone = "Mobile number is required";
      } else if (!/^\d{10}$/.test(phone.trim())) {
        nextErrors.phone = "Mobile number must be exactly 10 digits";
      }
    }

    setErrors(nextErrors);
  }, [name, phone, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, phone: true });

    if (!name.trim() || name.trim().length < 2 || !phone.trim() || !/^\d{10}$/.test(phone)) {
      return;
    }

    // Config descriptive tags
    let configStr = "";
    if (batteryType === "LA") {
      const cnt = batteryRange / 12;
      configStr = `Lead-Acid: ${cnt} Batteries (12V SLA, 1 Year Warranty)`;
    } else {
      configStr = `Lithium-Ion Pack: High-Density (3 Years Warranty, Single Pack)`;
    }

    const inquiry: PriceInquiry = {
      id: "I-" + Math.floor(Math.random() * 100000),
      name: name.trim(),
      phone: phone.trim(),
      model: selectedModel.name,
      color,
      batteryType,
      batteryConfig: configStr,
      rangeKm: batteryRange,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // Save to local storage for instant offline access
    const currentInquiries = JSON.parse(localStorage.getItem("volmo_inquiries") || "[]");
    localStorage.setItem("volmo_inquiries", JSON.stringify([inquiry, ...currentInquiries]));

    // Send to backend API for persistent real-time database storage
    api.leads.submitInquiry(inquiry).catch((err) => {
      console.warn("[Volmo] Price inquiry submitted locally (backend sync pending):", err.message);
    });

    onSubmitSuccess(inquiry);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setPhone("");
      setTouched({});
      onClose();
    }, 2000);
  };

  const isVistaOrGlider = modelId === "vista" || modelId === "glider";

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
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 md:p-8 text-white shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="h-16 w-16 bg-slate-800 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <ClipboardCheck size={40} className="stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white">Inquiry Sent!</h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  We've received your request for **{selectedModel.name}**. A Volmo executive will contact you shortly on **+91 {phone}** with custom pricing and brochure details.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-slate-800 text-slate-300 rounded-xl">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Enquire Price</h2>
                    <p className="text-xs text-slate-400">Receive customized quotes for {selectedModel.name}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Model & Spec Selector */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Selected Scooter Model
                    </label>
                    <select
                      value={modelId}
                      onChange={(e) => setModelId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-slate-500/30 transition-all font-semibold"
                    >
                      {modelsData.map((m) => (
                        <option key={m.id} value={m.id}>
                          VOLMO {m.name} ({m.speed} Top Speed)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Colors of chosen Model */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-sans">
                      Preferred Color Choice
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedModel.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setColor(c.name)}
                          className={`flex items-center gap-2 border px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            color === c.name
                              ? "border-slate-500 bg-slate-500/10 text-white font-semibold"
                              : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Battery customizer inside modal */}
                  <div className="bg-slate-950/85 p-3.5 rounded-2xl border border-slate-800/80">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Battery Layout & Range Customization
                    </p>

                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setBatteryType("LA")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          batteryType === "LA"
                            ? "bg-slate-600 text-white"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-850"
                        }`}
                      >
                        Lead Acid (LA)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBatteryType("LI")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          batteryType === "LI"
                            ? "bg-slate-600 text-white"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-850"
                        }`}
                      >
                        Lithium Ion (LI)
                      </button>
                    </div>

                    {/* Specifications detail */}
                    {batteryType === "LA" ? (
                      <div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[48, 60, 72].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => setBatteryRange(r)}
                              className={`py-2 rounded-lg text-xs border transition-all cursor-pointer ${
                                batteryRange === r
                                  ? "border-slate-500 bg-slate-500/5 text-white"
                                  : "border-slate-800 bg-slate-900 text-slate-400"
                              }`}
                            >
                              <div className="font-bold">{r} km</div>
                              <div className="text-[9px] opacity-70">{r / 12} Batteries</div>
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">
                          🔋 Charge: 7-8 hrs &middot; Warranty: 1 Yr &middot; 12V SLA Modular System
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[60, 80, 100, 120, 145, 180]
                            .filter((r) => !(isVistaOrGlider && [120, 145, 180].includes(r)))
                            .map((r) => (
                              <button
                                key={r}
                                type="button"
                                onClick={() => setBatteryRange(r)}
                                className={`py-2 rounded-lg text-xs border transition-all cursor-pointer ${
                                  batteryRange === r
                                    ? "border-slate-500 bg-slate-500/5 text-white"
                                    : "border-slate-800 bg-slate-900 text-slate-400"
                                }`}
                              >
                                <div className="font-bold">{r} km</div>
                                <div className="text-[9px] opacity-70">Single Pack</div>
                              </button>
                            ))}
                        </div>
                        {isVistaOrGlider && (
                          <div className="flex items-center gap-1 mt-1.5 text-slate-400 text-[10px] justify-center">
                            <AlertCircle size={10} className="flex-shrink-0" />
                            <span>120km to 180km packs require larger compartment size.</span>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-2 text-center">
                          ⚡ Fast Charge: 4-5 hrs &middot; Warranty: 3 Yrs &middot; Custom Lithium cells
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Customer Information */}
                  <div className="pt-2 border-t border-slate-805 space-y-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 placeholder-slate-500 text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                          touched.name && errors.name
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : "border-slate-800 focus:ring-slate-500/30"
                        }`}
                        placeholder="Enter full name"
                      />
                      {touched.name && errors.name && (
                        <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneInput}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full bg-slate-950 border rounded-xl px-4 py-3 placeholder-slate-505 text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                          touched.phone && errors.phone
                            ? "border-red-500/50 focus:ring-red-500/30"
                            : "border-slate-800 focus:ring-slate-500/30"
                        }`}
                        placeholder="Enter 10-digit mobile number"
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-700 hover:bg-slate-650 text-white font-bold py-3.5 rounded-xl mt-6 cursor-pointer active:scale-[0.98] transition-all text-sm tracking-wide shadow-md"
                  >
                    Enquire Custom Price
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
