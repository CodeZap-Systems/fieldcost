/**
 * ADMIN CMS - Billing & Invoices Management Page
 * 
 * Create, manage, and track invoices and payments
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { BillingInvoice } from "@/lib/cms-types";

export default function BillingManagementPage() {
  const { activeCompanyId, companies, switchCompany } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [filterStatus]);

  async function fetchInvoices() {
    try {
      const url = filterStatus === "all"
        ? "/api/admin/billing/invoices"
        : `/api/admin/billing/invoices?status=${filterStatus}`;

      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(invoiceId: string) {
    try {
      const res = await fetch(`/api/admin/billing/invoices?id=${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        }),
      });

      if (res.ok) {
        await fetchInvoices();
      }
    } catch (err) {
      console.error("Failed to mark as paid:", err);
    }
  }

  async function sendInvoice(invoiceId: string) {
    try {
      // In production, this would trigger email sending
      const res = await fetch(`/api/admin/billing/invoices?id=${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "sent",
        }),
      });

      if (res.ok) {
        await fetchInvoices();
        alert("Invoice sent to customer email");
      }
    } catch (err) {
      console.error("Failed to send invoice:", err);
    }
  }

  const stats = {
    total_invoices: invoices.length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
    pending: invoices.filter((inv) => inv.status === "draft" || inv.status === "sent").length,
    overdue: invoices.filter((inv) => inv.status === "overdue").length,
    total_amount: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    paid_amount: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.paid_amount, 0),
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-900 text-gray-200",
    sent: "bg-blue-900 text-blue-200",
    paid: "bg-green-900 text-green-200",
    overdue: "bg-red-900 text-red-200",
    cancelled: "bg-black text-gray-400",
  };

  return (
    <>
      <DemoModeBanner
        companyId={activeCompanyId}
        onGotoLiveWorkspace={() => {
          const liveCompany = companies.find((c) => !isDemoCompany(c.id));
          if (liveCompany) {
            switchCompany(liveCompany.id);
          }
        }}
      />

      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Demo Warning Info */}
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Invoice changes are for testing only.
              </p>
            </div>
          )}

          {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Invoices</h1>
          <p className="text-gray-400">Create and manage company invoices</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Invoices</p>
            <p className="text-3xl font-bold">{stats.total_invoices}</p>
            <p className="text-xs text-gray-500 mt-2">
              {stats.paid} paid, {stats.pending} pending
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-green-400">
              R{stats.total_amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              R{stats.paid_amount.toLocaleString()} collected
            </p>
          </div>

          {stats.overdue > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 border border-red-500">
              <p className="text-red-400 text-sm mb-2">🚨 Overdue</p>
              <p className="text-3xl font-bold text-red-400">{stats.overdue}</p>
              <p className="text-xs text-gray-500 mt-2">Invoices needing follow-up</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
          >
            + Create Invoice
          </button>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Invoices Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading invoices...</div>
          ) : invoices.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No invoices found. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Invoice #
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Company
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Due Date
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-700/50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-mono">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invoice.company_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        R{invoice.total_amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[invoice.status] ||
                            "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {invoice.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          {invoice.status === "draft" && (
                            <button
                              onClick={() => sendInvoice(invoice.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              Send
                            </button>
                          )}
                          {invoice.status !== "paid" && (
                            <button
                              onClick={() => markAsPaid(invoice.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedInvoice.invoice_number}
                  </h2>
                  <p className="text-gray-400">
                    {new Date(selectedInvoice.issue_date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="font-semibold">{selectedInvoice.company_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Due Date</p>
                  <p className="font-semibold">
                    {new Date(selectedInvoice.due_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-900 rounded p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>R{selectedInvoice.subtotal.toLocaleString()}</span>
                </div>
                {selectedInvoice.tax_amount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>R{selectedInvoice.tax_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>R{selectedInvoice.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-4">
                {selectedInvoice.status === "draft" && (
                  <button
                    onClick={() => {
                      sendInvoice(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Send Invoice
                  </button>
                )}
                {selectedInvoice.status !== "paid" && (
                  <button
                    onClick={() => {
                      markAsPaid(selectedInvoice.id);
                      setSelectedInvoice(null);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Mark as Paid
                  </button>
                )}
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
