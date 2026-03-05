"use client";
import React, { useState } from "react";

export default function ItemReportsPage() {
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Stock", "Pricing", "Notes"];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Item Reports</h1>
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
      {tab === "Summary" && <div className="p-4 text-gray-500">Item summary report coming soon.</div>}
      {tab === "Stock" && <div className="p-4 text-gray-500">Stock report coming soon.</div>}
      {tab === "Pricing" && <div className="p-4 text-gray-500">Pricing report coming soon.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Item notes report coming soon.</div>}
    </main>
  );
}
