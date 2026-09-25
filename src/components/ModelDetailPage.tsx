/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Zap, 
  ShieldCheck, 
  Settings, 
  Wrench, 
  Gauge, 
  Compass, 
  Battery, 
  Activity, 
  ArrowRight, 
  Sliders, 
  AlertTriangle,
  Lightbulb, 
  Power, 
  ChevronRight, 
  CircleDot, 
  HelpCircle,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ModelId, ModelColor, ModelSpec, BatteryType } from "../types";
import { getModelActivePhoto } from "../data";

interface ModelDetailPageProps {
  model: ModelSpec;
  onBackClick: () => void;
  onEnquireClick: (
    modelId: string,
    colorName: string,
    batteryType: BatteryType,
    batteryRange: number
  ) => void;
}

type AngleType = "side" | "front" | "dashboard" | "chassis";

// Elegant custom colors mappings for background and CSS filter styling to achieve real-time photo-shifting according to user selections.
const COLOR_FILTER_MAP: Record<string, string> = {
  // Vista Swatches (Original is Glossy White/Light Grey)
  "Glossy White": "brightness(1) contrast(1)",
  "Tech Grey": "brightness(0.65) contrast(1.1) saturate(0.2)",
  "Midnight Black": "brightness(0.2) contrast(1.5) saturate(0)",

  // Glider Swatches (Original is Cherry Red)
  "Cherry Red": "hue-rotate(0deg) saturate(1.1) brightness(1)",
  "Apple Green": "hue-rotate(110deg) saturate(1.4) brightness(0.95)",
  "Ocean Blue": "hue-rotate(215deg) saturate(1.6) brightness(0.9)",

  // Classic Swatches (Original is Royal Blue)
  "Royal Blue": "hue-rotate(0deg) saturate(1.2) brightness(1)",
  "Crimson Red": "hue-rotate(130deg) saturate(1.6) brightness(0.85) contrast(1.1)", // Shifting blue to red
  "Charcoal Grey": "brightness(0.7) contrast(1) saturate(0)",
  "Sleek Black": "brightness(0.22) contrast(1.3) saturate(0)",
  "Pearl White": "invert(1) hue-rotate(180deg) brightness(1.6) contrast(0.8) saturate(0.2)", // Sophisticated reverse white transform

  // Phantom Swatches (Original is Cream Beige)
  "Cream Beige": "brightness(1) contrast(1)",
  "Steel Blue": "hue-rotate(170deg) saturate(0.8) brightness(0.85)",
};

