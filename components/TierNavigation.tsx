"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface TierInfo {
  id: "tier1" | "tier2" | "tier3";
  name: string;
  label: string;
  icon: string;
  description: string;
  color: string;
  textColor: string;
  features: string[];
}

const TIERS: TierInfo[] = [
  {
    id: "tier1",
    name: "MVP",
    label: "Tier 1: Starter",
    icon: "🚀",
    description: "Core project & crew management",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    features: [
      "Project Management",
      "Crew Scheduling",
      "Basic Invoicing",
      "Expense Tracking",
      "Task Management",
    ],
  },
  {
    id: "tier2",
    name: "Growth",
    label: "Tier 2: Growth",
    icon: "📈",
    description: "Advanced reporting & light ERP",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    features: [
      "All Tier 1 features",
      "Advanced Reporting",
      "Budget Forecasting",
      "Customer Analytics",
      "Basic ERP Sync (Lite)",
    ],
  },
  {
    id: "tier3",
    name: "Enterprise",
    label: "Tier 3: Enterprise",
    icon: "⚙️",
    description: "Full ERP integration & automation",
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
    features: [
      "All Tier 2 features",
      "Full Xero Integration",
      "Full Sage Integration",
      "Real-time GL Sync",
      "Automated Workflows",
      "Multi-entity Support",
    ],
  },
];

export function TierNavigation() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<"tier1" | "tier2" | "tier3">("tier1");
  const [showInfo, setShowInfo] = useState(false);

  const handleTierSwitch = (tier: "tier1" | "tier2" | "tier3") => {
    setCurrentTier(tier);
    // Store the selected tier in localStorage
    localStorage.setItem("selectedTier", tier);
    // Navigate to the appropriate tier page
    router.push(`/dashboard?tier=${tier}`);
  };

  const activeTier = TIERS.find(t => t.id === currentTier);

  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Tier selector tabs */}
          <div className="flex gap-2">
            {TIERS.map(tier => (
              <button
                key={tier.id}
                onClick={() => handleTierSwitch(tier.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentTier === tier.id
                    ? `${tier.color} ${tier.textColor} shadow-sm`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{tier.icon}</span>
                {tier.name}
              </button>
            ))}
          </div>

          {/* Info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ℹ️ Features
          </button>
        </div>

        {/* Info panel */}
        {showInfo && activeTier && (
          <div className={`mt-4 p-4 rounded-lg ${activeTier.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{activeTier.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{activeTier.label}</h3>
                <p className="text-sm text-gray-700 mt-1">{activeTier.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeTier.features.map((feature, idx) => (
                    <span key={idx} className="inline-block bg-white bg-opacity-60 px-2 py-1 rounded text-xs font-medium text-gray-800">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
