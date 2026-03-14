"use client";

import React, { useEffect, useState } from "react";
import TaskForm from "../TaskForm";
import TaskTimer from "../TaskTimer";
import { BackButton } from "../../../../app/components/BackButton";
import { ensureClientUserId } from "../../../../lib/clientUser";
import { readActiveCompanyId } from "../../../../lib/companySwitcher";

type CrewMember = { id: number; name: string; hourly_rate: number };
type Project = { id: number; name: string };

export default function AddTaskPage() {
  const [tab, setTab] = useState("Details");
  const tabs = ["Details", "Time", "Checklist", "Notes"];
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [crewError, setCrewError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const userId = await ensureClientUserId();
        const companyId = readActiveCompanyId();
        setUserId(userId);
        setCompanyId(companyId || "");
        
        if (!companyId) {
          if (active) setCrewError("Company context not available.");
          return;
        }
        
        const params = new URLSearchParams({ user_id: userId, company_id: companyId });
        
        // Load crew
        const crewRes = await fetch(`/api/crew?${params.toString()}`);
        if (crewRes.ok) {
          const data = await crewRes.json();
          if (active) setCrew(Array.isArray(data) ? data : []);
        }
        
        // Load projects
        const projectsRes = await fetch(`/api/projects?${params.toString()}`);
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          if (active) setProjects(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) setCrewError("Unable to load data.");
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Task</h1>
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
      {tab === "Details" && (
        <TaskForm
          crew={crew}
          projects={projects}
          userId={userId}
          companyId={companyId}
          onAdd={async task => {
            try {
              const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...task, user_id: userId, company_id: companyId }),
              });
              return res.ok;
            } catch {
              return false;
            }
          }}
          onProjectAdded={(project) => {
            setProjects((prev) => [...prev, project]);
          }}
        />
      )}
      {crewError && <div className="text-red-600 text-sm mt-4">{crewError}</div>}
      {tab === "Time" && (
        <TaskTimer
          onSave={async ({ name, seconds }) => {
            try {
              const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, seconds, user_id: userId }),
              });
              return res.ok;
            } catch {
              return false;
            }
          }}
        />
      )}
      {tab === "Checklist" && <div className="p-4 text-gray-500">Checklist here.</div>}
      {tab === "Notes" && <div className="p-4 text-gray-500">Task notes here.</div>}
    </main>
  );
}
