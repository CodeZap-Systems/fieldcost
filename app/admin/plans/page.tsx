/**
 * ADMIN CMS - Subscription Plans Management Page
 * 
 * Create, edit, and manage subscription tiers (Tier 1, 2, 3)
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { SubscriptionPlan } from "@/lib/cms-types";

export default function PlansManagementPage() {
  const { activeCompanyId, companies, switchCompany } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tier_level: 1,
    description: "",
    monthly_price: 0,
    annual_price: 0,
    max_projects: -1,
    max_team_members: -1,
    max_invoices: -1,
    max_storage_gb: 5,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const method = editingPlan ? "PATCH" : "POST";
      const url = editingPlan 
        ? `/api/admin/plans?id=${editingPlan.id}`
        : "/api/admin/plans";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchPlans();
        setShowForm(false);
        setEditingPlan(null);
        setFormData({
          name: "",
          tier_level: 1,
          description: "",
          monthly_price: 0,
          annual_price: 0,
          max_projects: -1,
          max_team_members: -1,
          max_invoices: -1,
          max_storage_gb: 5,
        });
      }
    } catch (err) {
      console.error("Failed to save plan:", err);
    }
  }

  function startEdit(plan: SubscriptionPlan) {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      tier_level: plan.tier_level,
      description: plan.description,
      monthly_price: plan.monthly_price,
      annual_price: plan.annual_price || 0,
      max_projects: plan.max_projects,
      max_team_members: plan.max_team_members,
      max_invoices: plan.max_invoices,
      max_storage_gb: plan.max_storage_gb,
    });
    setShowForm(true);
  }

  async function deletePlan(id: string) {
    if (confirm("Are you sure? This will deactivate the plan.")) {
      try {
        const res = await fetch(`/api/admin/plans?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchPlans();
        }
      } catch (err) {
        console.error("Failed to delete plan:", err);
      }
    }
  }

  return (
    <>
      <DemoModeBanner
        companyId={activeCompanyId}
        onGotoLiveWorkspace={() => {
          const liveCompany = companies.find((c) => !isDemoCompany(c.id));
          if (liveCompany) {
            switchCompany(liveCompany.id);
          }
        }}
      />

      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Demo Warning Info */}
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Plan changes are for testing only.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-gray-400">Manage all subscription tiers</p>
          </div>

        {/* Add Plan Button */}
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowForm(true);
          }}
          className="mb-8 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
        >
          + New Plan
        </button>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold mb-6">
              {editingPlan ? "Edit Plan" : "Create New Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm mb-2">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g., Starter, Growth, Enterprise"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              {/* Tier Level */}
              <div>
                <label className="block text-sm mb-2">Tier Level</label>
                <select
                  value={formData.tier_level}
                  onChange={(e) =>
                    setFormData({ ...formData, tier_level: parseInt(e.target.value) })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                >
                  <option value={1}>Tier 1 - Starter</option>
                  <option value={2}>Tier 2 - Growth</option>
                  <option value={3}>Tier 3 - Enterprise</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm mb-2">Description</label>
                <textarea
                  placeholder="Plan description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                  rows={3}
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm mb-2">Monthly Price (R)</label>
                <input
                  type="number"
                  placeholder="99"
                  value={formData.monthly_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Annual Price (R)</label>
                <input
                  type="number"
                  placeholder="999"
                  value={formData.annual_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annual_price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              {/* Quotas */}
              <div>
                <label className="block text-sm mb-2">Max Projects (-1 = unlimited)</label>
                <input
                  type="number"
                  value={formData.max_projects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_projects: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Max Team Members</label>
                <input
                  type="number"
                  value={formData.max_team_members}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_team_members: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Max Invoices</label>
                <input
                  type="number"
                  value={formData.max_invoices}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_invoices: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Storage (GB)</label>
                <input
                  type="number"
                  value={formData.max_storage_gb}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_storage_gb: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                />
              </div>

              {/* Actions */}
              <div className="col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition"
                >
                  {editingPlan ? "Update Plan" : "Create Plan"}
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

        {/* Plans List */}
        {loading ? (
          <div className="text-center py-12">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.filter(p => p.is_active).map((plan) => (
              <div
                key={plan.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">Tier {plan.tier_level}</p>
                </div>

                <p className="text-gray-300 text-sm mb-4">{plan.description}</p>

                <div className="bg-gray-900 rounded p-4 mb-4">
                  <p className="text-gray-400 text-sm">Monthly</p>
                  <p className="text-3xl font-bold text-blue-400">
                    R{plan.monthly_price}
                  </p>
                  {plan.annual_price && (
                    <p className="text-gray-400 text-sm">
                      R{plan.annual_price}/year
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-300 mb-4 space-y-1">
                  <p>📁 Projects: {plan.max_projects === -1 ? "∞" : plan.max_projects}</p>
                  <p>👥 Team: {plan.max_team_members === -1 ? "∞" : plan.max_team_members}</p>
                  <p>📄 Invoices: {plan.max_invoices === -1 ? "∞" : plan.max_invoices}</p>
                  <p>💾 Storage: {plan.max_storage_gb}GB</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(plan)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
