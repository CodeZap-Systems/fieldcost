/**
 * ADMIN CMS - Company Tier 3 Configuration Page
 * 
 * Manage Tier 3 settings per customer (SLA, RBAC, currencies, workflows)
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface CompanyConfig {
  id: string;
  companyId: string;
  slaTier: 'gold' | 'platinum';
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: 'ZAR' | 'USD' | 'EUR';
  supportedCurrencies: Array<'ZAR' | 'USD' | 'EUR'>;
  maxActiveProjects: number;
  maxUsers: number;
  parentCompanyId?: string;
  registrationNumber: string;
  enabledFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CompanyConfigPage() {
  const { activeCompanyId } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [config, setConfig] = useState<CompanyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyConfig>>({});

  useEffect(() => {
    fetchConfig();
  }, [activeCompanyId]);

  async function fetchConfig() {
    try {
      const res = await fetch(`/api/admin/company-config?companyId=${activeCompanyId}`);
      const data = await res.json();
      setConfig(data.config);
      setFormData(data.config);
    } catch (err) {
      console.error("Failed to fetch config:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      const res = await fetch("/api/admin/company-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchConfig();
        setEditing(false);
      }
    } catch (err) {
      console.error("Failed to save config:", err);
    }
  }

  const slaTierDetails = {
    gold: {
      uptime: '99.5%',
      responseTime: '4 hours',
      support: 'Business hours',
      color: 'bg-yellow-900 border-yellow-700',
    },
    platinum: {
      uptime: '99.99%',
      responseTime: '1 hour',
      support: '24/7/365',
      color: 'bg-purple-900 border-purple-700',
    },
  };

  return (
    <>
      <DemoModeBanner companyId={activeCompanyId} />
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Configuration changes are for testing only.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Company Configuration</h1>
            <p className="text-gray-400">
              Manage Tier 3 settings for {activeCompanyId || 'selected company'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading configuration...</div>
          ) : !config ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No configuration found</p>
            </div>
          ) : (
            <>
              {/* SLA Tier Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Service Level Agreement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(slaTierDetails).map(([tier, details]) => (
                    <div
                      key={tier}
                      className={`rounded-lg p-6 border cursor-pointer transition ${
                        (editing ? formData.slaTier : config.slaTier) === tier
                          ? `${details.color} border-opacity-100`
                          : 'bg-gray-800 border-gray-700 opacity-60'
                      }`}
                      onClick={() => editing && setFormData({ ...formData, slaTier: tier as any })}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold capitalize">{tier} SLA</h3>
                        {(editing ? formData.slaTier : config.slaTier) === tier && (
                          <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                            ✓ Selected
                          </span>
                        )}
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li>⏱️ Uptime: {details.uptime}</li>
                        <li>🚀 Response Time: {details.responseTime}</li>
                        <li>📞 Support: {details.support}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Details */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Company Details</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setFormData(config);
                        }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Registration Number */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Registration Number</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.registrationNumber || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, registrationNumber: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{config.registrationNumber}</p>
                    )}
                  </div>

                  {/* Support Email */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Support Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={formData.supportEmail || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, supportEmail: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{config.supportEmail}</p>
                    )}
                  </div>

                  {/* Support Phone */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Support Phone</label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.supportPhone || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, supportPhone: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                      />
                    ) : (
                      <p className="text-gray-300">{config.supportPhone}</p>
                    )}
                  </div>

                  {/* Parent Company */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Parent Company ID (Optional)
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.parentCompanyId || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, parentCompanyId: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                        placeholder="Leave empty if standalone"
                      />
                    ) : (
                      <p className="text-gray-300">
                        {config.parentCompanyId || '(Standalone)'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resources & Limits */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
                <h2 className="text-2xl font-bold mb-6">Resources & Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-900 rounded border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Max Active Projects</p>
                    <p className="text-3xl font-bold text-blue-400">
                      {editing ? (
                        <input
                          type="number"
                          value={formData.maxActiveProjects || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxActiveProjects: parseInt(e.target.value),
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white text-lg"
                        />
                      ) : (
                        config.maxActiveProjects
                      )}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-900 rounded border border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Max Users</p>
                    <p className="text-3xl font-bold text-green-400">
                      {editing ? (
                        <input
                          type="number"
                          value={formData.maxUsers || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maxUsers: parseInt(e.target.value),
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white text-lg"
                        />
                      ) : (
                        config.maxUsers
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Default Currency</label>
                    {editing ? (
                      <select
                        value={formData.defaultCurrency || 'ZAR'}
                        onChange={(e) =>
                          setFormData({ ...formData, defaultCurrency: e.target.value as any })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white"
                      >
                        <option value="ZAR">ZAR (South African Rand)</option>
                        <option value="USD">USD (US Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    ) : (
                      <p className="text-gray-300">{config.defaultCurrency}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Supported Currencies</label>
                    <div className="flex gap-2 flex-wrap">
                      {config.supportedCurrencies.map((curr) => (
                        <span key={curr} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                          {curr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enabled Features */}
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-700">
                <h2 className="text-2xl font-bold mb-4">Enabled Tier 3 Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {config.enabledFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-2 bg-blue-700 text-white text-sm rounded flex items-center"
                    >
                      <span className="mr-2">✓</span>
                      {feature.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  Total: <strong>{config.enabledFeatures.length}/13</strong> enterprise features active
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
