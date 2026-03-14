"use client";
import ProjectForm from "../ProjectForm";
import React, { useState } from "react";
import { BackButton } from "../../../../app/components/BackButton";

export default function AddProjectPage() {
  // Tab state
  const [tab, setTab] = useState("Details");
  const tabs = ["Details", "Activity", "Notes", "Settings"];

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Project</h1>
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
      {tab === "Details" && <ProjectForm onAdd={async (project) => {
        try {
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
          });
          return res.ok;
        } catch {
          return false;
        }
      }} />}
      {tab === "Activity" && <div className="p-4 text-gray-500">No activity yet.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Add project notes here.</div>}
      {tab === "Settings" && <div className="p-4 text-gray-500">Project settings coming soon.</div>}
    </main>
  );
}
