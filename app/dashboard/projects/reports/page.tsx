"use client";
import React, { useState } from "react";

export default function ProjectReportsPage() {
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Budget", "Activity", "Notes"];

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
      {tab === "Summary" && <div className="p-4 text-gray-500">Project summary report coming soon.</div>}
      {tab === "Budget" && <div className="p-4 text-gray-500">Budget report coming soon.</div>}
      {tab === "Activity" && <div className="p-4 text-gray-500">Project activity log coming soon.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Project notes report coming soon.</div>}
    </main>
  );
}
