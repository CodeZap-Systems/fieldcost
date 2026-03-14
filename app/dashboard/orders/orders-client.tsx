'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';
import { ensureClientUserId } from '@/lib/clientUser';

interface Order {
  id: number;
  po_number: string;
  vendor_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const userId = await ensureClientUserId();
        const companyId = readActiveCompanyId() || '8';
        const params = new URLSearchParams({
          user_id: userId,
          company_id: companyId,
        });
        const res = await fetch(`/api/orders?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!orders.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet. Create your first order!</p>
          <Link href="/dashboard/orders/add" className="text-indigo-600 hover:underline">
            Create an order
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">PO #</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vendor</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-mono text-sm text-indigo-600">
                <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                  {order.po_number}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm">{order.vendor_name}</td>
              <td className="px-6 py-4 text-sm font-semibold">${order.amount.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
