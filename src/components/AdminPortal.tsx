/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lock,
  Search,
  Trash2,
  RefreshCw,
  FolderLock,
  Store,
  MapPin,
  Clock,
  PhoneCall,
  Mail,
  Zap,
  X,
  Plus,
  Edit3,
  Sliders,
  Image as ImageIcon,
  Layout,
  Undo2,
  Check,
  Upload,
  Sparkles,
  ShieldCheck,
  Building,
  DollarSign,
  Layers,
  ChevronRight,
  ExternalLink,
  Save,
  FileSpreadsheet,
  MessageSquare,
  HelpCircle,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
  Gauge,
  Wrench,
  FileText,
  Eye,
  Settings2,
  Newspaper,
} from "lucide-react";
import { PriceInquiry, DealershipApp, ModelSpec, BatteryType } from "../types";
import { useSiteConfig } from "../SiteConfigContext";
import { api } from "../services/api";
import PhotosCMS from "./admin/PhotosCMS";
import HeroCMS from "./admin/HeroCMS";
import TestimonialsCMS from "./admin/TestimonialsCMS";
import ShowroomsCMS from "./admin/ShowroomsCMS";
import FaqsCMS from "./admin/FaqsCMS";
import BrandingCMS from "./admin/BrandingCMS";
import AccessoriesCMS from "./admin/AccessoriesCMS";
import BatteryChargerCMS from "./admin/BatteryChargerCMS";
import MediaBlogsCMS from "./admin/MediaBlogsCMS";

// Pre-packaged high-res scooter assets for 1-click selection
const PRESET_ASSETS = [
  { label: "Volmo Vista (Light Silver/Gray)", url: "/src/assets/images/regenerated_image_1790169272003.jpg" },
  { label: "Volmo Glider (Charcoal Grey)", url: "/src/assets/images/volmo_glider_1780058835594.png" },
  { label: "Volmo Classic (Crimson Cherry)", url: "/src/assets/images/volmo_classic_1780058851300.png" },
  { label: "Volmo Phantom (Cream Beige)", url: "/src/assets/images/volmo_phantom_1780058868036.png" },
  { label: "Volmo Pulse Concept (Side View)", url: "/src/assets/images/volmo_pulse_1780058885037.png" },
  { label: "Volmo Pulse Cyberpunk (Angular)", url: "/src/assets/images/volmo_pulse_premium_1780068389740.png" },
];

const AVAILABLE_ICONS = [
  "BatteryCharging",
  "ShieldCheck",
  "Cpu",
  "KeyRound",
  "Shield",
  "Zap",
  "Clock",
  "Sparkles",
];

// Founder security verification questions for password reset
export interface SecurityQuestion {
  id: string;
  shortLabel: string;
  question: string;
  formatInstruction: string;
  placeholder: string;
  validate: (answer: string) => boolean;
}

export const FOUNDER_SECURITY_QUESTIONS: SecurityQuestion[] = [
  {
    id: "father_dob",
    shortLabel: "Founder's Father DOB",
    question: "What is the date of birth of founder's father?",
    formatInstruction: "Enter founder's father date of birth",
    placeholder: "Type your answer...",
    validate: (ans: string) => {
      const norm = ans.trim().toLowerCase().replace(/[-_/,\s]+/g, " ");
      return norm === "28 june 1974" || norm === "28 jun 1974";
    },
  },
  {
    id: "mother_dob",
    shortLabel: "Founder's Mother DOB",
    question: "What is the date of birth of founder's mother?",
    formatInstruction: "Enter founder's mother date of birth",
    placeholder: "Type your answer...",
    validate: (ans: string) => {
      const norm = ans.trim().toLowerCase().replace(/[-_/,\s]+/g, " ");
      return norm === "15 september 1981" || norm === "15 sep 1981" || norm === "15 sept 1981";
    },
  },
  {
    id: "childhood_friend",
    shortLabel: "Childhood School Friend",
    question: "What is the founder's childhood school friend name?",
    formatInstruction: "Enter founder's childhood friend name",
    placeholder: "Type your answer...",
    validate: (ans: string) => {
      return ans.trim().toLowerCase() === "mohit";
    },
  },
];

