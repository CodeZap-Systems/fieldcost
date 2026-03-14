"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ensureClientUserId } from "../../../../lib/clientUser";
import { readActiveCompanyId } from "../../../../lib/companySwitcher";
import { BackButton } from "../../../components/BackButton";

interface ProjectPandL {
  projectId: number;
  projectName: string;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
  invoiceCount: number;
  itemCount: number;
}

interface TierData {
  projects: ProjectPandL[];
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  overallMargin: number;
}

export default function ProjectPandLReportPage() {
  const [tier, setTier] = useState<"tier1" | "tier2">("tier1");
  const [data, setData] = useState<TierData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchReport() {
      setLoading(true);
      setError(null);

      try {
        const userId = await ensureClientUserId();
        const companyId = readActiveCompanyId();

        if (!companyId) {
          setError("Company context not available");
          return;
        }

        const params = new URLSearchParams({ user_id: userId, company_id: companyId });
        const response = await fetch(`/api/reports/project-pandl?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load P&L report");
        }

        const reportData: TierData = await response.json();
        if (active) setData(reportData);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Project P&L Report</h1>
        <BackButton />
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-600">R{data.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Costs</p>
            <p className="text-3xl font-bold text-orange-600">R{data.totalCosts.toFixed(2)}</p>
          </div>
          <div className={`bg-white rounded-lg border border-gray-200 p-6 ${data.totalProfit >= 0 ? "border-green-200" : "border-red-200"}`}>
            <p className="text-gray-600 text-sm font-medium">Total Profit</p>
            <p className={`text-3xl font-bold ${data.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              R{data.totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Profit Margin</p>
            <p className="text-3xl font-bold text-purple-600">{data.overallMargin.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Project Details Table */}
      {loading && <div className="py-8 text-center text-gray-600">Loading report...</div>}

      {error && <div className="py-8 px-6 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      {data && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Project</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Costs</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Profit</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Margin %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Invoices</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.projects.map((project) => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      href={`/dashboard/projects/${project.projectId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {project.projectName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    R{project.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-orange-600">
                    R{project.costs.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-bold ${
                      project.profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    R{project.profit.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {project.profitMargin.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{project.invoiceCount}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{project.itemCount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {data.projects.length === 0 && (
            <div className="py-8 text-center text-gray-500">No project data available</div>
          )}
        </div>
      )}
    </main>
  );
}
