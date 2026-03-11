import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  
  try {
    // For now, return empty array since workflows are tied to companies
    const { data, error } = await supabaseServer.from('custom_workflows').select('*').order('created_at', { ascending: false });
    
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
