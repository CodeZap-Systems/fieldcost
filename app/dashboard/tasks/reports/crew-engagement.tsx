"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ensureClientUserId } from "../../../../lib/clientUser";
import { readActiveCompanyId } from "../../../../lib/companySwitcher";
import { BackButton } from "../../../components/BackButton";

interface CrewStats {
  crewId: number;
  crewName: string;
  hourlyRate: number;
  tasksAssigned: number;
  tasksCompleted: number;
  totalHours: number;
  totalEarnings: number;
  projectsWorked: number;
}

interface TierData {
  crew: CrewStats[];
  totalTasks: number;
  totalHours: number;
  totalEarnings: number;
  avgHourlyRate: number;
}

export default function CrewEngagementReportPage() {
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
        const response = await fetch(`/api/reports/crew-engagement?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load crew engagement report");
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
        <h1 className="text-3xl font-bold">Crew Engagement Report</h1>
        <BackButton />
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-600">{data.totalTasks}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Hours</p>
            <p className="text-3xl font-bold text-orange-600">{data.totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Labor Cost</p>
            <p className="text-3xl font-bold text-green-600">R{data.totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Avg Hourly Rate</p>
            <p className="text-3xl font-bold text-purple-600">R{data.avgHourlyRate.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Crew Details Table */}
      {loading && <div className="py-8 text-center text-gray-600">Loading report...</div>}

      {error && <div className="py-8 px-6 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      {data && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Crew Member</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Hourly Rate</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Tasks</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Completed</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Hours</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Labor Cost</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.crew.map((member) => (
                <tr key={member.crewId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link
                      href={`/dashboard/crew/${member.crewId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {member.crewName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    R{member.hourlyRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {member.tasksAssigned}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-green-600">
                    {member.tasksCompleted}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {member.totalHours.toFixed(1)}h
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    R{member.totalEarnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">
                    {member.projectsWorked}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 border-t-2 border-gray-300 font-bold">
                <td className="px-6 py-4 text-sm text-gray-900">Total</td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">-</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900">{data.totalTasks}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900">-</td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">{data.totalHours.toFixed(1)}h</td>
                <td className="px-6 py-4 text-right text-sm text-gray-900">R{data.totalEarnings.toFixed(2)}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-900">-</td>
              </tr>
            </tbody>
          </table>

          {data.crew.length === 0 && (
            <div className="py-8 text-center text-gray-500">No crew engagement data available</div>
          )}
        </div>
      )}
    </main>
  );
}
