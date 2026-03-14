"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import KanbanBoard from "./KanbanBoard";
import TaskForm from "./TaskForm";
import TaskPhotoUpload from "./TaskPhotoUpload";
import { BackButton } from "../../../app/components/BackButton";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoTasks, getDemoCustomers, getDemoCrew, getDemoProjects } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";
import { readActiveCompanyId } from "../../../lib/companySwitcher";

type Task = {
  id: number;
  name: string;
  description?: string;
  seconds: number;
  status: string;
  photo_url?: string;
  assigned_to?: string | null;
  crew_member_id?: number | null;
  billable: boolean;
  crew_member?: CrewMember | null;
  project_id?: number | null;
  project?: Project | null;
  demo?: boolean;
};

type Customer = { id: number; name: string; demo?: boolean };
type CrewMember = { id: number; name: string; hourly_rate: number; demo?: boolean };
type Project = { id: number; name: string; demo?: boolean };

type RawTask = Partial<Task> & { id: number; crew_member?: CrewMember | null; project?: Project | null; demo?: boolean };

function formatSeconds(seconds = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function normalizeTask(task: RawTask): Task {
  const crewMember = task.crew_member ?? null;
  const crewMemberId = typeof task.crew_member_id === "number" ? task.crew_member_id : crewMember?.id ?? null;
  const project = task.project ?? null;
  const projectId = typeof task.project_id === "number" ? task.project_id : project?.id ?? null;
  return {
    id: task.id,
    name: task.name ?? "",
    description: task.description,
    seconds: typeof task.seconds === "number" ? task.seconds : 0,
    status: task.status ?? "todo",
    photo_url: task.photo_url,
    assigned_to: task.assigned_to ?? crewMember?.name ?? null,
    crew_member_id: crewMemberId,
    billable: typeof task.billable === "boolean" ? task.billable : true,
    crew_member: crewMember,
    project_id: projectId,
    project,
    demo: Boolean(task.demo),
  };
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [demoTasksData, setDemoTasksData] = useState(false);
  const [demoCustomersData, setDemoCustomersData] = useState(false);
  const [demoCrewData, setDemoCrewData] = useState(false);
  const [demoProjectsData, setDemoProjectsData] = useState(false);
  const [crewForm, setCrewForm] = useState({ name: "", rate: "" });
  const [crewFlash, setCrewFlash] = useState({ success: "", error: "" });
  const [crewSaving, setCrewSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoiceTask, setInvoiceTask] = useState<Task | null>(null);
  const [invoiceCustomer, setInvoiceCustomer] = useState<string>("");
  const [invoiceError, setInvoiceError] = useState("");
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isDemoTask = (taskId?: number | null) => (taskId ? tasks.find(task => task.id === taskId)?.demo : false);

  const fetchTasks = useCallback(async (resolvedUserId: string) => {
    const allowDemo = canUseDemoFixtures(resolvedUserId);
    try {
      const params = new URLSearchParams({ user_id: resolvedUserId });
      if (companyId) params.set('company_id', companyId);
      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load tasks");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      if (list.length) {
        setTasks(list.map(normalizeTask));
        setDemoTasksData(false);
      } else if (allowDemo && !companyId) {
        setTasks(getDemoTasks(resolvedUserId).map(normalizeTask));
        setDemoTasksData(true);
      } else {
        setTasks([]);
        setDemoTasksData(false);
      }
    } catch {
      if (allowDemo && !companyId) {
        setTasks(getDemoTasks(resolvedUserId).map(normalizeTask));
        setDemoTasksData(true);
      } else {
        setTasks([]);
        setDemoTasksData(false);
      }
      setError("Unable to load tasks");
    }
  }, [companyId]);

  const fetchCustomers = useCallback(async (resolvedUserId: string) => {
    const allowDemo = canUseDemoFixtures(resolvedUserId);
    try {
      const params = new URLSearchParams({ user_id: resolvedUserId });
      if (companyId) params.set('company_id', companyId);
      const res = await fetch(`/api/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      if (list.length) {
        setCustomers(list);
        setDemoCustomersData(false);
      } else if (allowDemo && !companyId) {
        setCustomers(getDemoCustomers(resolvedUserId));
        setDemoCustomersData(true);
      } else {
        setCustomers([]);
        setDemoCustomersData(false);
      }
    } catch {
      if (allowDemo && !companyId) {
        setCustomers(getDemoCustomers(resolvedUserId));
        setDemoCustomersData(true);
      } else {
        setCustomers([]);
        setDemoCustomersData(false);
      }
    }
  }, [companyId]);

  const fetchCrew = useCallback(async (resolvedUserId: string) => {
    const allowDemo = canUseDemoFixtures(resolvedUserId);
    try {
      const params = new URLSearchParams({ user_id: resolvedUserId });
      if (companyId) params.set('company_id', companyId);
      const res = await fetch(`/api/crew?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load crew");
      const data = await res.json();
      const roster = Array.isArray(data) ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : [];
      if (roster.length) {
        setCrew(roster);
        setDemoCrewData(false);
      } else if (allowDemo) {
        const fallback = getDemoCrew(resolvedUserId).sort((a, b) => a.name.localeCompare(b.name));
        setCrew(fallback);
        setDemoCrewData(true);
      } else {
        setCrew([]);
        setDemoCrewData(false);
      }
    } catch {
      if (allowDemo) {
        const fallback = getDemoCrew(resolvedUserId).sort((a, b) => a.name.localeCompare(b.name));
        setCrew(fallback);
        setDemoCrewData(true);
      } else {
        setCrew([]);
        setDemoCrewData(false);
      }
      setCrewFlash({ success: "", error: "Unable to load crew roster." });
    }
  }, [companyId]);

  const fetchProjects = useCallback(async (resolvedUserId: string) => {
    const allowDemo = canUseDemoFixtures(resolvedUserId);
    try {
      const params = new URLSearchParams({ user_id: resolvedUserId });
      if (companyId) params.set('company_id', companyId);
      const res = await fetch(`/api/projects?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      if (list.length) {
        setProjects(list);
        setDemoProjectsData(false);
      } else if (allowDemo && !companyId) {
        setProjects(getDemoProjects(resolvedUserId));
        setDemoProjectsData(true);
      } else {
        setProjects([]);
        setDemoProjectsData(false);
      }
    } catch {
      if (allowDemo && !companyId) {
        setProjects(getDemoProjects(resolvedUserId));
        setDemoProjectsData(true);
      } else {
        setProjects([]);
        setDemoProjectsData(false);
      }
    }
  }, [companyId]);

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(() => {
        if (active) setError("Unable to determine user context.");
      });
    return () => {
      active = false;
    };
  }, []);

  // Load active company ID
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCompanyId(readActiveCompanyId());
  }, []);

  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    async function bootstrap() {
      setLoading(true);
      await Promise.all([fetchTasks(userId), fetchCustomers(userId), fetchCrew(userId), fetchProjects(userId)]);
      if (mounted) setLoading(false);
    }
    bootstrap();
    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchCustomers, fetchCrew, fetchProjects, fetchTasks, userId]);

  async function handleAddTask(taskInput: { name: string; description: string; assigned_to?: string; crew_member_id?: number | null; project_id?: number | null; billable: boolean }) {
    if (!userId || !companyId) {
      setError("User or company context not available");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: taskInput.name,
        description: taskInput.description,
        status: "todo",
        seconds: 0,
        user_id: userId,
        company_id: companyId,
        assigned_to: taskInput.assigned_to || null,
        crew_member_id: taskInput.crew_member_id ?? null,
        project_id: taskInput.project_id ?? null,
        billable: taskInput.billable ?? true,
      };
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add task");
      const newTask = normalizeTask(await res.json());
      setTasks(prev => [newTask, ...prev.filter(task => !task.demo)]);
      setDemoTasksData(false);
      return true;
    } catch {
      setError("Failed to add task");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleCrewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !companyId) {
      setCrewFlash({ success: "", error: "User or company context not available" });
      return;
    }
    if (!crewForm.name.trim()) {
      setCrewFlash({ success: "", error: "Enter a crew name." });
      return;
    }
    const hourlyRate = Number(crewForm.rate || 0);
    if (!Number.isFinite(hourlyRate) || hourlyRate < 0) {
      setCrewFlash({ success: "", error: "Enter a valid hourly rate." });
      return;
    }
    setCrewSaving(true);
    setCrewFlash({ success: "", error: "" });
    try {
      const res = await fetch("/api/crew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: crewForm.name.trim(), hourly_rate: hourlyRate, user_id: userId, company_id: companyId }),
      });
      if (!res.ok) throw new Error("Failed to add crew");
      const newMember = await res.json();
      setCrew(prev => [...prev.filter(member => !member.demo), newMember].sort((a, b) => a.name.localeCompare(b.name)));
      setDemoCrewData(false);
      setCrewForm({ name: "", rate: "" });
      setCrewFlash({ success: "Crew member added.", error: "" });
    } catch {
      setCrewFlash({ success: "", error: "Failed to add crew member." });
    } finally {
      setCrewSaving(false);
    }
  }

  async function handleStatusChange(id: number, status: string) {
    if (!userId) return;
    if (isDemoTask(id)) {
      setError("Demo tasks are read-only.");
      return;
    }
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, user_id: userId }),
      });
      if (!res.ok) throw new Error();
      const updated = normalizeTask(await res.json());
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      setError("Failed to update status");
    }
  }

  function startTimer(taskId: number) {
    if (isDemoTask(taskId)) {
      setError("Demo tasks are read-only.");
      return;
    }
    const task = tasks.find(t => t.id === taskId);
    if (!task?.crew_member_id) {
      setError("Assign a crew member before starting the timer.");
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveTaskId(taskId);
    setTimerSeconds(0);
    timerRef.current = setInterval(() => setTimerSeconds(prev => prev + 1), 1000);
  }

  async function stopTimer(save = true) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!activeTaskId) return;
    if (!save) {
      setActiveTaskId(null);
      setTimerSeconds(0);
      return;
    }
    if (!userId) return;
    try {
      const runningTask = tasks.find(t => t.id === activeTaskId);
      if (runningTask?.demo) {
        setActiveTaskId(null);
        setTimerSeconds(0);
        return;
      }
      const totalSeconds = (runningTask?.seconds || 0) + timerSeconds;
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeTaskId, seconds: totalSeconds, user_id: userId }),
      });
      if (!res.ok) throw new Error();
      const updated = normalizeTask(await res.json());
      setTasks(prev => prev.map(t => (t.id === activeTaskId ? updated : t)));
    } catch {
      setError("Failed to save tracked time");
    } finally {
      setActiveTaskId(null);
      setTimerSeconds(0);
    }
  }

  async function handlePhotoUploaded(taskId: number, url: string) {
    if (isDemoTask(taskId)) {
      setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, photo_url: url } : task)));
      return;
    }
    if (!userId) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, photo_url: url, user_id: userId }),
      });
      if (!res.ok) throw new Error();
      const updated = normalizeTask(await res.json());
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    } catch {
      setError("Failed to attach photo");
    }
  }

  async function handleAssignmentChange(taskId: number, crewIdValue: string) {
    if (!userId) return;
    setError(null);
    try {
      const crewId = crewIdValue ? Number(crewIdValue) : null;
      const selected = crew.find(member => member.id === crewId) || null;
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          assigned_to: selected?.name ?? null,
          crew_member_id: crewId,
          user_id: userId,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = normalizeTask(await res.json());
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    } catch {
      setError("Failed to assign crew member");
    }
  }

  async function handleProjectChange(taskId: number, projectIdValue: string) {
    const projectId = projectIdValue ? Number(projectIdValue) : null;
    const projectMeta = projectId ? projects.find(project => project.id === projectId) ?? null : null;
    if (isDemoTask(taskId)) {
      setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, project_id: projectId, project: projectMeta } : task)));
      return;
    }
    if (!userId) return;
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, project_id: projectId, user_id: userId }),
      });
      if (!res.ok) throw new Error();
      const updated = normalizeTask(await res.json());
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
    } catch {
      setError("Failed to assign project");
    }
  }

  function openInvoice(task: Task) {
    if (!task.billable) return;
    setInvoiceTask(task);
    setInvoiceCustomer("" + (customers[0]?.id ?? ""));
    setInvoiceError("");
  }

  function closeInvoiceModal() {
    setInvoiceTask(null);
    setInvoiceCustomer("");
    setInvoiceError("");
  }

  function handleInvoiceConfirm() {
    if (!invoiceTask || !invoiceCustomer) {
      setInvoiceError("Select a customer to continue");
      return;
    }
    const params = new URLSearchParams({
      fromTask: invoiceTask.id.toString(),
      customerId: invoiceCustomer,
      taskName: invoiceTask.name,
      taskSeconds: String(invoiceTask.seconds || 0),
    });
    if (invoiceTask.project_id) {
      params.set("taskProjectId", String(invoiceTask.project_id));
    }
    if (invoiceTask.project?.name) {
      params.set("taskProjectName", invoiceTask.project.name);
    }
    router.push(`/dashboard/invoices?${params.toString()}`);
    closeInvoiceModal();
  }

  return (
    <main className="p-8 space-y-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks &amp; site evidence</h1>
          <p className="text-gray-600">Add tasks, capture proof, and push ready work to invoicing.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/invoices" className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
            Open invoicing
          </Link>
          <BackButton />
        </div>
      </header>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Crew roster</h2>
            <p className="text-sm text-gray-500">Capture who is on site and what their hourly rate is before assigning work.</p>
          </div>
          <form className="flex flex-col gap-2 md:flex-row md:items-end" onSubmit={handleCrewSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-500">Name</label>
              <input
                className="mt-1 border rounded px-3 py-2 text-sm"
                placeholder="Crew member"
                value={crewForm.name}
                onChange={e => setCrewForm(form => ({ ...form, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500">Rate (R/hr)</label>
              <input
                type="number"
                min="0"
                step="5"
                className="mt-1 border rounded px-3 py-2 text-sm"
                placeholder="400"
                value={crewForm.rate}
                onChange={e => setCrewForm(form => ({ ...form, rate: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded font-semibold mt-2 md:mt-0"
              disabled={crewSaving}
            >
              {crewSaving ? "Saving..." : "Add crew"}
            </button>
          </form>
        </div>
        {crewFlash.success && <div className="text-green-600 text-sm mt-3">{crewFlash.success}</div>}
        {crewFlash.error && <div className="text-red-600 text-sm mt-3">{crewFlash.error}</div>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {crew.length === 0 && <div className="text-sm text-gray-500">No crew captured yet.</div>}
          {crew.map(member => (
            <div key={member.id} className="border rounded-lg px-4 py-3">
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-500">R{Number(member.hourly_rate || 0).toFixed(2)} / hr</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Add a task</h2>
        <TaskForm onAdd={handleAddTask} crew={crew} projects={projects} />
      </section>

      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <section className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Live task tracker</h2>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 uppercase text-xs">
            <tr>
              <th className="py-2">Task</th>
              <th className="py-2">Status</th>
              <th className="py-2">Time &amp; proof</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">No tasks yet. Add one above to get started.</td>
              </tr>
            )}
            {tasks.map(task => (
              <tr key={task.id} className="border-t border-gray-100 align-top">
                <td className="py-3">
                  <p className="font-semibold text-gray-900">{task.name}</p>
                  {task.description && <p className="text-gray-500 text-xs">{task.description}</p>}
                  {task.project && <p className="text-xs text-indigo-600">Project: {task.project.name}</p>}
                  <p className={`mt-1 text-xs font-semibold ${task.billable ? "text-emerald-600" : "text-gray-500"}`}>
                    {task.billable ? "Billable" : "Non-billable"}
                  </p>
                </td>
                <td className="py-3">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={task.status}
                    onChange={e => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td className="py-3">
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500">Crew member</label>
                      <select
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        value={task.crew_member_id ?? ""}
                        onChange={e => handleAssignmentChange(task.id, e.target.value)}
                      >
                        <option value="">Select crew</option>
                        {crew.map(member => (
                          <option key={member.id} value={member.id}>
                            {member.name} — R{member.hourly_rate?.toFixed(0)}/hr
                          </option>
                        ))}
                      </select>
                      {!task.crew_member_id && <p className="mt-1 text-xs text-amber-600">Assign someone to unlock the timer.</p>}
                      {task.crew_member && (
                        <p className="mt-1 text-xs text-gray-500">{task.crew_member.name} @ R{Number(task.crew_member.hourly_rate || 0).toFixed(2)}/hr</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500">Project</label>
                      <select
                        className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        value={task.project_id ?? ""}
                        onChange={e => handleProjectChange(task.id, e.target.value)}
                      >
                        <option value="">Select project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                      {!task.project_id && <p className="mt-1 text-xs text-amber-600">Link a project before invoicing.</p>}
                      {task.project && <p className="mt-1 text-xs text-gray-500">Linked to {task.project.name}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-lg">
                        {formatSeconds((task.seconds || 0) + (activeTaskId === task.id ? timerSeconds : 0))}
                      </span>
                      {activeTaskId === task.id ? (
                        <>
                          <button className="text-xs text-green-600" onClick={() => stopTimer(true)}>Save</button>
                          <button className="text-xs text-gray-500" onClick={() => stopTimer(false)}>Cancel</button>
                        </>
                      ) : (
                        <button
                          className="text-xs text-indigo-600 disabled:text-gray-400"
                          onClick={() => startTimer(task.id)}
                          disabled={!task.crew_member_id}
                        >
                          Start timer
                        </button>
                      )}
                    </div>
                    <TaskPhotoUpload taskId={task.id} onUploaded={url => handlePhotoUploaded(task.id, url)} />
                    {task.photo_url && (
                      <Image src={task.photo_url} alt="Task evidence" width={96} height={96} className="h-24 w-24 rounded border object-cover" />
                    )}
                  </div>
                </td>
                <td className="py-3 space-y-2">
                  <button
                    className={`${task.billable ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"} px-3 py-1 rounded text-xs`}
                    onClick={() => openInvoice(task)}
                    disabled={!task.billable}
                  >
                    Invoice
                  </button>
                  {!task.billable && <p className="text-xs text-gray-500">Switch to billable to invoice this work.</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Kanban board</h2>
          <p className="text-sm text-gray-500">Drag cards to update status or use the dropdown above.</p>
        </div>
        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
      </section>

      {invoiceTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">Invoice &ldquo;{invoiceTask.name}&rdquo;</h3>
            <p className="text-sm text-gray-500 mb-4">Choose the customer to send this work to. You will add line items on the invoice screen.</p>
            <label className="block text-sm font-medium mb-2">Customer</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={invoiceCustomer}
              onChange={e => {
                setInvoiceCustomer(e.target.value);
                setInvoiceError("");
              }}
            >
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
            {invoiceError && <div className="text-red-600 text-sm mt-2">{invoiceError}</div>}
            <div className="flex justify-end gap-3 mt-6">
              <button className="text-gray-600" onClick={closeInvoiceModal}>Cancel</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handleInvoiceConfirm}>Go to invoice</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
