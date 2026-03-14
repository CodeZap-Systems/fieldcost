"use client";

import { useState } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface Supplier {
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
  onSubmit: (data: any) => Promise<boolean>;
  onCancel?: () => void;
}

export function SupplierForm({
  existingSupplier,
  companyId = "1",
  onSubmit,
  onCancel,
}: SupplierFormProps) {
  const userId = ensureClientUserId();

  const [vendorName, setVendorName] = useState(existingSupplier?.vendor_name || "");
  const [contactName, setContactName] = useState(existingSupplier?.contact_name || "");
  const [email, setEmail] = useState(existingSupplier?.email || "");
  const [phone, setPhone] = useState(existingSupplier?.phone || "");
  const [addressLine1, setAddressLine1] = useState(existingSupplier?.address_line1 || "");
  const [addressLine2, setAddressLine2] = useState(existingSupplier?.address_line2 || "");
  const [city, setCity] = useState(existingSupplier?.city || "");
  const [province, setProvince] = useState(existingSupplier?.province || "");
  const [postalCode, setPostalCode] = useState(existingSupplier?.postal_code || "");
  const [country, setCountry] = useState(existingSupplier?.country || "");
  const [paymentTerms, setPaymentTerms] = useState(existingSupplier?.payment_terms || "Net 30");
  const [taxId, setTaxId] = useState(existingSupplier?.tax_id || "");
  const [rating, setRating] = useState(existingSupplier?.rating || 0);
  const [notes, setNotes] = useState(existingSupplier?.notes || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!vendorName.trim()) {
      setError("Vendor name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        vendor_name: vendorName,
        contact_name: contactName || null,
        email: email || null,
        phone: phone || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        city: city || null,
        province: province || null,
        postal_code: postalCode || null,
        country: country || null,
        payment_terms: paymentTerms,
        tax_id: taxId || null,
        rating: Number(rating) || 0,
        notes: notes || null,
        company_id: companyId,
        user_id: userId,
      };

      const success = await onSubmit(payload);
      if (!success) {
        setError("Failed to save supplier");
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
        {existingSupplier ? "Edit Supplier" : "Add New Supplier/Vendor"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Name and Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vendor/Company Name *</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g., BuildSupplies Inc"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Person</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supplier@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 11 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2">Address Line 1</label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            placeholder="Street address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address Line 2</label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            placeholder="Suite, apartment, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* City, Province, Postal, Country */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Johannesburg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Province</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              placeholder="Gauteng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Postal Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="2000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="South Africa"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Payment Terms and Tax ID */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Payment Terms</label>
            <select
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Prepayment">Prepayment</option>
              <option value="Net 15">Net 15</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tax ID / VAT Number</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="12345678901"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Rating and Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating (0-5)</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">Based on delivery performance and quality</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special notes about this supplier (e.g., lead time, quality issues, etc.)"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : existingSupplier ? "Update Supplier" : "Add Supplier"}
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
