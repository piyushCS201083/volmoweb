/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, Save, ShieldCheck, Zap, Award, ArrowRight } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import { HeroConfig } from "../../data";

interface HeroCMSProps {
  onShowToast: (msg: string) => void;
}

export default function HeroCMS({ onShowToast }: HeroCMSProps) {
  const { heroConfig, updateHeroConfig, siteSections, updateSiteSections } = useSiteConfig();
  const [form, setForm] = useState<HeroConfig>(heroConfig);
  const [scrollText, setScrollText] = useState(siteSections?.heroScrollText || "Scroll to Discover");

  useEffect(() => {
    setForm(heroConfig);
  }, [heroConfig]);

  useEffect(() => {
    setScrollText(siteSections?.heroScrollText || "Scroll to Discover");
  }, [siteSections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroConfig(form);
    updateSiteSections({ ...siteSections, heroScrollText: scrollText });
    onShowToast("Hero & Cover Banner updated successfully!");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-orange-400" />
              Hero &amp; Cover Banner CMS
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize the frontpage hero banner photo, headline, regulatory badge, CTAs, and trust badges.
            </p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
          >
            <Save size={14} />
            Save Hero Section
          </button>
        </div>

        {/* 1. Cover Photo Uploader */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Frontpage Cover Photo / Banner
          </h4>
          <ImageUploader
            label="Hero Cover Scooter Banner Photo"
            value={form.coverPhoto || "/src/assets/images/volmo_hero_banner_1780063638602.png"}
            onChange={(newUrl) => setForm({ ...form, coverPhoto: newUrl })}
            aspectRatio="wide"
            helperText="Appears on right side of hero section"
          />
        </div>

        {/* 2. Headlines & Copy */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Badges &amp; Headlines
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Top Exemption Badge Text
            </label>
            <div className="relative">
              <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                value={form.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                placeholder="No Registration · No License Required"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Main Headline (Line 1)
              </label>
              <input
                type="text"
                value={form.headlinePart1}
                onChange={(e) => setForm({ ...form, headlinePart1: e.target.value })}
                placeholder="Sustainably Engineered."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Headline Accent (Line 2)
              </label>
              <input
                type="text"
                value={form.headlinePart2}
                onChange={(e) => setForm({ ...form, headlinePart2: e.target.value })}
                placeholder="Effortlessly Electric."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-orange-400 focus:outline-none focus:border-slate-600 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Subtitle Description Paragraph
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-slate-600 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Cover Photo Floating Pill Tag
            </label>
            <input
              type="text"
              value={form.floatingTag}
              onChange={(e) => setForm({ ...form, floatingTag: e.target.value })}
              placeholder="Volmo Professional Series"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
            />
          </div>
        </div>

        {/* 3. Call To Action Buttons */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            3. Call-To-Action (CTA) Buttons
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Primary Button Label (Scroll to Models)
              </label>
              <input
                type="text"
                value={form.ctaPrimaryText}
                onChange={(e) => setForm({ ...form, ctaPrimaryText: e.target.value })}
                placeholder="Explore EV Fleet"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Secondary Button Label (Dealership)
              </label>
              <input
                type="text"
                value={form.ctaSecondaryText}
                onChange={(e) => setForm({ ...form, ctaSecondaryText: e.target.value })}
                placeholder="Apply For Dealership"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Scroll Indicator Label (Bottom of Hero)
            </label>
            <input
              type="text"
              value={scrollText}
              onChange={(e) => setScrollText(e.target.value)}
              placeholder="Scroll to Discover"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
            />
          </div>
        </div>

        {/* 4. Trust Badges */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            4. Hero Trust Badges (Under Buttons)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trust Badge 1 */}
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Zap size={14} className="text-orange-400" />
                Badge 1 (Technology)
              </div>
              <input
                type="text"
                value={form.trustBadge1Title}
                onChange={(e) => setForm({ ...form, trustBadge1Title: e.target.value })}
                placeholder="German Sine Wave Controller"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
              <input
                type="text"
                value={form.trustBadge1Subtitle}
                onChange={(e) => setForm({ ...form, trustBadge1Subtitle: e.target.value })}
                placeholder="Ultra-quiet, responsive hub motor control"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400"
              />
            </div>

            {/* Trust Badge 2 */}
            <div className="space-y-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Award size={14} className="text-orange-400" />
                Badge 2 (Warranty)
              </div>
              <input
                type="text"
                value={form.trustBadge2Title}
                onChange={(e) => setForm({ ...form, trustBadge2Title: e.target.value })}
                placeholder="3-Year Warranty Cover"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-bold"
              />
              <input
                type="text"
                value={form.trustBadge2Subtitle}
                onChange={(e) => setForm({ ...form, trustBadge2Subtitle: e.target.value })}
                placeholder="Comprehensive peace-of-mind security"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-xl shadow-orange-600/25"
          >
            <Save size={16} />
            Save Hero Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
