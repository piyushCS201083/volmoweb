/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useSiteConfig } from "../SiteConfigContext";

interface SVGLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function SVGLogo({ className = "", size = "md" }: SVGLogoProps) {
  const { brandingConfig } = useSiteConfig();

  const sizeMap = {
    sm: "h-8",
    md: "h-11",
    lg: "h-16",
    xl: "h-24",
  };

  const heightClass = sizeMap[size];

  if (brandingConfig?.customLogoUrl) {
    return (
      <div className={`flex items-center select-none ${heightClass} ${className}`}>
        <img
          src={brandingConfig.customLogoUrl}
          alt={brandingConfig.brandName || "Logo"}
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain max-w-[240px]"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${heightClass} ${className}`}>
      <svg
        viewBox="0 0 1150 300"
        fill="currentColor"
        className="h-full w-auto text-black"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized Lighting Triangle Logo */}
        <g id="logo-symbol">
          {/* Main Orange Triangle Frame */}
          <path
            d="M 50,20 L 250,20 L 150,280 Z"
            fill="#EA580C"
            stroke="#EA580C"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {/* Inner electric design cutout */}
          <path
            d="M 150,55 L 210,55 L 140,165 L 175,165 L 125,245 L 165,150 L 130,150 Z"
            fill="#FFFFFF"
          />
        </g>

        {/* Brand Text: V O L M O */}
        <g id="logo-text" className="font-bold">
          {/* V */}
          <path
            d="M 330,60 L 370,240 L 415,240 L 455,60 L 405,60 L 392,185 L 380,60 Z"
            fill="currentColor"
          />
          {/* Custom O with White Lighting Bolt inside */}
          <circle cx="530" cy="150" r="90" fill="currentColor" />
          <path
            d="M 535,90 L 510,150 L 536,150 L 525,210 L 555,140 L 529,140 Z"
            fill="#FFFFFF"
            className="text-white fill-white"
          />
          {/* L */}
          <path
            d="M 640,60 L 640,240 L 730,240 L 730,195 L 685,195 L 685,60 Z"
            fill="currentColor"
          />
          {/* M */}
          <path
            d="M 770,60 L 770,240 L 810,240 L 810,120 L 845,210 L 855,210 L 890,120 L 890,240 L 930,240 L 930,60 L 880,60 L 850,150 L 820,60 Z"
            fill="currentColor"
          />
          {/* O */}
          <path
            d="M 980,150 C 980,100 1010,70 1050,70 C 1090,70 1120,100 1120,150 C 1120,200 1090,230 1050,230 C 1010,230 980,200 980,150 Z 
               M 1025,150 C 1025,175 1035,190 1050,190 C 1065,190 1075,175 1075,150 C 1075,125 1065,110 1050,110 C 1035,110 1025,125 1025,150 Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}
