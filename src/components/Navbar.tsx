/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import { Store, Folders, Phone, FileText, Menu, X, BarChart2, Sliders } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

interface NavbarProps {
  activePage: string;
  onPageChange: (pageId: string) => void;
  onDealershipClick: () => void;
  onAdminClick?: () => void;
}

export default function Navbar({ activePage, onPageChange, onDealershipClick, onAdminClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { siteSections } = useSiteConfig();
  const applyBtnText = siteSections?.navDealershipBtn || "Apply Dealership";

  const menuItems = [
    { label: "Home", pageId: "home" },
    { label: "Our Models", pageId: "models" },
    { label: "Accessories", pageId: "accessories" },
    { label: "Battery & Charger", pageId: "battery-charger" },
    { label: "Media & Blogs", pageId: "media-blogs" },
    { label: "Tech & FAQs", pageId: "technology" },
    { label: "Locate Us", pageId: "locator" }
  ];

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => handleNavClick("home")}>
            <Logo size="md" />
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium">
            {menuItems.map((item) => {
              const isActive = activePage === item.pageId;
              return (
                <button
                  key={item.pageId}
                  onClick={() => handleNavClick(item.pageId)}
                  className={`py-2 cursor-pointer font-sans transition-all relative ${
                    isActive
                      ? "text-slate-900 font-extrabold tracking-tight"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                className="text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-300 font-semibold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100"
                title="Admin Control Panel (Ctrl+Shift+A)"
              >
                <Sliders size={13} className="text-orange-600" />
                <span>Admin CMS</span>
              </button>
            )}

            <button
              onClick={onDealershipClick}
              className="bg-slate-805 hover:bg-slate-700 text-white font-bold text-xs tracking-wider uppercase px-5 py-3 rounded-xl transition-all shadow-md shadow-slate-800/10 cursor-pointer active:scale-95 flex items-center gap-2 bg-slate-800"
            >
              <Store size={15} />
              <span>{applyBtnText}</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:text-slate-950 rounded-full hover:bg-slate-100 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2">
            {menuItems.map((item) => {
              const isActive = activePage === item.pageId;
              return (
                <button
                  key={item.pageId}
                  onClick={() => handleNavClick(item.pageId)}
                  className={`w-full text-left py-3 px-4 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "text-slate-900 bg-slate-100 border border-slate-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => {
                onDealershipClick();
                setIsOpen(false);
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl font-bold tracking-wider uppercase text-xs text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-slate-850/10"
            >
              <Store size={15} />
              <span>{applyBtnText}</span>
            </button>

            {onAdminClick && (
              <button
                type="button"
                onClick={() => {
                  onAdminClick();
                  setIsOpen(false);
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-4 rounded-xl font-bold tracking-wider uppercase text-xs text-center flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
              >
                <Sliders size={14} className="text-orange-600" />
                <span>Admin CMS Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
