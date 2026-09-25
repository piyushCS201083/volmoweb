/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import Logo from "./Logo";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Lock, Share2 } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";
import { getWhatsAppUrl, VOLMO_WHATSAPP_DISPLAY } from "../utils/whatsapp";

interface FooterProps {
  onDealershipClick: () => void;
  onAdminClick?: () => void;
  onModelSelect: (id: string) => void;
  onPageChange?: (pageId: string) => void;
  onWhatsAppClick?: (initialMessage?: string) => void;
}

const SOCIAL_CHANNELS = [
  {
    name: "WhatsApp",
    label: `Chat with Volmo on WhatsApp (${VOLMO_WHATSAPP_DISPLAY})`,
    handle: VOLMO_WHATSAPP_DISPLAY,
    url: getWhatsAppUrl("Hello Volmo Electric, I would like to inquire about your electric scooters and request pricing details."),
    badgeColor: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366] hover:text-white",
    hoverBorder: "hover:border-[#25D366]/60 hover:text-[#25D366] hover:bg-[#25D366]/5",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    label: "Follow Volmo on LinkedIn",
    handle: "volmo-electrical-pvt-ltd",
    url: "https://www.linkedin.com/company/volmo-electrical-pvt-ltd/",
    badgeColor: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30 hover:bg-[#0A66C2] hover:text-white",
    hoverBorder: "hover:border-[#0A66C2]/60 hover:text-[#0A66C2] hover:bg-[#0A66C2]/5",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.01-3.28 1.64 1.64 0 0 0 .01 3.28M5.07 18.5h2.78v-8.37H5.07v8.37Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    label: "Follow Volmo on Instagram",
    handle: "@volmo_ev",
    url: "https://www.instagram.com/volmo_ev?stkn=OHpnbXl1aTJsaWNy&utm_source=qr",
    badgeColor: "bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white",
    hoverBorder: "hover:border-[#E4405F]/60 hover:text-[#E4405F] hover:bg-[#E4405F]/5",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    label: "Follow Volmo on X (Twitter)",
    handle: "@volmoelectrical",
    url: "https://x.com/volmoelectrical?s=11",
    badgeColor: "bg-slate-900/10 text-slate-900 border-slate-900/30 hover:bg-slate-950 hover:text-white",
    hoverBorder: "hover:border-slate-900/60 hover:text-slate-950 hover:bg-slate-100",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    label: "Subscribe to Volmo on YouTube",
    handle: "@volmoelectrical",
    url: "https://youtube.com/@volmoelectrical?si=HUx0L-ir6VvHrrTF",
    badgeColor: "bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30 hover:bg-[#FF0000] hover:text-white",
    hoverBorder: "hover:border-[#FF0000]/60 hover:text-[#FF0000] hover:bg-[#FF0000]/5",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    label: "Follow Volmo on Facebook",
    handle: "Volmo Electrical",
    url: "https://www.facebook.com/share/1HiziVA6Sq/?mibextid=wwXIfr",
    badgeColor: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2] hover:text-white",
    hoverBorder: "hover:border-[#1877F2]/60 hover:text-[#1877F2] hover:bg-[#1877F2]/5",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer({
  onDealershipClick,
  onAdminClick,
  onModelSelect,
  onPageChange,
  onWhatsAppClick,
}: FooterProps) {
  const { contactInfo, modelsData, brandingConfig, siteSections } = useSiteConfig();

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 pt-16 pb-8 text-slate-600 overflow-hidden">
      {/* Absolute decorative ambient light */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-slate-450/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 text-left">
        {/* Brand & Tagline */}
        <div className="space-y-4">
          <div className="flex items-center -ml-2 mb-2">
            <Logo size="md" />
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

          {/* Social Media Channels in Brand Column */}
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Follow Volmo Electric
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {SOCIAL_CHANNELS.map((ch) => (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (ch.name === "WhatsApp" && onWhatsAppClick) {
                      e.preventDefault();
                      onWhatsAppClick();
                    }
                  }}
                  aria-label={ch.label}
                  title={ch.label}
                  className={`w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95 ${ch.hoverBorder}`}
                >
                  {ch.icon}
                </a>
              ))}
            </div>
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
            <li>
              <button
                onClick={() => onPageChange?.("media-blogs")}
                className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Media &amp; Blogs (Savings Calculator &amp; Careers) &rarr;</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange?.("locator")}
                className="text-xs text-blue-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Contact Us &amp; Dealership Locations &rarr;</span>
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
                <span className="text-xs text-slate-500 block font-medium">Company Operated Showroom</span>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  In front of Heera bhumiya, chandravadni naka main road, lashkar, gwalior, (m.p)
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

      {/* Social Media & Community Connect Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Official Volmo Social Media
              </h4>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                Connect
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Follow our official channels for electric scooter news, customer ride stories, battery charging advice, and video walkarounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {SOCIAL_CHANNELS.map((ch) => (
              <a
                key={ch.name}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (ch.name === "WhatsApp" && onWhatsAppClick) {
                    e.preventDefault();
                    onWhatsAppClick();
                  }
                }}
                aria-label={ch.label}
                title={ch.label}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-950 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  ch.name === "WhatsApp" ? "hover:border-[#25D366]/50 hover:text-[#25D366]" : ""
                }`}
              >
                <div className={`${ch.name === "WhatsApp" ? "text-[#25D366]" : "text-slate-500"} group-hover:text-inherit transition-colors`}>
                  {ch.icon}
                </div>
                <span>{ch.name}</span>
                <ExternalLink size={11} className="text-slate-400 group-hover:text-slate-600 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Discretely placed system entry at bottom */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-xs text-slate-500 font-normal">
        <p className="flex items-center gap-1">
          {onAdminClick ? (
            <button
              type="button"
              onClick={onAdminClick}
              className="hover:text-slate-800 cursor-default select-none focus:outline-none transition-colors"
              aria-label="Volmo Legal Copyright"
            >
              &copy;
            </button>
          ) : (
            <span>&copy;</span>
          )}
          <span>{new Date().getFullYear()} Volmo Electrical Private Limited. All Rights Reserved. Produced in India.</span>
        </p>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono text-[10px] select-none">VER. 1.4.2 [Production]</span>
          {onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              className="opacity-35 hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-slate-900 cursor-pointer focus:outline-none rounded hover:bg-slate-200/50"
              title="Admin Portal"
              aria-label="Restricted System Gate"
            >
              <Lock size={11} />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
