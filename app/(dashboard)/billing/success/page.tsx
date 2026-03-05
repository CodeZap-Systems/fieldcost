import Link from 'next/link';

export default function BillingSuccessPage() {
  return (
    <main className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">🎉 Welcome to Growth!</h1>
      <p className="text-gray-700">
        Your payment is being processed. Your Growth features will activate within a few minutes. Refresh the page if they are not available yet.
      </p>
      <p className="text-sm text-gray-600">You will receive a confirmation email from PayFast and from FieldCost.</p>
      <Link href="/" className="inline-flex rounded bg-indigo-600 px-4 py-2 text-white">Go to Dashboard</Link>
    </main>
  );
}
