"use client";
import ItemForm from "../ItemForm";
import React, { useState, useEffect } from "react";
import { BackButton } from "../../../../app/components/BackButton";

export default function AddItemPage() {
  const [tab, setTab] = useState("Details");
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const tabs = ["Details", "Stock", "Pricing", "Notes"];

  // Load userId and companyId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("demoUserId");
    const storedCompanyId = localStorage.getItem("fieldcostActiveCompanyId");
    if (storedUserId) setUserId(storedUserId);
    if (storedCompanyId) setCompanyId(Number(storedCompanyId));
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Item</h1>
        <BackButton />
      </div>
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
      {tab === "Details" && <ItemForm onAdd={async (item) => {
        try {
          const res = await fetch("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...item, user_id: userId, company_id: companyId }),
          });
          return res.ok;
        } catch {
          return false;
        }
      }} />}
      {tab === "Stock" && <div className="p-4 text-gray-500">Stock information here.</div>}
      {tab === "Pricing" && <div className="p-4 text-gray-500">Pricing details here.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Item notes here.</div>}
    </main>
  );
}
