/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Save,
  Undo2,
  Check,
  X,
  Sparkles,
  Award,
  Wrench,
  Package,
  Layout,
  Sliders,
  Zap,
  ArrowRight,
  Layers
} from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import { AccessoryItem, AccessoriesPageConfig } from "../../types";
import { DEFAULT_ACCESSORIES, DEFAULT_ACCESSORIES_PAGE_CONFIG } from "../../data";

interface AccessoriesCMSProps {
  onShowToast: (msg: string) => void;
}

export default function AccessoriesCMS({ onShowToast }: AccessoriesCMSProps) {
  const {
    accessoriesData,
    updateAccessoriesData,
    updateSingleAccessory,
    addAccessory,
    deleteAccessory,
    accessoriesPageConfig,
    updateAccessoriesPageConfig,
  } = useSiteConfig();

  // Sub-tabs: "catalog" (Items List) vs "page-layout" (Header, Metrics, Power Banner)
  const [activeTab, setActiveTab] = useState<"catalog" | "page-layout">("catalog");

  // Catalog item editing
  const [editingItem, setEditingItem] = useState<AccessoryItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Page layout draft
  const [pageForm, setPageForm] = useState<AccessoriesPageConfig>(accessoriesPageConfig || DEFAULT_ACCESSORIES_PAGE_CONFIG);

  useEffect(() => {
    if (accessoriesPageConfig) {
      setPageForm(accessoriesPageConfig);
    }
  }, [accessoriesPageConfig]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "protection", label: "Steel Frame Guards" },
    { id: "helmet", label: "Safety Helmets" },
    { id: "merchandise", label: "Merchandise & Gear" },
  ];

  const filteredItems =
    filterCategory === "all"
      ? accessoriesData
      : accessoriesData.filter((item) => item.category === filterCategory);

  const handleStartCreate = () => {
    const newItem: AccessoryItem = {
      id: `acc_${Date.now()}`,
      category: "protection",
      categoryLabel: "Vehicle Protection",
      title: "New Volmo Accessory",
      subtitle: "Engineered specifically for Volmo electric scooters",
      badge: "Genuine Volmo Accessory",
      description: "High durability authentic Volmo manufactured accessory crafted to elevate your riding safety and comfort.",
      warranty: "1 Year Manufacturer Guarantee",
      highlights: [
        "Precision engineered for factory chassis fitment",
        "High-grade weather-resistant finish",
        "Direct bolt-on installation without modifications"
      ],
      specs: [
        { label: "Material Grade", value: "High-Grade Engineered Material" },
        { label: "Compatibility", value: "Universal Fit for Volmo Fleet" },
        { label: "Warranty", value: "1 Year Official Warranty" }
      ],
      image: "/src/assets/images/volmo_steel_frame_1790255503151.jpg",
      inStock: true,
    };
    setEditingItem(newItem);
    setIsCreatingNew(true);
  };

  const handleStartEdit = (item: AccessoryItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setIsCreatingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (isCreatingNew) {
      addAccessory(editingItem);
      onShowToast(`Accessory "${editingItem.title}" created successfully!`);
    } else {
      updateSingleAccessory(editingItem.id, editingItem);
      onShowToast(`Accessory "${editingItem.title}" updated successfully!`);
    }

    setEditingItem(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from the accessories catalogue?`)) {
      deleteAccessory(id);
      onShowToast(`Removed "${title}".`);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Restore factory default accessories catalogue? Any custom accessories will be reset.")) {
      updateAccessoriesData(DEFAULT_ACCESSORIES);
      onShowToast("Restored factory default accessories catalogue.");
    }
  };

  // Helper to handle specs
  const handleUpdateSpec = (idx: number, field: "label" | "value", val: string) => {
    if (!editingItem) return;
    const nextSpecs = [...editingItem.specs];
    nextSpecs[idx] = { ...nextSpecs[idx], [field]: val };
    setEditingItem({ ...editingItem, specs: nextSpecs });
  };

  const handleAddSpec = () => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      specs: [...editingItem.specs, { label: "New Spec", value: "Specification Details" }],
    });
  };

  const handleRemoveSpec = (idx: number) => {
    if (!editingItem) return;
    const nextSpecs = editingItem.specs.filter((_, i) => i !== idx);
    setEditingItem({ ...editingItem, specs: nextSpecs });
  };

  // Helper to handle highlights
  const handleUpdateHighlight = (idx: number, val: string) => {
    if (!editingItem) return;
    const next = [...editingItem.highlights];
    next[idx] = val;
    setEditingItem({ ...editingItem, highlights: next });
  };

  const handleAddHighlight = () => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      highlights: [...editingItem.highlights, "New feature highlight point"],
    });
  };

  const handleRemoveHighlight = (idx: number) => {
    if (!editingItem) return;
    const next = editingItem.highlights.filter((_, i) => i !== idx);
    setEditingItem({ ...editingItem, highlights: next });
  };

  // Page Layout Save
  const handleSavePageConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccessoriesPageConfig(pageForm);
    onShowToast("Accessories page layout & headers saved successfully!");
  };

  const handleResetPageConfig = () => {
    if (window.confirm("Reset accessories page headers and banners to default?")) {
      updateAccessoriesPageConfig(DEFAULT_ACCESSORIES_PAGE_CONFIG);
      setPageForm(DEFAULT_ACCESSORIES_PAGE_CONFIG);
      onShowToast("Accessories page headers reset to defaults.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* CMS Top Header */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Shield size={18} className="text-orange-400" />
              Accessories &amp; Merchandise CMS
            </h3>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
              {accessoriesData.length} Items Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage your genuine vehicle protection sets, steel frame guards, ISI safety helmets, official Volmo rider merchandise, and customize page banners and metric cards.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === "catalog" ? (
            <>
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-700/80 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                title="Reset accessories to factory default"
              >
                <Undo2 size={13} />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleStartCreate}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20 flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add New Accessory</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResetPageConfig}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-700/80 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Undo2 size={13} />
              <span>Reset Page Headers</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab view switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "catalog"
              ? "bg-orange-600 text-white shadow-md border border-orange-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Package size={14} />
          <span>Accessories Catalogue ({accessoriesData.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("page-layout")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "page-layout"
              ? "bg-orange-600 text-white shadow-md border border-orange-500"
              : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          }`}
        >
          <Layout size={14} />
          <span>Page Header, Banners &amp; Metrics</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: CATALOGUE ITEMS MANAGER */}
      {/* ======================================================== */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? "bg-orange-600 text-white shadow-sm border border-orange-500"
                    : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all"
              >
                <div className="space-y-3">
                  {/* Image Preview & Badges */}
                  <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video border border-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/90 text-orange-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-800 uppercase">
                      {item.categoryLabel}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-slate-900/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                      {item.warranty}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 block mb-0.5">
                      {item.badge}
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Highlights summary */}
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-850 space-y-1 text-xs text-slate-300">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block font-bold">
                      Key Specs &amp; Protection:
                    </span>
                    {item.specs.slice(0, 2).map((sp, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-400">{sp.label}:</span>
                        <span className="font-bold text-slate-200">{sp.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${item.inStock ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    {item.inStock ? "● In Stock" : "○ Sold Out"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 size={13} className="text-orange-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl transition-all cursor-pointer"
                      title="Delete accessory"
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

      {/* ======================================================== */}
      {/* VIEW 2: PAGE HEADER, METRICS & POWER BANNER SETTINGS */}
      {/* ======================================================== */}
      {activeTab === "page-layout" && (
        <form onSubmit={handleSavePageConfig} className="space-y-6">
          {/* Hero Header Section */}
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
                placeholder="e.g. Original Volmo Equipment · Genuine Accessories"
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
                  placeholder="e.g. Vehicle Protection"
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
                  placeholder="e.g. & Official Gear"
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
                placeholder="Safeguard your electric scooter with Volmo manufactured high-grade steel accessories..."
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
                    <label className="text-[11px] text-slate-400 font-mono">Metric Title</label>
                    <input
                      type="text"
                      value={metric.title}
                      onChange={(e) => {
                        const next = [...pageForm.metrics];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setPageForm({ ...pageForm, metrics: next });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
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

          {/* Dedicated Battery & Charger Redirect Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-850 pb-3">
              <Zap size={16} className="text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Battery &amp; Charger Hub Redirect Banner
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Banner Badge Tag
                </label>
                <input
                  type="text"
                  value={pageForm.powerBannerBadge}
                  onChange={(e) => setPageForm({ ...pageForm, powerBannerBadge: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. Dedicated Power Page"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                  Action Button Text
                </label>
                <input
                  type="text"
                  value={pageForm.powerBannerButtonText}
                  onChange={(e) => setPageForm({ ...pageForm, powerBannerButtonText: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                  placeholder="e.g. Go To Battery & Charger"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Banner Headline Title
              </label>
              <input
                type="text"
                value={pageForm.powerBannerTitle}
                onChange={(e) => setPageForm({ ...pageForm, powerBannerTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="e.g. Looking for Original Volmo Batteries & German Tech Chargers?"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase font-mono">
                Banner Description Text
              </label>
              <textarea
                rows={3}
                value={pageForm.powerBannerDescription}
                onChange={(e) => setPageForm({ ...pageForm, powerBannerDescription: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                placeholder="Visit our new dedicated Battery & Charger page for complete specs..."
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
              <span>Save Page Layout &amp; Headers</span>
            </button>
          </div>
        </form>
      )}

      {/* Edit / Create Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-600/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isCreatingNew ? "Add New Accessory" : "Edit Accessory Details"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live changes are reflected across the accessories page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Photo Uploader */}
              <div className="space-y-1.5">
                <ImageUploader
                  label="Accessory Product Image"
                  value={editingItem.image}
                  onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                  helperText="Upload custom image or select high-resolution studio preset"
                />
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Accessory Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Volmo High-Grade Steel Guard Frame Set"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => {
                      const cat = e.target.value as "protection" | "merchandise" | "helmet";
                      const labelMap: Record<string, string> = {
                        protection: "Vehicle Protection",
                        helmet: "Helmets & Safety",
                        merchandise: "Official Merchandise",
                      };
                      setEditingItem({
                        ...editingItem,
                        category: cat,
                        categoryLabel: labelMap[cat] || "Accessories",
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="protection">Vehicle Protection (Steel Guards)</option>
                    <option value="helmet">Helmets &amp; Safety (ISI Certified)</option>
                    <option value="merchandise">Official Merchandise &amp; Gear</option>
                  </select>
                </div>
              </div>

              {/* Subtitle & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Subtitle / Summary
                  </label>
                  <input
                    type="text"
                    value={editingItem.subtitle}
                    onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. 360° All-Around Heavy-Duty Stainless Steel Body Protection"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Highlight Badge Text
                  </label>
                  <input
                    type="text"
                    value={editingItem.badge}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. High Grade Stainless Steel · Rust Proof"
                  />
                </div>
              </div>

              {/* Warranty & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Warranty Specification
                  </label>
                  <input
                    type="text"
                    value={editingItem.warranty}
                    onChange={(e) => setEditingItem({ ...editingItem, warranty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. 2 Years Corrosion & Structure Warranty"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.inStock}
                      onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono">
                    {editingItem.inStock ? "Item In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 leading-relaxed"
                  placeholder="Describe manufacturing quality, materials, and benefits..."
                />
              </div>

              {/* Bullet Highlights */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Feature Highlights (Bullet Points)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Bullet Point</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingItem.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{idx + 1}.</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => handleUpdateHighlight(idx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Specs Table */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider">
                    Technical Specifications (Key / Value)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="text-[11px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Specification</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editingItem.specs.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Spec Label (e.g. Material)"
                        value={sp.label}
                        onChange={(e) => handleUpdateSpec(idx, "label", e.target.value)}
                        className="w-1/3 bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 18-Gauge Steel)"
                        value={sp.value}
                        onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20 flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>{isCreatingNew ? "Create Accessory" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
