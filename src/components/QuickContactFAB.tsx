/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquareText, Sparkles } from "lucide-react";

interface QuickContactFABProps {
  onClick: () => void;
  isOpen?: boolean;
}

export default function QuickContactFAB({ onClick, isOpen = false }: QuickContactFABProps) {
  // If modal is open, we can keep the button or hide it so it doesn't distract
  if (isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 print:hidden">
      <button
        type="button"
        onClick={onClick}
        aria-label="Quick Contact & Inquiries"
        className="group relative flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl shadow-slate-900/30 border border-slate-700/50 transition-all duration-200 cursor-pointer hover:shadow-emerald-950/20"
      >
        {/* Pulsing availability indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>

        {/* Icon */}
        <div className="text-emerald-400 group-hover:rotate-12 transition-transform duration-300">
          <MessageSquareText size={18} />
        </div>

        {/* Text */}
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wide uppercase text-white">
            Quick Contact
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline leading-none">
            Instant Inquiry Desk
          </span>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity -z-10 pointer-events-none" />
      </button>
    </div>
  );
}
