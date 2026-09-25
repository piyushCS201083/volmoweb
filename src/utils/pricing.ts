/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatteryType, ModelSpec } from "../types";

export interface PricingBreakdown {
  basePrice: number;
  finalPrice: number;
  formattedPrice: string;
  modifier: number;
  modifierLabel: string;
  configLabel: string;
  batteryDescription: string;
}

/**
 * Returns the price modifier (difference in INR from standard 5x Lead-Acid 60V base)
 * for a given battery configuration.
 */
export function getBatteryPriceModifier(
  batteryType: BatteryType,
  leadAcidCount: number, // 4, 5, or 6
  lithiumRange: number // 60, 80, 100, 120, 145, 180
): { modifier: number; modifierLabel: string; configLabel: string; batteryDescription: string } {
  if (batteryType === "LA") {
    if (leadAcidCount === 4) {
      return {
        modifier: -4000,
        modifierLabel: "-₹4,000",
        configLabel: "4x SLA Eco (48 km)",
        batteryDescription: "4x 12V 28Ah Lead-Acid Graphene SLA batteries",
      };
    }
    if (leadAcidCount === 6) {
      return {
        modifier: 4000,
        modifierLabel: "+₹4,000",
        configLabel: "6x SLA Heavy (72 km)",
        batteryDescription: "6x 12V 32Ah High-Torque Lead-Acid Graphene array",
      };
    }
    // Default 5 batteries (60V) = Base configuration
    return {
      modifier: 0,
      modifierLabel: "Base Spec",
      configLabel: "5x SLA Standard (60 km)",
      batteryDescription: "5x 12V 32Ah Standard Graphene Lead-Acid Bank",
    };
  } else {
    // Lithium-Ion pricing delta against base 5x SLA
    const lithiumModifierMap: Record<number, number> = {
      60: 12000,
      80: 18000,
      100: 25000,
      120: 32000,
      145: 40000,
      180: 49000,
    };

    const modifier = lithiumModifierMap[lithiumRange] ?? 18000;
    return {
      modifier,
      modifierLabel: `+₹${modifier.toLocaleString("en-IN")}`,
      configLabel: `Lithium-Ion (${lithiumRange} km)`,
      batteryDescription: `Smart Single-Pack Lithium-Ion (${lithiumRange} km range, 3-Yr Warranty)`,
    };
  }
}

/**
 * Calculates the dynamic estimated price for any model based on its battery setup.
 */
export function calculateModelPrice(
  basePriceEstimate: string | undefined,
  batteryType: BatteryType,
  leadAcidCount: number,
  lithiumRange: number
): PricingBreakdown {
  const basePrice = parseInt((basePriceEstimate || "59999").replace(/[^\d]/g, ""), 10) || 59999;
  const { modifier, modifierLabel, configLabel, batteryDescription } = getBatteryPriceModifier(
    batteryType,
    leadAcidCount,
    lithiumRange
  );

  const finalPrice = Math.max(0, basePrice + modifier);

  return {
    basePrice,
    finalPrice,
    formattedPrice: `₹${finalPrice.toLocaleString("en-IN")}`,
    modifier,
    modifierLabel,
    configLabel,
    batteryDescription,
  };
}
