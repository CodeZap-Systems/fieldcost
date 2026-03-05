import { createServerClient } from '@/lib/supabase/server';
import { buildPayFastFormData, PAYFAST_URL } from '@/lib/payfast';
import { v4 as uuidv4 } from 'uuid';
import { resolveServerUserId } from '@/lib/serverUser';

export async function POST(request: Request) {
  const supabase = await createServerClient();
  const body = await request.json().catch(() => ({}));
  const derivedUserId = resolveServerUserId(body?.user_id);

  let userId = derivedUserId;
  let userEmail = body?.email as string | undefined;

  const authResult = await supabase.auth.getUser();
  if (authResult?.data?.user?.id) {
    userId = authResult.data.user.id;
    userEmail = authResult.data.user.email || userEmail;
  }

  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name')
    .eq('id', userId)
    .maybeSingle();

  const internalPaymentId = uuidv4();

  await supabase.from('payment_attempts').insert({
    id: internalPaymentId,
    user_id: userId,
    status: 'pending',
    amount: 899.0,
    created_at: new Date().toISOString(),
  });

  const formData = buildPayFastFormData(
    userEmail || `${userId}@fieldcost.local`,
    profile?.full_name || userEmail || 'FieldCost User',
    internalPaymentId
  );

  return Response.json({
    payfast_url: PAYFAST_URL,
    form_data: formData,
  });
}
