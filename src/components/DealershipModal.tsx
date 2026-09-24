/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle, Store, IndianRupee, ShieldCheck } from "lucide-react";
import { DealershipApp } from "../types";
import { api } from "../services/api";

interface DealershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (app: DealershipApp) => void;
}

export default function DealershipModal({ isOpen, onClose, onSubmitSuccess }: DealershipModalProps) {
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [experience, setExperience] = useState("");
  const [pastBusiness, setPastBusiness] = useState("");
  const [investmentRange, setInvestmentRange] = useState("");
  const [message, setMessage] = useState("");

  // Touch/validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (touched.name) {
      if (!name.trim()) {
        newErrors.name = "Full name is required";
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters long";
      }
    }

    if (touched.phone) {
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(phone.trim())) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }

    if (touched.email) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (touched.city && !city.trim()) {
      newErrors.city = "City is required";
    }

    if (touched.state && !state.trim()) {
      newErrors.state = "State/UT is required";
    }

    if (touched.experience && !experience.trim()) {
      newErrors.experience = "Business experience details are required";
    }

    if (touched.pastBusiness && !pastBusiness.trim()) {
      newErrors.pastBusiness = "Please provide brief details of your past/current business";
    }

    if (touched.investmentRange && !investmentRange) {
      newErrors.investmentRange = "Please select your investment capacity";
    }

    setErrors(newErrors);
  }, [name, email, phone, city, state, experience, pastBusiness, investmentRange, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to trigger full validation
    const allTouched = {
      name: true,
      email: true,
      phone: true,
      city: true,
      state: true,
      experience: true,
      pastBusiness: true,
      investmentRange: true,
    };
    setTouched(allTouched);

    const hasErrors =
      !name.trim() ||
      name.trim().length < 2 ||
      !phone.trim() ||
      !/^\d{10}$/.test(phone) ||
      !email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !city.trim() ||
      !state.trim() ||
      !experience.trim() ||
      !pastBusiness.trim() ||
      !investmentRange;

    if (hasErrors) {
      return;
    }

    const app: DealershipApp = {
      id: "D-" + Math.floor(Math.random() * 100000),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      state: state.trim(),
      experience: experience.trim(),
      pastBusiness: pastBusiness.trim(),
      investmentRange,
      message: message.trim(),
      status: "applied",
      createdAt: new Date().toISOString(),
    };

    // Save to localstorage for instant offline access
    const existingApps = JSON.parse(localStorage.getItem("volmo_dealers") || "[]");
    localStorage.setItem("volmo_dealers", JSON.stringify([app, ...existingApps]));

    // Send to backend API for persistent real-time database storage
    api.leads.submitDealer(app).catch((err) => {
      console.warn("[Volmo] Dealership submitted locally (backend sync pending):", err.message);
    });

    onSubmitSuccess(app);
    setIsSubmitted(true);

    // Reset Form
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setState("");
      setExperience("");
      setPastBusiness("");
      setInvestmentRange("");
      setMessage("");
      setTouched({});
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-905/40 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 md:p-8 text-slate-800 shadow-2xl scrollbar-thin scrollbar-thumb-slate-200"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-105 rounded-full cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="h-16 w-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Application Received!</h3>
                <p className="text-slate-600 max-w-md text-sm font-normal">
                  Thank you for your interest in Volmo. Our Business Development team will review your application and reach out to you within 48 hours.
                </p>
              </motion.div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4 text-left">
                  <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
                    <Store size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Become a Volmo Partner</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-normal">Launch a sustainable electric dealership in your region</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => handleBlur("name")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          touched.name && errors.name
                            ? "border-red-500/50 focus:ring-red-550/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                        placeholder="John Doe"
                      />
                      {touched.name && errors.name && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Mobile Number (10 Digits) *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          touched.phone && errors.phone
                            ? "border-red-500/50 focus:ring-red-555/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                        placeholder="e.g. 9876543210"
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        touched.email && errors.email
                          ? "border-red-500/50 focus:ring-red-550/15"
                          : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                      }`}
                      placeholder="john@example.com"
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Row 3 Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Target City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={() => handleBlur("city")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          touched.city && errors.city
                            ? "border-red-500/50 focus:ring-red-550/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                        placeholder="Gwalior"
                      />
                      {touched.city && errors.city && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Target State *
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        onBlur={() => handleBlur("state")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          touched.state && errors.state
                            ? "border-red-500/50 focus:ring-red-550/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                        placeholder="Madhya Pradesh"
                      />
                      {touched.state && errors.state && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* Investment & Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Investment Capacity *
                      </label>
                      <select
                        value={investmentRange}
                        onChange={(e) => setInvestmentRange(e.target.value)}
                        onBlur={() => handleBlur("investmentRange")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                          touched.investmentRange && errors.investmentRange
                            ? "border-red-500/50 focus:ring-red-550/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                      >
                        <option value="">Select Range</option>
                        <option value="₹10 Lakhs - ₹15 Lakhs">₹10 Lakhs - ₹15 Lakhs</option>
                        <option value="₹15 Lakhs - ₹25 Lakhs">₹15 Lakhs - ₹25 Lakhs</option>
                        <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                        <option value="Above ₹50 Lakhs">Above ₹50 Lakhs</option>
                      </select>
                      {touched.investmentRange && errors.investmentRange && (
                        <p className="text-red-650 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          {errors.investmentRange}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Business Experience *
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        onBlur={() => handleBlur("experience")}
                        className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          touched.experience && errors.experience
                            ? "border-red-500/50 focus:ring-red-550/15"
                            : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                        }`}
                        placeholder="e.g. 5 Years in Automobile Retail"
                      />
                      {touched.experience && errors.experience && (
                        <p className="text-red-650 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.experience}</p>
                      )}
                    </div>
                  </div>

                  {/* Past Business Info */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Past / Current Business Details *
                    </label>
                    <textarea
                      rows={2}
                      value={pastBusiness}
                      onChange={(e) => setPastBusiness(e.target.value)}
                      onBlur={() => handleBlur("pastBusiness")}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 transition-all resize-none ${
                        touched.pastBusiness && errors.pastBusiness
                          ? "border-red-500/50 focus:ring-red-550/15"
                          : "border-slate-200 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white"
                      }`}
                      placeholder="Tell us about your current or past business ventures, brands you partners with, etc..."
                    />
                    {touched.pastBusiness && errors.pastBusiness && (
                      <p className="text-red-655 text-xs mt-1.5 flex items-center gap-1 font-medium">{errors.pastBusiness}</p>
                    )}
                  </div>

                  {/* Short message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/15 focus:border-slate-500/50 focus:bg-white transition-all resize-none"
                      placeholder="Any additional details or questions for our team..."
                    />
                  </div>

                  {/* Form Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 mt-6 gap-4">
                    <p className="text-slate-500 text-[11px] flex items-center gap-1.5 max-w-sm leading-normal">
                      <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                      Your information is secure and managed by Volmo Business Development.
                    </p>
                    <button
                      type="submit"
                      className="flex items-center gap-2 bg-slate-805 hover:bg-slate-905 text-white font-bold px-6 py-3.5 rounded-xl shadow-md active:scale-[0.98] transition-all cursor-pointer text-xs uppercase tracking-widest"
                    >
                      <span>Submit Application</span>
                      <Send size={13} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
