"use client";

import React from "react";
import Link from "next/link";
import { isDemoCompany } from "@/lib/demoConstants";

interface DemoModeBannerProps {
  companyId?: string | null;
  onGotoLiveWorkspace?: () => void;
}

/**
 * DemoModeBanner
 * Persistent banner displayed when user is in demo mode.
 * Shows helpful context and provides quick action to switch to live workspace.
 */
export function DemoModeBanner({
  companyId,
  onGotoLiveWorkspace,
}: DemoModeBannerProps) {
  if (!isDemoCompany(companyId)) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 w-full bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 px-4 py-3 md:px-6 md:py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Demo icon */}
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              You're exploring the Demo Workspace.
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              This is sample data to help you explore the product. No real companies are affected.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
          <button
            onClick={onGotoLiveWorkspace}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors"
            aria-label="Switch to your live workspace"
          >
            Go to My Workspace
          </button>

          {/* Optional: Info tooltip for details */}
          <div
            className="w-5 h-5 rounded-full border border-orange-400 text-orange-600 flex items-center justify-center cursor-help text-xs font-bold hover:bg-orange-100 transition-colors"
            title="Your changes here are for exploration only. They won't save to any real company workspace."
            role="tooltip"
          >
            ?
          </div>
        </div>
      </div>
    </div>
  );
}

export default DemoModeBanner;
