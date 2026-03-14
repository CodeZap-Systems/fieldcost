import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';
import { DEMO_COMPANY_ID } from '../../../lib/demoConstants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // CRITICAL: Get authenticated user from session, not from query params
  const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
  if (authError || !user) {
    console.warn('[GET /api/crew] No authenticated user found');
    return NextResponse.json([], { status: 401 });
  }
  const userId = user.id;
  const companyIdParam = searchParams.get('company_id');

  // CRITICAL: Enforce company_id requirement for data isolation (GDPR/POPIA)
  if (!companyIdParam || !companyIdParam.trim()) {
    console.warn(`[SECURITY] GET /api/crew: Missing company_id for user ${userId}`);
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
    // Check if this is a demo company
    let isDemoCompany = false;
    try {
      const { data: company, error: companyError } = await supabaseServer
        .from('company_profiles')
        .select('is_demo')
        .eq('id', companyId)
        .maybeSingle();

      if (!companyError && company) {
        // Check both the is_demo flag AND the DEMO_COMPANY_ID constant
        isDemoCompany = company.is_demo === true || companyId === DEMO_COMPANY_ID;
      }
    } catch (err) {
      console.error(`[GET /api/crew] Company lookup error:`, err);
    }

    // For DEMO companies, only filter by company_id (skip user_id filter)
    let query = supabaseServer
      .from('crew_members')
      .select('*')
      .eq('company_id', companyId)
      .order('name', { ascending: true });
    
    if (!isDemoCompany && userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const companyId = body.company_id;
    
    // CRITICAL: Get authenticated user from session
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error('POST /api/crew ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Validate user owns this company
    let validCompanyId: number;
    try {
      const context = await getCompanyContext(userId, companyId);
      validCompanyId = context.companyId;
    } catch (contextError) {
      console.error(`[POST /api/crew] Company validation failed:`, contextError);
      return NextResponse.json({ error: 'Company validation failed - access denied' }, { status: 403 });
    }

    const payload = {
      name: body.name,
      hourly_rate: typeof body.hourly_rate === 'number' ? body.hourly_rate : Number(body.hourly_rate) || 0,
      user_id: userId,
      company_id: validCompanyId  // CRITICAL: Always include
    };

    const { data, error } = await supabaseServer
      .from('crew_members')
      .insert([payload])
      .select();
    
    if (error) {
      console.error('POST /api/crew insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data?.[0]);
  } catch (err) {
    console.error('POST /api/crew exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
