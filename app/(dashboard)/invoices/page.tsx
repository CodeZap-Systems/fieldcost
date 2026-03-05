"use client";

import { useState, useEffect, useMemo } from "react";
import InvoiceForm from "../../dashboard/invoices/InvoiceForm";
import { useUserRole } from "@/app/useUserRole";
import { ensureClientUserId } from "@/lib/clientUser";
import { getDemoInvoices, getDemoTasks } from "@/lib/demoMockData";
import { canUseDemoFixtures } from "@/lib/userIdentity";

type InvoiceRecord = {
  id: number;
  customer: { id: number; name: string; email?: string | null };
  amount: number;
  description: string;
  reference?: string | null;
  invoice_number?: string | null;
  issued_on?: string | null;
  due_on?: string | null;
  status?: string | null;
  currency?: string | null;
  line_items?: Array<{ id: number; name: string; quantity: number; total: number; project?: string | null; note?: string | null; source?: string | null; task_ref?: string | null }>;
  demo?: boolean;
};

type InvoiceSubmitPayload = {
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
};

type TaskRecord = {
  id: number;
  name: string;
  status: string;
  seconds: number;
  billable: boolean;
  demo?: boolean;
};

const currencyFormatter = (amount: number, currency = "ZAR") =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(amount);

export default function InvoicesPage() {
  const { role, loading: roleLoading } = useUserRole();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [pdfTemplate, setPdfTemplate] = useState<"standard" | "detailed">("standard");
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ reference: string; amount: number; description: string }>({ reference: "", amount: 0, description: "" });
  const [userId, setUserId] = useState<string | null>(null);
  const [usingDemoInvoices, setUsingDemoInvoices] = useState(false);
  const [usingDemoTasks, setUsingDemoTasks] = useState(false);

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(err => {
        console.error(err);
        if (active) {
          setError("Unable to determine workspace user.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      setLoading(true);
      setError(null);
      const allowDemo = canUseDemoFixtures(userId);
      try {
        const qs = new URLSearchParams({ user_id: userId });
        const [invoiceRes, taskRes] = await Promise.all([
          fetch(`/api/invoices?${qs.toString()}`),
          fetch(`/api/tasks?${qs.toString()}`),
        ]);
        if (!invoiceRes.ok || !taskRes.ok) throw new Error("Failed to load data");
        const [invoicePayload, taskPayload] = await Promise.all([invoiceRes.json(), taskRes.json()]);
        const invoiceList = Array.isArray(invoicePayload) ? invoicePayload : [];
        if (invoiceList.length) {
          setInvoices(invoiceList);
          setUsingDemoInvoices(false);
        } else {
          if (allowDemo) {
            setInvoices(getDemoInvoices(userId));
            setUsingDemoInvoices(true);
          } else {
            setInvoices([]);
            setUsingDemoInvoices(false);
          }
          setSelectedIds([]);
        }
        const taskList = Array.isArray(taskPayload) ? taskPayload : [];
        if (taskList.length) {
          setTasks(taskList);
          setUsingDemoTasks(false);
        } else {
          if (allowDemo) {
            setTasks(
              getDemoTasks(userId).map(task => ({
                id: task.id,
                name: task.name,
                status: task.status,
                seconds: task.seconds,
                billable: task.billable,
                demo: task.demo,
              }))
            );
            setUsingDemoTasks(true);
          } else {
            setTasks([]);
            setUsingDemoTasks(false);
          }
        }
      } catch (err) {
        console.error(err);
        if (allowDemo) {
          setInvoices(getDemoInvoices(userId));
          setUsingDemoInvoices(true);
          setTasks(
            getDemoTasks(userId).map(task => ({
              id: task.id,
              name: task.name,
              status: task.status,
              seconds: task.seconds,
              billable: task.billable,
              demo: task.demo,
            }))
          );
          setUsingDemoTasks(true);
          setSelectedIds([]);
        } else {
          setInvoices([]);
          setUsingDemoInvoices(false);
          setTasks([]);
          setUsingDemoTasks(false);
          setSelectedIds([]);
        }
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  async function handleAdd(invoice: InvoiceSubmitPayload) {
    if (!invoice.userId) {
      setError("Workspace context missing for invoice.");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: invoice.customerId,
          amount: invoice.amount,
          description: invoice.description,
          reference: invoice.reference,
          lines: invoice.lines,
          user_id: invoice.userId,
        }),
      });
      if (!res.ok) throw new Error("Failed to add invoice");
      const newInvoice = await res.json();
      setInvoices(prev => [newInvoice, ...prev.filter(inv => !inv.demo)]);
      setUsingDemoInvoices(false);
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to add invoice");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function startEditing(inv: InvoiceRecord) {
    if (inv.demo) {
      setError("Demo invoices are read-only.");
      return;
    }
    setEditing(inv.id);
    setEditData({ reference: inv.reference || "", amount: inv.amount, description: inv.description || "" });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !userId) {
      setError("Workspace context missing for update.");
      return;
    }
    const target = invoices.find(inv => inv.id === editing);
    if (target?.demo) {
      setError("Demo invoices are read-only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editing,
          reference: editData.reference,
          amount: editData.amount,
          description: editData.description,
          user_id: userId,
        }),
      });
      if (!res.ok) throw new Error("Failed to update invoice");
      const updated = await res.json();
      setInvoices(prev => prev.map(inv => (inv.id === editing ? updated : inv)));
      setEditing(null);
      setEditData({ reference: "", amount: 0, description: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to update invoice");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!userId) {
      setError("Workspace context missing for delete.");
      return;
    }
    const target = invoices.find(inv => inv.id === id);
    if (target?.demo) {
      setError("Demo invoices are read-only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to delete invoice");
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      setSelectedIds(prev => prev.filter(selected => selected !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelection(id: number) {
    if (usingDemoInvoices) {
      setError("Demo invoices cannot be selected.");
      return;
    }
    if (invoices.find(inv => inv.id === id)?.demo) return;
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]));
  }

  function toggleAll() {
    if (usingDemoInvoices || !invoices.length) return;
    const selectable = invoices.filter(inv => !inv.demo).map(inv => inv.id);
    if (!selectable.length) {
      setSelectedIds([]);
      return;
    }
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
    }
  }

  async function handleExport(format: "ledger" | "lines" | "pdf") {
    if (!userId) {
      setError("Workspace context missing for export.");
      return;
    }
    if (usingDemoInvoices) {
      setError("Demo invoices cannot be exported.");
      return;
    }
    setExporting(true);
    setError(null);
    try {
      const params = new URLSearchParams({ format });
      if (selectedIds.length) params.set("ids", selectedIds.join(","));
      if (format === "pdf") params.set("template", pdfTemplate);
      params.set("user_id", userId);
      const res = await fetch(`/api/invoices/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const extension = format === "pdf" ? "pdf" : "csv";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `invoices-${format}-${Date.now()}.${extension}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Unable to export invoices");
    } finally {
      setExporting(false);
    }
  }

  const aging = useMemo(() => {
    const buckets = { current: 0, thirty: 0, sixty: 0, ninety: 0 };
    const now = Date.now();
    invoices.forEach(inv => {
      const due = new Date(inv.due_on || inv.issued_on || Date.now()).getTime();
      const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
      const target = diffDays <= 0 ? "current" : diffDays <= 30 ? "thirty" : diffDays <= 60 ? "sixty" : "ninety";
      buckets[target as keyof typeof buckets] += inv.amount;
    });
    return buckets;
  }, [invoices]);

  const coverage = useMemo(() => {
    const billable = tasks.filter(task => task.billable && task.seconds > 0);
    if (!billable.length) return 0;
    const invoicedRefs = new Set<string>();
    invoices.forEach(inv =>
      inv.line_items?.forEach(line => {
        if (line.task_ref) invoicedRefs.add(line.task_ref);
      })
    );
    const covered = billable.filter(task => invoicedRefs.has(String(task.id)) || invoicedRefs.has(task.name)).length;
    return Math.round((covered / billable.length) * 100);
  }, [invoices, tasks]);

  const customerTotals = useMemo(() => {
    const map = new Map<string, number>();
    invoices.forEach(inv => {
      const name = inv.customer?.name || "Unknown customer";
      map.set(name, (map.get(name) || 0) + inv.amount);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [invoices]);

  const hoursSplit = useMemo(() => {
    const totals = tasks.reduce(
      (acc, task) => {
        const hours = task.seconds / 3600;
        if (task.billable) acc.billable += hours;
        else acc.nonBillable += hours;
        return acc;
      },
      { billable: 0, nonBillable: 0 }
    );
    return totals;
  }, [tasks]);

  if (roleLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-8 space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-widest text-indigo-600">Billing & CSV exports</p>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-bold flex-1">Invoices</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>PDF template:</span>
            <select className="border rounded px-2 py-1" value={pdfTemplate} onChange={e => setPdfTemplate(e.target.value as typeof pdfTemplate)}>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {usingDemoInvoices && (
          <div className="text-sm text-amber-800 rounded border border-dashed border-amber-300 bg-amber-50 px-3 py-2">
            Demo invoices are shown for context. Add your own invoice to unlock exports and editing.
          </div>
        )}
      </header>

      {role === "admin" && <InvoiceForm onAdd={handleAdd} />}

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">{selectedIds.length ? `${selectedIds.length} selected` : "Select invoices to export"}</span>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-400"
            disabled={exporting || usingDemoInvoices}
            onClick={() => handleExport("ledger")}
          >
            Ledger CSV
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-200 hover:border-indigo-400"
            disabled={exporting || usingDemoInvoices}
            onClick={() => handleExport("lines")}
          >
            Line item CSV
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-indigo-600 text-white bg-indigo-600 hover:bg-indigo-700"
            disabled={exporting || usingDemoInvoices}
            onClick={() => handleExport("pdf")}
          >
            Download PDF
          </button>
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 px-4 py-2 border-b">
          <input type="checkbox" checked={!usingDemoInvoices && invoices.length > 0 && selectedIds.length === invoices.length} onChange={() => toggleAll()} disabled={usingDemoInvoices} />
          <span className="w-32 text-xs uppercase text-gray-500">Invoice #</span>
          <span className="flex-1 text-xs uppercase text-gray-500">Client</span>
          <span className="w-32 text-xs uppercase text-gray-500 text-right">Issued</span>
          <span className="w-32 text-xs uppercase text-gray-500 text-right">Due</span>
          <span className="w-32 text-xs uppercase text-gray-500 text-right">Status</span>
          <span className="w-32 text-xs uppercase text-gray-500 text-right">Total</span>
        </div>
        {loading && <div className="p-4 text-sm text-gray-500">Loading invoices...</div>}
        {!loading && !invoices.length && <div className="p-4 text-sm text-gray-500">No invoices yet.</div>}
        <div>
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center gap-3 px-4 py-3 border-t">
              <input type="checkbox" checked={selectedIds.includes(inv.id)} onChange={() => toggleSelection(inv.id)} disabled={usingDemoInvoices || inv.demo} />
              <div className="w-32 font-semibold">{inv.invoice_number || `#${inv.id}`}</div>
              <div className="flex-1">
                <p className="font-semibold">{inv.customer?.name}</p>
                {inv.reference && <p className="text-sm text-gray-500">{inv.reference}</p>}
                {inv.line_items && !!inv.line_items.length && (
                  <p className="text-xs text-gray-500">
                    {inv.line_items.map(line => `${line.name} (${line.quantity})`).join(", ")}
                  </p>
                )}
              </div>
              <div className="w-32 text-right text-sm text-gray-600">{inv.issued_on || "-"}</div>
              <div className="w-32 text-right text-sm text-gray-600">{inv.due_on || "-"}</div>
              <div className="w-32 text-right">
                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">{inv.status || "draft"}</span>
              </div>
              <div className="w-32 text-right font-semibold">{currencyFormatter(inv.amount, inv.currency)}</div>
              {role === "admin" && (
                <div className="flex gap-2">
                  {editing === inv.id ? (
                    <form onSubmit={handleUpdate} className="flex gap-2">
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Reference"
                        value={editData.reference}
                        onChange={e => setEditData(prev => ({ ...prev, reference: e.target.value }))}
                      />
                      <input
                        className="border rounded px-2 py-1 text-sm w-24"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editData.amount}
                        onChange={e => setEditData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      />
                      <button className="text-green-600 text-sm font-semibold" type="submit">Save</button>
                      <button className="text-gray-500 text-sm" type="button" onClick={() => setEditing(null)}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      {inv.demo ? (
                        <span className="text-xs uppercase tracking-wide text-amber-600">Demo</span>
                      ) : (
                        <>
                          <button className="text-sm text-indigo-600" onClick={() => startEditing(inv)}>Edit</button>
                          <button className="text-sm text-red-600" onClick={() => handleDelete(inv.id)}>Delete</button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs uppercase text-gray-500">Invoice aging</p>
            <p className="text-lg font-semibold">{currencyFormatter(aging.ninety + aging.sixty + aging.thirty + aging.current)}</p>
            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <p>Current: {currencyFormatter(aging.current)}</p>
              <p>30d: {currencyFormatter(aging.thirty)}</p>
              <p>60d: {currencyFormatter(aging.sixty)}</p>
              <p>90d+: {currencyFormatter(aging.ninety)}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs uppercase text-gray-500">Timer-to-invoice coverage</p>
            <p className="text-3xl font-bold">{coverage}%</p>
            <p className="text-xs text-gray-500">Billable tasks converted into invoices.</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs uppercase text-gray-500">Top customers</p>
            <ul className="mt-2 text-sm text-gray-700 space-y-1">
              {customerTotals.map(([name, total]) => (
                <li key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span>{currencyFormatter(total)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs uppercase text-gray-500">Billable vs non-billable hours</p>
            <p className="text-lg font-semibold">{hoursSplit.billable.toFixed(1)}h billable</p>
            <p className="text-sm text-gray-500">{hoursSplit.nonBillable.toFixed(1)}h non-billable</p>
          </div>
        </div>
      </section>
    </main>
  );
}
