'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Item {
  id: number;
  name: string;
  price: number;
  item_type: string;
}

export function ItemsClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/items?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchItems();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading items...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!items.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No items yet. Add your first item!</p>
          <Link href="/dashboard/items/add" className="text-indigo-600 hover:underline">
            Add an item
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm font-semibold">${item.price?.toFixed(2) || 'N/A'}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                  {item.item_type || 'physical'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
