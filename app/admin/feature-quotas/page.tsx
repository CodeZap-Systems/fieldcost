/**
 * ADMIN CMS - Feature Quotas Management Page
 * 
 * Manage feature usage limits per company
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface FeatureQuota {
  id: string;
  companyId: string;
  featureKey: string;
  maxUsage: number;
  currentUsage: number;
  resetPeriod: 'monthly' | 'yearly' | 'never';
  lastResetAt?: string;
}

export default function FeatureQuotasPage() {
  const { activeCompanyId } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [quotas, setQuotas] = useState<FeatureQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FeatureQuota>>({});

  useEffect(() => {
    fetchQuotas();
  }, [activeCompanyId]);

  async function fetchQuotas() {
    try {
      const res = await fetch(`/api/admin/feature-quotas?companyId=${activeCompanyId}`);
      const data = await res.json();
      setQuotas(data.quotas || []);
    } catch (err) {
      console.error("Failed to fetch quotas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(quotaId: string) {
    try {
      const res = await fetch("/api/admin/feature-quotas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quotaId,
          maxUsage: editForm.maxUsage,
          resetPeriod: editForm.resetPeriod,
        }),
      });

      if (res.ok) {
        await fetchQuotas();
        setEditingId(null);
        setEditForm({});
      }
    } catch (err) {
      console.error("Failed to update quota:", err);
    }
  }

  const getProgressColor = (usage: number, max: number) => {
    const percent = (usage / max) * 100;
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgressPercent = (usage: number, max: number) => {
    return Math.min(100, (usage / max) * 100);
  };

  return (
    <>
      <DemoModeBanner companyId={activeCompanyId} />
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Quota changes are for testing only.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Feature Quotas</h1>
            <p className="text-gray-400">
              Manage API call limits, storage quotas, and feature usage limits for {activeCompanyId || 'selected company'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading quotas...</div>
          ) : quotas.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No quotas configured for this company</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quotas.map((quota) => {
                const isEditing = editingId === quota.id;
                const usagePercent = getProgressPercent(quota.currentUsage, quota.maxUsage);

                return (
                  <div key={quota.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold capitalize">
                          {quota.featureKey.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Reset period: <strong>{quota.resetPeriod}</strong>
                          {quota.lastResetAt && (
                            ` • Last reset: ${new Date(quota.lastResetAt).toLocaleDateString()}`
                          )}
                        </p>
                      </div>
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingId(quota.id);
                            setEditForm(quota);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Usage</span>
                        <span className="text-sm font-semibold">
                          {quota.currentUsage.toLocaleString()} / {quota.maxUsage.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full transition-all ${getProgressColor(quota.currentUsage, quota.maxUsage)}`}
                          style={{ width: `${usagePercent}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {usagePercent.toFixed(1)}% used
                      </p>
                    </div>

                    {/* Edit Form */}
                    {isEditing && (
                      <div className="bg-gray-900 rounded p-4 border border-gray-600 space-y-4">
                        <div>
                          <label className="block text-sm mb-2">Max Usage</label>
                          <input
                            type="number"
                            value={editForm.maxUsage || ''}
                            onChange={(e) =>
                              setEditForm({ ...editForm, maxUsage: parseInt(e.target.value) })
                            }
                            className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm mb-2">Reset Period</label>
                          <select
                            value={editForm.resetPeriod || 'monthly'}
                            onChange={(e) =>
                              setEditForm({ ...editForm, resetPeriod: e.target.value as any })
                            }
                            className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                          >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                            <option value="never">Never</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdate(quota.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm({});
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-800 px-3 py-2 rounded text-sm transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    {!isEditing && (
                      <div className="pt-4 border-t border-gray-700">
                        {usagePercent >= 90 ? (
                          <span className="inline-block px-3 py-1 bg-red-900 text-red-200 text-xs rounded-full">
                            ⚠️ Warning: Over 90% quota used
                          </span>
                        ) : usagePercent >= 70 ? (
                          <span className="inline-block px-3 py-1 bg-yellow-900 text-yellow-200 text-xs rounded-full">
                            ⚡ Caution: Over 70% quota used
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-green-900 text-green-200 text-xs rounded-full">
                            ✓ Normal usage
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Info Card */}
          <div className="mt-8 bg-blue-900 rounded-lg p-6 border border-blue-700">
            <h3 className="text-lg font-bold mb-3">About Feature Quotas</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• <strong>API Calls:</strong> REST API requests per minute and per day</li>
              <li>• <strong>Photo Storage:</strong> GigaBytes available for photo evidence</li>
              <li>• <strong>Custom Workflows:</strong> Maximum custom workflow templates</li>
              <li>• <strong>GPS Locations:</strong> Location tracking data points per month</li>
              <li>• Quotas reset automatically based on the configured reset period</li>
              <li>• Contact support to increase quotas for growing enterprises</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
