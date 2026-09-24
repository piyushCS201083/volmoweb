/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BatteryCharging,
  Zap,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  ThermometerSnowflake,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  MessageCircle,
  Clock,
  Gauge,
  Info,
  Check,
  Compass,
  CornerDownRight,
  Activity
} from "lucide-react";
import {
  LEAD_ACID_GRAPHENE_BATTERIES,
  LITHIUM_LFP_BATTERY_MODELS,
  CHARGER_MODELS,
  DEFAULT_BATTERY_CHARGER_PAGE_CONFIG
} from "../data";
import { LeadAcidBatteryItem, LithiumLfpBatteryModel, ChargerModelItem } from "../types";
import { useSiteConfig } from "../SiteConfigContext";
import { Edit3 } from "lucide-react";

interface BatteryAndChargerProps {
  onEnquireClick?: (itemName: string) => void;
  onApplyPartnership?: () => void;
  onAdminEditClick?: () => void;
}

export default function BatteryAndCharger({ onEnquireClick, onApplyPartnership, onAdminEditClick }: BatteryAndChargerProps) {
  const { leadAcidBatteriesData, lithiumBatteriesData, chargersData, batteryChargerPageConfig } = useSiteConfig();
  const cfg = batteryChargerPageConfig || DEFAULT_BATTERY_CHARGER_PAGE_CONFIG;
  const currentLeadAcid = leadAcidBatteriesData || LEAD_ACID_GRAPHENE_BATTERIES;
  const currentLithium = lithiumBatteriesData || LITHIUM_LFP_BATTERY_MODELS;
  const currentChargers = chargersData || CHARGER_MODELS;

  const [activeTab, setActiveTab] = useState<"all" | "graphene" | "lithium" | "chargers">("all");

  // Model Slider Indices and Handlers
  const [leadAcidIdx, setLeadAcidIdx] = useState(0);
  const [lithiumIdx, setLithiumIdx] = useState(0);
  const [chargerIdx, setChargerIdx] = useState(0);
  const [chargerFilter, setChargerFilter] = useState<"all" | "lead-acid" | "lithium" | "lfp">("all");

  const filteredChargers = chargerFilter === "all"
    ? currentChargers
    : currentChargers.filter((c) => c.type === chargerFilter);

  const safeLeadAcidIdx = leadAcidIdx % currentLeadAcid.length;
  const activeLeadAcid = currentLeadAcid[safeLeadAcidIdx] || currentLeadAcid[0];
  const nextLeadAcidModel = currentLeadAcid[(safeLeadAcidIdx + 1) % currentLeadAcid.length];

  const safeLithiumIdx = lithiumIdx % currentLithium.length;
  const activeLithium = currentLithium[safeLithiumIdx] || currentLithium[0];
  const nextLithiumModel = currentLithium[(safeLithiumIdx + 1) % currentLithium.length];

  const safeChargerList = filteredChargers.length > 0 ? filteredChargers : currentChargers;
  const safeChargerIdx = chargerIdx % safeChargerList.length;
  const activeCharger = safeChargerList[safeChargerIdx] || safeChargerList[0];
  const nextChargerModel = safeChargerList[(safeChargerIdx + 1) % safeChargerList.length];

  const nextLeadAcid = () => setLeadAcidIdx((prev) => (prev + 1) % currentLeadAcid.length);
  const prevLeadAcid = () => setLeadAcidIdx((prev) => (prev - 1 + currentLeadAcid.length) % currentLeadAcid.length);

  const nextLithium = () => setLithiumIdx((prev) => (prev + 1) % currentLithium.length);
  const prevLithium = () => setLithiumIdx((prev) => (prev - 1 + currentLithium.length) % currentLithium.length);

  const nextCharger = () => setChargerIdx((prev) => (prev + 1) % safeChargerList.length);
  const prevCharger = () => setChargerIdx((prev) => (prev - 1 + safeChargerList.length) % safeChargerList.length);

  const [quoteModalItem, setQuoteModalItem] = useState<{
    title: string;
    specs: string;
    warranty: string;
    category: string;
  } | null>(null);

  const [quoteFormName, setQuoteFormName] = useState("");
  const [quoteFormPhone, setQuoteFormPhone] = useState("");
  const [quoteFormCity, setQuoteFormCity] = useState("");
  const [quoteFormQuantity, setQuoteFormQuantity] = useState("1 Unit (Personal Scooter)");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const handleOpenQuote = (title: string, specs: string, warranty: string, category: string) => {
    if (onEnquireClick) {
      onEnquireClick(`${title} (${specs})`);
    } else {
      setQuoteModalItem({ title, specs, warranty, category });
    }
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteFormName || !quoteFormPhone) return;
    setQuoteSubmitted(true);
    setTimeout(() => {
      setQuoteSubmitted(false);
      setQuoteModalItem(null);
      setQuoteFormName("");
      setQuoteFormPhone("");
      setQuoteFormCity("");
    }, 2800);
  };

  return (
    <div id="battery-and-charger" className="w-full bg-slate-50 text-slate-800 pb-28">
      {/* Top Hero Section */}
      <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -top-10 right-10 w-[400px] h-[300px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-600 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>{cfg.heroBadge}</span>
            </div>
            {onAdminEditClick && (
              <button
                type="button"
                onClick={onAdminEditClick}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-orange-400 border border-slate-750 text-xs font-mono font-bold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                title="Edit Battery & Charger in Admin Panel"
              >
                <Edit3 size={12} />
                <span>⚙️ Edit in Admin</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
            {cfg.heroTitlePart1} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              {cfg.heroTitlePart2}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            {cfg.heroSubtitle}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 text-left">
            {cfg.metrics.map((metric, idx) => {
              const colors = ["text-amber-600", "text-orange-600", "text-cyan-600", "text-emerald-600"];
              const colorClass = colors[idx % colors.length];
              return (
                <div key={idx} className="bg-white/90 backdrop-blur-sm border border-slate-200 p-4.5 rounded-2xl shadow-xs">
                  <span className={`text-[10px] font-mono font-bold ${colorClass} uppercase tracking-wider block`}>
                    {metric.label}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">{metric.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{metric.subtitle}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Section Navigation Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Power Lineup
            </button>
            <button
              onClick={() => setActiveTab("graphene")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "graphene"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Lead-Acid Graphene (1 Yr Warranty)
            </button>
            <button
              onClick={() => setActiveTab("lithium")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "lithium"
                  ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Lithium &amp; LFP Models (3 Yrs Warranty)
            </button>
            <button
              onClick={() => setActiveTab("chargers")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "chargers"
                  ? "bg-cyan-700 text-white shadow-md shadow-cyan-700/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              German Tech Chargers (1 Yr Warranty)
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 1: ORIGINAL LEAD ACID GRAPHENE BATTERIES */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "graphene") && (
        <section id="graphene-batteries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>{cfg.grapheneSectionBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase font-sans">
                  {cfg.grapheneSectionTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
                  {cfg.grapheneSectionSubtitle}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-xs">
                  {cfg.grapheneSpotlightBadge}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenQuote(
                      "Original Volmo Lead-Acid Graphene Battery System",
                      "48V / 60V / 72V Arrays",
                      "1 Year Hassle-Free Warranty",
                      "Lead-Acid Graphene"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Quote Price</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Spotlight Banner with Photo and Technical Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200/80">
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg group bg-white">
                  <img
                    src={cfg.grapheneSpotlightImage || currentLeadAcid[0]?.image || "/src/assets/images/volmo_graphene_battery_1790257155245.jpg"}
                    alt="Volmo Original Lead-Acid Graphene Battery Pack"
                    referrerPolicy="no-referrer"
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider">
                    Graphene Nano-Structure
                  </div>
                  <div className="absolute bottom-3 right-3 bg-amber-600 text-white px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                    {cfg.grapheneSpotlightBadge}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4 text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {cfg.grapheneSpotlightTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cfg.grapheneSpotlightSubtitle}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Warranty</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm text-amber-700">1 Year Hassle-Free</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Maintenance</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Zero Acid Refills (SMF)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Cycle Life</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">650+ Deep Cycles</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Plate Tech</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Tubular Graphene Grid</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Discharge Current</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">High Instant Torque</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">Road Stability</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">Vibration Isolated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphene Array Lineup Interactive Model Switcher & Slider */}
            <div className="space-y-6 pt-2">
              {/* Header Controls: Model Selector Pills and Sliding Right Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {/* Model Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Select Model:
                  </span>
                  {currentLeadAcid.map((battery, idx) => {
                    const isSelected = safeLeadAcidIdx === idx;
                    return (
                      <button
                        key={battery.id}
                        type="button"
                        onClick={() => setLeadAcidIdx(idx)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-102"
                            : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span>{battery.voltageRating.split(" ")[0]} Array</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                            isSelected ? "bg-amber-700/60 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {battery.capacity.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sliding Switcher Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Model {safeLeadAcidIdx + 1} of {currentLeadAcid.length}
                  </span>
                  <button
                    type="button"
                    onClick={prevLeadAcid}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Previous Lead-Acid Model"
                    aria-label="Previous Lead-Acid Model"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextLeadAcid}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/25 cursor-pointer active:scale-95 group"
                    title="Slide to Next Model"
                    aria-label="Next Lead-Acid Model"
                  >
                    <span>Next Model</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Active Model Showcase Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLeadAcid.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border-2 border-amber-500/30 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Model Details & Specs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-300">
                            {activeLeadAcid.voltageRating}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            {activeLeadAcid.capacity}
                          </span>
                          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                            {activeLeadAcid.warranty}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {activeLeadAcid.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {activeLeadAcid.description}
                        </p>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80">
                        {activeLeadAcid.specs.map((sp, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-1.5 border-b border-slate-200/50 last:border-0">
                            <span className="text-slate-500 font-medium">{sp.label}:</span>
                            <span className="font-bold text-slate-900 font-mono text-right">{sp.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features Highlights */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Key Engineering Highlights
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {activeLeadAcid.features.map((ft, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100">
                              <CheckCircle2 size={14} className="text-amber-600 shrink-0 mt-0.5" />
                              <span>{ft}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Sliding Action Box & Quote Button */}
                    <div className="lg:col-span-4 bg-gradient-to-br from-amber-50/70 to-orange-50/50 rounded-2xl p-6 border border-amber-200/80 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest block">
                          Instant Model Switcher
                        </span>

                        <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-xs space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">
                            Up Next in Lineup
                          </span>
                          <div className="font-bold text-slate-900 text-sm">
                            {nextLeadAcidModel.voltageRating.split("(")[0]}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {nextLeadAcidModel.capacity}
                          </div>
                        </div>

                        {/* Prominent Sliding Right Button */}
                        <button
                          type="button"
                          onClick={nextLeadAcid}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-600/30 cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
                        >
                          <span>Slide to Next Model</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-amber-200/60 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500">Official Factory Warranty:</span>
                          <span className="font-bold text-amber-700">1 Year Hassle-Free</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenQuote(
                              activeLeadAcid.title,
                              activeLeadAcid.voltageRating,
                              activeLeadAcid.warranty,
                              "Lead-Acid Graphene"
                            )
                          }
                          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Quote Price for {activeLeadAcid.voltageRating.split(" ")[0]}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: LITHIUM & LFP BATTERIES SHOWCASE */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "lithium") && (
        <section id="lithium-batteries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                  <Zap size={14} />
                  <span>{cfg.lithiumSectionBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase font-sans">
                  {cfg.lithiumSectionTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
                  {cfg.lithiumSectionSubtitle}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="px-3.5 py-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 font-mono font-bold text-xs">
                  {cfg.lithiumSpotlightBadge}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenQuote(
                      "Volmo Lithium / LFP Battery Fleet Inquiry",
                      "Models from 1.4 kW to 4.3 kW",
                      "3 Years Long Warranty",
                      "Lithium & LFP"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Quote Price</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Visual Photo Banners of the Models */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group bg-slate-900">
                <img
                  src="/src/assets/images/volmo_lithium_battery_1790255491526.jpg"
                  alt="Volmo Original Lithium Battery Pack with Handle"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                    Portable Handle &middot; Indoor Socket Charging
                  </span>
                  <h4 className="text-lg font-bold">Volmo Lithium-Ion Smart Series</h4>
                  <p className="text-xs text-slate-300 font-light mt-1">
                    60V 24Ah (1.4 kW) &middot; 60V 30Ah (1.8 kW) with 3 Years Long Warranty
                  </p>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group bg-slate-900">
                <img
                  src="/src/assets/images/volmo_lfp_battery_1790257174523.jpg"
                  alt="Volmo LFP Prismatic High Capacity Battery"
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    LFP Thermal Safe &middot; Prismatic Cells
                  </span>
                  <h4 className="text-lg font-bold">Volmo LFP Long-Range &amp; Commercial Fleet</h4>
                  <p className="text-xs text-slate-300 font-light mt-1">
                    2.16 kW (100km), 2.7 kW (120km), 3.6 kW (150km) &amp; 4.3 kW (180km)
                  </p>
                </div>
              </div>
            </div>

            {/* Lithium & LFP Interactive Model Switcher & Slider */}
            <div className="space-y-6 pt-2">
              {/* Header Controls: Model Selector Pills and Sliding Right Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {/* Model Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Select Model:
                  </span>
                  {currentLithium.map((model, idx) => {
                    const isSelected = safeLithiumIdx === idx;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setLithiumIdx(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-102"
                            : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span>{model.voltage} {model.capacity}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                            isSelected ? "bg-orange-700/60 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {model.powerKw}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sliding Switcher Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Model {safeLithiumIdx + 1} of {currentLithium.length}
                  </span>
                  <button
                    type="button"
                    onClick={prevLithium}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Previous Lithium Model"
                    aria-label="Previous Lithium Model"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextLithium}
                    className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/25 cursor-pointer active:scale-95 group"
                    title="Slide to Next Model"
                    aria-label="Next Lithium Model"
                  >
                    <span>Next Model</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Active Lithium Model Showcase Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLithium.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border-2 border-orange-500/30 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Model Details, Range, Specs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-orange-100 text-orange-950 px-3 py-1 rounded-lg border border-orange-300">
                            {activeLithium.chemistry}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            {activeLithium.voltage} &middot; {activeLithium.capacity}
                          </span>
                          <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                            {activeLithium.warranty}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {activeLithium.title}
                        </h3>

                        {/* Mileage and Power Callout Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-xl p-3">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Certified Range</span>
                            <span className="text-lg font-black text-orange-700 font-mono">{activeLithium.mileageKm}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Energy Output</span>
                            <span className="text-lg font-black text-slate-900 font-mono">{activeLithium.powerKw}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 col-span-2 sm:col-span-1">
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Smart Protection</span>
                            <span className="text-sm font-bold text-emerald-700 mt-1 block">Active Smart BMS</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                          {activeLithium.description}
                        </p>
                      </div>

                      {/* Technical Specs Snapshot */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80">
                        {activeLithium.specs.map((sp, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs p-1.5 border-b border-slate-200/50 last:border-0">
                            <span className="text-slate-500 font-medium">{sp.label}:</span>
                            <span className="font-bold text-slate-900 font-mono text-right">{sp.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Advanced Cell Features
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {activeLithium.features.map((ft, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100">
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span>{ft}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Sliding Action Box & Quote Button */}
                    <div className="lg:col-span-4 bg-gradient-to-br from-orange-50/70 to-amber-50/50 rounded-2xl p-6 border border-orange-200/80 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-orange-800 uppercase tracking-widest block">
                          Instant Model Switcher
                        </span>

                        <div className="bg-white rounded-xl p-4 border border-orange-200/60 shadow-xs space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">
                            Up Next in Lineup
                          </span>
                          <div className="font-bold text-slate-900 text-sm">
                            {nextLithiumModel.title}
                          </div>
                          <div className="text-xs text-orange-600 font-semibold">
                            {nextLithiumModel.mileageKm} &middot; {nextLithiumModel.powerKw}
                          </div>
                        </div>

                        {/* Prominent Sliding Right Button */}
                        <button
                          type="button"
                          onClick={nextLithium}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/30 cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
                        >
                          <span>Slide to Next Model</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-orange-200/60 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500">Official Factory Warranty:</span>
                          <span className="font-bold text-orange-600">3 Years Long Warranty</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenQuote(
                              activeLithium.title,
                              `${activeLithium.powerKw} · ${activeLithium.mileageKm}`,
                              activeLithium.warranty,
                              "Lithium/LFP Battery"
                            )
                          }
                          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Quote Price for {activeLithium.voltage} {activeLithium.capacity}</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* SECTION 3: GERMAN TECHNOLOGY CHARGERS SHOWCASE */}
      {/* ======================================================== */}
      {(activeTab === "all" || activeTab === "chargers") && (
        <section id="chargers-lineup" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-800 border border-cyan-500/20 text-xs font-mono font-bold uppercase tracking-wider">
                  <Cpu size={14} />
                  <span>{cfg.chargerSectionBadge}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase font-sans">
                  {cfg.chargerSectionTitle}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
                  {cfg.chargerSectionSubtitle}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="px-3.5 py-2 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono font-bold text-xs">
                  {cfg.chargerSpotlightBadge}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenQuote(
                      "Volmo German Tech Smart Charger Inquiry",
                      "Lead-Acid 3A / Lithium 6A / LFP 69V Cutoff",
                      "1 Year Hassle-Free Warranty",
                      "Charger Models"
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-700/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Quote Price</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Telemetry Bar & German Tech Features Highlight */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-800">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                      6-Light Smart Fast Charging LED Telemetry &middot; Pulse Repair Technology
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">
                    Equipped with High-Technology German Semiconductors
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Every charger features an interactive 6-LED progress telemetry dashboard showing power connection and real-time charging stages (20%, 40%, 60%, 80%, 100%). New generation pulse repair frequency desulfates lead plates and revives lithium battery cells for long durable life.
                  </p>

                  {/* 6-LED Telemetry Gauge Visual */}
                  <div className="grid grid-cols-6 gap-2 text-center text-[10px] sm:text-[11px] font-mono font-bold pt-2">
                    <div className="bg-red-500/20 text-red-300 border border-red-500/40 py-2 rounded-xl">
                      <span className="block text-[9px] text-slate-400">STATUS</span>
                      POWER
                    </div>
                    <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2 rounded-xl">
                      <span className="block text-[9px] text-slate-400">STAGE 1</span>
                      20%
                    </div>
                    <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2 rounded-xl">
                      <span className="block text-[9px] text-slate-400">STAGE 2</span>
                      40%
                    </div>
                    <div className="bg-amber-500/20 text-amber-300 border border-amber-500/40 py-2 rounded-xl">
                      <span className="block text-[9px] text-slate-400">STAGE 3</span>
                      60%
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 py-2 rounded-xl">
                      <span className="block text-[9px] text-slate-400">STAGE 4</span>
                      80%
                    </div>
                    <div className="bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 py-2 rounded-xl animate-pulse">
                      <span className="block text-[9px] text-slate-400">STAGE 5</span>
                      100%
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
                    <img
                      src="/src/assets/images/volmo_smart_charger_1790255476376.jpg"
                      alt="Volmo Smart German Technology Charger"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* German Technology Chargers Interactive Model Switcher & Slider */}
            <div className="space-y-6 pt-2">
              {/* Category Filter and Model Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {/* Category & Model Selectors */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
                    Filter Type:
                  </span>
                  {(
                    [
                      { id: "all", label: "All Chargers" },
                      { id: "lead-acid", label: "Lead-Acid (3A)" },
                      { id: "lithium", label: "Lithium Fast (6A)" },
                      { id: "lfp", label: "LFP Precision (69V)" },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setChargerFilter(cat.id);
                        setChargerIdx(0);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        chargerFilter === cat.id
                          ? "bg-cyan-700 text-white shadow-md shadow-cyan-700/30"
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sliding Switcher Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Model {safeChargerIdx + 1} of {safeChargerList.length}
                  </span>
                  <button
                    type="button"
                    onClick={prevCharger}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Previous Charger Model"
                    aria-label="Previous Charger Model"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextCharger}
                    className="px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-700/25 cursor-pointer active:scale-95 group"
                    title="Slide to Next Charger"
                    aria-label="Next Charger Model"
                  >
                    <span>Next Charger</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Model Pills for Current Filter */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                {safeChargerList.map((chg, idx) => {
                  const isSelected = safeChargerIdx === idx;
                  return (
                    <button
                      key={chg.id}
                      type="button"
                      onClick={() => setChargerIdx(idx)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {chg.voltage} {chg.amperage || chg.cutoffVoltage}
                    </button>
                  );
                })}
              </div>

              {/* Active Charger Showcase Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCharger.id}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-2xl border-2 border-cyan-500/30 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Charger Details & Specs */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-cyan-100 text-cyan-950 px-3 py-1 rounded-lg border border-cyan-300">
                            {activeCharger.voltage} &middot; {activeCharger.amperage || activeCharger.cutoffVoltage}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                            {activeCharger.modelCode}
                          </span>
                          <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-lg border border-cyan-200">
                            {activeCharger.warranty}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {activeCharger.typeLabel} ({activeCharger.voltage} {activeCharger.amperage || activeCharger.cutoffVoltage})
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {activeCharger.description}
                        </p>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4.5 border border-slate-200/80 text-xs">
                        <div className="flex justify-between items-center p-1.5 border-b border-slate-200/50">
                          <span className="text-slate-500 font-medium">Target Compatibility:</span>
                          <span className="font-bold text-slate-900 text-right">{activeCharger.compatibility}</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 border-b border-slate-200/50">
                          <span className="text-slate-500 font-medium">Cutoff System:</span>
                          <span className="font-bold text-cyan-800 font-mono">
                            {activeCharger.cutoffVoltage || "Automatic Float CCCV"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 border-b border-slate-200/50">
                          <span className="text-slate-500 font-medium">Semiconductor Core:</span>
                          <span className="font-bold text-slate-900">German Microchip MOSFET</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 border-b border-slate-200/50">
                          <span className="text-slate-500 font-medium">Telemetry:</span>
                          <span className="font-bold text-emerald-700">6-LED Real-time Stages</span>
                        </div>
                      </div>

                      {/* Features Highlights */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Protection & Charging Features
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {activeCharger.features.map((ft, idx) => (
                            <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100">
                              <CheckCircle2 size={14} className="text-cyan-700 shrink-0 mt-0.5" />
                              <span>{ft}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Sliding Action Box & Quote Button */}
                    <div className="lg:col-span-4 bg-gradient-to-br from-cyan-50/70 to-blue-50/50 rounded-2xl p-6 border border-cyan-200/80 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-cyan-800 uppercase tracking-widest block">
                          Instant Charger Switcher
                        </span>

                        <div className="bg-white rounded-xl p-4 border border-cyan-200/60 shadow-xs space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block">
                            Up Next in Lineup
                          </span>
                          <div className="font-bold text-slate-900 text-sm">
                            {nextChargerModel.typeLabel}
                          </div>
                          <div className="text-xs text-cyan-700 font-mono font-semibold">
                            {nextChargerModel.voltage} {nextChargerModel.amperage || nextChargerModel.cutoffVoltage}
                          </div>
                        </div>

                        {/* Prominent Sliding Right Button */}
                        <button
                          type="button"
                          onClick={nextCharger}
                          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-700/30 cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
                        >
                          <span>Slide to Next Charger</span>
                          <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
                        </button>
                      </div>

                      <div className="pt-4 border-t border-cyan-200/60 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-500">Official Factory Warranty:</span>
                          <span className="font-bold text-cyan-800">1 Year Hassle-Free</span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenQuote(
                              activeCharger.typeLabel,
                              `${activeCharger.voltage} ${activeCharger.amperage || activeCharger.cutoffVoltage}`,
                              activeCharger.warranty,
                              "Charger Models"
                            )
                          }
                          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                          <span>Quote Price for {activeCharger.voltage} Charger</span>
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

                {/* Technical Why 69V Cutoff Matters Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 uppercase">
                      <Info size={14} className="text-cyan-700" />
                      <span>Why 69V Cutoff is Essential for LFP</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      Precision Cutoff Protects 3,000+ Cycles
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lithium Iron Phosphate (LFP) chemistry operates with an ultra-flat voltage plateau. Standard NMC chargers that push past 71V cause irrevocable cathode stress and cell swelling. Volmo's 69V Cutoff terminates current at exactly 69.0V to guarantee long durable life past 3,000 charge cycles.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenQuote(
                          "Technical Consultation for LFP 69V Cutoff Charger",
                          "69V Cutoff Architecture",
                          "1 Year Hassle-Free Warranty",
                          "Technical Consultation"
                        )
                      }
                      className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer text-center"
                    >
                      Ask Volmo Engineers &rarr;
                    </button>
                  </div>
                </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* CUSTOM ENGINEERING CONSULTATION CTA */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap size={13} />
              <span>{cfg.consultationBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {cfg.consultationTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              {cfg.consultationSubtitle}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() =>
                handleOpenQuote(
                  cfg.consultationTitle,
                  "Custom Energy Consultation",
                  "Volmo Factory Support",
                  "Technical Consultation"
                )
              }
              className="px-7 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>{cfg.consultationButtonText}</span>
              <ChevronRight size={15} />
            </button>
            {onApplyPartnership && (
              <button
                type="button"
                onClick={onApplyPartnership}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                <span>Dealership Enquiries</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quote Price Modal */}
      <AnimatePresence>
        {quoteModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                    Direct Factory Pricing &middot; {quoteModalItem.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {quoteModalItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQuoteModalItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {quoteSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={38} className="text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Price Quote Sent!</h4>
                  <p className="text-xs text-emerald-700">
                    Our technical dispatches desk will connect with <strong>{quoteFormPhone}</strong> with authorized dealer pricing, battery warranty activation, and dispatch availability in <strong>{quoteFormCity || "your city"}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                    <span className="text-slate-500 font-medium">Selected Item:</span>
                    <span className="font-bold text-slate-900 block">{quoteModalItem.title}</span>
                    <div className="flex justify-between items-center pt-1 font-mono text-[11px]">
                      <span className="text-slate-600 font-bold">{quoteModalItem.specs}</span>
                      <span className="text-orange-600 font-bold">{quoteModalItem.warranty}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={quoteFormName}
                      onChange={(e) => setQuoteFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={quoteFormPhone}
                        onChange={(e) => setQuoteFormPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City / State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Indore, MP"
                        value={quoteFormCity}
                        onChange={(e) => setQuoteFormCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Purchase / Inquiring As</label>
                    <select
                      value={quoteFormQuantity}
                      onChange={(e) => setQuoteFormQuantity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                    >
                      <option value="1 Unit (Personal Scooter)">1 Unit — Personal Volmo Scooter Upgrade</option>
                      <option value="2-5 Units (Small Fleet)">2 - 5 Units — Delivery / Family Fleet</option>
                      <option value="Bulk Wholesale (Dealership/Distributor)">Bulk Wholesale — Dealership / Distributor</option>
                      <option value="Replacement Battery Under Warranty">Existing Volmo Owner Seeking Replacement</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuoteModalItem(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/20 cursor-pointer"
                    >
                      Request Quote
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
