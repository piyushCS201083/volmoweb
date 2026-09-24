/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  CheckCircle,
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { CareerOpening, CareerApplication } from "../types";
import { CAREER_OPENINGS } from "../data/mediaBlogsData";
import { api } from "../services/api";

interface CareerApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob?: CareerOpening | null;
  onSubmitSuccess?: (app: CareerApplication) => void;
}

export default function CareerApplyModal({
  isOpen,
  onClose,
  selectedJob,
  onSubmitSuccess,
}: CareerApplyModalProps) {
  const [jobId, setJobId] = useState<string>(selectedJob?.id || "job-1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [experienceYears, setExperienceYears] = useState("1-3 Years");
  const [currentRole, setCurrentRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<CareerApplication | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (selectedJob) {
        setJobId(selectedJob.id);
      }
      setIsSubmitted(false);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, selectedJob]);

  const activeJob = CAREER_OPENINGS.find((j) => j.id === jobId) || CAREER_OPENINGS[0];

  // Validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (touched.name) {
      if (!name.trim()) newErrors.name = "Full name is required";
      else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    }

    if (touched.phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      else if (cleanPhone.length !== 10) newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (touched.email) {
      if (!email.trim()) newErrors.email = "Email address is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Enter a valid email address";
    }

    if (touched.city && !city.trim()) {
      newErrors.city = "City is required";
    }

    if (touched.coverNote) {
      if (!coverNote.trim()) newErrors.coverNote = "Please share a brief note about your interest";
      else if (coverNote.trim().length < 15) newErrors.coverNote = "Note must be at least 15 characters";
    }

    setErrors(newErrors);
  }, [name, phone, email, city, coverNote, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      email: true,
      city: true,
      coverNote: true,
    });

    const cleanPhone = phone.replace(/\D/g, "");
    if (!name.trim() || cleanPhone.length !== 10 || !email.trim() || !city.trim() || !coverNote.trim()) {
      return;
    }

    setIsSubmitting(true);

    const application: CareerApplication = {
      id: "APP-" + Math.floor(100000 + Math.random() * 900000),
      jobId: activeJob.id,
      jobTitle: activeJob.title,
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      city: city.trim(),
      state: state.trim() || "India",
      experienceYears,
      currentRole: currentRole.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      coverNote: coverNote.trim(),
      status: "applied",
      createdAt: new Date().toISOString(),
    };

    try {
      // Save application as lead in backend
      await api.leads.submitInquiry({
        name: `${application.name} (Career: ${activeJob.title})`,
        phone: application.phone,
        model: `Job Application: ${activeJob.title}`,
        color: `${application.city}, ${application.state} | Exp: ${experienceYears}`,
        batteryType: "LI",
        batteryConfig: `${application.email} | ${application.currentRole || "Applicant"}`,
        rangeKm: 0,
      });
    } catch (err) {
      console.warn("Application saved locally:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedApp(application);
      if (onSubmitSuccess) {
        onSubmitSuccess(application);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-left my-8"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white relative">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white rounded-xl p-2 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Briefcase size={16} />
                  </span>
                  <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    Volmo Electric Careers Portal
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Apply for Career Opportunity
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1">
                  Join our mission to power clean, accessible electric mobility across India.
                </p>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                {isSubmitted && submittedApp ? (
                  /* Success View */
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle size={36} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-2xl font-black text-slate-900">
                        Application Submitted!
                      </h4>
                      <p className="text-slate-600 text-sm max-w-md mx-auto">
                        Thank you <span className="font-bold text-slate-800">{submittedApp.name}</span>. Your application for{" "}
                        <span className="font-bold text-emerald-700">{submittedApp.jobTitle}</span> has been received by our HR talent team.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-700 text-left max-w-md mx-auto space-y-2">
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400">Application Ref:</span>
                        <span className="font-mono font-bold text-slate-900">{submittedApp.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400">Contact Number:</span>
                        <span className="font-medium text-slate-900">+91 {submittedApp.phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400">Email Address:</span>
                        <span className="font-medium text-slate-900">{submittedApp.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Review Timeline:</span>
                        <span className="font-bold text-emerald-600">Within 2-3 Business Days</span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                      >
                        Return to Media & Blogs
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Selected Role */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Position Applying For
                      </label>
                      <select
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 transition-all cursor-pointer"
                      >
                        {CAREER_OPENINGS.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title} ({job.location})
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Department: <span className="font-medium text-slate-700">{activeJob.department}</span> &middot;{" "}
                        Experience: <span className="font-medium text-slate-700">{activeJob.experience}</span>
                      </p>
                    </div>

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.name && touched.name
                              ? "border-rose-400 bg-rose-50/40 text-rose-900"
                              : "border-slate-300 bg-white text-slate-800 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10"
                          }`}
                        />
                        {errors.name && touched.name && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} /> {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                            placeholder="98765 43210"
                            className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                              errors.phone && touched.phone
                                ? "border-rose-400 bg-rose-50/40 text-rose-900"
                                : "border-slate-300 bg-white text-slate-800 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10"
                            }`}
                          />
                        </div>
                        {errors.phone && touched.phone && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email & Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                          placeholder="rahul@example.com"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.email && touched.email
                              ? "border-rose-400 bg-rose-50/40 text-rose-900"
                              : "border-slate-300 bg-white text-slate-800 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10"
                          }`}
                        />
                        {errors.email && touched.email && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} /> {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Total Experience
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                        >
                          <option value="Fresher (0-1 yr)">Fresher (0-1 yr)</option>
                          <option value="1-3 Years">1-3 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5-8 Years">5-8 Years</option>
                          <option value="8+ Years">8+ Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Current City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Current City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                          placeholder="e.g. Jaipur, Jodhpur, Kota..."
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
                            errors.city && touched.city
                              ? "border-rose-400 bg-rose-50/40 text-rose-900"
                              : "border-slate-300 bg-white text-slate-800 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g. Rajasthan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                        />
                      </div>
                    </div>

                    {/* LinkedIn / Portfolio */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>LinkedIn / Portfolio URL</span>
                        <span className="text-[11px] text-slate-400 font-normal normal-case">Optional</span>
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                      />
                    </div>

                    {/* Cover Note */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Brief Cover Note / Why Volmo? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, coverNote: true }))}
                        placeholder="Tell us about your background, relevant projects, and why you want to join our EV team..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none resize-none ${
                          errors.coverNote && touched.coverNote
                            ? "border-rose-400 bg-rose-50/40 text-rose-900"
                            : "border-slate-300 bg-white text-slate-800 focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10"
                        }`}
                      />
                      {errors.coverNote && touched.coverNote && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> {errors.coverNote}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Submit Application</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
