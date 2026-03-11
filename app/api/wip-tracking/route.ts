import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  
  try {
    const query = supabaseServer.from('tier3_wip_snapshots').select('*').order('created_at', { ascending: false });
    const finalQuery = userId ? query : query;
    const { data, error } = await finalQuery;
    
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
    await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/wip-tracking ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  // Map incoming field names to database schema
  const payload = {
    project_id: body.project_id,
    task_id: body.task_id,
    earned_value: body.earned_value || 0,
    actual_cost_to_date: body.actual_cost || 0,
    budgeted_cost_to_date: body.budgeted_cost || 0,
    variance: body.variance || 0,
    physical_progress: body.physical_progress || 0,
    forecasted_completion: body.forecasted_completion,
    status: body.status || 'active',
    created_by: userId,
  };

  try {
    const { data, error } = await supabaseServer
      .from('tier3_wip_snapshots')
      .insert([payload])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err) {
    console.error('POST /api/wip-tracking error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
