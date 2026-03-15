import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

// Verify user has access to a specific company
async function verifyCompanyAccess(req: Request, companyId: string | number) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { userId: null, error: 'Missing authorization header' };
  }

  try {
    const token = authHeader.slice(7);
    const { data } = await supabaseServer.auth.getUser(token);
    if (!data?.user?.id) {
      return { userId: null, error: 'Invalid token' };
    }

    const userId = data.user.id;

    // Check if user owns this company (from company_profiles)
    const { data: company, error: companyError } = await supabaseServer
      .from('company_profiles')
      .select('id, user_id, is_demo')
      .eq('id', companyId)
      .eq('user_id', userId)
      .maybeSingle();

    if (companyError || !company) {
      return { userId, error: 'User does not have access to this company' };
    }

    return { userId, company, error: null };
  } catch (err) {
    return { userId: null, error: `Auth error: ${err}` };
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyIdParam = searchParams.get('company_id');

    // CRITICAL: Enforce company_id requirement for data isolation
    if (!companyIdParam || !companyIdParam.trim()) {
      return NextResponse.json(
        { error: 'company_id parameter is required' },
        { status: 400 }
      );
    }

    let companyId: string | number = companyIdParam.trim();
    const asInt = parseInt(companyId, 10);
    if (Number.isFinite(asInt)) {
      companyId = asInt;
    }

    // Verify user has access to this company
    const { userId, company, error: accessError } = await verifyCompanyAccess(req, companyId);
    if (accessError || !company) {
      console.warn(`[SECURITY] GET /api/customers: ${accessError} for company ${companyId}`);
      return NextResponse.json([], { status: 200 }); // Return empty array, don't leak that company exists
    }

    // Fetch customers for this company only
    const { data, error } = await supabaseServer
      .from('customers')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET /api/customers error:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (e) {
    console.error('GET /api/customers error:', e);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company_id: companyId } = body;

    if (!companyId || !name) {
      return NextResponse.json(
        { error: 'name and company_id are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this company
    const { userId, company, error: accessError } = await verifyCompanyAccess(req, companyId);
    if (accessError || !company) {
      console.warn(`[SECURITY] POST /api/customers: ${accessError}`);
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Check for duplicate customer (same name, same company)
    const { data: existingCustomer } = await supabaseServer
      .from('customers')
      .select('id')
      .eq('company_id', companyId)
      .ilike('name', name)
      .maybeSingle();

    if (existingCustomer) {
      console.warn(`[POST /api/customers] Duplicate customer: "${name}" in company ${companyId}`);
      return NextResponse.json(
        { error: `A customer named "${name}" already exists. Please use a different name.` },
        { status: 409 }
      );
    }

    // Check for duplicate email if provided
    if (email) {
      const { data: existingEmail } = await supabaseServer
        .from('customers')
        .select('id')
        .eq('company_id', companyId)
        .ilike('email', email)
        .maybeSingle();

      if (existingEmail) {
        console.warn(`[POST /api/customers] Duplicate email: "${email}" in company ${companyId}`);
        return NextResponse.json(
          { error: `A customer with email "${email}" already exists.` },
          { status: 409 }
        );
      }
    }

    // Insert customer
    const { data, error } = await supabaseServer
      .from('customers')
      .insert([{
        name,
        email: email || null,
        company_id: companyId,
        user_id: userId
      }])
      .select();

    if (error) {
      console.error('POST /api/customers insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || { success: true });
  } catch (e) {
    console.error('POST /api/customers error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, company_id: companyId, ...fields } = body;

    if (!id || !companyId) {
      return NextResponse.json(
        { error: 'id and company_id are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this company
    const { userId, error: accessError } = await verifyCompanyAccess(req, companyId);
    if (accessError) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update customer
    const { data, error } = await supabaseServer
      .from('customers')
      .update(fields)
      .eq('id', id)
      .eq('company_id', companyId)
      .select();

    if (error) {
      console.error('PATCH /api/customers error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || {});
  } catch (e) {
    console.error('PATCH /api/customers error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id, company_id: companyId } = body;

    if (!id || !companyId) {
      return NextResponse.json(
        { error: 'id and company_id are required' },
        { status: 400 }
      );
    }

    // Verify user has access to this company
    const { error: accessError } = await verifyCompanyAccess(req, companyId);
    if (accessError) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete customer
    const { error } = await supabaseServer
      .from('customers')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) {
      console.error('DELETE /api/customers error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('DELETE /api/customers error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
