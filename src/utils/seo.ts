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
    description: "Volmo Phantom: Aggressive sport electric scooter by Volmo Electrical. Features high-torque BLDC motor tuned for steep flyovers, twin LED headlamps, dual disc brakes, and CMVR RTO-free exemption in India.",
  },
  glider: {
    title: "Volmo Glider | Aerodynamic Comfort Electric Scooter | Volmo Electrical",
    description: "Volmo Glider: Extended wheelbase comfort electric scooter by Volmo Electrical. Equipped with dual hydraulic rear suspension, contoured dual-density seat, and smooth zero-emission electric mobility.",
  },
  classic: {
    title: "Volmo Classic | Timeless Vintage Electric Scooter | Volmo Electrical",
    description: "Volmo Classic: Retro vintage electric scooter by Volmo Electrical. Featuring chrome accents, reinforced tubular chassis, generous footboard, front storage, and efficient urban commuting.",
  },
  pulse: {
    title: "Volmo Pulse | Cyber Sport Performance Electric Scooter | Volmo Electrical",
    description: "Volmo Pulse: High-performance cyber sport electric scooter by Volmo Electrical. Features 1200W peak motor, bold dual-tone colorways, USB mobile charging, and agile city handling.",
  },
  vista: {
    title: "Volmo Vista | Lightweight Swift City Commuter | Volmo Electrical",
    description: "Volmo Vista: Lightweight aerodynamic city commuter electric scooter by Volmo Electrical. Nimble handling, dual front storage pockets, LED headlamp, and 60-80 km real-world range.",
  },
};

export const PAGE_SEO_DATA: Record<string, { title: string; description: string; path: string }> = {
  home: {
    title: "Volmo Electrical | Electric Two-Wheelers in India",
    description:
      "Explore Volmo Electrical's electric two-wheelers, including Phantom, Glider, Classic, Pulse and Vista. Discover our models and enquire about dealership opportunities.",
    path: "/",
  },
  models: {
    title: "Volmo Electric Scooter Models | Electric Two-Wheelers by Volmo Electrical",
    description:
      "Explore Volmo Electrical's complete electric scooter models: Phantom, Glider, Classic, Pulse, and Vista. RTO-free electric two-wheelers with custom Graphene & Lithium LFP battery options.",
    path: "/?page=models",
  },
  "battery-charger": {
    title: "EV Batteries & Smart Chargers | Volmo Electrical Power Systems",
    description:
      "High-density Lead-Acid Graphene and Lithium-Ion LFP battery packs up to 72V 60Ah with German-technology 69.0V CCCV smart chargers by Volmo Electrical.",
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
      "Find authorized Volmo Electrical electric scooter showrooms, dealerships, and service centers across India, or enquire about opening an electric scooter dealership franchise.",
    path: "/?page=locator",
  },
  technology: {
    title: "EV Technology & FAQs | Electric Two-Wheeler Company in India | Volmo Electrical",
    description:
      "Learn about Volmo Electrical EV technology, German Sine-Wave controllers, 15-20 paise/km running costs, and CMVR RTO-free guidelines for electric two-wheelers in India.",
    path: "/?page=technology",
  },
  "media-blogs": {
    title: "Media, News & Updates | Volmo Electrical Private Limited",
    description:
      "Latest corporate updates, media coverage, customer reviews, and sustainability milestones from Volmo Electrical, premier EV manufacturer in India.",
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
