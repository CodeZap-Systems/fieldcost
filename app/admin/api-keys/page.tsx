/**
 * ADMIN CMS - API Keys Management Page
 * 
 * Manage API access keys for Tier 3 companies
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface APIKey {
  id: string;
  companyId: string;
  keyName: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export default function APIKeysPage() {
  const { activeCompanyId } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    keyName: '',
    permissions: [] as string[],
    requestsPerMinute: 600,
    requestsPerDay: 500000,
  });

  const availablePermissions = [
    'tasks:read',
    'tasks:write',
    'projects:read',
    'projects:write',
    'invoices:read',
    'invoices:write',
    'crew:read',
    'crew:write',
    'photos:read',
    'photos:write',
    'reports:read',
    'workflows:read',
    'workflows:write',
  ];

  useEffect(() => {
    fetchKeys();
  }, [activeCompanyId]);

  async function fetchKeys() {
    try {
      const res = await fetch(`/api/admin/api-keys?companyId=${activeCompanyId}`);
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (err) {
      console.error("Failed to fetch API keys:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: activeCompanyId,
          ...formData,
        }),
      });

      if (res.ok) {
        await fetchKeys();
        setShowForm(false);
        setFormData({
          keyName: '',
          permissions: [],
          requestsPerMinute: 600,
          requestsPerDay: 500000,
        });
      }
    } catch (err) {
      console.error("Failed to create API key:", err);
    }
  }

  async function revokeKey(keyId: string) {
    if (confirm("Revoke this API key? Applications using it will stop working.")) {
      try {
        const res = await fetch(`/api/admin/api-keys?id=${keyId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchKeys();
        }
      } catch (err) {
        console.error("Failed to revoke key:", err);
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-200';
      case 'revoked':
        return 'bg-red-900 text-red-200';
      case 'expired':
        return 'bg-yellow-900 text-yellow-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <>
      <DemoModeBanner companyId={activeCompanyId} />
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> API key changes are for testing only.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">API Keys</h1>
            <p className="text-gray-400">
              Manage REST API access for {activeCompanyId || 'selected company'}
            </p>
          </div>

          {/* New Key Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
            >
              + Generate API Key
            </button>
          )}

          {/* Create Key Form */}
          {showForm && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold mb-6">Generate New API Key</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Key Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Production - Main App"
                    value={formData.keyName}
                    onChange={(e) =>
                      setFormData({ ...formData, keyName: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Descriptive name for your reference
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availablePermissions.map((perm) => (
                      <label key={perm} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm)}
                          onChange={(e) => {
                            const newPerms = e.target.checked
                              ? [...formData.permissions, perm]
                              : formData.permissions.filter(p => p !== perm);
                            setFormData({ ...formData, permissions: newPerms });
                          }}
                          className="w-4 h-4 mr-2"
                        />
                        <span className="text-sm">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Requests Per Minute
                    </label>
                    <input
                      type="number"
                      value={formData.requestsPerMinute}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestsPerMinute: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Requests Per Day
                    </label>
                    <input
                      type="number"
                      value={formData.requestsPerDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestsPerDay: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition"
                  >
                    Generate Key
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Keys List */}
          {loading ? (
            <div className="text-center py-12">Loading API keys...</div>
          ) : keys.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No API keys configured yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{key.keyName}</h3>
                      <p className="text-sm text-gray-400 font-mono">{key.keyPrefix}...</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      getStatusColor(key.status)
                    }`}>
                      {key.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="bg-gray-900 rounded p-3">
                      <p className="text-gray-400">Rate Limit</p>
                      <p className="font-semibold">
                        {key.rateLimit.requestsPerMinute}/min, {key.rateLimit.requestsPerDay}/day
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded p-3">
                      <p className="text-gray-400">Created</p>
                      <p className="font-semibold">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-gray-900 rounded p-3">
                      <p className="text-gray-400">Last Used</p>
                      <p className="font-semibold">
                        {key.lastUsedAt
                          ? new Date(key.lastUsedAt).toLocaleDateString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {key.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {key.status === 'active' && (
                    <button
                      onClick={() => revokeKey(key.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                    >
                      Revoke Key
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* API Documentation Card */}
          <div className="mt-8 bg-blue-900 rounded-lg p-6 border border-blue-700">
            <h3 className="text-lg font-bold mb-3">📚 API Documentation</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Base URL: <code className="bg-black px-2 py-1 rounded">https://api.fieldcost.com/v1</code></li>
              <li>• Authentication: Include <code className="bg-black px-2 py-1 rounded">Authorization: Bearer {'{key}'}</code> header</li>
              <li>• Rate Limits: Enforced per minute and per day</li>
              <li>• Response Format: JSON</li>
              <li>• Full API docs: https://docs.fieldcost.com/api</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
