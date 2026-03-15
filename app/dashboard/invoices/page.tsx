"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import InvoiceForm from "./InvoiceForm";
import { generateInvoicesPdf } from "../../../lib/invoicePdfGenerator";
import { BackButton } from "../../../app/components/BackButton";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoInvoices } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";
import { readActiveCompanyId } from "../../../lib/companySwitcher";

type InvoiceRecord = {
  id: number;
  customer_id: number | null;
  customer?: { id: number; name: string } | null;
  customer_name?: string | null;
  amount: number;
  description?: string | null;
  demo?: boolean;
  offline?: boolean;
  pending_sync?: boolean;
  sync_attempts?: number;
  last_sync_error?: string | null;
};

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-600">Loading invoice workspace…</div>}>
      <InvoicesPageContent />
    </Suspense>
  );
}

function InvoicesPageContent() {
  const searchParams = useSearchParams();
  const preset = {
    customerId: searchParams.get("customerId"),
    taskId: searchParams.get("fromTask"),
    taskName: searchParams.get("taskName"),
    taskSeconds: searchParams.get("taskSeconds"),
    taskProjectId: searchParams.get("taskProjectId"),
    taskProjectName: searchParams.get("taskProjectName"),
  };

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState<"ledger" | "lines" | "pdf" | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [pdfTemplate, setPdfTemplate] = useState<"standard" | "detailed">("standard");
  const allowDemoData = userId ? canUseDemoFixtures(userId) : false;

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(() => {
        if (active) setError("Unable to resolve workspace user.");
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

  const loadInvoices = useCallback(
    async ({ quiet = false }: { quiet?: boolean } = {}) => {
      if (!userId) return;
      const allowDemo = canUseDemoFixtures(userId);
      if (!quiet) setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ user_id: userId });
        if (companyId) qs.set('company_id', companyId);
        const res = await fetch(`/api/invoices?${qs.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        if (list.length) {
          setInvoices(list);
          setUsingDemoData(false);
        } else {
          // Only show demo data if user is demo user AND no company selected
          if (allowDemo && !companyId) {
            setInvoices(getDemoInvoices(userId));
            setUsingDemoData(true);
          } else {
            setInvoices([]);
            setUsingDemoData(false);
          }
        }
        setOfflineCount(list.filter(inv => inv.offline).length);
      } catch {
        if (allowDemo) {
          setInvoices(getDemoInvoices(userId));
          setUsingDemoData(true);
        } else {
          setInvoices([]);
          setUsingDemoData(false);
        }
        setOfflineCount(0);
        setError("Failed to load invoices");
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [userId, companyId]
  );

  useEffect(() => {
    if (!userId) return;
    loadInvoices();
  }, [userId, loadInvoices]);

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => invoices.some(inv => inv.id === id && !inv.demo)));
  }, [invoices]);

  async function handleAdd(invoice: {
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
  }) {
    if (!invoice.userId) {
      setError("Workspace context missing for invoice.");
      return false;
    }
    setLoading(true);
    setError(null);
    setSyncMessage(null);
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
          company_id: companyId,  // CRITICAL: Include company_id for data isolation
        }),
      });
      if (!res.ok) throw new Error("Failed to add invoice");
      const newInvoice = await res.json();
      if (newInvoice?.offline) {
        setSyncMessage("Invoice saved offline. Use Sync to push it once Supabase is ready.");
      } else {
        setSyncMessage("Invoice saved successfully.");
      }
      await loadInvoices({ quiet: true });
      return true;
    } catch {
      setError("Failed to add invoice");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ amount: number; description: string }>({ amount: 0, description: "" });

  function handleEdit(inv: InvoiceRecord) {
    if (inv.demo) {
      setError("Demo invoices are read-only.");
      return;
    }
    setEditing(inv.id);
    setEditData({ amount: inv.amount, description: inv.description || "" });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setError("Workspace context missing for update.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, amount: editData.amount, description: editData.description, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update invoice");
      await res.json();
      await loadInvoices({ quiet: true });
      setSyncMessage("Invoice updated.");
      setEditing(null);
      setEditData({ amount: 0, description: "" });
    } catch {
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
    if (invoices.find(inv => inv.id === id)?.demo) {
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
      await loadInvoices({ quiet: true });
      setSelectedIds(prev => prev.filter(selected => selected !== id));
      setSyncMessage("Invoice removed.");
    } catch {
      setError("Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncOffline() {
    if (!userId) {
      setError("Workspace context missing for sync.");
      return;
    }
    setSyncing(true);
    setError(null);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/invoices/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to sync invoices");
      const payload = await res.json();
      if (payload.error) throw new Error(payload.error);
      if (payload.synced) {
        setSyncMessage(`Synced ${payload.synced} offline invoice${payload.synced === 1 ? "" : "s"}.`);
      } else {
        setSyncMessage("No offline invoices queued.");
      }
      await loadInvoices({ quiet: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sync invoices";
      setError(message);
    } finally {
      setSyncing(false);
    }
  }

  async function handleExport(format: "ledger" | "lines" | "pdf") {
    if (!userId) {
      setError("Workspace context missing for export.");
      return;
    }
    if (usingDemoData) {
      setError("Demo invoices cannot be exported.");
      return;
    }

    setExporting(format);
    setError(null);
    try {
      const params = new URLSearchParams({ format, user_id: userId });
      if (selectedIds.length) {
        params.set("ids", selectedIds.join(","));
      }
      if (format === "pdf") {
        params.set("template", pdfTemplate);
      }
      const res = await fetch(`/api/invoices/export?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to export invoices");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      const extension = format === "pdf" ? "pdf" : "csv";
      anchor.download = `invoices-${format}-${Date.now()}.${extension}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Unable to export invoices");
    } finally {
      setExporting(null);
    }
  }

  function toggleSelection(id: number) {
    if (usingDemoData) return;
    if (invoices.find(inv => inv.id === id)?.demo) return;
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(value => value !== id) : [...prev, id]));
  }

  function toggleSelectAll() {
    if (usingDemoData) return;
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

  const selectableCount = invoices.filter(inv => !inv.demo).length;
  const selectedCount = selectedIds.length;
  const allSelected = selectableCount > 0 && selectedCount === selectableCount;

  return (
    <main className="p-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-600">Pull time, photos, and inventory straight into polished invoices.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={pdfTemplate}
            onChange={e => setPdfTemplate(e.target.value as "standard" | "detailed")}
            disabled={Boolean(exporting) || usingDemoData || loading}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="standard">PDF: Standard</option>
            <option value="detailed">PDF: Detailed</option>
          </select>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={Boolean(exporting) || usingDemoData || loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting === "pdf" ? "Generating PDF…" : selectedCount > 0 ? "Print selected (PDF)" : "Download PDF"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("ledger")}
            disabled={Boolean(exporting) || usingDemoData || loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting === "ledger" ? "Exporting ledger…" : "Export ledger CSV"}
          </button>
          <button
            type="button"
            onClick={() => handleExport("lines")}
            disabled={Boolean(exporting) || usingDemoData || loading}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {exporting === "lines" ? "Exporting lines…" : "Export line items CSV"}
          </button>
          <Link href="/dashboard/tasks" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">View tasks</Link>
          <Link href="/dashboard/items" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">View inventory</Link>
          <BackButton />
        </div>
      </div>
      {allowDemoData && usingDemoData && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing mock invoices while you explore. Add a live invoice to switch to your own data.
        </div>
      )}
      {offlineCount > 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold">{offlineCount} invoice{offlineCount > 1 ? "s" : ""} waiting to sync</p>
            <p className="text-xs text-slate-600">We saved them locally until the Supabase schema catches up.</p>
          </div>
          <button
            onClick={handleSyncOffline}
            disabled={syncing}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {syncing ? "Syncing…" : "Retry sync"}
          </button>
        </div>
      )}
      {syncMessage && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{syncMessage}</div>}
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          {selectedCount > 0 ? `${selectedCount} invoice${selectedCount === 1 ? "" : "s"} selected for print/export.` : "Select processed invoices below to print specific documents."}
        </div>
        <button
          type="button"
          onClick={toggleSelectAll}
          disabled={usingDemoData || !selectableCount || loading}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {allSelected ? "Clear selection" : "Select all"}
        </button>
      </div>
      <InvoiceForm onAdd={handleAdd} preset={preset} companyId={companyId} />
      {loading && <div className="text-center py-8 text-blue-600 font-semibold">Loading invoices…</div>}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900">{error}</div>}
      {invoices.length === 0 && !loading ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-12 text-center">
          <p className="text-slate-600 font-semibold">No invoices yet</p>
          <p className="text-slate-500 text-sm mt-1">Create your first invoice above to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {invoices.map((inv, i) => {
            const customerLabel = inv.customer?.name || inv.customer_name || (inv.customer_id ? `Customer #${inv.customer_id}` : "Customer");
            return (
              <div
                key={inv.id ?? i}
                className="rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">{customerLabel}</h3>
                      {inv.description && <p className="text-sm text-slate-600 mt-1">{inv.description}</p>}
                    </div>
                    {!inv.demo && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={() => toggleSelection(inv.id)}
                        className="h-5 w-5 rounded border-slate-300 text-blue-600"
                        aria-label={`Select invoice for export`}
                      />
                    )}
                  </div>

                  {/* Amount and Status */}
                  <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-slate-100">
                    <div>
                      <p className="text-xs tracking-wide text-slate-500 uppercase font-semibold mb-1">Amount</p>
                      <p className="text-3xl font-bold text-slate-900">
                        R<span>{inv.amount?.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {inv.offline && (
                        <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          📡 Offline
                        </span>
                      )}
                      {inv.demo && (
                        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                          ✨ Demo
                        </span>
                      )}
                      {inv.last_sync_error && (
                        <span className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                          ⚠️ Sync error
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Invoice Meta */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Invoice ID</p>
                      <p className="font-mono text-slate-700">#{inv.id}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {editing === inv.id ? (
                    <form onSubmit={handleUpdate} className="space-y-3">
                      <input
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        type="number"
                        min="0"
                        value={editData.amount}
                        onChange={e => setEditData(ed => ({ ...ed, amount: Number(e.target.value) }))}
                        placeholder="Amount"
                        required
                      />
                      <textarea
                        className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                        value={editData.description}
                        onChange={e => setEditData(ed => ({ ...ed, description: e.target.value }))}
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          className="flex-1 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                          type="submit"
                        >
                          Save
                        </button>
                        <button
                          className="flex-1 rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          type="button"
                          onClick={() => setEditing(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="flex-1 rounded border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          const invoiceData = {
                            id: inv.id,
                            invoiceNumber: String(inv.id),
                            issuedOn: new Date().toLocaleDateString(),
                            dueOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                            customerName: inv.customer?.name || inv.customer_name || "Customer",
                            amount: inv.amount || 0,
                            currency: "R",
                            lineItems: [
                              {
                                name: inv.description || "Invoice Services",
                                quantity: 1,
                                rate: inv.amount || 0,
                                total: inv.amount || 0,
                              }
                            ],
                            notes: inv.description ? `${inv.description}` : undefined,
                          };
                          generateInvoicesPdf([invoiceData], {
                            name: "Your Company",
                            email: "company@example.com",
                            phone: "",
                            address1: "",
                            currency: "R",
                          });
                        }}
                      >
                        🖨 Print PDF
                      </button>
                      {!inv.demo && (
                        <>
                          <button
                            className="flex-1 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                            onClick={() => handleEdit(inv)}
                          >
                            ✎ Edit
                          </button>
                          <button
                            className="flex-1 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                            onClick={() => handleDelete(inv.id)}
                          >
                            🗑 Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
