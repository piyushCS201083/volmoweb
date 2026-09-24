/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  ChevronDown,
  Shield,
  Battery,
  Wrench,
  Award,
  Zap,
  Activity,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

const getFAQIcon = (iconName: string) => {
  switch (iconName) {
    case "Shield":
      return <Shield size={20} className="text-slate-600" />;
    case "Battery":
      return <Battery size={20} className="text-slate-600" />;
    case "Wrench":
      return <Wrench size={20} className="text-slate-600" />;
    case "Award":
      return <Award size={20} className="text-slate-600" />;
    case "Zap":
      return <Zap size={20} className="text-slate-600" />;
    case "Activity":
      return <Activity size={20} className="text-slate-600" />;
    default:
      return <HelpCircle size={20} className="text-slate-600" />;
  }
};

export default function FAQ() {
  const { faqsData, siteSections } = useSiteConfig();
  const list = faqsData && faqsData.length > 0 ? faqsData : [];
  const [openId, setOpenId] = useState<number | null>(list.length > 0 ? list[0].id : null);

  const toggleItem = (id: number) => {
    setOpenId(openId === id ? null : id);
  };
  return (
    <section id="faq" className="py-24 bg-slate-50 border-b border-slate-200 relative">
      {/* Background glow highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-slate-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Title Block - styling matches Features section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs uppercase tracking-widest font-bold text-slate-700 font-mono">
            {siteSections?.faqBadge || "Support Headquarters"}
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 font-sans">
            {siteSections?.faqHeading || "Frequently Asked Queries"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal font-sans max-w-xl mx-auto">
            {siteSections?.faqSubtitle || "Find prompt, comprehensive answers to regulatory compliance, optimized battery maintenance, and local servicing for your custom electric scooter."}
          </p>
        </div>

        {/* FAQs Bento-Styled Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {list.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => toggleItem(item.id)}
                className={`group bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer select-none text-left flex flex-col justify-between hover:border-slate-350 ${
                  isOpen ? "border-slate-400 bg-slate-50/50" : ""
                }`}
              >
                <div className="space-y-4">
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-500 group-hover:text-slate-905 transition-colors">
                      {item.category}
                    </span>
                    <div className="p-2.5 bg-slate-100 rounded-xl">
                      {getFAQIcon(item.iconName)}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-850 group-hover:text-slate-905 transition-colors leading-snug">
                      {item.question}
                    </h3>
                    <div className={`p-1 text-slate-400 group-hover:text-slate-800 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-slate-800" : ""
                    }`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>

                  {/* Answer expand block (AnimatePresence height) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-slate-655 leading-relaxed font-normal pt-2 pl-0.5 whitespace-pre-line border-t border-slate-100 mt-4">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Aesthetic indicator line bottom */}
                <div className={`h-0.5 bg-slate-800 mt-6 transition-all duration-300 rounded-full ${
                  isOpen ? "w-1/3" : "w-0 group-hover:w-12"
                }`} />
              </motion.div>
            );
          })}
        </div>

        {/* Support Banner Card - Matches heavy technical block format of features */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-md">
          <div className="absolute right-0 bottom-0 top-0 w-2/3 bg-[radial-gradient(ellipse_at_bottom_right,rgba(148,163,184,0.02),transparent_50%)] pointer-events-none" />
          
          <div className="space-y-4 text-left relative z-10 max-w-2xl">
            <span className="text-[10px] bg-slate-200/60 border border-slate-300 text-slate-705 font-extrabold uppercase px-3 py-1 rounded-md tracking-wider">
              Still Have Doubts?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Connect Directly with Our Gwalior Helpline Support Center
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              We are glad to consult and explain complete electric guidelines, local charging layouts, battery compartment selections, or handle bulk dealership commercial queries. 
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10 flex-shrink-0">
            <a
              href="tel:9111333151"
              className="py-3 px-6 bg-slate-805 hover:bg-slate-905 text-white font-bold rounded-2xl transition-all cursor-pointer active:scale-95 text-xs text-center uppercase tracking-wider"
            >
              Call support
            </a>
            <a
              href="mailto:piyushshivhare003@gmail.com"
              className="py-3 px-6 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 font-semibold rounded-2xl transition-all cursor-pointer active:scale-95 text-xs text-center uppercase tracking-wider shadow-sm"
            >
              Email technical team
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
