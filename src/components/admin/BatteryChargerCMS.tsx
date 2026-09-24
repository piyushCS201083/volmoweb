/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Zap,
  BatteryCharging,
  Cpu,
  Plus,
  Trash2,
  Edit3,
  Save,
  Undo2,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Clock,
  Gauge,
  Layout,
  Layers
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import {
  LeadAcidBatteryItem,
  LithiumLfpBatteryModel,
  ChargerModelItem,
  BatteryChargerPageConfig
} from "../../types";
import {
  LEAD_ACID_GRAPHENE_BATTERIES,
  LITHIUM_LFP_BATTERY_MODELS,
  CHARGER_MODELS,
  DEFAULT_BATTERY_CHARGER_PAGE_CONFIG
} from "../../data";

interface BatteryChargerCMSProps {
  onShowToast: (msg: string) => void;
}

export default function BatteryChargerCMS({ onShowToast }: BatteryChargerCMSProps) {
  const {
    leadAcidBatteriesData,
    lithiumBatteriesData,
    chargersData,
    batteryChargerPageConfig,
    updateBatteryChargerPageConfig,
    updateLeadAcidBatteries,
    updateSingleLeadAcidBattery,
    addLeadAcidBattery,
    deleteLeadAcidBattery,
    updateLithiumBatteries,
    updateSingleLithiumBattery,
    addLithiumBattery,
    deleteLithiumBattery,
    updateChargers,
    updateSingleCharger,
    addCharger,
    deleteCharger,
  } = useSiteConfig();

  const [activeSubTab, setActiveSubTab] = useState<"graphene" | "lithium" | "chargers" | "page-layout">("graphene");

  // Page layout state
  const [pageForm, setPageForm] = useState<BatteryChargerPageConfig>(
    batteryChargerPageConfig || DEFAULT_BATTERY_CHARGER_PAGE_CONFIG
  );

  useEffect(() => {
    if (batteryChargerPageConfig) {
      setPageForm(batteryChargerPageConfig);
    }
  }, [batteryChargerPageConfig]);

  // Modal editing states
  const [editingGraphene, setEditingGraphene] = useState<LeadAcidBatteryItem | null>(null);
  const [isNewGraphene, setIsNewGraphene] = useState(false);

  const [editingLithium, setEditingLithium] = useState<LithiumLfpBatteryModel | null>(null);
  const [isNewLithium, setIsNewLithium] = useState(false);

  const [editingCharger, setEditingCharger] = useState<ChargerModelItem | null>(null);
  const [isNewCharger, setIsNewCharger] = useState(false);

  // ==========================================
  // GRAPHENE HANDLERS
  // ==========================================
  const handleStartCreateGraphene = () => {
    const newItem: LeadAcidBatteryItem = {
      id: `graphene_${Date.now()}`,
      title: "Volmo Original Lead-Acid Graphene Battery Array",
      voltageRating: "60V Array (5x 12V Units)",
      capacity: "32Ah Deep-Cycle",
      warranty: "1 Year Hassle-Free Warranty",
      badge: "1 Year Hassle-Free Warranty · Graphene Nano Tech",
      description: "Original Volmo manufactured Lead-Acid Graphene battery array with 1 Year Hassle-Free Warranty and long durable life.",
      specs: [
        { label: "Configuration", value: "5x 12V deep-cycle series" },
        { label: "Typical Range", value: "65 km - 75 km per charge" },
        { label: "Warranty Period", value: "1 Year Hassle-Free Factory Warranty" },
      ],
      features: [
        "Original Volmo manufactured high-density Graphene formulation",
        "1 Year Hassle-Free Warranty with direct swap protocol",
        "Tubular positive plates prevent material shedding"
      ],
      image: "/src/assets/images/volmo_graphene_battery_1790257155245.jpg",
    };
    setEditingGraphene(newItem);
    setIsNewGraphene(true);
  };

  const handleSaveGraphene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGraphene) return;
    if (isNewGraphene) {
      addLeadAcidBattery(editingGraphene);
      onShowToast(`Lead-Acid battery "${editingGraphene.title}" created!`);
    } else {
      updateSingleLeadAcidBattery(editingGraphene.id, editingGraphene);
      onShowToast(`Lead-Acid battery "${editingGraphene.title}" updated!`);
    }
    setEditingGraphene(null);
    setIsNewGraphene(false);
  };

  const handleDeleteGraphene = (id: string, title: string) => {
    if (window.confirm(`Delete battery pack "${title}"?`)) {
      deleteLeadAcidBattery(id);
      onShowToast(`Removed "${title}".`);
    }
  };

  // ==========================================
  // LITHIUM / LFP HANDLERS
  // ==========================================
  const handleStartCreateLithium = () => {
    const newItem: LithiumLfpBatteryModel = {
      id: `lithium_${Date.now()}`,
      title: "Volmo Lithium / LFP Smart Energy Pack",
      voltage: "60V",
      capacity: "30Ah",
      powerKw: "1.8 kW (1,800 Wh)",
      mileageKm: "80 km mileage",
      chemistry: "Lithium-Ion",
      warranty: "3 Years Long Warranty",
      highlightBadge: "60V 30Ah · 1.8 kW · 80 km Mileage",
      description: "Original Volmo manufactured Lithium power pack delivering long range, lightweight convenience, and backed by a 3 Years Long Warranty.",
      specs: [
        { label: "Voltage & Capacity", value: "60V 30Ah Nominal" },
        { label: "Total Energy Capacity", value: "1.8 kW (1.8 kWh)" },
        { label: "Certified Mileage", value: "80 km per full charge" },
        { label: "Warranty Coverage", value: "3 Years Long Official Warranty" }
      ],
      features: [
        "Original Volmo manufactured Grade-A energy cells",
        "Long 3 Years official warranty coverage",
        "Multi-tier Smart BMS with thermal protection"
      ],
      image: "/src/assets/images/volmo_lithium_battery_1790255491526.jpg",
    };
    setEditingLithium(newItem);
    setIsNewLithium(true);
  };

  const handleSaveLithium = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLithium) return;
    if (isNewLithium) {
      addLithiumBattery(editingLithium);
      onShowToast(`Lithium battery "${editingLithium.title}" created!`);
    } else {
      updateSingleLithiumBattery(editingLithium.id, editingLithium);
      onShowToast(`Lithium battery "${editingLithium.title}" updated!`);
    }
    setEditingLithium(null);
    setIsNewLithium(false);
  };

  const handleDeleteLithium = (id: string, title: string) => {
    if (window.confirm(`Delete lithium pack "${title}"?`)) {
      deleteLithiumBattery(id);
      onShowToast(`Removed "${title}".`);
    }
  };

  // ==========================================
  // CHARGER HANDLERS
  // ==========================================
  const handleStartCreateCharger = () => {
    const newItem: ChargerModelItem = {
      id: `charger_${Date.now()}`,
      type: "lead-acid",
      typeLabel: "Lead-Acid Battery Charger",
      modelCode: "VEPL-LA-603A",
      voltage: "60V",
      amperage: "3Ah (3.0A)",
      warranty: "1 Year Hassle-Free Warranty",
      badge: "1 Year Hassle-Free Warranty · German Tech",
      description: "Volmo Branded German technology smart fast charger equipped with high-tech semiconductors having long life, pulse repair technology, and 1 Year Hassle-Free Warranty.",
      compatibility: "60V Lead-Acid & Graphene 5-Battery Systems",
      specs: [
        { label: "Model Code", value: "VEPL-LA-603A" },
        { label: "Input Voltage", value: "180V - 260V AC ~ 50Hz" },
        { label: "DC Output", value: "60V - 74.0V Float @ 3.0A" },
        { label: "Warranty", value: "1 Year Hassle-Free Factory Warranty" }
      ],
      features: [
        "German technology semiconductors with long life and cool operation",
        "1 Year Hassle-Free Warranty guarantee",
        "6-Light Smart Fast Charging LED telemetry"
      ],
      image: "/src/assets/images/volmo_smart_charger_1790255476376.jpg",
    };
    setEditingCharger(newItem);
    setIsNewCharger(true);
  };

  const handleSaveCharger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharger) return;
    if (isNewCharger) {
      addCharger(editingCharger);
      onShowToast(`Charger "${editingCharger.modelCode}" created!`);
    } else {
      updateSingleCharger(editingCharger.id, editingCharger);
      onShowToast(`Charger "${editingCharger.modelCode}" updated!`);
    }
    setEditingCharger(null);
    setIsNewCharger(false);
  };

  const handleDeleteCharger = (id: string, code: string) => {
    if (window.confirm(`Delete charger model "${code}"?`)) {
      deleteCharger(id);
      onShowToast(`Removed "${code}".`);
    }
  };

  const handleResetBatteriesAndChargers = () => {
    if (window.confirm("Restore factory default Batteries & Chargers catalogue? Any custom edits will be reset.")) {
      updateLeadAcidBatteries(LEAD_ACID_GRAPHENE_BATTERIES);
      updateLithiumBatteries(LITHIUM_LFP_BATTERY_MODELS);
      updateChargers(CHARGER_MODELS);
      onShowToast("Restored all battery and charger models to factory defaults.");
    }
  };

  const handleSavePageConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateBatteryChargerPageConfig(pageForm);
    onShowToast("Battery & Charger page layout and spotlight headers saved!");
  };

  const handleResetPageConfig = () => {
    if (window.confirm("Reset Battery & Charger page headers and spotlights to default?")) {
      updateBatteryChargerPageConfig(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);
      setPageForm(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);
      onShowToast("Battery & Charger page headers reset to defaults.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-orange-400" />
              Battery &amp; Charger CMS
            </h3>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
              {leadAcidBatteriesData.length + lithiumBatteriesData.length + chargersData.length} Live Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage your original Volmo Lead-Acid Graphene batteries (1-Year Warranty), Lithium/LFP models from 1.4 kW to 4.3 kW (3-Years Warranty), and German Technology Smart Chargers (1-Year Warranty).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeSubTab === "page-layout" ? (
            <button
              type="button"
              onClick={handleResetPageConfig}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-700/80 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Undo2 size={13} />
              <span>Reset Page Headers</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResetBatteriesAndChargers}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-700/80 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to factory default"
            >
              <Undo2 size={13} />
              <span>Reset Defaults</span>
            </button>
          )}

          {activeSubTab === "graphene" && (
            <button
              type="button"
              onClick={handleStartCreateGraphene}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Graphene Array</span>
            </button>
          )}

          {activeSubTab === "lithium" && (
            <button
              type="button"
              onClick={handleStartCreateLithium}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20 flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Lithium Pack</span>
            </button>
          )}

          {activeSubTab === "chargers" && (
            <button
              type="button"
              onClick={handleStartCreateCharger}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Add Charger Model</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("graphene")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "graphene"
              ? "bg-amber-600 text-white shadow-md border border-amber-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <BatteryCharging size={14} />
          <span>Lead-Acid Graphene Arrays ({leadAcidBatteriesData.length})</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">1 Yr War.</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("lithium")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "lithium"
              ? "bg-orange-600 text-white shadow-md border border-orange-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Zap size={14} />
          <span>Lithium &amp; LFP Models ({lithiumBatteriesData.length})</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">3 Yrs War.</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("chargers")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "chargers"
              ? "bg-cyan-600 text-white shadow-md border border-cyan-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Cpu size={14} />
          <span>German Tech Chargers ({chargersData.length})</span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">1 Yr War.</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("page-layout")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === "page-layout"
              ? "bg-orange-600 text-white shadow-md border border-orange-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Layout size={14} />
          <span>Page Headers, Metrics &amp; Spotlights</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: LEAD-ACID GRAPHENE BATTERIES */}
      {/* ========================================================= */}
      {activeSubTab === "graphene" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadAcidBatteriesData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-amber-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {item.voltageRating}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                      {item.warranty}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">
                      {item.capacity} &middot; {item.badge}
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-850 space-y-1 text-xs text-slate-300">
                    {item.specs.slice(0, 3).map((sp, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{sp.label}:</span>
                        <span className="font-bold text-slate-200">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    1 Year Hassle-Free Warranty
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGraphene(JSON.parse(JSON.stringify(item)));
                        setIsNewGraphene(false);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 size={13} className="text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteGraphene(item.id, item.title)}
                      className="p-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: LITHIUM & LFP BATTERY MODELS */}
      {/* ========================================================= */}
      {activeSubTab === "lithium" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lithiumBatteriesData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {item.chemistry}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/90 text-orange-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                      {item.powerKw}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-orange-400 mb-0.5">
                      <span>{item.voltage} &middot; {item.capacity}</span>
                      <span className="text-emerald-400">{item.mileageKm}</span>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlight Banner */}
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-300 font-mono">
                      {item.highlightBadge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.mileageKm}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-850 space-y-1 text-xs text-slate-300">
                    {item.specs.slice(0, 3).map((sp, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{sp.label}:</span>
                        <span className="font-bold text-slate-200">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    3 Years Long Warranty
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLithium(JSON.parse(JSON.stringify(item)));
                        setIsNewLithium(false);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 size={13} className="text-orange-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLithium(item.id, item.title)}
                      className="p-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: GERMAN TECHNOLOGY CHARGERS */}
      {/* ========================================================= */}
      {activeSubTab === "chargers" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {chargersData.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-800">
                    <img
                      src={item.image}
                      alt={item.typeLabel}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-cyan-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                      {item.type}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/90 text-cyan-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                      {item.voltage} &middot; {item.amperage}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 mb-0.5">
                      <span>{item.modelCode}</span>
                      <span className="text-slate-400">{item.warranty}</span>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">
                      {item.typeLabel} ({item.voltage} {item.amperage})
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {item.cutoffVoltage && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-1.5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                        Precision Cutoff:
                      </span>
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {item.cutoffVoltage}
                      </span>
                    </div>
                  )}

                  {/* Compatibility */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-850 space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Fleet Fit:</span>
                      <span className="font-bold text-slate-200 text-right">{item.compatibility}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Warranty:</span>
                      <span className="font-bold text-cyan-400">{item.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    German Semiconductors
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCharger(JSON.parse(JSON.stringify(item)));
                        setIsNewCharger(false);
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 size={13} className="text-cyan-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCharger(item.id, item.modelCode)}
                      className="p-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: PAGE HEADERS, METRICS & SPOTLIGHTS */}
      {/* ========================================================= */}
      {activeSubTab === "page-layout" && (
        <form onSubmit={handleSavePageConfig} className="space-y-6">
          {/* Top Hero Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Sparkles size={16} className="text-orange-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Top Hero Header Settings
              </h4>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Hero Top Badge Tag
              </label>
              <input
                type="text"
                value={pageForm.heroBadge}
                onChange={(e) => setPageForm({ ...pageForm, heroBadge: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                placeholder="e.g. Volmo Energy Systems · Factory Direct"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Headline Part 1
                </label>
                <input
                  type="text"
                  value={pageForm.heroTitlePart1}
                  onChange={(e) => setPageForm({ ...pageForm, heroTitlePart1: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. Battery & Charger"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Headline Part 2 (Gradient Highlight)
                </label>
                <input
                  type="text"
                  value={pageForm.heroTitlePart2}
                  onChange={(e) => setPageForm({ ...pageForm, heroTitlePart2: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. Power Solutions"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Hero Description Paragraph
              </label>
              <textarea
                rows={3}
                value={pageForm.heroSubtitle}
                onChange={(e) => setPageForm({ ...pageForm, heroSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
                placeholder="Original Volmo manufactured Lead-Acid Graphene batteries with 1 Year Hassle-Free Warranty..."
              />
            </div>
          </div>

          {/* 4 Value Metrics Cards */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  4 Value Metrics Cards
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Displayed under hero title</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pageForm.metrics.map((metric, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <span className="text-[10px] text-orange-400 font-mono uppercase font-bold block">
                    Card #{idx + 1}
                  </span>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Category Label</label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => {
                        const next = [...pageForm.metrics];
                        next[idx] = { ...next[idx], label: e.target.value };
                        setPageForm({ ...pageForm, metrics: next });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Metric Value</label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => {
                        const next = [...pageForm.metrics];
                        next[idx] = { ...next[idx], value: e.target.value };
                        setPageForm({ ...pageForm, metrics: next });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 focus:outline-none focus:border-orange-500 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-mono">Subtitle</label>
                    <input
                      type="text"
                      value={metric.subtitle}
                      onChange={(e) => {
                        const next = [...pageForm.metrics];
                        next[idx] = { ...next[idx], subtitle: e.target.value };
                        setPageForm({ ...pageForm, metrics: next });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: Lead-Acid Graphene Spotlight & Section Intro */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <BatteryCharging size={16} className="text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Lead-Acid Graphene: Section &amp; Spotlight Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={pageForm.grapheneSectionBadge}
                  onChange={(e) => setPageForm({ ...pageForm, grapheneSectionBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Heading Title
                </label>
                <input
                  type="text"
                  value={pageForm.grapheneSectionTitle}
                  onChange={(e) => setPageForm({ ...pageForm, grapheneSectionTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={pageForm.grapheneSectionSubtitle}
                onChange={(e) => setPageForm({ ...pageForm, grapheneSectionSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Spotlight Banner */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
              <h5 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wider">
                Graphene Spotlight Banner Card
              </h5>
              <ImageUploader
                label="Spotlight Feature Image"
                value={pageForm.grapheneSpotlightImage}
                onChange={(url) => setPageForm({ ...pageForm, grapheneSpotlightImage: url })}
                helperText="Upload image or choose preset for the Graphene spotlight showcase"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Card Title
                  </label>
                  <input
                    type="text"
                    value={pageForm.grapheneSpotlightTitle}
                    onChange={(e) => setPageForm({ ...pageForm, grapheneSpotlightTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Badge
                  </label>
                  <input
                    type="text"
                    value={pageForm.grapheneSpotlightBadge}
                    onChange={(e) => setPageForm({ ...pageForm, grapheneSpotlightBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                  Spotlight Story Description
                </label>
                <textarea
                  rows={2}
                  value={pageForm.grapheneSpotlightSubtitle}
                  onChange={(e) => setPageForm({ ...pageForm, grapheneSpotlightSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lithium & LFP Spotlight & Section Intro */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Zap size={16} className="text-orange-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Lithium &amp; LFP: Section &amp; Spotlight Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={pageForm.lithiumSectionBadge}
                  onChange={(e) => setPageForm({ ...pageForm, lithiumSectionBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Heading Title
                </label>
                <input
                  type="text"
                  value={pageForm.lithiumSectionTitle}
                  onChange={(e) => setPageForm({ ...pageForm, lithiumSectionTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={pageForm.lithiumSectionSubtitle}
                onChange={(e) => setPageForm({ ...pageForm, lithiumSectionSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Spotlight Banner */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
              <h5 className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                Lithium Spotlight Banner Card
              </h5>
              <ImageUploader
                label="Spotlight Feature Image"
                value={pageForm.lithiumSpotlightImage}
                onChange={(url) => setPageForm({ ...pageForm, lithiumSpotlightImage: url })}
                helperText="Upload image or choose preset for the Lithium spotlight showcase"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Card Title
                  </label>
                  <input
                    type="text"
                    value={pageForm.lithiumSpotlightTitle}
                    onChange={(e) => setPageForm({ ...pageForm, lithiumSpotlightTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Badge
                  </label>
                  <input
                    type="text"
                    value={pageForm.lithiumSpotlightBadge}
                    onChange={(e) => setPageForm({ ...pageForm, lithiumSpotlightBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                  Spotlight Story Description
                </label>
                <textarea
                  rows={2}
                  value={pageForm.lithiumSpotlightSubtitle}
                  onChange={(e) => setPageForm({ ...pageForm, lithiumSpotlightSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: German Tech Chargers Spotlight & Section Intro */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Cpu size={16} className="text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                German Tech Chargers: Section &amp; Spotlight Settings
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={pageForm.chargerSectionBadge}
                  onChange={(e) => setPageForm({ ...pageForm, chargerSectionBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Section Heading Title
                </label>
                <input
                  type="text"
                  value={pageForm.chargerSectionTitle}
                  onChange={(e) => setPageForm({ ...pageForm, chargerSectionTitle: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={pageForm.chargerSectionSubtitle}
                onChange={(e) => setPageForm({ ...pageForm, chargerSectionSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Spotlight Banner */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 space-y-4">
              <h5 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider">
                Chargers Spotlight Banner Card
              </h5>
              <ImageUploader
                label="Spotlight Feature Image"
                value={pageForm.chargerSpotlightImage}
                onChange={(url) => setPageForm({ ...pageForm, chargerSpotlightImage: url })}
                helperText="Upload image or choose preset for the Charger spotlight showcase"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Card Title
                  </label>
                  <input
                    type="text"
                    value={pageForm.chargerSpotlightTitle}
                    onChange={(e) => setPageForm({ ...pageForm, chargerSpotlightTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                    Spotlight Badge
                  </label>
                  <input
                    type="text"
                    value={pageForm.chargerSpotlightBadge}
                    onChange={(e) => setPageForm({ ...pageForm, chargerSpotlightBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                  Spotlight Story Description
                </label>
                <textarea
                  rows={2}
                  value={pageForm.chargerSpotlightSubtitle}
                  onChange={(e) => setPageForm({ ...pageForm, chargerSpotlightSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Bottom Consultation Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Zap size={16} className="text-orange-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Bottom Custom Engineering Consultation CTA
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Banner Badge Tag
                </label>
                <input
                  type="text"
                  value={pageForm.consultationBadge}
                  onChange={(e) => setPageForm({ ...pageForm, consultationBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Button Action Text
                </label>
                <input
                  type="text"
                  value={pageForm.consultationButtonText}
                  onChange={(e) => setPageForm({ ...pageForm, consultationButtonText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Banner Headline Title
              </label>
              <input
                type="text"
                value={pageForm.consultationTitle}
                onChange={(e) => setPageForm({ ...pageForm, consultationTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Banner Description Text
              </label>
              <textarea
                rows={2}
                value={pageForm.consultationSubtitle}
                onChange={(e) => setPageForm({ ...pageForm, consultationSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20 flex items-center gap-2"
            >
              <Save size={15} />
              <span>Save Page Layout &amp; Spotlights</span>
            </button>
          </div>
        </form>
      )}
      {editingGraphene && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-600/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                  <BatteryCharging size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isNewGraphene ? "Add Lead-Acid Graphene Battery Array" : "Edit Graphene Battery Array"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Original Volmo manufactured battery specifications and 1-Year warranty details.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGraphene(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGraphene} className="space-y-4">
              <ImageUploader
                label="Graphene Battery Photo"
                value={editingGraphene.image}
                onChange={(url) => setEditingGraphene({ ...editingGraphene, image: url })}
                helperText="Upload custom image or select high-resolution battery preset"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Battery Model Title
                  </label>
                  <input
                    type="text"
                    value={editingGraphene.title}
                    onChange={(e) => setEditingGraphene({ ...editingGraphene, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Voltage Rating / Array
                  </label>
                  <input
                    type="text"
                    value={editingGraphene.voltageRating}
                    onChange={(e) => setEditingGraphene({ ...editingGraphene, voltageRating: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 60V Array (5x 12V Heavy-Duty Graphene Units)"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Capacity Specification
                  </label>
                  <input
                    type="text"
                    value={editingGraphene.capacity}
                    onChange={(e) => setEditingGraphene({ ...editingGraphene, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 32Ah - 36Ah Deep-Cycle"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Warranty Term
                  </label>
                  <input
                    type="text"
                    value={editingGraphene.warranty}
                    onChange={(e) => setEditingGraphene({ ...editingGraphene, warranty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 1 Year Hassle-Free Warranty"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={editingGraphene.badge}
                  onChange={(e) => setEditingGraphene({ ...editingGraphene, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 1 Year Hassle-Free Warranty · Top Seller"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingGraphene.description}
                  onChange={(e) => setEditingGraphene({ ...editingGraphene, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingGraphene(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isNewGraphene ? "Create Battery Array" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: EDIT LITHIUM / LFP BATTERY */}
      {/* ========================================================= */}
      {editingLithium && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-600/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isNewLithium ? "Add Lithium / LFP Battery Model" : "Edit Lithium / LFP Battery Model"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure voltage, capacity, kW power, certified mileage, and 3-Years warranty.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingLithium(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveLithium} className="space-y-4">
              <ImageUploader
                label="Lithium / LFP Battery Photo"
                value={editingLithium.image}
                onChange={(url) => setEditingLithium({ ...editingLithium, image: url })}
                helperText="Upload custom image or select high-resolution battery preset"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Model Title
                  </label>
                  <input
                    type="text"
                    value={editingLithium.title}
                    onChange={(e) => setEditingLithium({ ...editingLithium, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Chemistry
                  </label>
                  <select
                    value={editingLithium.chemistry}
                    onChange={(e) => setEditingLithium({ ...editingLithium, chemistry: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Lithium-Ion">Lithium-Ion (NMC / Smart Series)</option>
                    <option value="LFP (Lithium Iron Phosphate)">LFP (Lithium Iron Phosphate High Thermal)</option>
                  </select>
                </div>
              </div>

              {/* Voltage, Capacity, Power kW, Mileage */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Voltage
                  </label>
                  <input
                    type="text"
                    value={editingLithium.voltage}
                    onChange={(e) => setEditingLithium({ ...editingLithium, voltage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="60V"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={editingLithium.capacity}
                    onChange={(e) => setEditingLithium({ ...editingLithium, capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="30Ah"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Power kW
                  </label>
                  <input
                    type="text"
                    value={editingLithium.powerKw}
                    onChange={(e) => setEditingLithium({ ...editingLithium, powerKw: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="1.8 kW (1,800 Wh)"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Certified Mileage
                  </label>
                  <input
                    type="text"
                    value={editingLithium.mileageKm}
                    onChange={(e) => setEditingLithium({ ...editingLithium, mileageKm: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="80 km mileage"
                    required
                  />
                </div>
              </div>

              {/* Warranty & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={editingLithium.warranty}
                    onChange={(e) => setEditingLithium({ ...editingLithium, warranty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="3 Years Long Warranty"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Highlight Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingLithium.highlightBadge}
                    onChange={(e) => setEditingLithium({ ...editingLithium, highlightBadge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="60V 30Ah · 1.8 kW · 80 km Mileage"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingLithium.description}
                  onChange={(e) => setEditingLithium({ ...editingLithium, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLithium(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isNewLithium ? "Create Battery Pack" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT CHARGER */}
      {/* ========================================================= */}
      {editingCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-600/10 text-cyan-500 flex items-center justify-center border border-cyan-500/20">
                  <Cpu size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isNewCharger ? "Add German Tech Charger Model" : "Edit German Tech Charger Model"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure German semiconductor smart charger, voltage, amperage, cutoff, and compatibility.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCharger(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCharger} className="space-y-4">
              <ImageUploader
                label="Charger Model Photo"
                value={editingCharger.image}
                onChange={(url) => setEditingCharger({ ...editingCharger, image: url })}
                helperText="Upload custom image or select high-resolution charger preset"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Charger Category
                  </label>
                  <select
                    value={editingCharger.type}
                    onChange={(e) => {
                      const t = e.target.value as "lead-acid" | "lithium" | "lfp";
                      const map: Record<string, string> = {
                        "lead-acid": "Lead-Acid Battery Charger",
                        lithium: "Lithium Fast Charger",
                        lfp: "LFP Battery Charger",
                      };
                      setEditingCharger({
                        ...editingCharger,
                        type: t,
                        typeLabel: map[t] || "Smart Charger",
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="lead-acid">Lead-Acid Charger (48V/60V/72V 3A)</option>
                    <option value="lithium">Lithium Fast Charger (48V/60V/72V 6A)</option>
                    <option value="lfp">LFP Charger (69V Precision Cutoff)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Model Code
                  </label>
                  <input
                    type="text"
                    value={editingCharger.modelCode}
                    onChange={(e) => setEditingCharger({ ...editingCharger, modelCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. VEPL-LI-606A"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Voltage Rating
                  </label>
                  <input
                    type="text"
                    value={editingCharger.voltage}
                    onChange={(e) => setEditingCharger({ ...editingCharger, voltage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 60V"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Amperage Rating
                  </label>
                  <input
                    type="text"
                    value={editingCharger.amperage}
                    onChange={(e) => setEditingCharger({ ...editingCharger, amperage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 6Ah (6.0A Fast Charge)"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Precision Cutoff (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingCharger.cutoffVoltage || ""}
                    onChange={(e) => setEditingCharger({ ...editingCharger, cutoffVoltage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 69.0V Precision Cutoff"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={editingCharger.warranty}
                    onChange={(e) => setEditingCharger({ ...editingCharger, warranty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    placeholder="1 Year Hassle-Free Warranty"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Vehicle Compatibility
                </label>
                <input
                  type="text"
                  value={editingCharger.compatibility}
                  onChange={(e) => setEditingCharger({ ...editingCharger, compatibility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Volmo 60V Lithium Fleet (24Ah, 30Ah, 36Ah, 45Ah Packs)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCharger.description}
                  onChange={(e) => setEditingCharger({ ...editingCharger, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCharger(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-600/20 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isNewCharger ? "Create Charger Model" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
