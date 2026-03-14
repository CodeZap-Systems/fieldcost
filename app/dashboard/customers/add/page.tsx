"use client";
import CustomerForm from "../CustomerForm";
import React, { useState } from "react";
import { BackButton } from "../../../../app/components/BackButton";

export default function AddCustomerPage() {
  const [tab, setTab] = useState("Details");
  const tabs = ["Details", "Activity", "Contacts", "Notes"];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Customer</h1>
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
      {tab === "Details" && <CustomerForm onAdd={async (customer) => {
        try {
          const res = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer),
          });
          return res.ok;
        } catch {
          return false;
        }
      }} />}
      {tab === "Activity" && <div className="p-4 text-gray-500">No activity yet.</div>}
      {tab === "Contacts" && <div className="p-4 text-gray-500">Add additional contacts here.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Add customer notes here.</div>}
    </main>
  );
}
