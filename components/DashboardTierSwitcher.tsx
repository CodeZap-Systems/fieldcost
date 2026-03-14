"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tier1Dashboard } from "./tiers/Tier1Dashboard";
import { Tier2Dashboard } from "./tiers/Tier2Dashboard";
import { Tier3Dashboard } from "./tiers/Tier3Dashboard";

interface TierInfo {
  id: "tier1" | "tier2" | "tier3";
  name: string;
  icon: string;
  color: string;
}

const TIERS: TierInfo[] = [
  { id: "tier1", name: "Tier 1: Starter", icon: "🚀", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "tier2", name: "Tier 2: Growth", icon: "📈", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "tier3", name: "Tier 3: Enterprise", icon: "⚙️", color: "bg-indigo-100 text-indigo-700 border-indigo-300" },
];

function TierSwitcherContent() {
  const [selectedTier, setSelectedTier] = useState<"tier1" | "tier2" | "tier3">("tier1");
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // First check for query param
    const tierParam = searchParams.get("tier") as "tier1" | "tier2" | "tier3" | null;
    if (tierParam && ["tier1", "tier2", "tier3"].includes(tierParam)) {
      setSelectedTier(tierParam);
      localStorage.setItem("selectedTier", tierParam);
      return;
    }
    
    // Fall back to localStorage
    const saved = localStorage.getItem("selectedTier") as "tier1" | "tier2" | "tier3" | null;
    if (saved && ["tier1", "tier2", "tier3"].includes(saved)) {
      setSelectedTier(saved);
    }
  }, [searchParams]);

  const handleTierSwitch = (tier: "tier1" | "tier2" | "tier3") => {
    setSelectedTier(tier);
    localStorage.setItem("selectedTier", tier);
    router.push(`/dashboard?tier=${tier}`);
  };

  if (!mounted) {
    return <Tier1Dashboard />;
  }

  // Render tier navigation and selected dashboard
  return (
    <div className="w-full">
      {/* Tier Navigation Bar - Always Visible */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            {TIERS.map(tier => (
              <button
                key={tier.id}
                onClick={() => handleTierSwitch(tier.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all border ${
                  selectedTier === tier.id
                    ? `${tier.color} border-opacity-50 shadow-sm`
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{tier.icon}</span>
                {tier.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="w-full">
        {selectedTier === "tier1" && <Tier1Dashboard />}
        {selectedTier === "tier2" && <Tier2Dashboard />}
        {selectedTier === "tier3" && <Tier3Dashboard />}
      </div>
    </div>
  );
}

export function DashboardTierSwitcher() {
  return (
    <Suspense fallback={<Tier1Dashboard />}>
      <TierSwitcherContent />
    </Suspense>
  );
}
