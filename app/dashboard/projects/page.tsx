"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProjectForm from "./ProjectForm";
import PhotoUpload from "./PhotoUpload";
import BudgetActual from "./BudgetActual";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoProjects } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";

const PROJECT_LIMIT = 6;

type ProjectRow = { id?: number; name: string; description: string; photo_url?: string; demo?: boolean };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; description: string }>({ name: "", description: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const allowDemoData = userId ? canUseDemoFixtures(userId) : false;

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(() => {
        if (active) setError('Unable to determine user context.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const allowDemo = canUseDemoFixtures(userId);
    let active = true;
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/projects?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to load projects');
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : [];
        if (active && list.length > 0) {
          setProjects(list);
          setUsingDemoData(false);
        } else if (active && allowDemo) {
          setProjects(getDemoProjects(userId));
          setUsingDemoData(true);
        } else if (active) {
          setProjects([]);
          setUsingDemoData(false);
        }
      } catch (err) {
        if (!active) return;
        if (allowDemo) {
          setProjects(getDemoProjects(userId));
          setUsingDemoData(true);
        } else {
          setProjects([]);
          setUsingDemoData(false);
        }
        setError((err as Error).message || 'Failed to load projects');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchProjects();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleAdd(project: { name: string; description: string; planned_budget?: number; actual_budget?: number }) {
    if (!userId) {
      setError('Resolving user...');
      return false;
    }
    const realCount = projects.filter(p => !p.demo).length;
    if (realCount >= PROJECT_LIMIT) return false;
    setLoading(true);
    setError(null);
    try {
      const payload = { name: project.name, description: project.description, user_id: userId };
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add project");
      const newProject = await res.json();
      setProjects(prev => [newProject, ...prev.filter(p => !p.demo)]);
      setUsingDemoData(false);

      const hasBudgetValues = project.planned_budget !== undefined || project.actual_budget !== undefined;
      if (newProject?.id && hasBudgetValues) {
        const budgetRes = await fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: newProject.id,
            planned_amount: project.planned_budget ?? 0,
            actual_amount: project.actual_budget ?? 0,
            user_id: userId,
          }),
        });
        if (!budgetRes.ok) {
          console.warn("Failed to persist initial budget", await budgetRes.text());
        }
      }
      return true;
    } catch {
      setError("Failed to add project");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(project: ProjectRow & { id: number }) {
    if (project.demo) {
      setError("Demo projects are read-only. Add your own project to replace these samples.");
      return;
    }
    setEditing(project.id);
    setEditData({ name: project.name, description: project.description });
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;
    if (projects.find(p => p.id === editing)?.demo) {
      setError("Demo projects are read-only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...editData, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update project");
      const updated = await res.json();
      setProjects(prev => prev.map(p => p.id === editing ? updated : p));
      setEditing(null);
      setEditData({ name: "", description: "" });
    } catch {
      setError("Failed to update project");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!userId) return;
    const target = projects.find(p => p.id === id);
    if (target?.demo) {
      setError("Demo projects are read-only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch {
      setError("Failed to delete project");
    } finally {
      setLoading(false);
    }
  }

  async function handlePhotoUpload(projectId: number, url: string) {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId, photo_url: url, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update project photo");
      const updated = await res.json();
      setProjects(prev => prev.map(p => p.id === projectId ? updated : p));
    } catch {
      setError("Failed to update project photo");
    } finally {
      setLoading(false);
    }
  }
  const realProjectCount = projects.filter(p => !p.demo).length;

  return (
    <main className="p-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Projects (max {PROJECT_LIMIT})</h1>
        <Link href="/dashboard/invoices" className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
          Open invoicing
        </Link>
      </div>
      {allowDemoData && usingDemoData && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing mock projects for the demo workspace. Add your own project to switch to live data.
        </div>
      )}
      <ProjectForm onAdd={handleAdd} disabled={realProjectCount >= PROJECT_LIMIT} limit={PROJECT_LIMIT} />
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="mt-4">
        {projects.map((p, i) => (
          <li key={p.id ?? i} className="border-b py-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-2">
              {editing === p.id ? (
                <form onSubmit={handleUpdate} className="flex gap-2 flex-1">
                  <input
                    className="border p-1 rounded flex-1"
                    value={editData.name}
                    onChange={e => setEditData(ed => ({ ...ed, name: e.target.value }))}
                    required
                  />
                  <input
                    className="border p-1 rounded flex-1"
                    value={editData.description}
                    onChange={e => setEditData(ed => ({ ...ed, description: e.target.value }))}
                  />
                  <button className="bg-green-600 text-white px-2 py-1 rounded" type="submit">Save</button>
                  <button className="bg-gray-400 text-white px-2 py-1 rounded" type="button" onClick={() => setEditing(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <span className="font-semibold">{p.name}</span> — {p.description}
                  {p.id !== undefined && !p.demo ? (
                    <>
                      <button className="bg-yellow-500 text-white px-2 py-1 rounded ml-2" onClick={() => handleEdit(p as { id: number; name: string; description: string })}>Edit</button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded ml-2" onClick={() => handleDelete(p.id!)}>Delete</button>
                    </>
                  ) : (
                    <span className="ml-2 rounded-full border border-amber-200 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-600">Demo</span>
                  )}
                </>
              )}
            </div>
            {p.id && !p.demo ? (
              <div className="flex flex-col items-center w-full">
                <PhotoUpload projectId={p.id} onUpload={url => handlePhotoUpload(p.id!, url)} />
                {p.photo_url && (
                  <Image src={p.photo_url} alt="Project" width={128} height={128} className="mt-2 h-32 w-32 rounded object-cover shadow" />
                )}
                <BudgetActual projectId={p.id} userId={userId} />
              </div>
            ) : (
              p.photo_url && (
                <Image src={p.photo_url} alt="Project" width={128} height={128} className="mt-2 h-32 w-32 rounded object-cover shadow" />
              )
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
