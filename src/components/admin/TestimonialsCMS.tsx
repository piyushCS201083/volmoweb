/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Edit3, Save, Star, ShieldCheck, User, X, Sparkles } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import { TestimonialItem } from "../../data";

interface TestimonialsCMSProps {
  onShowToast: (msg: string) => void;
}

export default function TestimonialsCMS({ onShowToast }: TestimonialsCMSProps) {
  const {
    testimonialsData,
    updateTestimonialsData,
    addTestimonial,
    deleteTestimonial,
    updateSingleTestimonial,
    siteSections,
    updateSiteSections,
  } = useSiteConfig();

  const [sectionsForm, setSectionsForm] = useState(siteSections);

  useEffect(() => {
    setSectionsForm(siteSections);
  }, [siteSections]);

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const emptyItem: TestimonialItem = {
    id: Date.now(),
    name: "",
    role: "Scooter Owner",
    location: "Gwalior, Madhya Pradesh",
    model: "VOLMO VISTA",
    config: "60V Lithium-Ion (100km Range)",
    avatarUrl: "",
    rating: 5,
    highlightText: "",
    text: "",
  };

  const handleSave = (itemToSave: TestimonialItem) => {
    if (!itemToSave.name.trim() || !itemToSave.text.trim()) {
      alert("Please provide at least a rider name and review text.");
      return;
    }

    if (isAdding) {
      addTestimonial(itemToSave);
      onShowToast("New testimonial added!");
      setIsAdding(false);
    } else {
      updateSingleTestimonial(itemToSave.id, itemToSave);
      onShowToast("Testimonial updated!");
    }
    setEditingItem(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this rider testimonial?")) {
      deleteTestimonial(id);
      onShowToast("Testimonial deleted.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top action bar */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
            <MessageSquare size={18} className="text-orange-400" />
            Rider Reviews &amp; Testimonials CMS
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage customer feedback, verified rider badges, ratings, and custom reviewer avatar photos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem({ ...emptyItem, id: Date.now() });
            setIsAdding(true);
          }}
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
        >
          <Plus size={15} />
          Add Rider Review
        </button>
      </div>

      {/* Section Titles & Badges Configuration */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-orange-400" />
            Rider Reviews Section Headlines &amp; Badges
          </h4>
          <button
            type="button"
            onClick={() => {
              updateSiteSections(sectionsForm);
              onShowToast("Testimonial section headings saved!");
            }}
            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Save size={12} />
            Save Headings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Top Pill Badge
            </label>
            <input
              type="text"
              value={sectionsForm.testimonialsBadge}
              onChange={(e) => setSectionsForm({ ...sectionsForm, testimonialsBadge: e.target.value })}
              placeholder="Over 5,000+ Happy Riders"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Main Section Heading
            </label>
            <input
              type="text"
              value={sectionsForm.testimonialsHeading}
              onChange={(e) => setSectionsForm({ ...sectionsForm, testimonialsHeading: e.target.value })}
              placeholder="Hear from Volmo Riders"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
            Subtitle Paragraph
          </label>
          <textarea
            rows={2}
            value={sectionsForm.testimonialsSubtitle}
            onChange={(e) => setSectionsForm({ ...sectionsForm, testimonialsSubtitle: e.target.value })}
            placeholder="Discover why EV owners in Gwalior prefer our RTO-free intelligent electric scooters..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
          />
        </div>
      </div>

      {/* Editor Modal / Inline form */}
      {(editingItem !== null || isAdding) && (
        <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-orange-400" />
              {isAdding ? "Create New Rider Review" : `Edit Review: ${editingItem?.name}`}
            </h4>
            <button
              onClick={() => {
                setEditingItem(null);
                setIsAdding(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Rider Full Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Profession / Occupation
                  </label>
                  <input
                    type="text"
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Local Business Owner"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                    placeholder="Gwalior (City Center)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Scooter Model
                  </label>
                  <input
                    type="text"
                    value={editingItem.model}
                    onChange={(e) => setEditingItem({ ...editingItem, model: e.target.value })}
                    placeholder="VOLMO CLASSIC"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Battery Configuration Tag
                </label>
                <input
                  type="text"
                  value={editingItem.config}
                  onChange={(e) => setEditingItem({ ...editingItem, config: e.target.value })}
                  placeholder="60V 30Ah Lithium-Ion Pack (120km Range)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              {/* Rider Avatar Photo */}
              <ImageUploader
                label="Rider Avatar Photo"
                value={editingItem.avatarUrl || ""}
                onChange={(newUrl) => setEditingItem({ ...editingItem, avatarUrl: newUrl })}
                helperText="Upload photo or leave empty to show generated initials"
                aspectRatio="square"
              />

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Highlight Punchline Quote
                </label>
                <input
                  type="text"
                  value={editingItem.highlightText}
                  onChange={(e) => setEditingItem({ ...editingItem, highlightText: e.target.value })}
                  placeholder="Absolutely zero registration paper work & ₹0 petrol bills!"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-orange-400 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Full Customer Review Story
                </label>
                <textarea
                  rows={3}
                  value={editingItem.text}
                  onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                  placeholder="Write the complete review feedback..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(editingItem)}
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Save size={14} />
                  Save Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonialsData.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Avatar Preview */}
                <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 font-bold text-white text-sm flex items-center justify-center flex-shrink-0">
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    item.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    {item.name}
                    <ShieldCheck size={13} className="text-emerald-400" />
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.role} &bull; <span className="text-slate-500">{item.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsAdding(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Review"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="text-xs font-bold text-orange-400">
              "{item.highlightText}"
            </div>

            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {item.text}
            </p>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono text-slate-400">{item.model}</span>
              <span className="flex items-center text-amber-400">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400" />
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
