import Link from "next/link";
import { OrdersClient } from "./orders-client";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-gray-500 mt-1">Manage purchase orders and vendor supplies</p>
        </div>
        <Link
          href="/dashboard/orders/add"
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + New Order
        </Link>
      </div>

      <OrdersClient />
    </div>
  );
}
