import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const query = supabaseServer
      .from('budgets')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId);
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error('GET /api/budgets error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ project_id: Number(projectId), planned_amount: 0, actual_amount: 0, user_id: userId, company_id: validCompanyId });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { project_id, planned_amount, actual_amount, user_id: incomingUserId, company_id: incomingCompanyId } = body;
  
  if (!project_id) return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
  
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/budgets ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const payload = { project_id, planned_amount, actual_amount, user_id: userId, company_id: validCompanyId };

    const { data: updated, error: updateError } = await supabaseServer
      .from('budgets')
      .update({ planned_amount, actual_amount })
      .eq('project_id', project_id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId)
      .select()
      .maybeSingle();
    if (updateError) {
      console.error('POST /api/budgets update error:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    if (updated) {
      return NextResponse.json(updated);
    }

    const { data: inserted, error } = await supabaseServer
      .from('budgets')
      .insert([payload])
      .select()
      .single();
    if (error) {
      console.error('POST /api/budgets insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(inserted);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
