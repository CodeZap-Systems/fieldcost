import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

// Get authenticated user with fallback to demo user
async function resolveUserContext(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const { data } = await supabaseServer.auth.getUser(token);
      if (data?.user?.id) {
        return data.user.id;
      }
    } catch (err) {
      console.warn('[resolveUserContext] Failed to get user from auth header:', err);
    }
  }
  const { searchParams } = new URL(req.url);
  const fallback = searchParams.get('user_id');
  const resolved = resolveServerUserId(fallback);
  console.warn(`[resolveUserContext] Using fallback user: ${resolved}`);
  return resolved;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  
  // Get authenticated user with fallback
  const userId = await resolveUserContext(req);
  const companyIdParam = searchParams.get('company_id');
  
  if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  
  // CRITICAL: Enforce company_id requirement for data isolation (GDPR/POPIA)
  if (!companyIdParam || !companyIdParam.trim()) {
    console.warn(`[SECURITY] GET /api/budgets: Missing company_id for user ${userId}`);
    return NextResponse.json(
      { error: 'company_id parameter is required for data isolation' },
      { status: 400 }
    );
  }

  // Convert company_id: try as integer first, fallback to string (for demo IDs like "demo-company-id")
  let companyId: string | number = companyIdParam.trim();
  const asInt = parseInt(companyId, 10);
  if (Number.isFinite(asInt)) {
    companyId = asInt;  // DB real companies use integers
  }
  // Otherwise keep as string (for demo company IDs)

  try {
    let query = supabaseServer
      .from('budgets')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('company_id', companyId);  // CRITICAL: Both user AND company must match
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error('GET /api/budgets error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ project_id: Number(projectId), planned_amount: 0, actual_amount: 0, user_id: userId, company_id: companyId || 1 });
    }
    return NextResponse.json({ ...data, company_id: data.company_id || companyId || 1 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { project_id, planned_amount, actual_amount, company_id: incomingCompanyId } = body;
    
    if (!project_id) return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    const companyId = incomingCompanyId;
    
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error('POST /api/budgets ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

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
    console.error('POST /api/budgets exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
