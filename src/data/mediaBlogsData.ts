/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareerOpening, MediaBlogsPageConfig } from "../types";

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

export const MEDIA_ARTICLES: MediaArticle[] = [
  {
    id: "news-1",
    category: "Press Release",
    title: "Volmo Electric Crosses 10,000+ Zero-Emission Scooters on Indian Roads",
    summary:
      "Rapid adoption driven by sub-10-paise per km operating cost and 100% CMVR RTO-free certification across Rajasthan, Gujarat, and neighboring states.",
    content:
      "Volmo Electrical Private Limited today announced a major milestone with over 10,000 certified zero-emission electric two-wheelers delivered to urban commuters, students, and fleet delivery partners. Built specifically for demanding Indian road conditions, Volmo scooters feature high-ground clearance, cold-rolled tubular chassis, and deep-cycle battery tech that slashes commuter fuel costs by over 95%.",
    date: "September 2026",
    author: "Volmo Corporate Communications",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    tag: "Milestone",
  },
  {
    id: "news-2",
    category: "Tech Blog",
    title: "How Volmo's 69.0V Precision Cutoff Technology Triples LFP Battery Life",
    summary:
      "A deep dive into our German-engineered smart charger semiconductors, active thermal throttling, and zero-overshoot float charging.",
    content:
      "Lithium Iron Phosphate (LFP) chemistry delivers unmatched thermal stability and over 2,000 charge cycles, but standard off-the-shelf chargers frequently overshoot nominal float voltage. Volmo's specialized 69V German-semiconductor chargers feature automated microchip feedback that halts charging at exactly 69.0V, eliminating dendrite formation and ensuring 5+ years of daily peak capacity.",
    date: "August 2026",
    author: "Engineering & R&D Cell",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=80",
    tag: "Engineering",
  },
  {
    id: "news-3",
    category: "Event",
    title: "Clean Mobility Conclave 2026: Volmo Unveils High-Torque Phantom Series",
    summary:
      "Industry leaders and mobility experts gather as Volmo demonstrates steep gradient climbing capability without requiring motorcycle licensing.",
    content:
      "At the 2026 Green Mobility Expo, Volmo presented the Phantom model featuring custom-wound BLDC stator coils optimized for immediate low-end torque. Designed to conquer steep urban flyovers and heavy pillion loads effortlessly, the Phantom maintains the strict 25 km/h CMVR non-RTO regulatory threshold while offering class-leading throttle responsiveness.",
    date: "July 2026",
    author: "Product Strategy Desk",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    tag: "Product Launch",
  },
  {
    id: "news-4",
    category: "News",
    title: "Why Indian Commuters Are Saving ₹1.5 Lakhs in 5 Years by Switching from Petrol",
    summary:
      "With petrol prices consistently above ₹100/litre, a daily 30 km commute on Volmo costs just ₹2.40 a day compared to ₹78+ on petrol scooters.",
    content:
      "Our latest customer financial audit across 500 urban riders reveals average monthly fuel savings of ₹2,280. Over a 5-year ownership period, riders save more than ₹1,50,000 in fuel and maintenance combined—enough to recover the entire purchase cost of their electric scooter more than two times over.",
    date: "June 2026",
    author: "Market Research Unit",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80",
    tag: "Economics",
  },
];

