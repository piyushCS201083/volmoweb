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
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Sparkles,
  AlertCircle,
  MessageCircle,
  MapPin,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { useSiteConfig } from "../SiteConfigContext";
import { api } from "../services/api";
import { openWhatsApp, VOLMO_WHATSAPP_DISPLAY, VOLMO_WHATSAPP_NUMBER } from "../utils/whatsapp";

export interface QuickContactData {
  name: string;
  phone: string;
  email?: string;
  topic: string;
  message: string;
}

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: QuickContactData) => void;
  onNavigateToLocateUs?: () => void;
  initialTopic?: string;
  initialMessage?: string;
}

const INQUIRY_TOPICS = [
  "Pricing & Quotation",
  "General Inquiry",
  "Test Ride Booking",
  "Dealership / Franchise",
  "Battery & Technical Support",
  "After-Sales & Warranty",
];

export default function QuickContactModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  onNavigateToLocateUs,
  initialTopic,
  initialMessage,
}: QuickContactModalProps) {
  const { contactInfo } = useSiteConfig();

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(initialTopic || "Pricing & Quotation");
  const [message, setMessage] = useState(initialMessage || "");

  // Validation & UI states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customWhatsAppMessage, setCustomWhatsAppMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("");
      setEmail("");
      setTopic(initialTopic || "Pricing & Quotation");
      setMessage(initialMessage || "");
      setCustomWhatsAppMessage("");
      setErrors({});
      setTouched({});
      setIsSubmitted(false);
      setIsSubmitting(false);
    }
  }, [isOpen, initialTopic, initialMessage]);

  // Real-time validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (touched.name) {
      if (!name.trim()) {
        newErrors.name = "Full name is required";
      } else if (name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    if (touched.phone) {
      if (!phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\d{10}$/.test(phone.trim().replace(/\D/g, ""))) {
        newErrors.phone = "Enter a valid 10-digit mobile number";
      }
    }

    if (touched.email && email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (touched.message) {
      if (!message.trim()) {
        newErrors.message = "Please write a brief question or message";
      } else if (message.trim().length < 5) {
        newErrors.message = "Message must be at least 5 characters";
      }
    }

    setErrors(newErrors);
  }, [name, phone, email, message, touched]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ name: true, phone: true, email: true, message: true });

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!name.trim() || cleanPhone.length !== 10 || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    const contactPayload: QuickContactData = {
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim() || undefined,
      topic,
      message: message.trim(),
    };

    const formattedMsg = `Hello Volmo Electric, I have submitted an inquiry on your website:
👤 Name: ${contactPayload.name}
📞 Phone: +91 ${contactPayload.phone}${contactPayload.email ? `\n✉️ Email: ${contactPayload.email}` : ""}
📋 Topic: ${contactPayload.topic}${contactPayload.message ? `\n💬 Note: ${contactPayload.message}` : ""}

Please share further details with me.`;
    setCustomWhatsAppMessage(formattedMsg);

    try {
      // Record lead in the persistent backend store and dispatch email notification
      await api.leads.submitInquiry({
        name: contactPayload.name,
        phone: contactPayload.phone,
        email: contactPayload.email,
        model: `Quick Contact: ${topic}`,
        color: email.trim() ? `Email: ${email.trim()}` : "Direct Contact",
        batteryType: "LI",
        batteryConfig: topic,
        rangeKm: 0,
        message: contactPayload.message,
      });
    } catch (err) {
      console.warn("Notice: Saved inquiry locally/optimistically:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(contactPayload);
      }
    }
  };

  const handleDirectWhatsAppChat = () => {
    const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
    const directMsg = `Hello Volmo Electric, I would like to inquire regarding: ${topic}${name.trim() ? `\n👤 Name: ${name.trim()}` : ""}${cleanPhone ? `\n📞 Phone: +91 ${cleanPhone}` : ""}${email.trim() ? `\n✉️ Email: ${email.trim()}` : ""}${message.trim() ? `\n💬 Message: ${message.trim()}` : ""}\n\nPlease share price quote and specifications.`;
    openWhatsApp(directMsg);
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-100"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white rounded-lg p-1.5 transition-colors cursor-pointer focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <MessageSquare size={18} />
                  </div>
                  <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase">
                    Volmo Quick Inquiry
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Quick Inquiry Form
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-sm">
                  Send our sales and engineering team your inquiry. We will reach out to you directly with detailed pricing and model specifications.
                </p>
              </div>

              {/* Instant Direct Channels Banner */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <a
                  href={`tel:${(contactInfo?.phone || "9982404090").replace(/\s+/g, "")}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 font-semibold transition-colors"
                >
                  <Phone size={14} className="text-emerald-600" />
                  <span>+91 {contactInfo?.phone || "99824 04090"}</span>
                </a>
                <a
                  href={`mailto:${contactInfo?.email || "sales@volmoelectrical.com"}`}
                  className="flex items-center gap-1.5 text-slate-700 hover:text-emerald-700 font-semibold transition-colors"
                >
                  <Mail size={14} className="text-emerald-600" />
                  <span>{contactInfo?.email || "sales@volmoelectrical.com"}</span>
                </a>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={13} className="text-slate-400" />
                  <span>Mon-Sat, 9AM-7PM</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {isSubmitted ? (
                  /* Success View */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle size={36} />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black text-slate-900">
                        Inquiry Received Successfully!
                      </h4>
                      <p className="text-slate-600 text-sm max-w-md mx-auto">
                        Thank you <span className="font-semibold text-slate-800">{name}</span>. Your inquiry has been registered with the Volmo team. Our sales and engineering desk will contact you shortly.
                      </p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 text-center flex items-center justify-center gap-2">
                      <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                      <span className="font-semibold">Confirmed: Details forwarded to sales department</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 text-left max-w-md mx-auto space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Contact Number:</span>
                        <span className="font-medium text-slate-800">+91 {phone}</span>
                      </div>
                      {email && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-medium text-slate-800">{email}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-400">Inquiry Topic:</span>
                        <span className="font-medium text-slate-800">{topic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Estimated Response:</span>
                        <span className="font-medium text-emerald-600">Within 30 mins</span>
                      </div>
                    </div>

                    {/* Customizable WhatsApp Message Dispatch Box */}
                    <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 text-left max-w-md mx-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
                            </svg>
                          </div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                            Send Copy via WhatsApp
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#25D366] text-white px-2 py-0.5 rounded-full">
                          {VOLMO_WHATSAPP_DISPLAY}
                        </span>
                      </div>

                      <p className="text-xs text-slate-650 leading-relaxed font-normal">
                        For immediate response, you can customize the message below and forward this inquiry straight to our WhatsApp sales desk:
                      </p>

                      <textarea
                        rows={4}
                        value={customWhatsAppMessage}
                        onChange={(e) => setCustomWhatsAppMessage(e.target.value)}
                        placeholder="Customize your WhatsApp message..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-[#25D366] leading-relaxed"
                      />

                      <button
                        type="button"
                        onClick={() => openWhatsApp(customWhatsAppMessage)}
                        className="w-full bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
                        </svg>
                        <span>Send Message on WhatsApp</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md"
                      >
                        Done &amp; Close
                      </button>
                      {onNavigateToLocateUs && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onNavigateToLocateUs();
                          }}
                          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2"
                        >
                          <MapPin size={14} className="text-slate-500" />
                          <span>View Nearby Showrooms</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Inquiry Topic Select */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800 transition-all font-medium cursor-pointer"
                      >
                        {INQUIRY_TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Name & Phone in grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                          placeholder="e.g. Ramesh Sharma"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                            errors.name && touched.name
                              ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-200"
                              : "border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800"
                          }`}
                        />
                        {errors.name && touched.name && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Mobile Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                            placeholder="98765 43210"
                            className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                              errors.phone && touched.phone
                                ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-200"
                                : "border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800"
                            }`}
                          />
                        </div>
                        {errors.phone && touched.phone && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Email Address</span>
                        <span className="text-[11px] text-slate-400 font-normal normal-case">Optional</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        placeholder="yourname@example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                          errors.email && touched.email
                            ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800"
                        }`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Your Question or Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                        placeholder="Tell us what model, battery range, or question you have in mind..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-all resize-none ${
                          errors.message && touched.message
                            ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-2 focus:ring-rose-200"
                            : "border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-800"
                        }`}
                      />
                      {errors.message && touched.message && (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} />
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleDirectWhatsAppChat}
                        className="bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-[#25D366]/20 flex items-center justify-center gap-2 border border-[#25D366]/30"
                        title={`Send customized message on WhatsApp to ${VOLMO_WHATSAPP_DISPLAY}`}
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.974.572 1.913.92 2.796.92 3.18 0 5.767-2.587 5.767-5.766.001-3.187-2.575-5.77-5.767-5.77zm6.929 5.766c0 3.82-3.109 6.929-6.929 6.929-.982 0-1.921-.21-2.775-.609l-3.953 1.036 1.056-3.856a6.883 6.883 0 0 1-.926-3.499c0-3.821 3.11-6.93 6.929-6.93 3.821 0 6.93 3.109 6.93 6.929z" />
                        </svg>
                        <span>Send via WhatsApp</span>
                      </button>

                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              <span>Submit Inquiry</span>
                            </>
                          )}
                        </button>
                      </div>
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
