"use client";
import { useState } from "react";

type ItemPayload = { name: string; price: number; item_type: "physical" | "service" };

export default function ItemForm({ onAdd }: { onAdd: (item: ItemPayload) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [itemType, setItemType] = useState<ItemPayload["item_type"]>("physical");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name || price <= 0) {
      setError("Please enter a name and a price greater than 0.");
      return;
    }
    const ok = await onAdd({ name, price, item_type: itemType });
    if (ok) {
      setSuccess("Item added!");
      setName("");
      setPrice(0);
      setItemType("physical");
    } else {
      setError("Failed to add item.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-1 gap-2 w-full max-w-2xl md:grid-cols-4">
      <input
        className="border p-2 rounded md:col-span-2"
        placeholder="Item Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        className="border p-2 rounded"
        placeholder="Price"
        type="number"
        min="0"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
        required
      />
      <select
        className="border p-2 rounded"
        value={itemType}
        onChange={e => setItemType(e.target.value as ItemPayload["item_type"])}
      >
        <option value="physical">Physical item</option>
        <option value="service">Service</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" type="submit">Add</button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </form>
  );
}
