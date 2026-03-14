"use client";

import { useState, useEffect } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface Supplier {
  id: number;
  vendor_name: string;
  email?: string;
  payment_terms?: string;
}

interface Project {
  id: number;
  name: string;
}

interface LineItem {
  id: string;
  item_name: string;
  quantity_ordered: number;
  unit: string;
  unit_rate: number;
  note: string;
}

interface POFormProps {
  supplierId?: number;
  projectId?: number;
  companyId?: string | null;
  existingPO?: {
    id: number;
    supplier_id: number;
    project_id?: number | null;
    po_reference: string;
    description?: string;
    required_by_date?: string | null;
    total_amount: number;
    line_items?: any[];
  };
  onSubmit: (data: any) => Promise<boolean>;
  onCancel?: () => void;
}

const makeLineItemId = () => `line-${Date.now()}-${Math.random()}`;

const newLineItem = (): LineItem => ({
  id: makeLineItemId(),
  item_name: "",
  quantity_ordered: 1,
  unit: "ea",
  unit_rate: 0,
  note: "",
});

export function PurchaseOrderForm({
  supplierId: presetSupplierId,
  projectId: presetProjectId,
  companyId: presetCompanyId,
  existingPO,
  onSubmit,
  onCancel,
}: POFormProps) {
  const userId = ensureClientUserId();
  const companyId = presetCompanyId || "1";

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | "">(
    presetSupplierId || existingPO?.supplier_id || ""
  );
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">(
    presetProjectId || existingPO?.project_id || ""
  );
  
  const [poReference, setPoReference] = useState(existingPO?.po_reference || "");
  const [description, setDescription] = useState(existingPO?.description || "");
  const [requiredByDate, setRequiredByDate] = useState(existingPO?.required_by_date || "");
  
  const [lineItems, setLineItems] = useState<LineItem[]>(
    existingPO?.line_items?.map((item: any, idx: number) => ({
      id: `line-${idx}`,
      item_name: item.item_name,
      quantity_ordered: item.quantity_ordered,
      unit: item.unit || "ea",
      unit_rate: item.unit_rate,
      note: item.note || "",
    })) || [newLineItem()]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch suppliers and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, projectsRes] = await Promise.all([
          fetch(`/api/suppliers?company_id=${companyId}&user_id=${userId}`),
          fetch(`/api/projects?company_id=${companyId}&user_id=${userId}`),
        ]);

        if (suppliersRes.ok) {
          setSuppliers(await suppliersRes.json());
        }
        if (projectsRes.ok) {
          setProjects(await projectsRes.json());
        }
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };

    fetchData();
  }, [userId, companyId]);

  const totalAmount = lineItems.reduce((sum, item) => sum + item.quantity_ordered * item.unit_rate, 0);

  const handleAddLineItem = () => {
    setLineItems([...lineItems, newLineItem()]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length === 1) {
      setError("At least one line item is required");
      return;
    }
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedSupplierId) {
      setError("Supplier is required");
      return;
    }

    if (lineItems.length === 0) {
      setError("At least one line item is required");
      return;
    }

    // Validate line items
    for (const item of lineItems) {
      if (!item.item_name) {
        setError("All line items must have a name");
        return;
      }
      if (item.quantity_ordered <= 0) {
        setError("Quantity must be greater than 0");
        return;
      }
      if (item.unit_rate < 0) {
        setError("Rate cannot be negative");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        supplier_id: selectedSupplierId,
        project_id: selectedProjectId || null,
        po_reference: poReference || undefined,
        description,
        required_by_date: requiredByDate || null,
        lines: lineItems.map((item) => ({
          item_name: item.item_name,
          quantity_ordered: item.quantity_ordered,
          unit: item.unit,
          unit_rate: item.unit_rate,
          note: item.note,
        })),
        company_id: companyId,
        user_id: userId,
      };

      const success = await onSubmit(payload);
      if (!success) {
        setError("Failed to save purchase order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {existingPO ? "Edit Purchase Order" : "Create New Purchase Order"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier and Project Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Supplier/Vendor *</label>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={!!presetSupplierId}
            >
              <option value="">Select a supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.vendor_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project (Optional)</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PO Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">PO Reference</label>
            <input
              type="text"
              value={poReference}
              onChange={(e) => setPoReference(e.target.value)}
              placeholder="PO-2026-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required By Date</label>
            <input
              type="date"
              value={requiredByDate}
              onChange={(e) => setRequiredByDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description / Notes</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional notes or special instructions for this PO"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Line Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Purchase Order Line Items</h3>
          
          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label className="text-sm font-medium">Material/Service Name *</label>
                    <input
                      type="text"
                      value={item.item_name}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "item_name", e.target.value)
                      }
                      placeholder="e.g., Cement, Steel Reinforcement, Labor"
                      className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Quantity *</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={item.quantity_ordered}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "quantity_ordered", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Unit</label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "unit", e.target.value)
                      }
                      placeholder="ea, kg, m, hrs"
                      className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Unit Rate (ZAR) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_rate}
                      onChange={(e) =>
                        handleLineItemChange(item.id, "unit_rate", Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded mt-1"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-medium">Total</label>
                    <div className="w-full px-2 py-2 border border-gray-300 rounded mt-1 bg-gray-50">
                      R {(item.quantity_ordered * item.unit_rate).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium">Notes</label>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleLineItemChange(item.id, "note", e.target.value)}
                    placeholder="Special instructions or delivery notes"
                    className="w-full px-2 py-1 border border-gray-300 rounded mt-1 text-sm"
                  />
                </div>

                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLineItem(item.id)}
                    className="mt-3 text-red-600 text-sm hover:text-red-700"
                  >
                    Remove Item
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddLineItem}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            + Add Line Item
          </button>
        </div>

        {/* Total Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">PO Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">R {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : existingPO ? "Update PO" : "Create PO"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
