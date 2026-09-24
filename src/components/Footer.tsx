/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import SVGLogo from "./SVGLogo";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Lock } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

interface FooterProps {
  onDealershipClick: () => void;
  onAdminClick: () => void;
  onModelSelect: (id: string) => void;
  onPageChange?: (pageId: string) => void;
}

export default function Footer({ onDealershipClick, onAdminClick, onModelSelect, onPageChange }: FooterProps) {
  const { contactInfo, modelsData, brandingConfig, siteSections } = useSiteConfig();

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-slate-600 overflow-hidden">
      {/* Absolute decorative ambient light */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-slate-450/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 text-left">
        {/* Brand & Tagline */}
        <div className="space-y-4">
          <div className="flex items-center -ml-2 mb-2">
            <SVGLogo size="md" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {brandingConfig?.brandTagline
              ? `${brandingConfig.brandName} - ${brandingConfig.brandTagline}. High-efficiency, RTO-free electric two-wheelers engineered for the next era of smart urban transit.`
              : "Volmo Electrical Private Limited is pioneering eco-friendly, high-efficiency, RTO-free electric two-wheelers engineered for the next era of smart urban transit."}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck size={16} className="text-slate-600" />
            <span>{siteSections?.footerRtoText || "Guaranteed 100% RTO Free · No registration required"}</span>
          </div>
        </div>

        {/* Models */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-5">Our EV Fleet</h4>
          <ul className="space-y-3.5 text-sm">
            {modelsData.map((model) => (
              <li key={model.id}>
                <button
                  onClick={() => onModelSelect(model.id)}
                  className="hover:text-slate-905 transition-colors flex items-center justify-between w-full group cursor-pointer text-left text-slate-600 font-semibold"
                >
                  <span className="group-hover:translate-x-1 transition-transform inline-block">
                    {model.name}
                  </span>
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-mono uppercase">
                    {model.badgeText || "Active"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Battery Customization Ranges */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800 mb-5">Custom Ranges</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="text-slate-700 font-bold block mb-1">Lead-Acid System:</span>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                {siteSections?.footerCustomRangesLeadAcid || "48 km (4 batteries) · 60 km (5 batteries) · 72 km (6 batteries)"}
              </p>
            </li>
            <li>
              <span className="text-slate-700 font-bold block mb-1">Lithium-Ion System:</span>
              <p className="text-xs text-slate-500 leading-normal font-medium">
                {siteSections?.footerCustomRangesLithium || "60 km · 80 km · 100 km · 120 km · 145 km · 180 km packs"}
              </p>
            </li>
            <li className="pt-2">
              <button
                onClick={() => onPageChange?.("battery-charger")}
                className="text-xs text-orange-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Battery &amp; Charger Hub (1-3 Yr Warranty) &rarr;</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange?.("accessories")}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Original Volmo Accessories &rarr;</span>
              </button>
            </li>
            <li className="pt-1">
              <button
                onClick={onDealershipClick}
                className="text-xs text-slate-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{siteSections?.footerPartnerText || "Partner with Volmo today"}</span>
                <ExternalLink size={12} />
              </button>
            </li>
          </ul>
        </div>

        {/* Addresses & Contacts */}
        <div className="space-y-5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-800">Corporate Details</h4>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Mail className="text-slate-600 flex-shrink-0 mt-1" size={16} />
              <div>
                <span className="text-xs text-slate-500 block font-medium">Official Sales Email</span>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-slate-755 hover:text-slate-905 font-bold break-all font-mono"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="text-slate-600 flex-shrink-0 mt-1" size={16} />
              <div>
                <span className="text-xs text-slate-500 block font-medium">Direct Helpline Support</span>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-slate-755 hover:text-slate-905 font-black font-mono text-base"
                >
                  +91 {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="text-slate-600 flex-shrink-0 mt-1" size={16} />
              <div>
                <span className="text-xs text-slate-500 block font-medium">Manufacturing Plant</span>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {contactInfo.factoryAddress}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="text-slate-600 flex-shrink-0 mt-1" size={16} />
              <div>
                <span className="text-xs text-slate-500 block font-medium">Registered Head Office</span>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {contactInfo.headOfficeAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discretely placed system entry at bottom */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-500 font-normal">
        <p className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAdminClick}
            className="hover:text-slate-800 cursor-default select-none focus:outline-none transition-colors"
            aria-label="Volmo Legal Copyright"
          >
            &copy;
          </button>
          <span>{new Date().getFullYear()} Volmo Electrical Private Limited. All Rights Reserved. Produced in India.</span>
        </p>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono text-[10px] select-none">VER. 1.4.2 [Production]</span>
          <button
            type="button"
            onClick={onAdminClick}
            className="opacity-15 hover:opacity-75 transition-opacity p-1 text-slate-500 hover:text-slate-900 cursor-pointer focus:outline-none"
            aria-label="Restricted System Gate"
          >
            <Lock size={10} />
          </button>
        </div>
      </div>
    </footer>
  );
}
