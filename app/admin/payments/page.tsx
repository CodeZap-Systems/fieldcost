/**
 * ADMIN CMS - Payment Methods Management Page
 * 
 * Manage company payment methods (credit cards, bank accounts, etc.)
 */

"use client";

import React, { useState, useEffect } from "react";

interface PaymentMethod {
  id: string;
  company_id: string;
  payment_type: string;
  payment_details: Record<string, any>;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export default function PaymentMethodsPage() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [companyFilter, setCompanyFilter] = useState("");

  const [formData, setFormData] = useState({
    company_id: "",
    payment_type: "card",
    card_number: "",
    card_holder: "",
    expiry: "",
    cvv: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
  });

  useEffect(() => {
    fetchPayments();
  }, [filterType, companyFilter]);

  async function fetchPayments() {
    try {
      const params = new URLSearchParams();
      if (filterType !== "all") params.append("payment_type", filterType);
      if (companyFilter) params.append("company_id", companyFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`);
      const data = await res.json();
      setPayments(data.payment_methods || []);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createPaymentMethod(e: React.FormEvent) {
    e.preventDefault();
    try {
      const paymentDetails =
        formData.payment_type === "card"
          ? {
              card_number: formData.card_number.slice(-4),
              card_holder: formData.card_holder,
              expiry: formData.expiry,
            }
          : {
              bank_name: formData.bank_name,
              account_number: formData.account_number.slice(-4),
              account_holder: formData.account_holder,
            };

      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: formData.company_id,
          payment_type: formData.payment_type,
          payment_details: paymentDetails,
        }),
      });

      if (res.ok) {
        await fetchPayments();
        setFormData({
          company_id: "",
          payment_type: "card",
          card_number: "",
          card_holder: "",
          expiry: "",
          cvv: "",
          bank_name: "",
          account_number: "",
          account_holder: "",
        });
        setShowCreateForm(false);
        alert("Payment method added successfully");
      }
    } catch (err) {
      console.error("Failed to create payment:", err);
      alert("Failed to create payment method");
    }
  }

  async function setAsDefault(paymentId: string) {
    try {
      const res = await fetch(`/api/admin/payments?id=${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_default: true }),
      });

      if (res.ok) {
        await fetchPayments();
      }
    } catch (err) {
      console.error("Failed to set as default:", err);
    }
  }

  async function deactivatePayment(paymentId: string) {
    if (!confirm("Deactivate this payment method?")) return;

    try {
      const res = await fetch(`/api/admin/payments?id=${paymentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchPayments();
      }
    } catch (err) {
      console.error("Failed to deactivate payment:", err);
    }
  }

  const stats = {
    total: payments.length,
    cards: payments.filter((p) => p.payment_type === "card").length,
    bank_accounts: payments.filter((p) => p.payment_type === "bank").length,
    active: payments.filter((p) => p.is_active).length,
  };

  const paymentTypeLabels: Record<string, string> = {
    card: "Credit Card",
    bank: "Bank Account",
    check: "Check",
    manual: "Manual Payment",
  };

  const paymentTypeIcons: Record<string, string> = {
    card: "💳",
    bank: "🏦",
    check: "📋",
    manual: "👤",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payment Methods</h1>
          <p className="text-gray-400">Manage company payment options</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Methods</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Credit Cards</p>
            <p className="text-3xl font-bold text-blue-400">{stats.cards}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Bank Accounts</p>
            <p className="text-3xl font-bold text-green-400">{stats.bank_accounts}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Active</p>
            <p className="text-3xl font-bold text-yellow-400">{stats.active}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
          >
            + Add Payment Method
          </button>

          <input
            type="text"
            placeholder="Filter by company ID"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="all">All Types</option>
            <option value="card">Credit Cards</option>
            <option value="bank">Bank Accounts</option>
            <option value="check">Checks</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Add Payment Method</h2>

              <form onSubmit={createPaymentMethod}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">
                    Company ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_id}
                    onChange={(e) =>
                      setFormData({ ...formData, company_id: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={formData.payment_type}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        payment_type: e.target.value,
                        card_number: "",
                        card_holder: "",
                        bank_name: "",
                        account_number: "",
                      });
                    }}
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                  >
                    <option value="card">Credit Card</option>
                    <option value="bank">Bank Account</option>
                  </select>
                </div>

                {formData.payment_type === "card" ? (
                  <>
                    <div className="mb-4">
                      <label className="text-sm font-semibold mb-2 block">
                        Card Holder
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.card_holder}
                        onChange={(e) =>
                          setFormData({ ...formData, card_holder: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold mb-2 block">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• 1234"
                        required
                        value={formData.card_number}
                        onChange={(e) =>
                          setFormData({ ...formData, card_number: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div>
                        <label className="text-xs font-semibold mb-1 block">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          required
                          value={formData.expiry}
                          onChange={(e) =>
                            setFormData({ ...formData, expiry: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          required
                          value={formData.cvv}
                          onChange={(e) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 px-2 py-1 rounded text-white text-sm"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="text-sm font-semibold mb-2 block">
                        Account Holder
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.account_holder}
                        onChange={(e) =>
                          setFormData({ ...formData, account_holder: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold mb-2 block">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.bank_name}
                        onChange={(e) =>
                          setFormData({ ...formData, bank_name: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold mb-2 block">
                        Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.account_number}
                        onChange={(e) =>
                          setFormData({ ...formData, account_number: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Add Method
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payments List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading payment methods...</div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No payment methods found. Create one to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-6 hover:bg-gray-700/50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">
                          {paymentTypeIcons[payment.payment_type] || "💳"}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {paymentTypeLabels[payment.payment_type]}
                          </p>
                          <p className="text-sm text-gray-400">
                            {payment.payment_type === "card"
                              ? `${payment.payment_details.card_holder} • ••••${payment.payment_details.card_number}`
                              : `${payment.payment_details.account_holder} • ${payment.payment_details.bank_name}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-3">
                        {payment.is_default && (
                          <span className="px-2 py-1 rounded bg-blue-900 text-blue-200 text-xs font-semibold">
                            DEFAULT
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            payment.is_active
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {payment.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!payment.is_default && payment.is_active && (
                        <button
                          onClick={() => setAsDefault(payment.id)}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Set Default
                        </button>
                      )}
                      {payment.is_active && (
                        <button
                          onClick={() => deactivatePayment(payment.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Company: {payment.company_id} • Added{" "}
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
