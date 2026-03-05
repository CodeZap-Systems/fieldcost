import { verifyPayFastITN } from '@/lib/payfast';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.text();

  // PayFast ITN (notify_url) MUST be a public HTTPS URL.
  // It will not work on localhost.
  // For staging: set NEXT_PUBLIC_APP_URL to your Vercel staging URL.
  // For production: set NEXT_PUBLIC_APP_URL to https://www.fieldcost.co.za (or your domain)
  const isValid = await verifyPayFastITN(body, {});

  if (!isValid) {
    console.error('PayFast ITN validation failed');
    return new Response('INVALID', { status: 400 });
  }

  const params = Object.fromEntries(new URLSearchParams(body));

  const {
    m_payment_id,
    payment_status,
    pf_payment_id,
    token,
  } = params;

  const supabase = await createServerClient();

  const { data: attempt } = await supabase
    .from('payment_attempts')
    .select('user_id')
    .eq('id', m_payment_id)
    .maybeSingle();

  if (!attempt) {
    return new Response('NOT FOUND', { status: 404 });
  }

  if (payment_status === 'COMPLETE') {
    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'growth',
        subscription_status: 'active',
        payfast_token: token || null,
        payfast_payment_id: pf_payment_id,
      })
      .eq('id', attempt.user_id);

    await supabase
      .from('payment_attempts')
      .update({ status: 'complete', payfast_payment_id: pf_payment_id })
      .eq('id', m_payment_id);
  } else if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
    await supabase
      .from('profiles')
      .update({ subscription_tier: 'starter', subscription_status: 'inactive' })
      .eq('id', attempt.user_id);

    await supabase
      .from('payment_attempts')
      .update({ status: String(payment_status).toLowerCase() })
      .eq('id', m_payment_id);
  }

  return new Response('OK', { status: 200 });
}

