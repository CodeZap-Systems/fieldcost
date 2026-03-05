"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import ItemForm from "./ItemForm";
import { ensureClientUserId } from "../../../lib/clientUser";
import { getDemoItems } from "../../../lib/demoMockData";
import { canUseDemoFixtures } from "../../../lib/userIdentity";

type InventoryItem = { id?: number; name: string; price: number; stock_in?: number; stock_used?: number; item_type?: string; demo?: boolean };

const normalizeItem = (item: InventoryItem): InventoryItem => ({
  ...item,
  item_type: item.item_type || "physical",
});

export default function ItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
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
    const allowDemo = canUseDemoFixtures(userId);
    let active = true;
    async function fetchItems() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/items?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to load items');
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : [];
        if (active && list.length > 0) {
          setItems(list.map(normalizeItem));
          setUsingDemoData(false);
        } else if (active && allowDemo) {
          setItems(getDemoItems(userId).map(normalizeItem));
          setUsingDemoData(true);
        } else if (active) {
          setItems([]);
          setUsingDemoData(false);
        }
      } catch (err) {
        if (!active) return;
        if (allowDemo) {
          setItems(getDemoItems(userId).map(normalizeItem));
          setUsingDemoData(true);
        } else {
          setItems([]);
          setUsingDemoData(false);
        }
        setError((err as Error).message || 'Failed to load items');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchItems();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleAdd(item: { name: string; price: number; item_type: string }) {
    if (!userId) {
      setError('Resolving user...');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const newItem = normalizeItem(await res.json());
      setItems(prev => [newItem, ...prev.filter(item => !item.demo)]);
      setUsingDemoData(false);
      return true;
    } catch {
      setError("Failed to add item");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name: string; price: number }>({ name: "", price: 0 });

  function handleEdit(item: { id: number; name: string; price: number; demo?: boolean }) {
    if (item.demo) {
      setError("Demo items are read-only. Add your own inventory to replace them.");
      return;
    }
    setEditing(item.id);
    setEditData({ name: item.name, price: item.price });
  }

  async function handleUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (editing === null || !userId) return;
    const target = items.find(i => i.id === editing);
    if (target?.demo) {
      setError('Demo items are read-only.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...editData, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      const updated = normalizeItem(await res.json());
      setItems(prev => prev.map(i => i.id === editing ? updated : i));
      setEditing(null);
      setEditData({ name: "", price: 0 });
    } catch {
      setError("Failed to update item");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!userId) {
      setError('Resolving user...');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      setError("Failed to delete item");
    } finally {
      setLoading(false);
    }
  }

  // Inventory update logic
  async function handleStockUpdate(id: number, type: 'in' | 'used') {
    if (!userId) {
      setError('Resolving user...');
      return;
    }
    const target = items.find(i => i.id === id);
    if (target?.demo) {
      setError('Demo items are read-only.');
      return;
    }
    const label = type === 'in' ? 'Add to stock in' : 'Add to stock used';
    const value = Number(prompt(label + ' (units):', '1'));
    if (Number.isNaN(value) || value <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const item = items.find(i => i.id === id);
      const update = type === 'in'
        ? { stock_in: (item?.stock_in || 0) + value }
        : { stock_used: (item?.stock_used || 0) + value };
      const res = await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...update, user_id: userId }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      const updated = normalizeItem(await res.json());
      setItems(prev => prev.map(i => i.id === id ? updated : i));
    } catch {
      setError('Failed to update stock');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-600">Track your stock in, used, and remaining. Update inventory in real time.</p>
        </div>
        <Link href="/dashboard/invoices" className="inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
          Open invoicing
        </Link>
      </div>
      {allowDemoData && usingDemoData && (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Showing mock inventory so you can demonstrate the flow. Add a real item to switch to live data.
        </div>
      )}
      <ItemForm onAdd={handleAdd} />
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="mt-4">
        {items.map((item, i) => {
          const remaining = (item.stock_in || 0) - (item.stock_used || 0);
          return (
            <li key={item.id ?? i} className="border-b py-2 flex flex-col sm:flex-row items-center gap-2">
              {editing === item.id ? (
                <form onSubmit={handleUpdate} className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    className="flex-1 rounded border p-2"
                    value={editData.name}
                    onChange={e => setEditData(data => ({ ...data, name: e.target.value }))}
                    placeholder="Item name"
                    required
                  />
                  <input
                    className="w-32 rounded border p-2"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editData.price}
                    onChange={e => setEditData(data => ({ ...data, price: Number(e.target.value) }))}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="rounded bg-green-600 px-3 py-1 text-white">Save</button>
                    <button
                      type="button"
                      className="rounded bg-gray-400 px-3 py-1 text-white"
                      onClick={() => {
                        setEditing(null);
                        setEditData({ name: "", price: 0 });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex-1 flex flex-col items-center gap-2 sm:flex-row">
                    <span className="text-lg font-semibold">{item.name}</span>
                    <span className="text-gray-500">R{item.price?.toFixed(2)}</span>
                    <span className="rounded px-2 py-1 text-xs uppercase tracking-wide bg-gray-100 text-gray-700">{item.item_type === "service" ? "Service" : "Physical"}</span>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">Stock In: {item.stock_in || 0}</span>
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Used: {item.stock_used || 0}</span>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">Remaining: {remaining}</span>
                  </div>
                  {item.id !== undefined && (
                    <div className="flex gap-2">
                      {item.demo ? (
                        <span className="rounded-full border border-amber-200 px-2 py-0.5 text-xs uppercase tracking-wide text-amber-600">Demo</span>
                      ) : (
                        <>
                          <button className="rounded bg-blue-500 px-2 py-1 text-white" onClick={() => handleStockUpdate(item.id!, 'in')}>+ Stock In</button>
                          <button className="rounded bg-yellow-500 px-2 py-1 text-white" onClick={() => handleStockUpdate(item.id!, 'used')}>+ Used</button>
                          <button className="rounded bg-yellow-500 px-2 py-1 text-white" onClick={() => handleEdit(item as { id: number; name: string; price: number })}>Edit</button>
                          <button className="rounded bg-red-600 px-2 py-1 text-white" onClick={() => handleDelete(item.id!)}>Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