// Initial analytical dummy data if storage is empty
const INITIAL_INQUIRIES: PriceInquiry[] = [
  {
    id: "I-34902",
    name: "Aarav Sharma",
    phone: "9826310245",
    model: "phantom",
    color: "Cream Beige",
    batteryType: "LI",
    batteryConfig: "Lithium-Ion Pack: High-Density (3 Years Warranty)",
    rangeKm: 145,
    status: "new",
    createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
  },
  {
    id: "I-21890",
    name: "Vikram Singh",
    phone: "7880008401",
    model: "classic",
    color: "Pearl White",
    batteryType: "LA",
    batteryConfig: "Lead-Acid: 5 Batteries (12V SLA, 1 Year Warranty)",
    rangeKm: 60,
    status: "contacted",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "I-12904",
    name: "Rohan Gupta",
    phone: "9111822304",
    model: "vista",
    color: "Midnight Black",
    batteryType: "LI",
    batteryConfig: "Lithium-Ion Pack: High-Density (3 Years Warranty)",
    rangeKm: 100,
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

const INITIAL_DEALERS: DealershipApp[] = [
  {
    id: "D-89402",
    name: "Prakash Auto Agency",
    email: "contact@prakashauto.com",
    phone: "8889212001",
    city: "Indore",
    state: "Madhya Pradesh",
    experience: "12 Years in Two-Wheeler Franchise",
    pastBusiness: "Authorized sub-dealer for major ICE Scooter brand. Handling 200+ unit sales monthly.",
    investmentRange: "₹25 Lakhs - ₹50 Lakhs",
    message: "Interested in establishing a flagship Volmo showroom on MG Road, Indore. Highly interested in RTO-free models.",
    status: "applied",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "D-10294",
    name: "Singh Electric Mobiles",
    email: "singh.electric@gmail.com",
    phone: "9425102831",
    city: "Bhopal",
    state: "Madhya Pradesh",
    experience: "3 Years in Battery Spare Parts Distribution",
    pastBusiness: "Distributor of Lead-Acid and Lithium EV battery packs in central India.",
    investmentRange: "₹15 Lakhs - ₹25 Lakhs",
    message: "Seeking exclusive dealership for Bhopal. Ready to set up workshop and charging points.",
    status: "reviewing",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?:
    | "photos"
    | "hero"
    | "models"
    | "accessories"
    | "battery-charger"
    | "pulse"
    | "features"
    | "testimonials"
    | "showrooms"
    | "faq"
    | "contacts"
    | "inquiries"
    | "dealers";
}

// Reusable Image Uploader & Preset Selector Component
function ImageCustomizerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        onChange(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <ImageIcon size={14} className="text-orange-500" />
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-red-400 hover:text-red-300 font-mono transition-colors"
          >
            Clear Photo
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Preview box */}
        <div className="w-24 h-24 rounded-xl border border-slate-700 bg-slate-950 flex items-center justify-center p-2 flex-shrink-0 relative overflow-hidden group">
          {value ? (
            <img
              src={value}
              alt="Custom Preview"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-slate-600 uppercase font-mono text-center">No Photo</span>
          )}
        </div>

        {/* Upload dropzone & input */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 w-full border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            dragOver
              ? "border-orange-500 bg-orange-500/10 scale-[0.99]"
              : "border-slate-750 hover:border-slate-600 bg-slate-950/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <Upload size={18} className="text-slate-400 mb-1" />
          <p className="text-xs text-slate-300 font-bold">Drag &amp; drop photo here or browse</p>
          <p className="text-[10px] text-slate-500 font-mono">PNG, JPG, WebP &bull; Auto converts to Base64</p>
        </div>
      </div>

      {/* Direct URL input */}
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste direct image URL (/src/assets/images/... or https://...)"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-slate-600 font-mono"
        />
      </div>

      {/* 1-Click Presets */}
      <div className="pt-1">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
          Quick Preset Switcher:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_ASSETS.map((preset) => (
            <button
              key={preset.url}
              type="button"
              onClick={() => onChange(preset.url)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                value === preset.url
                  ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPortal({ isOpen, onClose, initialTab }: AdminPortalProps) {
  const {
    modelsData,
    pulseData,
    commonFeatures,
    contactInfo,
    heroConfig,
    brandingConfig,
    testimonialsData,
    showroomsData,
    faqsData,
    siteSections,
    accessoriesData,
    leadAcidBatteriesData,
    lithiumBatteriesData,
    chargersData,
    mediaArticlesData,
    companyPhotosData,
    companyVideosData,
    careerOpeningsData,
    updateSiteSections,
    addModelSpec,
    deleteModelSpec,
    updateModelSpec,
    updatePulseData,
    updateCommonFeatures,
    updateContactInfo,
    resetAllToDefault,
  } = useSiteConfig();

  // Authentication State & Founder Security Question Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem("volmo_admin_password") || "1234";
  });
  const [enteredPassword, setEnteredPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authView, setAuthView] = useState<"login" | "verify" | "reset">("login");

  // Security Question Verification States
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("father_dob");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityError, setSecurityError] = useState("");

  // New Password Reset States (saved forever in localStorage)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState("");

  // In-app password changer
  const [isChangingPasswordInApp, setIsChangingPasswordInApp] = useState(false);
  const [currentPasswordInApp, setCurrentPasswordInApp] = useState("");
  const [newPasswordInApp, setNewPasswordInApp] = useState("");
  const [confirmPasswordInApp, setConfirmPasswordInApp] = useState("");
  const [inAppPassError, setInAppPassError] = useState("");

  // Navigation Tabs
  type TabId =
    | "photos"
    | "hero"
    | "models"
    | "accessories"
    | "battery-charger"
    | "media-blogs"
    | "pulse"
    | "features"
    | "testimonials"
    | "showrooms"
    | "faq"
    | "contacts"
    | "inquiries"
    | "dealers";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab || "photos");

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // CRM States
  const [inquiries, setInquiries] = useState<PriceInquiry[]>([]);
  const [dealers, setDealers] = useState<DealershipApp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Model Editor States
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [isAddingNewModel, setIsAddingNewModel] = useState(false);
  const [modelForm, setModelForm] = useState<ModelSpec | null>(null);
  const [modelEditorSubTab, setModelEditorSubTab] = useState<"general" | "cockpit" | "specs">("general");

  // New Color Draft
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#FF5500");

  // Pulse Draft
  const [pulseForm, setPulseForm] = useState(pulseData);

  // Feature Drafts
  const [featuresForm, setFeaturesForm] = useState(commonFeatures);
  const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);

  // Contacts Draft
  const [contactForm, setContactForm] = useState(contactInfo);

  // Sections Headings Draft
  const [sectionsForm, setSectionsForm] = useState(siteSections);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sync draft forms with site context
  useEffect(() => {
    setPulseForm(pulseData);
  }, [pulseData]);

  useEffect(() => {
    setFeaturesForm(commonFeatures);
  }, [commonFeatures]);

  useEffect(() => {
    setContactForm(contactInfo);
  }, [contactInfo]);

  useEffect(() => {
    setSectionsForm(siteSections);
  }, [siteSections]);

  // Check backend health & connectivity
  const checkBackendHealth = async () => {
    try {
      await api.health.check();
      setBackendStatus("connected");
    } catch {
      setBackendStatus("offline");
    }
  };

  // Load inquiries and dealer submissions from backend database with local fallback
  const loadLeads = async () => {
    // Immediate load from local storage to prevent blank screen
    try {
      const storedInquiries = localStorage.getItem("volmo_inquiries");
      if (storedInquiries) setInquiries(JSON.parse(storedInquiries));
      const storedDealers = localStorage.getItem("volmo_dealers");
      if (storedDealers) setDealers(JSON.parse(storedDealers));
    } catch (e) {
      console.error(e);
    }

    // Live sync from backend API
    try {
      const [backendInquiries, backendDealers] = await Promise.all([
        api.leads.getInquiries(),
        api.leads.getDealers(),
      ]);
      if (backendInquiries && backendInquiries.length > 0) {
        setInquiries(backendInquiries);
        localStorage.setItem("volmo_inquiries", JSON.stringify(backendInquiries));
      }
      if (backendDealers && backendDealers.length > 0) {
        setDealers(backendDealers);
        localStorage.setItem("volmo_dealers", JSON.stringify(backendDealers));
      }
      setBackendStatus("connected");
    } catch (err: any) {
      console.warn("[Admin] Leads loaded from local cache:", err.message);
      setBackendStatus("offline");
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkBackendHealth();
      loadLeads();
    }
  }, [isOpen]);

  // Authenticate (Verified via Backend API for maximum security)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword) {
      setAuthError("Please enter your administrator password.");
      return;
    }

    try {
      const res = await api.auth.login(enteredPassword);
      if (res.success) {
        setIsAuthenticated(true);
        setAuthError("");
        setEnteredPassword("");
        setBackendStatus("connected");
        return;
      }
    } catch (err: any) {
      if (err.status === 401) {
        setAuthError("Incorrect password. Access denied.");
        setEnteredPassword("");
        return;
      }
      // If backend is offline, verify against local stored password fallback
      const currentPass = localStorage.getItem("volmo_admin_password") || adminPassword;
      if (enteredPassword === currentPass) {
        setIsAuthenticated(true);
        setAuthError("");
        setEnteredPassword("");
        return;
      }
      setAuthError("Incorrect password. Access denied.");
      setEnteredPassword("");
    }
  };

  // Verify Founder Security Question via Backend
  const handleVerifySecurityQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityAnswer.trim()) {
      setSecurityError("Please enter your answer.");
      return;
    }

    try {
      const res = await api.auth.verifySecurityQuestion(selectedQuestionId, securityAnswer);
      if (res.verified) {
        setSecurityError("");
        setAuthView("reset");
        setNewPassword("");
        setConfirmPassword("");
        setResetError("");
        return;
      }
    } catch (err: any) {
      // Offline fallback
      const q = FOUNDER_SECURITY_QUESTIONS.find((item) => item.id === selectedQuestionId);
      if (q && q.validate(securityAnswer)) {
        setSecurityError("");
        setAuthView("reset");
        setNewPassword("");
        setConfirmPassword("");
        setResetError("");
        return;
      }
      setSecurityError(err.message || "Incorrect answer. Please verify the specified format and try again.");
    }
  };

  // Reset Password for Forever (Persisted on server & client storage)
  const handleResetPasswordForever = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setResetError("Password cannot be empty.");
      return;
    }
    if (newPassword.length < 3) {
      setResetError("Password must be at least 3 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      await api.auth.resetPassword(selectedQuestionId, securityAnswer, newPassword);
    } catch (err: any) {
      console.warn("[Admin] Local password reset applied:", err.message);
    }

    localStorage.setItem("volmo_admin_password", newPassword);
    setAdminPassword(newPassword);
    setIsAuthenticated(true);
    setAuthView("login");
    setSecurityAnswer("");
    setEnteredPassword("");
    setResetError("");
    showToast("Password reset successfully on backend & saved forever!");
  };

  // In-app Change Password Handler (Persisted on server)
  const handleChangePasswordInApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInApp.trim()) {
      setInAppPassError("New password cannot be empty.");
      return;
    }
    if (newPasswordInApp !== confirmPasswordInApp) {
      setInAppPassError("New passwords do not match.");
      return;
    }

    try {
      await api.auth.changePassword(currentPasswordInApp, newPasswordInApp);
    } catch (err: any) {
      const currentPass = localStorage.getItem("volmo_admin_password") || adminPassword;
      if (currentPasswordInApp !== currentPass) {
        setInAppPassError("Current password is incorrect.");
        return;
      }
    }

    localStorage.setItem("volmo_admin_password", newPasswordInApp);
    setAdminPassword(newPasswordInApp);
    setIsChangingPasswordInApp(false);
    setCurrentPasswordInApp("");
    setNewPasswordInApp("");
    setConfirmPasswordInApp("");
    setInAppPassError("");
    showToast("Admin password updated on server and saved forever!");
  };

  // Status Change handlers with backend sync
  const handleInquiryStatus = (id: string, status: PriceInquiry["status"]) => {
    const updated = inquiries.map((item) => (item.id === id ? { ...item, status } : item));
    setInquiries(updated);
    localStorage.setItem("volmo_inquiries", JSON.stringify(updated));
    api.leads.updateInquiryStatus(id, status).catch((err) => {
      console.warn("[Admin] Failed to update inquiry status on backend:", err.message);
    });
    showToast(`Lead status updated to "${status}".`);
  };

  const handleDealerStatus = (id: string, status: DealershipApp["status"]) => {
    const updated = dealers.map((item) => (item.id === id ? { ...item, status } : item));
    setDealers(updated);
    localStorage.setItem("volmo_dealers", JSON.stringify(updated));
    api.leads.updateDealerStatus(id, status).catch((err) => {
      console.warn("[Admin] Failed to update dealer status on backend:", err.message);
    });
    showToast(`Dealer application status updated to "${status}".`);
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm("Delete this price inquiry lead?")) {
      const updated = inquiries.filter((item) => item.id !== id);
      setInquiries(updated);
      localStorage.setItem("volmo_inquiries", JSON.stringify(updated));
      api.leads.deleteInquiry(id).catch((err) => {
        console.warn("[Admin] Failed to delete inquiry from backend:", err.message);
      });
      showToast("Lead removed from database.");
    }
  };

  const handleDeleteDealer = (id: string) => {
    if (window.confirm("Delete this dealership application?")) {
      const updated = dealers.filter((item) => item.id !== id);
      setDealers(updated);
      localStorage.setItem("volmo_dealers", JSON.stringify(updated));
      api.leads.deleteDealer(id).catch((err) => {
        console.warn("[Admin] Failed to delete dealer application from backend:", err.message);
      });
      showToast("Application removed from database.");
    }
  };

  // Export JSON Utility
  const handleExportData = () => {
    let payload: any = {};
    let filename = "";
    if (activeTab === "inquiries") {
      payload = inquiries;
      filename = "volmo_price_inquiries.json";
    } else if (activeTab === "dealers") {
      payload = dealers;
      filename = "volmo_dealership_leads.json";
    } else if (activeTab === "models") {
      payload = modelsData;
      filename = "volmo_scooter_models.json";
    } else if (activeTab === "accessories") {
      payload = accessoriesData;
      filename = "volmo_accessories_catalog.json";
    } else if (activeTab === "battery-charger") {
      payload = {
        leadAcidBatteries: leadAcidBatteriesData,
        lithiumBatteries: lithiumBatteriesData,
        chargers: chargersData,
      };
      filename = "volmo_batteries_and_chargers.json";
    } else {
      payload = { pulse: pulseData, features: commonFeatures, contact: contactInfo };
      filename = "volmo_website_config.json";
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", filename);
    dlAnchor.click();
  };

  // Factory Reset
  const handleFactoryReset = () => {
    if (
      window.confirm(
        "Are you sure you want to restore all custom changes to factory default? Any custom photos, models, and text will be reset to factory defaults."
      )
    ) {
      resetAllToDefault();
      showToast("Restored all website configurations to factory default!");
    }
  };

  // Model Form handlers
  const handleStartEditModel = (model: ModelSpec, initialSubTab: "general" | "cockpit" | "specs" = "general") => {
    setModelForm(JSON.parse(JSON.stringify(model)));
    setEditingModelId(model.id);
    setIsAddingNewModel(false);
    setModelEditorSubTab(initialSubTab);
  };

  const handleStartAddNewModel = () => {
    const newId = `model_${Date.now()}`;
    setModelForm({
      id: newId,
      name: "Volmo New Model",
      tagline: "High-efficiency electric mobility designed for modern cities.",
      speed: "25 KM/H",
      motor: "250W High-Efficiency BLDC Hub Motor",
      controller: "Sine Wave Intelligent Waterproof Controller",
      warranty: "3 Years Comprehensive Battery & Motor Warranty",
      isRtoFree: true,
      colors: [
        { name: "Polar White", hex: "#FFFFFF" },
        { name: "Obsidian Black", hex: "#111111" },
      ],
      image: "/src/assets/images/regenerated_image_1790169272003.jpg",
      basePriceEstimate: "₹59,999",
      featured: false,
      frontBrake: "Front Disc Brake",
      rearBrake: "Rear Drum Brake with Regenerative EBS",
      groundClearance: "165 mm",
      wheelSize: "10-inch Tubeless Heavy-Duty Alloys",
      batterySpecs: "Compatible with 60V Lead-Acid & High-Density Smart Lithium-Ion",
      ridingModes: ["Eco (Speed Capped)", "City (Smooth Cruiser)", "Sport (Max Torque)"],
    });
    setEditingModelId(newId);
    setIsAddingNewModel(true);
    setModelEditorSubTab("general");
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelForm) return;

    if (!modelForm.name.trim()) {
      alert("Model name cannot be empty.");
      return;
    }

    if (isAddingNewModel) {
      addModelSpec(modelForm);
      showToast(`Added new model "${modelForm.name}"!`);
    } else if (editingModelId) {
      updateModelSpec(editingModelId, modelForm);
      showToast(`Updated model "${modelForm.name}"!`);
    }

    setModelForm(null);
    setEditingModelId(null);
    setIsAddingNewModel(false);
  };

  const handleDeleteModel = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" scooter model from the website?`)) {
      deleteModelSpec(id);
      showToast(`Deleted "${name}".`);
    }
  };

  const handleAddColorToModel = () => {
    if (!modelForm || !newColorName.trim()) return;
    const exists = modelForm.colors.some((c) => c.name.toLowerCase() === newColorName.trim().toLowerCase());
    if (exists) {
      alert("Color name already exists.");
      return;
    }
    setModelForm({
      ...modelForm,
      colors: [...modelForm.colors, { name: newColorName.trim(), hex: newColorHex }],
    });
    setNewColorName("");
  };

  const handleRemoveColorFromModel = (index: number) => {
    if (!modelForm) return;
    if (modelForm.colors.length <= 1) {
      alert("A scooter model must have at least 1 color.");
      return;
    }
    setModelForm({
      ...modelForm,
      colors: modelForm.colors.filter((_, i) => i !== index),
    });
  };

  // Pulse Save
  const handleSavePulse = (e: React.FormEvent) => {
    e.preventDefault();
    updatePulseData(pulseForm);
    updateSiteSections(sectionsForm);
    showToast("Volmo Pulse upcoming project updated!");
  };

  // Contacts Save
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    showToast("Corporate contact details and factory address updated!");
  };

  // Filtered Leads
  const filteredInquiries = inquiries.filter((iq) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = iq.name.toLowerCase().includes(q) || iq.phone.includes(q) || iq.model.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || iq.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredDealers = dealers.filter((dl) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = dl.name.toLowerCase().includes(q) || dl.phone.includes(q) || dl.city.toLowerCase().includes(q) || dl.state.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || dl.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Admin Container Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            className="relative w-full max-w-6xl h-full md:h-[92vh] bg-slate-900 border-0 md:border border-slate-800 rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white z-10"
          >
            {/* Top Bar */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl">
                  <FolderLock size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black uppercase tracking-tight text-white font-sans">
                      Volmo Management &amp; CMS Panel
                    </h2>
                    {backendStatus === "connected" ? (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5 shadow-xs" title={`Connected to ${api.getBaseUrl()}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        RENDER BACKEND CONNECTED
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5" title={`Target: ${api.getBaseUrl()}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        LOCAL CACHE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Customize every photo, model specification, colors, features &amp; live customer leads
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => {
                        setIsChangingPasswordInApp(true);
                        setCurrentPasswordInApp("");
                        setNewPasswordInApp("");
                        setConfirmPasswordInApp("");
                        setInAppPassError("");
                      }}
                      title="Update Administrator Master Password"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all cursor-pointer"
                    >
                      <KeyRound size={13} className="text-orange-400" />
                      Change Password
                    </button>
                    <button
                      onClick={handleExportData}
                      title="Export current data as JSON"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 rounded-xl transition-all cursor-pointer"
                    >
                      <FileSpreadsheet size={13} className="text-emerald-400" />
                      Export Data
                    </button>
                    <button
                      onClick={handleFactoryReset}
                      title="Restore all default settings"
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-xs font-mono text-red-400 rounded-xl transition-all cursor-pointer"
                    >
                      <Undo2 size={13} />
                      Factory Reset
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-800"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notification Toast */}
            {toastMsg && (
              <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-bold text-center font-mono flex items-center justify-center gap-2 animate-fadeIn">
                <Check size={14} />
                <span>{toastMsg}</span>
              </div>
            )}

            {!isAuthenticated ? (
              /* Security Authorization & Reset Gate */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                {authView === "login" && (
                  <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 text-orange-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                      <Lock size={30} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                      Admin Authorization Access
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                      Restricted system access. Enter your administrator password to unlock management features.
                    </p>

                    <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
                      <input
                        type="password"
                        value={enteredPassword}
                        onChange={(e) => setEnteredPassword(e.target.value)}
                        placeholder="Enter Admin Password"
                        autoFocus
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-base font-mono font-bold tracking-wider text-orange-400 focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
                      />
                      {authError && <p className="text-red-400 text-xs font-bold font-mono">{authError}</p>}
                      <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20"
                      >
                        Unlock Administration
                      </button>
                    </form>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("verify");
                          setSecurityAnswer("");
                          setSecurityError("");
                          setAuthError("");
                        }}
                        className="text-xs text-slate-400 hover:text-orange-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <HelpCircle size={14} />
                        <span>Forgot Password? Reset via Founder Verification</span>
                      </button>
                    </div>
                  </div>
                )}

                {authView === "verify" && (
                  <div className="w-full max-w-md flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 text-orange-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                      <ShieldCheck size={30} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                      Founder Security Verification
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                      Choose any founder security question below. Answering correctly will allow you to reset the administrator password forever.
                    </p>

                    {/* Question selector tabs */}
                    <div className="flex flex-wrap gap-1.5 justify-center mb-4 w-full">
                      {FOUNDER_SECURITY_QUESTIONS.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            setSelectedQuestionId(q.id);
                            setSecurityAnswer("");
                            setSecurityError("");
                          }}
                          className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer ${
                            selectedQuestionId === q.id
                              ? "bg-orange-600 text-white shadow-sm border border-orange-500"
                              : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {q.shortLabel}
                        </button>
                      ))}
                    </div>

                    {/* Active Question Prompt Card */}
                    {(() => {
                      const activeQ =
                        FOUNDER_SECURITY_QUESTIONS.find((q) => q.id === selectedQuestionId) ||
                        FOUNDER_SECURITY_QUESTIONS[0];
                      return (
                        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-left mb-4 shadow-inner">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] uppercase font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                              Security Question
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Founder Identity Check</span>
                          </div>
                          <p className="text-sm font-bold text-white mb-2">{activeQ.question}</p>
                          <div className="bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono flex items-center gap-2">
                            <span className="text-orange-400 font-bold">&bull;</span>
                            <span>Founder Security Verification Gate</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Answer Form */}
                    <form onSubmit={handleVerifySecurityQuestion} className="w-full space-y-4">
                      <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        placeholder={
                          FOUNDER_SECURITY_QUESTIONS.find((q) => q.id === selectedQuestionId)?.placeholder ||
                          "Enter answer..."
                        }
                        autoFocus
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-sm font-mono text-white focus:outline-none focus:border-orange-500 placeholder:text-slate-600"
                      />
                      {securityError && <p className="text-red-400 text-xs font-bold font-mono">{securityError}</p>}
                      <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-orange-600/20"
                      >
                        Verify Security Answer
                      </button>
                    </form>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("login");
                          setSecurityAnswer("");
                          setSecurityError("");
                        }}
                        className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        <span>Return to Password Login</span>
                      </button>
                    </div>
                  </div>
                )}

                {authView === "reset" && (
                  <div className="w-full max-w-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
                      <KeyRound size={30} />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
                      Reset Admin Password Forever
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                      Identity verified! Create your new administrator password. This will be updated in storage permanently.
                    </p>

                    <form onSubmit={handleResetPasswordForever} className="w-full space-y-4 text-left">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoFocus
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-base font-mono text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-base font-mono text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
                        />
                      </div>
                      {resetError && <p className="text-red-400 text-xs font-bold font-mono text-center">{resetError}</p>}
                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl uppercase text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
                      >
                        Save Password Forever &amp; Unlock
                      </button>
                    </form>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("login");
                          setNewPassword("");
                          setConfirmPassword("");
                          setResetError("");
                        }}
                        className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={13} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Main Authenticated CMS Workspace */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navigation Tabs Header */}
                <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {[
                    { id: "photos", label: "📸 All Photos & Media", icon: ImageIcon, badge: "Master" },
                    { id: "hero", label: "Hero & Cover Banner", icon: Layout },
                    { id: "models", label: `Scooter Fleet CMS (${modelsData.length})`, icon: Sliders },
                    { id: "accessories", label: `Accessories CMS (${accessoriesData.length})`, icon: ShieldCheck, badge: "Catalog" },
                    { id: "battery-charger", label: `Battery & Charger CMS (${leadAcidBatteriesData.length + lithiumBatteriesData.length + chargersData.length})`, icon: Zap, badge: "Power" },
                    { id: "media-blogs", label: `Media & Blogs CMS (${mediaArticlesData.length + companyPhotosData.length + companyVideosData.length + careerOpeningsData.length})`, icon: Newspaper, badge: "Live" },
                    { id: "pulse", label: "Pulse Concept CMS", icon: Sparkles },
                    { id: "features", label: "Highlight Features CMS", icon: ShieldCheck },
                    { id: "testimonials", label: `Rider Reviews (${testimonialsData.length})`, icon: MessageSquare },
                    { id: "showrooms", label: `Dealership Hubs (${showroomsData.length})`, icon: Store },
                    { id: "faq", label: `FAQs & Support (${faqsData.length})`, icon: HelpCircle },
                    { id: "contacts", label: "Branding & Plant CMS", icon: Building },
                    { id: "inquiries", label: `Price Inquiries (${inquiries.length})`, icon: Mail },
                    { id: "dealers", label: `Dealership Leads (${dealers.length})`, icon: Store },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setModelForm(null);
                          setEditingModelId(null);
                        }}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                            : "text-slate-400 hover:text-white hover:bg-slate-900"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-orange-400" : "text-slate-500"} />
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="text-[9px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-1.5 py-0.2 rounded-full font-mono uppercase font-bold">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Master Tab: All Photos & Media CMS */}
                {activeTab === "photos" && <PhotosCMS onShowToast={showToast} />}

                {/* Hero & Cover Banner CMS */}
                {activeTab === "hero" && <HeroCMS onShowToast={showToast} />}

                {/* Accessories CMS */}
                {activeTab === "accessories" && <AccessoriesCMS onShowToast={showToast} />}

                {/* Battery & Charger CMS */}
                {activeTab === "battery-charger" && <BatteryChargerCMS onShowToast={showToast} />}

                {/* Media & Blogs CMS */}
                {activeTab === "media-blogs" && <MediaBlogsCMS onShowToast={showToast} />}

                {/* Tab: Price Inquiries CRM */}
                {activeTab === "inquiries" && (
                  <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search leads by customer, phone, model..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="new">🔴 New Leads</option>
                          <option value="contacted">🟡 Contacted</option>
                          <option value="completed">🟢 Done / Sold</option>
                        </select>
                        <button
                          onClick={loadLeads}
                          title="Refresh inquiries"
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-800"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                      {filteredInquiries.length === 0 ? (
                        <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                          <Mail size={32} className="mx-auto text-slate-600 mb-2" />
                          <p className="text-xs text-slate-400">No price inquiries matching filter.</p>
                        </div>
                      ) : (
                        filteredInquiries.map((iq) => (
                          <div
                            key={iq.id}
                            className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-750 transition-all"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-bold">
                                  {iq.id}
                                </span>
                                <h4 className="font-bold text-white text-sm">{iq.name}</h4>
                                <span className="text-slate-500 text-[11px] flex items-center gap-1 font-mono">
                                  <Clock size={11} />
                                  {new Date(iq.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                <a
                                  href={`tel:${iq.phone}`}
                                  className="flex items-center gap-1.5 text-emerald-400 hover:underline font-mono font-bold"
                                >
                                  <PhoneCall size={12} />
                                  +91 {iq.phone}
                                </a>
                                {iq.email && (
                                  <a
                                    href={`mailto:${iq.email}`}
                                    className="flex items-center gap-1.5 text-cyan-400 hover:underline font-mono"
                                  >
                                    <Mail size={12} />
                                    {iq.email}
                                  </a>
                                )}
                                <span className="flex items-center gap-1">
                                  Model: <strong className="text-white uppercase">{iq.model}</strong>
                                </span>
                                {iq.color && iq.color !== "Standard" && !iq.color.startsWith("Email:") && (
                                  <span className="flex items-center gap-1">
                                    Color: <strong className="text-white">{iq.color}</strong>
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                                  ✉️ Emailed to piyushshivhare083@gmail.com
                                </span>
                              </div>

                              <div className="text-xs bg-slate-900/80 p-2 rounded-xl text-slate-300 font-mono">
                                ⚡ Range: <strong className="text-orange-400">{iq.rangeKm} KM</strong> &bull; {iq.batteryConfig}
                              </div>

                              {iq.message && (
                                <div className="text-xs bg-slate-900/50 border border-slate-800 p-2.5 rounded-xl text-slate-300 font-sans">
                                  <strong className="text-slate-400 block text-[10px] uppercase font-mono mb-0.5">Message / Query:</strong>
                                  {iq.message}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 justify-end">
                              <select
                                value={iq.status}
                                onChange={(e) => handleInquiryStatus(iq.id, e.target.value as any)}
                                className={`text-xs px-2.5 py-1.5 rounded-xl border focus:outline-none font-bold ${
                                  iq.status === "new"
                                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                                    : iq.status === "contacted"
                                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                }`}
                              >
                                <option value="new">🔴 New</option>
                                <option value="contacted">🟡 Contacted</option>
                                <option value="completed">🟢 Done / Sold</option>
                              </select>

                              <button
                                onClick={() => handleDeleteInquiry(iq.id)}
                                className="p-2 text-slate-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Dealership Applications CRM */}
                {activeTab === "dealers" && (
                  <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="relative flex-1 max-w-sm">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search dealers by name, city, state..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-slate-700"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="applied">🔵 Applied</option>
                          <option value="reviewing">🟡 Under Review</option>
                          <option value="approved">🟢 Approved</option>
                          <option value="rejected">🔴 Rejected</option>
                        </select>
                        <button
                          onClick={loadLeads}
                          title="Refresh dealers"
                          className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer border border-slate-800"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                      {filteredDealers.length === 0 ? (
                        <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/60">
                          <Store size={32} className="mx-auto text-slate-600 mb-2" />
                          <p className="text-xs text-slate-400">No dealership applications found.</p>
                        </div>
                      ) : (
                        filteredDealers.map((dl) => (
                          <div key={dl.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md font-bold">
                                    {dl.id}
                                  </span>
                                  <h4 className="font-bold text-white text-base">{dl.name}</h4>
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-1">
                                  <a href={`tel:${dl.phone}`} className="text-white hover:underline flex items-center gap-1 font-mono">
                                    <PhoneCall size={12} className="text-slate-500" />
                                    +91 {dl.phone}
                                  </a>
                                  <a href={`mailto:${dl.email}`} className="hover:underline flex items-center gap-1 font-mono">
                                    <Mail size={12} className="text-slate-500" />
                                    {dl.email}
                                  </a>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} className="text-slate-500" />
                                    {dl.city}, {dl.state}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                                    ✉️ Emailed to piyushshivhare083@gmail.com
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <select
                                  value={dl.status}
                                  onChange={(e) => handleDealerStatus(dl.id, e.target.value as any)}
                                  className={`text-xs px-2.5 py-1.5 rounded-xl border focus:outline-none font-bold ${
                                    dl.status === "applied"
                                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                      : dl.status === "reviewing"
                                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                      : dl.status === "approved"
                                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                      : "bg-red-500/10 border-red-500/30 text-red-400"
                                  }`}
                                >
                                  <option value="applied">🔵 Applied</option>
                                  <option value="reviewing">🟡 Under Review</option>
                                  <option value="approved">🟢 Approved</option>
                                  <option value="rejected">🔴 Rejected</option>
                                </select>
                                <button
                                  onClick={() => handleDeleteDealer(dl.id)}
                                  className="p-2 text-slate-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
                                  title="Delete Application"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                                  Investment Budget Capacity
                                </span>
                                <span className="font-bold text-emerald-400 text-sm">{dl.investmentRange}</span>
                              </div>
                              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                                  Franchise Experience
                                </span>
                                <span className="font-semibold text-slate-200">{dl.experience}</span>
                              </div>
                            </div>

                            <div className="text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60 space-y-1">
                              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                                Current Business Profile &amp; Location Plan:
                              </span>
                              <p className="text-slate-300 leading-relaxed">{dl.pastBusiness}</p>
                              {dl.message && (
                                <p className="text-slate-400 italic pt-1 border-t border-slate-800/50">
                                  "{dl.message}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: Scooter Fleet CMS (Full Edit, Photo Customization, Specs) */}
                {activeTab === "models" && (
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!modelForm ? (
                      /* Models Overview Grid */
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold uppercase tracking-wide text-white">
                                Scooter Models Catalog ({modelsData.length})
                              </h3>
                              <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                                Cockpit &amp; Specs Enabled
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Click customize on any model to edit its high-definition photos, base price, live Cockpit Telemetry, 4 Studio Angles, and Technical Ledger Specifications.
                            </p>
                          </div>
                          <button
                            onClick={handleStartAddNewModel}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-600/20 self-start sm:self-auto"
                          >
                            <Plus size={15} /> Add New Scooter
                          </button>
                        </div>

                        {/* Fleet Section Headlines & Badges */}
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                              <Sparkles size={14} className="text-orange-400" />
                              Scooter Fleet Section Headlines &amp; Badges
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                updateSiteSections(sectionsForm);
                                showToast("Fleet section headings saved!");
                              }}
                              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              <Save size={12} />
                              Save Headings
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                Top Pill Badge
                              </label>
                              <input
                                type="text"
                                value={sectionsForm.fleetBadge}
                                onChange={(e) => setSectionsForm({ ...sectionsForm, fleetBadge: e.target.value })}
                                placeholder="Next-Gen EV Fleet"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                Main Section Heading
                              </label>
                              <input
                                type="text"
                                value={sectionsForm.fleetHeading}
                                onChange={(e) => setSectionsForm({ ...sectionsForm, fleetHeading: e.target.value })}
                                placeholder="Engineered For Every Journey"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              Subtitle Paragraph
                            </label>
                            <textarea
                              rows={2}
                              value={sectionsForm.fleetSubtitle}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, fleetSubtitle: e.target.value })}
                              placeholder="Discover low-speed electric mobility with zero licensing or registration requirements..."
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
                            />
                          </div>
                        </div>

                        {/* Quick Navigation / Help Guide */}
                        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
                          <span className="text-orange-400 text-sm">💡</span>
                          <p className="leading-relaxed">
                            <strong className="text-slate-200">Where to edit Cockpit &amp; Specifications?</strong> Click <span className="text-orange-300 font-semibold">"Customize"</span> or the quick shortcuts <span className="text-cyan-300 font-semibold">"🎛️ Cockpit &amp; Angles"</span> / <span className="text-emerald-300 font-semibold">"📋 Specs Ledger"</span> on any scooter below. You can customize the simulated LCD speedometer, 4 perspective angles (photos + descriptions), and the full automotive technical ledger!
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {modelsData.map((scooter) => (
                            <div
                              key={scooter.id}
                              className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex gap-4 items-start mb-4">
                                  <div className="w-24 h-24 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-center p-2 flex-shrink-0 relative overflow-hidden">
                                    <img
                                      src={scooter.image}
                                      alt={scooter.name}
                                      referrerPolicy="no-referrer"
                                      className="max-h-full max-w-full object-contain"
                                    />
                                    {scooter.featured && (
                                      <span className="absolute top-1 right-1 text-[8px] font-bold bg-orange-600 text-white px-1 rounded uppercase">
                                        ★
                                      </span>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-base font-extrabold uppercase text-white tracking-tight">
                                        {scooter.name}
                                      </h4>
                                      <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                        {scooter.id}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-400 line-clamp-2">{scooter.tagline}</p>
                                    <p className="text-xs font-mono pt-1 text-slate-300">
                                      Est. Price:{" "}
                                      <strong className="text-emerald-400 font-bold">{scooter.basePriceEstimate}</strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-850 mb-4">
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Top Speed</span>
                                    <span className="font-semibold text-slate-300">{scooter.speed}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Motor</span>
                                    <span className="font-semibold text-slate-300">{scooter.motor}</span>
                                  </div>
                                </div>

                                {/* Colors swatch */}
                                <div className="space-y-1 mb-4">
                                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                                    Colors Available ({scooter.colors.length}):
                                  </span>
                                  <div className="flex flex-wrap gap-1.5 items-center">
                                    {scooter.colors.map((c) => (
                                      <div
                                        key={c.name}
                                        title={c.name}
                                        className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300"
                                      >
                                        <span
                                          className="w-2.5 h-2.5 rounded-full border border-slate-600"
                                          style={{ backgroundColor: c.hex }}
                                        />
                                        <span>{c.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 pt-3 border-t border-slate-900">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                    {scooter.isRtoFree ? "✓ RTO EXEMPT" : "Standard Model"}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteModel(scooter.id, scooter.name)}
                                    className="p-1.5 bg-slate-900 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded-xl transition-all cursor-pointer border border-slate-800"
                                    title="Delete Model"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {/* Fast action sub-tab edit shortcuts */}
                                <div className="grid grid-cols-3 gap-1.5">
                                  <button
                                    onClick={() => handleStartEditModel(scooter, "general")}
                                    className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border border-slate-700"
                                    title="Customize photos, pricing & colors"
                                  >
                                    <Edit3 size={12} className="text-orange-400" />
                                    <span>Customize</span>
                                  </button>
                                  <button
                                    onClick={() => handleStartEditModel(scooter, "cockpit")}
                                    className="px-2 py-2 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border border-cyan-800/60"
                                    title="Edit Cockpit Telemetry Console and 4 Perspectives"
                                  >
                                    <Gauge size={12} className="text-cyan-400" />
                                    <span>Cockpit</span>
                                  </button>
                                  <button
                                    onClick={() => handleStartEditModel(scooter, "specs")}
                                    className="px-2 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border border-emerald-800/60"
                                    title="Edit full technical ledger and utility specs"
                                  >
                                    <FileText size={12} className="text-emerald-400" />
                                    <span>Specs</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* Live Model Customization Form */
                      <form onSubmit={handleSaveModel} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                        {/* Header with Title & Back Button */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                              <Edit3 size={18} className="text-orange-400" />
                              {isAddingNewModel ? "Add New Scooter Model" : `Customize Scooter: ${modelForm.name}`}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Edit photo, telemetry cockpit, 4 perspective angles, and technical ledger specifications.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setModelForm(null);
                              setEditingModelId(null);
                            }}
                            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-all cursor-pointer"
                          >
                            Back to Fleet
                          </button>
                        </div>

                        {/* Model Customizer Navigation Sub-Tabs */}
                        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => setModelEditorSubTab("general")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              modelEditorSubTab === "general"
                                ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                            }`}
                          >
                            <Sliders size={13} />
                            <span>1. General &amp; Colors</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setModelEditorSubTab("cockpit")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              modelEditorSubTab === "cockpit"
                                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                            }`}
                          >
                            <Gauge size={13} />
                            <span>2. Cockpit &amp; Studio Angles (4 Views)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setModelEditorSubTab("specs")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              modelEditorSubTab === "specs"
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                            }`}
                          >
                            <FileText size={13} />
                            <span>3. Technical Ledger &amp; Specs</span>
                          </button>
                        </div>

                        <div className="space-y-6">
                          {/* ============================================================ */}
                          {/* SUB-TAB 1: GENERAL & PRICING                                  */}
                          {/* ============================================================ */}
                          {modelEditorSubTab === "general" && (
                            <div className="space-y-6">
                              {/* Image Customizer */}
                              <div className="space-y-3">
                                <ImageCustomizerField
                                  label="Primary High-Definition Scooter Photo"
                                  value={modelForm.image}
                                  onChange={(url) => setModelForm({ ...modelForm, image: url })}
                                />
                                
                                {/* Quick Presets */}
                                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-2">
                                    Quick Choose From Official Stock Library:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {PRESET_ASSETS.map((asset, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setModelForm({ ...modelForm, image: asset.url })}
                                        className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all cursor-pointer ${
                                          modelForm.image === asset.url
                                            ? "bg-orange-500/20 border-orange-500 text-orange-300 font-bold"
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                                        }`}
                                      >
                                        {asset.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Primary Info */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Scooter Name
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={modelForm.name}
                                    onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                                    placeholder="e.g. Volmo Vista"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Estimated Base Price
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={modelForm.basePriceEstimate}
                                    onChange={(e) => setModelForm({ ...modelForm, basePriceEstimate: e.target.value })}
                                    placeholder="e.g. ₹59,999"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-slate-600"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Top Speed
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={modelForm.speed}
                                    onChange={(e) => setModelForm({ ...modelForm, speed: e.target.value })}
                                    placeholder="e.g. 25 KM/H"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                  Marketing Tagline / Hero Summary
                                </label>
                                <input
                                  type="text"
                                  value={modelForm.tagline}
                                  onChange={(e) => setModelForm({ ...modelForm, tagline: e.target.value })}
                                  placeholder="e.g. The pinnacle of urban electric cruising with featherlight agility."
                                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                />
                              </div>

                              {/* Toggles */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={modelForm.isRtoFree}
                                    onChange={(e) => setModelForm({ ...modelForm, isRtoFree: e.target.checked })}
                                    className="w-4 h-4 accent-orange-500 rounded"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-white block">RTO &amp; License Exempt</span>
                                    <span className="text-[10px] text-slate-400">Show green RTO-free badge on landing page</span>
                                  </div>
                                </label>

                                <label className="flex items-center gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={modelForm.featured}
                                    onChange={(e) => setModelForm({ ...modelForm, featured: e.target.checked })}
                                    className="w-4 h-4 accent-orange-500 rounded"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-white block">Featured Star Badge</span>
                                    <span className="text-[10px] text-slate-400">Highlight this scooter model as Most Popular</span>
                                  </div>
                                </label>
                              </div>

                              {/* Color Customizer Swatch Manager */}
                              <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                                <label className="text-xs text-slate-300 font-bold uppercase tracking-wider block">
                                  Available Color Variants
                                </label>

                                <div className="flex flex-wrap gap-2">
                                  {modelForm.colors.map((col, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs"
                                    >
                                      <span
                                        className="w-3.5 h-3.5 rounded-full border border-slate-600"
                                        style={{ backgroundColor: col.hex }}
                                      />
                                      <span className="font-semibold text-white">{col.name}</span>
                                      <span className="text-[10px] text-slate-500 font-mono">({col.hex})</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveColorFromModel(idx)}
                                        className="text-slate-500 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>

                                {/* Add new color line */}
                                <div className="flex flex-wrap items-center gap-3 pt-2">
                                  <input
                                    type="text"
                                    value={newColorName}
                                    onChange={(e) => setNewColorName(e.target.value)}
                                    placeholder="Color name (e.g. Matte Gray)"
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-slate-600 font-medium"
                                  />
                                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
                                    <input
                                      type="color"
                                      value={newColorHex}
                                      onChange={(e) => setNewColorHex(e.target.value)}
                                      className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                                    />
                                    <span className="text-[11px] font-mono text-slate-400">{newColorHex}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={handleAddColorToModel}
                                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-700"
                                  >
                                    + Add Color
                                  </button>
                                </div>
                              </div>

                              {/* Next sub-tab quick link */}
                              <div className="flex justify-end pt-2">
                                <button
                                  type="button"
                                  onClick={() => setModelEditorSubTab("cockpit")}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                                >
                                  <span>Proceed to Cockpit &amp; Studio Angles</span>
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* ============================================================ */}
                          {/* SUB-TAB 2: COCKPIT & 4 STUDIO PERSPECTIVE ANGLES              */}
                          {/* ============================================================ */}
                          {modelEditorSubTab === "cockpit" && (
                            <div className="space-y-6">
                              <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-2xl p-4 space-y-1.5">
                                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wide">
                                  <Gauge size={16} />
                                  <span>Interactive Cockpit &amp; 4 Studio Perspectives</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  On the model detail page, customers can rotate through 4 angles: <strong>Dynamic Side</strong>, <strong>Front LED Headlamp</strong>, <strong>Cockpit Console</strong>, and <strong>BLDC Chassis</strong>.
                                  You can customize their text titles, technical details, and upload custom high-resolution photos. When a photo is uploaded, customers get an interactive switch between the live simulator and your high-definition photo!
                                </p>
                              </div>

                              {/* ANGLE 1: DYNAMIC SIDE PROFILE */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="text-xs font-mono uppercase text-orange-400 font-bold">
                                    Angle 1: Dynamic Side Profile
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">Product Profile View</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Button Label</label>
                                    <input
                                      type="text"
                                      value={modelForm.sideAngleLabel || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, sideAngleLabel: e.target.value })}
                                      placeholder="Dynamic Side"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Subtitle</label>
                                    <input
                                      type="text"
                                      value={modelForm.sideAngleDesc || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, sideAngleDesc: e.target.value })}
                                      placeholder="Product Profile Portfolio"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <ImageCustomizerField
                                  label="Side Profile Custom Photo (Optional)"
                                  value={modelForm.sideImage || ""}
                                  onChange={(url) => setModelForm({ ...modelForm, sideImage: url })}
                                />
                              </div>

                              {/* ANGLE 2: FRONT LED HEADLAMP ASSEMBLY */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                                    Angle 2: Front LED Nose &amp; Headlamp
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">Interactive Beam Simulator or Photo</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Button Label</label>
                                    <input
                                      type="text"
                                      value={modelForm.frontAngleLabel || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontAngleLabel: e.target.value })}
                                      placeholder="LED Nose Head"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Subtitle</label>
                                    <input
                                      type="text"
                                      value={modelForm.frontAngleDesc || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontAngleDesc: e.target.value })}
                                      placeholder="Front signature ring DRL lighting details"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Headlamp Assembly Title</label>
                                    <input
                                      type="text"
                                      value={modelForm.frontTitle || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontTitle: e.target.value })}
                                      placeholder="LED Laser Headlamp Assembly"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Headlamp Description Text</label>
                                    <input
                                      type="text"
                                      value={modelForm.frontDescription || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontDescription: e.target.value })}
                                      placeholder="Ultra-bright dual projector lens coupled with signature neon DRL ring..."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <ImageCustomizerField
                                  label="Front Nose / Headlamp Photo (Enables Photo / Simulator Toggle)"
                                  value={modelForm.frontImage || ""}
                                  onChange={(url) => setModelForm({ ...modelForm, frontImage: url })}
                                />
                              </div>

                              {/* ANGLE 3: INTERACTIVE COCKPIT TELEMETRY CONSOLE */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                                    Angle 3: Interactive Cockpit &amp; Telemetry Gauge
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">LCD Gauge Simulator &amp; Cockpit Photo</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Button Label</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardAngleLabel || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardAngleLabel: e.target.value })}
                                      placeholder="Interactive Console"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Subtitle</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardAngleDesc || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardAngleDesc: e.target.value })}
                                      placeholder="Fully functional simulated digital telemetry gauge"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">LCD Console Title</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardTitle || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardTitle: e.target.value })}
                                      placeholder="Interactive Simulated Telemetry G3 Model"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Gauge Subtitle</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardSubtitle || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardSubtitle: e.target.value })}
                                      placeholder="Sine Wave Telemetry Output"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Gauge Max Speed Capped</label>
                                    <input
                                      type="number"
                                      value={modelForm.dashboardMaxSpeed ?? ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardMaxSpeed: e.target.value ? Number(e.target.value) : undefined })}
                                      placeholder="25"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600 font-mono"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Odometer Simulated Reading</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardOdometer || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardOdometer: e.target.value })}
                                      placeholder="1,248 km"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600 font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Trip Meter Reading</label>
                                    <input
                                      type="text"
                                      value={modelForm.dashboardTrip || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, dashboardTrip: e.target.value })}
                                      placeholder="TRIP A • 24.3 KM"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600 font-mono"
                                    />
                                  </div>
                                </div>

                                <ImageCustomizerField
                                  label="Cockpit Handlebar / LCD Photo (Enables Cockpit Photo / Simulator Toggle)"
                                  value={modelForm.dashboardImage || ""}
                                  onChange={(url) => setModelForm({ ...modelForm, dashboardImage: url })}
                                />
                              </div>

                              {/* ANGLE 4: BLDC CHASSIS & MECHANICAL STRUCTURE */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="text-xs font-mono uppercase text-purple-400 font-bold">
                                    Angle 4: BLDC Chassis &amp; Mechanical Specs
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">Suspension &amp; Rotor Assembly</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Button Label</label>
                                    <input
                                      type="text"
                                      value={modelForm.chassisAngleLabel || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, chassisAngleLabel: e.target.value })}
                                      placeholder="BLDC Drivetrain"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Angle Subtitle</label>
                                    <input
                                      type="text"
                                      value={modelForm.chassisAngleDesc || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, chassisAngleDesc: e.target.value })}
                                      placeholder="Heavy hydraulic fork structure specs"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Assembly Badge</label>
                                    <input
                                      type="text"
                                      value={modelForm.chassisBadge || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, chassisBadge: e.target.value })}
                                      placeholder="Mechanical Assembly Spec"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Front Suspension Detail</label>
                                    <textarea
                                      rows={2}
                                      value={modelForm.frontSuspension || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontSuspension: e.target.value })}
                                      placeholder="Telescopic Hydraulic Fork Shock Absorbers (31mm core) • Designed to absorb aggressive bumps on Indian roads."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Rear Suspension Detail</label>
                                    <textarea
                                      rows={2}
                                      value={modelForm.rearSuspension || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, rearSuspension: e.target.value })}
                                      placeholder="Dual Coil Spring Hydro-Dampers with 5-stage mechanical load adjustment."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">BLDC Core Rotor Specs</label>
                                    <textarea
                                      rows={2}
                                      value={modelForm.bldcRotor || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, bldcRotor: e.target.value })}
                                      placeholder="High-density Copper Stator windings with powerful Neodymium permanent magnets. Integrated in the rear wheel."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Engineering Stress Test Disclaimer</label>
                                    <input
                                      type="text"
                                      value={modelForm.chassisDisclaimer || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, chassisDisclaimer: e.target.value })}
                                      placeholder="* All mechanical frameworks undergo 50,000 stress impact cycles before assembly."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>

                                <ImageCustomizerField
                                  label="Chassis & Fork Assembly Photo (Enables Spec / Photo Toggle)"
                                  value={modelForm.chassisImage || ""}
                                  onChange={(url) => setModelForm({ ...modelForm, chassisImage: url })}
                                />
                              </div>

                              {/* Navigation buttons */}
                              <div className="flex items-center justify-between pt-2">
                                <button
                                  type="button"
                                  onClick={() => setModelEditorSubTab("general")}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                                >
                                  <ArrowLeft size={13} />
                                  <span>Back to General</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setModelEditorSubTab("specs")}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                                >
                                  <span>Proceed to Technical Ledger &amp; Specs</span>
                                  <ChevronRight size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* ============================================================ */}
                          {/* SUB-TAB 3: TECHNICAL LEDGER & FULL SPECIFICATIONS             */}
                          {/* ============================================================ */}
                          {modelEditorSubTab === "specs" && (
                            <div className="space-y-6">
                              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-2xl p-4 space-y-1.5">
                                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                                  <FileText size={16} />
                                  <span>Automotive Specifications &amp; Technical Ledger</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  Configure all engineering parameters, ledger titles, footnotes, RTO badges, and custom battery technology narratives shown on the Model Details Page.
                                </p>
                              </div>

                              {/* LEDGER HEADER & FOOTNOTES */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block border-b border-slate-800 pb-2">
                                  Ledger Headings &amp; Badges
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Specifications Title</label>
                                    <input
                                      type="text"
                                      value={modelForm.specsTitle || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, specsTitle: e.target.value })}
                                      placeholder={`Full Technical Ledger • Volmo ${modelForm.name}`}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">RTO Exemption Badge Text</label>
                                    <input
                                      type="text"
                                      value={modelForm.rtoBadgeText || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, rtoBadgeText: e.target.value })}
                                      placeholder="RTO Exempt • No Driving License Needed"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:border-slate-600 font-medium"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Ledger Subtitle / Waterproofing Note</label>
                                    <input
                                      type="text"
                                      value={modelForm.specsSubtitle || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, specsSubtitle: e.target.value })}
                                      placeholder="All electrical nodes are heavily insulated, matching IP67 dust and splashproof parameters for confident wet-monsoon commuting."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Price Footnote Disclaimer</label>
                                    <input
                                      type="text"
                                      value={modelForm.priceDisclaimer || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, priceDisclaimer: e.target.value })}
                                      placeholder="* Excludes optional accessories. Gwalior showroom delivery."
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* UTILITY & PRACTICAL EQUIPMENT */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <span className="text-xs font-mono uppercase text-orange-400 font-bold block border-b border-slate-800 pb-2">
                                  Storage, Lighting &amp; Reverse Assist Utilities
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Boot / Luggage Trunk</label>
                                    <input
                                      type="text"
                                      value={modelForm.luggageTrunk || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, luggageTrunk: e.target.value })}
                                      placeholder="18-Litre dustproof modular under-seat storage"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Lighting Array</label>
                                    <input
                                      type="text"
                                      value={modelForm.lightingArray || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, lightingArray: e.target.value })}
                                      placeholder="Dual Beam High-flux LED Projectors + DRL"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[11px] text-slate-400 font-bold uppercase">Reverse Assist Engine</label>
                                    <input
                                      type="text"
                                      value={modelForm.assistEngine || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, assistEngine: e.target.value })}
                                      placeholder="3km/h Reverse Gear Drive controller with beep sound"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-slate-600"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* CORE POWERTRAIN & MECHANICAL SPECIFICATIONS */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <span className="text-xs font-mono uppercase text-cyan-400 font-bold block border-b border-slate-800 pb-2">
                                  Powertrain, Chassis &amp; Brakes
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Motor Details
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.motor}
                                      onChange={(e) => setModelForm({ ...modelForm, motor: e.target.value })}
                                      placeholder="e.g. 250W High-Efficiency BLDC Hub Motor"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Controller
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.controller}
                                      onChange={(e) => setModelForm({ ...modelForm, controller: e.target.value })}
                                      placeholder="e.g. Sine Wave Intelligent Waterproof Controller"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Ground Clearance
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.groundClearance}
                                      onChange={(e) => setModelForm({ ...modelForm, groundClearance: e.target.value })}
                                      placeholder="e.g. 165 mm"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Wheel &amp; Tyre Specs
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.wheelSize}
                                      onChange={(e) => setModelForm({ ...modelForm, wheelSize: e.target.value })}
                                      placeholder="e.g. 10-inch Tubeless Heavy-Duty Alloys"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Front Brake
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.frontBrake || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, frontBrake: e.target.value })}
                                      placeholder="Front Disc Brake"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Rear Brake
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.rearBrake || ""}
                                      onChange={(e) => setModelForm({ ...modelForm, rearBrake: e.target.value })}
                                      placeholder="Rear Drum Brake with Regenerative EBS"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>

                                  <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                      Warranty Statement
                                    </label>
                                    <input
                                      type="text"
                                      value={modelForm.warranty}
                                      onChange={(e) => setModelForm({ ...modelForm, warranty: e.target.value })}
                                      placeholder="e.g. 3 Years Comprehensive Battery & Motor Warranty"
                                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* BATTERY CHEMISTRY & CUSTOM NARRATIVES */}
                              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
                                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block border-b border-slate-800 pb-2">
                                  Battery Configurations &amp; Technical Descriptions
                                </span>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Battery Compatibility Overview
                                  </label>
                                  <input
                                    type="text"
                                    value={modelForm.batterySpecs}
                                    onChange={(e) => setModelForm({ ...modelForm, batterySpecs: e.target.value })}
                                    placeholder="e.g. 60V Lead-Acid & High-Density Smart Lithium-Ion"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Custom Lead-Acid Pack Description
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={modelForm.customLeadAcidDescription || ""}
                                    onChange={(e) => setModelForm({ ...modelForm, customLeadAcidDescription: e.target.value })}
                                    placeholder="Custom configured Lead-Acid setup holding a solid bank of 5 SLA batteries (generating 60V in series arrangement). Cheap to replace, highly durable, and heavily stable over Indian temperature spikes."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                                    Custom Lithium-Ion NMC Pack Description
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={modelForm.customLithiumDescription || ""}
                                    onChange={(e) => setModelForm({ ...modelForm, customLithiumDescription: e.target.value })}
                                    placeholder="Premium single-block high-density Grade-A NMC Lithium-Ion pack featuring a 48V/60V BMS board with temperature sensors. Up to 1,500 charging cycles, detachable compartment handles for indoor plug charge, and an ultra-light layout weight."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                                  />
                                </div>
                              </div>

                              {/* Back navigation */}
                              <div className="flex justify-start pt-2">
                                <button
                                  type="button"
                                  onClick={() => setModelEditorSubTab("cockpit")}
                                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                                >
                                  <ArrowLeft size={13} />
                                  <span>Back to Cockpit &amp; Studio Angles</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Form Submit Footer */}
                        <div className="sticky bottom-0 bg-slate-950/95 backdrop-blur-md p-4 -mx-6 -mb-6 border-t border-slate-800 flex items-center justify-between z-20 rounded-b-2xl">
                          <span className="text-[11px] text-slate-500 font-mono">
                            All edits update instantly and persist in local storage.
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setModelForm(null);
                                setEditingModelId(null);
                              }}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
                            >
                              <Save size={14} />
                              Save Scooter Model
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Tab 4: Pulse Project CMS (Upcoming EV Teaser) */}
                {activeTab === "pulse" && (
                  <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSavePulse} className="max-w-3xl mx-auto space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                      <div>
                        <h3 className="text-base font-black uppercase text-white tracking-tight flex items-center gap-2">
                          <Sparkles size={18} className="text-orange-400" />
                          Volmo Pulse Concept Teaser Customizer
                        </h3>
                        <p className="text-xs text-slate-400">
                          Customize the upcoming hyper-performance flagship teaser section on the homepage.
                        </p>
                      </div>

                      <ImageCustomizerField
                        label="Pulse Teaser Photo (Everphoto)"
                        value={pulseForm.image}
                        onChange={(url) => setPulseForm({ ...pulseForm, image: url })}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Project Name
                          </label>
                          <input
                            type="text"
                            required
                            value={pulseForm.name}
                            onChange={(e) => setPulseForm({ ...pulseForm, name: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-bold font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Tagline / Subheading
                          </label>
                          <input
                            type="text"
                            required
                            value={pulseForm.tagline}
                            onChange={(e) => setPulseForm({ ...pulseForm, tagline: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Top Pill Badge
                          </label>
                          <input
                            type="text"
                            value={sectionsForm.pulseBadge}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, pulseBadge: e.target.value })}
                            placeholder="Secret R&D Prototype"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Secret Prototype Code Tag
                          </label>
                          <input
                            type="text"
                            value={sectionsForm.pulseSecretCode}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, pulseSecretCode: e.target.value })}
                            placeholder="CODE: VOLMO-PULSE-2026"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-slate-600 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                          Teaser Description Paragraph
                        </label>
                        <textarea
                          rows={4}
                          value={pulseForm.description}
                          onChange={(e) => setPulseForm({ ...pulseForm, description: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-slate-600 leading-relaxed font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Pre-orders Counter Value
                          </label>
                          <input
                            type="text"
                            value={sectionsForm.pulseCustomerCount}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, pulseCustomerCount: e.target.value })}
                            placeholder="1,840+ Customers"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-600 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Pre-orders Metric Label
                          </label>
                          <input
                            type="text"
                            value={sectionsForm.pulseCustomerText}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, pulseCustomerText: e.target.value })}
                            placeholder="Already pre-registered for the release drop inbox."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-600"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={sectionsForm.pulseButtonText}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, pulseButtonText: e.target.value })}
                            placeholder="Notify Me first"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-slate-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-3 border-t border-slate-800">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-orange-600/20"
                        >
                          <Save size={14} />
                          Save Pulse Concept
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Tab 5: Features CMS */}
                {activeTab === "features" && (
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                      {/* Features Section Headlines & Sine Wave Banner Editor */}
                      <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={14} className="text-orange-400" />
                            Reliability Section Headlines &amp; Sine Wave Banner
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              updateSiteSections(sectionsForm);
                              showToast("Features section headings saved!");
                            }}
                            className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            <Save size={12} />
                            Save Headings
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              Top Pill Badge
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.featuresBadge}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, featuresBadge: e.target.value })}
                              placeholder="Engineered For Reliability"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              Main Section Heading
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.featuresHeading}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, featuresHeading: e.target.value })}
                              placeholder="Every Ride, Perfectly Powered"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Subtitle Paragraph
                          </label>
                          <textarea
                            rows={2}
                            value={sectionsForm.featuresSubtitle}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, featuresSubtitle: e.target.value })}
                            placeholder="Designed and assembled with automotive precision..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              Sine Wave Banner Badge
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.sineBadge}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineBadge: e.target.value })}
                              placeholder="Full Bumper Protection Guarantee"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              Sine Wave Heading
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.sineHeading}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineHeading: e.target.value })}
                              placeholder="Advanced Sine Wave Intelligence & Bumper 1-Year Warranty"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                              1-Year Warranty Box Title
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.sineWarrantyTitle}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineWarrantyTitle: e.target.value })}
                              placeholder="Bumper 1-Year Active Warranties"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-bold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                            Sine Wave Technical Description
                          </label>
                          <textarea
                            rows={2}
                            value={sectionsForm.sineDescription}
                            onChange={(e) => setSectionsForm({ ...sectionsForm, sineDescription: e.target.value })}
                            placeholder="Generic electric scooters use square-wave motor currents that result in jerky acceleration and noisy hums..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                              Highlight Box 1
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.sineCard1Title}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineCard1Title: e.target.value })}
                              placeholder="100% Silent"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                            />
                            <input
                              type="text"
                              value={sectionsForm.sineCard1Text}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineCard1Text: e.target.value })}
                              placeholder="Smooth harmonic waves prevent high-frequency engine whine."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                            />
                          </div>

                          <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                              Highlight Box 2
                            </label>
                            <input
                              type="text"
                              value={sectionsForm.sineCard2Title}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineCard2Title: e.target.value })}
                              placeholder="Regen Brakes"
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold"
                            />
                            <input
                              type="text"
                              value={sectionsForm.sineCard2Text}
                              onChange={(e) => setSectionsForm({ ...sectionsForm, sineCard2Text: e.target.value })}
                              placeholder="Converts braking inertial momentum directly into state of charge."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-white flex items-center gap-2">
                            <ShieldCheck size={16} className="text-orange-400" />
                            Highlight Features Bento Grid ({featuresForm.length})
                          </h3>
                          <p className="text-xs text-slate-400">
                            Customize headline features displayed in the "Engineered for Reliability" section.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const newFeat = {
                              name: "Smart Fast Charging",
                              description: "Rapid boost architecture achieving 80% charge in standard household sockets.",
                              icon: "BatteryCharging",
                            };
                            const updated = [...featuresForm, newFeat];
                            setFeaturesForm(updated);
                            updateCommonFeatures(updated);
                            showToast("Added new feature card.");
                          }}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus size={14} /> Add Feature Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featuresForm.map((feat, idx) => (
                          <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                                Feature Card #{idx + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <select
                                  value={feat.icon}
                                  onChange={(e) => {
                                    const updated = [...featuresForm];
                                    updated[idx].icon = e.target.value;
                                    setFeaturesForm(updated);
                                    updateCommonFeatures(updated);
                                  }}
                                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 font-mono focus:outline-none"
                                >
                                  {AVAILABLE_ICONS.map((ic) => (
                                    <option key={ic} value={ic}>
                                      Icon: {ic}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => {
                                    if (featuresForm.length <= 1) {
                                      alert("At least one feature card is required.");
                                      return;
                                    }
                                    const updated = featuresForm.filter((_, i) => i !== idx);
                                    setFeaturesForm(updated);
                                    updateCommonFeatures(updated);
                                    showToast("Feature card deleted.");
                                  }}
                                  className="p-1 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                                Card Headline
                              </label>
                              <input
                                type="text"
                                value={feat.name}
                                onChange={(e) => {
                                  const updated = [...featuresForm];
                                  updated[idx].name = e.target.value;
                                  setFeaturesForm(updated);
                                }}
                                onBlur={() => {
                                  updateCommonFeatures(featuresForm);
                                  showToast("Feature headline saved.");
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-slate-700"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                                Card Description
                              </label>
                              <textarea
                                rows={2}
                                value={feat.description}
                                onChange={(e) => {
                                  const updated = [...featuresForm];
                                  updated[idx].description = e.target.value;
                                  setFeaturesForm(updated);
                                }}
                                onBlur={() => {
                                  updateCommonFeatures(featuresForm);
                                  showToast("Feature description saved.");
                                }}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:border-slate-700 leading-relaxed font-sans"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Rider Reviews CMS */}
                {activeTab === "testimonials" && <TestimonialsCMS onShowToast={showToast} />}

                {/* Tab: Dealership Showrooms CMS */}
                {activeTab === "showrooms" && <ShowroomsCMS onShowToast={showToast} />}

                {/* Tab: FAQs & Support CMS */}
                {activeTab === "faq" && <FaqsCMS onShowToast={showToast} />}

                {/* Tab: Corporate, Branding & Logo CMS */}
                {activeTab === "contacts" && <BrandingCMS onShowToast={showToast} />}
              </div>
            )}

            {/* In-App Master Password Change Dialog */}
            {isChangingPasswordInApp && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-xl">
                        <KeyRound size={18} />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                        Change Password
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsChangingPasswordInApp(false)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <form onSubmit={handleChangePasswordInApp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPasswordInApp}
                        onChange={(e) => setCurrentPasswordInApp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPasswordInApp}
                        onChange={(e) => setNewPasswordInApp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPasswordInApp}
                        onChange={(e) => setConfirmPasswordInApp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    {inAppPassError && (
                      <p className="text-red-400 text-xs font-mono font-bold">{inAppPassError}</p>
                    )}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsChangingPasswordInApp(false)}
                        className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
