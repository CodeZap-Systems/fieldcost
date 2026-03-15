import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';
import { DEMO_COMPANY_ID } from '../../../lib/demoConstants';

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
  
  // Get authenticated user with fallback
  const userId = await resolveUserContext(req);
  const companyIdParam = searchParams.get('company_id');

  // CRITICAL: Enforce company_id requirement for data isolation (GDPR/POPIA)
  if (!companyIdParam || !companyIdParam.trim()) {
    console.warn(`[SECURITY] GET /api/tasks: Missing company_id for user ${userId}`);
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
      console.error(`[GET /api/tasks] Company lookup error:`, err);
    }

    // For DEMO companies, only filter by company_id (skip user_id filter)
    let query;
    if (isDemoCompany) {
      query = supabaseServer
        .from('tasks')
        .select('*, project:projects(name)')
        .eq('company_id', companyId)
        .order('id', { ascending: false });
    } else {
      query = supabaseServer
        .from('tasks')
        .select('*, project:projects(name)')
        .eq('user_id', userId)
        .eq('company_id', companyId)
        .order('id', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const companyId = body.company_id;
    
    // Get authenticated user with fallback - use same pattern as GET
    const userId = await resolveUserContext(req);
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required for data isolation' }, { status: 400 });
    }

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error('POST /api/tasks ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Validate user owns this company and get correct ID
    let validCompanyId: string;
    try {
      const context = await getCompanyContext(userId, companyId);
      validCompanyId = context.companyId;
      console.log(`[POST /api/tasks] Validated company ${validCompanyId} for user ${userId}`);
    } catch (contextError) {
      console.error(`[POST /api/tasks] Company validation failed:`, contextError);
      return NextResponse.json({ error: 'Company validation failed - access denied' }, { status: 403 });
    }
    
    const crewId = body.crew_member_id ? Number(body.crew_member_id) : null;
    
    // Always include company_id in insert
    const payload = {
      name: body.name,
      description: body.description ?? null,
      project_id: body.project_id ?? null,
      status: body.status ?? 'todo',
      seconds: body.seconds ?? 0,
      assigned_to: body.assigned_to ?? null,
      crew_member_id: crewId,
      billable: typeof body.billable === 'boolean' ? body.billable : body.billable === 'false' ? false : true,
      photo_url: body.photo_url ?? null,
      user_id: userId,
      company_id: validCompanyId  // CRITICAL: Always include
    };
    
    try {
      const { data, error } = await supabaseServer
        .from('tasks')
        .insert([payload])
        .select('*, crew_member:crew_members(id, name, hourly_rate)');
      
      if (error) {
        console.error('POST /api/tasks insert error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json(data[0]);
    } catch (err) {
      console.error('POST /api/tasks exception:', err);
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    console.error('POST /api/tasks outer error:', err);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, company_id: incomingCompanyId, ...fields } = body;

    // Get authenticated user with fallback - use same pattern as GET
    const userId = await resolveUserContext(req);
    const companyId = incomingCompanyId;

    if (!userId || !id) {
      return NextResponse.json({ error: 'User ID and task ID required' }, { status: 400 });
    }

    try {
      const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
      
      if (Object.prototype.hasOwnProperty.call(fields, 'crew_member_id')) {
        fields.crew_member_id = fields.crew_member_id ? Number(fields.crew_member_id) : null;
      }
      if (Object.prototype.hasOwnProperty.call(fields, 'billable') && typeof fields.billable !== 'boolean') {
        fields.billable = fields.billable !== 'false';
      }
      const { data, error } = await supabaseServer
        .from('tasks')
        .update(fields)
        .eq('id', id)
        .eq('user_id', userId)
        .eq('company_id', validCompanyId)
        .select('*, crew_member:crew_members(id, name, hourly_rate)');
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json(data[0], { status: 200 });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, company_id: incomingCompanyId } = await req.json();

    // Get authenticated user with fallback - use same pattern as GET
    const userId = await resolveUserContext(req);
    const companyId = incomingCompanyId;

    if (!userId || !id) {
      return NextResponse.json({ error: 'User ID and task ID required' }, { status: 400 });
    }

    try {
      const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
      
      const { error } = await supabaseServer
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .eq('company_id', validCompanyId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}
