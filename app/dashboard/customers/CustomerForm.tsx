"use client";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { Feedback } from "../../../components/Feedback";

function createDefaultForm() {
  return {
    cashSale: false,
    autoAllocate: false,
    acceptsElectronic: false,
    viewOnline: false,
    creditLimit: "",
    vatNumber: "",
    salesRep: "",
    openingBalance: "",
    openingDate: "",
    email: "",
    contactName: "",
    telephone: "",
    mobile: "",
    fax: "",
    web: "",
    postal: { address: "", code: "" },
    delivery: { address: "", code: "" },
    statementDistribution: "Email",
    defaultDiscount: "0.00",
    defaultPriceList: "Default Price List",
    defaultVatType: "No Default",
    name: "",
    category: "",
    active: true,
  };
}

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2 border-b">
        {tabs.map(t => (
          <Button
            key={t}
            type="button"
            variant={tab === t ? "primary" : "secondary"}
            className={`px-4 py-2 font-semibold border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === "Details" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Name" htmlFor="customer-name" error={error}>
            <input
              id="customer-name"
              className="border p-2 rounded w-full"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Email" htmlFor="customer-email">
            <input
              id="customer-email"
              className="border p-2 rounded w-full"
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>
        </div>
      )}
      <div className="mt-4 flex gap-2 items-center">
        <Button type="submit" variant="primary">Add</Button>
        <Feedback type="success" message={success || ""} />
        <Feedback type="error" message={error || ""} />
      </div>
    </form>
  );
  const [tab, setTab] = useState("Details");
  const [form, setForm] = useState<CustomerFormState>(createDefaultForm());
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const { name, checked } = target;
      setForm(f => ({ ...f, [name]: checked }));
      return;
    }
    const { name, value } = target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAddressChange(e: ChangeEvent<HTMLInputElement>, field: "postal" | "delivery") {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [field]: { ...f[field], [name]: value } }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!form.name || !form.email) {
      setError("Please enter both name and email.");
      return;
    }
    const ok = await onAdd(form);
    if (ok) {
      setSuccess("Customer added!");
      setForm(createDefaultForm());
    } else {
      setError("Failed to add customer.");
    }
  }

  const tabs = ["Details", "Activity", "Additional Contacts", "Notes"];

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2 border-b">
        {tabs.map(t => (
          <button
            key={t}
            type="button"
            className={`px-4 py-2 font-semibold border-b-2 ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === "Details" && (
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block font-semibold mb-1">Customer Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full mb-2" required />
            <label className="block font-semibold mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Cash Sale Customer <input type="checkbox" name="cashSale" checked={form.cashSale} onChange={handleChange} /></label>
            <label className="block font-semibold mb-1">Opening Balance</label>
            <input name="openingBalance" value={form.openingBalance} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Opening Balance as At</label>
            <input name="openingDate" type="date" value={form.openingDate} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Auto Allocate Receipts to Oldest Invoice <input type="checkbox" name="autoAllocate" checked={form.autoAllocate} onChange={handleChange} /></label>
          </div>
          <div>
            <label className="block font-semibold mb-1">Active <input type="checkbox" name="active" checked={form.active} onChange={handleChange} /></label>
            <label className="block font-semibold mb-1">Credit Limit</label>
            <input name="creditLimit" value={form.creditLimit} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Customer VAT Number</label>
            <input name="vatNumber" value={form.vatNumber} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Sales Rep</label>
            <input name="salesRep" value={form.salesRep} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Accepts Electronic Invoices <input type="checkbox" name="acceptsElectronic" checked={form.acceptsElectronic} onChange={handleChange} /></label>
          </div>
        </div>
      )}
      {tab === "Details" && (
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="font-semibold mb-2">Postal Address</h3>
            <input name="address" value={form.postal.address} onChange={e => handleAddressChange(e, "postal")} className="border p-2 rounded w-full mb-2" />
            <input name="code" value={form.postal.code} onChange={e => handleAddressChange(e, "postal")} className="border p-2 rounded w-full mb-2" placeholder="Postal Code" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact Details</h3>
            <input name="contactName" value={form.contactName} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Contact Name" />
            <input name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Email" />
            <input name="telephone" value={form.telephone} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Telephone" />
            <input name="mobile" value={form.mobile} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Mobile" />
            <input name="fax" value={form.fax} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Fax" />
            <input name="web" value={form.web} onChange={handleChange} className="border p-2 rounded w-full mb-2" placeholder="Web Address" />
            <label className="block font-semibold mb-1">Invoices can be viewed online <input type="checkbox" name="viewOnline" checked={form.viewOnline} onChange={handleChange} /></label>
          </div>
        </div>
      )}
      {tab === "Details" && (
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <input name="address" value={form.delivery.address} onChange={e => handleAddressChange(e, "delivery")} className="border p-2 rounded w-full mb-2" />
            <input name="code" value={form.delivery.code} onChange={e => handleAddressChange(e, "delivery")} className="border p-2 rounded w-full mb-2" placeholder="Postal Code" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Default Settings</h3>
            <label className="block font-semibold mb-1">Statement Distribution</label>
            <input name="statementDistribution" value={form.statementDistribution} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Default Discount</label>
            <input name="defaultDiscount" value={form.defaultDiscount} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Default Price List</label>
            <input name="defaultPriceList" value={form.defaultPriceList} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
            <label className="block font-semibold mb-1">Default VAT Type</label>
            <input name="defaultVatType" value={form.defaultVatType} onChange={handleChange} className="border p-2 rounded w-full mb-2" />
          </div>
        </div>
      )}
      {/* Other tabs can be implemented similarly */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded min-w-[120px] mt-4" type="submit">Add Customer</button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </form>
  );
}