export default function ModelDetailPage({ model, onBackClick, onEnquireClick }: ModelDetailPageProps) {
  const [selectedColor, setSelectedColor] = useState<ModelColor>(model.colors[0]);
  const [activeAngle, setActiveAngle] = useState<AngleType>("side");
  const [batteryType, setBatteryType] = useState<BatteryType>(model.id === "classic" || model.id === "phantom" ? "LI" : "LA");
  const [leadAcidCount, setLeadAcidCount] = useState<number>(5);
  const [lithiumRange, setLithiumRange] = useState<number>(model.id === "phantom" ? 120 : 80);
  const [cockpitViewMode, setCockpitViewMode] = useState<"simulator" | "photo">("simulator");
  const [frontViewMode, setFrontViewMode] = useState<"simulator" | "photo">("simulator");
  const [chassisViewMode, setChassisViewMode] = useState<"spec" | "photo">("spec");

  // Dynamic spec sections using the model properties
  const dynamicSpecSections = useMemo(() => ({
    electrical: [
      { label: "Motor Core Hub", value: model.motor },
      { label: "Sine-Wave Controller", value: model.controller },
      { label: "Standard Battery Specs", value: model.batterySpecs },
      { label: "RTO-Compliant Top Speed", value: model.speed }
    ],
    chassis: [
      { label: "Front Braking Assembly", value: model.frontBrake },
      { label: "Rear Braking Assembly", value: model.rearBrake },
      { label: "High Ground Clearance", value: model.groundClearance },
      { label: "Alloy Wheel & Tyre Spec", value: model.wheelSize }
    ],
    utility: [
      { label: "Coverage Warranty", value: model.warranty },
      { label: "Luggage Trunk Compartment", value: model.luggageTrunk || "18-Litre dustproof modular under-seat storage" },
      { label: "Main Lighting Array", value: model.lightingArray || "Dual Beam High-flux LED Projectors + DRL" },
      { label: "Interactive Assist Engine", value: model.assistEngine || "3km/h Reverse Gear Drive controller with beep sound" }
    ]
  }), [model]);

  // Digital Dashboard/Console interactive telemetry states
  const [dashboardIsOn, setDashboardIsOn] = useState<boolean>(true);
  const [speedLevel, setSpeedLevel] = useState<number>(1); // 1 = ECO, 2 = COMFORT, 3 = SPORT
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [highBeamOn, setHighBeamOn] = useState<boolean>(false);
  const [activeSignal, setActiveSignal] = useState<"none" | "left" | "right" | "hazard">("none");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Sync color changes switch when model changes
  useEffect(() => {
    setSelectedColor(model.colors[0]);
    setBatteryType(model.id === "classic" || model.id === "phantom" ? "LI" : "LA");
  }, [model]);

  // Handle speed dial animation simulation when dashboard is online
  useEffect(() => {
    if (!dashboardIsOn) {
      setCurrentSpeed(0);
      return;
    }

    // Determine target speed caps based on ride state mode selection
    const maxCustomSpeed = model.dashboardMaxSpeed || (model.speed ? parseInt(model.speed.replace(/[^\d]/g, ""), 10) || 25 : 25);
    const speedLimit = speedLevel === 1 ? Math.min(18, Math.round(maxCustomSpeed * 0.45)) : speedLevel === 2 ? Math.min(24, Math.round(maxCustomSpeed * 0.75)) : maxCustomSpeed;
    let current = 0;

    const interval = setInterval(() => {
      current += Math.ceil(Math.random() * 4);
      if (current >= speedLimit) {
        current = speedLimit - Math.floor(Math.random() * 2);
      }
      setCurrentSpeed(current);
    }, 400);

    return () => clearInterval(interval);
  }, [dashboardIsOn, speedLevel, model]);

  // Turn signal flash animation driver
  const [signalFlash, setSignalFlash] = useState<boolean>(false);
  useEffect(() => {
    if (activeSignal === "none") return;
    const flasher = setInterval(() => {
      setSignalFlash((f) => !f);
      if (soundEnabled && activeSignal !== "none") {
        try {
          // Subtle synthetic beep
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
          osc.start();
          setTimeout(() => osc.stop(), 50);
        } catch (e) {
          // Fallback if browser blocks audio autoplay/interaction
        }
      }
    }, 500);

    return () => clearInterval(flasher);
  }, [activeSignal, soundEnabled]);

  const currentParams = useMemo(() => {
    if (batteryType === "LA") {
      const rangeVal = leadAcidCount * 12;
      return {
        range: rangeVal,
        charging: "7-8 hours",
        warranty: "1 Year Standard Battery Warranty",
        description: model.customLeadAcidDescription || `Custom configured Lead-Acid setup holding a solid bank of ${leadAcidCount} SLA batteries (generating ${leadAcidCount * 12}V in series arrangement). Cheap to replace, highly durable, and heavily stable over Indian temperature spikes.`,
        priceModifier: leadAcidCount === 4 ? -4000 : leadAcidCount === 6 ? 5000 : 0,
        batteryWeight: `${leadAcidCount * 7}kg`
      };
    } else {
      return {
        range: lithiumRange,
        charging: "4-5 hours (Speed-Optimized)",
        warranty: "3 Years Advanced Advanced Replacement-Free Warranty",
        description: model.customLithiumDescription || `Premium single-block high-density Grade-A NMC Lithium-Ion pack featuring a 48V/60V BMS board with temperature sensors. Up to 1,500 charging cycles, detachable compartment handles for indoor plug charge, and an ultra-light layout weight.`,
        priceModifier: lithiumRange === 60 ? 12000 : lithiumRange === 80 ? 18000 : lithiumRange === 100 ? 25000 : lithiumRange === 120 ? 32000 : lithiumRange === 145 ? 40000 : 49000,
        batteryWeight: "14-19kg depending on range configuration"
      };
    }
  }, [batteryType, leadAcidCount, lithiumRange]);

  const priceCalculated = useMemo(() => {
    const baseVal = parseInt((model.basePriceEstimate || "45000").replace(/[^\d]/g, ""), 10) || 45000;
    return `₹${(baseVal + currentParams.priceModifier).toLocaleString("en-IN")}`;
  }, [model.basePriceEstimate, currentParams.priceModifier]);

  const filterStyle = COLOR_FILTER_MAP[selectedColor.name] || "brightness(1)";

  // Angle labels configuration
  const angles = [
    { id: "side", label: model.sideAngleLabel || "Dynamic Side", desc: model.sideAngleDesc || "Product Profile Portfolio" },
    { id: "front", label: model.frontAngleLabel || "LED Nose Head", desc: model.frontAngleDesc || "Front signature ring DRL lighting details" },
    { id: "dashboard", label: model.dashboardAngleLabel || "Interactive Console", desc: model.dashboardAngleDesc || "Fully functional simulated digital telemetry gauge" },
    { id: "chassis", label: model.chassisAngleLabel || "BLDC Drivetrain", desc: model.chassisAngleDesc || "Heavy hydraulic fork structure specs" }
  ];  return (
    <section className="bg-slate-50 pb-24 relative overflow-hidden text-slate-800">
      {/* Absolute Header Branding Gradients */}
      <div 
        className="absolute top-0 left-0 right-0 h-[450px] pointer-events-none transition-all duration-700" 
        style={{
          background: `radial-gradient(circle at 50% 0%, ${selectedColor.hex}08, transparent 65%)`
        }}
      />
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-slate-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-28 space-y-16">
        
        {/* Back Link Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <button
            onClick={onBackClick}
            className="group flex items-center gap-2 cursor-pointer text-xs font-mono font-bold uppercase tracking-widest text-slate-600 hover:text-slate-905 transition-all text-left bg-white hover:bg-slate-100/50 border border-slate-200 px-4 py-2.5 rounded-xl w-fit shadow-xs hover:border-slate-350"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1.5 transition-transform" />
            <span>Back to fleet</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-450">
            <span>Free Fleet Models</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-800 font-bold">Volmo {model.name}</span>
          </div>
        </div>

        {/* Core Media Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN: Media Studio angle renderer */}
          <div className="space-y-6">
            
            {/* Interactive Viewport Frame */}
            <div className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 overflow-hidden flex flex-col items-center justify-center min-h-[350px] sm:min-h-[480px] shadow-sm">
              
              <div 
                className="absolute inset-0 opacity-[0.03] transition-colors duration-700 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at center, ${selectedColor.hex} 0%, transparent 60%)`
                  }} 
              />

              <AnimatePresence mode="wait">
                {activeAngle === "side" && (
                  <motion.div
                    key="side"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative flex flex-col items-center justify-center w-full"
                  >
                    {/* Generative ambient shadow under scooter */}
                    <div className="absolute bottom-4 h-6 w-2/3 bg-slate-400/30 rounded-full blur-xl filter opacity-70 pointer-events-none" />
                    
                    {/* Render photo matching the active color */}
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedColor.image || getModelActivePhoto(model, selectedColor.name)}
                        initial={{ opacity: 0.5, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.5, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        src={selectedColor.image || getModelActivePhoto(model, selectedColor.name)}
                        alt={`Volmo ${model.name} in ${selectedColor.name}`}
                        style={{ filter: selectedColor.image || getModelActivePhoto(model, selectedColor.name) !== model.image ? "none" : filterStyle }}
                        referrerPolicy="no-referrer"
                        className="max-h-[250px] sm:max-h-[340px] w-auto object-contain select-none transition-all duration-300 transform group-hover:scale-105"
                      />
                    </AnimatePresence>
                    <div className="absolute right-4 bottom-0 flex items-center gap-1.5 text-[10px] text-slate-750 font-mono text-right bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-inner"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <span className="font-bold uppercase tracking-wider">{selectedColor.name}</span>
                    </div>
                  </motion.div>
                )}

                {activeAngle === "front" && (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-sm space-y-6 text-center py-6"
                  >
                    {model.frontImage && (
                      <div className="flex justify-center mb-2">
                        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-[10px] font-mono font-bold">
                          <button
                            type="button"
                            onClick={() => setFrontViewMode("simulator")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              frontViewMode === "simulator" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Beam Simulator
                          </button>
                          <button
                            type="button"
                            onClick={() => setFrontViewMode("photo")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              frontViewMode === "photo" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Front Photo
                          </button>
                        </div>
                      </div>
                    )}

                    {model.frontImage && frontViewMode === "photo" ? (
                      <div className="relative w-full max-h-[300px] flex items-center justify-center p-2">
                        <img
                          src={model.frontImage}
                          alt={`${model.name} Front View`}
                          referrerPolicy="no-referrer"
                          className="max-h-[260px] w-auto object-contain rounded-2xl shadow-sm"
                        />
                      </div>
                    ) : (
                      /* Heavy Tech detailed vector Nose structure */
                      <div className="relative w-40 h-56 mx-auto bg-slate-50 border-2 border-slate-200 rounded-full flex flex-col items-center justify-between p-6 overflow-hidden">
                        {/* Premium LED Projectors rings representation */}
                        <div className="w-24 h-24 rounded-full border-4 border-slate-200 bg-slate-900 flex items-center justify-center shadow-inner relative">
                          {/* High Beam bulb */}
                          <div className={`w-8 h-8 rounded-full blur-[2px] transition-all duration-300 ${
                            highBeamOn ? "bg-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.8)]" : "bg-slate-950"
                          }`} />
                          
                          {/* Ambient DRL Outer Light ring */}
                          <div 
                            className="absolute inset-0.5 rounded-full border border-dashed animate-spin transition-colors duration-700" 
                            style={{ borderColor: selectedColor.hex, animationDuration: '20s' }}
                          />
                        </div>

                        {/* Direction Signal Indicators */}
                        <div className="flex justify-between w-full">
                          <div className={`w-4 h-2.5 rounded-sm transition-all duration-200 ${
                            (activeSignal === "left" || activeSignal === "hazard") && signalFlash ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-slate-200"
                          }`} />
                          <div className={`w-4 h-2.5 rounded-sm transition-all duration-200 ${
                            (activeSignal === "right" || activeSignal === "hazard") && signalFlash ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-slate-200"
                          }`} />
                        </div>

                        {/* Volmo Chrome lettering badge */}
                        <span className="text-[10px] font-mono font-black text-slate-400 letter tracking-[0.25em] -mr-1">
                          VOLMO
                        </span>
                      </div>
                    )}

                    <div className="space-y-2 text-center">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        {model.frontTitle || "LED Laser Headlamp Assembly"}
                      </h4>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-xs mx-auto">
                        {model.frontDescription || `Ultra-bright dual projector lens coupled with signature neon DRL ring powered by ${selectedColor.name} custom frame accents.`}
                      </p>
                    </div>

                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setHighBeamOn(!highBeamOn)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all tracking-wider cursor-pointer ${
                          highBeamOn ? "bg-amber-500 text-slate-950" : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        {highBeamOn ? "Turn Beam OFF" : "Simulate High Beam"}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeAngle === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md bg-slate-900 border border-slate-700 p-6 rounded-3xl space-y-6 shadow-2xl relative text-white"
                  >
                    {/* Dashboard Header Bar */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Gauge size={14} className="text-slate-450" />
                        <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                          {model.dashboardTitle || "Interactive Simulated Telemetry G3 Model"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {model.dashboardImage && (
                          <button
                            type="button"
                            onClick={() => setCockpitViewMode(cockpitViewMode === "simulator" ? "photo" : "simulator")}
                            className="text-[9px] uppercase font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
                          >
                            {cockpitViewMode === "simulator" ? "Cockpit Photo" : "Simulator"}
                          </button>
                        )}
                        <button
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="text-slate-400 hover:text-white transition-colors"
                          title={soundEnabled ? "Disable Signal Beeps" : "Enable Signal Beeps"}
                        >
                          {soundEnabled ? <Volume2 size={13} className="text-slate-400" /> : <VolumeX size={13} />}
                        </button>
                      </div>
                    </div>

                    {model.dashboardImage && cockpitViewMode === "photo" ? (
                      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-center min-h-[220px]">
                        <img
                          src={model.dashboardImage}
                          alt={`${model.name} Cockpit View`}
                          referrerPolicy="no-referrer"
                          className="max-h-[260px] w-full object-contain rounded-xl"
                        />
                      </div>
                    ) : (
                      /* LCD PANEL DISPLAY */
                      <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col justify-between min-h-[200px] ${
                        dashboardIsOn 
                          ? "bg-slate-950 border-slate-700 shadow-[0_0_30px_rgba(148,163,184,0.06)]" 
                          : "bg-slate-950 border-slate-900 grayscale opacity-40"
                      }`}>
                        {/* LCD Top Indicators strip */}
                        <div className="flex items-center justify-between font-mono text-[10px] text-slate-500">
                          <div className="flex items-center gap-2">
                            {/* Turn left signal */}
                            <div className={`transition-opacity duration-150 ${
                              (activeSignal === "left" || activeSignal === "hazard") && signalFlash ? "opacity-100 text-slate-300 font-bold" : "opacity-20"
                            }`}>
                              &larr; L
                            </div>
                            
                            {/* Cruise signal */}
                            <span className={`px-1 rounded bg-slate-900 border border-slate-800 ${dashboardIsOn ? "text-emerald-400 font-semibold" : "text-slate-800"}`}>
                              CRUISE
                            </span>
                          </div>

                          {/* High Beam Icon */}
                          <div className={`transition-colors ${highBeamOn ? "text-cyan-400 font-bold" : "opacity-20"}`}>
                            HIGH BEAM
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-slate-900 px-1 py-0.5 rounded text-slate-400">
                              MODE {speedLevel}
                            </span>
                            
                            {/* Turn right signal */}
                            <div className={`transition-opacity duration-150 ${
                              (activeSignal === "right" || activeSignal === "hazard") && signalFlash ? "opacity-100 text-slate-300 font-bold" : "opacity-20"
                            }`}>
                              R &rarr;
                            </div>
                          </div>
                        </div>

                        {/* Main Center Speed Gauge Row */}
                        <div className="text-center py-4 flex flex-col items-center justify-center">
                          <div className="relative inline-flex items-baseline">
                            <span className="text-5xl sm:text-7xl font-sans font-black text-white tracking-tighter leading-none animate-pulse">
                              {dashboardIsOn ? currentSpeed : 0}
                            </span>
                            <span className="text-xs font-mono uppercase text-slate-500 font-bold ml-1">
                              km/h
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 mt-1">
                            {model.dashboardSubtitle || "Sine Wave Telemetry Output"}
                          </span>
                        </div>

                        {/* LCD Power and Battery Bar display */}
                        <div className="border-t border-slate-800 mt-4 pt-4 grid grid-cols-2 gap-4 text-left font-mono">
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span>SOC State</span>
                              <span className="text-white font-bold">{dashboardIsOn ? "92%" : "0%"}</span>
                            </div>
                            {/* Segmented green bar */}
                            <div className="h-2 bg-slate-900 rounded-md overflow-hidden flex gap-0.5 p-0.5">
                              {[1, 2, 3, 4, 5].map((idx) => (
                                <div
                                  key={idx}
                                  className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                                    dashboardIsOn && idx <= 4 ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]" : "bg-slate-800"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span>Odometer</span>
                              <span className="text-white font-bold">{dashboardIsOn ? (model.dashboardOdometer || "1,248 km") : "0 km"}</span>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-slate-505">
                              {model.dashboardTrip || "TRIP A • 24.3 KM"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUB-PANEL CONTROLS FOR USER TO PLAY WITH COCKPIT */}
                    <div className="grid grid-cols-2 gap-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      
                      {/* Active power check toggle */}
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block mb-1">Console Status</span>
                        <button
                          onClick={() => setDashboardIsOn(!dashboardIsOn)}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                            dashboardIsOn 
                              ? "bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                              : "bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800"
                          }`}
                        >
                          <Power size={12} />
                          <span>{dashboardIsOn ? "System Live" : "Ignition Off"}</span>
                        </button>
                      </div>

                      {/* Ride Mode Customizer (1-2-3) */}
                      <div>
                        <span className="text-[9px] font-mono text-slate-500 block mb-1">Speed Ride Gears</span>
                        <div className="flex p-0.5 bg-slate-900 rounded-xl border border-slate-800">
                          {[1, 2, 3].map((gear) => (
                            <button
                              key={gear}
                              disabled={!dashboardIsOn}
                              onClick={() => setSpeedLevel(gear)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase cursor-pointer ${
                                speedLevel === gear && dashboardIsOn
                                  ? "bg-slate-600 text-white font-black"
                                  : "text-slate-500 hover:text-slate-350 disabled:opacity-20"
                              }`}
                            >
                              0{gear}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Blinking Turn signals buttons */}
                      <div className="col-span-2 grid grid-cols-3 gap-2">
                        <button
                          disabled={!dashboardIsOn}
                          onClick={() => setActiveSignal(activeSignal === "left" ? "none" : "left")}
                          className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeSignal === "left" && dashboardIsOn 
                              ? "bg-slate-700/40 text-slate-200 border border-slate-600" 
                              : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400"
                          }`}
                        >
                          &larr; Left
                        </button>

                        <button
                          disabled={!dashboardIsOn}
                          onClick={() => setActiveSignal(activeSignal === "hazard" ? "none" : "hazard")}
                          className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeSignal === "hazard" && dashboardIsOn
                              ? "bg-red-500/25 text-red-400 border border-red-500/40"
                              : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400"
                          }`}
                        >
                          Hazard
                        </button>

                        <button
                          disabled={!dashboardIsOn}
                          onClick={() => setActiveSignal(activeSignal === "right" ? "none" : "right")}
                          className={`py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            activeSignal === "right" && dashboardIsOn
                              ? "bg-slate-700/40 text-slate-200 border border-slate-600"
                              : "bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400"
                          }`}
                        >
                          Right &rarr;
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {activeAngle === "chassis" && (
                  <motion.div
                    key="chassis"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full max-w-sm space-y-6 text-left py-6 px-4"
                  >
                    {model.chassisImage && (
                      <div className="flex justify-center mb-2">
                        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200 text-[10px] font-mono font-bold">
                          <button
                            type="button"
                            onClick={() => setChassisViewMode("spec")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              chassisViewMode === "spec" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Assembly Specs
                          </button>
                          <button
                            type="button"
                            onClick={() => setChassisViewMode("photo")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              chassisViewMode === "photo" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Chassis Photo
                          </button>
                        </div>
                      </div>
                    )}

                    {model.chassisImage && chassisViewMode === "photo" ? (
                      <div className="relative w-full max-h-[300px] flex items-center justify-center p-2">
                        <img
                          src={model.chassisImage}
                          alt={`${model.name} Chassis View`}
                          referrerPolicy="no-referrer"
                          className="max-h-[260px] w-auto object-contain rounded-2xl shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl relative space-y-4 shadow-xs">
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-600 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-mono font-bold">
                          {model.chassisBadge || "Mechanical Assembly Spec"}
                        </span>
                        
                        <div className="space-y-3.5 divide-y divide-slate-100">
                          <div className="pt-1">
                            <span className="text-slate-450 text-[10px] uppercase font-mono block">Front Suspension</span>
                            <span className="text-slate-800 text-xs font-bold font-sans">
                              {model.frontSuspension || "Telescopic Hydraulic Fork Shock Absorbers (31mm core) • Designed to absorb aggressive bumps on Indian roads."}
                            </span>
                          </div>
                          <div className="pt-3">
                            <span className="text-slate-450 text-[10px] uppercase font-mono block">Rear Suspension</span>
                            <span className="text-slate-800 text-xs font-bold font-sans">
                              {model.rearSuspension || "Dual Coil Spring Hydro-Dampers with 5-stage mechanical load adjustment."}
                            </span>
                          </div>
                          <div className="pt-3">
                            <span className="text-slate-450 text-[10px] uppercase font-mono block">BLDC Core Rotor</span>
                            <span className="text-slate-800 text-xs font-bold font-sans">
                              {model.bldcRotor || "High-density Copper Stator windings with powerful Neodymium permanent magnets. Integrated in the rear wheel."}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 text-center italic font-mono">
                      {model.chassisDisclaimer || "* All mechanical frameworks undergo 50,000 stress impact cycles before assembly."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Viewport selection triggers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {angles.map((ang) => {
                const isActive = activeAngle === ang.id;
                return (
                  <button
                    key={ang.id}
                    onClick={() => setActiveAngle(ang.id as AngleType)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? "border-slate-800 bg-slate-100 shadow-xs" 
                        : "border-slate-200 hover:border-slate-350 bg-white"
                    }`}
                  >
                    <span className={`text-[11px] font-bold block ${isActive ? "text-slate-905 font-extrabold" : "text-slate-800"}`}>
                      {ang.label}
                    </span>
                    <span className="text-[9px] text-slate-500 leading-none mt-0.5 block truncate font-normal">
                      {ang.desc}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Configurator Options & Price Calc */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
                        {/* Model Headers */}
            <div className="border-b border-slate-100 pb-5 space-y-2">
              <span className="text-xs font-mono uppercase bg-emerald-550/10 text-emerald-700 border border-emerald-550/20 px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 leading-normal">
                <ShieldCheck size={12} />
                <span>{model.rtoBadgeText || "RTO Exempt • No Driving License Needed"}</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase leading-none font-sans mt-2">
                VOLMO {model.name}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-bold tracking-wider uppercase font-mono">
                {model.tagline}
              </p>
            </div>

            {/* Core Specifications relocated from catalog cards */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <div className="text-left font-sans">
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-black block">
                  ⚡ INSTALLED MOTOR
                </span>
                <strong className="text-slate-800 text-sm font-black block mt-0.5">
                  {model.motor}
                </strong>
              </div>
              <div className="text-left font-sans">
                <span className="text-slate-400 font-mono text-[9px] uppercase tracking-widest font-black block">
                  🏁 TOP VELOCITY
                </span>
                <strong className="text-slate-800 text-sm font-black block mt-0.5">
                  {model.speed}
                </strong>
              </div>
            </div>

            {/* Dynamic Swatch Colors choosing segment */}
            <div className="space-y-3.5">
              <div className="flex justify-between items-baseline text-xs font-mono">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Configure Body Paint Accent</span>
                <span className="text-slate-805 font-black text-slate-800">{selectedColor.name}</span>
              </div>

              <div className="flex gap-3 flex-wrap">
                {model.colors.map((swatch) => {
                  const isSelected = selectedColor.name === swatch.name;
                  return (
                    <button
                      key={swatch.name}
                      onClick={() => setSelectedColor(swatch)}
                      className={`h-11 w-11 rounded-full flex items-center justify-center p-0.5 border-2 cursor-pointer hover:scale-105 active:scale-95 transition-all relative ${
                        isSelected 
                          ? "border-slate-900 ring-2 ring-slate-900/30 scale-105 shadow-sm" 
                          : "border-slate-200 hover:border-slate-350 bg-slate-50"
                      }`}
                      title={`Select ${swatch.name}`}
                      aria-label={`Select ${swatch.name}`}
                    >
                      <span 
                        className="h-full w-full rounded-full border border-slate-200 block shadow-inner" 
                        style={{ backgroundColor: swatch.hex }}
                      />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Power Core Customizer Engine */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-6">
              
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">
                  <Sliders size={14} className="text-slate-500" />
                  <span>Choose Battery Chemistry Model</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono font-bold">
                  VRLA vs NMC Ion
                </span>
              </div>

              {/* Chemical Toggle Pills */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setBatteryType("LA")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    batteryType === "LA" 
                      ? "bg-slate-800 text-white shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  60V VRLA Lead-Acid (LA)
                </button>
                <button
                  type="button"
                  onClick={() => setBatteryType("LI")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    batteryType === "LI"
                      ? "bg-slate-800 text-white shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  60V Heavy Lithium-Ion (LI)
                </button>
              </div>

              {/* Range & Bank selection details */}
              {batteryType === "LA" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { num: 4, range: 48, spec: "48V SLA Setup" },
                      { num: 5, range: 60, spec: "60V SLA Multi-Pack" },
                      { num: 6, range: 72, spec: "72V Premium SLA Bank" }
                    ].map((cell) => {
                      const isActive = leadAcidCount === cell.num;
                      return (
                        <button
                          key={cell.num}
                          onClick={() => setLeadAcidCount(cell.num)}
                          className={`p-3 text-center rounded-xl border transition-all cursor-pointer ${
                            isActive 
                              ? "border-slate-800 bg-slate-105 text-slate-950 scale-[1.02] bg-slate-100" 
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                          }`}
                        >
                          <div className="text-sm font-black font-sans">{cell.range} KM</div>
                          <div className="text-[9px] text-slate-400 leading-none mt-1 font-mono">
                            {cell.spec}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[60, 80, 100, 120, 145, 180].map((ltRange) => {
                      const isVistaOrGlider = model.id === "vista" || model.id === "glider";
                      const isChamberBlocked = isVistaOrGlider && ltRange >= 120;
                      const isActive = lithiumRange === ltRange && !isChamberBlocked;

                      return (
                        <button
                          key={ltRange}
                          disabled={isChamberBlocked}
                          onClick={() => setLithiumRange(ltRange)}
                          className={`p-3 text-center rounded-xl border transition-all relative ${
                            isChamberBlocked 
                              ? "border-slate-100 bg-slate-100 text-slate-350 cursor-not-allowed opacity-[0.35]" 
                              : isActive 
                              ? "border-slate-800 bg-slate-105 text-slate-950 scale-[1.02] cursor-pointer bg-slate-100" 
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                          }`}
                        >
                          <div className="text-sm font-black font-sans">{ltRange} KM</div>
                          <div className="text-[9px] text-slate-400 leading-none mt-1 font-mono">
                            NMC Fast Charge
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Warning label constraint display for small scooters */}
                  {(model.id === "vista" || model.id === "glider") && (
                    <div className="flex items-start gap-2 bg-slate-100 p-3 rounded-xl border border-slate-200 text-[10px] text-slate-700 leading-normal">
                      <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-slate-500" />
                      <span>
                        <strong>Space Limit Notice</strong>: Standard {model.name} models cannot accommodate higher capacity range packs (120km to 180km) due to localized under-compartment frame space sizes.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic diagnostics results panel */}
              <div className="bg-white p-4 border border-slate-200 rounded-xl space-y-3.5 font-mono text-[11px] text-slate-600 shadow-xs">
                <p className="text-slate-600 leading-relaxed font-normal font-sans text-xs border-b border-slate-100 pb-2.5">
                  {currentParams.description}
                </p>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <span className="text-[9px] text-slate-450 block uppercase font-bold">REAL-LIFE TESTED RANGE</span>
                    <strong className="text-slate-800 text-xs block font-sans font-bold mt-0.5">
                      {currentParams.range} Kilometres / charge
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 block uppercase font-bold">CHARGE TIME DURATION</span>
                    <strong className="text-slate-800 text-xs block font-sans font-bold mt-0.5">
                      {currentParams.charging}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-455 block uppercase font-bold">DIAGNOSTIC NET WEIGHT</span>
                    <strong className="text-slate-800 text-xs block font-sans font-bold mt-0.5">
                      {currentParams.batteryWeight}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-450 block uppercase font-bold">WARRANTY EXCLUSIVES</span>
                    <strong className="text-emerald-600 text-xs block font-sans font-bold mt-0.5">
                      {currentParams.warranty}
                    </strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Price Calculations and CTA details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-slate-500 uppercase font-mono tracking-widest block font-bold">
                  Configured Out-The-Door Est Price
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-800 font-sans tracking-tight block mt-0.5">
                  {priceCalculated} *
                </span>
                <span className="text-[9px] text-slate-400 font-mono font-medium block mt-1">
                  {model.priceDisclaimer || "* Excludes optional accessories. Gwalior showroom delivery."}
                </span>
              </div>

              <button
                type="button"
                onClick={() => 
                  onEnquireClick(
                    model.id,
                    selectedColor.name,
                    batteryType,
                    batteryType === "LA" ? leadAcidCount * 12 : lithiumRange
                  )
                }
                className="w-full sm:w-auto py-4 px-8 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all cursor-pointer text-xs uppercase tracking-wider block text-center shadow active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Zap size={14} />
                <span>Enquire Price / Buy</span>
              </button>
            </div>

          </div>

        </div>

        {/* BENTO TECH SPECS BOARD LEDGERS */}
        <div className="space-y-6">
          <div className="text-left space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest font-extrabold block">
              Automotive Specifications Ledger
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
              {model.specsTitle || `Full Technical Ledger • Volmo ${model.name}`}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-normal font-sans max-w-2xl">
              {model.specsSubtitle || "All electrical nodes are heavily insulated, matching IP67 dust and splashproof parameters for confident wet-monsoon commuting."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sec 1: ELECTRICAL SYSTEMS */}
            <div className="bg-white border border-slate-205 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Zap size={14} />
                <span>Electrical Core Systems</span>
              </h4>

              <div className="space-y-4">
                {dynamicSpecSections.electrical.map((spec) => (
                  <div key={spec.label} className="text-left space-y-1">
                    <span className="text-[10px] text-slate-450 font-mono uppercase block font-bold">{spec.label}</span>
                    <p className="text-slate-800 text-xs font-semibold leading-relaxed">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sec 2: CHASSIS & SUSPENSION */}
            <div className="bg-white border border-slate-205 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <CircleDot size={14} />
                <span>Chassis, Tyres &amp; Brakes</span>
              </h4>

              <div className="space-y-4">
                {dynamicSpecSections.chassis.map((spec) => (
                  <div key={spec.label} className="text-left space-y-1">
                    <span className="text-[10px] text-slate-450 font-mono uppercase block font-bold">{spec.label}</span>
                    <p className="text-slate-800 text-xs font-semibold leading-relaxed">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sec 3: UTILITY & COMFORT */}
            <div className="bg-white border border-slate-205 p-6 rounded-3xl space-y-4 shadow-sm">
              <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Settings size={14} />
                <span>Utility &amp; Comfort Assets</span>
              </h4>

              <div className="space-y-4">
                {dynamicSpecSections.utility.map((spec) => (
                  <div key={spec.label} className="text-left space-y-1">
                    <span className="text-[10px] text-slate-450 font-mono uppercase block font-bold">{spec.label}</span>
                    <p className="text-slate-800 text-xs font-semibold leading-relaxed">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SEC 4: RIDING MODES GRID ROW */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 mt-6 shadow-sm">
            <h4 className="text-sm font-mono font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Sliders size={16} />
              <span>3 Intelligent Multi-Drive Riding Modes</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {model.ridingModes.map((mode, idx) => {
                const modeName = mode.split("(")[0].trim();
                const modeDesc = mode.includes("(") ? mode.substring(mode.indexOf("(")) : "";
                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2 relative overflow-hidden group hover:border-slate-350 transition-all duration-300">
                    <div className="absolute top-3 right-4 font-mono text-3xl font-black text-slate-300/30 select-none group-hover:text-slate-500/10 transition-colors">
                      0{idx + 1}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider font-bold">
                      Gear Mode {idx + 1}
                    </span>
                    <h5 className="text-slate-900 text-base font-black tracking-tight uppercase">
                      {modeName}
                    </h5>
                    <p className="text-slate-600 text-xs font-medium font-mono leading-relaxed">
                      {modeDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
