/**
 * Demo Company Constants
 * Centralized configuration for demo/live environment identification
 */

// Demo company ID - represents the shared demo workspace with sample data
export const DEMO_COMPANY_ID = "8";

// UI configuration for demo mode
export const DEMO_MODE_CONFIG = {
  badgeLabel: "Demo Mode",
  badgeColor: "orange", // Tailwind: orange-500
  bannerMessage: "You're exploring the Demo Workspace. Changes will not affect a real company.",
  bannerHelper: "This is sample data to help you explore the product.",
  tooltipText: "You are viewing a demo workspace with sample data.",
} as const;

// Live mode configuration
export const LIVE_MODE_CONFIG = {
  badgeLabel: null,
  badgeColor: null,
  bannerMessage: null,
} as const;

export function isDemoCompany(companyId?: string | null): boolean {
  return companyId === DEMO_COMPANY_ID;
}

export function getEnvironmentLabel(companyId?: string | null, companyName?: string | null): string {
  if (isDemoCompany(companyId)) {
    return DEMO_MODE_CONFIG.badgeLabel;
  }
  return companyName || "My Workspace";
}
