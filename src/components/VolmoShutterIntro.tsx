/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import volmoLogoPng from "../assets/images/volmo_logo.png";
import volmoShutterHighwayBg from "../assets/images/volmo_shutter_highway_bg_1791058561490.jpg";

interface VolmoShutterIntroProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function VolmoShutterIntro({ isOpen, onComplete }: VolmoShutterIntroProps) {
  const [slidingUp, setSlidingUp] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSlidingUp(false);
      return;
    }

    // Smoothly start sliding up after brief brand flash
    const startTimer = setTimeout(() => {
      setSlidingUp(true);
    }, 400);

    // Complete and unmount
    const doneTimer = setTimeout(() => {
      onComplete();
    }, 1600);

    // Allow user to dismiss with any key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(doneTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onComplete}
          className="fixed inset-0 z-[70] pointer-events-auto overflow-hidden select-none cursor-pointer"
          title="Click anywhere to enter website immediately"
        >
          {/* Quick Skip Button in Corner */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onComplete();
            }}
            className="absolute top-6 right-6 z-30 bg-black/60 hover:bg-black/85 text-white/90 hover:text-white px-4 py-2 rounded-full border border-white/20 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg backdrop-blur-md cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Enter Site</span>
            <span>&rarr;</span>
          </button>

          {/* Animated Showroom Shutter Panel that slides upwards to reveal the website */}
          <motion.div
            initial={{ y: "0%" }}
            animate={{ y: slidingUp ? "-106%" : "0%" }}
            transition={{
              duration: 1.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative w-full h-full bg-slate-900 overflow-hidden border-b-[6px] border-orange-500 shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
          >
            {/* Full-Screen Sunrise Highway Background (No Scooter on Right) */}
            <img
              src={volmoShutterHighwayBg}
              alt="Volmo Electric Two Wheelers Showroom Shutter"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Centered Large Volmo Lockup & Taglines Matching the Uploaded Image */}
            <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-6 flex flex-col items-center justify-center -mt-10 sm:-mt-14">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center text-center"
              >
                {/* Large Centered Official Volmo PNG Logo */}
                <img
                  src={volmoLogoPng}
                  alt="VOLMO"
                  referrerPolicy="no-referrer"
                  className="w-[86vw] max-w-4xl h-auto object-contain drop-shadow-[0_4px_20px_rgba(255,255,255,0.8)]"
                />

                {/* ELECTRIC TWO WHEELERS */}
                <div className="mt-4 sm:mt-6 text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.38em] text-[#262425] uppercase drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)]">
                  ELECTRIC TWO WHEELERS
                </div>

                {/* CLEAN ENERGY | SMARTER MOBILITY | A BRIGHTER TOMORROW */}
                <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-5 text-xs sm:text-base md:text-lg lg:text-xl font-normal tracking-[0.2em] text-[#373435] uppercase drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)]">
                  <span>CLEAN ENERGY</span>
                  <span className="text-orange-500 font-bold">|</span>
                  <span>SMARTER MOBILITY</span>
                  <span className="text-orange-500 font-bold">|</span>
                  <span>A BRIGHTER TOMORROW</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Metallic Shutter Bar */}
            <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-600 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
