/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useSiteConfig } from "../SiteConfigContext";
import volmoLogoPng from "../assets/images/volmo_logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  const { brandingConfig } = useSiteConfig();

  const sizeMap = {
    sm: "h-8",
    md: "h-11",
    lg: "h-16",
    xl: "h-24",
  };

  const heightClass = sizeMap[size];
  const logoSrc = brandingConfig?.customLogoUrl || volmoLogoPng;

  return (
    <div className={`flex items-center select-none ${heightClass} ${className}`}>
      <img
        src={logoSrc}
        alt={brandingConfig?.brandName ? `${brandingConfig.brandName} Logo` : "Volmo Electric"}
        referrerPolicy="no-referrer"
        className="h-full w-auto object-contain max-w-[280px]"
      />
    </div>
  );
}

// Re-export as SVGLogo to ensure any remaining references use the official PNG logo
export { Logo as SVGLogo };
