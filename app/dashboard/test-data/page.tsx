"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { readActiveCompanyId } from "@/lib/companySwitcher";
import { ensureClientUserId } from "@/lib/clientUser";
import { BackButton } from "@/app/components/BackButton";

export default function TestDataPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState({
    projects: 3,
    itemsPerProject: 5,
    invoicesPerProject: 3,
  });

  async function handleGenerateTestData() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const userId = await ensureClientUserId();
      const companyId = readActiveCompanyId();

      if (!companyId) {
        setError("No company selected");
        return;
      }

      const params = new URLSearchParams({
        user_id: userId,
        company_id: companyId,
        projects: String(config.projects),
        items_per_project: String(config.itemsPerProject),
        invoices_per_project: String(config.invoicesPerProject),
      });

      const response = await fetch(`/api/admin/generate-test-data?${params.toString()}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate test data");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  const companyId = readActiveCompanyId();

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Testing & Reports</h1>
        <BackButton />
      </div>

      {/* Test Data Generation Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Generate Test Data</h2>
        <p className="text-gray-600 mb-4">
          Create sample projects, items, and invoices to test report functionality.
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Projects
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={config.projects}
              onChange={(e) =>
                setConfig({ ...config, projects: parseInt(e.target.value, 10) || 1 })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Items Per Project
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={config.itemsPerProject}
              onChange={(e) =>
                setConfig({ ...config, itemsPerProject: parseInt(e.target.value, 10) || 1 })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoices Per Project
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={config.invoicesPerProject}
              onChange={(e) =>
                setConfig({ ...config, invoicesPerProject: parseInt(e.target.value, 10) || 1 })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateTestData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? "Generating..." : "Generate Test Data"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded p-6 mb-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">
            ✅ Test Data Generated Successfully!
          </h3>
          <div className="space-y-2 text-green-800">
            <p>
              <strong>Projects Created:</strong> {result.stats.projectsCreated}
            </p>
            <p>
              <strong>Items Created:</strong> {result.stats.itemsCreated}
            </p>
            <p>
              <strong>Invoices Created:</strong> {result.stats.invoicesCreated}
            </p>
            <p>
              <strong>Line Items Created:</strong> {result.stats.lineItemsCreated}
            </p>
          </div>
          <p className="text-green-700 mt-4 text-sm">
            You can now view the generated data in the reports section. The reports will automatically
            include the newly created data.
          </p>
        </div>
      )}

      {/* Reports Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/projects/reports/pandl"
            className="block p-4 border border-blue-200 rounded hover:bg-blue-50 transition"
          >
            <h3 className="font-bold text-blue-900">📊 Project P&L Report</h3>
            <p className="text-sm text-gray-600">
              Profit & Loss by project with revenue, costs, and margin analysis
            </p>
          </a>

          <a
            href="/dashboard/items/reports/margin"
            className="block p-4 border border-green-200 rounded hover:bg-green-50 transition"
          >
            <h3 className="font-bold text-green-900">📈 Item Margin Report</h3>
            <p className="text-sm text-gray-600">
              Profitability analysis for each item with cost vs selling price
            </p>
          </a>

          <a
            href="/dashboard/tasks/reports/crew-engagement"
            className="block p-4 border border-orange-200 rounded hover:bg-orange-50 transition"
          >
            <h3 className="font-bold text-orange-900">👥 Crew Engagement Report</h3>
            <p className="text-sm text-gray-600">
              Task assignments, hours, and labor costs by crew member
            </p>
          </a>

          <a
            href="/dashboard/invoices/reports"
            className="block p-4 border border-purple-200 rounded hover:bg-purple-50 transition"
          >
            <h3 className="font-bold text-purple-900">📄 Invoice Reports</h3>
            <p className="text-sm text-gray-600">
              Invoice status, totals, and payment tracking
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
