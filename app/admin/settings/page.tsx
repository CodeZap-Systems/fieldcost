/**
 * ADMIN CMS - System Settings Page
 * 
 * Configure payment processors, email settings, and system defaults
 */

"use client";

import React, { useState, useEffect } from "react";

interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description: string;
  type: "string" | "number" | "boolean" | "json";
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings || []);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSetting(key: string, value: string) {
    try {
      const res = await fetch(`/api/admin/settings?key=${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (res.ok) {
        await fetchSettings();
        setEditingKey(null);
        alert("Setting updated successfully");
      }
    } catch (err) {
      console.error("Failed to update setting:", err);
      alert("Failed to update setting");
    }
  }

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      const category = setting.key.split("_")[0];
      if (!acc[category]) acc[category] = [];
      acc[category].push(setting);
      return acc;
    },
    {} as Record<string, SystemSettings[]>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-400">Configure application behavior and integrations</p>
        </div>

        {/* Settings Sections */}
        {loading ? (
          <div className="text-center">Loading settings...</div>
        ) : Object.keys(groupedSettings).length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center text-gray-400 border border-gray-700">
            No settings found. Contact support to configure your system.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSettings).map(([category, categorySettings]) => (
              <div
                key={category}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                  <h2 className="text-xl font-bold capitalize">
                    {category.replace(/_/g, " ")} Settings
                  </h2>
                </div>

                {/* Settings List */}
                <div className="divide-y divide-gray-700">
                  {categorySettings.map((setting) => (
                    <div
                      key={setting.key}
                      className="px-6 py-4 hover:bg-gray-700/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm text-blue-400">
                            {setting.key}
                          </p>
                          {setting.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {setting.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        {editingKey === setting.key ? (
                          <div className="flex gap-2">
                            {setting.type === "boolean" ? (
                              <select
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white text-sm"
                              >
                                <option value="true">Enabled</option>
                                <option value="false">Disabled</option>
                              </select>
                            ) : (
                              <input
                                type={
                                  setting.type === "number" ? "number" : "text"
                                }
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 bg-gray-700 border border-gray-600 px-3 py-2 rounded text-white text-sm"
                              />
                            )}
                            <button
                              onClick={() =>
                                updateSetting(setting.key, editValue)
                              }
                              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="bg-gray-900 px-3 py-2 rounded text-sm font-mono">
                              {setting.value}
                            </div>
                            <button
                              onClick={() => {
                                setEditingKey(setting.key);
                                setEditValue(setting.value);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Panel */}
        <div className="mt-12 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
          <p className="text-sm">
            <span className="font-semibold">ℹ️ System Settings Info:</span> These
            settings control global system behavior. Changes take effect immediately.
            Contact support if you need to adjust payment processor configurations.
          </p>
        </div>
      </div>
    </div>
  );
}
