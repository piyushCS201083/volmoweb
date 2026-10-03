/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, Check, RefreshCw } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import { PRESET_MEDIA_ASSETS, getModelActivePhoto } from "../../data";

interface PhotosCMSProps {
  onShowToast: (msg: string) => void;
}

export default function PhotosCMS({ onShowToast }: PhotosCMSProps) {
  const {
    heroConfig,
    updateHeroConfig,
    modelsData,
    updateModelSpec,
    pulseData,
    updatePulseData,
    brandingConfig,
    updateBrandingConfig,
    testimonialsData,
    updateSingleTestimonial,
  } = useSiteConfig();

  const [activeCategory, setActiveCategory] = useState<"all" | "cover" | "fleet" | "concept" | "branding" | "reviews">("all");

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <ImageIcon size={18} className="text-orange-400" />
              Everphoto Site Media Manager
            </h3>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold uppercase">
              100% No-Code
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every photo used across the website can be modified here with instant preview. Upload custom PNG/JPG/WebP images from your computer or switch between high-res studio presets. Changes save immediately to your live site!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: "all", label: "All Photos" },
            { id: "cover", label: "Hero Cover" },
            { id: "fleet", label: `Scooters (${modelsData.length})` },
            { id: "concept", label: "Pulse Concept" },
            { id: "branding", label: "Brand Logo" },
            { id: "reviews", label: "Rider Avatars" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photo Controls */}
      <div className="space-y-6">
        {/* 1. HERO COVER PHOTO */}
        {(activeCategory === "all" || activeCategory === "cover") && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md">
                  Section: Frontpage Hero
                </span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hero Cover Photo Banner
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Shown prominently at top of website
              </span>
            </div>

            <ImageUploader
              label="Homepage Main Cover Photo"
              value={heroConfig.coverPhoto || "/src/assets/images/volmo_hero_banner_1780063638602.png"}
              onChange={(newUrl) => {
                updateHeroConfig({ coverPhoto: newUrl });
                onShowToast("Hero cover photo updated successfully!");
              }}
              helperText="Aspect ratio: 4:3 or 16:9 recommended"
              aspectRatio="wide"
            />
          </div>
        )}

        {/* 2. FLEET SCOOTER MODELS */}
        {(activeCategory === "all" || activeCategory === "fleet") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={15} className="text-orange-400" />
                Scooter Fleet Catalog Photos
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {modelsData.length} Models Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {modelsData.map((model) => (
                <div
                  key={model.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                    <span className="font-bold text-sm text-white">{model.name}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-md uppercase font-mono">
                      {model.id}
                    </span>
                  </div>

                  <ImageUploader
                    label={`${model.name} Base Photo`}
                    value={model.image}
                    onChange={(newVal) => {
                      updateModelSpec(model.id, { image: newVal });
                      onShowToast(`Updated photo for ${model.name}`);
                    }}
                    aspectRatio="video"
                    presets={PRESET_MEDIA_ASSETS.filter((p) => p.category === "Fleet Models")}
                  />

                  {/* Individual Color Photos */}
                  <div className="pt-3 border-t border-slate-900 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Color Variant Photos ({model.colors.length} Variants)
                    </span>
                    <div className="space-y-2.5">
                      {model.colors.map((c) => (
                        <div key={c.name} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-slate-200">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block shadow-inner"
                                style={{ backgroundColor: c.hex }}
                              />
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {c.image ? "Custom Photo Set" : "Using Preset"}
                            </span>
                          </div>
                          <ImageUploader
                            label={`${c.name} Variant Image`}
                            value={c.image || getModelActivePhoto(model, c.name)}
                            onChange={(newVal) => {
                              const updatedColors = model.colors.map((col) => 
                                col.name === c.name ? { ...col, image: newVal } : col
                              );
                              updateModelSpec(model.id, { colors: updatedColors });
                              onShowToast(`Updated ${c.name} photo for ${model.name}`);
                            }}
                            aspectRatio="video"
                            presets={PRESET_MEDIA_ASSETS.filter((p) => p.category === "Fleet Models")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PULSE FLAGSHIP CONCEPT */}
        {(activeCategory === "all" || activeCategory === "concept") && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                  Section: Pulse Teaser
                </span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Volmo Pulse Cyberpunk Prototype Photo
                </h4>
              </div>
            </div>

            <ImageUploader
              label="Pulse Teaser Showcase Image"
              value={pulseData.image || "/src/assets/images/volmo_pulse_premium_1780068389740.png"}
              onChange={(newVal) => {
                updatePulseData({ image: newVal });
                onShowToast("Pulse flagship photo updated!");
              }}
              aspectRatio="wide"
              presets={PRESET_MEDIA_ASSETS.filter((p) => p.category === "Concept Prototypes")}
            />
          </div>
        )}

        {/* 4. BRAND LOGO */}
        {(activeCategory === "all" || activeCategory === "branding") && (
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Section: Navbar &amp; Footer
                </span>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Brand Logo / Emblem Photo
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Custom override for the official Volmo PNG logo
              </span>
            </div>

            <ImageUploader
              label="Custom Brand Logo Image (PNG)"
              value={brandingConfig.customLogoUrl || ""}
              onChange={(newVal) => {
                updateBrandingConfig({ customLogoUrl: newVal });
                onShowToast(newVal ? "Custom logo image uploaded!" : "Reset to official PNG logo.");
              }}
              helperText="Transparent background PNG recommended"
              aspectRatio="wide"
            />
            {brandingConfig.customLogoUrl && (
              <button
                type="button"
                onClick={() => {
                  updateBrandingConfig({ customLogoUrl: "" });
                  onShowToast("Restored official Volmo PNG logo.");
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold underline"
              >
                Clear custom logo &amp; restore official PNG logo
              </button>
            )}
          </div>
        )}

        {/* 5. RIDER TESTIMONIAL AVATARS */}
        {(activeCategory === "all" || activeCategory === "reviews") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={15} className="text-orange-400" />
                Customer Reviewer Profile Photos
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {testimonialsData.length} Reviews
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {testimonialsData.map((test) => (
                <div
                  key={test.id}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-slate-900">
                    <span className="font-bold text-sm text-white">{test.name}</span>
                    <span className="text-xs text-slate-400">{test.location}</span>
                  </div>

                  <ImageUploader
                    label={`Photo for ${test.name}`}
                    value={test.avatarUrl || ""}
                    onChange={(newVal) => {
                      updateSingleTestimonial(test.id, { avatarUrl: newVal });
                      onShowToast(`Updated avatar photo for ${test.name}`);
                    }}
                    helperText="Leave empty to use initials avatar"
                    aspectRatio="square"
                  />
                  {test.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateSingleTestimonial(test.id, { avatarUrl: "" });
                        onShowToast(`Reset avatar to initials for ${test.name}`);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                    >
                      Clear photo &amp; use initials
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
