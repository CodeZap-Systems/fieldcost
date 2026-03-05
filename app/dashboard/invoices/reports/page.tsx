"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabaseClient";

type Invoice = {
  id: number | string;
  customer?: string;
  amount?: number;
  date?: string;
  created_at?: string;
  items?: string[] | null;
  paid?: boolean;
  payment_date?: string | null;
  notes?: string | null;
};

export default function InvoiceReportsPage() {
  const [tab, setTab] = useState("Summary");
  const tabs = ["Summary", "Line Items", "Payments", "Notes"];
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      setLoading(true);
      setError(null);
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      const userId = userData.user.id || userData.user.user_metadata?.demoUserId;
      if (!userId) {
        setError("Unable to determine user context.");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("invoices").select("*").eq("user_id", userId);
      if (error) setError(error.message);
      else setInvoices((data as Invoice[]) || []);
      setLoading(false);
    }
    fetchInvoices();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Invoice Reports</h1>
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
      {loading && <div className="p-4 text-blue-600">Loading invoices...</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}
      {tab === "Summary" && (
        <div className="p-4">
          <h2 className="font-semibold mb-2">Summary</h2>
          <ul>
            {invoices.map(inv => (
              <li key={inv.id} className="mb-2 border-b pb-2">
                <div className="font-bold">Invoice #{inv.id}</div>
                <div>Customer: {inv.customer}</div>
                <div>Amount: ${inv.amount}</div>
                <div>Date: {inv.date || inv.created_at}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "Line Items" && (
        <div className="p-4">
          <h2 className="font-semibold mb-2">Line Items</h2>
          <ul>
            {invoices.map(inv => (
              <li key={inv.id} className="mb-2 border-b pb-2">
                <div className="font-bold">Invoice #{inv.id}</div>
                <div>Items: {inv.items ? inv.items.join(', ') : 'N/A'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "Payments" && (
        <div className="p-4">
          <h2 className="font-semibold mb-2">Payments</h2>
          <ul>
            {invoices.map(inv => (
              <li key={inv.id} className="mb-2 border-b pb-2">
                <div className="font-bold">Invoice #{inv.id}</div>
                <div>Paid: {inv.paid ? 'Yes' : 'No'}</div>
                <div>Payment Date: {inv.payment_date || 'N/A'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === "Notes" && (
        <div className="p-4">
          <h2 className="font-semibold mb-2">Notes</h2>
          <ul>
            {invoices.map(inv => (
              <li key={inv.id} className="mb-2 border-b pb-2">
                <div className="font-bold">Invoice #{inv.id}</div>
                <div>Notes: {inv.notes || 'N/A'}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
