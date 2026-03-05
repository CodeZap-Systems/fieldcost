"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CustomerForm, { type CustomerFormState } from "./CustomerForm";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoCustomers } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";

type CustomerRow = { id: number; name: string; email: string; demo?: boolean };

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    let active = true;
    const allowDemo = canUseDemoFixtures(userId);
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/customers?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to load customers');
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : [];
        if (active && list.length > 0) {
          setCustomers(list);
          setUsingDemoData(false);
        } else if (active && allowDemo) {
          setCustomers(getDemoCustomers(userId));
          setUsingDemoData(true);
        } else if (active) {
          setCustomers([]);
          setUsingDemoData(false);
        }
      } catch (err) {
        if (!active) return;
        if (allowDemo) {
          setCustomers(getDemoCustomers(userId));
          setUsingDemoData(true);
        } else {
          setCustomers([]);
          setUsingDemoData(false);
        }
        setError((err as Error).message || 'Failed to load customers');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchCustomers();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleAdd(customer: CustomerFormState) {
    if (!userId) {
      setError('Resolving user...');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = { name: customer.name, email: customer.email, user_id: userId };
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add customer");
      const newCustomer = await res.json();
      setCustomers(prev => [{ id: newCustomer.id, name: newCustomer.name, email: newCustomer.email }, ...prev.filter(c => !c.demo)]);
      setUsingDemoData(false);
      return true;
    } catch {
      setError("Failed to add customer");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: "", email: "" });

  async function handleEdit(customer: CustomerRow) {
    if (customer.demo) {
      setError("Demo customers are read-only. Add your own customer to replace them.");
      return;
    }
    setEditing(customer.id);
    setEditData({ name: customer.name, email: customer.email });
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;
    if (customers.find(c => c.id === editing)?.demo) {
      setError("Demo customers are read-only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...editData, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update customer");
      const updated = await res.json();
      setCustomers(prev => prev.map(c => c.id === editing ? updated : c));
      setEditing(null);
      setEditData({ name: "", email: "" });
    } catch {
      setError("Failed to update customer");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/customers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch {
      setError("Failed to delete customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Link href="/dashboard/invoices" className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
          Open invoicing
        </Link>
      </div>
      {allowDemoData && usingDemoData && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing mock customer data so the workspace does not feel empty. Add a real customer to replace these rows.
        </div>
      )}
      <CustomerForm onAdd={handleAdd} />
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="mt-4">
        {customers.map((c, i) => (
          <li key={c.id ?? i} className="border-b py-2 flex items-center gap-2">
            {editing === c.id ? (
              <form onSubmit={handleUpdate} className="flex gap-2 flex-1">
                <input
                  className="border p-1 rounded flex-1"
                  value={editData.name}
                  onChange={e => setEditData(ed => ({ ...ed, name: e.target.value }))}
                  required
                />
                <input
                  className="border p-1 rounded flex-1"
                  value={editData.email}
                  onChange={e => setEditData(ed => ({ ...ed, email: e.target.value }))}
                  required
                />
                <button className="bg-green-600 text-white px-2 py-1 rounded" type="submit">Save</button>
                <button className="bg-gray-400 text-white px-2 py-1 rounded" type="button" onClick={() => setEditing(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <span className="font-semibold">{c.name}</span> — {c.email}
                {!c.demo ? (
                  <>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded ml-2" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="bg-red-600 text-white px-2 py-1 rounded ml-2" onClick={() => handleDelete(c.id!)}>Delete</button>
                  </>
                ) : (
                  <span className="ml-2 rounded-full border border-amber-200 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-600">Demo</span>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
