"use client";
import { useEffect, useMemo, useState } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoCustomers, getDemoItems, getDemoProjects, getDemoTasks } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";

type Customer = { id: number; name: string; demo?: boolean };
type Item = { id: number; name: string; price: number; item_type?: string | null; demo?: boolean };
type Project = { id: number; name: string; demo?: boolean };
type TaskSummary = {
  id: number;
  name: string;
  seconds: number;
  billable?: boolean;
  project_id?: number | null;
  project?: { id: number; name: string } | null;
};
type LineItem = {
  id: string;
  itemId: number | "";
  quantity: number;
  projectId: number | "" | "__custom__";
  projectCustom: string;
  note: string;
  source?: "timer" | null;
  taskRef?: string | null;
};

interface InvoiceFormProps {
  onAdd: (invoice: {
    customerId: number;
    customerName: string;
    amount: number;
    description: string;
    reference: string;
    userId: string;
    lines: Array<{
      itemId: number | null;
      itemName: string;
      quantity: number;
      rate: number;
      total: number;
      project: string | null;
      note: string | null;
      source: string | null;
      taskRef: string | null;
    }>;
  }) => Promise<boolean>;
  preset?: {
    customerId?: string | null;
    taskId?: string | null;
    taskName?: string | null;
    taskSeconds?: string | null;
    taskProjectId?: string | null;
    taskProjectName?: string | null;
  };
}

const makeLineId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const newLineItem = (): LineItem => ({
  id: makeLineId(),
  itemId: "",
  quantity: 1,
  projectId: "",
  projectCustom: "",
  note: "",
  source: null,
  taskRef: null,
});

const MIN_TIME_HOURS = 0.25;

const secondsToHours = (seconds?: number | null) => {
  if (seconds === null || seconds === undefined) return null;
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value / 3600;
};

const formatDurationLabel = (hours: number) => {
  const totalMinutes = Math.max(1, Math.round(hours * 60));
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs && mins) return `${hrs}h ${mins}m`;
  if (hrs) return `${hrs}h`;
  return `${mins}m`;
};

const normalizeTaskPayload = (payload: any): TaskSummary | null => {
  const id = Number(payload?.id);
  if (!Number.isFinite(id)) return null;
  const seconds = Number(payload?.seconds) || 0;
  let projectIdCandidate: number | null = null;
  if (typeof payload?.project_id === "number" && Number.isFinite(payload.project_id)) {
    projectIdCandidate = payload.project_id;
  } else if (typeof payload?.project_id === "string") {
    const parsed = Number(payload.project_id);
    if (Number.isFinite(parsed)) projectIdCandidate = parsed;
  } else if (typeof payload?.project?.id === "number" && Number.isFinite(payload.project.id)) {
    projectIdCandidate = payload.project.id;
  } else if (typeof payload?.project?.id === "string") {
    const parsed = Number(payload.project.id);
    if (Number.isFinite(parsed)) projectIdCandidate = parsed;
  }
  const projectNameCandidate =
    typeof payload?.project?.name === "string"
      ? payload.project.name
      : typeof payload?.project_name === "string"
        ? payload.project_name
        : null;
  return {
    id,
    name: typeof payload?.name === "string" && payload.name.trim() ? payload.name : "Tracked task",
    seconds,
    billable: payload?.billable !== false,
    project_id: projectIdCandidate,
    project:
      projectNameCandidate
        ? { id: projectIdCandidate ?? id * -1, name: projectNameCandidate }
        : null,
  };
};

