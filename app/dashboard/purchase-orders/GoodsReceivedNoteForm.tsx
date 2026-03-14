"use client";

import { useState, useEffect } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface GRNFormProps {
  poId: number;
  poReference: string;
  companyId?: string | null;
  onSubmit: (data: any) => Promise<boolean>;
  onCancel?: () => void;
}

export function GoodsReceivedNoteForm({
  poId,
  poReference,
  companyId = "1",
  onSubmit,
  onCancel,
}: GRNFormProps) {
  const userId = ensureClientUserId();

  const [lineItems, setLineItems] = useState<any[]>([]);
  const [selectedLineItemId, setSelectedLineItemId] = useState<number | "">(""); 
  const [quantityReceived, setQuantityReceived] = useState<number>(1);
  const [unit, setUnit] = useState("ea");
  const [qualityStatus, setQualityStatus] = useState("inspected_good");
  const [qualityNotes, setQualityNotes] = useState("");
  const [damageNotes, setDamageNotes] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [receivedAtLocation, setReceivedAtLocation] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch PO line items
  useEffect(() => {
    const fetchLineItems = async () => {
      try {
        const res = await fetch(`/api/purchase-orders?id=${poId}&company_id=${companyId}&user_id=${userId}`);
        if (res.ok) {
          const pos = await res.json();
          const po = Array.isArray(pos) ? pos[0] : pos;
          if (po && po.line_items) {
            setLineItems(po.line_items);
          }
        }
      } catch (err) {
        console.error("Failed to fetch PO details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLineItems();
  }, [poId, companyId, userId]);

  const selectedLineItem = lineItems.find((item) => item.id === selectedLineItemId);
  const maxQuantity = selectedLineItem ? selectedLineItem.quantity_ordered - (selectedLineItem.quantity_received || 0) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedLineItemId) {
      setError("Please select a line item");
      return;
    }

    if (quantityReceived <= 0) {
      setError("Quantity received must be greater than 0");
      return;
    }

    if (quantityReceived > maxQuantity) {
      setError(`Cannot receive more than ${maxQuantity} units`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        po_id: poId,
        po_line_item_id: selectedLineItemId,
        quantity_received: quantityReceived,
        unit,
        quality_status: qualityStatus,
        quality_notes: qualityNotes || null,
        damage_notes: damageNotes || null,
        received_by: receivedBy || null,
        received_at_location: receivedAtLocation || null,
        follow_up_required: followUpRequired,
        follow_up_notes: followUpNotes || null,
        company_id: companyId,
        user_id: userId,
      };

      const success = await onSubmit(payload);
      if (!success) {
        setError("Failed to log goods received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        Log Goods Received - PO {poReference}
      </h2>

      <p className="text-gray-600 mb-6">
        Record receipt of goods against this purchase order line item
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {lineItems.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded">
          No line items found for this PO
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Line Item Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Item to Receive *</label>
            <select
              value={selectedLineItemId}
              onChange={(e) => {
                setSelectedLineItemId(e.target.value ? Number(e.target.value) : "");
                setQuantityReceived(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Choose a line item...</option>
              {lineItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name} - Ordered: {item.quantity_ordered}, Received: {item.quantity_received || 0}
                </option>
              ))}
            </select>
          </div>

          {selectedLineItem && (
            <>
              {/* Quantity and Unit */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Item: <strong>{selectedLineItem.item_name}</strong>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ordered: {selectedLineItem.quantity_ordered} {selectedLineItem.unit}<br />
                  Already Received: {selectedLineItem.quantity_received || 0} {selectedLineItem.unit}<br />
                  Remaining: {maxQuantity} {selectedLineItem.unit}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity Received *</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={maxQuantity}
                    value={quantityReceived}
                    onChange={(e) => setQuantityReceived(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quality Status *</label>
                  <select
                    value={qualityStatus}
                    onChange={(e) => setQualityStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="accepted">Accepted</option>
                    <option value="inspected_good">Inspected - Good</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Quality and Damage Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Quality Notes</label>
                <textarea
                  value={qualityNotes}
                  onChange={(e) => setQualityNotes(e.target.value)}
                  placeholder="Notes on quality inspection"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Damage Notes</label>
                <textarea
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="Any damage or defects found"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Receiving Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Received By</label>
                  <input
                    type="text"
                    value={receivedBy}
                    onChange={(e) => setReceivedBy(e.target.value)}
                    placeholder="Name of person receiving goods"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Received At Location</label>
                  <input
                    type="text"
                    value={receivedAtLocation}
                    onChange={(e) => setReceivedAtLocation(e.target.value)}
                    placeholder="e.g., Site A, Warehouse, Office"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Follow-up */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Follow-up Required</span>
                </label>
              </div>

              {followUpRequired && (
                <div>
                  <label className="block text-sm font-medium mb-2">Follow-up Notes</label>
                  <textarea
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Details about follow-up needed (e.g., missing items, quality issues)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Recording..." : "Record Goods Received"}
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
            </>
          )}
        </form>
      )}
    </div>
  );
}
