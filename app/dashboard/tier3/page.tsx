'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Tier3Company {
  id: string;
  name: string;
  registrationNumber: string;
  defaultCurrency: string;
  maxActiveProjects: number;
  maxUsers: number;
  hasDedicatedSupport: boolean;
  slaTier: string;
}

export default function Tier3Setup() {
  const [companies, setCompanies] = useState<Tier3Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    defaultCurrency: 'ZAR',
    maxActiveProjects: 50,
    maxUsers: 200,
    hasDedicatedSupport: true,
    slaTier: 'gold',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tier3/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCompany = await response.json();
        setCompanies([...companies, newCompany]);
        setFormData({
          name: '',
          registrationNumber: '',
          defaultCurrency: 'ZAR',
          maxActiveProjects: 50,
          maxUsers: 200,
          hasDedicatedSupport: true,
          slaTier: 'gold',
        });
      }
    } catch (error) {
      console.error('Error creating company:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Tier 3 Enterprise Setup</h1>
              <p className="text-gray-400">Multi-company configuration with GPS tracking, photo evidence, and custom workflows</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-emerald-400">T3</div>
              <div className="text-sm text-gray-400">Enterprise</div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Create Company</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., Mining Corp Inc"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g., 2024001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
                  <select
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>ZAR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SLA Tier</label>
                  <select
                    value={formData.slaTier}
                    onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="gold">Gold (24h support)</option>
                    <option value="platinum">Platinum (4h support)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded hover:shadow-lg disabled:opacity-50 transition"
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>

          {/* Features Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Tier 3 Features</h2>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏢', label: 'Multi-Company', desc: 'Parent-child relationships' },
                  { icon: '🛰️', label: 'GPS Tracking', desc: 'Sub-10m accuracy' },
                  { icon: '📸', label: 'Photo Evidence', desc: 'Legal chain of custody' },
                  { icon: '📱', label: 'Offline Sync', desc: 'Device bundles' },
                  { icon: '👥', label: 'Field RBAC', desc: '6 roles × 30 permissions' },
                  { icon: '📊', label: 'WIP Tracking', desc: 'Task-level earned value' },
                  { icon: '⚙️', label: 'Custom Workflows', desc: 'Mining-specific templates' },
                  { icon: '💰', label: 'Multi-Currency', desc: 'ZAR, USD, EUR support' },
                  { icon: '📋', label: 'Audit Trails', desc: 'Complete entity history' },
                  { icon: '🔗', label: 'ERP Integration', desc: 'Sage X3 ready' },
                  { icon: '🎯', label: 'Mining Workflows', desc: 'Blast cycle templates' },
                  { icon: '🛡️', label: 'Dedicated Support', desc: 'Gold & Platinum SLA' },
                ].map((feature, idx) => (
                  <div key={idx} className="bg-slate-700 rounded p-4 border border-slate-600">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="font-semibold text-white text-sm">{feature.label}</div>
                    <div className="text-xs text-gray-400">{feature.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/tier3/companies"
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded font-semibold text-center transition"
              >
                Manage Companies
              </Link>
              <Link
                href="/dashboard/tier3/crew"
                className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-4 rounded font-semibold text-center transition"
              >
                Manage Crew
              </Link>
              <Link
                href="/dashboard/tier3/gps"
                className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded font-semibold text-center transition"
              >
                GPS Tracking
              </Link>
              <Link
                href="/dashboard/tier3/photos"
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded font-semibold text-center transition"
              >
                Photo Evidence
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