export const COMPANY_PHOTOS: CompanyPhoto[] = [
  {
    id: "photo-1",
    title: "High-Precision Robotic Chassis Welding Plant",
    caption:
      "Robotic arm weld fixtures ensuring structural rigidity and anti-rust dip coating for all Volmo scooter tubular chassis.",
    category: "Manufacturing",
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80",
    date: "August 2026",
  },
  {
    id: "photo-2",
    title: "Flagship Showroom & Experience Lounge",
    caption:
      "State-of-the-art interactive showroom with live telemetry displays and customized color studios for test rides.",
    category: "Showroom",
    imageUrl:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    date: "July 2026",
  },
  {
    id: "photo-3",
    title: "Lithium Pack Automated Testing & Cell Balancing",
    caption:
      "Rigorous 48-hour cycle testing and thermal stress analysis on our Smart BMS 60V and 72V battery banks.",
    category: "Testing",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    date: "June 2026",
  },
  {
    id: "photo-4",
    title: "Customer Fleet Key Handover Ceremony",
    caption:
      "Delivery milestone celebrating 150+ happy families receiving their green mobility keys in a single weekend.",
    category: "Delivery",
    imageUrl:
      "https://images.unsplash.com/photo-1558980394-4c7c9299fe96?auto=format&fit=crop&w=1000&q=80",
    date: "May 2026",
  },
];

export const COMPANY_VIDEOS: CompanyVideo[] = [
  {
    id: "video-1",
    title: "Inside the Volmo Factory: Frame Rigidity & Waterproof Testing",
    description:
      "Take an exclusive tour of our assembly lines, IP67 waterproof motor chamber tests, and quality assurance checkpoints.",
    duration: "4:15 mins",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80",
    category: "Engineering",
  },
  {
    id: "video-2",
    title: "Volmo Phantom: Real-World 18° Flyover Gradient Test",
    description:
      "Watch the high-torque Volmo Phantom climb demanding steep flyovers with a 150kg dual rider load effortlessly.",
    duration: "2:45 mins",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80",
    category: "Road Test",
  },
  {
    id: "video-3",
    title: "Complete Scooter Walkaround: Volmo Glider Comfort Cruiser",
    description:
      "Explore the generous footboard, under-seat storage, hydraulic suspension, and cockpit telemetry of the Glider series.",
    duration: "3:30 mins",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80",
    category: "Walkaround",
  },
];

