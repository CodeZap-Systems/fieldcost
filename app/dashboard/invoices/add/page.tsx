"use client";
import InvoiceForm from "../InvoiceForm";
import React, { useState } from "react";

export default function AddInvoicePage() {
  const [tab, setTab] = useState("Details");
  const tabs = ["Details", "Line Items", "Payments", "Notes"];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Invoice</h1>
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
      {tab === "Details" && <InvoiceForm onAdd={async (invoice) => {
        try {
          const res = await fetch("/api/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoice),
          });
          return res.ok;
        } catch {
          return false;
        }
      }} />}
      {tab === "Line Items" && <div className="p-4 text-gray-500">Add line items here.</div>}
      {tab === "Payments" && <div className="p-4 text-gray-500">Add payments here.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Invoice notes here.</div>}
    </main>
  );
}
