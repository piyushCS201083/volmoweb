/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteConfig } from "../SiteConfigContext";
import { BatteryType, ModelSpec } from "../types";
import { Zap, HelpCircle, CheckCircle, Shield, AlertTriangle, Eye, Flame, ArrowRight, Sparkles, RefreshCw, Sliders } from "lucide-react";
import { getModelActivePhoto } from "../data";
import ModelDetailPage from "./ModelDetailPage";

export const getBatteryPriceModifier = (
  batteryType: BatteryType,
  leadAcidCount: number,
  lithiumRange: number
): number => {
  if (batteryType === "LA") {
    if (leadAcidCount === 4) return -4000;
    if (leadAcidCount === 6) return 5000;
    return 0; // 5 batteries is base (60V array)
  } else {
    switch (lithiumRange) {
      case 60:
        return 12000;
      case 80:
        return 18000;
      case 100:
        return 25000;
      case 120:
        return 32000;
      case 145:
        return 40000;
      case 180:
        return 49000;
      default:
        return 18000;
    }
  }
};

export const getModelConfiguredPrice = (
  model: ModelSpec,
  config: { batteryType: BatteryType; leadAcidCount: number; lithiumRange: number }
) => {
  const baseVal = parseInt((model.basePriceEstimate || "45000").replace(/[^\d]/g, ""), 10) || 45000;
  const modifier = getBatteryPriceModifier(config.batteryType, config.leadAcidCount, config.lithiumRange);
  const totalPrice = baseVal + modifier;
  return {
    basePrice: baseVal,
    modifier,
    totalPrice,
    formatted: `₹${totalPrice.toLocaleString("en-IN")}`,
    hasModifier: modifier !== 0,
  };
};

interface ModelsProps {
  onEnquireClick: (
    modelId: string,
    colorName: string,
    batteryType: BatteryType,
    batteryRange: number
  ) => void;
  selectedModelId?: string | null;
  onSelectModelId?: (modelId: string | null) => void;
  onNavigateToAccessories?: () => void;
}

