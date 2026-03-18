"use client";
import { CustomerFormState } from "./CustomerForm.types";
import React, { useState } from "react";

export default function CustomerForm({ onAdd }: { onAdd?: (customer: { name: string; email: string }) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (onAdd) {
      setSubmitting(true);
      const success = await onAdd({ name, email });
      setSubmitting(false);
      if (success) {
        setName("");
        setEmail("");
        // Optionally show a success message
      }
    } else {
      alert(`Customer: ${name}, Email: ${email}`);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Add Customer</h2>
      <div className="mb-2">
        <label className="block mb-1">Name</label>
        <input className="border px-2 py-1 w-full" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Email</label>
        <input className="border px-2 py-1 w-full" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  );
}
