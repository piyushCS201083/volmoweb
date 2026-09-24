/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Building, Save, Phone, Mail, MapPin, Globe, Clock, ShieldCheck, FileText } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useSiteConfig } from "../../SiteConfigContext";
import { BrandingConfig, ContactInfo, SiteSectionsConfig } from "../../data";

interface BrandingCMSProps {
  onShowToast: (msg: string) => void;
}

export default function BrandingCMS({ onShowToast }: BrandingCMSProps) {
  const {
    contactInfo,
    updateContactInfo,
    brandingConfig,
    updateBrandingConfig,
    siteSections,
    updateSiteSections,
  } = useSiteConfig();

  const [contactForm, setContactForm] = useState<ContactInfo>(contactInfo);
  const [brandingForm, setBrandingForm] = useState<BrandingConfig>(brandingConfig);
  const [sectionsForm, setSectionsForm] = useState<SiteSectionsConfig>(siteSections);

  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  useEffect(() => {
    setBrandingForm(brandingConfig);
  }, [brandingConfig]);

  useEffect(() => {
    setSectionsForm(siteSections);
  }, [siteSections]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    updateBrandingConfig(brandingForm);
    updateSiteSections(sectionsForm);
    onShowToast("Corporate branding, footer lines, and hours saved successfully!");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
              <Building size={18} className="text-orange-400" />
              Corporate Identity, Logo &amp; Factory CMS
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Customize brand name, uploaded logo emblem, plant address, customer support hotlines, and footer details.
            </p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>

        {/* 1. Brand Identity & Logo */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Brand Identity &amp; Logo Photo
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Brand Name
              </label>
              <input
                type="text"
                value={brandingForm.brandName}
                onChange={(e) => setBrandingForm({ ...brandingForm, brandName: e.target.value })}
                placeholder="VOLMO"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Brand Tagline
              </label>
              <input
                type="text"
                value={brandingForm.brandTagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, brandTagline: e.target.value })}
                placeholder="Future of Electric Mobility"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          <ImageUploader
            label="Custom Logo Image (Optional PNG)"
            value={brandingForm.customLogoUrl || ""}
            onChange={(newVal) => setBrandingForm({ ...brandingForm, customLogoUrl: newVal })}
            helperText="Leave empty to use official Volmo PNG logo"
            aspectRatio="wide"
          />
          {brandingForm.customLogoUrl && (
            <button
              type="button"
              onClick={() => {
                setBrandingForm({ ...brandingForm, customLogoUrl: "" });
                onShowToast("Restored official Volmo PNG logo.");
              }}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Clear custom logo and restore official PNG logo
            </button>
          )}
        </div>

        {/* 2. Direct Support Helplines */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Direct Communications &amp; Helpline
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Helpline Phone Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="7880008401"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Official Sales Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="sales@volmo.in"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Physical Plant & Corporate Addresses */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            3. Physical Plant &amp; Corporate Locations &amp; Timings
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Manufacturing Plant Working Hours
              </label>
              <div className="relative">
                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={sectionsForm.plantHours}
                  onChange={(e) => setSectionsForm({ ...sectionsForm, plantHours: e.target.value })}
                  placeholder="Monday - Saturday: 09:00 AM - 07:00 PM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Corporate Head Office Working Hours
              </label>
              <div className="relative">
                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={sectionsForm.hqHours}
                  onChange={(e) => setSectionsForm({ ...sectionsForm, hqHours: e.target.value })}
                  placeholder="Monday - Friday: 10:00 AM - 06:05 PM"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Manufacturing Assembly Plant Address
            </label>
            <textarea
              rows={3}
              required
              value={contactForm.factoryAddress}
              onChange={(e) => setContactForm({ ...contactForm, factoryAddress: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Registered Head Office Address
            </label>
            <textarea
              rows={3}
              required
              value={contactForm.headOfficeAddress}
              onChange={(e) => setContactForm({ ...contactForm, headOfficeAddress: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* 4. Global Website Navigation & Footer Lines */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} className="text-orange-400" />
            4. Global Website Navigation &amp; Footer Texts
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Navbar Dealership Button Text
              </label>
              <input
                type="text"
                value={sectionsForm.navDealershipBtn}
                onChange={(e) => setSectionsForm({ ...sectionsForm, navDealershipBtn: e.target.value })}
                placeholder="Apply Dealership"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Footer RTO Exemption Guarantee Badge
              </label>
              <input
                type="text"
                value={sectionsForm.footerRtoText}
                onChange={(e) => setSectionsForm({ ...sectionsForm, footerRtoText: e.target.value })}
                placeholder="Guaranteed 100% RTO Free · No registration required"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Footer Lead-Acid Custom Ranges Text
              </label>
              <input
                type="text"
                value={sectionsForm.footerCustomRangesLeadAcid}
                onChange={(e) => setSectionsForm({ ...sectionsForm, footerCustomRangesLeadAcid: e.target.value })}
                placeholder="48 km (4 batteries) · 60 km (5 batteries) · 72 km (6 batteries)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Footer Lithium Custom Ranges Text
              </label>
              <input
                type="text"
                value={sectionsForm.footerCustomRangesLithium}
                onChange={(e) => setSectionsForm({ ...sectionsForm, footerCustomRangesLithium: e.target.value })}
                placeholder="60 km · 80 km · 100 km · 120 km · 145 km · 180 km packs"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Footer Dealership Callout Link Text
              </label>
              <input
                type="text"
                value={sectionsForm.footerPartnerText}
                onChange={(e) => setSectionsForm({ ...sectionsForm, footerPartnerText: e.target.value })}
                placeholder="Partner with Volmo today"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={brandingForm.footerCopyright}
                onChange={(e) => setBrandingForm({ ...brandingForm, footerCopyright: e.target.value })}
                placeholder="Volmo Electrical Private Limited. All Rights Reserved. Produced in India."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-xl shadow-orange-600/25"
          >
            <Save size={16} />
            Save Corporate Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
