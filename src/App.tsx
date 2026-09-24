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
import FAQ from "./components/FAQ";
import DealershipLocator from "./components/DealershipLocator";
import Footer from "./components/Footer";
import DealershipModal from "./components/DealershipModal";
import PriceInquiryModal from "./components/PriceInquiryModal";
import AdminPortal from "./components/AdminPortal";
import { BatteryType } from "./types";
import { ShieldAlert, CheckCircle } from "lucide-react";

export default function App() {
  // Modal toggles
  const [isDealerOpen, setIsDealerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<
    "accessories" | "battery-charger" | undefined
  >(undefined);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  // Active page sub-routing state
  const [activePage, setActivePage] = useState<string>("home");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

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

  // Optional secret keyboard shortcut: Ctrl+Shift+A or Alt+Shift+A to toggle admin
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased relative">
      {/* Dynamic Pop-up Status Toast notification (custom built in pure Tailwind) */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex items-start gap-3.5 animate-bounce text-left">
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
        onAdminClick={() => setIsAdminOpen(true)}
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
              />
              
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
              onAdminEditClick={() => {
                setAdminInitialTab("accessories");
                setIsAdminOpen(true);
              }}
            />
          )}

          {activePage === "battery-charger" && (
            <BatteryAndCharger 
              onEnquireClick={(itemTitle) =>
                triggerNotification(`Quote request for "${itemTitle}" registered! Our technical sales desk will contact you.`)
              }
              onApplyPartnership={() => setIsDealerOpen(true)}
              onAdminEditClick={() => {
                setAdminInitialTab("battery-charger");
                setIsAdminOpen(true);
              }}
            />
          )}

          {activePage === "technology" && (
            <>
              <Features />
              <FAQ />
            </>
          )}

          {activePage === "reviews" && (
            <Testimonials />
          )}

          {activePage === "locator" && (
            <DealershipLocator />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Corporate Aligned Footer */}
      <Footer
        onDealershipClick={() => setIsDealerOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onModelSelect={handleSelectModelFromFooter}
        onPageChange={handlePageChange}
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
    </div>
  );
}
