/**
 * Tier 2 Dashboard (Growth)
 * Includes: Advanced Reporting, Budget Forecasting, Light ERP Sync
 */
"use client";

import { useState, useEffect } from "react";
import { readActiveCompanyId } from "@/lib/companySwitcher";

interface SyncResult {
  success: boolean;
  message: string;
  details?: Record<string, unknown>;
}

export function Tier2Dashboard() {
  const [xeroConnected, setXeroConnected] = useState(false);
  const [sageConnected, setSageConnected] = useState(false);
  const [xeroSyncing, setXeroSyncing] = useState(false);
  const [sageSyncing, setSageSyncing] = useState(false);
  const [xeroSyncResult, setXeroSyncResult] = useState<SyncResult | null>(null);
  const [sageSyncResult, setSageSyncResult] = useState<SyncResult | null>(null);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

  useEffect(() => {
    // Get active company ID
    const companyId = readActiveCompanyId();
    setActiveCompanyId(companyId);

    // Check for existing Xero connection in localStorage
    const xeroToken = localStorage.getItem("xero_access_token");
    if (xeroToken) {
      setXeroConnected(true);
    }

    // Check for Sage connection
    const sageToken = localStorage.getItem("sage_api_token");
    if (sageToken) {
      setSageConnected(true);
    }
  }, []);

  const handleXeroConnect = async () => {
    if (!activeCompanyId) {
      alert("Please select a company first");
      return;
    }

    // If already connected, trigger a sync
    if (xeroConnected) {
      await syncXeroData();
      return;
    }

    // Otherwise, start OAuth flow
    try {
      setXeroSyncing(true);
      // Redirect to Xero OAuth
      const redirectUri = `${window.location.origin}/api/auth/callback/xero`;
      const clientId = process.env.NEXT_PUBLIC_XERO_CLIENT_ID;
      
      if (!clientId) {
        setXeroSyncResult({ 
          success: false, 
          message: "Xero client ID is not configured" 
        });
        return;
      }

      const authUrl = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=offline_access accounting.contacts accounting.transactions&state=${activeCompanyId}`;
      window.location.href = authUrl;
    } catch (error) {
      setXeroSyncResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to initiate Xero connection",
      });
      setXeroSyncing(false);
    }
  };

  const syncXeroData = async () => {
    if (!activeCompanyId) {
      alert("Please select a company first");
      return;
    }

    try {
      setXeroSyncing(true);
      const response = await fetch("/api/xero/sync/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: activeCompanyId }),
      });

      const data = await response.json();
      setXeroSyncResult(data);
      
      if (data.success) {
        setXeroConnected(true);
      }
    } catch (error) {
      setXeroSyncResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to sync Xero data",
      });
    } finally {
      setXeroSyncing(false);
    }
  };

  const handleSageConnect = async () => {
    if (!activeCompanyId) {
      alert("Please select a company first");
      return;
    }

    // If already connected, trigger a sync
    if (sageConnected) {
      await syncSageData();
      return;
    }

    // Otherwise, show config message
    setSageSyncResult({
      success: false,
      message: "Sage integration requires API credentials to be configured. Please contact support.",
    });
  };

  const syncSageData = async () => {
    if (!activeCompanyId) {
      alert("Please select a company first");
      return;
    }

    try {
      setSageSyncing(true);
      const response = await fetch("/api/sage/sync/full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: activeCompanyId }),
      });

      const data = await response.json();
      setSageSyncResult(data);
      
      if (data.success) {
        setSageConnected(true);
      }
    } catch (error) {
      setSageSyncResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to sync Sage data",
      });
    } finally {
      setSageSyncing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">📈 Tier 2: Growth Dashboard</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* All Tier 1 + Tier 2 Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">✅ Tier 1 Features (Included)</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Project Management</li>
            <li>✓ Crew Scheduling</li>
            <li>✓ Basic Invoicing</li>
            <li>✓ Expense Tracking</li>
            <li>✓ Task Management</li>
          </ul>
        </div>

        <div className="bg-blue-100 border border-blue-400 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🆕 Tier 2 Features (New)</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Advanced Reporting - Profit margin, project profitability</li>
            <li>✓ Budget Forecasting - Predict budget vs actual</li>
            <li>✓ Customer Analytics - Revenue per customer, trends</li>
            <li>✓ Light ERP Sync - Manual data pull from accounting</li>
            <li>✓ Custom Dashboards - Build your own reports</li>
          </ul>
        </div>
      </div>

      {/* ERP Integration Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          🔗 ERP Integration (Accounting Sync)
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          Connect your FieldCost data with Xero or Sage to sync invoices, expenses, and customer data directly to your accounting system.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Xero Integration */}
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Xero</h4>
                <p className="text-xs text-gray-500">Cloud accounting platform</p>
              </div>
              <span className="text-3xl">🔐</span>
            </div>
            <button
              onClick={handleXeroConnect}
              disabled={xeroSyncing}
              className={`w-full py-2 rounded transition text-sm font-medium ${
                xeroSyncing
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : xeroConnected
                  ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600"
              }`}
            >
              {xeroSyncing ? "⏳ Syncing..." : xeroConnected ? "✓ Connected - Sync Now" : "Connect Xero"}
            </button>
            {xeroConnected && !xeroSyncing && (
              <p className="text-xs text-green-600 mt-2">✓ Connected and syncing</p>
            )}
            {xeroSyncResult && (
              <div className={`mt-2 text-xs p-2 rounded ${xeroSyncResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {xeroSyncResult.message}
              </div>
            )}
          </div>

          {/* Sage Integration */}
          <div className="bg-white border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">Sage</h4>
                <p className="text-xs text-gray-500">Business accounting</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
            <button
              onClick={handleSageConnect}
              disabled={sageSyncing}
              className={`w-full py-2 rounded transition text-sm font-medium ${
                sageSyncing
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : sageConnected
                  ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                  : "bg-amber-600 hover:bg-amber-700 text-white border border-amber-600"
              }`}
            >
              {sageSyncing ? "⏳ Syncing..." : sageConnected ? "✓ Connected - Sync Now" : "Connect Sage"}
            </button>
            {sageConnected && !sageSyncing && (
              <p className="text-xs text-green-600 mt-2">✓ Connected and syncing</p>
            )}
            {sageSyncResult && (
              <div className={`mt-2 text-xs p-2 rounded ${sageSyncResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {sageSyncResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Available Reports</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Project Profitability", icon: "📊" },
            { title: "Crew Utilization", icon: "👥" },
            { title: "Revenue Forecast", icon: "📈" },
            { title: "Cost Analysis", icon: "💰" },
          ].map((report, idx) => (
            <button
              key={idx}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-left"
            >
              <div className="text-2xl mb-2">{report.icon}</div>
              <div className="font-medium text-gray-900">{report.title}</div>
              <div className="text-xs text-gray-500 mt-1">Click to generate</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
