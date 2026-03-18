"use client";

import { useState } from "react";
import { Feedback } from "../../../components/Feedback";

export interface Supplier {
  id?: number;
  vendor_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  country?: string;
  payment_terms?: string;
  tax_id?: string;
  rating?: number;
  notes?: string;
}


interface SupplierFormProps {
  existingSupplier?: Supplier;
  companyId?: string | null;
  onSubmit: (data: SupplierFormData) => Promise<boolean>;
  onCancel?: () => void;
}




















export function SupplierForm({ onSubmit, onCancel }: SupplierFormProps) {
  const [form, setForm] = useState<SupplierFormData>({ vendor_name: "", contact_name: "", email: "", phone: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    setIsSubmitting(true);
    const ok = await onSubmit(form);
    if (ok) {
      setSuccess("Supplier saved!");
      setForm({ vendor_name: "", contact_name: "", email: "", phone: "" });
    } else {
      setError("Failed to save supplier");
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Vendor Name *</label>
          <input
            name="vendor_name"
            value={form.vendor_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            placeholder="e.g., BuildSupplies Inc"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Contact Name</label>
          <input
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="e.g., John Smith"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="supplier@example.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="+27 11 123 4567"
          />
        </div>
      </div>
      <div className="flex gap-4 items-center mt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
        )}
        <Feedback type="error" message={error || ""} />
        <Feedback type="success" message={success || ""} />
      </div>
    </form>
  );
}
export type SupplierFormData = {
  vendor_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
};
