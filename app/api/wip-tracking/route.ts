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
    console.warn(`[SECURITY] GET /api/wip-tracking: Missing company_id for user ${userId}`);
    return NextResponse.json(
      { error: 'company_id parameter is required for data isolation' },
      { status: 400 }
    );
  }
  
  try {
    // Validate user has access to company
    await getCompanyContext(userId, companyId);
    
    // Tier 2: Return WIP data from invoices (work in progress)
    // Tier 3: Could use dedicated tier3_wip_snapshots table
    const { data, error } = await supabaseServer
      .from('invoices')
      .select('id, customer_id, amount, created_at, description')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    // Format as WIP tracking data
    const wipData = (data || []).map((inv) => ({
      id: inv.id,
      project_id: null,
      task_id: null,
      earned_value: inv.amount || 0,
      actual_cost: inv.amount || 0,
      status: 'active',
      created_at: inv.created_at,
    }));
    
    return NextResponse.json(wipData);
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