export default function InvoiceForm({ onAdd, preset }: InvoiceFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [customersDemo, setCustomersDemo] = useState(false);
  const [itemsDemo, setItemsDemo] = useState(false);
  const [projectsDemo, setProjectsDemo] = useState(false);
  const [tasksDemo, setTasksDemo] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>(preset?.customerId ?? "");
  const [reference, setReference] = useState(preset?.taskName ? `Work completed for task: ${preset.taskName}` : "");
  const presetSeconds = preset?.taskSeconds ? Number(preset.taskSeconds) : null;
  const presetHoursRaw = secondsToHours(presetSeconds);
  const trackedHours = presetHoursRaw ? Math.max(MIN_TIME_HOURS, Number(presetHoursRaw.toFixed(2))) : null;
  const presetProjectIdValue = preset?.taskProjectId ? Number(preset.taskProjectId) : null;
  const hasPresetProjectId = typeof presetProjectIdValue === "number" && Number.isFinite(presetProjectIdValue);
  const presetProjectName = preset?.taskProjectName?.trim() ?? "";
  const [lineItems, setLineItems] = useState<LineItem[]>([newLineItem()]);
  const [status, setStatus] = useState({ success: "", error: "" });

  const defaultTimeItemId = useMemo(() => {
    const serviceItem = items.find(item => item.item_type === "service");
    if (serviceItem) return serviceItem.id;
    const nonPhysical = items.find(item => item.item_type !== "physical");
    return nonPhysical?.id ?? items[0]?.id ?? "";
  }, [items]);

  const convertibleTasks = useMemo(
    () => tasks.filter(task => task.billable !== false && Number(task.seconds) > 0),
    [tasks]
  );

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(() => {
        if (active) setStatus({ success: "", error: "Unable to resolve workspace user." });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    const allowDemo = canUseDemoFixtures(userId);
    async function load() {
      try {
        const qs = new URLSearchParams({ user_id: userId });
        const [custRes, itemRes, projectRes, taskRes] = await Promise.all([
          fetch(`/api/customers?${qs.toString()}`),
          fetch(`/api/items?${qs.toString()}`),
          fetch(`/api/projects?${qs.toString()}`),
          fetch(`/api/tasks?${qs.toString()}`),
        ]);
        const [custPayload, itemPayload, projectPayload, taskPayload] = await Promise.all([
          custRes.ok ? custRes.json() : Promise.resolve([]),
          itemRes.ok ? itemRes.json() : Promise.resolve([]),
          projectRes.ok ? projectRes.json() : Promise.resolve([]),
          taskRes.ok ? taskRes.json() : Promise.resolve([]),
        ]);

        const custList = Array.isArray(custPayload) ? custPayload : [];
        if (custList.length) {
          setCustomers(custList);
          setCustomersDemo(false);
        } else if (allowDemo) {
          setCustomers(getDemoCustomers(userId));
          setCustomersDemo(true);
        } else {
          setCustomers([]);
          setCustomersDemo(false);
        }

        const itemList = Array.isArray(itemPayload) ? itemPayload : [];
        if (itemList.length) {
          setItems(itemList);
          setItemsDemo(false);
        } else if (allowDemo) {
          setItems(getDemoItems(userId));
          setItemsDemo(true);
        } else {
          setItems([]);
          setItemsDemo(false);
        }

        const projectList = Array.isArray(projectPayload) ? projectPayload : [];
        if (projectList.length) {
          setProjects(projectList);
          setProjectsDemo(false);
        } else if (allowDemo) {
          setProjects(getDemoProjects(userId));
          setProjectsDemo(true);
        } else {
          setProjects([]);
          setProjectsDemo(false);
        }

        const rawTasks = Array.isArray(taskPayload) ? taskPayload : [];
        const normalizedTasks = rawTasks
          .map(normalizeTaskPayload)
          .filter((task): task is TaskSummary => Boolean(task));
        if (normalizedTasks.length) {
          setTasks(normalizedTasks);
          setTasksDemo(false);
        } else if (allowDemo) {
          const demoTasks = getDemoTasks(userId).map(normalizeTaskPayload).filter(Boolean) as TaskSummary[];
          setTasks(demoTasks);
          setTasksDemo(true);
        } else {
          setTasks([]);
          setTasksDemo(false);
        }
      } catch {
        if (allowDemo) {
          setCustomers(getDemoCustomers(userId));
          setItems(getDemoItems(userId));
          setProjects(getDemoProjects(userId));
          const demoTasks = getDemoTasks(userId).map(normalizeTaskPayload).filter(Boolean) as TaskSummary[];
          setTasks(demoTasks);
          setCustomersDemo(true);
          setItemsDemo(true);
          setProjectsDemo(true);
          setTasksDemo(true);
        } else {
          setCustomers([]);
          setItems([]);
          setProjects([]);
          setTasks([]);
          setCustomersDemo(false);
          setItemsDemo(false);
          setProjectsDemo(false);
          setTasksDemo(false);
        }
        setStatus({ success: "", error: "Failed to load workspace data." });
      }
    }
    load();
  }, [userId]);

  useEffect(() => {
    if (preset?.customerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- keep form selection aligned when launching from task context
      setSelectedCustomer(preset.customerId);
    }
  }, [preset?.customerId]);

  useEffect(() => {
    if (!preset?.taskId || !trackedHours) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- inject timer-sourced line items based on external task data
    setLineItems(prev => {
      const hasTimerLine = prev.some(line => line.source === "timer" && line.taskRef === preset.taskId);
      if (hasTimerLine) return prev;
      const single = prev[0];
      const isSingleBlank =
        prev.length === 1 &&
        !single.itemId &&
        single.quantity === 1 &&
        !single.note &&
        (single.projectId === "" || single.projectId === undefined) &&
        !single.projectCustom;
      const remainder = isSingleBlank ? [] : prev;
      const timerLine: LineItem = {
        ...newLineItem(),
        itemId: defaultTimeItemId || "",
        quantity: trackedHours,
        projectId: hasPresetProjectId ? (presetProjectIdValue as number) : presetProjectName ? "__custom__" : "",
        projectCustom: hasPresetProjectId ? "" : presetProjectName,
        note: `Auto time from ${preset.taskName ?? "task"} (${formatDurationLabel(trackedHours)})`,
        source: "timer",
        taskRef: preset.taskId,
      };
      return [timerLine, ...remainder];
    });
  }, [
    preset?.taskId,
    preset?.taskName,
    trackedHours,
    hasPresetProjectId,
    presetProjectIdValue,
    presetProjectName,
    defaultTimeItemId,
  ]);

  useEffect(() => {
    if (!items.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- attach default item to auto-generated timer rows
    setLineItems(prev =>
      prev.map(line => {
        if (line.source === "timer" && !line.itemId) {
          return { ...line, itemId: defaultTimeItemId || items[0].id };
        }
        return line;
      })
    );
  }, [items, defaultTimeItemId]);

  const totals = useMemo(() => {
    return lineItems.map(item => {
      const match = items.find(i => i.id === item.itemId);
      const price = match?.price || 0;
      return price * (item.quantity || 0);
    });
  }, [items, lineItems]);

  const grandTotal = useMemo(() => totals.reduce((sum, value) => sum + value, 0), [totals]);

  function updateLine<T extends keyof LineItem>(id: string, field: T, value: LineItem[T]) {
    setLineItems(prev => prev.map(line => (line.id === id ? { ...line, [field]: value } : line)));
  }

  function addLine() {
    setLineItems(prev => [...prev, newLineItem()]);
  }

  function removeLine(id: string) {
    setLineItems(prev => (prev.length === 1 ? prev : prev.filter(line => line.id !== id)));
  }

  function resolveProjectLabel(line: LineItem) {
    if (line.projectId === "__custom__") {
      return line.projectCustom?.trim() || null;
    }
    if (typeof line.projectId === "number" && Number.isFinite(line.projectId)) {
      const match = projects.find(project => project.id === line.projectId);
      return match?.name ?? null;
    }
    return null;
  }

  function addTaskToInvoice(task: TaskSummary) {
    const hours = secondsToHours(task.seconds);
    if (!hours) {
      setStatus({ success: "", error: "This task has no tracked time yet." });
      return;
    }
    const normalizedHours = Math.max(MIN_TIME_HOURS, Number(hours.toFixed(2)));
    let added = false;
    setLineItems(prev => {
      if (prev.some(line => line.source === "timer" && line.taskRef === String(task.id))) {
        return prev;
      }
      added = true;
      const projectId = typeof task.project_id === "number" ? task.project_id : null;
      const projectName = task.project?.name ?? null;
      const timerLine: LineItem = {
        ...newLineItem(),
        itemId: defaultTimeItemId || "",
        quantity: normalizedHours,
        projectId: projectId ?? (projectName ? "__custom__" : ""),
        projectCustom: projectId ? "" : projectName ?? "",
        note: `Time from ${task.name} (${formatDurationLabel(normalizedHours)})`,
        source: "timer",
        taskRef: String(task.id),
      };
      return [timerLine, ...prev];
    });
    if (added) {
      setStatus({ success: `Added ${task.name} to the invoice.`, error: "" });
    } else {
      setStatus({ success: "", error: "That task is already on the invoice." });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ success: "", error: "" });
    if (customersDemo || itemsDemo) {
      setStatus({ success: "", error: "Demo data is read-only. Connect your workspace to send live invoices." });
      return;
    }
    if (!selectedCustomer) {
      setStatus({ success: "", error: "Select a customer." });
      return;
    }
    const validLines = lineItems.filter(line => line.itemId && line.quantity > 0);
    if (!validLines.length) {
      setStatus({ success: "", error: "Add at least one billable line." });
      return;
    }
    const customerMeta = customers.find(c => `${c.id}` === selectedCustomer);
    const customerId = customerMeta?.id ? Number(customerMeta.id) : Number(selectedCustomer);
    const customerName = customerMeta?.name;
    if (!customerName || !Number.isFinite(customerId)) {
      setStatus({ success: "", error: "Customer not found." });
      return;
    }
    if (!userId) {
      setStatus({ success: "", error: "Unable to determine workspace." });
      return;
    }
    const detailedLines = validLines.map(line => {
      const match = items.find(i => i.id === line.itemId);
      const rate = match?.price || 0;
      const total = rate * line.quantity;
      const projectLabel = resolveProjectLabel(line);
      return {
        itemId: match?.id ?? (typeof line.itemId === "number" ? line.itemId : null),
        itemName: match?.name ?? "Item",
        quantity: line.quantity,
        rate,
        total,
        project: projectLabel,
        note: line.note || null,
        source: line.source || null,
        taskRef: line.taskRef || null,
      };
    });
    const breakdown = validLines
      .map(line => {
        const match = items.find(i => i.id === line.itemId);
        const price = match?.price || 0;
        const total = price * line.quantity;
        const projectLabel = resolveProjectLabel(line);
        const projectTag = projectLabel ? ` • Project: ${projectLabel}` : "";
        const noteTag = line.note ? ` — ${line.note}` : "";
        return `${match?.name ?? "Item"} x${line.quantity} @ R${price.toFixed(2)} = R${total.toFixed(2)}${projectTag}${noteTag}`;
      })
      .join("\n");
    const narrative = [reference.trim(), breakdown].filter(Boolean).join("\n\n");
    const ok = await onAdd({
      customerId,
      customerName,
      amount: grandTotal,
      description: narrative,
      reference,
      userId,
      lines: detailedLines,
    });
    if (ok) {
      setStatus({ success: "Invoice added!", error: "" });
      setLineItems([newLineItem()]);
      setReference("");
      if (!preset?.customerId) setSelectedCustomer("");
    } else {
      setStatus({ success: "", error: "Failed to add invoice." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 w-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Create Invoice</h2>
        <p className="text-sm text-gray-500">Pull items directly from your price list and tag the project per line.</p>
        {(customersDemo || itemsDemo) && (
          <p className="mt-2 text-xs text-amber-700">Sample customers/items are shown for demo purposes. Add your own data to enable submissions.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Customer</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
          >
            <option value="">Select customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id} disabled={customer.demo}>
                {customer.name}
                {customer.demo ? " (demo)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Reference</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="e.g. Progress draw #3"
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line items</h3>
          <button type="button" className="text-indigo-600 font-medium" onClick={addLine}>+ Add line</button>
        </div>
        {lineItems.map((line, idx) => {
          const lineTotal = totals[idx] || 0;
          return (
            <div key={line.id} className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-1 block">Item</label>
                <select
                  className="border rounded w-full p-2"
                  value={line.itemId}
                  onChange={e => updateLine(line.id, "itemId", e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Select item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id} disabled={item.demo}>
                      {item.name} — R{item.price?.toFixed(2)}{item.demo ? " (demo)" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Qty</label>
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  className="border rounded w-full p-2"
                  value={line.quantity}
                  onChange={e => updateLine(line.id, "quantity", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">Project</label>
                <select
                  className="border rounded w-full p-2"
                  value={
                    line.projectId === "__custom__"
                      ? "__custom__"
                      : line.projectId === ""
                        ? ""
                        : String(line.projectId)
                  }
                  onChange={e => {
                    const raw = e.target.value;
                    setLineItems(prev =>
                      prev.map(entry => {
                        if (entry.id !== line.id) return entry;
                        if (raw === "__custom__") {
                          return { ...entry, projectId: "__custom__" };
                        }
                        if (raw === "") {
                          return { ...entry, projectId: "", projectCustom: "" };
                        }
                        const numeric = Number(raw);
                        if (!Number.isFinite(numeric)) return entry;
                        return { ...entry, projectId: numeric, projectCustom: "" };
                      })
                    );
                  }}
                >
                  <option value="">Unassigned</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id} disabled={project.demo}>
                      {project.name}
                      {project.demo ? " (demo)" : ""}
                    </option>
                  ))}
                  <option value="__custom__">Manual entry…</option>
                </select>
                {line.projectId === "__custom__" && (
                  <input
                    className="mt-2 border rounded w-full p-2"
                    placeholder="Project name"
                    value={line.projectCustom}
                    onChange={e => updateLine(line.id, "projectCustom", e.target.value)}
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold mb-1 block">Notes</label>
                <input
                  className="border rounded w-full p-2"
                  placeholder="Extra detail"
                  value={line.note}
                  onChange={e => updateLine(line.id, "note", e.target.value)}
                />
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-xs uppercase text-gray-500">Line total</span>
                <span className="text-lg font-semibold">R{lineTotal.toFixed(2)}</span>
                {lineItems.length > 1 && (
                  <button type="button" className="text-red-500 text-xs" onClick={() => removeLine(line.id)}>Remove</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Convert tracked tasks</h3>
            <p className="text-sm text-slate-600">Use saved timer entries to create service lines without retyping hours.</p>
          </div>
          {convertibleTasks.length > 3 && (
            <p className="text-xs text-slate-500">Showing {Math.min(convertibleTasks.length, 6)} of {convertibleTasks.length}</p>
          )}
        </div>
        {convertibleTasks.length ? (
          <div className="mt-4 space-y-3">
            {convertibleTasks.slice(0, 6).map(task => {
              const hoursValue = secondsToHours(task.seconds) || 0;
              const normalizedHours = hoursValue ? Math.max(MIN_TIME_HOURS, Number(hoursValue.toFixed(2))) : 0;
              const durationLabel = hoursValue ? formatDurationLabel(normalizedHours) : "0m";
              const projectLabel = task.project?.name;
              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{task.name}</p>
                    <p className="text-xs text-slate-500">
                      {durationLabel}
                      {projectLabel ? ` • ${projectLabel}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="self-start rounded border border-indigo-200 px-3 py-1 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                    onClick={() => addTaskToInvoice(task)}
                  >
                    Add to invoice
                  </button>
                </div>
              );
            })}
            {convertibleTasks.length > 6 && (
              <p className="text-xs text-slate-500">More tasks available — convert the rest from the Tasks screen.</p>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-600">No billable tasks with tracked time yet.</p>
        )}
        {tasksDemo && (
          <p className="mt-2 text-xs text-amber-700">Demo tasks are shown for illustration. Add live tasks to invoice them.</p>
        )}
      </section>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-sm text-gray-500">Actual spend</p>
          <p className="text-2xl font-bold">R{grandTotal.toFixed(2)}</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold" type="submit">Create invoice</button>
      </div>

      {status.success && <div className="text-green-600 text-sm">{status.success}</div>}
      {status.error && <div className="text-red-600 text-sm">{status.error}</div>}
    </form>
  );
}
