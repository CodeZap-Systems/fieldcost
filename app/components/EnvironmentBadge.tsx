"use client";

import React from "react";
import { isDemoCompany, DEMO_MODE_CONFIG } from "@/lib/demoConstants";

interface EnvironmentBadgeProps {
  companyId?: string | null;
  className?: string;
  showTooltip?: boolean;
}

/**
 * EnvironmentBadge
 * Displays visual indicator of current environment (Demo vs Live).
 * Only shown for demo mode.
 */
export function EnvironmentBadge({
  companyId,
  className = "",
  showTooltip = true,
}: EnvironmentBadgeProps) {
  if (!isDemoCompany(companyId)) {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold tracking-wide ${className}`}
      title={
        showTooltip
          ? DEMO_MODE_CONFIG.tooltipText
          : undefined
      }
      role="note"
      aria-label="Demo mode indicator"
    >
      {/* Demo icon - orange circle */}
      <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0" />
      {DEMO_MODE_CONFIG.badgeLabel}
    </div>
  );
}

export default EnvironmentBadge;
