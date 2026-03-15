"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import VendorForm, { type VendorFormState } from "./VendorForm";
import { BackButton } from "../../../app/components/BackButton";
import { ensureClientUserId } from "../../../lib/clientUser";
import { canUseDemoFixtures } from "../../../lib/userIdentity";
import { readActiveCompanyId } from "../../../lib/companySwitcher";

type VendorRow = { 
  id: number; 
  name: string; 
  email: string; 
  phone: string; 
  company_name: string; 
  contact_person: string; 
  demo?: boolean 
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<VendorRow | null>(null);

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

  // Load active company ID
  useEffect(() => {
    if (typeof window === "undefined") return;
    setCompanyId(readActiveCompanyId());
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    async function fetchVendors() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ user_id: userId });
        if (companyId) params.set('company_id', companyId);
        const res = await fetch(`/api/vendors?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load vendors');
        const payload = await res.json();
        const list = Array.isArray(payload) ? payload : [];
        if (active) {
          setVendors(list);
        }
      } catch (err) {
        if (active) {
          setVendors([]);
          setError((err as Error).message || 'Failed to load vendors');
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchVendors();
    return () => {
      active = false;
    };
  }, [userId, companyId]);

  async function handleAdd(vendor: VendorFormState) {
    if (!userId || !companyId) {
      setError('User or company context not available');
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = { ...vendor, user_id: userId, company_id: companyId };
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add vendor");
      }
      const newVendor = await res.json();
      setVendors(prev => [newVendor, ...prev]);
      setShowForm(false);
      return true;
    } catch (err) {
      setError((err as Error).message || "Failed to add vendor");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(vendor: VendorRow) {
    setEditing(vendor.id);
    setEditData(vendor);
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId || !editData) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...editData, user_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to update vendor");
      const updated = await res.json();
      setVendors(prev => prev.map(v => v.id === editing ? updated : v));
      setEditing(null);
      setEditData(null);
    } catch (err) {
      setError((err as Error).message || "Failed to update vendor");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vendors?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete vendor");
      setVendors(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError((err as Error).message || "Failed to delete vendor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? "Cancel" : "+ Add Vendor"}
          </button>
          <BackButton />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <VendorForm onAdd={handleAdd} />
        </div>
      )}

      {loading && !vendors.length && <p className="text-gray-500">Loading vendors...</p>}

      {vendors.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
          <p className="text-gray-600">No vendors yet. Add one to get started!</p>
        </div>
      )}

      {vendors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Vendor Name</th>
                <th className="border p-3 text-left">Contact Person</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Company</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                editing === vendor.id ? (
                  <tr key={vendor.id} className="bg-blue-50">
                    <td colSpan={6} className="border p-4">
                      <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editData?.name || ""}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="border p-2 rounded col-span-2"
                          placeholder="Vendor Name"
                        />
                        <input
                          type="text"
                          value={editData?.contact_person || ""}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, contact_person: e.target.value } : null)}
                          className="border p-2 rounded"
                          placeholder="Contact Person"
                        />
                        <input
                          type="email"
                          value={editData?.email || ""}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, email: e.target.value } : null)}
                          className="border p-2 rounded"
                          placeholder="Email"
                        />
                        <input
                          type="tel"
                          value={editData?.phone || ""}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          className="border p-2 rounded"
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          value={editData?.company_name || ""}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, company_name: e.target.value } : null)}
                          className="border p-2 rounded col-span-2"
                          placeholder="Company Name"
                        />
                        <div className="col-span-2 flex gap-2">
                          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="border p-3">{vendor.name}</td>
                    <td className="border p-3">{vendor.contact_person || "-"}</td>
                    <td className="border p-3">{vendor.email || "-"}</td>
                    <td className="border p-3">{vendor.phone || "-"}</td>
                    <td className="border p-3">{vendor.company_name || "-"}</td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vendor.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
