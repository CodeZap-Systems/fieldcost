import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';
import { DEMO_COMPANY_ID } from '../../../lib/demoConstants';
import { isDemoUserId } from '../../../lib/userIdentity';

const PROJECT_LIMIT = 6;

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
  try {
    const { searchParams } = new URL(req.url);
    const companyIdParam = searchParams.get('company_id');
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    
    // CRITICAL: Enforce company_id requirement for data isolation (GDPR/POPIA)
    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/projects: Missing company_id for user ${userId}`);
      return NextResponse.json(
        { error: 'company_id parameter is required for data isolation' },
        { status: 400 }
      );
    }

    // Convert company_id: try as integer first, fallback to string
    let companyId: string | number = companyIdParam.trim();
    const asInt = parseInt(companyId, 10);
    if (Number.isFinite(asInt)) {
      companyId = asInt;
    }
    
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
      console.error(`[GET /api/projects] Company lookup error:`, err);
    }

    // For DEMO companies, only filter by company_id (skip user_id filter)
    if (isDemoCompany) {
      let query = supabaseServer
        .from('projects')
        .select('*')
        .eq('company_id', companyId);
      
      const { data, error } = await query.limit(PROJECT_LIMIT);
      return NextResponse.json(!error && data ? data : []);
    } else {
      // Live company: require user_id match for security
      if (userId && userId !== 'demo-user') {
        // For authenticated real users: strict user+company validation
        let query = supabaseServer
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId);
        
        const { data, error } = await query.limit(PROJECT_LIMIT);
        
        if (!error && data) {
          return NextResponse.json(data.map(p => ({
            ...p,
            company_id: p.company_id
          })));
        }
      }
      return NextResponse.json([]);
    }
  } catch (e) {
    console.error('GET /api/projects error:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const companyId = body.company_id;
    
    // CRITICAL: Get authenticated user from session, not from body
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required for data isolation' }, { status: 400 });
    }

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error('POST /api/projects ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Validate user owns this company and get correct ID
    let validCompanyId: number;
    try {
      const context = await getCompanyContext(userId, companyId);
      validCompanyId = context.companyId;
      console.log(`[POST /api/projects] Validated company ${validCompanyId} for user ${userId}`);
    } catch (contextError) {
      console.error(`[POST /api/projects] Company validation failed:`, contextError);
      return NextResponse.json({ error: 'Company validation failed - access denied' }, { status: 403 });
    }
    
    try {
      // Check project limit
      const { count, error: countError } = await supabaseServer
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('company_id', validCompanyId);
      
      if (!countError && count !== null && count >= PROJECT_LIMIT) {
        return NextResponse.json({ error: `Project limit reached (${PROJECT_LIMIT})` }, { status: 400 });
      }
      
      // Always include company_id in insert
      const payload = {
        name: body.name,
        description: body.description ?? null,
        photo_url: body.photo_url ?? null,
        user_id: userId,
        company_id: validCompanyId  // CRITICAL: Always include
      };
      
      const { data, error } = await supabaseServer
        .from('projects')
        .insert([payload])
        .select();
      
      if (error) {
        console.error('POST /api/projects insert error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
      console.error('POST /api/projects exception:', err);
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    console.error('POST /api/projects outer error:', err);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, user_id: incomingUserId, company_id: incomingCompanyId, ...fields } = body;
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and project ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('projects')
      .update(fields)
      .eq('id', id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id, user_id: incomingUserId, company_id: incomingCompanyId } = await req.json();
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and project ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
