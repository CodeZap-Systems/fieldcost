import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  // CRITICAL: Require company_id for data isolation - prevent demo/live data mixing
  if (!companyId || !companyId.trim()) {
    console.warn(`[SECURITY] GET /api/workflows: Missing company_id for user ${userId}`);
    return NextResponse.json(
      { error: 'company_id parameter is required for data isolation' },
      { status: 400 }
    );
  }
  
  try {
    // Validate user has access to company
    await getCompanyContext(userId, companyId);
    
    // Workflows are tied to companies
    const { data, error } = await supabaseServer
      .from('custom_workflows')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = resolveServerUserId(body.user_id);
  
  try {
    if (userId) await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/workflows ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  const payload = {
    name: body.name || 'Unnamed Workflow',
    applicable_to: body.type || 'general',
    requires_approval: body.requires_approval || (body.approvers && body.approvers.length > 0) || false,
    approval_chain: body.approvers || [],
  };

  try {
    const { data, error } = await supabaseServer
      .from('custom_workflows')
      .insert([payload])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err) {
    console.error('POST /api/workflows error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
