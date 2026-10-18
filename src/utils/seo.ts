/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PageSeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
}

export const CANONICAL_BASE = "https://www.volmoelectrical.com";

export const PRODUCT_SEO_DATA: Record<string, { title: string; description: string }> = {
  phantom: {
    title: "Volmo Phantom | High-Torque Sport Electric Scooter | Volmo Electrical",
    description: "Volmo Phantom: Aggressive sport styling, twin LED headlamps, high-torque BLDC motor tuned for steep flyovers, dual disc brakes, and 100% CMVR RTO-free exemption in India.",
  },
  glider: {
    title: "Volmo Glider | Aerodynamic Comfort Electric Scooter | Volmo Electrical",
    description: "Volmo Glider: Extended wheelbase comfort cruiser with dual hydraulic rear suspension, contoured dual-density seat, and smooth acceleration for daily family commuting.",
  },
  classic: {
    title: "Volmo Classic | Timeless Vintage Electric Scooter | Volmo Electrical",
    description: "Volmo Classic: Retro aesthetic with chrome accents, reinforced tubular chassis, generous footboard, front storage, and zero-emission electric mobility.",
  },
  pulse: {
    title: "Volmo Pulse | Cyber Sport Performance Electric Scooter | Volmo Electrical",
    description: "Volmo Pulse: Agile young-adult electric scooter with bold dual-tone colorways, 1200W peak motor, USB mobile charging, and instant throttle response.",
  },
  vista: {
    title: "Volmo Vista | Lightweight Swift City Commuter | Volmo Electrical",
    description: "Volmo Vista: Lightweight aerodynamic city commuter with nimble handling, dual front storage pockets, LED headlamp, and 60-80 km real-world range.",
  },
};

export const PAGE_SEO_DATA: Record<string, { title: string; description: string; path: string }> = {
  home: {
    title: "Volmo Electrical | Electric Two-Wheelers in India",
    description:
      "Discover Volmo Electrical's premium, RTO-free electric scooters in India including Phantom, Glider, Classic, Pulse & Vista. Explore long-range batteries and dealership opportunities.",
    path: "/",
  },
  models: {
    title: "Volmo Electric Scooters Fleet | RTO-Free Electric Two-Wheelers",
    description:
      "Explore Volmo Electrical's CMVR RTO-free electric scooter lineup: Phantom, Glider, Classic, Pulse, and Vista with custom Graphene & Lithium LFP battery options.",
    path: "/?page=models",
  },
  "battery-charger": {
    title: "EV Batteries & Smart Chargers | Volmo Electrical Power Systems",
    description:
      "High-density Lead-Acid Graphene (1-Year Warranty) and Lithium-Ion LFP battery packs up to 72V 60Ah with German-technology 69.0V CCCV smart chargers.",
    path: "/?page=battery-charger",
  },
  accessories: {
    title: "Electric Scooter Accessories & Safety Gear | Volmo Electrical",
    description:
      "Factory-grade reinforced steel frame sets, ISI-certified safety helmets, and lifestyle gear engineered specifically for Volmo electric scooters.",
    path: "/?page=accessories",
  },
  locator: {
    title: "Volmo Dealership Locator | Electric Scooter Showrooms in India",
    description:
      "Find authorized Volmo Electrical showrooms, dealerships, and authorized service centers across Madhya Pradesh, Uttar Pradesh, and nationwide.",
    path: "/?page=locator",
  },
  technology: {
    title: "EV Technology & FAQs | CMVR RTO-Free Guidelines | Volmo Electrical",
    description:
      "Learn about CMVR regulations, German Sine-Wave controllers, 15-20 paise/km running costs, and maintenance-free electric scooter engineering.",
    path: "/?page=technology",
  },
  "media-blogs": {
    title: "Media, News & Updates | Volmo Electrical Private Limited",
    description:
      "Latest corporate news, media releases, customer reviews, career openings, and sustainability milestones from Volmo Electrical.",
    path: "/?page=media-blogs",
  },
};

export function getSeoForRoute(pageId: string, modelId?: string | null): PageSeoData {
  if (pageId === "models" && modelId && PRODUCT_SEO_DATA[modelId]) {
    const prod = PRODUCT_SEO_DATA[modelId];
    return {
      title: prod.title,
      description: prod.description,
      canonicalUrl: `${CANONICAL_BASE}/?page=models&model=${encodeURIComponent(modelId)}`,
    };
  }

  const page = PAGE_SEO_DATA[pageId] || PAGE_SEO_DATA.home;
  return {
    title: page.title,
    description: page.description,
    canonicalUrl: `${CANONICAL_BASE}${page.path === "/" ? "/" : page.path}`,
  };
}

/**
 * Updates DOM title, meta description, OpenGraph, Twitter, and canonical link tags.
 */
export function applyPageSeo(seo: PageSeoData): void {
  if (typeof document === "undefined") return;

  // 1. Title
  document.title = seo.title;

  // Helper to upsert a meta tag
  const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
    let el = document.querySelector<HTMLMetaElement>(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attribute, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  // 2. Standard Meta Description
  setMeta('meta[name="description"]', "name", "description", seo.description);

  // 3. OpenGraph Tags
  setMeta('meta[property="og:title"]', "property", "og:title", seo.title);
  setMeta('meta[property="og:description"]', "property", "og:description", seo.description);
  setMeta('meta[property="og:url"]', "property", "og:url", seo.canonicalUrl);

  // 4. Twitter Cards
  setMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
  setMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.description);

  // 5. Canonical Link
  let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", seo.canonicalUrl);
}
