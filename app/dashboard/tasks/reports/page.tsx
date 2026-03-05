"use client";
import React, { useState } from "react";

export default function TaskReportsPage() {
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Time", "Checklist", "Notes"];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Reports</h1>
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
      {tab === "Summary" && <div className="p-4 text-gray-500">Task summary report coming soon.</div>}
      {tab === "Time" && <div className="p-4 text-gray-500">Time tracking report coming soon.</div>}
      {tab === "Checklist" && <div className="p-4 text-gray-500">Checklist report coming soon.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Task notes report coming soon.</div>}
    </main>
  );
}
