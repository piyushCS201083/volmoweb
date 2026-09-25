/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModelId = string;

export type BatteryType = "LA" | "LI";

export interface ModelColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ModelSpec {
  id: ModelId;
  name: string;
  tagline: string;
  speed: string;
  motor: string;
  controller: string;
  warranty: string;
  isRtoFree: boolean;
  colors: ModelColor[];
  image: string;
  basePriceEstimate: string;
  featured: boolean;
  frontBrake: string;
  rearBrake: string;
  groundClearance: string;
  wheelSize: string;
  batterySpecs: string;
  ridingModes: string[];

  // View Specifications (Ledger, Utilities, and Additional Details)
  specsTitle?: string;
  specsSubtitle?: string;
  luggageTrunk?: string;
  lightingArray?: string;
  assistEngine?: string;
  priceDisclaimer?: string;
  rtoBadgeText?: string;
  customLeadAcidDescription?: string;
  customLithiumDescription?: string;

  // Cockpit & Angles Studio (Photos, Telemetry & Headlamp)
  // Angle 1: Side Profile
  sideAngleLabel?: string;
  sideAngleDesc?: string;
  sideImage?: string;

  // Angle 2: Front Headlamp
  frontAngleLabel?: string;
  frontAngleDesc?: string;
  frontImage?: string;
  frontTitle?: string;
  frontDescription?: string;

  // Angle 3: Cockpit / Interactive Telemetry Console
  dashboardAngleLabel?: string;
  dashboardAngleDesc?: string;
  dashboardImage?: string;
  dashboardTitle?: string;
  dashboardSubtitle?: string;
  dashboardOdometer?: string;
  dashboardTrip?: string;
  dashboardMaxSpeed?: number;

  // Angle 4: Chassis & Mechanical
  chassisAngleLabel?: string;
  chassisAngleDesc?: string;
  chassisImage?: string;
  chassisBadge?: string;
  frontSuspension?: string;
  rearSuspension?: string;
  bldcRotor?: string;
  chassisDisclaimer?: string;
}

export interface PriceInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  model: string;
  color: string;
  batteryType: BatteryType;
  batteryConfig: string;
  rangeKm: number;
  message?: string;
  status: "new" | "contacted" | "completed";
  createdAt: string;
}

export interface DealershipApp {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  experience: string;
  pastBusiness: string;
  investmentRange: string;
  message?: string;
  status: "applied" | "reviewing" | "approved" | "rejected";
  createdAt: string;
}

export interface AccessoryItem {
  id: string;
  category: "protection" | "merchandise" | "helmet";
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  warranty: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  image: string;
  inStock: boolean;
}

export interface LeadAcidBatteryItem {
  id: string;
  title: string;
  voltageRating: string;
  capacity: string;
  warranty: string; // "1 Year Hassle-Free Warranty"
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  image: string;
  badge: string;
}

export interface LithiumLfpBatteryModel {
  id: string;
  title: string;
  voltage: string;
  capacity: string;
  powerKw: string;
  mileageKm: string;
  chemistry: "Lithium-Ion" | "LFP (Lithium Iron Phosphate)";
  warranty: string; // "3 Years Long Official Warranty"
  description: string;
  specs: { label: string; value: string }[];
  features: string[];
  image: string;
  highlightBadge: string;
}

export interface ChargerModelItem {
  id: string;
  type: "lead-acid" | "lithium" | "lfp";
  typeLabel: string;
  modelCode: string;
  voltage: string;
  amperage: string;
  cutoffVoltage?: string;
  warranty: string; // "1 Year Hassle-Free Warranty"
  description: string;
  compatibility: string;
  specs: { label: string; value: string }[];
  features: string[];
  image: string;
  badge: string;
}

export interface AccessoriesPageConfig {
  heroBadge: string;
  heroTitlePart1: string;
  heroTitlePart2: string;
  heroSubtitle: string;
  metrics: {
    title: string;
    subtitle: string;
  }[];
  powerBannerBadge: string;
  powerBannerTitle: string;
  powerBannerDescription: string;
  powerBannerButtonText: string;
}

export interface BatteryChargerPageConfig {
  heroBadge: string;
  heroTitlePart1: string;
  heroTitlePart2: string;
  heroSubtitle: string;
  metrics: {
    label: string;
    value: string;
    subtitle: string;
  }[];
  // Section 1: Lead Acid Graphene
  grapheneSectionBadge: string;
  grapheneSectionTitle: string;
  grapheneSectionSubtitle: string;
  grapheneSpotlightTitle: string;
  grapheneSpotlightSubtitle: string;
  grapheneSpotlightImage: string;
  grapheneSpotlightBadge: string;
  // Section 2: Lithium & LFP
  lithiumSectionBadge: string;
  lithiumSectionTitle: string;
  lithiumSectionSubtitle: string;
  lithiumSpotlightTitle: string;
  lithiumSpotlightSubtitle: string;
  lithiumSpotlightImage: string;
  lithiumSpotlightBadge: string;
  // Section 3: Chargers
  chargerSectionBadge: string;
  chargerSectionTitle: string;
  chargerSectionSubtitle: string;
  chargerSpotlightTitle: string;
  chargerSpotlightSubtitle: string;
  chargerSpotlightImage: string;
  chargerSpotlightBadge: string;
  // Bottom Consultation CTA
  consultationBadge: string;
  consultationTitle: string;
  consultationSubtitle: string;
  consultationButtonText: string;
}

export interface CareerOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  summary: string;
  keySkills: string[];
  responsibilities: string[];
  badge?: string;
}

export interface CareerApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  experienceYears: string;
  currentRole?: string;
  linkedinUrl?: string;
  coverNote: string;
  status: "applied" | "reviewing" | "contacted" | "rejected";
  createdAt: string;
}

export interface MediaArticle {
  id: string;
  category: "News" | "Press Release" | "Tech Blog" | "Event";
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  image: string;
  tag: string;
}

export interface CompanyPhoto {
  id: string;
  title: string;
  caption: string;
  category: "Manufacturing" | "Showroom" | "Delivery" | "Testing";
  imageUrl: string;
  date: string;
}

export interface CompanyVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl?: string;
  category: "Engineering" | "Road Test" | "Walkaround";
}

export interface MediaBlogsPageConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  calculatorBadge: string;
  calculatorTitle: string;
  calculatorSubtitle: string;
  volmoCostPerKm: number;
  defaultDailyKm: number;
  defaultPetrolPrice: number;
  defaultPetrolMileage: number;
  defaultElecRate: number;
  annualMaintenanceSaved: number;
  careersBadge: string;
  careersTitle: string;
  careersSubtitle: string;
}

