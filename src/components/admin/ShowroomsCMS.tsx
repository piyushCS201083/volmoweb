/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Trash2,
  Edit3,
  Save,
  MapPin,
  Phone,
  Building2,
  X,
  Sparkles,
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Navigation,
  Globe,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useSiteConfig } from "../../SiteConfigContext";
import {
  ShowroomItem,
  ALL_STATES,
  DEFAULT_SHOWROOMS,
  DEFAULT_LOCATE_US_PAGE_CONFIG,
} from "../../data";
import { LocateUsPageConfig } from "../../types";

interface ShowroomsCMSProps {
  onShowToast: (msg: string) => void;
}

export default function ShowroomsCMS({ onShowToast }: ShowroomsCMSProps) {
  const {
    showroomsData,
    addShowroom,
    deleteShowroom,
    updateSingleShowroom,
    updateShowroomsData,
    locateUsPageConfig,
    updateLocateUsPageConfig,
    siteSections,
    updateSiteSections,
  } = useSiteConfig();

  // Active view section
  const [activeSection, setActiveSection] = useState<"directory" | "filterConsole" | "headlines">("directory");

  // Local state for Page Config (Headlines, Stats, Search & Filter Console texts)
  const [configForm, setConfigForm] = useState<LocateUsPageConfig>(
    locateUsPageConfig || DEFAULT_LOCATE_US_PAGE_CONFIG
  );

  useEffect(() => {
    if (locateUsPageConfig) {
      setConfigForm({ ...DEFAULT_LOCATE_US_PAGE_CONFIG, ...locateUsPageConfig });
    }
  }, [locateUsPageConfig]);

  // Search & filter states within Admin CMS
  const [adminSearch, setAdminSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Showroom modal / edit state
  const [editingItem, setEditingItem] = useState<ShowroomItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showroomToDelete, setShowroomToDelete] = useState<ShowroomItem | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const emptyItem: ShowroomItem = {
    id: `sr-${Date.now()}`,
    name: "Volmo Authorized Flagship Hub",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Main Commercial Center, Gwalior",
    phone: "7880008401",
    status: "Active",
  };

  // Save Page Config (Console & Headlines)
  const handleSaveConfig = () => {
    updateLocateUsPageConfig(configForm);
    // Also sync headline fallback to siteSections
    updateSiteSections({
      locatorBadge: configForm.locatorBadge,
      locatorHeading: configForm.locatorHeading,
      locatorSubtitle: configForm.locatorSubtitle,
    });
    onShowToast("Dealership Hubs & Filter Console settings saved!");
  };

  // Instantly sync field changes to context, localStorage, backend & Firestore
  const handleFieldChange = <K extends keyof LocateUsPageConfig>(key: K, value: LocateUsPageConfig[K]) => {
    const updated = { ...configForm, [key]: value };
    setConfigForm(updated);
    updateLocateUsPageConfig({ [key]: value });
    if (key === "locatorBadge" || key === "locatorHeading" || key === "locatorSubtitle") {
      updateSiteSections({ [key]: value as string });
    }
  };

  // Showroom Save
  const handleSaveShowroom = (itemToSave: ShowroomItem) => {
    if (!itemToSave.name.trim() || !itemToSave.address.trim()) {
      onShowToast("Please provide at least a showroom name and address.");
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

  const handleConfirmDelete = () => {
    if (!showroomToDelete) return;
    deleteShowroom(showroomToDelete.id);
    onShowToast(`Removed "${showroomToDelete.name}" from dealership directory.`);
    setShowroomToDelete(null);
  };

  // Restore Default Showrooms
  const handleConfirmRestoreDefaults = () => {
    updateShowroomsData(DEFAULT_SHOWROOMS);
    setIsResetConfirmOpen(false);
    onShowToast("Dealership hubs reset to official defaults.");
  };

  // Filter showrooms for Admin display
  const filtered = showroomsData.filter((s) => {
    const matchState = stateFilter === "all" || s.state === stateFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const query = adminSearch.toLowerCase().trim();
    const matchQuery =
      query === "" ||
      s.name.toLowerCase().includes(query) ||
      s.city.toLowerCase().includes(query) ||
      s.state.toLowerCase().includes(query) ||
      s.address.toLowerCase().includes(query) ||
      s.phone.includes(query);

    return matchState && matchStatus && matchQuery;
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Top Banner & Navigation Sub-Tabs */}
      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl">
              <Store size={20} />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                Pan-India Dealership Hubs CMS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete control over the dealer locator, search console, dropdown filters, tally statistics, and store listings.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 w-full lg:w-auto overflow-x-auto">
          {[
            { id: "directory", label: `🏪 Store Outlets (${showroomsData.length})`, count: showroomsData.length },
            { id: "filterConsole", label: "🔍 Search & Filter Console" },
            { id: "headlines", label: "📊 Headlines & Stat Badges" },
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: SEARCH & FILTER CONSOLE CUSTOMIZER (THE SELECTED ELEMENT)      */}
      {/* ========================================================================= */}
      {activeSection === "filterConsole" && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-orange-400" />
                Search Console &amp; Filter Dropdowns Customizer
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize the exact text, placeholders, status labels, and result counters shown in the dealer locator box.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <Save size={13} />
              Save Console Settings
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Search Input Placeholder */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Search size={13} className="text-orange-400" />
                Search Input Placeholder
              </label>
              <input
                type="text"
                value={configForm.searchPlaceholder || ""}
                onChange={(e) => handleFieldChange("searchPlaceholder", e.target.value)}
                placeholder="Search by city, zipcode, showroom name..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500">
                Shown inside the city / store search box on the locator page.
              </span>
            </div>

            {/* All States Dropdown Default Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-orange-400" />
                State Selector Default Option Label
              </label>
              <input
                type="text"
                value={configForm.allStatesLabel || ""}
                onChange={(e) => handleFieldChange("allStatesLabel", e.target.value)}
                placeholder="All 29 States & UTs"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500">
                First option in the 29 Indian States &amp; UTs dropdown list.
              </span>
            </div>

            {/* All Status Option Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Status Filter: &quot;All Status&quot; Label
              </label>
              <input
                type="text"
                value={configForm.allStatusLabel || ""}
                onChange={(e) => handleFieldChange("allStatusLabel", e.target.value)}
                placeholder="All Outlets & Service Hubs"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Active Status Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Status Filter: &quot;Active Operational&quot; Label
              </label>
              <input
                type="text"
                value={configForm.activeStatusLabel || ""}
                onChange={(e) => handleFieldChange("activeStatusLabel", e.target.value)}
                placeholder="Active Operational"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Service Hub Status Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Status Filter: &quot;Service Hub&quot; Label
              </label>
              <input
                type="text"
                value={configForm.serviceHubStatusLabel || ""}
                onChange={(e) => handleFieldChange("serviceHubStatusLabel", e.target.value)}
                placeholder="Service & Spares Hub"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Expanding Status Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Status Filter: &quot;Expanding Soon&quot; Label
              </label>
              <input
                type="text"
                value={configForm.expandingStatusLabel || ""}
                onChange={(e) => handleFieldChange("expandingStatusLabel", e.target.value)}
                placeholder="Expanding Soon"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Results Count Suffix */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Results Counter Suffix (e.g. &quot;outlets across India&quot;)
              </label>
              <input
                type="text"
                value={configForm.resultsCountSuffix || ""}
                onChange={(e) => handleFieldChange("resultsCountSuffix", e.target.value)}
                placeholder="outlets across India"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500">
                Rendered as: Showing <strong>{showroomsData.length}</strong> {configForm.resultsCountSuffix || "outlets across India"}
              </span>
            </div>

            {/* Clear Filters Button Label */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                &quot;Clear Filters&quot; Button Text
              </label>
              <input
                type="text"
                value={configForm.clearFiltersText || ""}
                onChange={(e) => handleFieldChange("clearFiltersText", e.target.value)}
                placeholder="Clear Filters"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Empty State Message */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Empty Search Results Message
              </label>
              <input
                type="text"
                value={configForm.emptyStateMessage || ""}
                onChange={(e) => handleFieldChange("emptyStateMessage", e.target.value)}
                placeholder="No dealerships found matching your search."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Reset Form Button Text */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Empty State Reset Button Text
              </label>
              <input
                type="text"
                value={configForm.resetButtonText || ""}
                onChange={(e) => handleFieldChange("resetButtonText", e.target.value)}
                placeholder="Reset Locator Form"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Get Route Button Text */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Showroom Card &quot;Get Route&quot; Link Text
              </label>
              <input
                type="text"
                value={configForm.getRouteButtonText || ""}
                onChange={(e) => handleFieldChange("getRouteButtonText", e.target.value)}
                placeholder="Get Route"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Phone Number Prefix */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                Direct Call Dial Prefix
              </label>
              <input
                type="text"
                value={configForm.phoneLabelPrefix || ""}
                onChange={(e) => handleFieldChange("phoneLabelPrefix", e.target.value)}
                placeholder="+91"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: HEADLINES & 4 TALLY STAT BADGES                                */}
      {/* ========================================================================= */}
      {activeSection === "headlines" && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-black uppercase text-white tracking-tight flex items-center gap-2">
                <Globe size={16} className="text-orange-400" />
                Locator Section Headings &amp; Tally Statistics
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure the top section headers and customize or override the 4 national stats cards.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              <Save size={13} />
              Save Headlines &amp; Stats
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Top Pill Badge
              </label>
              <input
                type="text"
                value={configForm.locatorBadge}
                onChange={(e) => handleFieldChange("locatorBadge", e.target.value)}
                placeholder="Pan-India EV Retail Network"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Main Section Heading
              </label>
              <input
                type="text"
                value={configForm.locatorHeading}
                onChange={(e) => handleFieldChange("locatorHeading", e.target.value)}
                placeholder="Find Volmo Showrooms Near You"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Subtitle Description Paragraph
            </label>
            <textarea
              rows={2}
              value={configForm.locatorSubtitle}
              onChange={(e) => handleFieldChange("locatorSubtitle", e.target.value)}
              placeholder="Operational footprint covering all 29 states of India..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* 4 Stat Badges */}
          <div className="border-t border-slate-800 pt-5 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold block">
              4 Tally Stat Badges (Leave count override empty to auto-calculate from live dealerships)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Stat 1 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 1 Label</label>
                <input
                  type="text"
                  value={configForm.stat1Label}
                  onChange={(e) => handleFieldChange("stat1Label", e.target.value)}
                  placeholder="Active Dealerships"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                <input
                  type="text"
                  value={configForm.stat1Override || ""}
                  onChange={(e) => handleFieldChange("stat1Override", e.target.value)}
                  placeholder="Auto (e.g. 100+)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                />
              </div>

              {/* Stat 2 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 2 Label</label>
                <input
                  type="text"
                  value={configForm.stat2Label}
                  onChange={(e) => handleFieldChange("stat2Label", e.target.value)}
                  placeholder="States Covered"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                <input
                  type="text"
                  value={configForm.stat2Override || ""}
                  onChange={(e) => handleFieldChange("stat2Override", e.target.value)}
                  placeholder="Auto (e.g. 29)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                />
              </div>

              {/* Stat 3 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 3 Label</label>
                <input
                  type="text"
                  value={configForm.stat3Label}
                  onChange={(e) => handleFieldChange("stat3Label", e.target.value)}
                  placeholder="Ready Showrooms"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                <input
                  type="text"
                  value={configForm.stat3Override || ""}
                  onChange={(e) => handleFieldChange("stat3Override", e.target.value)}
                  placeholder="Auto (e.g. 75)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                />
              </div>

              {/* Stat 4 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-bold block">Stat 4 Label</label>
                <input
                  type="text"
                  value={configForm.stat4Label}
                  onChange={(e) => handleFieldChange("stat4Label", e.target.value)}
                  placeholder="Coming Up Soon"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold"
                />
                <label className="text-[10px] text-slate-500 uppercase font-mono block">Count Override</label>
                <input
                  type="text"
                  value={configForm.stat4Override || ""}
                  onChange={(e) => handleFieldChange("stat4Override", e.target.value)}
                  placeholder="Auto (e.g. 25)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: DEALERSHIP SHOWROOMS DIRECTORY                                  */}
      {/* ========================================================================= */}
      {activeSection === "directory" && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters & Action Buttons */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Query inside Admin */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                placeholder="Search showrooms by name, city, phone..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* State Filter */}
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

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Active">🟢 Active</option>
                <option value="Service Hub">🔵 Service Hub</option>
                <option value="Expanding">🟡 Expanding</option>
              </select>

              {/* Restore Defaults */}
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Restore official default showrooms lineup"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              {/* Add Showroom Button */}
              <button
                type="button"
                onClick={() => {
                  setEditingItem({ ...emptyItem, id: `sr-${Date.now()}` });
                  setIsAdding(true);
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-orange-600/20 cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Add Showroom</span>
              </button>
            </div>
          </div>

          {/* Inline Add / Edit Form Modal */}
          {(editingItem !== null || isAdding) && (
            <div className="bg-slate-950 border border-orange-500/40 p-6 rounded-2xl space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Building2 size={16} className="text-orange-400" />
                  {isAdding ? "Register New Dealership Showroom" : `Edit: ${editingItem?.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
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
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        State
                      </label>
                      <select
                        value={editingItem.state}
                        onChange={(e) => setEditingItem({ ...editingItem, state: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white cursor-pointer focus:outline-none focus:border-orange-500"
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
                        Operational Status
                      </label>
                      <select
                        value={editingItem.status}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            status: e.target.value as "Active" | "Expanding" | "Service Hub",
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white cursor-pointer focus:outline-none focus:border-orange-500"
                      >
                        <option value="Active">🟢 Active Operational</option>
                        <option value="Service Hub">🔵 Service & Spares Hub</option>
                        <option value="Expanding">🟡 Expanding / Opening Soon</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Direct Contact Phone Number
                      </label>
                      <input
                        type="text"
                        value={editingItem.phone}
                        onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                        placeholder="7880008401"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        Postal Address &amp; Landmarks
                      </label>
                      <input
                        type="text"
                        value={editingItem.address}
                        onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                        placeholder="Opposite Arogyadhaam Hospital, City Center, Gwalior - 474011"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
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
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveShowroom(editingItem)}
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-600/20"
                    >
                      <Save size={14} />
                      Save Showroom
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong>{filtered.length}</strong> of {showroomsData.length} total showrooms
              {(stateFilter !== "all" || statusFilter !== "all" || adminSearch !== "") && " (filtered)"}
            </span>

            {(stateFilter !== "all" || statusFilter !== "all" || adminSearch !== "") && (
              <button
                type="button"
                onClick={() => {
                  setStateFilter("all");
                  setStatusFilter("all");
                  setAdminSearch("");
                }}
                className="text-orange-400 hover:underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Showrooms Grid */}
          {filtered.length === 0 ? (
            <div className="bg-slate-950 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
              <p className="text-slate-400 text-sm">No showrooms matching your current search or filter.</p>
              <button
                type="button"
                onClick={() => {
                  setStateFilter("all");
                  setStatusFilter("all");
                  setAdminSearch("");
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 relative group hover:border-slate-700 transition-all"
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
                          setEditingItem(item);
                          setIsAdding(false);
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

                  {/* Prominent Quick Actions */}
                  <div className="pt-2.5 border-t border-slate-900 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(item);
                        setIsAdding(false);
                      }}
                      className="flex-1 py-1.5 px-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
          )}
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

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
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
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Confirm &amp; Delete Showroom</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Defaults Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl">
                <RotateCcw size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Reset Showrooms to Defaults?
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  This will restore the 20+ official Volmo fleet hubs across India.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRestoreDefaults}
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/20 cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
