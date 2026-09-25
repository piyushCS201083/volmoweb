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
  CheckCircle,
  Copy,
  CheckCircle2,
  Navigation,
  Clock,
  Mail,
  ExternalLink,
  Store,
  Factory,
  Globe,
  Sparkles,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

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
export const ALL_STATES = [
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

// Prespecified premium active dealership showrooms to ground the locator
const CORE_SHOWROOMS: Showroom[] = [
  // Madhya Pradesh (Home Base)
  {
    id: "mp-flagship",
    name: "Volmo Company Operated Showroom (Flagship)",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "In front of Heera bhumiya, chandravadni naka main road, lashkar, gwalior, (M.P)",
    phone: "7880008401",
    status: "Active",
  },
  {
    id: "mp-1",
    name: "Volmo Gwalior Smart EV Fleet Flagship",
    city: "Gwalior",
    state: "Madhya Pradesh",
    address: "Opposite Arogyadhaam Hospital, City Center, Gwalior - 474011",
    phone: "7880008401",
    status: "Active",
  },
  {
    id: "mp-2",
    name: "Volmo Indore Cyber Electric",
    city: "Indore",
    state: "Madhya Pradesh",
    address: "G-11, Royal Gold Building, YN Road, Vijay Nagar, Indore - 452001",
    phone: "9111333151",
    status: "Active",
  },
  {
    id: "mp-3",
    name: "Volmo Bhopal Eco-Wheels",
    city: "Bhopal",
    state: "Madhya Pradesh",
    address: "Plot 34, Sector B, MP Nagar Zone-1, Bhopal - 462011",
    phone: "7880008401",
    status: "Service Hub",
  },
  {
    id: "mp-4",
    name: "Volmo JBP Kinetic Showroom",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    address: "Civic Center Traffic Ring-Road, Jabalpur - 482002",
    phone: "9111333151",
    status: "Active",
  },

  // Uttar Pradesh
  {
    id: "up-1",
    name: "Volmo Lucknow Nawabi Smart-Drive",
    city: "Lucknow",
    state: "Uttar Pradesh",
    address: "Ground Floor, Baradari Complex, Hazratganj, Lucknow - 226001",
    phone: "7880008401",
    status: "Active",
  },
  {
    id: "up-2",
    name: "Volmo Noida Tech-Hub EV",
    city: "Noida",
    state: "Uttar Pradesh",
    address: "Commercial Market Square, Sector 62, Noida - 201301",
    phone: "9111333151",
    status: "Active",
  },
  {
    id: "up-3",
    name: "Volmo Kanpur Industrial Greenway",
    city: "Kanpur",
    state: "Uttar Pradesh",
    address: "Opposite Hallet, Swaroop Nagar, Kanpur - 208002",
    phone: "7880008401",
    status: "Service Hub",
  },
  {
    id: "up-4",
    name: "Volmo Varanasi Sacred Wheels",
    city: "Varanasi",
    state: "Uttar Pradesh",
    address: "Near Ravidas Gate, Lanka Road, Varanasi - 221005",
    phone: "9111333151",
    status: "Expanding",
  },

  // Delhi NCR
  {
    id: "dl-1",
    name: "Volmo India Delhi Central Flagship",
    city: "New Delhi",
    state: "Delhi NCR",
    address: "Radial Road 4, Inner Circle, Connaught Place, New Delhi - 110001",
    phone: "9111333151",
    status: "Active",
  },
  {
    id: "dl-2",
    name: "Volmo Dwarka Green Spark",
    city: "Dwarka",
    state: "Delhi NCR",
    address: "Main Sector 10 Metro Plaza, Dwarka, New Delhi - 110075",
    phone: "7880008401",
    status: "Active",
  },

  // Maharashtra
  {
    id: "mh-1",
    name: "Volmo Mumbai Metro Electric Hub",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Link Road, Near Infinity Mall, Andheri West, Mumbai - 400053",
    phone: "7880008401",
    status: "Active",
  },
  {
    id: "mh-2",
    name: "Volmo Pune Tech Pulse",
    city: "Pune",
    state: "Maharashtra",
    address: "FC Road Central, Shivajinagar, Pune - 411005",
    phone: "9111333151",
    status: "Active",
  },

  // Rajasthan
  {
    id: "rj-1",
    name: "Volmo Jaipur Royal Sun-Drive",
    city: "Jaipur",
    state: "Rajasthan",
    address: "A-Block, Vaishali Tower, Vaishali Nagar, Jaipur - 302021",
    phone: "9111333151",
    status: "Active",
  },
  {
    id: "rj-2",
    name: "Volmo Udaipur Lakes Ride Point",
    city: "Udaipur",
    state: "Rajasthan",
    address: "Shastri Circle, Main Sector 4, Jodhpur Bypass, Udaipur - 313001",
    phone: "7880008401",
    status: "Active",
  },

  // Gujarat
  {
    id: "gj-1",
    name: "Volmo Ahmedabad Sabarmati Wheels",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "GF, Heritage Square, C.G. Road, Ahmedabad - 380009",
    phone: "9111333151",
    status: "Active",
  },

  // Karnataka
  {
    id: "ka-1",
    name: "Volmo Bengaluru High-Tech Arena",
    city: "Bangalore",
    state: "Karnataka",
    address: "Sector 3 HSR Layout Ground-floor, Bengaluru - 560102",
    phone: "9111333151",
    status: "Active",
  },
];

// Generate showroom seed for remaining states
function generateAllShowrooms(): Showroom[] {
  const result: Showroom[] = [...CORE_SHOWROOMS];
  const covered = new Set(result.map((s) => s.state));

  ALL_STATES.forEach((state, i) => {
    if (!covered.has(state)) {
      result.push({
        id: `auto-${state.toLowerCase().replace(/\s+/g, "-")}`,
        name: `Volmo ${state} Regional Center`,
        city: `Capital City (${state})`,
        state: state,
        address: `Commercial Industrial Expressway Zone, ${state}`,
        phone: i % 2 === 0 ? "7880008401" : "9111333151",
        status: i % 3 === 0 ? "Expanding" : "Active",
      });
    }
  });

  return result;
}

export interface LocateUsProps {
  onDealershipClick?: () => void;
}

export default function LocateUs({ onDealershipClick }: LocateUsProps) {
  const { contactInfo, siteSections, showroomsData } = useSiteConfig();

  // Active selected location for interactive Google Map
  const [activeLocationId, setActiveLocationId] = useState<string>("head-office");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search and filter state for Pan-India dealerships directory below
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [filterStatus, setFilterStatus] = useState<string>("All Status");

  // Official primary corporate locations with exact GPS links & embed targets
  const corporateLocations = useMemo(
    () => [
      {
        id: "head-office",
        title: siteSections?.hqTitle || "Volmo Corporate Head Office",
        type: "Company Head Office",
        tag: "Corporate & Registered Office",
        address:
          contactInfo.headOfficeAddress ||
          "Shivhare Colony, Singhpur Road, Baradari Choraha, Morar, Gwalior, Madhya Pradesh - 474006",
        phone: contactInfo.phone || "7880008401",
        email: contactInfo.email || "sales@volmoelectrical.com",
        hours: siteSections?.hqHours || "Monday - Saturday: 10:00 AM - 07:00 PM",
        mapsUrl: "https://maps.app.goo.gl/ay94JjuHWHfiF6tb9?g_st=iw",
        // Direct coordinates query for accurate map embed centered on Morar Baradari
        mapEmbedUrl:
          "https://maps.google.com/maps?q=Shivhare%20Colony%20Singhpur%20Road%20Baradari%20Choraha%20Morar%20Gwalior%20Madhya%20Pradesh%20474006&t=&z=16&ie=UTF8&iwloc=&output=embed",
        icon: Building2,
        accent: "from-blue-600 to-indigo-600",
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      },
      {
        id: "manufacturing-plant",
        title: siteSections?.plantTitle || "Volmo EV Manufacturing Plant",
        type: "Manufacturing Plant",
        tag: "Assembly & Battery Lab",
        address:
          contactInfo.factoryAddress ||
          "Behind Arogyadhaam Hospital, City Center, Gwalior, Madhya Pradesh - 474011",
        phone: contactInfo.phone || "7880008401",
        email: contactInfo.email || "sales@volmoelectrical.com",
        hours: siteSections?.plantHours || "Monday - Saturday: 09:00 AM - 07:00 PM",
        mapsUrl: "https://maps.google.com/?q=26.202997,78.184883",
        // Exact GPS coordinates query embed
        mapEmbedUrl:
          "https://maps.google.com/maps?q=26.202997,78.184883&t=&z=17&ie=UTF8&iwloc=&output=embed",
        icon: Factory,
        accent: "from-orange-600 to-amber-600",
        badgeBg: "bg-orange-50 text-orange-700 border-orange-200",
      },
      {
        id: "company-showroom",
        title: "Volmo Company Operated Showroom",
        type: "Company Operated Showroom",
        tag: "Official Retail & Test Rides",
        address:
          "In front of Heera bhumiya, chandravadni naka main road, lashkar, gwalior, (m.p)",
        phone: "7880008401",
        email: contactInfo.email || "sales@volmoelectrical.com",
        hours: "Monday - Sunday: 10:00 AM - 08:30 PM",
        mapsUrl:
          "https://www.google.com/maps?q=26.19314193725586,78.17198944091797&z=17&hl=en",
        // Exact GPS coordinates query embed
        mapEmbedUrl:
          "https://maps.google.com/maps?q=26.19314193725586,78.17198944091797&z=17&hl=en&t=&ie=UTF8&iwloc=&output=embed",
        icon: Store,
        accent: "from-emerald-600 to-teal-600",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    ],
    [contactInfo, siteSections]
  );

  const activeLocation =
    corporateLocations.find((loc) => loc.id === activeLocationId) || corporateLocations[0];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compile full dealership directory, prioritizing any custom added in Admin
  const allDealerships = useMemo(() => {
    const base = generateAllShowrooms();
    if (!showroomsData || showroomsData.length === 0) return base;
    const customList: Showroom[] = showroomsData.map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      state: s.state,
      address: s.address,
      phone: s.phone,
      status: s.status as "Active" | "Expanding" | "Service Hub",
    }));
    const existingIds = new Set(customList.map((c) => c.id));
    const filteredBase = base.filter((b) => !existingIds.has(b.id));
    return [...customList, ...filteredBase];
  }, [showroomsData]);

  // Compute stats dynamically
  const stats = useMemo(() => {
    const total = allDealerships.length;
    const activeStates = new Set(allDealerships.map((d) => d.state)).size;
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
    <div id="locate-us-page" className="bg-slate-50 min-h-screen text-slate-800">
      {/* ========================================================================= */}
      {/* SECTION 1: TOP HERO - HEAD OFFICE, CONTACT DETAILS & INTEGRATED GOOGLE MAP */}
      {/* ========================================================================= */}
      <section className="pt-12 pb-16 bg-white border-b border-slate-200 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
          {/* Header Title Banner */}
          <div className="text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold uppercase tracking-wider">
              <MapPin size={13} className="text-orange-600" />
              <span>Volmo Electrical Private Limited &middot; Official Locations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
              Contact Us
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
              Find our Corporate Head Office, EV Manufacturing Plant, and Company Operated Showroom
              in Gwalior, Madhya Pradesh. Use the live interactive map on the right to navigate
              directly to all our official facilities.
            </p>
          </div>

          {/* Location Selector Tabs (Head Office | Manufacturing Plant | Showroom) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {corporateLocations.map((loc) => {
              const Icon = loc.icon;
              const isSelected = activeLocationId === loc.id;
              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-white/10 text-white" : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-[10px] font-mono uppercase font-bold tracking-wider block ${
                          isSelected ? "text-orange-400" : "text-slate-500"
                        }`}
                      >
                        {loc.tag}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold truncate">{loc.type}</h3>
                    </div>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isSelected ? "bg-emerald-400 animate-ping" : "bg-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Split View: Left = Detailed Addresses & Contact Info | Right = Integrated Google Maps */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* LEFT COLUMN: Head Office, Contact Info & Facility Details (7 Cols on LG) */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              {/* Selected Location Highlight Card */}
              <motion.div
                key={activeLocation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-50/70 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs text-left space-y-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span
                      className={`text-[11px] font-mono uppercase font-bold px-2.5 py-1 rounded-md border inline-block ${activeLocation.badgeBg}`}
                    >
                      {activeLocation.type}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      {activeLocation.title}
                    </h2>
                  </div>
                  <a
                    href={activeLocation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:text-orange-600 hover:border-orange-300 rounded-xl transition-all shadow-xs flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold"
                    title="Open in Google Maps"
                  >
                    <span>Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Details layout */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  {/* Address */}
                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                    <Navigation size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-grow">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                        Postal Address
                      </span>
                      <p className="text-slate-900 mt-0.5 leading-relaxed font-bold text-xs sm:text-sm">
                        {activeLocation.address}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyText(activeLocation.address, activeLocation.id)}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer flex-shrink-0"
                      title="Copy Address"
                    >
                      {copiedId === activeLocation.id ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                      <Phone size={17} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                          Phone / Support
                        </span>
                        <a
                          href={`tel:${activeLocation.phone}`}
                          className="text-slate-900 font-bold font-mono text-sm hover:text-orange-600 transition-colors"
                        >
                          +91 {activeLocation.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                      <Mail size={17} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                          Company Email ID
                        </span>
                        <a
                          href={`mailto:${activeLocation.email}`}
                          className="text-slate-900 font-bold font-mono text-xs hover:text-orange-600 transition-colors truncate block"
                          title={activeLocation.email}
                        >
                          {activeLocation.email}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80">
                    <Clock size={17} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                        Visiting / Operational Hours
                      </span>
                      <p className="text-slate-800 font-semibold text-xs mt-0.5">
                        {activeLocation.hours}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Direct GPS Direction Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={activeLocation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href={`tel:${activeLocation.phone}`}
                    className="py-3 px-5 bg-white border border-slate-200 hover:border-slate-350 text-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Phone size={14} />
                    <span>Call Desk</span>
                  </a>
                </div>
              </motion.div>

              {/* All 3 Locations Quick Summary strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {corporateLocations.map((loc) => {
                  const isCurrent = activeLocationId === loc.id;
                  return (
                    <div
                      key={`strip-${loc.id}`}
                      onClick={() => setActiveLocationId(loc.id)}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                        isCurrent
                          ? "bg-orange-50/50 border-orange-300 ring-1 ring-orange-400/40"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                          {loc.id === "head-office"
                            ? "HQ"
                            : loc.id === "manufacturing-plant"
                            ? "Plant"
                            : "Showroom"}
                        </span>
                        <a
                          href={loc.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-orange-600 transition-colors"
                          title="Open map"
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{loc.type}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{loc.address}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Integrated Interactive Google Maps (6 Cols on LG) */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-white border border-slate-200 rounded-3xl p-3 shadow-md flex-grow flex flex-col overflow-hidden min-h-[460px] sm:min-h-[520px]">
                {/* Map Header Toolbar with Location Switcher pills */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">
                      Live Google Map Preview: {activeLocation.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {corporateLocations.map((loc) => (
                      <button
                        key={`tab-btn-${loc.id}`}
                        type="button"
                        onClick={() => setActiveLocationId(loc.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                          activeLocationId === loc.id
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {loc.id === "head-office"
                          ? "HQ"
                          : loc.id === "manufacturing-plant"
                          ? "Plant"
                          : "Showroom"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Google Map iframe embed */}
                <div className="relative flex-grow rounded-2xl overflow-hidden bg-slate-100 mt-2 border border-slate-200">
                  <iframe
                    key={activeLocation.mapEmbedUrl}
                    title={`Google Map for ${activeLocation.title}`}
                    src={activeLocation.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Map Footer Bar with Direct Link to Google Maps */}
                <div className="pt-3 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="truncate text-[11px]">
                    📍 {activeLocation.address}
                  </span>
                  <a
                    href={activeLocation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 font-bold hover:underline inline-flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: REST OF THE LOCATE US PAGE (PAN-INDIA SHOWROOM DIRECTORY & STATS)*/}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono uppercase bg-slate-200/60 text-slate-755 border border-slate-300 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5">
              <Globe size={13} className="text-slate-650" />
              <span>{siteSections?.locatorBadge || "Pan-India EV Retail Network"}</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
              {siteSections?.locatorHeading || "Find Volmo Showrooms Near You"}
            </h2>
            <p className="text-slate-600 text-sm font-normal font-sans max-w-xl mx-auto">
              {siteSections?.locatorSubtitle ||
                "Operational footprint covering all 29 states of India with rapid on-ground franchise inclusions. Type your city, search state-wise, or enquire to apply for a fresh dealership lock!"}
            </p>
          </div>

          {/* Pan-India Live Tally Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
                {stats.total}+
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Active Dealerships
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 font-mono">
                {stats.activeStates}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                States Covered
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-700 font-mono">
                {stats.activeShowrooms}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Ready Showrooms
              </span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl text-center flex flex-col justify-center shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-650 font-mono">
                {stats.expanding}
              </span>
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
                    setSearchQuery("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-slate-400 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="All States">All 29 States &amp; UTs</option>
                  {ALL_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-slate-400 focus:bg-white transition-colors cursor-pointer"
                >
                  <option value="All Status">All Outlets &amp; Service Hubs</option>
                  <option value="Active">Active Operational</option>
                  <option value="Service Hub">Service &amp; Spares Hub</option>
                  <option value="Expanding">Expanding Soon</option>
                </select>
              </div>
            </div>

            {/* Total Results Count Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 font-medium">
              <span>
                Showing <strong>{filteredDealerships.length}</strong> outlets across India
              </span>
              {(selectedState !== "All States" ||
                filterStatus !== "All Status" ||
                searchQuery !== "") && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState("All States");
                    setFilterStatus("All Status");
                    setSearchQuery("");
                  }}
                  className="text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Showrooms Grid Results */}
            {filteredDealerships.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-slate-600 text-sm">No dealerships found matching your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedState("All States");
                    setFilterStatus("All Status");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Reset Locator Form
                </button>
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
                      className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-350 hover:shadow-xs transition-all text-left"
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
                          className="text-slate-600 hover:text-slate-900 font-mono flex items-center gap-1 font-semibold"
                        >
                          <Phone size={11} className="text-slate-400" />
                          <span>+91 {showroom.phone}</span>
                        </a>

                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            `${showroom.name}, ${showroom.address}`
                          )}`}
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

          {/* Franchise Application Callout */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative overflow-hidden shadow-sm">
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold font-mono uppercase px-3 py-1.5 rounded-lg">
                <Sparkles size={11} className="text-orange-600" />
                <span>FRANCHISE INITIATIVES OPEN</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Start Your Volmo Franchise in Your Hometown City Today
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Indian green energy transition is picking up pace rapidly. Introduce zero-registration,
                zero-license premium commuters to students and families in your state, backed by solid
                marketing support, premium replacement inventories, and solid margins.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl relative space-y-4 text-left">
              <h4 className="text-xs font-mono uppercase text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
                <span>Investment Benefits Overview</span>
              </h4>

              <div className="space-y-2.5 text-xs text-slate-700">
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
                  onClick={onDealershipClick}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider block text-center shadow-md"
                >
                  Apply for Dealership
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
