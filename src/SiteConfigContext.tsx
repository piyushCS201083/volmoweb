/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./services/api";
import {
  ModelSpec,
  BatteryType,
  AccessoryItem,
  LeadAcidBatteryItem,
  LithiumLfpBatteryModel,
  ChargerModelItem,
  AccessoriesPageConfig,
  BatteryChargerPageConfig,
  MediaArticle,
  CompanyPhoto,
  CompanyVideo,
  CareerOpening,
  MediaBlogsPageConfig,
} from "./types";
import {
  MODELS_DATA,
  PULSE_DATA,
  COMMON_FEATURES,
  CONTACT_INFO,
  DEFAULT_HERO_CONFIG,
  DEFAULT_TESTIMONIALS,
  DEFAULT_FAQS,
  DEFAULT_SHOWROOMS,
  DEFAULT_BRANDING,
  DEFAULT_SITE_SECTIONS,
  DEFAULT_ACCESSORIES,
  LEAD_ACID_GRAPHENE_BATTERIES,
  LITHIUM_LFP_BATTERY_MODELS,
  CHARGER_MODELS,
  DEFAULT_ACCESSORIES_PAGE_CONFIG,
  DEFAULT_BATTERY_CHARGER_PAGE_CONFIG,
  HeroConfig,
  TestimonialItem,
  FAQItem,
  ShowroomItem,
  BrandingConfig,
  SiteSectionsConfig,
} from "./data";
import {
  MEDIA_ARTICLES,
  COMPANY_PHOTOS,
  COMPANY_VIDEOS,
  CAREER_OPENINGS,
  DEFAULT_MEDIA_BLOGS_PAGE_CONFIG,
} from "./data/mediaBlogsData";

export interface CustomPulseData {
  id: string;
  name: string;
  tagline: string;
  image: string;
  description: string;
  isReleased: boolean;
}

export interface CustomFeature {
  name: string;
  description: string;
  icon: string;
}

export interface CustomContactInfo {
  email: string;
  phone: string;
  factoryAddress: string;
  headOfficeAddress: string;
}

interface SiteConfigContextType {
  modelsData: ModelSpec[];
  pulseData: CustomPulseData;
  commonFeatures: CustomFeature[];
  contactInfo: CustomContactInfo;
  heroConfig: HeroConfig;
  testimonialsData: TestimonialItem[];
  faqsData: FAQItem[];
  showroomsData: ShowroomItem[];
  brandingConfig: BrandingConfig;
  siteSections: SiteSectionsConfig;
  accessoriesData: AccessoryItem[];
  leadAcidBatteriesData: LeadAcidBatteryItem[];
  lithiumBatteriesData: LithiumLfpBatteryModel[];
  chargersData: ChargerModelItem[];
  accessoriesPageConfig: AccessoriesPageConfig;
  batteryChargerPageConfig: BatteryChargerPageConfig;
  mediaArticlesData: MediaArticle[];
  companyPhotosData: CompanyPhoto[];
  companyVideosData: CompanyVideo[];
  careerOpeningsData: CareerOpening[];
  mediaBlogsPageConfig: MediaBlogsPageConfig;

  // Actions
  updateModelSpec: (id: string, updatedSpec: Partial<ModelSpec>) => void;
  addModelSpec: (newModel: ModelSpec) => void;
  deleteModelSpec: (id: string) => void;
  saveAllModels: (models: ModelSpec[]) => void;
  updatePulseData: (updatedPulse: Partial<CustomPulseData>) => void;
  updateCommonFeatures: (updatedFeatures: CustomFeature[]) => void;
  updateContactInfo: (updatedContact: CustomContactInfo) => void;
  updateHeroConfig: (updatedHero: Partial<HeroConfig>) => void;
  updateTestimonialsData: (items: TestimonialItem[]) => void;
  updateSingleTestimonial: (id: number, item: Partial<TestimonialItem>) => void;
  addTestimonial: (item: TestimonialItem) => void;
  deleteTestimonial: (id: number) => void;
  updateFaqsData: (items: FAQItem[]) => void;
  updateSingleFaq: (id: number, item: Partial<FAQItem>) => void;
  addFaq: (item: FAQItem) => void;
  deleteFaq: (id: number) => void;
  updateShowroomsData: (items: ShowroomItem[]) => void;
  updateSingleShowroom: (id: string, item: Partial<ShowroomItem>) => void;
  addShowroom: (item: ShowroomItem) => void;
  deleteShowroom: (id: string) => void;
  updateBrandingConfig: (updated: Partial<BrandingConfig>) => void;
  updateSiteSections: (updated: Partial<SiteSectionsConfig>) => void;
  updateAccessoriesPageConfig: (updated: Partial<AccessoriesPageConfig>) => void;
  updateBatteryChargerPageConfig: (updated: Partial<BatteryChargerPageConfig>) => void;
  updateMediaBlogsPageConfig: (updated: Partial<MediaBlogsPageConfig>) => void;

  // Media Articles Actions
  updateMediaArticles: (items: MediaArticle[]) => void;
  updateSingleMediaArticle: (id: string, item: Partial<MediaArticle>) => void;
  addMediaArticle: (item: MediaArticle) => void;
  deleteMediaArticle: (id: string) => void;