export const CAREER_OPENINGS: CareerOpening[] = [
  {
    id: "job-1",
    title: "EV Assembly & Quality Control Engineer",
    department: "Manufacturing & Production",
    location: "Jaipur Plant, Rajasthan",
    type: "Full-Time",
    experience: "2-5 Years",
    summary:
      "Lead line assembly quality verification, wiring harness torque inspections, and final dynamometer dyno testing for electric two-wheelers.",
    keySkills: ["EV Powertrain", "Dynamometer Testing", "ISO 9001", "Wiring Harnesses"],
    responsibilities: [
      "Supervise end-of-line vehicle testing for brake clearance, alignment, and acceleration curve.",
      "Conduct continuous quality audits on BLDC motor assemblies and controller wiring.",
      "Ensure compliance with ARAI and CMVR manufacturing quality benchmarks.",
    ],
    badge: "Urgent Opening",
  },
  {
    id: "job-2",
    title: "Lithium Battery & Smart BMS Quality Analyst",
    department: "Battery R&D & Cell Tech",
    location: "Jaipur, Rajasthan",
    type: "Full-Time",
    experience: "3-6 Years",
    summary:
      "Oversee automated battery cell grading, spot welding integrity, Smart BMS firmware calibration, and thermal runaway prevention protocols.",
    keySkills: ["Lithium-Ion / LFP", "BMS Firmware", "Cell Balancing", "Thermal Testing"],
    responsibilities: [
      "Perform internal resistance (IR) and capacity cycle testing on incoming lithium cell batches.",
      "Calibrate Smart BMS over-voltage, under-voltage, and short-circuit cutoff thresholds.",
      "Investigate and optimize cycle life performance under high-temperature Indian climates.",
    ],
    badge: "High Impact",
  },
  {
    id: "job-3",
    title: "Area Sales Manager - Dealership Network",
    department: "Channel Sales & Expansion",
    location: "Rajasthan & Regional Territories",
    type: "Full-Time",
    experience: "4-8 Years",
    summary:
      "Drive dealer recruitment, franchise onboarding, sales targets, and dealer relationship management across high-growth tier-2 and tier-3 markets.",
    keySkills: ["Automotive Channel Sales", "Dealer Onboarding", "Target Execution", "B2B Sales"],
    responsibilities: [
      "Identify prospective dealership entrepreneurs and facilitate franchise approvals.",
      "Guide dealership partners on inventory forecasting, showroom branding, and test ride drives.",
      "Achieve monthly retail and wholesale dispatch milestones across regional territories.",
    ],
    badge: "Fast Track",
  },
  {
    id: "job-4",
    title: "Senior EV Embedded Firmware Engineer",
    department: "Electronics & Telemetry",
    location: "Jaipur / Hybrid",
    type: "Full-Time",
    experience: "3-5 Years",
    summary:
      "Architect digital speedo telemetry, CAN/UART communications between BMS and BLDC motor controllers, and IoT diagnostic interfaces.",
    keySkills: ["Embedded C/C++", "CAN / UART", "BLDC Controllers", "IoT Telemetry"],
    responsibilities: [
      "Develop and test microcontroller firmware for digital cockpit displays and telemetry.",
      "Tune throttle mapping curves for smooth acceleration and regenerative deceleration.",
      "Implement over-the-air (OTA) update protocols for connected scooter series.",
    ],
  },
  {
    id: "job-5",
    title: "Customer Support & After-Sales Coordinator",
    department: "Customer Experience",
    location: "Jaipur Head Office",
    type: "Full-Time",
    experience: "1-3 Years",
    summary:
      "Manage customer inquiries, warranty claim verifications, spare parts dispatch tracking, and prompt service assistance.",
    keySkills: ["Customer Support", "CRM Management", "Warranty Handling", "Hinglish / English"],
    responsibilities: [
      "Handle inbound customer calls and WhatsApp inquiries with high empathy and technical accuracy.",
      "Coordinate warranty battery replacements and spare parts dispatches to dealerships.",
      "Maintain high First Contact Resolution (FCR) and 5-star customer satisfaction scores.",
    ],
  },
  {
    id: "job-6",
    title: "Digital Marketing & Community Executive",
    department: "Brand & Marketing",
    location: "Jaipur Head Office",
    type: "Full-Time",
    experience: "2-4 Years",
    summary:
      "Manage digital advertising campaigns, social media storytelling, influencer ride tests, and localized lead generation campaigns.",
    keySkills: ["Meta & Google Ads", "Content Creation", "SEO & Copywriting", "Social Media"],
    responsibilities: [
      "Create engaging video shorts, customer testimonial reels, and educational EV graphics.",
      "Execute hyper-local lead generation ads for dealership inquiries and scooter test rides.",
      "Manage the Volmo online community and advocate for green emission-free commuting.",
    ],
  },
];

export const DEFAULT_MEDIA_BLOGS_PAGE_CONFIG: MediaBlogsPageConfig = {
  heroBadge: "Volmo Clean Tech, Media & Economic Impact",
  heroTitle: "Media, Blogs & EV Savings Calculator",
  heroSubtitle:
    "Discover why switching to Volmo electric scooters cuts your daily commute to less than 10 paise per km, explore company media, news, rider experiences, and career openings.",
  calculatorBadge: "Economics of EV Mobility",
  calculatorTitle: "Ride for Less Than 10 Paise per KM",
  calculatorSubtitle:
    "See exactly how much money you save every month and the total cash saved after 5 years of riding Volmo instead of a petrol scooter.",
  volmoCostPerKm: 0.085,
  defaultDailyKm: 30,
  defaultPetrolPrice: 105,
  defaultPetrolMileage: 40,
  defaultElecRate: 7.0,
  annualMaintenanceSaved: 4200,
  careersBadge: "Career Openings at Volmo",
  careersTitle: "Shape the Future of Green Urban Transit",
  careersSubtitle:
    "Join our fast-growing engineering, manufacturing, battery technology, and sales leadership teams headquartered in Rajasthan.",
};
