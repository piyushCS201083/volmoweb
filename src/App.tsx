/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Models from "./components/Models";
import Accessories from "./components/Accessories";
import BatteryAndCharger from "./components/BatteryAndCharger";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import MediaBlogsPage from "./components/MediaBlogsPage";
import FAQ from "./components/FAQ";
import LocateUs from "./components/LocateUs";
import Footer from "./components/Footer";
import DealershipModal from "./components/DealershipModal";
import PriceInquiryModal from "./components/PriceInquiryModal";
import AdminPortal from "./components/AdminPortal";
import QuickContactModal, { QuickContactData } from "./components/QuickContactModal";
import BottomFloatingActions from "./components/BottomFloatingActions";
import AiChatbotModal from "./components/AiChatbotModal";
import WhatsAppChatModal from "./components/WhatsAppChatModal";
import VolmoShutterIntro from "./components/VolmoShutterIntro";
import { BatteryType } from "./types";
import { ShieldAlert, CheckCircle, Zap, Calculator, ArrowRight } from "lucide-react";

export default function App() {
  // Showroom shutter intro animation state
  const [isShutterOpen, setIsShutterOpen] = useState(true);
  // Interactive daily commute slider for homepage savings calculator
  const [dailyKm, setDailyKm] = useState(40);

  // Modal toggles
  const [isDealerOpen, setIsDealerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiChatInitialQuestion, setAiChatInitialQuestion] = useState<string | undefined>(undefined);
  const [adminInitialTab, setAdminInitialTab] = useState<
    "accessories" | "battery-charger" | undefined
  >(undefined);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppInitialMessage, setWhatsAppInitialMessage] = useState<string | undefined>(undefined);

  const handleOpenWhatsAppModal = (customMsg?: string) => {
    setWhatsAppInitialMessage(customMsg);
    setIsWhatsAppOpen(true);
  };

  // Active page sub-routing state
  const [activePage, setActivePage] = useState<string>("home");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Quick Contact Modal state & prefill
  const [quickContactInitialTopic, setQuickContactInitialTopic] = useState<string>("Pricing & Quotation");
  const [quickContactInitialMessage, setQuickContactInitialMessage] = useState<string>("");

  const handleOpenQuickInquiryForQuote = (itemName: string) => {
    setQuickContactInitialTopic("Pricing & Quotation");
    setQuickContactInitialMessage(
      `Hello, I would like to request an official price quote for: ${itemName}. Please provide pricing, warranty details, and availability.`
    );
    setIsContactOpen(true);
  };

  const handlePageChange = (pageId: string) => {
    setActivePage(pageId);
    if (pageId === "models") {
      setSelectedModelId(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Prefill state for the price inquiry modal
  const [inquiryModelId, setInquiryModelId] = useState("vista");
  const [inquiryColorName, setInquiryColorName] = useState("Glossy White");
  const [inquiryBatteryType, setInquiryBatteryType] = useState<BatteryType>("LA");
  const [inquiryBatteryRange, setInquiryBatteryRange] = useState(60);

  // Success Notification banner
  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Section scroll driver (page-compatible)
  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === "battery-configurator") {
      setActivePage("models");
      setSelectedModelId(null);
      setTimeout(() => {
        const el = document.getElementById("battery-configurator");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 400);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Handles clicking "Enquire Price" from any scooter card
  const handleEnquireClick = (
    modelId: string,
    colorName: string,
    batteryType: BatteryType,
    batteryRange: number
  ) => {
    setInquiryModelId(modelId);
    setInquiryColorName(colorName);
    setInquiryBatteryType(batteryType);
    setInquiryBatteryRange(batteryRange);
    setIsPriceOpen(true);
  };

  // Triggers selecting model from footer and scrolling to its card
  const handleSelectModelFromFooter = (modelId: string) => {
    setActivePage("models");
    setSelectedModelId(modelId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Optional secret access: Ctrl+Shift+A, Alt+Shift+A, or URL param ?admin=true / #admin
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || window.location.hash === "#admin") {
      setIsAdminOpen(true);
    }

    const handleOpenDealer = () => setIsDealerOpen(true);
    window.addEventListener("open-dealership-modal", handleOpenDealer);

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-dealership-modal", handleOpenDealer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased relative">
      {/* Volmo Vehicle Upward Roam & Website Shutter Opening Animation */}
      <VolmoShutterIntro
        isOpen={isShutterOpen}
        onComplete={() => setIsShutterOpen(false)}
      />

      {/* Dynamic Pop-up Status Toast notification (custom built in pure Tailwind) */}
      {notification && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex items-start gap-3.5 animate-bounce text-left">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl flex-shrink-0">
            <CheckCircle size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-slate-900 text-xs font-black uppercase tracking-wider">Success Lead Saved</h4>
            <p className="text-slate-650 text-xs leading-normal font-medium">{notification}</p>
          </div>
        </div>
      )}

      {/* Sticky Top Header Navigation */}
      <Navbar
        activePage={activePage}
        onPageChange={handlePageChange}
        onDealershipClick={() => setIsDealerOpen(true)}
      />

      {/* Pages Container with Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activePage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="flex-grow flex flex-col text-slate-800"
        >
          {activePage === "home" && (
            <>
              <Hero
                onExploreModels={() => handlePageChange("models")}
                onApplyPartnership={() => setIsDealerOpen(true)}
                onReplayShutter={() => setIsShutterOpen(true)}
                onSelectModel={handleSelectModelFromFooter}
              />

              {/* Interactive EV vs Petrol Savings & Range Simulator */}
              <section className="py-20 bg-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 space-y-4 text-left">
                      <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
                        <Calculator size={14} />
                        <span>INTERACTIVE COMMUTE SIMULATOR</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                        See How Much You Save Riding Volmo Electric
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Drag the slider to match your daily city travel. Compare typical petrol scooter fuel and servicing costs against Volmo’s 18-paise/km smart electric drive.
                      </p>

                      <div className="pt-2 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-300">DAILY COMMUTE DISTANCE</span>
                          <span className="text-orange-400 font-bold text-base tabular-nums">{dailyKm} KM / DAY</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={120}
                          step={5}
                          value={dailyKm}
                          onChange={(e) => setDailyKm(Number(e.target.value))}
                          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <div className="flex justify-between text-[11px] font-mono text-slate-500">
                          <span>10 km/day</span>
                          <span>60 km/day</span>
                          <span>120 km/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <span className="text-xs font-mono text-slate-400">MONTHLY EV CHARGING</span>
                        <div className="my-4">
                          <div className="text-3xl font-bold text-white tabular-nums">
                            ₹{Math.round(dailyKm * 30 * 0.18).toLocaleString("en-IN")}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            vs ₹{Math.round(dailyKm * 30 * 2.8).toLocaleString("en-IN")} on Petrol
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">
                          ~18 paise / km electricity
                        </span>
                      </div>

                      <div className="bg-slate-900 border border-orange-500/40 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <span className="text-xs font-mono text-orange-400">ANNUAL NET SAVINGS</span>
                        <div className="my-4">
                          <div className="text-3xl font-bold text-orange-400 tabular-nums">
                            ₹{Math.round(dailyKm * 365 * (2.8 - 0.18)).toLocaleString("en-IN")}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Saved every single year
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-300">
                          Zero oil or engine maintenance
                        </span>
                      </div>

                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left flex flex-col justify-between">
                        <span className="text-xs font-mono text-slate-400">RECOMMENDED PACK</span>
                        <div className="my-4">
                          <div className="text-xl font-bold text-white">
                            {dailyKm <= 45
                              ? "60V 28Ah Graphene"
                              : dailyKm <= 75
                              ? "60V 34Ah Lithium LFP"
                              : "72V 60Ah Ultra LFP"}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {dailyKm <= 45
                              ? "60–70 km per charge"
                              : dailyKm <= 75
                              ? "85–95 km per charge"
                              : "140–160 km per charge"}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePageChange("battery-charger")}
                          className="text-xs font-bold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Battery Specs</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              
              {/* Premium Interactive Hub Menu on Homepage */}
              <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="text-xs uppercase font-extrabold text-orange-600 font-mono tracking-widest">
                      Engineering Smart Mobility
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
                      Select Your Destination
                    </h2>
                    <p className="text-slate-600 text-sm font-normal leading-relaxed max-w-xl mx-auto">
                      Avoid RTO registration queues, road taxes, and high petroleum costs. Click any of our interactive hubs below to discover our multi-tier layouts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
                    <div 
                      onClick={() => handlePageChange("models")}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-500/40 hover:bg-white p-6 rounded-3xl text-left cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">01 &middot; Fleet</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Our Electric Fleet</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          View all customizable smart scooters, toggle premium color schemes, and request quotes.
                        </p>
                      </div>
                      <span className="text-xs text-orange-600 font-bold tracking-wider inline-flex items-center gap-1 mt-6 group-hover:translate-x-1.5 transition-transform">
                        Explore Fleet &rarr;
                      </span>
                    </div>

                    <div 
                      onClick={() => handlePageChange("accessories")}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-500/40 hover:bg-white p-6 rounded-3xl text-left cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">02 &middot; Protection</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Accessories &amp; Gear</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          Volmo manufactured high-grade steel frame sets, ISI certified helmets, and lifestyle gear.
                        </p>
                      </div>
                      <span className="text-xs text-orange-600 font-bold tracking-wider inline-flex items-center gap-1 mt-6 group-hover:translate-x-1.5 transition-transform">
                        View Accessories &rarr;
                      </span>
                    </div>

                    <div 
                      onClick={() => handlePageChange("battery-charger")}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-500/40 hover:bg-white p-6 rounded-3xl text-left cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">03 &middot; Power Systems</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Battery &amp; Charger</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          Original Graphene (1 Yr), Lithium/LFP 1.4-4.3 kW (3 Yrs), and German fast chargers.
                        </p>
                      </div>
                      <span className="text-xs text-orange-600 font-bold tracking-wider inline-flex items-center gap-1 mt-6 group-hover:translate-x-1.5 transition-transform">
                        Explore Power &rarr;
                      </span>
                    </div>

                    <div 
                      onClick={() => handlePageChange("technology")}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-500/40 hover:bg-white p-6 rounded-3xl text-left cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">04 &middot; Tech &amp; FAQs</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Engineering Specs</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          German Sine-Wave controller chips, 3-Year advanced warranties, and CMVR guidelines.
                        </p>
                      </div>
                      <span className="text-xs text-orange-600 font-bold tracking-wider inline-flex items-center gap-1 mt-6 group-hover:translate-x-1.5 transition-transform">
                        Read Tech &rarr;
                      </span>
                    </div>

                    <div 
                      onClick={() => handlePageChange("locator")}
                      className="bg-slate-50 border border-slate-200 hover:border-orange-500/40 hover:bg-white p-6 rounded-3xl text-left cursor-pointer transition-all duration-300 group flex flex-col justify-between min-h-[220px] shadow-xs hover:shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-orange-600 font-bold uppercase tracking-wider">05 &middot; Franchise</span>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Locate Store</h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          Physical active dealerships covering all 29 states in India with over 100+ on-ground outlets.
                        </p>
                      </div>
                      <span className="text-xs text-orange-600 font-bold tracking-wider inline-flex items-center gap-1 mt-6 group-hover:translate-x-1.5 transition-transform">
                        Find Dealers &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {activePage === "models" && (
            <Models 
              onEnquireClick={handleEnquireClick} 
              selectedModelId={selectedModelId}
              onSelectModelId={setSelectedModelId}
              onNavigateToAccessories={() => handlePageChange("accessories")}
            />
          )}

          {activePage === "accessories" && (
            <Accessories 
              onEnquireClick={(itemTitle) =>
                triggerNotification(`Inquiry for "${itemTitle}" registered! Our team will contact you.`)
              }
              onApplyPartnership={() => setIsDealerOpen(true)}
              onNavigateToBatteryCharger={() => handlePageChange("battery-charger")}
            />
          )}

          {activePage === "battery-charger" && (
            <BatteryAndCharger 
              onEnquireClick={handleOpenQuickInquiryForQuote}
              onApplyPartnership={() => setIsDealerOpen(true)}
            />
          )}

          {activePage === "technology" && (
            <>
              <Features />
              <FAQ
                onOpenAiChat={(question) => {
                  setAiChatInitialQuestion(question);
                  setIsAiChatOpen(true);
                }}
              />
            </>
          )}

          {(activePage === "media-blogs" || activePage === "reviews") && (
            <MediaBlogsPage
              onOpenDealershipModal={() => setIsDealerOpen(true)}
              onOpenQuickContact={() => setIsContactOpen(true)}
            />
          )}

          {activePage === "locator" && (
            <LocateUs onDealershipClick={() => setIsDealerOpen(true)} />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Corporate Aligned Footer */}
      <Footer
        onDealershipClick={() => setIsDealerOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onModelSelect={handleSelectModelFromFooter}
        onPageChange={handlePageChange}
        onWhatsAppClick={handleOpenWhatsAppModal}
      />

      {/* Partner Dealership invitation application modal */}
      <DealershipModal
        isOpen={isDealerOpen}
        onClose={() => setIsDealerOpen(false)}
        onSubmitSuccess={(app) =>
          triggerNotification(
            `Dealership application for ${app.name} (${app.city}) received! Our team will contact you soon.`
          )
        }
      />

      {/* Price lead inquiry customized modal prefiller */}
      <PriceInquiryModal
        isOpen={isPriceOpen}
        onClose={() => setIsPriceOpen(false)}
        initialModelId={inquiryModelId}
        initialColorName={inquiryColorName}
        initialBatteryType={inquiryBatteryType}
        initialBatteryRange={inquiryBatteryRange}
        onSubmitSuccess={(iq) =>
          triggerNotification(
            `Inquiry on VOLMO ${iq.model} (${iq.color}) registered! Our team will contact you shortly.`
          )
        }
      />

      {/* Secured Admin database console workspace */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          setAdminInitialTab(undefined);
        }}
        initialTab={adminInitialTab}
      />

      {/* Bottom Right Floating Action Dock (Ask Volmo AI & Quick Contact) */}
      <BottomFloatingActions
        onOpenAiChat={() => {
          setAiChatInitialQuestion(undefined);
          setIsAiChatOpen(true);
        }}
        onOpenQuickContact={() => setIsContactOpen(true)}
        isAiChatOpen={isAiChatOpen}
        isQuickContactOpen={isContactOpen}
      />

      {/* Volmo AI Technical Assistant & FAQ Chatbot Modal */}
      <AiChatbotModal
        isOpen={isAiChatOpen}
        onClose={() => {
          setIsAiChatOpen(false);
          setAiChatInitialQuestion(undefined);
        }}
        initialQuestion={aiChatInitialQuestion}
        onNavigateToDealership={() => {
          setIsAiChatOpen(false);
          setIsDealerOpen(true);
        }}
        onOpenQuickContact={() => {
          setIsAiChatOpen(false);
          setIsContactOpen(true);
        }}
      />

      {/* Quick Inquiry Form Modal */}
      <QuickContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setQuickContactInitialTopic("General Inquiry");
          setQuickContactInitialMessage("");
        }}
        initialTopic={quickContactInitialTopic}
        initialMessage={quickContactInitialMessage}
        onNavigateToLocateUs={() => handlePageChange("locator")}
        onSubmitSuccess={(data: QuickContactData) =>
          triggerNotification(
            `Thank you, ${data.name}! Inquiry received. Our sales desk will contact you at +91 ${data.phone}.`
          )
        }
      />

      {/* Official Volmo WhatsApp Direct Connect Modal */}
      <WhatsAppChatModal
        isOpen={isWhatsAppOpen}
        onClose={() => {
          setIsWhatsAppOpen(false);
          setWhatsAppInitialMessage(undefined);
        }}
        initialMessage={whatsAppInitialMessage}
      />
    </div>
  );
}
