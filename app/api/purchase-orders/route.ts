import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

const PO_SELECT = '*, supplier:suppliers(id, vendor_name, email, phone, payment_terms), project:projects(id, name), line_items:purchase_order_line_items(*)';

/**
 * GET /api/purchase-orders
 * Fetch all purchase orders for a company
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/purchase-orders: Missing company_id`);
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

    let query = supabaseServer
      .from('purchase_orders')
      .select(PO_SELECT)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    // Optional filters
    const supplierId = searchParams.get('supplier_id');
    if (supplierId) {
      query = query.eq('supplier_id', parseInt(supplierId, 10));
    }

    const projectId = searchParams.get('project_id');
    if (projectId) {
      query = query.eq('project_id', parseInt(projectId, 10));
    }

    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('GET /api/purchase-orders error:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/purchase-orders exception:', err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/purchase-orders
 * Create a new purchase order
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

    // Validate required fields
    if (!body.supplier_id) {
      return NextResponse.json(
        { error: 'supplier_id is required to create a purchase order' },
        { status: 400 }
      );
    }

    // Get company_id from body OR query parameters
    let companyId = body.company_id || searchParams.get('company_id');
    try {
      const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
      companyId = validCompanyId;
    } catch (e) {
      companyId = 1;
    }

    // Validate line items
    const lines = Array.isArray(body.lines) ? body.lines : [];
    if (lines.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required' },
        { status: 400 }
      );
    }

    // Validate and calculate line totals
    let poTotal = 0;
    const validatedLines = lines.map((line: { quantity_ordered?: number; unit_rate?: number; item_id?: number | null; item_name?: string; name?: string; unit?: string; note?: string; description?: string }) => {
      const quantity = Number(line.quantity_ordered) || 1;
      const rate = Number(line.unit_rate) || 0;
      const total = quantity * rate;
      poTotal += total;

      return {
        item_id: line.item_id || null,
        item_name: line.item_name || line.name || 'Unnamed Material',
        description: line.description || null,
        quantity_ordered: quantity,
        unit: line.unit || 'ea',
        unit_rate: rate,
        note: line.note || null,
      };
    });

    // Generate PO reference number
    const poReference = body.po_reference || `PO-${Date.now()}`;

    // Prepare PO payload
    const poPayload = {
      supplier_id: parseInt(body.supplier_id, 10),
      project_id: body.project_id ? parseInt(body.project_id, 10) : null,
      company_id: companyId,
      user_id: userId,
      total_amount: poTotal,
      total_received: 0,
      description: body.description || null,
      po_reference: poReference,
      po_date: body.po_date || new Date().toISOString().slice(0, 10),
      required_by_date: body.required_by_date || null,
      status: 'draft',
    };

    // Insert PO
    const { data: poData, error: poError } = await supabaseServer
      .from('purchase_orders')
      .insert([poPayload])
      .select('*')
      .single();

    if (poError) {
      console.error('POST /api/purchase-orders error:', poError);
      return NextResponse.json(
        { error: poError.message || 'Failed to create purchase order' },
        { status: 500 }
      );
    }

    if (!poData) {
      return NextResponse.json(
        { error: 'Purchase order not created' },
        { status: 500 }
      );
    }

    // Insert line items
    const lineItemPayloads = validatedLines.map((line: any) => ({
      po_id: poData.id,
      item_id: line.item_id,
      item_name: line.item_name,
      description: line.description,
      quantity_ordered: line.quantity_ordered,
      quantity_received: 0,
      unit: line.unit,
      unit_rate: line.unit_rate,
      note: line.note,
      company_id: companyId,
      user_id: userId,
    }));

    const { error: lineError } = await supabaseServer
      .from('purchase_order_line_items')
      .insert(lineItemPayloads);

    if (lineError) {
      console.error('POST /api/purchase-orders line insert error:', lineError);
      await supabaseServer.from('purchase_orders').delete().eq('id', poData.id);
      return NextResponse.json(
        { error: 'Purchase order line items could not be stored' },
        { status: 500 }
      );
    }

    // Fetch complete PO with relationships
    const { data: fullPO } = await supabaseServer
      .from('purchase_orders')
      .select(PO_SELECT)
      .eq('id', poData.id)
      .single();

    return NextResponse.json(fullPO || poData);
  } catch (err) {
    console.error('POST /api/purchase-orders exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/purchase-orders/:id
 * Update a purchase order (only draft POs can be modified)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const poId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!poId) {
      return NextResponse.json(
        { error: 'PO ID is required' },
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

    // Check PO exists and is in draft
    const { data: existingPO } = await supabaseServer
      .from('purchase_orders')
      .select('id, status')
      .eq('id', parseInt(poId, 10))
      .single();

    if (!existingPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }

    if (existingPO.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft POs can be modified' },
        { status: 400 }
      );
    }

    // Prepare update
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.required_by_date !== undefined) updatePayload.required_by_date = body.required_by_date;

    const { data: updatedPO, error } = await supabaseServer
      .from('purchase_orders')
      .update(updatePayload)
      .eq('id', parseInt(poId, 10))
      .select(PO_SELECT)
      .single();

    if (error) {
      console.error('PATCH /api/purchase-orders error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedPO);
  } catch (err) {
    console.error('PATCH /api/purchase-orders exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/purchase-orders/:id
 * Delete a PO (only draft POs)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const poId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!poId) {
      return NextResponse.json(
        { error: 'PO ID is required' },
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

    // Check PO exists and is draft
    const { data: existingPO } = await supabaseServer
      .from('purchase_orders')
      .select('id, status')
      .eq('id', parseInt(poId, 10))
      .single();

    if (!existingPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }

    if (existingPO.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft POs can be deleted' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from('purchase_orders')
      .delete()
      .eq('id', parseInt(poId, 10));

    if (error) {
      console.error('DELETE /api/purchase-orders error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: parseInt(poId, 10) });
  } catch (err) {
    console.error('DELETE /api/purchase-orders exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
