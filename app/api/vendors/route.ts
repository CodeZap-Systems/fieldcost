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
      console.warn(`[SECURITY] GET /api/vendors: Missing company_id for user ${userId}`);
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
      console.error(`[GET /api/vendors] Company lookup error:`, err);
    }

    // For DEMO companies, only filter by company_id (skip user_id filter)
    if (isDemoCompany) {
      let query = supabaseServer
        .from('vendors')
        .select('*')
        .eq('company_id', companyId);
      
      const { data, error } = await query;
      return NextResponse.json(!error && Array.isArray(data) ? data : []);
    } else {
      // Live company: require user_id match for security
      if (userId && userId !== 'demo-user') {
        let query = supabaseServer
          .from('vendors')
          .select('*')
          .eq('user_id', userId)
          .eq('company_id', companyId);
        
        const { data, error } = await query;
        
        if (!error && Array.isArray(data)) {
          return NextResponse.json(data);
        }
      }
      return NextResponse.json([]);
    }
  } catch (e) {
    console.error('GET /api/vendors error:', e);
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
      console.error('POST /api/vendors ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Validate user owns this company and get correct ID
    let validCompanyId: string;
    try {
      const context = await getCompanyContext(userId, companyId);
      validCompanyId = context.companyId;
      console.log(`[POST /api/vendors] Validated company ${validCompanyId} for user ${userId}`);
    } catch (contextError) {
      console.error(`[POST /api/vendors] Company validation failed:`, contextError);
      return NextResponse.json({ error: 'Company validation failed - access denied' }, { status: 403 });
    }
    
    try {
      // CRITICAL: Check for duplicate vendor (same name, same company)
      const { data: existingVendor, error: checkError } = await supabaseServer
        .from('vendors')
        .select('id, name')
        .eq('company_id', validCompanyId)
        .ilike('name', body.name)
        .maybeSingle();
      
      if (existingVendor) {
        console.warn(`[POST /api/vendors] Duplicate vendor detected: "${body.name}" already exists in company ${validCompanyId}`);
        return NextResponse.json(
          { error: `A vendor named "${body.name}" already exists. Please use a different name or update the existing vendor.` },
          { status: 409 }
        );
      }
      
      // Check for duplicate email if provided
      if (body.email) {
        const { data: existingEmail } = await supabaseServer
          .from('vendors')
          .select('id, email')
          .eq('company_id', validCompanyId)
          .ilike('email', body.email)
          .maybeSingle();
        
        if (existingEmail) {
          console.warn(`[POST /api/vendors] Duplicate email detected: "${body.email}" already exists in company ${validCompanyId}`);
          return NextResponse.json(
            { error: `A vendor with email "${body.email}" already exists. Please use a different email or update the existing vendor.` },
            { status: 409 }
          );
        }
      }
      
      // Always include company_id in insert
      const payload = { 
        name: body.name,
        email: body.email ?? null,
        phone: body.phone ?? null,
        company_name: body.company_name ?? null,
        contact_person: body.contact_person ?? null,
        user_id: userId,
        company_id: validCompanyId  // CRITICAL: Always include
      };
      
      const { data, error } = await supabaseServer
        .from('vendors')
        .insert([payload])
        .select();
      
      if (error) {
        console.error('POST /api/vendors insert error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      
      return NextResponse.json(data[0]);
    } catch (err) {
      console.error('POST /api/vendors exception:', err);
      return NextResponse.json({ error: String(err) }, { status: 400 });
    }
  } catch (err) {
    console.error('POST /api/vendors outer error:', err);
    return NextResponse.json({ error: 'Request processing failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;
    const userId = await resolveUserContext(req);

    if (!userId || !id) {
      return NextResponse.json({ error: 'User ID and vendor ID required' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('vendors')
      .update(fields)
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('PATCH /api/vendors error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0] || { id });
  } catch (err) {
    console.error('PATCH /api/vendors exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = await resolveUserContext(req);

    if (!userId || !id) {
      return NextResponse.json({ error: 'User ID and vendor ID required' }, { status: 400 });
    }

    const { error } = await supabaseServer
      .from('vendors')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('DELETE /api/vendors error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/vendors exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
