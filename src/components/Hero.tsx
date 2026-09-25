/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Zap, ShieldCheck, ArrowDown, Building, Award } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

interface HeroProps {
  onExploreModels: () => void;
  onApplyPartnership: () => void;
}

export default function Hero({ onExploreModels, onApplyPartnership }: HeroProps) {
  const { heroConfig, siteSections } = useSiteConfig();

  return (
    <section className="relative min-h-[92vh] bg-slate-50 flex flex-col items-center justify-center py-12 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-slate-200">
      {/* Premium Ambient Electric Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-slate-400/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-[550px] h-[550px] bg-zinc-400/[0.05] rounded-full blur-[150px] pointer-events-none" />

      {/* Decorative cybertech grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center gap-10 lg:gap-14">
        {/* Top Header & Copy */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          {/* Core Regulatory Exemption Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-slate-200/80 border border-slate-300 text-slate-800 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-xs"
          >
            <ShieldCheck size={14} className="stroke-[2.5] text-slate-700" />
            <span>{heroConfig.badgeText || "No Registration · No License Required"}</span>
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
              <span className="block mt-2 bg-gradient-to-r from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-transparent">
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

          {/* Action button triggers */}
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

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-1"
          >
            <div className="flex items-center gap-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xs">
              <div className="p-1.5 bg-slate-100 rounded-xl text-slate-700 flex-shrink-0">
                <Zap size={14} />
              </div>
              <div className="text-left font-sans text-xs">
                <div className="font-bold text-slate-800">{heroConfig.trustBadge1Title}</div>
                <div className="text-slate-500 font-medium leading-tight text-[11px]">{heroConfig.trustBadge1Subtitle}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-xs">
              <div className="p-1.5 bg-slate-100 rounded-xl text-slate-700 flex-shrink-0">
                <Award size={14} />
              </div>
              <div className="text-left font-sans text-xs">
                <div className="font-bold text-slate-800">{heroConfig.trustBadge2Title}</div>
                <div className="text-slate-500 font-medium leading-tight text-[11px]">{heroConfig.trustBadge2Subtitle}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Website Front Banner: Large, Cinematic, High-Impact Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="relative w-full"
        >
          {/* Ambient luxury backdrop glow & shadows */}
          <div className="absolute inset-x-8 -bottom-10 h-20 bg-slate-900/15 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-slate-200/60 via-zinc-200/30 to-slate-200/60 rounded-[36px] sm:rounded-[44px] blur-md pointer-events-none" />

          {/* Banner Container */}
          <div className="relative bg-white border border-slate-200/90 p-2 sm:p-3.5 rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-900/10 overflow-hidden group">
            <div className="relative w-full h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-slate-900 pointer-events-auto">
              <motion.img
                src={heroConfig.coverPhoto || "/src/assets/images/volmo_hero_banner_1780063638602.png"}
                alt="Ultra high-tech premium Volmo Electric Scooter model cover banner"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.025 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full object-cover object-center select-none"
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30 pointer-events-none" />

              {/* Front Banner Floating Badges & Model Meta */}
              <div className="absolute bottom-5 sm:bottom-8 inset-x-5 sm:inset-x-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pointer-events-none">
                {/* Brand Tag Pill */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold tracking-wider uppercase font-sans">
                    {heroConfig.floatingTag || "Volmo Professional Series"}
                  </span>
                </div>

                {/* Sub-banner Quick Highlights */}
                <div className="hidden md:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-slate-300 px-4 py-2 rounded-2xl text-xs font-mono shadow-xl">
                  <span className="text-emerald-400 font-bold">100% Electric</span>
                  <span className="text-slate-600">•</span>
                  <span>No RTO Registration</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating scroll down element centered under banner */}
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
