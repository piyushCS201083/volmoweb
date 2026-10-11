/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Search,
  Building2,
  Phone,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  PlusCircle,
  Globe,
  Sparkles,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";
import { DEFAULT_SHOWROOMS } from "../data";

interface Showroom {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  status: "Active" | "Expanding" | "Service Hub";
}

// 29 Indian States & Key Trade Regions List
const ALL_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function DealershipLocator() {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All Status");

  const { showroomsData, siteSections } = useSiteConfig();

  // Compile full dealership directory from authoritative showroomsData
  const allDealerships = useMemo(() => {
    const list = Array.isArray(showroomsData) && showroomsData.length > 0 ? showroomsData : DEFAULT_SHOWROOMS;
    return list.map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      state: s.state,
      address: s.address,
      phone: s.phone,
      status: (s.status as "Active" | "Expanding" | "Service Hub") || "Active",
    }));
  }, [showroomsData]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = allDealerships.length;
    const activeStates = new Set(
      allDealerships
        .map((d) => (d.state || "").trim().toLowerCase())
        .filter(Boolean)
    ).size;
    const activeShowrooms = allDealerships.filter((d) => d.status === "Active").length;
    const expanding = allDealerships.filter((d) => d.status === "Expanding").length;

    return { total, activeStates, activeShowrooms, expanding };
  }, [allDealerships]);

  // Filter listings based on search box & dropdowns
  const filteredDealerships = useMemo(() => {
    return allDealerships.filter((dealer) => {
      const stateMatch = selectedState === "All States" || dealer.state === selectedState;
      const statusMatch = filterStatus === "All Status" || dealer.status === filterStatus;

      const query = searchQuery.toLowerCase().trim();
      const textMatch =
        query === "" ||
        dealer.name.toLowerCase().includes(query) ||
        dealer.city.toLowerCase().includes(query) ||
        dealer.state.toLowerCase().includes(query) ||
        dealer.address.toLowerCase().includes(query);

      return stateMatch && statusMatch && textMatch;
    });
  }, [allDealerships, selectedState, filterStatus, searchQuery]);

  return (
    <section id="locate-us" className="py-24 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 relative overflow-hidden text-slate-800">
      {/* Dynamic Tech Grid Background Decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Soft color spotlights */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-slate-450/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-slate-550/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Title / Interactive Stat Cards */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase bg-slate-200/60 text-slate-755 border border-slate-300 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5">
            <Globe size={13} className="text-slate-650 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{siteSections?.locatorBadge || "Pan-India EV Retail Network"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
            {siteSections?.locatorHeading || "Find Volmo Showrooms Near You"}
          </h2>
          <p className="text-slate-600 text-sm font-normal font-sans max-w-xl mx-auto">
            {siteSections?.locatorSubtitle || "Operational footprint covering all 29 states of India with rapid on-ground franchise inclusions. Type your city, search state-wise, or enquire to apply for a fresh dealership lock!"}
          </p>
        </div>

        {/* Pan-India Live Tally Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto pt-4">
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">{stats.total}+</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Active Dealerships
            </span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">{stats.activeStates}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              States Covered
            </span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-700 font-mono">{stats.activeShowrooms}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Ready Showrooms
            </span>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-650 font-mono">{stats.expanding}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Coming Up Soon
            </span>
          </div>
        </div>

        {/* Filters and Search Console block */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Direct City / Store Name search query option */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, zipcode, showroom name..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 pl-10 pr-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>

            {/* Indian States Dropdown */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSearchQuery(""); // Clear search to make transition smooth
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-slate-400 focus:bg-white transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                  backgroundPosition: "calc(100% - 12px) 50%",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "20px",
                }}
              >
                <option value="All States">All 29 States &amp; UT Districts</option>
                {ALL_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Service & Operational Status Dropdown */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-slate-350 focus:bg-white transition-colors cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                  backgroundPosition: "calc(100% - 12px) 50%",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "20px",
                }}
              >
                <option value="All Status">All Categories &amp; Hubs</option>
                <option value="Active">Operational Showrooms (Active)</option>
                <option value="Expanding">Showrooms Launching Soon (Expanding)</option>
                <option value="Service Hub">Approved Service Stations (Service Hub)</option>
              </select>
            </div>

          </div>

          {/* Directory Listings Matrix */}
          <div className="border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-2">
              <span>Showing <strong>{filteredDealerships.length}</strong> match results</span>
              {selectedState !== "All States" && (
                <button
                  onClick={() => setSelectedState("All States")}
                  className="text-slate-700 hover:underline font-mono"
                >
                  Clear State Filter
                </button>
              )}
            </div>

            {filteredDealerships.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <HelpCircle size={40} className="text-slate-400 mx-auto" />
                <h4 className="text-slate-800 text-base font-bold">No Showrooms Found matching filters</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Looks like there are no outlets meeting your search query. Try typing another city or select a different state.
                </p>
                <div className="pt-2">
                  <button
                     onClick={() => {
                      setSearchQuery("");
                      setSelectedState("All States");
                      setFilterStatus("All Status");
                     }}
                     className="px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:text-slate-900 cursor-pointer"
                  >
                    Reset Locator Form
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredDealerships.map((showroom) => (
                    <motion.div
                      key={showroom.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-350 hover:shadow-xs transition-style text-left"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-slate-600">
                            {showroom.state}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                              showroom.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                                : showroom.status === "Expanding"
                                ? "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                                : "bg-cyan-500/10 text-cyan-700 border border-cyan-500/20"
                            }`}
                          >
                            {showroom.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-slate-900 text-sm sm:text-base font-bold tracking-tight">
                            {showroom.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-medium">
                            📍 {showroom.city}, India
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-normal font-normal">
                          {showroom.address}
                        </p>
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs">
                        <a
                          href={`tel:${showroom.phone}`}
                          className="text-slate-600 hover:text-slate-905 font-mono flex items-center gap-1 font-semibold"
                        >
                          <Phone size={11} className="text-slate-450" />
                          <span>+91 {showroom.phone}</span>
                        </a>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${showroom.name} ${showroom.address}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-700 hover:underline font-bold text-[10px] uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                        >
                          <span>Get Route</span>
                          <ArrowRight size={10} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Action Callout for aspiring business partners - matches aesthetic standards */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden shadow-sm">
          <div className="absolute right-0 bottom-0 top-0 w-2/3 bg-[radial-gradient(ellipse_at_bottom_right,rgba(148,163,184,0.01),transparent_50%)] pointer-events-none" />

          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-205 text-slate-700 text-[10px] font-bold font-mono uppercase px-3 py-1.5 rounded-lg">
              <Sparkles size={11} />
              <span>FRANCHISE INITIATIVES OPEN</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Start Your Volmo Franchise in Your Hometown City Today
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Indian green energy transition is picking up pace rapidly. Introduce zero-registration, zero-license premium commuters to students and families in your state, backed by solid marketing support, premium replacement inventories, and solid margins.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative space-y-4 text-left">
            <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-205 pb-2">
              <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
              <span>Investment Benefits Overview</span>
            </h4>

            <div className="space-y-2.5 text-xs text-slate-705">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Zero Franchise Entry Fee for first partners in new states</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Direct 100% genuine spare support from Gwalior Plant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Integrated digital leads funnel directly sent to you</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-dealership-modal"));
                  const btn = document.querySelector('[aria-label="Apply Dealership"]') as HTMLButtonElement | null;
                  if (btn) btn.click();
                }}
                className="w-full py-3 bg-slate-805 hover:bg-slate-905 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider block text-center shadow-md"
              >
                Apply for Dealership
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
