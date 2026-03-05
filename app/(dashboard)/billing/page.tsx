'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Tier = 'starter' | 'growth';

export default function BillingPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tier, setTier] = useState<Tier>('starter');
  const [status, setStatus] = useState<string>('inactive');
  const [lockedNotice, setLockedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setLockedNotice(query.get('locked') === 'true');
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const { data: auth } = await supabase.auth.getUser();
        const userId = auth?.user?.id;
        if (!userId) {
          if (active) {
            setTier('starter');
            setStatus('inactive');
          }
          return;
        }

        const { data } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_status')
          .eq('id', userId)
          .maybeSingle();

        if (active) {
          setTier((data?.subscription_tier as Tier) || 'starter');
          setStatus(data?.subscription_status || 'inactive');
        }
      } catch {
        if (active) setError('Unable to load billing profile.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleUpgrade() {
    setSubmitting(true);
    setError(null);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: auth?.user?.id, email: auth?.user?.email }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || 'Unable to initialize checkout');

      const { payfast_url, form_data } = payload as {
        payfast_url: string;
        form_data: Record<string, string>;
      };

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payfast_url;
      Object.entries(form_data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="p-6 text-sm text-gray-600">Loading billing...</main>;
  }

  return (
    <main className="space-y-5 p-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      {lockedNotice && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          ⚠️ This feature requires the Growth plan. Upgrade below to unlock it.
        </div>
      )}

      {tier === 'starter' ? (
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Upgrade to Growth</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">R 899 / month</span>
          </div>

          <p className="text-sm text-gray-600">Billed monthly. Cancel anytime. Payments secured by PayFast.</p>
          <div className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">Secured by PayFast 🔒</div>

          <ul className="mt-4 space-y-1 text-sm text-gray-700">
            <li>✓ Full Sage &amp; Xero accounting integration</li>
            <li>✓ WIP tracking &amp; retention management</li>
            <li>✓ Approval workflows</li>
            <li>✓ Gantt chart project planning</li>
            <li>✓ Geolocation tagging on site visits</li>
            <li>✓ Multi-project dashboard</li>
            <li>✓ Offline mobile access (PWA)</li>
            <li>✓ Priority email support</li>
          </ul>

          <button
            className="mt-5 rounded bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
            onClick={handleUpgrade}
            disabled={submitting}
          >
            {submitting ? 'Redirecting to PayFast...' : 'Upgrade Now — R899/month'}
          </button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </section>
      ) : (
        <section className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-800">✓ Growth Plan Active</h2>
          <p className="mt-2 text-sm text-green-900">
            Your subscription renews monthly. Payments managed via PayFast.
          </p>
          <button
            className="mt-4 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            onClick={() => setShowCancelModal(true)}
          >
            Cancel Subscription
          </button>

          {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="max-w-md rounded-lg bg-white p-5 shadow-lg">
                <h3 className="text-lg font-semibold">Cancellation request</h3>
                <p className="mt-2 text-sm text-gray-700">
                  To cancel, email support@fieldcost.co.za and we will process within 24 hours.
                </p>
                <button className="mt-4 rounded bg-gray-800 px-4 py-2 text-sm text-white" onClick={() => setShowCancelModal(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <p className="text-xs text-gray-500">Current status: {status}</p>
    </main>
  );
}
