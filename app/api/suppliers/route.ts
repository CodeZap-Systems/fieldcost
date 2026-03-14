import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

const SUPPLIER_SELECT = '*';

/**
 * GET /api/suppliers
 * Fetch all suppliers for a company
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/suppliers: Missing company_id`);
      return NextResponse.json(
        { error: 'company_id parameter is required for data isolation' },
        { status: 400 }
      );
    }

    const companyId = parseInt(companyIdParam.trim(), 10);
    if (!Number.isFinite(companyId)) {
      return NextResponse.json(
        { error: 'Invalid company_id format' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('suppliers')
      .select(SUPPLIER_SELECT)
      .eq('company_id', companyId)
      .order('vendor_name', { ascending: true });

    if (error) {
      console.error('GET /api/suppliers error:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/suppliers exception:', err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/suppliers
 * Create a new supplier/vendor
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    if (!body.vendor_name) {
      return NextResponse.json(
        { error: 'vendor_name is required' },
        { status: 400 }
      );
    }

    let companyId = body.company_id;
    try {
      const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
      companyId = validCompanyId;
    } catch (e) {
      companyId = 1;
    }

    const supplierPayload = {
      company_id: companyId,
      user_id: userId,
      vendor_name: body.vendor_name,
      contact_name: body.contact_name || null,
      email: body.email || null,
      phone: body.phone || null,
      address_line1: body.address_line1 || null,
      address_line2: body.address_line2 || null,
      city: body.city || null,
      province: body.province || null,
      postal_code: body.postal_code || null,
      country: body.country || null,
      payment_terms: body.payment_terms || 'net 30',
      tax_id: body.tax_id || null,
      rating: body.rating || 0,
      notes: body.notes || null,
    };

    const { data, error } = await supabaseServer
      .from('suppliers')
      .insert([supplierPayload])
      .select('*')
      .single();

    if (error) {
      console.error('POST /api/suppliers error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('POST /api/suppliers exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/suppliers/:id
 * Update a supplier
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    // Only update provided fields
    if (body.vendor_name !== undefined) updatePayload.vendor_name = body.vendor_name;
    if (body.contact_name !== undefined) updatePayload.contact_name = body.contact_name;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.phone !== undefined) updatePayload.phone = body.phone;
    if (body.address_line1 !== undefined) updatePayload.address_line1 = body.address_line1;
    if (body.address_line2 !== undefined) updatePayload.address_line2 = body.address_line2;
    if (body.city !== undefined) updatePayload.city = body.city;
    if (body.province !== undefined) updatePayload.province = body.province;
    if (body.postal_code !== undefined) updatePayload.postal_code = body.postal_code;
    if (body.country !== undefined) updatePayload.country = body.country;
    if (body.payment_terms !== undefined) updatePayload.payment_terms = body.payment_terms;
    if (body.tax_id !== undefined) updatePayload.tax_id = body.tax_id;
    if (body.rating !== undefined) updatePayload.rating = body.rating;
    if (body.notes !== undefined) updatePayload.notes = body.notes;

    const { data, error } = await supabaseServer
      .from('suppliers')
      .update(updatePayload)
      .eq('id', parseInt(supplierId, 10))
      .select('*')
      .single();

    if (error) {
      console.error('PATCH /api/suppliers error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/suppliers exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/suppliers/:id
 * Delete a supplier (only if no active POs)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!supplierId) {
      return NextResponse.json(
        { error: 'Supplier ID is required' },
        { status: 400 }
      );
    }

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // Check if supplier has any active POs
    const { data: activePOs } = await supabaseServer
      .from('purchase_orders')
      .select('id')
      .eq('supplier_id', parseInt(supplierId, 10))
      .neq('status', 'invoiced')
      .limit(1);

    if (activePOs && activePOs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete supplier with active purchase orders' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('suppliers')
      .delete()
      .eq('id', parseInt(supplierId, 10));

    if (error) {
      console.error('DELETE /api/suppliers error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: parseInt(supplierId, 10) });
  } catch (err) {
    console.error('DELETE /api/suppliers exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
