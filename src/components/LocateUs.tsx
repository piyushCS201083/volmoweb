/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, Copy, CheckCircle2, Navigation } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

export default function LocateUs() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { contactInfo, siteSections } = useSiteConfig();

  const locations = [
    {
      title: siteSections?.plantTitle || "Volmo EV Manufacturing Plant",
      type: siteSections?.plantType || "Factory & assembly line",
      address: contactInfo.factoryAddress,
      coords: "Behind Arogyadhaam Hospital, City Center, Gwalior",
      hours: siteSections?.plantHours || "Monday - Saturday: 09:00 AM - 07:00 PM",
      contact: contactInfo.phone,
      mapEmbedUrl: "https://maps.google.com/maps?q=arogyadhaam%20hospital%20city%20center%20gwalior&t=&z=14&ie=UTF8&iwloc=&output=embed",
    },
    {
      title: siteSections?.hqTitle || "Volmo Corporate Head Office",
      type: siteSections?.hqType || "Registered headquarters",
      address: contactInfo.headOfficeAddress,
      coords: "Shivhare Colony, Singhpur Road, Morar, Gwalior",
      hours: siteSections?.hqHours || "Monday - Friday: 10:00 AM - 06:05 PM",
      contact: contactInfo.phone,
      mapEmbedUrl: "https://maps.google.com/maps?q=baradari%20choraha%20morar%20gwalior&t=&z=14&ie=UTF8&iwloc=&output=embed",
    },
  ];

  const handleCopy = (address: string, id: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <section id="locate-us" className="py-24 bg-white border-b border-slate-200 px-4 sm:px-6 relative">
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-slate-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Title Indicator */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase bg-slate-200/60 text-slate-705 border border-slate-300 px-3.5 py-1.5 rounded-full font-bold inline-block">
            Visit Volmo HQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
            Our Locations in Gwalior
          </h2>
          <p className="text-slate-650 text-sm font-normal font-sans max-w-md mx-auto">
            Review of our primary commercial assets. Our plant constructs premium electric vehicles daily with skilled engineering technicians.
          </p>
        </div>

        {/* Addresses Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {locations.map((loc, idx) => (
            <motion.div
              key={loc.title}
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all shadow-xs text-left"
            >
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-650 font-bold">
                      {loc.type}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{loc.title}</h3>
                  </div>
                  <div className="p-3 bg-slate-200/60 text-slate-705 rounded-2xl flex-shrink-0">
                    <MapPin size={22} />
                  </div>
                </div>

                {/* Details layout */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Navigation size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                        Postal Address
                      </span>
                      <p className="text-slate-800 mt-0.5 leading-relaxed font-bold">
                        {loc.address}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(loc.address, loc.title)}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer flex-shrink-0"
                      title="Copy Address"
                    >
                      {copiedAddress === loc.title ? (
                        <CheckCircle2 size={15} className="text-emerald-600" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                        Working Hours
                      </span>
                      <p className="text-slate-800 mt-0.5 font-medium">{loc.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                        Support Hotline
                      </span>
                      <a
                        href={`tel:${loc.contact}`}
                        className="text-slate-805 mt-0.5 hover:text-slate-905 transition-colors font-bold font-mono inline-block"
                      >
                        +91 {loc.contact}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Google Map Embed */}
              <div className="mt-8 relative h-48 sm:h-56 bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
                <iframe
                  title={`Map location for ${loc.title}`}
                  src={loc.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
