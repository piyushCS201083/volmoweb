/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, MessageSquareText } from "lucide-react";

interface BottomFloatingActionsProps {
  onOpenAiChat: () => void;
  onOpenQuickContact: () => void;
  isAiChatOpen?: boolean;
  isQuickContactOpen?: boolean;
}

export default function BottomFloatingActions({
  onOpenAiChat,
  onOpenQuickContact,
  isAiChatOpen = false,
  isQuickContactOpen = false,
}: BottomFloatingActionsProps) {
  // If either modal is open, hide to avoid distraction
  if (isAiChatOpen || isQuickContactOpen) return null;

  return (
    <aside aria-label="Customer Support and AI Assistant" className="fixed bottom-6 right-6 z-40 print:hidden flex flex-col items-end gap-2">
      {/* 1. Quick Inquiry Button (On Top) */}
      <button
        type="button"
        onClick={onOpenQuickContact}
        aria-label="Open Quick Inquiry Form"
        className="group relative flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white pl-3.5 pr-4 py-2.5 sm:py-3 rounded-full shadow-2xl shadow-slate-900/35 border border-slate-700/60 transition-all duration-200 cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
          <MessageSquareText size={16} />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black tracking-wide uppercase text-white">
            Quick Inquiry
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline leading-none">
            Book Test Ride &middot; Locate Dealer
          </span>
        </div>
      </button>

      {/* 2. Small Volmo AI Chatbot Button (Placed Below Contact Button) */}
      <button
        type="button"
        onClick={onOpenAiChat}
        aria-label="Open Volmo AI Scooter FAQ and Technical Assistant"
        className="group relative flex items-center gap-1.5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 hover:to-emerald-900 active:scale-95 text-white px-3 py-1.5 rounded-full shadow-md shadow-slate-900/25 border border-emerald-500/30 transition-all duration-200 cursor-pointer text-xs"
      >
        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>

        {/* AI Sparkles icon */}
        <div className="text-emerald-400 group-hover:rotate-12 transition-transform duration-300">
          <Sparkles size={13} />
        </div>

        {/* Compact Text */}
        <span className="text-xs font-bold text-slate-200 group-hover:text-white tracking-wide">
          Ask AI
        </span>
        <span className="text-[9px] font-mono font-bold bg-emerald-500/25 text-emerald-300 px-1.5 py-0.5 rounded">
          Gemini
        </span>
      </button>
    </aside>
  );
}
