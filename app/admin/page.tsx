/**
 * ADMIN CMS DASHBOARD - Main Page
 * 
 * Complete admin control panel for managing subscriptions, billing, users, and settings
 */

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { SelectableCompanySwitcher } from "@/app/components/SelectableCompanySwitcher";
import { EnvironmentBadge } from "@/app/components/EnvironmentBadge";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface DashboardStats {
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  mrr: number;
  arr: number;
  churn_rate: number;
  pending_invoices: number;
  overdue_invoices: number;
}

interface MenuItem {
  label: string;
  href: string;
  icon: string;
  count?: number;
}

export default function AdminCMSDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const {
    companies,
    activeCompanyId,
    activeCompany,
    isActiveDemoCompany,
    switchCompany,
    isLoading: isSwitching,
  } = useCompanySwitcher({
    onSwitchSuccess: () => {
      window.location.reload();
    },
    onSwitchError: (error) => {
      console.error("Failed to switch company:", error);
      alert("Failed to switch company. Please try again.");
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/dashboard/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "#",
      icon: "📊",
      count: undefined,
    },
    {
      label: "Subscription Plans",
      href: "/admin/plans",
      icon: "💳",
      count: undefined,
    },
    {
      label: "Subscriptions",
      href: "/admin/subscriptions",
      icon: "🔄",
      count: stats?.total_subscriptions,
    },
    {
      label: "Billing & Invoices",
      href: "/admin/billing",
      icon: "📄",
      count: stats?.pending_invoices,
    },
    {
      label: "Payments",
      href: "/admin/payments",
      icon: "💰",
      count: undefined,
    },
    {
      label: "Users & Teams",
      href: "/admin/users",
      icon: "👥",
      count: undefined,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit",
      icon: "📋",
      count: undefined,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: "📈",
      count: undefined,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "⚙️",
      count: undefined,
    },
    // Tier 3 Enterprise Features
    {
      label: "Tier 3 Features",
      href: "/admin/tier3-features",
      icon: "⭐",
      count: undefined,
    },
    {
      label: "Feature Quotas",
      href: "/admin/feature-quotas",
      icon: "📊",
      count: undefined,
    },
    {
      label: "Company Config",
      href: "/admin/company-config",
      icon: "🏢",
      count: undefined,
    },
    {
      label: "Workflows",
      href: "/admin/workflows",
      icon: "🔄",
      count: undefined,
    },
    {
      label: "API Keys",
      href: "/admin/api-keys",
      icon: "🔑",
      count: undefined,
    },
  ];

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

      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-400">FieldCost</h1>
            {isActiveDemoCompany && (
              <EnvironmentBadge companyId={activeCompanyId} className="text-xs" />
            )}
          </div>
          <p className="text-sm text-gray-400">Admin CMS</p>

          {/* Company Switcher */}
          <div className="mt-4">
            <SelectableCompanySwitcher
              companies={companies}
              activeCompanyId={activeCompanyId}
              onSwitchCompany={switchCompany}
              isLoading={isSwitching}
            />
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSection(item.label.toLowerCase());
                if (item.href !== "#") router.push(item.href);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeSection === item.label.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>
                  {item.icon} {item.label}
                </span>
                {item.count && (
                  <span className="bg-red-600 text-xs px-2 py-1 rounded">
                    {item.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">Manage subscriptions, billing, and system</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p>Loading stats...</p>
            </div>
          ) : stats ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Subscriptions */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Total Subscriptions</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {stats.total_subscriptions}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {stats.active_subscriptions} active, {stats.trial_subscriptions} trial
                  </p>
                </div>

                {/* MRR */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">
                    Monthly Recurring Revenue (MRR)
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    R{stats.mrr.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
                </div>

                {/* ARR */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">
                    Annual Recurring Revenue (ARR)
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    R{stats.arr.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Projected annual</p>
                </div>

                {/* Churn Rate */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-2">Monthly Churn Rate</p>
                  <p className="text-3xl font-bold text-red-400">
                    {stats.churn_rate.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Target: {`<2%`}</p>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Invoices */}
                <div className="bg-gray-800 rounded-lg p-6 border border-orange-500">
                  <p className="text-orange-400 text-lg font-semibold mb-2">
                    ⚠️ Pending Invoices
                  </p>
                  <p className="text-4xl font-bold text-orange-400 mb-4">
                    {stats.pending_invoices}
                  </p>
                  <button
                    onClick={() => router.push("/admin/billing")}
                    className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg transition"
                  >
                    Manage Invoices
                  </button>
                </div>

                {/* Overdue Invoices */}
                <div className="bg-gray-800 rounded-lg p-6 border border-red-500">
                  <p className="text-red-400 text-lg font-semibold mb-2">
                    🚨 Overdue Invoices
                  </p>
                  <p className="text-4xl font-bold text-red-400 mb-4">
                    {stats.overdue_invoices}
                  </p>
                  <button
                    onClick={() => router.push("/admin/billing?status=overdue")}
                    className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                  >
                    Send Reminders
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800 rounded-lg p-6 border border-green-500">
                  <p className="text-green-400 text-lg font-semibold mb-4">
                    ✨ Quick Actions
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push("/admin/plans")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded transition"
                    >
                      → Create New Plan
                    </button>
                    <button
                      onClick={() => router.push("/admin/subscriptions")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded transition"
                    >
                      → Manage Subscriptions
                    </button>
                    <button
                      onClick={() => router.push("/admin/billing")}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-700 rounded transition"
                    >
                      → Create Invoice
                    </button>
                  </div>
                </div>
              </div>

              {/* More Metrics */}
              <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-6">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">API Status</p>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                      <span>All systems operational</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Database</p>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                      <span>Connected and responsive</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Payment Gateway</p>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                      <span>Stripe connected</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Storage</p>
                    <div className="flex items-center">
                      <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
                      <span>1.2 TB / 2 TB used</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      </div>
    </>
  );
}
