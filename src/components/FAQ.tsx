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
  Sparkles,
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

interface FAQProps {
  onOpenAiChat?: (initialQuestion?: string) => void;
}

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

export default function FAQ({ onOpenAiChat }: FAQProps) {
  const { faqsData, siteSections, contactInfo } = useSiteConfig();
  const list = faqsData && faqsData.length > 0 ? faqsData : [];
  const [openId, setOpenId] = useState<number | null>(list.length > 0 ? list[0].id : null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const companyEmail = contactInfo?.email || "sales@volmoelectrical.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(companyEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

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
            {onOpenAiChat && (
              <button
                type="button"
                onClick={() => onOpenAiChat()}
                className="py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all cursor-pointer active:scale-95 text-xs text-center uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <Sparkles size={14} />
                <span>Ask Volmo AI</span>
              </button>
            )}
            <a
              href="tel:9111333151"
              className="py-3 px-6 bg-slate-805 hover:bg-slate-905 text-white font-bold rounded-2xl transition-all cursor-pointer active:scale-95 text-xs text-center uppercase tracking-wider"
            >
              Call support
            </a>
            <a
              href={`mailto:${companyEmail}`}
              onClick={(e) => {
                e.preventDefault();
                setIsEmailModalOpen(true);
              }}
              className="py-3 px-6 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 font-semibold rounded-2xl transition-all cursor-pointer active:scale-95 text-xs text-center uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5"
            >
              <Mail size={14} className="text-slate-500" />
              <span>Email technical team</span>
            </a>
          </div>
        </div>

      </div>

      {/* Company Email Popup Modal */}
      <AnimatePresence>
        {isEmailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEmailModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 overflow-hidden z-10 text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              {/* Header with Icon */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-600">
                    Direct Contact
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Company Email ID
                  </h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed font-normal">
                Reach out directly to the Volmo Electric technical team and corporate headquarters for technical inquiries, schematics, and dealership support.
              </p>

              {/* Email Address Display Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 mb-5 group hover:border-slate-300 transition-colors">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Official Email
                  </span>
                  <a
                    href={`mailto:${companyEmail}`}
                    className="text-sm sm:text-base font-mono font-bold text-slate-900 hover:text-orange-600 transition-colors truncate block"
                    title={companyEmail}
                  >
                    {companyEmail}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                    copiedEmail
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs"
                  }`}
                  aria-label="Copy email address"
                >
                  {copiedEmail ? (
                    <>
                      <Check size={14} className="text-emerald-600" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`mailto:${companyEmail}`}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs text-center uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Open Email Client</span>
                  <ExternalLink size={13} />
                </a>
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs text-center uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
