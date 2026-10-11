/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Building2,
  Factory,
  Store,
  Navigation,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Save,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  CheckCircle,
  Eye,
  X,
  Layers,
  ArrowRight,
  HelpCircle,
  Briefcase,
} from "lucide-react";
import { useSiteConfig } from "../../SiteConfigContext";
import {
  CorporateLocationItem,
  LocateUsPageConfig,
} from "../../types";
import {
  ALL_STATES,
  DEFAULT_CORPORATE_LOCATIONS,
  DEFAULT_LOCATE_US_PAGE_CONFIG,
  ShowroomItem,
} from "../../data";

interface LocateUsCMSProps {
  onShowToast: (msg: string) => void;
}

const AVAILABLE_ICONS = [
  { id: "Building2", label: "Building / HQ", icon: Building2 },
  { id: "Factory", label: "Factory / Plant", icon: Factory },
  { id: "Store", label: "Store / Showroom", icon: Store },
  { id: "MapPin", label: "Map Pin", icon: MapPin },
  { id: "Navigation", label: "Navigation / Compass", icon: Navigation },
  { id: "Globe", label: "Globe", icon: Globe },
  { id: "Sparkles", label: "Sparkles", icon: Sparkles },
];

export default function LocateUsCMS({ onShowToast }: LocateUsCMSProps) {
  const {
    locateUsPageConfig,
    updateLocateUsPageConfig,
    corporateLocationsData,
    updateCorporateLocations,
    updateSingleCorporateLocation,
    addCorporateLocation,
    deleteCorporateLocation,
    showroomsData,
    addShowroom,
    updateSingleShowroom,
    deleteShowroom,
  } = useSiteConfig();

  // Active sub-tab inside Locate Us CMS
  const [activeSubTab, setActiveSubTab] = useState<"corporate" | "directory" | "franchise">("corporate");

  // Local state forms
  const [pageConfigForm, setPageConfigForm] = useState<LocateUsPageConfig>(
    locateUsPageConfig || DEFAULT_LOCATE_US_PAGE_CONFIG
  );

  useEffect(() => {
    if (locateUsPageConfig) {
      setPageConfigForm({ ...DEFAULT_LOCATE_US_PAGE_CONFIG, ...locateUsPageConfig });
    }
  }, [locateUsPageConfig]);

  // Corporate Location editor state
  const [editingLocation, setEditingLocation] = useState<CorporateLocationItem | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [previewEmbedUrl, setPreviewEmbedUrl] = useState<string>("");

  // Showrooms directory editor state
  const [stateFilter, setStateFilter] = useState("all");
  const [editingShowroom, setEditingShowroom] = useState<ShowroomItem | null>(null);
  const [isAddingShowroom, setIsAddingShowroom] = useState(false);

  // Franchise benefits draft
  const [newBenefitText, setNewBenefitText] = useState("");

  // Deletion confirmation modal states (no window.confirm in iframe)
  const [locationToDelete, setLocationToDelete] = useState<CorporateLocationItem | null>(null);
  const [showroomToDelete, setShowroomToDelete] = useState<ShowroomItem | null>(null);

  const handleSavePageConfig = () => {
    updateLocateUsPageConfig(pageConfigForm);
    onShowToast("Locate Us page settings saved!");
  };

  const handleFieldChange = <K extends keyof LocateUsPageConfig>(key: K, value: LocateUsPageConfig[K]) => {
    const updated = { ...pageConfigForm, [key]: value };
    setPageConfigForm(updated);
    updateLocateUsPageConfig({ [key]: value });
  };

  // Corporate Location Save
  const handleSaveCorporateLocation = (loc: CorporateLocationItem) => {
    if (!loc.title.trim() || !loc.address.trim()) {
      onShowToast("Please provide at least a title and address.");
      return;
    }

    if (isAddingLocation) {
      addCorporateLocation(loc);
      onShowToast("New corporate facility added!");
      setIsAddingLocation(false);
    } else {
      updateSingleCorporateLocation(loc.id, loc);
      onShowToast("Corporate facility updated!");
    }
    setEditingLocation(null);
  };

  const handleConfirmDeleteLocation = () => {
    if (!locationToDelete) return;
    if (corporateLocationsData.length <= 1) {
      onShowToast("At least one corporate facility must remain.");
      setLocationToDelete(null);
      return;
    }
    deleteCorporateLocation(locationToDelete.id);
    onShowToast(`Removed "${locationToDelete.title}" facility.`);
    setLocationToDelete(null);
  };

  // Showroom Save
  const handleSaveShowroom = (sr: ShowroomItem) => {
    if (!sr.name.trim() || !sr.address.trim()) {
      onShowToast("Please provide showroom name and address.");
      return;
    }

    if (isAddingShowroom) {
      addShowroom(sr);
      onShowToast("New showroom added!");
      setIsAddingShowroom(false);
    } else {
      updateSingleShowroom(sr.id, sr);
      onShowToast("Showroom updated!");
    }
    setEditingShowroom(null);
  };

  const handleConfirmDeleteShowroom = () => {
    if (!showroomToDelete) return;
    deleteShowroom(showroomToDelete.id);
    onShowToast(`Removed "${showroomToDelete.name}" from showroom directory.`);
    setShowroomToDelete(null);
  };

  // Franchise Benefit management
  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    const current = pageConfigForm.franchiseBenefits || [];
    const updated = [...current, newBenefitText.trim()];
    const nextForm = { ...pageConfigForm, franchiseBenefits: updated };
    setPageConfigForm(nextForm);
    updateLocateUsPageConfig(nextForm);
    setNewBenefitText("");
    onShowToast("Benefit bullet added!");
  };

  const handleRemoveBenefit = (index: number) => {
    const current = pageConfigForm.franchiseBenefits || [];
    const updated = current.filter((_, i) => i !== index);
    const nextForm = { ...pageConfigForm, franchiseBenefits: updated };
    setPageConfigForm(nextForm);
    updateLocateUsPageConfig(nextForm);
    onShowToast("Benefit bullet removed.");
  };

  const handleUpdateBenefitText = (index: number, text: string) => {
    const current = [...(pageConfigForm.franchiseBenefits || [])];
    current[index] = text;
    setPageConfigForm({ ...pageConfigForm, franchiseBenefits: current });
  };

  const filteredShowrooms = showroomsData.filter(
    (s) => stateFilter === "all" || s.state === stateFilter
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Banner & Sub-Tabs Navigation */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                Locate Us &amp; Dealership Network CMS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full visual &amp; textual control over official facilities, live Google Map embed, Pan-India directory &amp; franchise callout.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
          {[
            { id: "corporate", label: "🏢 Corporate Facilities & Map", count: corporateLocationsData.length },
            { id: "directory", label: "🗺️ Pan-India Showrooms", count: showroomsData.length },
            { id: "franchise", label: "💼 Franchise Callout" },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: CORPORATE LOCATIONS & LIVE GOOGLE MAP */}
      {/* ========================================================================= */}
      {activeSubTab === "corporate" && (
        <div className="space-y-6">
          {/* Top Page Header Configuration */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={14} className="text-orange-400" />
                Locate Us Page Header &middot; Top Banner Texts
              </h4>
              <button
                type="button"
                onClick={handleSavePageConfig}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Save size={13} />
                Save Header
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={pageConfigForm.heroBadge}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, heroBadge: e.target.value })}
                  placeholder="Volmo Electrical Private Limited · Official Locations"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Main Title
                </label>
                <input
                  type="text"
                  value={pageConfigForm.heroTitle}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, heroTitle: e.target.value })}
                  placeholder="Contact Us"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Subtitle Description Paragraph
              </label>
              <textarea
                rows={2}
                value={pageConfigForm.heroSubtitle}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, heroSubtitle: e.target.value })}
                placeholder="Find our Corporate Head Office, EV Manufacturing Plant, and Company Operated Showroom..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
              />
            </div>
          </div>

          {/* Corporate Facilities List Header */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
                <Building2 size={16} className="text-orange-400" />
                Official Corporate Facilities &amp; Map Targets ({corporateLocationsData.length})
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Each location appears in the top interactive switchers and provides instant Google Maps GPS navigation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newLoc: CorporateLocationItem = {
                  id: `loc-${Date.now()}`,
                  title: "Volmo Experience Center",
                  type: "Regional Experience Center",
                  tag: "Customer Care & Showcase",
                  shortPill: "Center",
                  address: "Commercial Center, City Road, India",
                  phone: "7880008401",
                  email: "sales@volmoelectrical.com",
                  hours: "Monday - Saturday: 10:00 AM - 07:00 PM",
                  mapsUrl: "https://maps.google.com",
                  mapEmbedUrl: "https://maps.google.com/maps?q=Gwalior&t=&z=15&ie=UTF8&iwloc=&output=embed",
                  iconName: "Building2",
                  accent: "from-blue-600 to-indigo-600",
                  badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
                };
                setEditingLocation(newLoc);
                setIsAddingLocation(true);
                setPreviewEmbedUrl(newLoc.mapEmbedUrl);
              }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <Plus size={15} />
              Add Facility
            </button>
          </div>

          {/* Facility Inline Edit / Add Form */}
          {(editingLocation !== null || isAddingLocation) && (
            <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-orange-400" />
                  {isAddingLocation ? "Add Corporate Facility" : `Edit Facility: ${editingLocation?.title}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLocation(null);
                    setIsAddingLocation(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {editingLocation && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Facility Full Title
                      </label>
                      <input
                        type="text"
                        value={editingLocation.title}
                        onChange={(e) => setEditingLocation({ ...editingLocation, title: e.target.value })}
                        placeholder="Volmo Corporate Head Office"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Short Pill Tag (e.g. HQ, Plant, Showroom)
                      </label>
                      <input
                        type="text"
                        value={editingLocation.shortPill || ""}
                        onChange={(e) => setEditingLocation({ ...editingLocation, shortPill: e.target.value })}
                        placeholder="HQ"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-orange-400 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Facility Type
                      </label>
                      <input
                        type="text"
                        value={editingLocation.type}
                        onChange={(e) => setEditingLocation({ ...editingLocation, type: e.target.value })}
                        placeholder="Company Head Office"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Tag / Category
                      </label>
                      <input
                        type="text"
                        value={editingLocation.tag}
                        onChange={(e) => setEditingLocation({ ...editingLocation, tag: e.target.value })}
                        placeholder="Corporate & Registered Office"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Facility Icon
                      </label>
                      <select
                        value={editingLocation.iconName || "Building2"}
                        onChange={(e) => setEditingLocation({ ...editingLocation, iconName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white cursor-pointer"
                      >
                        {AVAILABLE_ICONS.map((ic) => (
                          <option key={ic.id} value={ic.id}>
                            {ic.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Full Postal Address
                    </label>
                    <textarea
                      rows={2}
                      value={editingLocation.address}
                      onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                      placeholder="Shivhare Colony, Singhpur Road, Baradari Choraha, Morar, Gwalior, Madhya Pradesh - 474006"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={editingLocation.phone}
                        onChange={(e) => setEditingLocation({ ...editingLocation, phone: e.target.value })}
                        placeholder="7880008401"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Sales / Support Email
                      </label>
                      <input
                        type="email"
                        value={editingLocation.email}
                        onChange={(e) => setEditingLocation({ ...editingLocation, email: e.target.value })}
                        placeholder="sales@volmoelectrical.com"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Visiting / Operational Hours
                      </label>
                      <input
                        type="text"
                        value={editingLocation.hours}
                        onChange={(e) => setEditingLocation({ ...editingLocation, hours: e.target.value })}
                        placeholder="Monday - Saturday: 10:00 AM - 07:00 PM"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Google Maps Direction URL (Link button)
                      </label>
                      <input
                        type="url"
                        value={editingLocation.mapsUrl}
                        onChange={(e) => setEditingLocation({ ...editingLocation, mapsUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Live Google Map Embed Iframe URL
                      </label>
                      <input
                        type="url"
                        value={editingLocation.mapEmbedUrl}
                        onChange={(e) => {
                          setEditingLocation({ ...editingLocation, mapEmbedUrl: e.target.value });
                          setPreviewEmbedUrl(e.target.value);
                        }}
                        placeholder="https://maps.google.com/maps?q=...&output=embed"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-mono"
                      />
                    </div>
                  </div>

                  {/* Live Embed Preview */}
                  {editingLocation.mapEmbedUrl && (
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                      <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                        <Eye size={12} className="text-orange-400" />
                        Live Map Embed Preview:
                      </span>
                      <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative">
                        <iframe
                          title="Map preview"
                          src={editingLocation.mapEmbedUrl}
                          width="100%"
                          height="100%"
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLocation(null);
                        setIsAddingLocation(false);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveCorporateLocation(editingLocation)}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save size={14} />
                      Save Facility
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {corporateLocationsData.map((loc, idx) => {
              const Icon = AVAILABLE_ICONS.find((i) => i.id === loc.iconName)?.icon || Building2;
              return (
                <div
                  key={loc.id}
                  className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-400">
                          <Icon size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase font-bold text-orange-400 block">
                            {loc.shortPill || `Facility ${idx + 1}`}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">{loc.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLocation(loc);
                            setIsAddingLocation(false);
                            setPreviewEmbedUrl(loc.mapEmbedUrl);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                          title="Edit facility"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLocationToDelete(loc)}
                          className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                          title="Delete facility"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{loc.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{loc.address}</p>
                    </div>

                    <div className="space-y-1 text-[11px] font-mono text-slate-400 border-t border-slate-900 pt-2">
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-500" />
                        <span className="text-slate-300 font-bold">{loc.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-slate-500" />
                        <span className="text-slate-400 truncate">{loc.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-500" />
                        <span className="text-slate-400 truncate">{loc.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-2 flex items-center justify-between text-[11px]">
                    <a
                      href={loc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                    >
                      <span>Maps Link</span>
                      <ExternalLink size={10} />
                    </a>
                    <span className="text-[10px] text-emerald-400 font-mono">✓ Map Iframe</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PAN-INDIA SHOWROOMS DIRECTORY & STATS */}
      {/* ========================================================================= */}
      {activeSubTab === "directory" && (
        <div className="space-y-6">
          {/* Directory Section Header & Stats Config */}
          <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Globe size={14} className="text-orange-400" />
                Directory Headlines &amp; Live Tally Stats Badges
              </h4>
              <button
                type="button"
                onClick={handleSavePageConfig}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Save size={13} />
                Save Directory Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={pageConfigForm.locatorBadge}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, locatorBadge: e.target.value })}
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
                  value={pageConfigForm.locatorHeading}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, locatorHeading: e.target.value })}
                  placeholder="Find Volmo Showrooms Near You"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Subtitle Description Paragraph
              </label>
              <textarea
                rows={2}
                value={pageConfigForm.locatorSubtitle}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, locatorSubtitle: e.target.value })}
                placeholder="Operational footprint covering all 29 states of India..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
              />
            </div>

            {/* 4 Stats Cards Labels & Manual Overrides */}
            <div className="border-t border-slate-800/80 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  4 Tally Stat Badges (Leave override empty to auto-calculate from live dealerships)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Stat 1 */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 1 Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat1Label}
                    onChange={(e) => handleFieldChange("stat1Label", e.target.value)}
                    placeholder="Active Dealerships"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                  />
                  <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat1Override || ""}
                    onChange={(e) => handleFieldChange("stat1Override", e.target.value)}
                    placeholder="Auto (e.g. 100+)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                  />
                </div>

                {/* Stat 2 */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 2 Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat2Label}
                    onChange={(e) => handleFieldChange("stat2Label", e.target.value)}
                    placeholder="States Covered"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                  />
                  <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat2Override || ""}
                    onChange={(e) => handleFieldChange("stat2Override", e.target.value)}
                    placeholder="Auto (e.g. 29)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                  />
                </div>

                {/* Stat 3 */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 3 Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat3Label}
                    onChange={(e) => handleFieldChange("stat3Label", e.target.value)}
                    placeholder="Ready Showrooms"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                  />
                  <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat3Override || ""}
                    onChange={(e) => handleFieldChange("stat3Override", e.target.value)}
                    placeholder="Auto (e.g. 75)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                  />
                </div>

                {/* Stat 4 */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 4 Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat4Label}
                    onChange={(e) => handleFieldChange("stat4Label", e.target.value)}
                    placeholder="Coming Up Soon"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                  />
                  <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                  <input
                    type="text"
                    value={pageConfigForm.stat4Override || ""}
                    onChange={(e) => handleFieldChange("stat4Override", e.target.value)}
                    placeholder="Auto (e.g. 25)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Search & Filter Console Texts Customizer */}
            <div className="border-t border-slate-800/80 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-mono uppercase text-orange-400 font-bold flex items-center gap-1.5">
                    <Navigation size={13} />
                    Search Console &amp; Filter Dropdown Controls (Dealership Hubs Box)
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Customize search placeholder, dropdown default labels, counters, empty states, and route button text.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Search Placeholder</label>
                  <input
                    type="text"
                    value={pageConfigForm.searchPlaceholder || ""}
                    onChange={(e) => handleFieldChange("searchPlaceholder", e.target.value)}
                    placeholder="Search by city, zipcode, showroom name..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">State Dropdown Default</label>
                  <input
                    type="text"
                    value={pageConfigForm.allStatesLabel || ""}
                    onChange={(e) => handleFieldChange("allStatesLabel", e.target.value)}
                    placeholder="All 29 States & UTs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Status: All Outlets Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.allStatusLabel || ""}
                    onChange={(e) => handleFieldChange("allStatusLabel", e.target.value)}
                    placeholder="All Outlets & Service Hubs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Status: Active Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.activeStatusLabel || ""}
                    onChange={(e) => handleFieldChange("activeStatusLabel", e.target.value)}
                    placeholder="Active Operational"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Status: Service Hub Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.serviceHubStatusLabel || ""}
                    onChange={(e) => handleFieldChange("serviceHubStatusLabel", e.target.value)}
                    placeholder="Service & Spares Hub"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Status: Expanding Label</label>
                  <input
                    type="text"
                    value={pageConfigForm.expandingStatusLabel || ""}
                    onChange={(e) => handleFieldChange("expandingStatusLabel", e.target.value)}
                    placeholder="Expanding Soon"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Results Count Suffix</label>
                  <input
                    type="text"
                    value={pageConfigForm.resultsCountSuffix || ""}
                    onChange={(e) => handleFieldChange("resultsCountSuffix", e.target.value)}
                    placeholder="outlets across India"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Clear Filters Button</label>
                  <input
                    type="text"
                    value={pageConfigForm.clearFiltersText || ""}
                    onChange={(e) => handleFieldChange("clearFiltersText", e.target.value)}
                    placeholder="Clear Filters"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Get Route Button Text</label>
                  <input
                    type="text"
                    value={pageConfigForm.getRouteButtonText || ""}
                    onChange={(e) => handleFieldChange("getRouteButtonText", e.target.value)}
                    placeholder="Get Route"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Empty Search Message</label>
                  <input
                    type="text"
                    value={pageConfigForm.emptyStateMessage || ""}
                    onChange={(e) => handleFieldChange("emptyStateMessage", e.target.value)}
                    placeholder="No dealerships found matching your search."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Reset Form Button</label>
                  <input
                    type="text"
                    value={pageConfigForm.resetButtonText || ""}
                    onChange={(e) => setPageConfigForm({ ...pageConfigForm, resetButtonText: e.target.value })}
                    placeholder="Reset Locator Form"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Showroom Listings Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
                <Store size={16} className="text-orange-400" />
                Pan-India Dealership Showrooms ({showroomsData.length})
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, or customize retail showroom addresses, direct phone numbers, and operational statuses.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
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
                  const emptyShowroom: ShowroomItem = {
                    id: `sr-${Date.now()}`,
                    name: "Volmo Authorized Flagship Hub",
                    city: "Gwalior",
                    state: "Madhya Pradesh",
                    address: "Main Commercial Center, Gwalior",
                    phone: "7880008401",
                    status: "Active",
                  };
                  setEditingShowroom(emptyShowroom);
                  setIsAddingShowroom(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                Add Showroom
              </button>
            </div>
          </div>

          {/* Showroom Add / Edit Modal Form */}
          {(editingShowroom !== null || isAddingShowroom) && (
            <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Store size={16} className="text-orange-400" />
                  {isAddingShowroom ? "Register New Dealership Showroom" : `Edit Showroom: ${editingShowroom?.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingShowroom(null);
                    setIsAddingShowroom(false);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {editingShowroom && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      Showroom / Dealership Title
                    </label>
                    <input
                      type="text"
                      value={editingShowroom.name}
                      onChange={(e) => setEditingShowroom({ ...editingShowroom, name: e.target.value })}
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
                        value={editingShowroom.city}
                        onChange={(e) => setEditingShowroom({ ...editingShowroom, city: e.target.value })}
                        placeholder="Gwalior"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        State
                      </label>
                      <select
                        value={editingShowroom.state}
                        onChange={(e) => setEditingShowroom({ ...editingShowroom, state: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white cursor-pointer"
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
                        value={editingShowroom.status}
                        onChange={(e) =>
                          setEditingShowroom({
                            ...editingShowroom,
                            status: e.target.value as "Active" | "Expanding" | "Service Hub",
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white cursor-pointer"
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
                        value={editingShowroom.phone}
                        onChange={(e) => setEditingShowroom({ ...editingShowroom, phone: e.target.value })}
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
                        value={editingShowroom.address}
                        onChange={(e) => setEditingShowroom({ ...editingShowroom, address: e.target.value })}
                        placeholder="Opposite Arogyadhaam Hospital, City Center, Gwalior - 474011"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingShowroom(null);
                        setIsAddingShowroom(false);
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveShowroom(editingShowroom)}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
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
            {filteredShowrooms.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group text-left"
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
                      type="button"
                      onClick={() => {
                        setEditingShowroom(item);
                        setIsAddingShowroom(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Showroom"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowroomToDelete(item)}
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
                  <span className="font-bold text-slate-400">📍 {item.city}</span>
                  <span className="font-mono">{item.state}</span>
                </div>

                {/* Quick Action Buttons */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingShowroom(item);
                      setIsAddingShowroom(false);
                    }}
                    className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 size={12} className="text-orange-400" />
                    <span>Edit Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowroomToDelete(item)}
                    className="py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Remove Showroom"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: FRANCHISE APPLICATION CALLOUT */}
      {/* ========================================================================= */}
      {activeSubTab === "franchise" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
                  <Briefcase size={16} className="text-orange-400" />
                  Franchise Opportunity Banner Customizer
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize the partnership appeal card shown at the bottom of the Locate Us page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSavePageConfig}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
              >
                <Save size={14} />
                Save Franchise Section
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  value={pageConfigForm.franchiseBadge}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, franchiseBadge: e.target.value })}
                  placeholder="FRANCHISE INITIATIVES OPEN"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={pageConfigForm.franchiseButtonText}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, franchiseButtonText: e.target.value })}
                  placeholder="Apply for Dealership"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Main Headline
              </label>
              <input
                type="text"
                value={pageConfigForm.franchiseHeading}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, franchiseHeading: e.target.value })}
                placeholder="Start Your Volmo Franchise in Your Hometown City Today"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Narrative / Subtitle Paragraph
              </label>
              <textarea
                rows={3}
                value={pageConfigForm.franchiseDescription}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, franchiseDescription: e.target.value })}
                placeholder="Indian green energy transition is picking up pace rapidly..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans"
              />
            </div>

            {/* Investment Benefits Overview Box */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Benefits Card Title
                </label>
                <input
                  type="text"
                  value={pageConfigForm.franchiseCardTitle}
                  onChange={(e) => setPageConfigForm({ ...pageConfigForm, franchiseCardTitle: e.target.value })}
                  placeholder="Investment Benefits Overview"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                />
              </div>

              {/* Dynamic Benefits List */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                  Investment Benefits Bullet Points
                </label>

                {(pageConfigForm.franchiseBenefits || []).map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleUpdateBenefitText(bIdx, e.target.value)}
                      className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(bIdx)}
                      className="p-2 text-slate-400 hover:text-red-400 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer"
                      title="Remove benefit point"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                {/* Add new benefit input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newBenefitText}
                    onChange={(e) => setNewBenefitText(e.target.value)}
                    placeholder="Type new benefit highlight and press Add..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus size={14} />
                    Add Point
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSavePageConfig}
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20 cursor-pointer"
              >
                <Save size={14} />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Showroom Confirmation Dialog */}
      {showroomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Remove Dealership Showroom?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  This will remove the showroom from the dealer locator directory across the live website.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 text-left">
              <p className="font-bold text-white text-sm">{showroomToDelete.name}</p>
              <p className="text-slate-400">📍 {showroomToDelete.city}, {showroomToDelete.state}</p>
              <p className="text-slate-500 text-[11px]">{showroomToDelete.address}</p>
              <p className="text-slate-500 text-[11px] font-mono">📞 {showroomToDelete.phone}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowroomToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShowroom}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Confirm &amp; Delete Showroom</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Corporate Facility Confirmation Dialog */}
      {locationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Remove Corporate Facility?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  This facility will no longer appear on the interactive map selector.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5 text-left">
              <p className="font-bold text-white text-sm">{locationToDelete.title}</p>
              <p className="text-slate-400">📍 {locationToDelete.address}</p>
              <p className="text-slate-500 text-[11px] font-mono">📞 {locationToDelete.phone}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLocationToDelete(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteLocation}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Confirm &amp; Delete Facility</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
