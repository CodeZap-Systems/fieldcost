"use client";

import { useState, useEffect } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface Supplier {
  id: number;
  vendor_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  province?: string;
  payment_terms?: string;
  rating?: number;
  created_at: string;
}

interface SupplierListProps {
  companyId?: string | null;
  onSelectSupplier?: (supplier: Supplier) => void;
  onCreateNew?: () => void;
}

export function SupplierList({ companyId = "1", onSelectSupplier, onCreateNew }: SupplierListProps) {
  const userId = ensureClientUserId();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterRating, setFilterRating] = useState<string>("");

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        let url = `/api/suppliers?company_id=${companyId}&user_id=${userId}`;
        if (filterRating) {
          url += `&min_rating=${filterRating}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          setSuppliers(await res.json());
        } else {
          setError("Failed to fetch suppliers");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [userId, companyId, filterRating]);

  const handleDeleteSupplier = async (supplierId: number) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      const res = await fetch(`/api/suppliers?id=${supplierId}&user_id=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSuppliers(suppliers.filter(s => s.id !== supplierId));
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to delete supplier");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return "N/A";
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    return stars;
  };

  const getLocationDisplay = (supplier: Supplier) => {
    const parts = [supplier.city, supplier.province].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading suppliers...</div>;
  }

  return (
    <div className="w-full">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Suppliers</h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Add Supplier
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filter by rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Minimum Rating:</label>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Ratings</option>
          <option value="1">1+ Star</option>
          <option value="2">2+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>

      {/* Suppliers Table */}
      {suppliers.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No suppliers found. {onCreateNew && "Click '+ Add Supplier' to get started."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">Vendor Name</th>
                <th className="px-4 py-3 text-left font-semibold">Contact</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Phone</th>
                <th className="px-4 py-3 text-left font-semibold">Location</th>
                <th className="px-4 py-3 text-left font-semibold">Payment Terms</th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
                <th className="px-4 py-3 text-left font-semibold">Added</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{supplier.vendor_name}</td>
                  <td className="px-4 py-3">{supplier.contact_name || "-"}</td>
                  <td className="px-4 py-3 text-sm">{supplier.email || "-"}</td>
                  <td className="px-4 py-3 text-sm">{supplier.phone || "-"}</td>
                  <td className="px-4 py-3">{getLocationDisplay(supplier)}</td>
                  <td className="px-4 py-3">{supplier.payment_terms || "N/A"}</td>
                  <td className="px-4 py-3 text-sm" title={`${supplier.rating}/5`}>
                    {getRatingStars(supplier.rating)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(supplier.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectSupplier?.(supplier)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
