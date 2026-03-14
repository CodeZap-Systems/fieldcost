"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { readActiveCompanyId, persistActiveCompanyId } from "@/lib/companySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { BackButton } from "@/app/components/BackButton";

interface CompanyProfile {
  id: number;
  name: string;
  description?: string;
  is_demo?: boolean;
  created_at?: string;
}

export default function CompanySettingsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    async function loadCompany() {
      try {
        const companyId = readActiveCompanyId();
        if (!companyId) {
          setError("No company selected");
          setLoading(false);
          return;
        }

        const { data: user } = await supabase.auth.getUser();
        if (!user?.user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `/api/company?company_id=${companyId}&user_id=${user.user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load company");
        }

        const data = await response.json();
        const companyData = data.company || data;
        setCompany(companyData);
        setFormData({
          name: companyData.name || "",
          description: companyData.description || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  async function handleSaveCompany() {
    try {
      const companyId = readActiveCompanyId();
      if (!companyId || !company) return;

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch(`/api/company/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          user_id: user.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save company");
      }

      const updated = await response.json();
      setCompany(updated);
      setIsEditing(false);
      alert("Company settings saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  async function handleExitCompany() {
    const confirmed = confirm(
      "Are you sure you want to exit this company? You can switch back later."
    );
    if (!confirmed) return;

    persistActiveCompanyId(null);
    window.location.href = "/dashboard";
  }

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">Loading company settings...</div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <BackButton />
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error || "No company found"}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Company Settings</h1>
        <BackButton />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Company Overview Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Company Information</h2>

        <div className="space-y-4">
          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company ID
            </label>
            <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-600 font-mono">
              {company.id}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2">
                {company.name}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            ) : (
              <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 min-h-[80px]">
                {company.description || <span className="text-gray-400">No description</span>}
              </div>
            )}
          </div>

          {/* Demo Status */}
          {company.is_demo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> This is a demo company. To create a real company, exit this one and use the Setup Company option.
              </p>
            </div>
          )}

          {/* Created Date */}
          {company.created_at && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Created
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-600">
                {new Date(company.created_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Edit/Save Buttons */}
        <div className="flex gap-3 mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveCompany}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: company.name || "",
                    description: company.description || "",
                  });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
            >
              Edit Company
            </button>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-red-800 mb-4">
          Exit this company to switch to another company or create a new one.
        </p>
        <button
          onClick={handleExitCompany}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium"
        >
          Exit Company
        </button>
      </div>
    </main>
  );
}
