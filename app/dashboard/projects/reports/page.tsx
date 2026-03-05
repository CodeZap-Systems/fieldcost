"use client";
import React, { useMemo, useState } from "react";
import { calculateWipRetention } from "@/lib/wipRetention";

function formatCurrency(value: number, decimals = 0): string {
  const fixed = value.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export default function ProjectReportsPage() {
  const [tab, setTab] = useState("Summary");
  const [geoQuery, setGeoQuery] = useState("Johannesburg, South Africa");
  const [geoResult, setGeoResult] = useState<string>("");
  const [geoLoading, setGeoLoading] = useState(false);
  const tabs = ["Summary", "WIP", "Approvals", "Gantt", "Geo"];

  const projectMetrics = useMemo(
    () =>
      calculateWipRetention({
        contractValue: 1200000,
        percentComplete: 62,
        billedToDate: 650000,
        retentionPercent: 10,
      }),
    []
  );

  const approvals = [
    { id: "APR-101", item: "Invoice FC-2201", status: "pending", approver: "Operations Manager" },
    { id: "APR-102", item: "Variation Order VO-44", status: "approved", approver: "Commercial Lead" },
    { id: "APR-103", item: "Retention Release RR-12", status: "pending", approver: "Finance Lead" },
  ];

  const ganttRows = [
    { task: "Mobilisation", start: 1, duration: 2 },
    { task: "Earthworks", start: 3, duration: 5 },
    { task: "Concrete", start: 8, duration: 4 },
    { task: "Commissioning", start: 12, duration: 2 },
  ];

  async function handleGeocode() {
    setGeoLoading(true);
    setGeoResult("");
    try {
      const response = await fetch(`/api/geocode?query=${encodeURIComponent(geoQuery)}`);
      const payload = await response.json();
      if (!response.ok) {
        setGeoResult(payload?.error || "Geocoding failed");
        return;
      }
      if (!payload?.result) {
        setGeoResult("No coordinates found for this location.");
        return;
      }
      setGeoResult(
        `${payload.result.displayName} → ${payload.result.latitude.toFixed(6)}, ${payload.result.longitude.toFixed(6)}`
      );
    } catch {
      setGeoResult("Geocoding failed.");
    } finally {
      setGeoLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Reports</h1>
      <div className="mb-4 flex gap-2 border-b">
        {tabs.map(t => (
          <button
            key={t}
            className={`px-4 py-2 font-semibold border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Summary" && (
        <div className="p-4 text-gray-700 space-y-2">
          <p>Staging-ready Tier 2 reporting surfaces are enabled on this page.</p>
          <p>Use WIP, approvals, gantt, and geolocation tabs to validate each feature before production release.</p>
        </div>
      )}
      {tab === "WIP" && (
        <div className="p-4 border rounded-lg bg-white space-y-2">
          <h2 className="font-semibold">WIP + Retention Calculations</h2>
          <p suppressHydrationWarning>Earned Value: R{formatCurrency(projectMetrics.earnedValue, 2)}</p>
          <p suppressHydrationWarning>WIP Amount: R{formatCurrency(projectMetrics.wipAmount, 2)}</p>
          <p suppressHydrationWarning>Retention (10%): R{formatCurrency(projectMetrics.retentionAmount, 2)}</p>
          <p className="font-semibold" suppressHydrationWarning>Net Claimable: R{formatCurrency(projectMetrics.netClaimable, 2)}</p>
        </div>
      )}
      {tab === "Approvals" && (
        <div className="p-4 border rounded-lg bg-white space-y-3">
          <h2 className="font-semibold">Approval Workflow Queue</h2>
          {approvals.map(entry => (
            <div key={entry.id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{entry.item}</p>
                <p className="text-xs text-gray-500">{entry.id} • Approver: {entry.approver}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${entry.status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {entry.status}
              </span>
            </div>
          ))}
        </div>
      )}
      {tab === "Gantt" && (
        <div className="p-4 border rounded-lg bg-white space-y-3">
          <h2 className="font-semibold">Gantt Chart</h2>
          {ganttRows.map(row => (
            <div key={row.task}>
              <div className="text-sm text-gray-700 mb-1">{row.task}</div>
              <div className="relative h-6 bg-gray-100 rounded">
                <div
                  className="absolute h-6 rounded bg-indigo-500"
                  style={{ left: `${row.start * 6}%`, width: `${row.duration * 6}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "Geo" && (
        <div className="p-4 border rounded-lg bg-white space-y-3">
          <h2 className="font-semibold">Geolocation (OpenStreetMap)</h2>
          <div className="flex gap-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              value={geoQuery}
              onChange={e => setGeoQuery(e.target.value)}
              placeholder="Search site address"
            />
            <button
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              onClick={handleGeocode}
              disabled={geoLoading}
            >
              {geoLoading ? "Searching..." : "Locate"}
            </button>
          </div>
          {geoResult && <p className="text-sm text-gray-700">{geoResult}</p>}
        </div>
      )}
    </main>
  );
}
