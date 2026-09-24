/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Quote, ShieldCheck, UserCheck } from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";

export default function Testimonials() {
  const { testimonialsData, siteSections } = useSiteConfig();
  const list = testimonialsData && testimonialsData.length > 0 ? testimonialsData : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPlaying, setIsPlaying] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentIndex >= list.length && list.length > 0) {
      setCurrentIndex(0);
    }
  }, [list.length, currentIndex]);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (!isPlaying || list.length <= 1) return;
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 6000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, isPlaying, list.length]);

  const handlePrev = () => {
    if (list.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (list.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Modern variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      }
    })
  };

  if (list.length === 0) return null;
  const active = list[currentIndex] || list[0];

  return (
    <section 
      id="testimonials" 
      className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Decorative premium ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-slate-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-slate-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono uppercase bg-slate-200/60 text-slate-705 border border-slate-300 px-3.5 py-1.5 rounded-full font-bold inline-flex items-center gap-1.5">
            <UserCheck size={12} className="text-slate-600" />
            <span>{siteSections?.testimonialsBadge || "Over 5,000+ Happy Riders"}</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight font-sans">
            {siteSections?.testimonialsHeading || "Hear from Volmo Riders"}
          </h2>
          <p className="text-slate-600 text-sm font-normal font-sans max-w-lg mx-auto">
            {siteSections?.testimonialsSubtitle || "Discover why EV owners in Gwalior prefer our RTO-free intelligent electric scooters for daily transit. Real people, genuine savings, pure electric power."}
          </p>
        </div>

        {/* Testimonial Active Display Area with Navigation */}
        <div className="max-w-4xl mx-auto relative px-4 sm:px-12">
          
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 min-h-[380px] sm:min-h-[340px] flex flex-col justify-between overflow-hidden shadow-sm backdrop-blur-sm">
            
            {/* Top quote accent */}
            <div className="absolute right-8 top-8 text-slate-100 pointer-events-none z-0">
              <Quote size={120} className="stroke-[1.5]" />
            </div>

            {/* Content Switcher container */}
            <div className="relative z-10 flex-grow py-2 text-left">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={active.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Rating Stars */}
                  <div className="flex gap-1 animate-pulse">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400 stroke-1" />
                    ))}
                  </div>

                  {/* Testimonial Key Highlight */}
                  <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-tight">
                    "{active.highlightText}"
                  </h3>

                  {/* Main Paragraph */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    {active.text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* User Info Segment */}
            <div className="relative z-10 border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-left">
                
                {/* Generative UI Avatar badge with gradient shadow or custom photo */}
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-lg shadow-slate-500/10 flex-shrink-0 bg-gradient-to-tr from-slate-800 to-slate-500 font-bold text-white text-base font-sans tracking-wide flex items-center justify-center">
                  {active.avatarUrl ? (
                    <img
                      src={active.avatarUrl}
                      alt={active.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    active.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>

                <div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span>{active.name}</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-555/15 border border-emerald-500/20 text-emerald-700 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md">
                      <ShieldCheck size={10} />
                      Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-550 font-sans font-medium">
                    {active.role} &middot; <span className="text-slate-500">{active.location}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle specs footer */}
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-left font-sans flex flex-col gap-0.5 max-w-full">
                <span className="text-[10px] text-slate-650 font-mono font-bold tracking-widest uppercase">
                  Owned Fleet
                </span>
                <span className="text-[11px] text-slate-900 font-bold tracking-tight">
                  {active.model}
                </span>
                <span className="text-[10px] text-slate-500 leading-none">
                  {active.config}
                </span>
              </div>
            </div>

          </div>

          {/* Navigation Controls Floating Sidebars */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none px-0 sm:-px-4">
            <button
              onClick={handlePrev}
              className="p-3 bg-white hover:bg-slate-800 text-slate-500 hover:text-white border border-slate-200 rounded-2xl transition-all cursor-pointer active:scale-95 flex items-center justify-center pointer-events-auto shadow-md"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleNext}
              className="p-3 bg-white hover:bg-slate-800 text-slate-500 hover:text-white border border-slate-200 rounded-2xl transition-all cursor-pointer active:scale-95 flex items-center justify-center pointer-events-auto shadow-md"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Quick jump dot indicators */}
        <div className="flex md:hidden justify-center items-center gap-2.5 mt-8 relative z-10">
          {list.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleDotClick(idx)}
              className={`h-2.5 transition-all rounded-full cursor-pointer ${
                currentIndex === idx ? "w-6 bg-slate-800" : "w-2.5 bg-slate-200 hover:bg-slate-300"
              }`}
              title={`View testimonial ${idx + 1}`}
            />
          ))}
        </div>
        <div className="hidden md:flex justify-center items-center gap-2.5 mt-10 relative z-10">
          {list.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleDotClick(idx)}
              className={`px-4 py-2 bg-white hover:bg-slate-100 hover:border-slate-300 border text-slate-500 hover:text-slate-805 rounded-xl text-xs font-mono transition-all font-bold cursor-pointer ${
                currentIndex === idx ? "border-slate-800 text-slate-905 bg-slate-100 shadow-xs" : "border-slate-200"
              }`}
            >
              0{idx + 1} &middot; {t.name.split(" ")[0]}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
