/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Store, Plus, Trash2, Edit3, Save, MapPin, Phone, Building2, X, Sparkles } from "lucide-react";
import { useSiteConfig } from "../../SiteConfigContext";
import { ShowroomItem, ALL_STATES } from "../../data";

interface ShowroomsCMSProps {
  onShowToast: (msg: string) => void;
}

export default function ShowroomsCMS({ onShowToast }: ShowroomsCMSProps) {
  const {
    showroomsData,
    addShowroom,
    deleteShowroom,
    updateSingleShowroom,
    siteSections,
    updateSiteSections,
  } = useSiteConfig();

  const [sectionsForm, setSectionsForm] = useState(siteSections);

  useEffect(() => {
    setSectionsForm(siteSections);
  }, [siteSections]);

  const [editingItem, setEditingItem] = useState<ShowroomItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [stateFilter, setStateFilter] = useState("all");

  const emptyItem: ShowroomItem = {
    id: `sr-${Date.now()}`,
    name: "Volmo Authorized Flagship Hub",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Main Road, Gwalior",
    phone: "7880008401",
    status: "Active",
  };

  const handleSave = (itemToSave: ShowroomItem) => {
    if (!itemToSave.name.trim() || !itemToSave.address.trim()) {
      alert("Please provide at least a showroom name and address.");
      return;
    }

    if (isAdding) {
      addShowroom(itemToSave);
      onShowToast("New showroom added!");
      setIsAdding(false);
    } else {
      updateSingleShowroom(itemToSave.id, itemToSave);
      onShowToast("Showroom updated!");
    }
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this showroom listing?")) {
      deleteShowroom(id);
      onShowToast("Showroom deleted.");
    }
  };

  const filtered = showroomsData.filter(
    (s) => stateFilter === "all" || s.state === stateFilter
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header bar */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
            <Store size={18} className="text-orange-400" />
            Pan-India Dealership Hubs CMS
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Add official showrooms, phone contacts, service hubs, and manage store listings shown on the Dealer Locator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="all">All States ({showroomsData.length})</option>
            {ALL_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setEditingItem({ ...emptyItem, id: `sr-${Date.now()}` });
              setIsAdding(true);
            }}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer whitespace-nowrap"
          >
            <Plus size={15} />
            Add Showroom
          </button>
        </div>
      </div>

      {/* Section Titles & Badges Configuration */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-orange-400" />
            Showrooms Locator Headlines &amp; Badges
          </h4>
          <button
            type="button"
            onClick={() => {
              updateSiteSections(sectionsForm);
              onShowToast("Showroom locator headings saved!");
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
              value={sectionsForm.locatorBadge}
              onChange={(e) => setSectionsForm({ ...sectionsForm, locatorBadge: e.target.value })}
              placeholder="Pan-India EV Retail Network"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Main Section Heading
            </label>
            <input
              type="text"
              value={sectionsForm.locatorHeading}
              onChange={(e) => setSectionsForm({ ...sectionsForm, locatorHeading: e.target.value })}
              placeholder="Find Volmo Showrooms Near You"
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
            value={sectionsForm.locatorSubtitle}
            onChange={(e) => setSectionsForm({ ...sectionsForm, locatorSubtitle: e.target.value })}
            placeholder="Operational footprint covering all 29 states of India..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
          />
        </div>
      </div>

      {/* Editor Modal / Inline form */}
      {(editingItem !== null || isAdding) && (
        <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-orange-400" />
              {isAdding ? "Register New Dealership Showroom" : `Edit: ${editingItem?.name}`}
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
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Showroom / Dealership Title
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Volmo Gwalior Flagship Experience Center"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    City
                  </label>
                  <input
                    type="text"
                    value={editingItem.city}
                    onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                    placeholder="Gwalior"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    State
                  </label>
                  <select
                    value={editingItem.state}
                    onChange={(e) => setEditingItem({ ...editingItem, state: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    {ALL_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Status
                  </label>
                  <select
                    value={editingItem.status}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        status: e.target.value as "Active" | "Expanding" | "Service Hub",
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="Active">🟢 Active Flagship</option>
                    <option value="Service Hub">🔵 Service Hub</option>
                    <option value="Expanding">🟡 Expanding / Opening Soon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingItem.phone}
                    onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    placeholder="7880008401"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                    Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={editingItem.address}
                    onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                    placeholder="Opposite Arogyadhaam Hospital, City Center, Gwalior - 474011"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
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
                  Save Showroom
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Showrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    item.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : item.status === "Service Hub"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {item.status}
                </span>
                <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">{item.name}</h4>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsAdding(false);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Showroom"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Delete Showroom"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-slate-500 flex-shrink-0" />
                <span className="font-mono text-slate-300 font-bold">{item.phone}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-bold text-slate-400">{item.city}</span>
              <span className="font-mono">{item.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
