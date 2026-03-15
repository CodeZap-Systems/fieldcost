"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";

export type VendorFormState = {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  contact_person: string;
};

type VendorFormProps = {
  onAdd: (vendor: VendorFormState) => Promise<boolean>;
};

const createDefaultForm = (): VendorFormState => ({
  name: "",
  email: "",
  phone: "",
  company_name: "",
  contact_person: "",
});

export default function VendorForm({ onAdd }: VendorFormProps) {
  const [form, setForm] = useState<VendorFormState>(createDefaultForm());
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.name) {
      setError("Please enter vendor name.");
      return;
    }
    const ok = await onAdd(form);
    if (ok) {
      setSuccess("Vendor added!");
      setForm(createDefaultForm());
    } else {
      setError("Failed to add vendor.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-1">Vendor Name *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="border p-2 rounded w-full" 
            required 
            placeholder="e.g., BuildCo Supply"
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
            placeholder="vendor@example.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className="border p-2 rounded w-full" 
            placeholder="+27 11 765 4321"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Company Name</label>
          <input 
            name="company_name" 
            value={form.company_name} 
            onChange={handleChange} 
            className="border p-2 rounded w-full" 
            placeholder="Legal company name"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Contact Person</label>
          <input 
            name="contact_person" 
            value={form.contact_person} 
            onChange={handleChange} 
            className="border p-2 rounded w-full" 
            placeholder="Primary contact name"
          />
        </div>
      </div>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex gap-2">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Vendor
        </button>
      </div>
    </form>
  );
}
