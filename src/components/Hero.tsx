/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldCheck, ArrowDown, Award, Play, ArrowUpRight, BatteryCharging, Gauge } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

interface HeroProps {
  onExploreModels: () => void;
  onApplyPartnership: () => void;
  onReplayShutter?: () => void;
  onSelectModel?: (modelId: string) => void;
}

export default function Hero({
  onExploreModels,
  onApplyPartnership,
  onReplayShutter,
  onSelectModel,
}: HeroProps) {
  const { heroConfig, siteSections, modelsData } = useSiteConfig();
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState<number>(0);

  const showcaseSlides = [
    {
      id: "flagship",
      name: heroConfig.floatingTag || "Volmo Flagship Lineup",
      tagline: "100% CMVR RTO-Free · Zero Registration · German Sine-Wave Drive",
      image: heroConfig.coverPhoto || "/src/assets/images/volmo_hero_banner_1780063638602.png",
      range: "60 – 160 KM",
      speed: "25 KM/H (RTO Exempt)",
    },
    ...modelsData.map((m) => ({
      id: m.id,
      name: `Volmo ${m.name}`,
      tagline: m.tagline,
      image: m.colors?.[0]?.image || heroConfig.coverPhoto,
      range: "Up to 160 KM",
      speed: "25 KM/H (No License)",
    })),
  ];

  const currentSlide = showcaseSlides[activeShowcaseIdx] || showcaseSlides[0];

  return (
    <section className="relative min-h-[92vh] bg-slate-50 flex flex-col items-center justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-orange-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-[550px] h-[550px] bg-slate-400/[0.06] rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle architectural dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center gap-10 lg:gap-12">
        {/* Top Header & Copy */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Regulatory Exemption Line + Replay Shutter Trigger */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700"
          >
            <span className="inline-flex items-center gap-1.5 text-slate-800">
              <ShieldCheck size={15} className="text-orange-600" />
              <span>{heroConfig.badgeText || "No Registration · No License Required"}</span>
            </span>

            {onReplayShutter && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onReplayShutter}
                  className="inline-flex items-center gap-1.5 text-orange-600 hover:text-orange-700 font-bold underline underline-offset-4 cursor-pointer transition-colors"
                >
                  <Play size={12} className="fill-orange-600" />
                  <span>Replay Shutter Animation</span>
                </button>
              </>
            )}
          </motion.div>

          {/* Dynamic Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05] font-sans"
            >
              {heroConfig.headlinePart1 || "Sustainably Engineered."}
              <span className="block mt-2 bg-gradient-to-r from-slate-950 via-orange-600 to-slate-700 bg-clip-text text-transparent">
                {heroConfig.headlinePart2 || "Effortlessly Electric."}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-sans font-normal leading-relaxed max-w-2xl mx-auto"
            >
              {heroConfig.description}
            </motion.p>
          </div>

          {/* Primary & Secondary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onExploreModels}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/15 cursor-pointer active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2.5"
            >
              <span>{heroConfig.ctaPrimaryText || "Explore EV Fleet"}</span>
              <ArrowDown size={14} />
            </button>

            <button
              onClick={onApplyPartnership}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-2xl border border-slate-300 cursor-pointer active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm"
            >
              <span>{heroConfig.ctaSecondaryText || "Apply For Dealership"}</span>
            </button>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-1"
          >
            <div className="flex items-center gap-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xs">
              <div className="p-1.5 bg-orange-50 rounded-xl text-orange-600 flex-shrink-0">
                <Zap size={14} />
              </div>
              <div className="text-left font-sans text-xs">
                <div className="font-bold text-slate-800">{heroConfig.trustBadge1Title}</div>
                <div className="text-slate-500 font-medium leading-tight text-[11px]">{heroConfig.trustBadge1Subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xs">
              <div className="p-1.5 bg-orange-50 rounded-xl text-orange-600 flex-shrink-0">
                <Award size={14} />
              </div>
              <div className="text-left font-sans text-xs">
                <div className="font-bold text-slate-800">{heroConfig.trustBadge2Title}</div>
                <div className="text-slate-500 font-medium leading-tight text-[11px]">{heroConfig.trustBadge2Subtitle}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Showroom Stage & Live Vehicle Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative w-full space-y-4"
        >
          {/* Interactive Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-2 rounded-2xl shadow-xs">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {showcaseSlides.map((slide, idx) => {
                const isActive = idx === activeShowcaseIdx;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveShowcaseIdx(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {idx === 0 ? "Showroom Stage" : slide.name}
                  </button>
                );
              })}
            </div>

            {currentSlide.id !== "flagship" && onSelectModel && (
              <button
                type="button"
                onClick={() => onSelectModel(currentSlide.id)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <span>Configure {currentSlide.name}</span>
                <ArrowUpRight size={14} />
              </button>
            )}
          </div>

          {/* Main Showcase Photo Frame (100% Unobstructed Photo) */}
          <div className="relative bg-white border border-slate-200/90 p-2 sm:p-3.5 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-900/10 overflow-hidden">
            <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-slate-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide.id}
                  src={currentSlide.image}
                  alt={currentSlide.name}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full h-auto object-contain select-none block"
                />
              </AnimatePresence>
            </div>

            {/* Caption & Specs Bar Placed Cleanly Below the Photo */}
            <div className="pt-4 pb-2 px-3 sm:px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-orange-600 font-semibold">
                  <span>VOLMO SHOWROOM</span>
                  <span>·</span>
                  <span>100% ELECTRIC</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {currentSlide.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  {currentSlide.tagline}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <BatteryCharging size={15} className="text-emerald-600" />
                  <div>
                    <div className="text-[10px] text-slate-400">RANGE</div>
                    <div className="font-bold text-slate-900 tabular-nums">{currentSlide.range}</div>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2">
                  <Gauge size={15} className="text-orange-600" />
                  <div>
                    <div className="text-[10px] text-slate-400">CLASS</div>
                    <div className="font-bold text-slate-900">{currentSlide.speed}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll to Discover */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="pt-2 text-slate-400 hover:text-slate-600 flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-widest cursor-pointer select-none"
          onClick={onExploreModels}
        >
          <span>{siteSections?.heroScrollText || "Scroll to Discover"}</span>
          <div className="h-6 w-4 rounded-full border border-slate-300/80 flex items-start justify-center p-1">
            <div className="h-1.5 w-1 bg-slate-400 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
