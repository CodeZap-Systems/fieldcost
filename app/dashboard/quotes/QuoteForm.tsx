"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = { id: number; name: string };
type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

interface QuoteFormProps {
  onAdd?: (quote: any) => Promise<boolean>;
  companyId?: string | null;
}

const makeLineId = () => `${Date.now()}-${Math.random()}`;

export default function QuoteForm({ onAdd, companyId }: QuoteFormProps) {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [reference, setReference] = useState("");
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: makeLineId(), description: "", quantity: 1, unitPrice: 0 },
  ]);
  const [status, setStatus] = useState<{ success?: string; error?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const res = await fetch("/api/customers?limit=100");
      if (res.ok) {
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  }

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

    if (!selectedCustomer) {
      setStatus({ error: "Please select a customer" });
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
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(selectedCustomer),
          lines: lineItems.map(line => ({
            description: line.description,
            quantity: line.quantity,
            unit_price: line.unitPrice,
            line_total: getLineTotal(line),
          })),
          validUntil,
          reference,
          notes,
          amount: getTotal(),
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus({ error: data.error || "Failed to create quote" });
        return;
      }

      setStatus({ success: `Quote created: ${data.quote_number}` });
      setTimeout(() => router.push("/dashboard/quotes"), 1500);
    } catch (error) {
      setStatus({ error: String(error) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow-md p-6 w-full flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Create Quote</h2>
        <p className="text-sm text-gray-500">Create a new quote for your customer. Set an expiry date for valid until.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Customer</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedCustomer}
            onChange={e => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">Select customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Valid Until</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={validUntil}
            onChange={e => setValidUntil(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Reference</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="e.g. Quote for bathroom renovation"
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
                placeholder="Item description"
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
              <label className="text-sm font-semibold mb-1 block">Unit Price</label>
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
          placeholder="Additional notes, terms, or conditions"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <h3 className="text-lg font-bold">Total</h3>
          <p className="text-sm text-gray-500">R{getTotal().toFixed(2)}</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Quote"}
        </button>
      </div>

      {status.success && <div className="text-green-600 text-sm">{status.success}</div>}
      {status.error && <div className="text-red-600 text-sm">{status.error}</div>}
    </form>
  );
}
