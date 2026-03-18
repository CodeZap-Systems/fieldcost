"use client";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { Feedback } from "../../../components/Feedback";

export default function ItemForm({ onAdd }: { onAdd?: (item: { name: string; price: number; cost: number; itemType: string; minReorder: number; maxReorder: number }) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [cost, setCost] = useState(0);
  const [itemType, setItemType] = useState("physical");
  const [minReorder, setMinReorder] = useState(0);
  const [maxReorder, setMaxReorder] = useState(0);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name) {
      setError("Item name is required.");
      return;
    }
    if (onAdd) {
      setSubmitting(true);
      const success = await onAdd({ name, price, cost, itemType, minReorder, maxReorder });
      setSubmitting(false);
      if (success) {
        setName("");
        setPrice(0);
        setCost(0);
        setItemType("physical");
        setMinReorder(0);
        setMaxReorder(0);
        setSuccess("Item added successfully.");
      } else {
        setError("Failed to add item.");
      }
      return;
    }
    // fallback: local success
    setSuccess("Item added!");
    setName("");
    setPrice(0);
    setCost(0);
    setItemType("physical");
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4 w-full max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Item Name" htmlFor="item-name" error={error}>
          <input
            id="item-name"
            className="border p-2 rounded w-full"
            placeholder="Item Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Type" htmlFor="item-type">
          <select
            id="item-type"
            className="border p-2 rounded w-full"
            value={itemType}
            onChange={e => setItemType(e.target.value)}
          >
            <option value="physical">Physical</option>
            <option value="service">Service</option>
          </select>
        </FormField>
        <FormField label="Cost" htmlFor="item-cost">
          <input
            id="item-cost"
            className="border p-2 rounded w-full"
            type="number"
            min="0"
            value={cost}
            onChange={e => setCost(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Min Re-order Level" htmlFor="item-min-reorder">
          <input
            id="item-min-reorder"
            className="border p-2 rounded w-full"
            type="number"
            min="0"
            value={minReorder}
            onChange={e => setMinReorder(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Max Re-order Level" htmlFor="item-max-reorder">
          <input
            id="item-max-reorder"
            className="border p-2 rounded w-full"
            type="number"
            min="0"
            value={maxReorder}
            onChange={e => setMaxReorder(Number(e.target.value))}
          />
        </FormField>
        <FormField label="Selling Price" htmlFor="item-price">
          <input
            id="item-price"
            className="border p-2 rounded w-full"
            type="number"
            min="0"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            required
          />
        </FormField>
      </div>
      <div className="flex gap-4 items-center">
        <Button type="submit" variant="primary">Add Item</Button>
        <Feedback type="success" message={success || ""} />
        <Feedback type="error" message={error || ""} />
      </div>
    </form>
  );
}