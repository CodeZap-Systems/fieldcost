/**
 * Demo Detection Utilities
 * Server and client-side helpers for identifying demo environments
 */

import { isDemoCompany as isDemoCompanyId, DEMO_COMPANY_ID } from "./demoConstants";

/**
 * Detect if current context is demo mode based on company ID
 */
export function isInDemoMode(companyId?: string | null): boolean {
  return isDemoCompanyId(companyId);
}

/**
 * Get environment label for display
 */
export function getEnvironmentLabel(companyId?: string | null, fallback = "My Workspace"): string {
  if (isInDemoMode(companyId)) {
    return "Demo Mode";
  }
  return fallback;
}

/**
 * Determine if destructive action should be allowed in current environment
 * Demo environment can warn or reset data after actions
 */
export function canPerformDestructiveAction(companyId?: string | null): {
  allowed: boolean;
  requiresWarning: boolean;
  resetsAfter?: boolean;
} {
  const isDemo = isInDemoMode(companyId);

  return {
    allowed: true, // Allow in both demo and live
    requiresWarning: isDemo, // Warn only in demo
    resetsAfter: isDemo, // Data resets after session in demo (optional feature)
  };
}

/**
 * Get demo mode display configuration
 */
export function getDemoModeConfig(companyId?: string | null) {
  if (!isInDemoMode(companyId)) {
    return null;
  }

  return {
    isDemoMode: true,
    bannerVisible: true,
    badgeVisible: true,
    warningOnDestructive: true,
    environment: "demo" as const,
  };
}

/**
 * Validate if user should have access to this company
 * (Extended with demo company handling)
 */
export async function validateCompanyAccess(
  userId: string,
  companyId: string,
  checkDatabase?: (userId: string, companyId: string) => Promise<boolean>
): Promise<{ hasAccess: boolean; reason?: string }> {
  // Demo company is accessible to all authenticated users
  if (isInDemoMode(companyId)) {
    return { hasAccess: true };
  }

  // For real companies, use provided checker or return unknown
  if (checkDatabase) {
    const hasAccess = await checkDatabase(userId, companyId);
    return {
      hasAccess,
      reason: hasAccess ? undefined : "User does not have access to this company",
    };
  }

  return { hasAccess: false, reason: "Database check not provided" };
}

/**
 * Get list of actionable restrictions in demo mode
 */
export function getDemoRestrictions(companyId?: string | null): string[] {
  if (!isInDemoMode(companyId)) {
    return [];
  }

  return [
    "Changes in demo mode are not saved to a real company",
    "Demo data is shared across all demo users",
    "Data resets upon session logout (can be configured)",
    "Some advanced features may be limited",
  ];
}
