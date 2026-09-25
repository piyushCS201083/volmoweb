/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  IndianRupee,
  TrendingDown,
  Sparkles,
  Zap,
  Leaf,
  Clock,
  ShieldCheck,
  Newspaper,
  Image as ImageIcon,
  Video,
  Play,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Star,
  Quote,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
  Fuel,
  BatteryCharging,
  X,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";
import {
  MEDIA_ARTICLES,
  COMPANY_PHOTOS,
  COMPANY_VIDEOS,
  CAREER_OPENINGS,
  DEFAULT_MEDIA_BLOGS_PAGE_CONFIG,
  MediaArticle,
  CompanyPhoto,
  CompanyVideo,
} from "../data/mediaBlogsData";
import { CareerOpening, CareerApplication } from "../types";
import CareerApplyModal from "./CareerApplyModal";

interface MediaBlogsPageProps {
  onOpenCareerModal?: (job?: CareerOpening) => void;
  onOpenDealershipModal?: () => void;
  onOpenQuickContact?: () => void;
}

export default function MediaBlogsPage({
  onOpenCareerModal,
  onOpenDealershipModal,
  onOpenQuickContact,
}: MediaBlogsPageProps) {
  const {
    testimonialsData,
    mediaArticlesData,
    companyPhotosData,
    companyVideosData,
    careerOpeningsData,
    mediaBlogsPageConfig,
  } = useSiteConfig();

  const reviewsList = testimonialsData && testimonialsData.length > 0 ? testimonialsData : [];
  const pageConfig = mediaBlogsPageConfig || DEFAULT_MEDIA_BLOGS_PAGE_CONFIG;
  const articlesList = mediaArticlesData && mediaArticlesData.length > 0 ? mediaArticlesData : MEDIA_ARTICLES;
  const photosList = companyPhotosData && companyPhotosData.length > 0 ? companyPhotosData : COMPANY_PHOTOS;
  const videosList = companyVideosData && companyVideosData.length > 0 ? companyVideosData : COMPANY_VIDEOS;
  const jobsList = careerOpeningsData && careerOpeningsData.length > 0 ? careerOpeningsData : CAREER_OPENINGS;

  // ==========================================
  // SAVINGS CALCULATOR STATE
  // ==========================================
  const [dailyKm, setDailyKm] = useState<number>(pageConfig.defaultDailyKm || 30);
  const [petrolPrice, setPetrolPrice] = useState<number>(pageConfig.defaultPetrolPrice || 105);
  const [petrolMileage, setPetrolMileage] = useState<number>(pageConfig.defaultPetrolMileage || 40);
  const [elecRate, setElecRate] = useState<number>(pageConfig.defaultElecRate || 7.0);

  // Sync if pageConfig changes from admin in real time
  React.useEffect(() => {
    if (pageConfig) {
      if (pageConfig.defaultDailyKm) setDailyKm(pageConfig.defaultDailyKm);
      if (pageConfig.defaultPetrolPrice) setPetrolPrice(pageConfig.defaultPetrolPrice);
      if (pageConfig.defaultPetrolMileage) setPetrolMileage(pageConfig.defaultPetrolMileage);
      if (pageConfig.defaultElecRate) setElecRate(pageConfig.defaultElecRate);
    }
  }, [pageConfig]);

  // Dynamic calculations:
  // Volmo running cost from config (default 8.5 paise / km)
  const volmoCostPerKm = pageConfig.volmoCostPerKm || 0.085;
  const petrolCostPerKm = petrolPrice / petrolMileage; // e.g. 105 / 40 = ₹2.625 / km

  const dailyPetrolCost = dailyKm * petrolCostPerKm;
  const dailyVolmoCost = dailyKm * volmoCostPerKm;
  const dailySavings = dailyPetrolCost - dailyVolmoCost;

  const monthlySavings = Math.round(dailySavings * 30);
  const yearlyFuelSavings = Math.round(dailySavings * 365);

  // 5 Years calculation
  const fiveYearsFuelSavings = Math.round(yearlyFuelSavings * 5);
  // Zero oil changes, zero spark plugs, zero air filter, zero belt adjustments
  const maintenanceSavedPerYear = pageConfig.annualMaintenanceSaved || 4200;
  const fiveYearsMaintenanceSaved = maintenanceSavedPerYear * 5; // e.g. ₹21,000
  const grandTotalFiveYearSavings = fiveYearsFuelSavings + fiveYearsMaintenanceSaved;

  // Environmental impact: Petrol scooter emits ~0.12 kg CO2 per km
  const co2SavedKg5Years = Math.round(dailyKm * 0.12 * 365 * 5);
  const treesEquivalent = Math.round(co2SavedKg5Years / 21); // ~21kg CO2 absorbed per tree/year

  // ==========================================
  // MEDIA TAB & MODAL STATES
  // ==========================================
  const [mediaFilter, setMediaFilter] = useState<"all" | "news" | "photos" | "videos">("all");
  const [selectedArticle, setSelectedArticle] = useState<MediaArticle | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<CompanyPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CompanyVideo | null>(null);

  // ==========================================
  // CAREER MODAL STATE
  // ==========================================
  const [isCareerModalOpen, setIsCareerModalOpen] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState<CareerOpening | null>(null);

  const handleApplyClick = (job?: CareerOpening) => {
    setSelectedJobForModal(job || null);
    setIsCareerModalOpen(true);
    if (onOpenCareerModal) {
      onOpenCareerModal(job);
    }
  };

  // Review carousel
  const [reviewIdx, setReviewIdx] = useState(0);
  const activeReview = reviewsList[reviewIdx % reviewsList.length] || reviewsList[0];

  return (
    <div className="bg-slate-50 text-slate-800 pb-20 selection:bg-emerald-500 selection:text-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-16 sm:pb-20 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>{pageConfig.heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto">
            {pageConfig.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {pageConfig.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 1: INTERACTIVE 5-YEAR EV SAVINGS CALCULATOR        */}
      {/* ========================================================== */}
      <section id="savings-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-2xl p-6 sm:p-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Calculator size={20} />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {pageConfig.calculatorBadge}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {pageConfig.calculatorTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                {pageConfig.calculatorSubtitle}
              </p>
            </div>

            {/* Sub-10-paise Guarantee Badge */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                ₹{volmoCostPerKm.toFixed(2)}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                  Volmo Running Cost
                </span>
                <span className="text-sm font-black text-slate-900 block leading-tight">
                  {(volmoCostPerKm * 100).toFixed(1)} Paise / KM
                </span>
                <span className="text-[11px] text-slate-500">
                  vs ₹{petrolCostPerKm.toFixed(2)} / km Petrol ({Math.round(((petrolCostPerKm - volmoCostPerKm) / petrolCostPerKm) * 100)}% Savings)
                </span>
              </div>
            </div>
          </div>

          {/* Calculator Grid: Inputs on Left, Results on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 5 Columns: Sliders & Adjusters */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-mono font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Fuel size={16} className="text-amber-600" />
                <span>Your Commute Parameters</span>
              </h3>

              {/* Slider 1: Daily Distance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700">Daily Commute Distance:</label>
                  <span className="text-emerald-700 font-mono text-sm bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                    {dailyKm} km / day
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={dailyKm}
                  onChange={(e) => setDailyKm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10 km (Quick errands)</span>
                  <span>50 km</span>
                  <span>100 km (Heavy commute)</span>
                </div>
              </div>

              {/* Input 2: Petrol Price */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Petrol Price (₹/L)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={80}
                      max={150}
                      value={petrolPrice}
                      onChange={(e) => setPetrolPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Petrol Mileage (km/L)
                  </label>
                  <input
                    type="number"
                    min={25}
                    max={65}
                    value={petrolMileage}
                    onChange={(e) => setPetrolMileage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Summary of Daily Spend */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Daily Petrol Spend:</span>
                  <span className="font-mono font-bold text-rose-600">
                    ₹{dailyPetrolCost.toFixed(1)} / day
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Daily Volmo Electric Spend:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    ₹{dailyVolmoCost.toFixed(2)} / day
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold text-slate-900">
                  <span>Daily Net Savings:</span>
                  <span className="font-mono text-emerald-700">
                    ₹{dailySavings.toFixed(1)} saved daily
                  </span>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: 5-Year Big Savings Showcase */}
            <div className="lg:col-span-7 space-y-6">
              {/* Highlight Card: 5-Year Grand Total */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-500/30">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      5-Year Cumulative Savings
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      @ {dailyKm} km / day commute
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-300 block">Total Money Saved Over 5 Years</span>
                    <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono tracking-tight mt-1 flex items-baseline gap-1">
                      <span>₹{grandTotalFiveYearSavings.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    By riding a Volmo Electric scooter, you save enough money to completely pay for the scooter{" "}
                    <strong className="text-white font-bold">more than twice over</strong> compared to recurring petrol pump bills and engine oil servicing!
                  </p>

                  {/* 3 Pillars Breakdown */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Monthly Saved</span>
                      <span className="text-sm sm:text-base font-bold text-white font-mono">
                        ₹{monthlySavings.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">1-Year Saved</span>
                      <span className="text-sm sm:text-base font-bold text-white font-mono">
                        ₹{yearlyFuelSavings.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Zero Servicing</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                        +₹{fiveYearsMaintenanceSaved.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Impact + Call to Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-4.5 border border-emerald-200 flex items-start gap-3.5">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm shrink-0">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase block">
                      Green Climate Impact
                    </span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      {co2SavedKg5Years.toLocaleString("en-IN")} kg CO₂ Prevented
                    </span>
                    <span className="text-xs text-slate-600">
                      Equivalent to planting ~{treesEquivalent} trees over 5 years.
                    </span>
                  </div>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4.5 border border-slate-200 flex items-start gap-3.5">
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                      CMVR RTO Exemption
                    </span>
                    <span className="text-base font-black text-slate-900 block mt-0.5">
                      ₹0 Registration & Tax
                    </span>
                    <span className="text-xs text-slate-600">
                      No road tax, no registration, no driver license required.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 2: COMPANY MEDIA, PRESS, PHOTOS & VIDEOS           */}
      {/* ========================================================== */}
      <section id="company-media" className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              Company Media Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              News, Press Releases & Factory Media
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Stay updated with Volmo Electrical corporate milestones, engineering breakthroughs, plant tours, and event showcases.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-slate-200/80 border border-slate-300">
            {(
              [
                { id: "all", label: "All Media" },
                { id: "news", label: "News & Press" },
                { id: "photos", label: "Factory Photos" },
                { id: "videos", label: "Videos" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMediaFilter(tab.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mediaFilter === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="space-y-10">
          {/* 1. News & Press Articles */}
          {(mediaFilter === "all" || mediaFilter === "news") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Newspaper size={18} className="text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">Official News & Press Highlights</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articlesList.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-emerald-500/50 hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-slate-900">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-white/10">
                          {art.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          {art.readTime}
                        </div>
                      </div>

                      <div className="p-6 space-y-2.5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          <Calendar size={12} />
                          <span>{art.date}</span>
                          <span>&middot;</span>
                          <span>{art.author}</span>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {art.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(art)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                      >
                        <span>Read Full Release</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Company Photos Gallery */}
          {(mediaFilter === "all" || mediaFilter === "photos") && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">Company Plant & Event Gallery</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {photosList.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] font-mono uppercase px-2 py-0.5 rounded">
                        {photo.category}
                      </span>
                    </div>
                    <div className="p-3.5 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Company Videos */}
          {(mediaFilter === "all" || mediaFilter === "videos") && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Video size={18} className="text-slate-700" />
                <h3 className="text-lg font-bold text-slate-900">Official Videos & Engineering Demos</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {videosList.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid)}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden bg-slate-950">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={20} className="ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                          {vid.duration}
                        </div>
                      </div>

                      <div className="p-5 space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                          {vid.category}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {vid.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span>Watch Video</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 3: VERIFIED RIDER REVIEWS & TESTIMONIALS           */}
      {/* ========================================================== */}
      <section id="rider-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            Real Stories, Real Savings
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            What Volmo Riders Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Hear from daily commuters, families, and young riders who made the switch to Volmo electric scooters.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsList.slice(0, 3).map((rev, idx) => (
            <div
              key={rev.id || idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg hover:border-emerald-500/30 transition-all"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {rev.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>{rev.city || "Rajasthan"}</span>
                    <span>&middot;</span>
                    <span className="text-emerald-700 font-semibold">{rev.modelRidden || "Volmo Glider"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== */}
      {/* SECTION 4: CAREERS AT VOLMO & APPLICATION BUTTON           */}
      {/* ========================================================== */}
      <section id="careers" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 space-y-8">
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                <Briefcase size={14} />
                <span>{pageConfig.careersBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {pageConfig.careersTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {pageConfig.careersSubtitle}
              </p>
            </div>

            {/* General Apply Button */}
            <button
              type="button"
              onClick={() => handleApplyClick()}
              className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95 group"
            >
              <span>Submit Open Application</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Career Openings Cards List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={18} className="text-slate-700" />
              <span>Current Open Positions ({jobsList.length})</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Live Openings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsList.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/50 p-6 flex flex-col justify-between space-y-5 hover:shadow-xl transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    {job.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                        {job.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {job.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>{job.location}</span>
                    <span>&middot;</span>
                    <span>{job.experience}</span>
                    <span>&middot;</span>
                    <span>{job.type}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {job.summary}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.keySkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleApplyClick(job)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 group-hover:bg-emerald-600"
                  >
                    <span>Apply for Position</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* MODAL 1: ARTICLE FULL TEXT VIEWER                          */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 z-10 text-left my-8"
              >
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-800 rounded-xl"
                >
                  <X size={20} />
                </button>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                    {selectedArticle.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {selectedArticle.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Published {selectedArticle.date} by {selectedArticle.author}
                  </div>
                </div>

                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-56 object-cover rounded-2xl"
                />

                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
                  <p className="font-semibold text-slate-900">{selectedArticle.summary}</p>
                  <p>{selectedArticle.content}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(null)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Close Article
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MODAL 2: PHOTO LIGHTBOX                                   */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 text-left my-8"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute right-4 top-4 p-2 text-white bg-black/60 rounded-xl hover:bg-black/80 z-20"
                >
                  <X size={20} />
                </button>
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[65vh] object-cover"
                />
                <div className="p-6 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                    {selectedPhoto.category} &middot; {selectedPhoto.date}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900">{selectedPhoto.title}</h4>
                  <p className="text-xs text-slate-600">{selectedPhoto.caption}</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MODAL 3: VIDEO PREVIEW VIEWER                             */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
            />
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-slate-900 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 text-left my-8 border border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="absolute right-4 top-4 p-2 text-white bg-black/60 rounded-xl hover:bg-black/80 z-20"
                >
                  <X size={20} />
                </button>

                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <img
                    src={selectedVideo.thumbnailUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl animate-pulse">
                      <Play size={28} className="ml-1" />
                    </div>
                    <span className="text-xs font-mono text-white/90">
                      Official Volmo Factory Reel ({selectedVideo.duration})
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    {selectedVideo.category}
                  </span>
                  <h4 className="text-lg font-bold text-white">{selectedVideo.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {selectedVideo.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* MODAL 4: CAREER APPLICATION MODAL                          */}
      {/* ========================================================== */}
      <CareerApplyModal
        isOpen={isCareerModalOpen}
        onClose={() => {
          setIsCareerModalOpen(false);
          setSelectedJobForModal(null);
        }}
        selectedJob={selectedJobForModal}
      />
    </div>
  );
}

