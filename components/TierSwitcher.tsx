"use client";

import { useState, useEffect } from "react";

interface TierInfo {
  name: string;
  url: string;
  id: "tier1" | "tier2" | "tier3";
  status: "✅ Live" | "🔧 Staging" | "🚀 Ready";
  color: string;
}

/**
 * TierSwitcher Component
 * Displays environment toggle for demo purposes
 * Shows which tier is currently active and allows switching between them
 * Positioned at top-right of dashboard for easy access during client presentation
 */
export function TierSwitcher() {
  const [currentTier, setCurrentTier] = useState<"tier1" | "tier2" | "tier3">("tier1");
  const [isOpen, setIsOpen] = useState(false);

  const tiers: TierInfo[] = [
    {
      name: "Tier 1: Starter",
      url: "https://fieldcost.vercel.app",
      id: "tier1",
      status: "✅ Live",
      color: "bg-green-100 border-green-500",
    },
    {
      name: "Tier 2: Growth",
      url: "https://fieldcost-fb11a285g-dinganis-projects-f0cb535f.vercel.app",
      id: "tier2",
      status: "🔧 Staging",
      color: "bg-yellow-100 border-yellow-500",
    },
    {
      name: "Tier 3: Enterprise",
      url: "https://fieldcost-887paaoqa-dinganis-projects-f0cb535f.vercel.app",
      id: "tier3",
      status: "🚀 Ready",
      color: "bg-blue-100 border-blue-500",
    },
  ];

  useEffect(() => {
    // Detect which tier we're on based on current URL
    const url = window.location.hostname;
    if (url.includes("staging")) {
      setCurrentTier("tier2");
    } else if (url.includes("tier3")) {
      setCurrentTier("tier3");
    } else {
      setCurrentTier("tier1");
    }
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Collapsed button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold text-sm"
        >
          📊 {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}
        </button>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden min-w-max">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3">
            <div className="font-bold text-sm">🎯 Demo Environments</div>
            <div className="text-xs opacity-90">Click to switch tiers</div>
          </div>

          <div className="space-y-0">
            {tiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => {
                  window.location.href = tier.url;
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 border-l-4 transition-all hover:bg-gray-50 ${
                  currentTier === tier.id ? tier.color + " border-l-4" : "border-l-4 border-transparent"
                }`}
              >
                <div className="font-semibold text-sm">{tier.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {tier.status}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-2 border-t text-xs text-gray-500">
            <div>💡 Presentation Tips:</div>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Tier 1: Basic project management</li>
              <li>Tier 2: ERP sync + advanced workflows</li>
              <li>Tier 3: Enterprise multi-company features</li>
            </ul>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 text-xs text-gray-600 hover:bg-gray-50 border-t"
          >
            Close ✕
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Enhanced Dashboard Component with Tier Indicator
 * Usage: Add to your main dashboard layout
 */
export function DashboardWithTierIndicator({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TierSwitcher />
      {children}
    </>
  );
}
