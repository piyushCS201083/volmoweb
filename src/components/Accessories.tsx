/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Wrench,
  Check,
  ChevronRight,
  PhoneCall,
  ArrowRight,
  BatteryCharging,
  Zap,
  Cpu
} from "lucide-react";
import { DEFAULT_ACCESSORIES, DEFAULT_ACCESSORIES_PAGE_CONFIG } from "../data";
import { AccessoryItem } from "../types";
import { useSiteConfig } from "../SiteConfigContext";
import { Edit3 } from "lucide-react";

interface AccessoriesProps {
  onEnquireClick?: (accessoryTitle: string) => void;
  onApplyPartnership?: () => void;
  onNavigateToBatteryCharger?: () => void;
  onAdminEditClick?: () => void;
}

export default function Accessories({
  onEnquireClick,
  onApplyPartnership,
  onNavigateToBatteryCharger,
  onAdminEditClick
}: AccessoriesProps) {
  const { accessoriesData, accessoriesPageConfig } = useSiteConfig();
  const cfg = accessoriesPageConfig || DEFAULT_ACCESSORIES_PAGE_CONFIG;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryItem | null>(null);
  const [orderModalItem, setOrderModalItem] = useState<AccessoryItem | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerCity, setBuyerCity] = useState("");
  const [scooterModel, setScooterModel] = useState("Vista");

  const categories = [
    { id: "all", label: "All Genuine Accessories" },
    { id: "protection", label: "High-Grade Steel Guards" },
    { id: "helmet", label: "Certified Safety Helmets" },
    { id: "merchandise", label: "Official Merchandise & Gear" },
  ];

  const currentAccessories = accessoriesData || DEFAULT_ACCESSORIES;

  const filteredAccessories =
    activeCategory === "all"
      ? currentAccessories
      : currentAccessories.filter((item) => item.category === activeCategory);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setOrderModalItem(null);
      setBuyerName("");
      setBuyerPhone("");
      setBuyerCity("");
    }, 3000);
  };

  return (
    <div id="accessories" className="w-full bg-slate-50 text-slate-800 pb-24">
      {/* Hero Header Section */}
      <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-slate-100/60 border-b border-slate-200 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

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
                title="Edit Accessories & Page Headers in Admin Panel"
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

          {/* Quick Value Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6 text-left">
            {cfg.metrics.map((metric, idx) => {
              const icons = [Shield, ShieldCheck, Wrench, Award];
              const IconComponent = icons[idx % icons.length];
              const colors = [
                "bg-orange-50 text-orange-600",
                "bg-amber-50 text-amber-600",
                "bg-cyan-50 text-cyan-600",
                "bg-emerald-50 text-emerald-600"
              ];
              const colorClass = colors[idx % colors.length];

              return (
                <div key={idx} className="bg-white/80 backdrop-blur-sm border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
                  <div className={`w-9 h-9 rounded-xl ${colorClass} flex items-center justify-center mb-3`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{metric.title}</div>
                  <div className="text-xs text-slate-500 font-medium">{metric.subtitle}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prominent Dedicated Battery & Charger Page Redirect Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Zap size={13} />
              <span>{cfg.powerBannerBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {cfg.powerBannerTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {cfg.powerBannerDescription}
            </p>
          </div>

          <div className="shrink-0">
            {onNavigateToBatteryCharger && (
              <button
                type="button"
                onClick={onNavigateToBatteryCharger}
                className="px-6 py-3.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>{cfg.powerBannerButtonText}</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                    : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accessory Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAccessories.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Image & Badge Container */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden border-b border-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                    {item.categoryLabel}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-600 text-white px-2.5 py-1 rounded-full shadow-md">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3 text-left">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-widest block">
                      {item.warranty}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Key Highlights Bullet list */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider block">
                      Engineering Highlights:
                    </span>
                    <ul className="space-y-1.5">
                      {item.highlights.slice(0, 3).map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specs snapshot preview */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-left">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {item.specs.slice(0, 4).map((sp, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">
                          {sp.label}
                        </span>
                        <span className="font-bold text-slate-900 text-[11px] leading-tight block">
                          {sp.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedAccessory(item)}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    View Specs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onEnquireClick) {
                        onEnquireClick(item.title);
                      } else {
                        setOrderModalItem(item);
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-600/20 cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Order / Quote</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vehicle Protection Steel Frame Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-mono font-bold tracking-widest uppercase">
              <Shield size={14} className="text-orange-400" />
              <span>Volmo Manufactured Steel Accessories</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight font-sans">
              High-Grade Steel Frame Set To Protect Volmo Vehicles
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Every Volmo vehicle is precision-engineered for everyday urban commuting. To ensure maximum defense against scratches, parking lot scrapes, and unexpected side falls, Volmo manufactures custom high-grade steel frame sets crafted from heavy-gauge stainless steel tubing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">360° Perimeter Guard</div>
                <div className="text-xs text-slate-500">Wrap-around front apron bumper, side footrails, and tail arch.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">Anti-Corrosion Stainless Steel</div>
                <div className="text-xs text-slate-500">Rust-proof mirror chrome &amp; electro-coated matte black finishes.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">Integrated Pillion Pegs</div>
                <div className="text-xs text-slate-500">Heavy-duty foldaway footrests integrated into the steel chassis.</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">Zero-Drill Mounting</div>
                <div className="text-xs text-slate-500">Direct factory chassis bolts with vibration-damping bushings.</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => {
                  const steelItem = DEFAULT_ACCESSORIES.find((a) => a.id === "volmo-steel-frame-guard-set");
                  if (steelItem) setOrderModalItem(steelItem);
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Inquire Steel Guard Set</span>
                <ChevronRight size={15} />
              </button>
              <a
                href="tel:7880008401"
                className="px-6 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
              >
                <PhoneCall size={15} className="text-orange-600" />
                <span>Call Factory: 7880008401</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="/src/assets/images/volmo_steel_frame_1790255503151.jpg"
                alt="Volmo Manufactured High Grade Steel Frame Set"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Volmo Merchandise & Certified Helmets Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-3xl p-8 sm:p-12 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <span className="text-xs font-mono uppercase tracking-widest font-bold bg-white/20 px-3 py-1 rounded-full inline-block">
              Rider Lifestyle &amp; Safety Gear
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight font-sans">
              Volmo Merchandise &amp; Certified Helmets
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Ride with complete safety and confidence. We provide official ISI-certified aerodynamic Volmo helmets with anti-scratch UV visors and quick-release buckles, plus authentic Volmo riding merchandise including windproof jackets, riding gloves, and heavy-duty custom floor mats.
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold uppercase tracking-wider">
              <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">ISI Standard Certified</span>
              <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">Aerodynamic ABS Shell</span>
              <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">Reflective Riding Apparel</span>
              <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-white/20">Custom Floor Mats</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900">
              <img
                src="/src/assets/images/volmo_helmet_merch_1790255531049.jpg"
                alt="Volmo Official Helmets and Merchandise"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications Modal */}
      <AnimatePresence>
        {selectedAccessory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                    {selectedAccessory.categoryLabel} &middot; {selectedAccessory.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {selectedAccessory.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAccessory(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <img
                  src={selectedAccessory.image}
                  alt={selectedAccessory.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Technical Specifications
                </h4>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 divide-y divide-slate-200/80">
                  {selectedAccessory.specs.map((sp, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-medium">{sp.label}</span>
                      <span className="font-bold text-slate-900 font-mono text-right">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                  Complete Feature Highlights
                </h4>
                <ul className="space-y-2">
                  {selectedAccessory.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAccessory(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const acc = selectedAccessory;
                    setSelectedAccessory(null);
                    setOrderModalItem(acc);
                  }}
                  className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  Request Official Quote
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quote / Accessory Order Modal */}
      <AnimatePresence>
        {orderModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-wider block">
                    Direct Factory Accessory Request
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    {orderModalItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOrderModalItem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {orderSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Inquiry Received!</h4>
                  <p className="text-xs text-emerald-700">
                    Our accessories dispatched manager in Gwalior will reach out to <strong>{buyerPhone}</strong> with authorized dealer pricing &amp; dispatch schedule.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs space-y-1">
                    <span className="text-slate-500 font-medium">Selected Item:</span>
                    <span className="font-bold text-slate-900 block">{orderModalItem.title}</span>
                    <span className="text-orange-600 font-mono font-bold block">{orderModalItem.warranty}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
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
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City / State *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gwalior, MP"
                        value={buyerCity}
                        onChange={(e) => setBuyerCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Volmo Vehicle Model</label>
                    <select
                      value={scooterModel}
                      onChange={(e) => setScooterModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                    >
                      <option value="Vista">Volmo Vista (Lightweight Sporty)</option>
                      <option value="Glider">Volmo Glider (High Torque Urban)</option>
                      <option value="Classic">Volmo Classic (Dual Suspension Executive)</option>
                      <option value="Phantom">Volmo Phantom (Vintage Luxury)</option>
                      <option value="Other">Planning New Purchase / Dealership</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderModalItem(null)}
                      className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-orange-600/20 cursor-pointer"
                    >
                      Submit Request
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
