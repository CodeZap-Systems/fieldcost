/**
 * ADMIN CMS - Company Subscriptions Management Page
 * 
 * Manage active subscriptions, upgrades, downgrades, cancellations, and overrides
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { CompanySubscription, SubscriptionPlan } from "@/lib/cms-types";

export default function SubscriptionsManagementPage() {
  const { activeCompanyId, companies, switchCompany } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState<CompanySubscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("active");

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  async function fetchData() {
    try {
      const [subsRes, plansRes] = await Promise.all([
        fetch(`/api/admin/subscriptions?status=${filterStatus}`),
        fetch("/api/admin/plans"),
      ]);

      const subsData = await subsRes.json();
      const plansData = await plansRes.json();

      setSubscriptions(subsData.subscriptions || []);
      setPlans(plansData.plans || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function upgradeSubscription(
    companyId: string,
    newPlanId: string
  ) {
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          plan_id: newPlanId,
        }),
      });

      if (res.ok) {
        await fetchData();
        setSelectedSub(null);
      }
    } catch (err) {
      console.error("Failed to upgrade:", err);
    }
  }

  async function applyDiscount(
    companyId: string,
    discountPercent: number,
    reason: string
  ) {
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          discount_percent: discountPercent,
          discount_reason: reason,
        }),
      });

      if (res.ok) {
        await fetchData();
        setSelectedSub(null);
      }
    } catch (err) {
      console.error("Failed to apply discount:", err);
    }
  }

  async function cancelSubscription(companyId: string) {
    if (confirm("Cancel this subscription? The company will lose access.")) {
      try {
        const res = await fetch("/api/admin/subscriptions", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company_id: companyId,
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
          }),
        });

        if (res.ok) {
          await fetchData();
          setSelectedSub(null);
        }
      } catch (err) {
        console.error("Failed to cancel:", err);
      }
    }
  }

  const filteredSubs = subscriptions.filter((sub) =>
    sub.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.company?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="max-w-7xl mx-auto">
          {/* Demo Warning Info */}
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Changes to demo subscriptions are for testing only.
              </p>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Subscriptions</h1>
            <p className="text-gray-400">Manage company subscriptions and upgrades</p>
          </div>

        {/* Filters & Search */}
        <div className="mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Search by company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* List */}
          <div className="col-span-2">
            {loading ? (
              <div className="text-center py-12">Loading subscriptions...</div>
            ) : filteredSubs.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                No subscriptions found
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubs.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`bg-gray-800 rounded-lg p-6 border cursor-pointer transition ${
                      selectedSub?.id === sub.id
                        ? "border-blue-500"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {sub.company?.name || sub.company_id}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {sub.company?.email}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "active"
                            ? "bg-green-900 text-green-200"
                            : sub.status === "trial"
                            ? "bg-blue-900 text-blue-200"
                            : "bg-red-900 text-red-200"
                        }`}
                      >
                        {sub.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Current Plan</p>
                        <p className="text-xl font-bold">
                          {plans.find((p) => p.id === sub.plan_id)?.name || "Unknown"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Renewal</p>
                        <p className="text-sm font-mono">
                          {new Date(sub.renewal_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {sub.discount_percent > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-orange-400 text-sm">
                          🏷️ Discount: {sub.discount_percent}% ({sub.discount_reason})
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          {selectedSub && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-fit">
              <h3 className="text-lg font-bold mb-6">Details</h3>

              {/* Current Plan Info */}
              <div className="bg-gray-900 rounded p-4 mb-6">
                <p className="text-gray-400 text-sm mb-1">Current Plan</p>
                <p className="text-xl font-bold">
                  {(plans.find((p) => p.id === selectedSub.plan_id)?.name) ||
                    "Unknown"}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {selectedSub.billing_cycle === "monthly"
                    ? "Monthly"
                    : "Annual"}{" "}
                  billing
                </p>
              </div>

              {/* Upgrade Options */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-300 mb-3">
                  Upgrade to:
                </p>
                <div className="space-y-2">
                  {plans
                    .filter(
                      (p) =>
                        p.tier_level >
                        (plans.find((x) => x.id === selectedSub.plan_id)
                          ?.tier_level || 0)
                    )
                    .map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() =>
                          upgradeSubscription(selectedSub.company_id, plan.id)
                        }
                        className="w-full text-left px-3 py-2 bg-blue-900 hover:bg-blue-800 rounded text-sm transition"
                      >
                        → {plan.name} (R{plan.monthly_price}/mo)
                      </button>
                    ))}
                </div>
              </div>

              {/* Discount */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-300 mb-3">
                  Apply Discount:
                </p>
                <div className="space-y-2">
                  {[5, 10, 25, 50].map((percent) => (
                    <button
                      key={percent}
                      onClick={() =>
                        applyDiscount(
                          selectedSub.company_id,
                          percent,
                          `Manual discount applied`
                        )
                      }
                      className="w-full px-3 py-2 bg-green-900 hover:bg-green-800 rounded text-sm transition"
                    >
                      -{percent}% off
                    </button>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-gray-700 pt-6">
                <p className="text-xs text-gray-400 mb-3">DANGER ZONE</p>
                <button
                  onClick={() => cancelSubscription(selectedSub.company_id)}
                  className="w-full px-3 py-2 bg-red-900 hover:bg-red-800 rounded text-sm transition"
                >
                  🚨 Cancel Subscription
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-700 text-xs text-gray-400 space-y-1">
                <p>ID: {selectedSub.id.slice(0, 8)}...</p>
                <p>Company: {selectedSub.company_id.slice(0, 8)}...</p>
                <p>Status: {selectedSub.status}</p>
                <p>
                  Created: {new Date(selectedSub.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
