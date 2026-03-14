'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Quote {
  id: number;
  quote_number: string;
  customer_id: number;
  amount: number;
  status: string;
  valid_until: string;
  created_at: string;
}

export function QuotesClient() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/quotes?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch quotes');
        const data = await res.json();
        setQuotes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuotes();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading quotes...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!quotes.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No quotes yet. Create your first quote!</p>
          <Link href="/dashboard/quotes/add" className="text-indigo-600 hover:underline">
            Create a quote
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quote #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valid Until</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                <Link href={`/dashboard/quotes/${quote.id}`} className="hover:underline">
                  {quote.quote_number}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm font-semibold">${quote.amount.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quote.status)}`}>
                  {quote.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{new Date(quote.valid_until).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(quote.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