  // Company Photos Actions
  updateCompanyPhotos: (items: CompanyPhoto[]) => void;
  updateSingleCompanyPhoto: (id: string, item: Partial<CompanyPhoto>) => void;
  addCompanyPhoto: (item: CompanyPhoto) => void;
  deleteCompanyPhoto: (id: string) => void;

  // Company Videos Actions
  updateCompanyVideos: (items: CompanyVideo[]) => void;
  updateSingleCompanyVideo: (id: string, item: Partial<CompanyVideo>) => void;
  addCompanyVideo: (item: CompanyVideo) => void;
  deleteCompanyVideo: (id: string) => void;

  // Career Openings Actions
  updateCareerOpenings: (items: CareerOpening[]) => void;
  updateSingleCareerOpening: (id: string, item: Partial<CareerOpening>) => void;
  addCareerOpening: (item: CareerOpening) => void;
  deleteCareerOpening: (id: string) => void;

  // Accessories Actions
  updateAccessoriesData: (items: AccessoryItem[]) => void;
  updateSingleAccessory: (id: string, item: Partial<AccessoryItem>) => void;
  addAccessory: (item: AccessoryItem) => void;
  deleteAccessory: (id: string) => void;

  // Lead Acid Graphene Battery Actions
  updateLeadAcidBatteries: (items: LeadAcidBatteryItem[]) => void;
  updateSingleLeadAcidBattery: (id: string, item: Partial<LeadAcidBatteryItem>) => void;
  addLeadAcidBattery: (item: LeadAcidBatteryItem) => void;
  deleteLeadAcidBattery: (id: string) => void;

  // Lithium & LFP Battery Actions
  updateLithiumBatteries: (items: LithiumLfpBatteryModel[]) => void;
  updateSingleLithiumBattery: (id: string, item: Partial<LithiumLfpBatteryModel>) => void;
  addLithiumBattery: (item: LithiumLfpBatteryModel) => void;
  deleteLithiumBattery: (id: string) => void;

  // Charger Actions
  updateChargers: (items: ChargerModelItem[]) => void;
  updateSingleCharger: (id: string, item: Partial<ChargerModelItem>) => void;
  addCharger: (item: ChargerModelItem) => void;
  deleteCharger: (id: string) => void;

