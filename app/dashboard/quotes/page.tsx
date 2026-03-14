import Link from "next/link";
import { QuotesClient } from "./quotes-client";

export default function QuotesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-gray-500 mt-1">Manage customer quotes and proposals</p>
        </div>
        <Link
          href="/dashboard/quotes/add"
          className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          + New Quote
        </Link>
      </div>

      <QuotesClient />
    </div>
  );
}
