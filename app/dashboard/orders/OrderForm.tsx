"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: number; name: string };
type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

interface OrderFormProps {
  onAdd?: (order: any) => Promise<boolean>;
  companyId?: string | null;
}

const makeLineId = () => `${Date.now()}-${Math.random()}`;

export default function OrderForm({ onAdd, companyId }: OrderFormProps) {
  const router = useRouter();
  const [vendorName, setVendorName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: makeLineId(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [status, setStatus] = useState<{ success?: string; error?: string }>({});
  const [loading, setLoading] = useState(false);

  function addLine() {
    setLineItems([
      ...lineItems,
      { id: makeLineId(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  }

  function removeLine(id: string) {
    setLineItems(lineItems.filter(line => line.id !== id));
  }

  function updateLine(id: string, field: string, value: any) {
    setLineItems(
      lineItems.map(line =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  }

  function getLineTotal(line: LineItem): number {
    return line.quantity * line.unitPrice;
  }

  function getTotal(): number {
    return lineItems.reduce((sum, line) => sum + getLineTotal(line), 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({});

    if (!vendorName.trim()) {
      setStatus({ error: "Please enter vendor name" });
      return;
    }

    if (lineItems.length === 0) {
      setStatus({ error: "Please add at least one line item" });
      return;
    }

    if (lineItems.some(line => !line.description || line.quantity <= 0)) {
      setStatus({ error: "Please fill in all required line item fields" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName,
          deliveryDate,
          lines: lineItems.map(line => ({
            description: line.description,
            quantity: line.quantity,
            unit_price: line.unitPrice,
            line_total: getLineTotal(line),
          })),
          reference,
          notes,
          amount: getTotal(),
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ error: data.error || "Failed to create order" });
        return;
      }

      setStatus({ success: `Order created: ${data.po_number}` });
      setTimeout(() => router.push("/dashboard/orders"), 1500);
    } catch (error) {
      setStatus({ error: String(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 w-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Create Purchase Order</h2>
        <p className="text-sm text-gray-500">Create a new purchase order. Specify vendor and expected delivery date.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Vendor Name</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="e.g. ABC Building Supplies"
            value={vendorName}
            onChange={e => setVendorName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Delivery Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Reference/PO Number</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="e.g. INT-001 or Job #5"
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Line items</h3>
          <button type="button" className="text-indigo-600 font-medium" onClick={addLine}>
            + Add line
          </button>
        </div>

        {lineItems.map((line, idx) => (
          <div key={line.id} className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-1 block">Description</label>
              <input
                className="border rounded w-full p-2"
                placeholder="Item/material description"
                value={line.description}
                onChange={e => updateLine(line.id, "description", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Qty</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className="border rounded w-full p-2"
                value={line.quantity}
                onChange={e => updateLine(line.id, "quantity", Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Unit Cost</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="border rounded w-full p-2"
                value={line.unitPrice}
                onChange={e => updateLine(line.id, "unitPrice", Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Total</label>
              <div className="p-2 bg-gray-100 rounded text-right">
                R{getLineTotal(line).toFixed(2)}
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                className="w-full p-2 text-red-600 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block font-semibold mb-1">Notes</label>
        <textarea
          className="border p-2 rounded w-full"
          placeholder="Special instructions, delivery notes, or conditions"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <h3 className="text-lg font-bold">Order Total</h3>
          <p className="text-sm text-gray-500">R{getTotal().toFixed(2)}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Order"}
        </button>
      </div>

      {status.success && <div className="text-green-600 text-sm">{status.success}</div>}
      {status.error && <div className="text-red-600 text-sm">{status.error}</div>}
    </form>
  );
}
