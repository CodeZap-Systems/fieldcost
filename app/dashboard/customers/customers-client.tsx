'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
}

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/customers?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch customers');
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading customers...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!customers.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No customers yet. Add your first customer!</p>
          <Link href="/dashboard/customers/add" className="text-indigo-600 hover:underline">
            Add a customer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Address</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{customer.address || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
