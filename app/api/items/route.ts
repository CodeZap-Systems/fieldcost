import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { DEMO_COMPANY_ID } from '../../../lib/demoConstants';
import { isDemoUserId } from '../../../lib/userIdentity';
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
  try {
    const { searchParams } = new URL(req.url);
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    const companyIdParam = searchParams.get('company_id');
    
    // CRITICAL: Enforce company_id requirement for data isolation (GDPR/POPIA)
    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/items: Missing company_id for user ${userId}`);
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
    
    console.log(`[GET /api/items] userId: ${userId}, companyId: ${companyId}, type: ${typeof companyId}`);
    
    // Check if this is a demo company - try to fetch company record
    let isDemoCompany = false;
    try {
      const { data: company, error: companyError } = await supabaseServer
        .from('company_profiles')
        .select('is_demo')
        .eq('id', companyId)
        .maybeSingle();  // Use maybeSingle to handle null gracefully

      if (companyError) {
        console.error(`[GET /api/items] Company lookup error for ID ${companyId}:`, companyError.message);
      } else if (company) {
        // Check both the is_demo flag AND the DEMO_COMPANY_ID constant
        isDemoCompany = company.is_demo === true || companyId === DEMO_COMPANY_ID;
        console.log(`[GET /api/items] Company found: is_demo=${isDemoCompany}`);
      } else {
        console.warn(`[GET /api/items] Company not found for ID ${companyId}`);
      }
    } catch (lookupErr) {
      console.error(`[GET /api/items] Exception during company lookup:`, lookupErr);
    }

    // For DEMO companies, ONLY filter by company_id
    if (isDemoCompany) {
      console.log(`[GET /api/items] Fetching demo company items for company_id=${companyId}`);
      const { data, error } = await supabaseServer
        .from('items')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) {
        console.error(`[GET /api/items] Demo company query error:`, error.message);
        return NextResponse.json([]);
      }
      
      console.log(`[GET /api/items] Demo company returned ${data?.length || 0} items`);
      return NextResponse.json(Array.isArray(data) ? data : []);
    } else {
      // Live company: require both user_id AND company_id match for security
      console.log(`[GET /api/items] Fetching live company items for user_id=${userId}, company_id=${companyId}`);
      
      if (!userId || userId === 'demo-user') {
        console.warn(`[GET /api/items] Cannot fetch live company items without valid userId`);
        return NextResponse.json([]);
      }

      const { data, error } = await supabaseServer
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .eq('company_id', companyId);
      
      if (error) {
        console.error(`[GET /api/items] Live company query error:`, error.message);
        return NextResponse.json([]);
      }
      
      console.log(`[GET /api/items] Live company returned ${data?.length || 0} items`);
      return NextResponse.json(Array.isArray(data) ? data : []);
    }
  } catch (e) {
    console.error('GET /api/items exception:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const companyId = body.company_id;
    
    // Get authenticated user with fallback
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
      console.error('POST /api/items ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Validate user owns this company
    let validCompanyId: number;
    try {
      const context = await getCompanyContext(userId, companyId);
      validCompanyId = context.companyId;
      console.log(`[POST /api/items] Validated company ${validCompanyId} for user ${userId}`);
    } catch (contextError) {
      console.error(`[POST /api/items] Company validation failed:`, contextError);
      return NextResponse.json({ error: 'Company validation failed - access denied' }, { status: 403 });
    }
    
    try {
      const payload = {
        name: body.name,
        price: body.price ?? null,
        cost: body.cost ?? null,
        stock_in: body.stock_in ?? 0,
        stock_used: body.stock_used ?? 0,
        item_type: body.item_type ?? 'physical',
        user_id: userId,
        company_id: validCompanyId  // CRITICAL: Always include
      };
      
      const { data, error } = await supabaseServer
        .from('items')
        .insert([payload])
        .select();
      
      if (error) {
        console.error('POST /api/items insert error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json(data[0], { status: 201 });
    } catch (err) {
      console.error('POST /api/items exception:', err);
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    console.error('POST /api/items outer error:', err);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, company_id: incomingCompanyId, ...fields } = body;
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and item ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('items')
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
  } catch (err) {
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id, company_id: incomingCompanyId } = await req.json();
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and item ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
  } catch (err) {
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}
