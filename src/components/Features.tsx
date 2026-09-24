/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  ShieldAlert,
  Usb,
  Disc,
  RotateCcw,
  CircleDot,
  Activity,
  Zap,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

// Type-safe icon mapper to avoid arbitrary string indexing issues during compile
const getFeatureIcon = (iconName: string) => {
  switch (iconName) {
    case "ShieldAlert":
      return <ShieldAlert size={28} className="text-slate-600" />;
    case "Usb":
      return <Usb size={28} className="text-slate-600" />;
    case "Disc":
      return <Disc size={28} className="text-slate-600" />;
    case "RotateCcw":
      return <RotateCcw size={28} className="text-slate-600" />;
    case "CircleDot":
      return <CircleDot size={28} className="text-slate-600" />;
    case "Activity":
      return <GaugeIcon size={28} className="text-slate-600" />;
    default:
      return <Cpu size={28} className="text-slate-600" />;
  }
};

function GaugeIcon(props: any) {
  return <Activity {...props} />;
}

export default function Features() {
  const { commonFeatures, siteSections } = useSiteConfig();

  return (
    <section id="features" className="py-24 bg-white border-b border-slate-200 relative">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-slate-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs uppercase tracking-widest font-bold text-slate-700 font-mono">
            {siteSections?.featuresBadge || "High-Performance Standards"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 font-sans">
            {siteSections?.featuresHeading || "Next-Gen Features. Fully Integrated."}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal font-sans max-w-xl mx-auto">
            {siteSections?.featuresSubtitle || "Every Volmo electric scooter is equipped with premium security, utility, and safety features at no additional cost. Ready to conquer Indian city streets."}
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonFeatures.map((feat, idx) => (
            <motion.div
              key={feat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group bg-slate-50 hover:bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl transition-all h-full flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-350"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                  {getFeatureIcon(feat.icon)}
                </div>
                <h3 className="text-lg font-bold text-slate-850 group-hover:text-slate-905 transition-colors">
                  {feat.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {feat.description}
                </p>
              </div>

              {/* Aesthetic indicator line */}
              <div className="h-0.5 w-0 group-hover:w-1/3 bg-slate-700 mt-6 transition-all duration-300 rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Heavy Technology Schematic Block (advanced sine wave controller & warranty) */}
        <div className="mt-20 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden shadow-sm">
          {/* Cyber lines background decoration */}
          <div className="absolute right-0 bottom-0 top-0 w-2/3 bg-[radial-gradient(ellipse_at_bottom_right,rgba(148,163,184,0.03),transparent_50%)] pointer-events-none" />

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ShieldCheck size={12} />
              <span>{siteSections?.sineBadge || "Full Bumper Protection Guarantee"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {siteSections?.sineHeading || "Advanced Sine Wave Intelligence & Bumper 1-Year Warranty"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal">
              {siteSections?.sineDescription || "Generic electric scooters use square-wave motor currents that result in jerky acceleration and noisy hums. Every Volmo EV is integrated with custom-tuned Sine Wave controllers. By regulating raw electricity in perfect, smooth digital sine curves, we deliver completely silent operation, optimized torque transition, and up to 15% better range efficiency."}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-705 font-bold text-lg mb-1">{siteSections?.sineCard1Title || "100% Silent"}</div>
                <div className="text-slate-650 text-xs">{siteSections?.sineCard1Text || "Smooth harmonic waves prevent high-frequency engine whine."}</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-slate-705 font-bold text-lg mb-1">{siteSections?.sineCard2Title || "Regen Brakes"}</div>
                <div className="text-slate-650 text-xs">{siteSections?.sineCard2Text || "Converts braking inertial momentum directly into state of charge."}</div>
              </div>
            </div>
          </div>

          {/* Technical Blueprint Visualiser */}
          <div className="border border-slate-200 bg-[#F1F5F9]/50 p-6 rounded-2xl relative">
            <div className="absolute top-3 right-3 text-[9px] text-slate-400 font-mono">SYS_DIAG_OK</div>
            <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider mb-4 border-b border-slate-200 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{siteSections?.sineWarrantyTitle || "Bumper 1-Year Active Warranties"}</span>
            </h4>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-800 font-semibold">1000W / 1200W Hub Motor</span>
                <span className="text-slate-650 font-bold text-[11px] font-mono uppercase">1 Year Cover</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-800 font-semibold">German Sine Wave Controller</span>
                <span className="text-slate-650 font-bold text-[11px] font-mono uppercase">1 Year Cover</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-800 font-semibold">High-Grade DCDC Converter</span>
                <span className="text-slate-650 font-bold text-[11px] font-mono uppercase">1 Year Cover</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                <span className="text-slate-800 font-semibold">Auto-Cut Smart Charger</span>
                <span className="text-slate-650 font-bold text-[11px] font-mono uppercase">1 Year Cover</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-205 leading-relaxed">
              <div className="p-1.5 bg-slate-200/60 text-slate-605 rounded-lg">
                <Zap size={14} />
              </div>
              <span>
                <strong>Note regarding Batteries</strong>: Battery warranties depend entirely on battery specification (Lead Acid LA: 1 Year &middot; Lithium Ion LI: 3 Years).
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
