'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  amount: number;
  status: string;
  created_at: string;
}

export function InvoicesClient() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/invoices?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch invoices');
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading invoices...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!invoices.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No invoices yet. Create your first invoice!</p>
          <Link href="/dashboard/invoices/add" className="text-indigo-600 hover:underline">
            Create an invoice
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline">
                  {invoice.invoice_number}
                </Link>
              </td>
              <td className="px-6 py-4 font-semibold">${invoice.amount.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(invoice.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
