/**
 * ADMIN CMS - Tier 3 Features Management Page
 * 
 * Enable/disable Tier 3 enterprise features per plan
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface Tier3Feature {
  key: string;
  name: string;
  category: 'core' | 'advanced' | 'integration';
  default: boolean;
}

export default function Tier3FeaturesPage() {
  const { activeCompanyId } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [features, setFeatures] = useState<Tier3Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('1');
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchFeatures();
  }, []);

  async function fetchFeatures() {
    try {
      const res = await fetch("/api/admin/tier3-features");
      const data = await res.json();
      setFeatures(data.features || []);
      
      // Initialize enabled state
      const initialState: Record<string, boolean> = {};
      (data.features || []).forEach((f: Tier3Feature) => {
        initialState[f.key] = f.default;
      });
      setEnabledFeatures(initialState);
    } catch (err) {
      console.error("Failed to fetch features:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeature(featureKey: string) {
    const newState = !enabledFeatures[featureKey];
    setEnabledFeatures({ ...enabledFeatures, [featureKey]: newState });

    try {
      const res = await fetch("/api/admin/tier3-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          featureKey,
          isEnabled: newState,
        }),
      });

      if (!res.ok) {
        // Revert on failure
        setEnabledFeatures({ ...enabledFeatures, [featureKey]: !newState });
        console.error("Failed to toggle feature");
      }
    } catch (err) {
      console.error("Failed to toggle feature:", err);
      // Revert on error
      setEnabledFeatures({ ...enabledFeatures, [featureKey]: !newState });
    }
  }

  const coreFeatures = features.filter(f => f.category === 'core');
  const advancedFeatures = features.filter(f => f.category === 'advanced');
  const integrationFeatures = features.filter(f => f.category === 'integration');

  return (
    <>
      <DemoModeBanner companyId={activeCompanyId} />
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Feature changes are for testing only.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Tier 3 Enterprise Features</h1>
            <p className="text-gray-400">
              Enable/disable Tier 3 capabilities for subscription plans. All 13 features are included in the Enterprise tier.
            </p>
          </div>

          {/* Plan Selector */}
          <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-semibold mb-3">Select Plan to Configure</label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
            >
              <option value="1">Tier 1 - Starter</option>
              <option value="2">Tier 2 - Growth</option>
              <option value="3">Tier 3 - Enterprise</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading features...</div>
          ) : (
            <>
              {/* Core Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  Core Enterprise Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {coreFeatures.map((feature) => (
                    <div
                      key={feature.key}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-sm text-gray-400">Essential enterprise capability</p>
                      </div>
                      <label className="ml-4 flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledFeatures[feature.key] || false}
                          onChange={() => toggleFeature(feature.key)}
                          className="mr-2 w-4 h-4"
                        />
                        <span className="text-sm">
                          {enabledFeatures[feature.key] ? '✓ Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                  Advanced Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {advancedFeatures.map((feature) => (
                    <div
                      key={feature.key}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-sm text-gray-400">Premium feature</p>
                      </div>
                      <label className="ml-4 flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledFeatures[feature.key] || false}
                          onChange={() => toggleFeature(feature.key)}
                          className="mr-2 w-4 h-4"
                        />
                        <span className="text-sm">
                          {enabledFeatures[feature.key] ? '✓ Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                  Integration & API
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integrationFeatures.map((feature) => (
                    <div
                      key={feature.key}
                      className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-sm text-gray-400">External integrations</p>
                      </div>
                      <label className="ml-4 flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabledFeatures[feature.key] || false}
                          onChange={() => toggleFeature(feature.key)}
                          className="mr-2 w-4 h-4"
                        />
                        <span className="text-sm">
                          {enabledFeatures[feature.key] ? '✓ Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
                <h3 className="text-xl font-bold mb-3">Tier 3 Enterprise Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Core Features</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {Object.values(enabledFeatures).filter(Boolean).length}/13
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Status</p>
                    <p className="text-2xl font-bold text-green-400">Active</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">SLA Tier</p>
                    <p className="text-2xl font-bold text-purple-400">Platinum</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
