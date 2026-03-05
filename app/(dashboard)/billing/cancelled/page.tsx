import Link from 'next/link';

export default function BillingCancelledPage() {
  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>
      <p className="text-gray-700">No payment was taken. You are still on the Starter plan.</p>
      <Link href="/billing" className="inline-flex rounded bg-indigo-600 px-4 py-2 text-white">Try Again</Link>
    </main>
  );
}