export default function Models({ onEnquireClick, selectedModelId = null, onSelectModelId, onNavigateToAccessories }: ModelsProps) {
  const { modelsData, pulseData, siteSections } = useSiteConfig();

  // Fallback local state if parent doesn't control selection
  const [localSelectedModelId, setLocalSelectedModelId] = useState<string | null>(null);

  const [pulseSubscribed, setPulseSubscribed] = useState<boolean>(false);

  // Synchronize battery configuration across all models on the page
  const [syncBatteryAcrossModels, setSyncBatteryAcrossModels] = useState<boolean>(true);

  const activeModelId = onSelectModelId ? selectedModelId : localSelectedModelId;
  const setActiveModelId = (id: string | null) => {
    if (onSelectModelId) {
      onSelectModelId(id);
    } else {
      setLocalSelectedModelId(id);
    }
  };

  const selectedModelSpec = modelsData.find((m) => m.id === activeModelId);

  // Store customization state for EACH of the 4 models
  const [selections, setSelections] = useState<
    Record<
      string,
      {
        selectedColor: string;
        batteryType: BatteryType;
        leadAcidCount: number; // 4, 5, or 6
        lithiumRange: number; // 60, 80, 100, 120, 145, 180
      }
    >
  >({
    vista: {
      selectedColor: "Glossy White",
      batteryType: "LA",
      leadAcidCount: 5, // 60km range
      lithiumRange: 80, // 80km range
    },
    glider: {
      selectedColor: "Cherry Red",
      batteryType: "LA",
      leadAcidCount: 5,
      lithiumRange: 80,
    },
    classic: {
      selectedColor: "Royal Blue",
      batteryType: "LA",
      leadAcidCount: 5,
      lithiumRange: 80,
    },
    phantom: {
      selectedColor: "Cream Beige",
      batteryType: "LA",
      leadAcidCount: 5,
      lithiumRange: 80,
    },
  });

  // Color Swatch clicking handler
  const handleColorChange = (modelId: string, colorName: string) => {
    setSelections((prev) => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        selectedColor: colorName,
      },
    }));
  };

  // Battery Type toggle (Lead Acid vs Lit Ion)
  const handleBatteryTypeToggle = (modelId: string, type: BatteryType) => {
    if (syncBatteryAcrossModels) {
      setSelections((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const isChoked = (key === "vista" || key === "glider") && next[key].lithiumRange > 100;
          next[key] = {
            ...next[key],
            batteryType: type,
            lithiumRange: isChoked ? 100 : next[key].lithiumRange,
          };
        });
        return next;
      });
    } else {
      setSelections((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          batteryType: type,
        },
      }));
    }
  };

  // Lead Acid Battery Count select (4, 5, 6 batteries)
  const handleLeadAcidCountChange = (modelId: string, count: number) => {
    if (syncBatteryAcrossModels) {
      setSelections((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = {
            ...next[key],
            batteryType: "LA",
            leadAcidCount: count,
          };
        });
        return next;
      });
    } else {
      setSelections((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          batteryType: "LA",
          leadAcidCount: count,
        },
      }));
    }
  };

  // Lithium Range select (60, 80, 100, 120, 145, 180)
  const handleLithiumRangeChange = (modelId: string, rangeKm: number) => {
    if (syncBatteryAcrossModels) {
      setSelections((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          // Vista and Glider compartments cannot accommodate >100km packs
          const isChoked = (key === "vista" || key === "glider") && rangeKm > 100;
          next[key] = {
            ...next[key],
            batteryType: "LI",
            lithiumRange: isChoked ? 100 : rangeKm,
          };
        });
        return next;
      });
    } else {
      setSelections((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          batteryType: "LI",
          lithiumRange: rangeKm,
        },
      }));
    }
  };

  // Explicitly apply one model's battery setup across all fleet models
  const handleApplyToAllModels = (sourceModelId: string) => {
    const src = selections[sourceModelId];
    if (!src) return;
    setSelections((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const isChoked = (key === "vista" || key === "glider") && src.lithiumRange > 100;
        next[key] = {
          ...next[key],
          batteryType: src.batteryType,
          leadAcidCount: src.leadAcidCount,
          lithiumRange: isChoked ? 100 : src.lithiumRange,
        };
      });
      return next;
    });
  };

  // Calculate current range for displaying
  const getCurrentParams = (model: ModelSpec) => {
    const config = selections[model.id] || {
      selectedColor: model.colors[0]?.name || "White",
      batteryType: "LA" as BatteryType,
      leadAcidCount: 5,
      lithiumRange: 80,
    };
    if (config.batteryType === "LA") {
      const range = config.leadAcidCount * 12;
      return {
        range,
        charging: "7-8 hours",
        warranty: "1 Year Battery Warranty",
        description: `Powered by pairs of ${config.leadAcidCount} Lead-Acid Batteries (each 12V SLA pack adding 12km range).`,
      };
    } else {
      return {
        range: config.lithiumRange,
        charging: "4-5 hours (Fast Charge)",
        warranty: "3 Years Advanced Warranty",
        description: `Integrated high density single pack Lithium-Ion cell array, optimized for extended life cycles.`,
      };
    }
  };

  if (selectedModelSpec) {
    return (
      <ModelDetailPage 
        model={selectedModelSpec} 
        onBackClick={() => setActiveModelId(null)} 
        onEnquireClick={onEnquireClick} 
      />
    );
  }

  return (
    <section id="models" className="py-24 bg-slate-50 border-b border-slate-205 text-slate-800 relative">
      <div className="absolute top-10 right-10 w-96 h-96 bg-slate-400/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
          <span className="text-xs font-mono uppercase bg-slate-200/60 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-full font-bold">
            {siteSections?.fleetBadge || "India's Leading RTO-Free Fleet"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight font-sans">
            {siteSections?.fleetHeading || "Choose Your Volmo Ride"}
          </h2>
          <p className="text-slate-600 text-sm font-normal font-sans max-w-lg mx-auto">
            {siteSections?.fleetSubtitle || "Zero registration. Zero license requirements. Zero road tax. Base models start from Vista, up to our flagship Phantom Top Model. Customize exactly to your required budget and range."}
          </p>

          {/* Real-time Fleet Battery & Price Sync Toolbar */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/90 shadow-md rounded-2xl p-4 sm:p-5 text-left space-y-3.5 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                    Fleet Battery &amp; Real-time Price Customizer
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Change battery type or range here or on any card below to dynamically update prices across all models
                  </p>
                </div>
              </div>

              {/* Sync Toggle */}
              <button
                type="button"
                onClick={() => setSyncBatteryAcrossModels((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none self-start sm:self-auto ${
                  syncBatteryAcrossModels
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                    : "bg-slate-100 border-slate-250 text-slate-600 hover:bg-slate-200"
                }`}
                title="When enabled, changing battery type or pack updates the price across all models together for instant comparison"
              >
                <RefreshCw size={13} className={syncBatteryAcrossModels ? "text-emerald-600 animate-spin-slow" : "text-slate-400"} />
                <span>Sync All Models:</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${syncBatteryAcrossModels ? "bg-emerald-600 text-white font-black" : "bg-slate-300 text-slate-700"}`}>
                  {syncBatteryAcrossModels ? "ON" : "OFF"}
                </span>
              </button>
            </div>

            {/* Quick Fleet Selectors */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Battery Type switch */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Battery:
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setSyncBatteryAcrossModels(true);
                      handleBatteryTypeToggle("vista", "LA");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      selections.vista?.batteryType === "LA"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Lead Acid (LA)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSyncBatteryAcrossModels(true);
                      handleBatteryTypeToggle("vista", "LI");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      selections.vista?.batteryType === "LI"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Lithium Ion (LI)
                  </button>
                </div>
              </div>

              {/* Range quick options */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Range:
                </span>
                {selections.vista?.batteryType === "LA" ? (
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { count: 4, label: "48 KM (4 Bat)", delta: "-₹4k" },
                      { count: 5, label: "60 KM (5 Bat)", delta: "Base" },
                      { count: 6, label: "72 KM (6 Bat)", delta: "+₹5k" },
                    ].map((item) => (
                      <button
                        key={item.count}
                        type="button"
                        onClick={() => {
                          setSyncBatteryAcrossModels(true);
                          handleLeadAcidCountChange("vista", item.count);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          selections.vista?.leadAcidCount === item.count
                            ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[10px] ml-1 opacity-75 font-mono">({item.delta})</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { range: 60, delta: "+₹12k" },
                      { range: 80, delta: "+₹18k" },
                      { range: 100, delta: "+₹25k" },
                      { range: 120, delta: "+₹32k" },
                      { range: 145, delta: "+₹40k" },
                      { range: 180, delta: "+₹49k" },
                    ].map((item) => (
                      <button
                        key={item.range}
                        type="button"
                        onClick={() => {
                          setSyncBatteryAcrossModels(true);
                          handleLithiumRangeChange("vista", item.range);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          selections.vista?.lithiumRange === item.range
                            ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item.range} KM</span>
                        <span className="text-[10px] ml-1 opacity-75 font-mono">({item.delta})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fleet cards layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {modelsData.map((model) => {
            const config = selections[model.id] || {
              selectedColor: model.colors[0]?.name || "White",
              batteryType: "LA" as BatteryType,
              leadAcidCount: 5,
              lithiumRange: 80,
            };
            const currentParams = getCurrentParams(model);
            const priceInfo = getModelConfiguredPrice(model, config);
            const activePhoto = getModelActivePhoto(model, config.selectedColor);
            const selectedColorObj = model.colors.find((c) => c.name === config.selectedColor) || model.colors[0];

            // Constraint helper for Lithium battery choices
            const isVistaOrGlider = model.id === "vista" || model.id === "glider";

            return (
              <motion.div
                key={model.id}
                id={`model-card-${model.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between h-full relative group shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Free Badge */}
                <div className="absolute top-6 left-6 z-20 flex gap-2">
                  <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">
                    RTO FREE
                  </span>
                  {model.featured && (
                    <span className="bg-slate-750 text-white text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-full shadow-sm tracking-widest bg-slate-800">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Top Section Info & Color-Swatching Image preview */}
                <div className="space-y-6">
                  {/* Photo Display Card with real-time color switcher */}
                  <div className="relative border border-slate-100 bg-slate-50/80 rounded-2xl p-4 sm:p-8 overflow-hidden flex items-center justify-center min-h-[220px] sm:min-h-[280px]">
                    {/* Dynamic ambient color glow matched to selected color */}
                    <div 
                      className="absolute inset-0 opacity-15 pointer-events-none transition-colors duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${selectedColorObj?.hex || "#64748B"} 0%, transparent 70%)`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/50 via-transparent to-transparent z-10 pointer-events-none" />

                    {/* Active Color Pill Badge */}
                    <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2.5 py-1 rounded-full shadow-xs">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: selectedColorObj?.hex || "#FFFFFF" }}
                      />
                      <span className="text-[10px] font-bold text-slate-700 font-mono uppercase tracking-wider">
                        {config.selectedColor}
                      </span>
                    </div>

                    {/* Scooter Image with color transition */}
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`${model.id}-${config.selectedColor}-${activePhoto}`}
                        initial={{ opacity: 0.4, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.4, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        src={activePhoto}
                        alt={`Volmo ${model.name} in ${config.selectedColor}`}
                        referrerPolicy="no-referrer"
                        className="max-h-[180px] sm:max-h-[240px] w-auto object-contain select-none group-hover:scale-105 transition-transform duration-500 relative z-0"
                      />
                    </AnimatePresence>
                  </div>

                  {/* Model Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-850 uppercase sm:text-3xl font-sans">
                        VOLMO {model.name}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-1 italic font-semibold font-sans">
                        {model.tagline}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 text-[10px] uppercase font-mono tracking-widest block font-bold">
                        {priceInfo.hasModifier ? "Configured Price" : "Base Est. Starts"}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-slate-805 font-sans text-slate-800 transition-colors">
                        {priceInfo.formatted} *
                      </span>
                      {priceInfo.hasModifier ? (
                        <span className="text-[10px] font-mono block text-slate-400">
                          <span className="line-through mr-1">{model.basePriceEstimate}</span>
                          <span className={priceInfo.modifier > 0 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                            {priceInfo.modifier > 0 ? `(+₹${priceInfo.modifier.toLocaleString("en-IN")})` : `(-₹${Math.abs(priceInfo.modifier).toLocaleString("en-IN")})`}
                          </span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Base 60V SLA Pack
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Colors Customization Swatch */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>CHOOSE BODY COLOUR:</span>
                      <span className="text-slate-800 font-bold flex items-center gap-1.5">
                        <span 
                          className="inline-block w-2 h-2 rounded-full border border-slate-300"
                          style={{ backgroundColor: selectedColorObj?.hex || "#FFFFFF" }}
                        />
                        {config.selectedColor}
                      </span>
                    </div>

                    <div className="flex gap-2.5 flex-wrap items-center">
                      {model.colors.map((c) => {
                        const isSelected = config.selectedColor === c.name;
                        return (
                          <button
                            key={c.name}
                            onClick={() => handleColorChange(model.id, c.name)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center p-0.5 border cursor-pointer hover:scale-110 active:scale-95 transition-all relative ${
                              isSelected
                                ? "border-slate-900 ring-2 ring-slate-900/30 scale-110 shadow-sm"
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                            title={`Select ${c.name}`}
                            aria-label={`Select ${c.name} for ${model.name}`}
                          >
                            <span
                              className="w-full h-full rounded-full border border-slate-50/50 shadow-inner"
                              style={{ backgroundColor: c.hex }}
                            />
                            {isSelected && (
                              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-slate-900 rounded-full border-2 border-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Dynamic Battery Layout Engine */}
                  <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Configure Battery &amp; Range
                      </span>
                      <span className="text-[10px] bg-slate-200/50 text-slate-700 px-2 py-0.5 rounded-md font-mono font-bold">
                        Warranty Dependent
                      </span>
                    </div>

                    {/* Toggle Selector Type */}
                    <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-300/30">
                      <button
                        onClick={() => handleBatteryTypeToggle(model.id, "LA")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                          config.batteryType === "LA"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Lead Acid (LA)
                      </button>
                      <button
                        onClick={() => handleBatteryTypeToggle(model.id, "LI")}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                          config.batteryType === "LI"
                            ? "bg-slate-800 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Lithium Ion (LI)
                      </button>
                    </div>

                    {/* Dynamic Range Badges based on type */}
                    {config.batteryType === "LA" ? (
                      /* Lead Acid range layout (4, 5, or 6 batteries) */
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                             { count: 4, range: 48, label: "4 Batteries", delta: "-₹4,000" },
                             { count: 5, range: 60, label: "5 Batteries", delta: "Base Price" },
                             { count: 6, range: 72, label: "6 Batteries", delta: "+₹5,000" },
                          ].map((item) => (
                            <button
                              key={item.count}
                              type="button"
                              onClick={() => handleLeadAcidCountChange(model.id, item.count)}
                              className={`p-2.5 rounded-xl border transition-all text-center cursor-pointer ${
                                config.leadAcidCount === item.count
                                  ? "border-slate-800 bg-slate-100 text-slate-800 scale-[1.02] shadow-xs"
                                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                              }`}
                            >
                              <div className="font-sans font-black text-sm">{item.range} KM</div>
                              <div className="text-[10px] opacity-70 mt-0.5 leading-none">
                                {item.label}
                              </div>
                              <div className={`text-[9px] font-mono mt-1 font-bold ${item.count === 4 ? "text-amber-600" : item.count === 6 ? "text-emerald-600" : "text-slate-400"}`}>
                                {item.delta}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                       /* Lithium Ion Range layout with Vista/Glider size constraints! */
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { rangeVal: 60, delta: "+₹12,000" },
                            { rangeVal: 80, delta: "+₹18,000" },
                            { rangeVal: 100, delta: "+₹25,000" },
                            { rangeVal: 120, delta: "+₹32,000" },
                            { rangeVal: 145, delta: "+₹40,000" },
                            { rangeVal: 180, delta: "+₹49,000" },
                          ].map(({ rangeVal, delta }) => {
                            // Size limit constraint check
                            const isChoking = isVistaOrGlider && [120, 145, 180].includes(rangeVal);

                            return (
                              <button
                                key={rangeVal}
                                type="button"
                                disabled={isChoking}
                                onClick={() => handleLithiumRangeChange(model.id, rangeVal)}
                                className={`p-2.5 rounded-xl border transition-all text-center relative ${
                                  isChoking
                                    ? "border-slate-200 bg-slate-100 text-slate-300 cursor-not-allowed opacity-40"
                                    : config.lithiumRange === rangeVal
                                    ? "border-slate-700 bg-slate-100/50 text-slate-800 scale-[1.02] cursor-pointer shadow-xs"
                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                                }`}
                              >
                                <div className="font-sans font-black text-sm">{rangeVal} KM</div>
                                <div className="text-[10px] opacity-70 mt-0.5 leading-none">
                                  Single Pack
                                </div>
                                {!isChoking && (
                                  <div className="text-[9px] font-mono mt-1 font-bold text-emerald-600">
                                    {delta}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Informative Warning for Size constraints */}
                        {isVistaOrGlider && (
                          <div className="flex items-start gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-205 text-[11px] text-slate-700 leading-normal">
                            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-slate-500" />
                            <span>
                              <strong>Space Limit Warning</strong>: Vista and Glider compartments cannot accommodate 120km to 180km batteries due to structural battery compartment sizes.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Summary Diagnostics Panel */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] bg-white p-2.5 rounded-xl text-slate-600 border border-slate-150">
                      <div>
                        <span className="text-slate-450 block uppercase tracking-wider font-semibold text-[9px]">
                          🔋 Est. Ride Range
                        </span>
                        <strong className="text-slate-800 text-xs font-bold">{currentParams.range} KM per Charge</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block uppercase tracking-wider font-semibold text-[9px]">
                          ⏳ Smart Charge Time
                        </span>
                        <strong className="text-slate-800 text-xs font-bold">{currentParams.charging}</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block uppercase tracking-wider font-semibold text-[9px]">
                          🛠️ Battery Warranty
                        </span>
                        <strong className="text-emerald-600 text-xs font-bold">{currentParams.warranty}</strong>
                      </div>
                      <div>
                        <span className="text-slate-450 block uppercase tracking-wider font-semibold text-[9px]">
                          ⚡ Controller System
                        </span>
                        <strong className="text-slate-800 text-xs font-bold">Sine Wave 60V</strong>
                      </div>
                    </div>

                    {/* Sync status & Apply to all indicator */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                      <span className="flex items-center gap-1.5 font-medium text-[11px] text-slate-600">
                        <RefreshCw size={11} className={syncBatteryAcrossModels ? "text-emerald-600 animate-spin-slow" : "text-slate-400"} />
                        <span>{syncBatteryAcrossModels ? "Battery & price synced across fleet" : "Configured individually"}</span>
                      </span>
                      {!syncBatteryAcrossModels && (
                        <button
                          type="button"
                          onClick={() => handleApplyToAllModels(model.id)}
                          className="text-[10px] font-bold text-slate-800 hover:text-emerald-600 transition-colors cursor-pointer underline"
                        >
                          Apply to all models &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                  <button
                    onClick={() => setActiveModelId(model.id)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
                  >
                    <Eye size={15} />
                    <span>View Specifications &amp; Cockpit &rarr;</span>
                  </button>

                  <button
                    onClick={() =>
                      onEnquireClick(
                        model.id,
                        config.selectedColor,
                        config.batteryType,
                        config.batteryType === "LA" ? config.leadAcidCount * 12 : config.lithiumRange
                      )
                    }
                    className="w-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold py-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Zap size={14} className="text-slate-500" />
                    <span>Quick Price Enquiry</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming soon hyped model - Volmo Pulse Reveal */}
        <div className="mt-20 relative bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden min-h-[350px] p-6 lg:p-12 flex flex-col lg:flex-row items-center gap-8 shadow-2xl text-white">
          {/* Cyan underglow element mock */}
          <div className="absolute left-1/3 bottom-0 w-96 h-28 bg-slate-700/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Cyberpunk branding header */}
          <div className="absolute top-5 right-5 text-xs text-slate-350 font-mono tracking-widest font-black flex items-center gap-1.5 uppercase bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl z-10">
            <Flame size={12} className="animate-pulse" />
            <span>{siteSections?.pulseBadge || "Coming Soon Hyped"}</span>
          </div>

          <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center bg-slate-800/60 border border-slate-700 rounded-2xl p-4 sm:p-8 min-h-[220px] max-h-[340px] relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 z-10" />
            <img
              src={pulseData.image}
              alt="Volmo Pulse Project"
              referrerPolicy="no-referrer"
              className="max-h-[200px] sm:max-h-[280px] w-auto object-contain select-none group-hover:scale-110 duration-700 transition-transform relative z-0"
            />
          </div>

          <div className="space-y-6 w-full lg:w-1/2 relative z-10 text-center lg:text-left">
            <div>
              <span className="text-slate-400 font-mono text-[10px] font-bold tracking-widest uppercase mb-1.5 block">
                {siteSections?.pulseSecretCode || "Top Secret Project Volmo Rx"}
              </span>
              <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-none font-sans">
                {pulseData.name}
              </h3>
              <p className="text-slate-300 text-sm mt-1 uppercase tracking-widest font-bold">
                {pulseData.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-light">
              {pulseData.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="flex -space-x-1 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800"
                    style={{
                      backgroundImage: `url('https://avatar.iran.liara.run/public/${20 + i}')`,
                      backgroundSize: "cover",
                    }}
                  />
                ))}
              </div>
              <div className="text-xs text-slate-400 font-mono text-left">
                <span className="text-white font-bold block">{siteSections?.pulseCustomerCount || "1,840+ Customers"}</span>
                {siteSections?.pulseCustomerText || "Already pre-registered for the release drop inbox."}
              </div>
            </div>

            <div>
              {pulseSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/15 border border-emerald-500/35 p-4 rounded-xl text-emerald-400 text-xs font-mono text-center sm:text-left shadow-sm"
                >
                  <strong>Pre-registered Successfully!</strong> Pre-release specifications and VIP slot pricing will be emailed directly to <strong>piyushshivhare003@gmail.com</strong> soon.
                </motion.div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPulseSubscribed(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer active:scale-95 text-xs uppercase tracking-widest block"
                >
                  {siteSections?.pulseButtonText || "Notify Me first"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Genuine Volmo Accessories & Power Systems Quick Transition Banner */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>Original Volmo Accessories &amp; Power Systems</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Powered with Original Volmo Batteries &amp; German Tech Fast Chargers
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Volmo vehicles come with original Volmo manufactured lithium batteries and original Volmo lead acid batteries powered with top-notch quality and long durable life. Every vehicle is charged with a Volmo Branded German technology smart charger equipped with high-tech semiconductors and a 1-Year hassle-free warranty. Also protect your scooter with high-grade steel frame sets and official Volmo helmets.
            </p>
          </div>

          <div className="shrink-0">
            {onNavigateToAccessories && (
              <button
                type="button"
                onClick={onNavigateToAccessories}
                className="px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Explore Accessories</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