  resetAllToDefault: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [modelsData, setModelsData] = useState<ModelSpec[]>([]);
  const [pulseData, setPulseData] = useState<CustomPulseData>({} as CustomPulseData);
  const [commonFeatures, setCommonFeatures] = useState<CustomFeature[]>([]);
  const [contactInfo, setContactInfo] = useState<CustomContactInfo>({} as CustomContactInfo);
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [testimonialsData, setTestimonialsData] = useState<TestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [faqsData, setFaqsData] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [showroomsData, setShowroomsData] = useState<ShowroomItem[]>(DEFAULT_SHOWROOMS);
  const [brandingConfig, setBrandingConfig] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [siteSections, setSiteSections] = useState<SiteSectionsConfig>(DEFAULT_SITE_SECTIONS);
  const [accessoriesData, setAccessoriesData] = useState<AccessoryItem[]>(DEFAULT_ACCESSORIES);
  const [leadAcidBatteriesData, setLeadAcidBatteriesData] = useState<LeadAcidBatteryItem[]>(LEAD_ACID_GRAPHENE_BATTERIES);
  const [lithiumBatteriesData, setLithiumBatteriesData] = useState<LithiumLfpBatteryModel[]>(LITHIUM_LFP_BATTERY_MODELS);
  const [chargersData, setChargersData] = useState<ChargerModelItem[]>(CHARGER_MODELS);
  const [accessoriesPageConfig, setAccessoriesPageConfig] = useState<AccessoriesPageConfig>(DEFAULT_ACCESSORIES_PAGE_CONFIG);
  const [batteryChargerPageConfig, setBatteryChargerPageConfig] = useState<BatteryChargerPageConfig>(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);
  const [mediaArticlesData, setMediaArticlesData] = useState<MediaArticle[]>(MEDIA_ARTICLES);
  const [companyPhotosData, setCompanyPhotosData] = useState<CompanyPhoto[]>(COMPANY_PHOTOS);
  const [companyVideosData, setCompanyVideosData] = useState<CompanyVideo[]>(COMPANY_VIDEOS);
  const [careerOpeningsData, setCareerOpeningsData] = useState<CareerOpening[]>(CAREER_OPENINGS);
  const [mediaBlogsPageConfig, setMediaBlogsPageConfig] = useState<MediaBlogsPageConfig>(DEFAULT_MEDIA_BLOGS_PAGE_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage or static defaults
  useEffect(() => {
    try {
      const storedModels = localStorage.getItem("volmo_custom_models");
      const storedPulse = localStorage.getItem("volmo_custom_pulse");
      const storedFeatures = localStorage.getItem("volmo_custom_features");
      const storedContact = localStorage.getItem("volmo_custom_contact");
      const storedHero = localStorage.getItem("volmo_custom_hero");
      const storedTestimonials = localStorage.getItem("volmo_custom_testimonials");
      const storedFaqs = localStorage.getItem("volmo_custom_faqs");
      const storedShowrooms = localStorage.getItem("volmo_custom_showrooms");
      const storedBranding = localStorage.getItem("volmo_custom_branding");
      const storedSiteSections = localStorage.getItem("volmo_custom_site_sections");
      const storedAccessories = localStorage.getItem("volmo_custom_accessories");
      const storedLeadAcid = localStorage.getItem("volmo_custom_graphene_batteries");
      const storedLithium = localStorage.getItem("volmo_custom_lithium_batteries");
      const storedChargers = localStorage.getItem("volmo_custom_chargers");
      const storedAccPage = localStorage.getItem("volmo_custom_accessories_page");
      const storedBatPage = localStorage.getItem("volmo_custom_batterycharger_page");
      const storedArticles = localStorage.getItem("volmo_media_articles");
      const storedPhotos = localStorage.getItem("volmo_company_photos");
      const storedVideos = localStorage.getItem("volmo_company_videos");
      const storedCareers = localStorage.getItem("volmo_career_openings");
      const storedMediaPage = localStorage.getItem("volmo_mediablogs_page");

      if (storedModels) {
        const parsed: ModelSpec[] = JSON.parse(storedModels);
        const migrated = parsed.map((m) => {
          const defaultModel = MODELS_DATA.find((dm) => dm.id === m.id);
          if (!defaultModel) return m;
          const updatedColors = m.colors.map((c) => {
            const defColor = defaultModel.colors.find(
              (dc) => dc.name.toLowerCase().trim() === c.name.toLowerCase().trim()
            );
            return {
              ...c,
              image: c.image || defColor?.image || "",
            };
          });
          return {
            ...m,
            colors: updatedColors,
          };
        });
        setModelsData(migrated);
        localStorage.setItem("volmo_custom_models", JSON.stringify(migrated));
      } else {
        setModelsData(MODELS_DATA);
      }

      if (storedPulse) setPulseData(JSON.parse(storedPulse));
      else setPulseData(PULSE_DATA);

      if (storedFeatures) setCommonFeatures(JSON.parse(storedFeatures));
      else setCommonFeatures(COMMON_FEATURES);

      if (storedContact) setContactInfo(JSON.parse(storedContact));
      else setContactInfo(CONTACT_INFO);

      if (storedHero) setHeroConfig(JSON.parse(storedHero));
      else setHeroConfig(DEFAULT_HERO_CONFIG);

      if (storedTestimonials) setTestimonialsData(JSON.parse(storedTestimonials));
      else setTestimonialsData(DEFAULT_TESTIMONIALS);

      if (storedFaqs) setFaqsData(JSON.parse(storedFaqs));
      else setFaqsData(DEFAULT_FAQS);

      if (storedShowrooms) setShowroomsData(JSON.parse(storedShowrooms));
      else setShowroomsData(DEFAULT_SHOWROOMS);

      if (storedBranding) setBrandingConfig(JSON.parse(storedBranding));
      else setBrandingConfig(DEFAULT_BRANDING);

      if (storedSiteSections) {
        setSiteSections({ ...DEFAULT_SITE_SECTIONS, ...JSON.parse(storedSiteSections) });
      } else {
        setSiteSections(DEFAULT_SITE_SECTIONS);
      }

      if (storedAccessories) setAccessoriesData(JSON.parse(storedAccessories));
      else setAccessoriesData(DEFAULT_ACCESSORIES);

      if (storedLeadAcid) setLeadAcidBatteriesData(JSON.parse(storedLeadAcid));
      else setLeadAcidBatteriesData(LEAD_ACID_GRAPHENE_BATTERIES);

      if (storedLithium) setLithiumBatteriesData(JSON.parse(storedLithium));
      else setLithiumBatteriesData(LITHIUM_LFP_BATTERY_MODELS);

      if (storedChargers) setChargersData(JSON.parse(storedChargers));
      else setChargersData(CHARGER_MODELS);

      if (storedAccPage) setAccessoriesPageConfig({ ...DEFAULT_ACCESSORIES_PAGE_CONFIG, ...JSON.parse(storedAccPage) });
      else setAccessoriesPageConfig(DEFAULT_ACCESSORIES_PAGE_CONFIG);

      if (storedBatPage) setBatteryChargerPageConfig({ ...DEFAULT_BATTERY_CHARGER_PAGE_CONFIG, ...JSON.parse(storedBatPage) });
      else setBatteryChargerPageConfig(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);

      if (storedArticles) setMediaArticlesData(JSON.parse(storedArticles));
      else setMediaArticlesData(MEDIA_ARTICLES);

      if (storedPhotos) setCompanyPhotosData(JSON.parse(storedPhotos));
      else setCompanyPhotosData(COMPANY_PHOTOS);

      if (storedVideos) setCompanyVideosData(JSON.parse(storedVideos));
      else setCompanyVideosData(COMPANY_VIDEOS);

      if (storedCareers) setCareerOpeningsData(JSON.parse(storedCareers));
      else setCareerOpeningsData(CAREER_OPENINGS);

      if (storedMediaPage) setMediaBlogsPageConfig({ ...DEFAULT_MEDIA_BLOGS_PAGE_CONFIG, ...JSON.parse(storedMediaPage) });
      else setMediaBlogsPageConfig(DEFAULT_MEDIA_BLOGS_PAGE_CONFIG);
    } catch (e) {
      console.error("Failed to load custom site configuration, using defaults", e);
      setModelsData(MODELS_DATA);
      setPulseData(PULSE_DATA);
      setCommonFeatures(COMMON_FEATURES);
      setContactInfo(CONTACT_INFO);
      setHeroConfig(DEFAULT_HERO_CONFIG);
      setTestimonialsData(DEFAULT_TESTIMONIALS);
      setFaqsData(DEFAULT_FAQS);
      setShowroomsData(DEFAULT_SHOWROOMS);
      setBrandingConfig(DEFAULT_BRANDING);
      setSiteSections(DEFAULT_SITE_SECTIONS);
      setAccessoriesData(DEFAULT_ACCESSORIES);
      setLeadAcidBatteriesData(LEAD_ACID_GRAPHENE_BATTERIES);
      setLithiumBatteriesData(LITHIUM_LFP_BATTERY_MODELS);
      setChargersData(CHARGER_MODELS);
      setAccessoriesPageConfig(DEFAULT_ACCESSORIES_PAGE_CONFIG);
      setBatteryChargerPageConfig(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);
      setMediaArticlesData(MEDIA_ARTICLES);
      setCompanyPhotosData(COMPANY_PHOTOS);
      setCompanyVideosData(COMPANY_VIDEOS);
      setCareerOpeningsData(CAREER_OPENINGS);
      setMediaBlogsPageConfig(DEFAULT_MEDIA_BLOGS_PAGE_CONFIG);
    }
    setIsLoaded(true);

    // Asynchronous Real-time Backend Synchronization: Fetch latest state from backend server
    api.config
      .getConfig()
      .then((serverConfig) => {
        if (serverConfig) {
          if (serverConfig.models) {
            setModelsData(serverConfig.models);
            localStorage.setItem("volmo_custom_models", JSON.stringify(serverConfig.models));
          }
          if (serverConfig.pulse) {
            setPulseData(serverConfig.pulse);
            localStorage.setItem("volmo_custom_pulse", JSON.stringify(serverConfig.pulse));
          }
          if (serverConfig.features) {
            setCommonFeatures(serverConfig.features);
            localStorage.setItem("volmo_custom_features", JSON.stringify(serverConfig.features));
          }
          if (serverConfig.contact) {
            setContactInfo(serverConfig.contact);
            localStorage.setItem("volmo_custom_contact", JSON.stringify(serverConfig.contact));
          }
          if (serverConfig.hero) {
            setHeroConfig(serverConfig.hero);
            localStorage.setItem("volmo_custom_hero", JSON.stringify(serverConfig.hero));
          }
          if (serverConfig.testimonials) {
            setTestimonialsData(serverConfig.testimonials);
            localStorage.setItem("volmo_custom_testimonials", JSON.stringify(serverConfig.testimonials));
          }
          if (serverConfig.faqs) {
            setFaqsData(serverConfig.faqs);
            localStorage.setItem("volmo_custom_faqs", JSON.stringify(serverConfig.faqs));
          }
          if (serverConfig.showrooms) {
            setShowroomsData(serverConfig.showrooms);
            localStorage.setItem("volmo_custom_showrooms", JSON.stringify(serverConfig.showrooms));
          }
          if (serverConfig.branding) {
            setBrandingConfig(serverConfig.branding);
            localStorage.setItem("volmo_custom_branding", JSON.stringify(serverConfig.branding));
          }
          if (serverConfig.sections) {
            setSiteSections(serverConfig.sections);
            localStorage.setItem("volmo_custom_site_sections", JSON.stringify(serverConfig.sections));
          }
          if (serverConfig.accessories) {
            setAccessoriesData(serverConfig.accessories);
            localStorage.setItem("volmo_custom_accessories", JSON.stringify(serverConfig.accessories));
          }
          if (serverConfig.leadAcidBatteries) {
            setLeadAcidBatteriesData(serverConfig.leadAcidBatteries);
            localStorage.setItem("volmo_custom_graphene_batteries", JSON.stringify(serverConfig.leadAcidBatteries));
          }
          if (serverConfig.lithiumBatteries) {
            setLithiumBatteriesData(serverConfig.lithiumBatteries);
            localStorage.setItem("volmo_custom_lithium_batteries", JSON.stringify(serverConfig.lithiumBatteries));
          }
          if (serverConfig.chargers) {
            setChargersData(serverConfig.chargers);
            localStorage.setItem("volmo_custom_chargers", JSON.stringify(serverConfig.chargers));
          }
          if (serverConfig.accessoriesPage) {
            setAccessoriesPageConfig(serverConfig.accessoriesPage);
            localStorage.setItem("volmo_custom_accessories_page", JSON.stringify(serverConfig.accessoriesPage));
          }
          if (serverConfig.batteryChargerPage) {
            setBatteryChargerPageConfig(serverConfig.batteryChargerPage);
            localStorage.setItem("volmo_custom_batterycharger_page", JSON.stringify(serverConfig.batteryChargerPage));
          }
        }
      })
      .catch((err) => {
        console.info("[Volmo] Connected to local cache (Backend sync pending):", err.message);
      });
  }, []);

  const syncSectionToBackend = (section: string, data: any) => {
    api.config.updateSection(section, data).catch((err) => {
      console.warn(`[Volmo] Backend sync for '${section}':`, err.message);
    });
  };

  const updateModelSpec = (id: string, updatedSpec: Partial<ModelSpec>) => {
    setModelsData((prev) => {
      const updated = prev.map((model) => {
        if (model.id === id) {
          return { ...model, ...updatedSpec };
        }
        return model;
      });
      localStorage.setItem("volmo_custom_models", JSON.stringify(updated));
      syncSectionToBackend("models", updated);
      return updated;
    });
  };

  const addModelSpec = (newModel: ModelSpec) => {
    setModelsData((prev) => {
      const updated = [...prev, newModel];
      localStorage.setItem("volmo_custom_models", JSON.stringify(updated));
      syncSectionToBackend("models", updated);
      return updated;
    });
  };

  const deleteModelSpec = (id: string) => {
    setModelsData((prev) => {
      const updated = prev.filter((model) => model.id !== id);
      localStorage.setItem("volmo_custom_models", JSON.stringify(updated));
      syncSectionToBackend("models", updated);
      return updated;
    });
  };

  const saveAllModels = (models: ModelSpec[]) => {
    setModelsData(models);
    localStorage.setItem("volmo_custom_models", JSON.stringify(models));
    syncSectionToBackend("models", models);
  };

  const updatePulseData = (updatedPulse: Partial<CustomPulseData>) => {
    setPulseData((prev) => {
      const updated = { ...prev, ...updatedPulse };
      localStorage.setItem("volmo_custom_pulse", JSON.stringify(updated));
      syncSectionToBackend("pulse", updated);
      return updated;
    });
  };

  const updateCommonFeatures = (updatedFeatures: CustomFeature[]) => {
    setCommonFeatures(updatedFeatures);
    localStorage.setItem("volmo_custom_features", JSON.stringify(updatedFeatures));
    syncSectionToBackend("features", updatedFeatures);
  };

  const updateContactInfo = (updatedContact: CustomContactInfo) => {
    setContactInfo(updatedContact);
    localStorage.setItem("volmo_custom_contact", JSON.stringify(updatedContact));
    syncSectionToBackend("contact", updatedContact);
  };

  const updateHeroConfig = (updatedHero: Partial<HeroConfig>) => {
    setHeroConfig((prev) => {
      const updated = { ...prev, ...updatedHero };
      localStorage.setItem("volmo_custom_hero", JSON.stringify(updated));
      syncSectionToBackend("hero", updated);
      return updated;
    });
  };

  const updateTestimonialsData = (items: TestimonialItem[]) => {
    setTestimonialsData(items);
    localStorage.setItem("volmo_custom_testimonials", JSON.stringify(items));
    syncSectionToBackend("testimonials", items);
  };

  const updateSingleTestimonial = (id: number, item: Partial<TestimonialItem>) => {
    setTestimonialsData((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...item } : t));
      localStorage.setItem("volmo_custom_testimonials", JSON.stringify(updated));
      syncSectionToBackend("testimonials", updated);
      return updated;
    });
  };

  const addTestimonial = (item: TestimonialItem) => {
    setTestimonialsData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_testimonials", JSON.stringify(updated));
      syncSectionToBackend("testimonials", updated);
      return updated;
    });
  };

  const deleteTestimonial = (id: number) => {
    setTestimonialsData((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem("volmo_custom_testimonials", JSON.stringify(updated));
      syncSectionToBackend("testimonials", updated);
      return updated;
    });
  };

  const updateFaqsData = (items: FAQItem[]) => {
    setFaqsData(items);
    localStorage.setItem("volmo_custom_faqs", JSON.stringify(items));
    syncSectionToBackend("faqs", items);
  };

  const updateSingleFaq = (id: number, item: Partial<FAQItem>) => {
    setFaqsData((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...item } : f));
      localStorage.setItem("volmo_custom_faqs", JSON.stringify(updated));
      syncSectionToBackend("faqs", updated);
      return updated;
    });
  };

  const addFaq = (item: FAQItem) => {
    setFaqsData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_faqs", JSON.stringify(updated));
      syncSectionToBackend("faqs", updated);
      return updated;
    });
  };

  const deleteFaq = (id: number) => {
    setFaqsData((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem("volmo_custom_faqs", JSON.stringify(updated));
      syncSectionToBackend("faqs", updated);
      return updated;
    });
  };

  const updateShowroomsData = (items: ShowroomItem[]) => {
    setShowroomsData(items);
    localStorage.setItem("volmo_custom_showrooms", JSON.stringify(items));
    syncSectionToBackend("showrooms", items);
  };

  const updateSingleShowroom = (id: string, item: Partial<ShowroomItem>) => {
    setShowroomsData((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...item } : s));
      localStorage.setItem("volmo_custom_showrooms", JSON.stringify(updated));
      syncSectionToBackend("showrooms", updated);
      return updated;
    });
  };

  const addShowroom = (item: ShowroomItem) => {
    setShowroomsData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_showrooms", JSON.stringify(updated));
      syncSectionToBackend("showrooms", updated);
      return updated;
    });
  };

  const deleteShowroom = (id: string) => {
    setShowroomsData((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem("volmo_custom_showrooms", JSON.stringify(updated));
      syncSectionToBackend("showrooms", updated);
      return updated;
    });
  };

  const updateBrandingConfig = (updated: Partial<BrandingConfig>) => {
    setBrandingConfig((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("volmo_custom_branding", JSON.stringify(next));
      syncSectionToBackend("branding", next);
      return next;
    });
  };

  const updateSiteSections = (updated: Partial<SiteSectionsConfig>) => {
    setSiteSections((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("volmo_custom_site_sections", JSON.stringify(next));
      syncSectionToBackend("sections", next);
      return next;
    });
  };

  // Accessories Actions
  const updateAccessoriesData = (items: AccessoryItem[]) => {
    setAccessoriesData(items);
    localStorage.setItem("volmo_custom_accessories", JSON.stringify(items));
    syncSectionToBackend("accessories", items);
  };

  const updateSingleAccessory = (id: string, item: Partial<AccessoryItem>) => {
    setAccessoriesData((prev) => {
      const updated = prev.map((acc) => (acc.id === id ? { ...acc, ...item } : acc));
      localStorage.setItem("volmo_custom_accessories", JSON.stringify(updated));
      syncSectionToBackend("accessories", updated);
      return updated;
    });
  };

  const addAccessory = (item: AccessoryItem) => {
    setAccessoriesData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_accessories", JSON.stringify(updated));
      syncSectionToBackend("accessories", updated);
      return updated;
    });
  };

  const deleteAccessory = (id: string) => {
    setAccessoriesData((prev) => {
      const updated = prev.filter((acc) => acc.id !== id);
      localStorage.setItem("volmo_custom_accessories", JSON.stringify(updated));
      syncSectionToBackend("accessories", updated);
      return updated;
    });
  };

  // Lead-Acid Graphene Battery Actions
  const updateLeadAcidBatteries = (items: LeadAcidBatteryItem[]) => {
    setLeadAcidBatteriesData(items);
    localStorage.setItem("volmo_custom_graphene_batteries", JSON.stringify(items));
    syncSectionToBackend("leadAcidBatteries", items);
  };

  const updateSingleLeadAcidBattery = (id: string, item: Partial<LeadAcidBatteryItem>) => {
    setLeadAcidBatteriesData((prev) => {
      const updated = prev.map((bat) => (bat.id === id ? { ...bat, ...item } : bat));
      localStorage.setItem("volmo_custom_graphene_batteries", JSON.stringify(updated));
      syncSectionToBackend("leadAcidBatteries", updated);
      return updated;
    });
  };

  const addLeadAcidBattery = (item: LeadAcidBatteryItem) => {
    setLeadAcidBatteriesData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_graphene_batteries", JSON.stringify(updated));
      syncSectionToBackend("leadAcidBatteries", updated);
      return updated;
    });
  };

  const deleteLeadAcidBattery = (id: string) => {
    setLeadAcidBatteriesData((prev) => {
      const updated = prev.filter((bat) => bat.id !== id);
      localStorage.setItem("volmo_custom_graphene_batteries", JSON.stringify(updated));
      syncSectionToBackend("leadAcidBatteries", updated);
      return updated;
    });
  };

  // Lithium & LFP Battery Actions
  const updateLithiumBatteries = (items: LithiumLfpBatteryModel[]) => {
    setLithiumBatteriesData(items);
    localStorage.setItem("volmo_custom_lithium_batteries", JSON.stringify(items));
    syncSectionToBackend("lithiumBatteries", items);
  };

  const updateSingleLithiumBattery = (id: string, item: Partial<LithiumLfpBatteryModel>) => {
    setLithiumBatteriesData((prev) => {
      const updated = prev.map((bat) => (bat.id === id ? { ...bat, ...item } : bat));
      localStorage.setItem("volmo_custom_lithium_batteries", JSON.stringify(updated));
      syncSectionToBackend("lithiumBatteries", updated);
      return updated;
    });
  };

  const addLithiumBattery = (item: LithiumLfpBatteryModel) => {
    setLithiumBatteriesData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_lithium_batteries", JSON.stringify(updated));
      syncSectionToBackend("lithiumBatteries", updated);
      return updated;
    });
  };

  const deleteLithiumBattery = (id: string) => {
    setLithiumBatteriesData((prev) => {
      const updated = prev.filter((bat) => bat.id !== id);
      localStorage.setItem("volmo_custom_lithium_batteries", JSON.stringify(updated));
      syncSectionToBackend("lithiumBatteries", updated);
      return updated;
    });
  };

  // Charger Actions
  const updateChargers = (items: ChargerModelItem[]) => {
    setChargersData(items);
    localStorage.setItem("volmo_custom_chargers", JSON.stringify(items));
    syncSectionToBackend("chargers", items);
  };

  const updateSingleCharger = (id: string, item: Partial<ChargerModelItem>) => {
    setChargersData((prev) => {
      const updated = prev.map((chg) => (chg.id === id ? { ...chg, ...item } : chg));
      localStorage.setItem("volmo_custom_chargers", JSON.stringify(updated));
      syncSectionToBackend("chargers", updated);
      return updated;
    });
  };

  const addCharger = (item: ChargerModelItem) => {
    setChargersData((prev) => {
      const updated = [...prev, item];
      localStorage.setItem("volmo_custom_chargers", JSON.stringify(updated));
      syncSectionToBackend("chargers", updated);
      return updated;
    });
  };

  const deleteCharger = (id: string) => {
    setChargersData((prev) => {
      const updated = prev.filter((chg) => chg.id !== id);
      localStorage.setItem("volmo_custom_chargers", JSON.stringify(updated));
      syncSectionToBackend("chargers", updated);
      return updated;
    });
  };

  const updateAccessoriesPageConfig = (updated: Partial<AccessoriesPageConfig>) => {
    setAccessoriesPageConfig((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("volmo_custom_accessories_page", JSON.stringify(next));
      syncSectionToBackend("accessoriesPage", next);
      return next;
    });
  };

  const updateBatteryChargerPageConfig = (updated: Partial<BatteryChargerPageConfig>) => {
    setBatteryChargerPageConfig((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("volmo_custom_batterycharger_page", JSON.stringify(next));
      syncSectionToBackend("batteryChargerPage", next);
      return next;
    });
  };

  const updateMediaBlogsPageConfig = (updated: Partial<MediaBlogsPageConfig>) => {
    setMediaBlogsPageConfig((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("volmo_mediablogs_page", JSON.stringify(next));
      return next;
    });
  };

  // Media Articles Actions
  const updateMediaArticles = (items: MediaArticle[]) => {
    setMediaArticlesData(items);
    localStorage.setItem("volmo_media_articles", JSON.stringify(items));
  };

  const updateSingleMediaArticle = (id: string, updated: Partial<MediaArticle>) => {
    setMediaArticlesData((prev) => {
      const next = prev.map((art) => (art.id === id ? { ...art, ...updated } : art));
      localStorage.setItem("volmo_media_articles", JSON.stringify(next));
      return next;
    });
  };

  const addMediaArticle = (item: MediaArticle) => {
    setMediaArticlesData((prev) => {
      const next = [item, ...prev];
      localStorage.setItem("volmo_media_articles", JSON.stringify(next));
      return next;
    });
  };

  const deleteMediaArticle = (id: string) => {
    setMediaArticlesData((prev) => {
      const next = prev.filter((art) => art.id !== id);
      localStorage.setItem("volmo_media_articles", JSON.stringify(next));
      return next;
    });
  };

  // Company Photos Actions
  const updateCompanyPhotos = (items: CompanyPhoto[]) => {
    setCompanyPhotosData(items);
    localStorage.setItem("volmo_company_photos", JSON.stringify(items));
  };

  const updateSingleCompanyPhoto = (id: string, updated: Partial<CompanyPhoto>) => {
    setCompanyPhotosData((prev) => {
      const next = prev.map((ph) => (ph.id === id ? { ...ph, ...updated } : ph));
      localStorage.setItem("volmo_company_photos", JSON.stringify(next));
      return next;
    });
  };

  const addCompanyPhoto = (item: CompanyPhoto) => {
    setCompanyPhotosData((prev) => {
      const next = [item, ...prev];
      localStorage.setItem("volmo_company_photos", JSON.stringify(next));
      return next;
    });
  };

  const deleteCompanyPhoto = (id: string) => {
    setCompanyPhotosData((prev) => {
      const next = prev.filter((ph) => ph.id !== id);
      localStorage.setItem("volmo_company_photos", JSON.stringify(next));
      return next;
    });
  };

  // Company Videos Actions
  const updateCompanyVideos = (items: CompanyVideo[]) => {
    setCompanyVideosData(items);
    localStorage.setItem("volmo_company_videos", JSON.stringify(items));
  };

  const updateSingleCompanyVideo = (id: string, updated: Partial<CompanyVideo>) => {
    setCompanyVideosData((prev) => {
      const next = prev.map((vid) => (vid.id === id ? { ...vid, ...updated } : vid));
      localStorage.setItem("volmo_company_videos", JSON.stringify(next));
      return next;
    });
  };

  const addCompanyVideo = (item: CompanyVideo) => {
    setCompanyVideosData((prev) => {
      const next = [item, ...prev];
      localStorage.setItem("volmo_company_videos", JSON.stringify(next));
      return next;
    });
  };

  const deleteCompanyVideo = (id: string) => {
    setCompanyVideosData((prev) => {
      const next = prev.filter((vid) => vid.id !== id);
      localStorage.setItem("volmo_company_videos", JSON.stringify(next));
      return next;
    });
  };

  // Career Openings Actions
  const updateCareerOpenings = (items: CareerOpening[]) => {
    setCareerOpeningsData(items);
    localStorage.setItem("volmo_career_openings", JSON.stringify(items));
  };

  const updateSingleCareerOpening = (id: string, updated: Partial<CareerOpening>) => {
    setCareerOpeningsData((prev) => {
      const next = prev.map((job) => (job.id === id ? { ...job, ...updated } : job));
      localStorage.setItem("volmo_career_openings", JSON.stringify(next));
      return next;
    });
  };

  const addCareerOpening = (item: CareerOpening) => {
    setCareerOpeningsData((prev) => {
      const next = [item, ...prev];
      localStorage.setItem("volmo_career_openings", JSON.stringify(next));
      return next;
    });
  };

  const deleteCareerOpening = (id: string) => {
    setCareerOpeningsData((prev) => {
      const next = prev.filter((job) => job.id !== id);
      localStorage.setItem("volmo_career_openings", JSON.stringify(next));
      return next;
    });
  };

  const resetAllToDefault = () => {
    localStorage.removeItem("volmo_custom_models");
    localStorage.removeItem("volmo_custom_pulse");
    localStorage.removeItem("volmo_custom_features");
    localStorage.removeItem("volmo_custom_contact");
    localStorage.removeItem("volmo_custom_hero");
    localStorage.removeItem("volmo_custom_testimonials");
    localStorage.removeItem("volmo_custom_faqs");
    localStorage.removeItem("volmo_custom_showrooms");
    localStorage.removeItem("volmo_custom_branding");
    localStorage.removeItem("volmo_custom_site_sections");
    localStorage.removeItem("volmo_custom_accessories");
    localStorage.removeItem("volmo_custom_graphene_batteries");
    localStorage.removeItem("volmo_custom_lithium_batteries");
    localStorage.removeItem("volmo_custom_chargers");
    localStorage.removeItem("volmo_custom_accessories_page");
    localStorage.removeItem("volmo_custom_batterycharger_page");
    localStorage.removeItem("volmo_media_articles");
    localStorage.removeItem("volmo_company_photos");
    localStorage.removeItem("volmo_company_videos");
    localStorage.removeItem("volmo_career_openings");
    localStorage.removeItem("volmo_mediablogs_page");

    setModelsData(MODELS_DATA);
    setPulseData(PULSE_DATA);
    setCommonFeatures(COMMON_FEATURES);
    setContactInfo(CONTACT_INFO);
    setHeroConfig(DEFAULT_HERO_CONFIG);
    setTestimonialsData(DEFAULT_TESTIMONIALS);
    setFaqsData(DEFAULT_FAQS);
    setShowroomsData(DEFAULT_SHOWROOMS);
    setBrandingConfig(DEFAULT_BRANDING);
    setSiteSections(DEFAULT_SITE_SECTIONS);
    setAccessoriesData(DEFAULT_ACCESSORIES);
    setLeadAcidBatteriesData(LEAD_ACID_GRAPHENE_BATTERIES);
    setLithiumBatteriesData(LITHIUM_LFP_BATTERY_MODELS);
    setChargersData(CHARGER_MODELS);
    setAccessoriesPageConfig(DEFAULT_ACCESSORIES_PAGE_CONFIG);
    setBatteryChargerPageConfig(DEFAULT_BATTERY_CHARGER_PAGE_CONFIG);
    setMediaArticlesData(MEDIA_ARTICLES);
    setCompanyPhotosData(COMPANY_PHOTOS);
    setCompanyVideosData(COMPANY_VIDEOS);
    setCareerOpeningsData(CAREER_OPENINGS);
    setMediaBlogsPageConfig(DEFAULT_MEDIA_BLOGS_PAGE_CONFIG);

    api.config.resetConfig().catch((err) => {
      console.warn("[Volmo] Failed to reset backend configuration:", err.message);
    });
  };

  if (!isLoaded) {
    return null; // Prevents flashing of default values
  }

  return (
    <SiteConfigContext.Provider
      value={{
        modelsData,
        pulseData,
        commonFeatures,
        contactInfo,
        heroConfig,
        testimonialsData,
        faqsData,
        showroomsData,
        brandingConfig,
        siteSections,
        accessoriesData,
        leadAcidBatteriesData,
        lithiumBatteriesData,
        chargersData,
        accessoriesPageConfig,
        batteryChargerPageConfig,
        mediaArticlesData,
        companyPhotosData,
        companyVideosData,
        careerOpeningsData,
        mediaBlogsPageConfig,

        updateModelSpec,
        addModelSpec,
        deleteModelSpec,
        saveAllModels,
        updatePulseData,
        updateCommonFeatures,
        updateContactInfo,
        updateHeroConfig,
        updateTestimonialsData,
        updateSingleTestimonial,
        addTestimonial,
        deleteTestimonial,
        updateFaqsData,
        updateSingleFaq,
        addFaq,
        deleteFaq,
        updateShowroomsData,
        updateSingleShowroom,
        addShowroom,
        deleteShowroom,
        updateBrandingConfig,
        updateSiteSections,
        updateAccessoriesPageConfig,
        updateBatteryChargerPageConfig,
        updateMediaBlogsPageConfig,

        updateMediaArticles,
        updateSingleMediaArticle,
        addMediaArticle,
        deleteMediaArticle,

        updateCompanyPhotos,
        updateSingleCompanyPhoto,
        addCompanyPhoto,
        deleteCompanyPhoto,

        updateCompanyVideos,
        updateSingleCompanyVideo,
        addCompanyVideo,
        deleteCompanyVideo,

        updateCareerOpenings,
        updateSingleCareerOpening,
        addCareerOpening,
        deleteCareerOpening,

        updateAccessoriesData,
        updateSingleAccessory,
        addAccessory,
        deleteAccessory,

        updateLeadAcidBatteries,
        updateSingleLeadAcidBattery,
        addLeadAcidBattery,
        deleteLeadAcidBattery,

        updateLithiumBatteries,
        updateSingleLithiumBattery,
        addLithiumBattery,
        deleteLithiumBattery,

        updateChargers,
        updateSingleCharger,
        addCharger,
        deleteCharger,

        resetAllToDefault,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
}

