import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

const GRN_SELECT = '*, po:purchase_orders(id, po_reference), po_line_item:purchase_order_line_items(id, item_name, quantity_ordered)';

/**
 * GET /api/goods-received-notes
 * Fetch all GRNs for a company (with optional PO filtering)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/goods-received-notes: Missing company_id`);
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
      .from('goods_received_notes')
      .select(GRN_SELECT)
      .eq('company_id', companyId)
      .order('grn_date', { ascending: false });

    // Optional filters
    const poId = searchParams.get('po_id');
    if (poId) {
      query = query.eq('po_id', parseInt(poId, 10));
    }

    const poLineItemId = searchParams.get('po_line_item_id');
    if (poLineItemId) {
      query = query.eq('po_line_item_id', parseInt(poLineItemId, 10));
    }

    const qualityStatus = searchParams.get('quality_status');
    if (qualityStatus) {
      query = query.eq('quality_status', qualityStatus);
    }

    const { data, error } = await query;

    if (error) {
      console.error('GET /api/goods-received-notes error:', error);
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/goods-received-notes exception:', err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/goods-received-notes
 * Create a new Goods Received Note (GRN) for received materials
 * This is the CORE feature for tracking actual deliveries against PO
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
    if (!body.po_id || !body.po_line_item_id) {
      return NextResponse.json(
        { error: 'po_id and po_line_item_id are required' },
        { status: 400 }
      );
    }

    if (!body.quantity_received) {
      return NextResponse.json(
        { error: 'quantity_received is required' },
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

    // Validate PO exists and is confirmed or partially received
    const { data: po } = await supabaseServer
      .from('purchase_orders')
      .select('id, status, po_reference')
      .eq('id', parseInt(body.po_id, 10))
      .single();

    if (!po) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }

    if (!['confirmed', 'partially_received'].includes(po.status)) {
      return NextResponse.json(
        { error: 'PO must be confirmed before receiving goods' },
        { status: 400 }
      );
    }

    // Validate PO line item exists
    const { data: lineItem } = await supabaseServer
      .from('purchase_order_line_items')
      .select('id, item_name, quantity_ordered, quantity_received')
      .eq('id', parseInt(body.po_line_item_id, 10))
      .single();

    if (!lineItem) {
      return NextResponse.json(
        { error: 'PO line item not found' },
        { status: 404 }
      );
    }

    // Check if receiving more than ordered
    const totalWillReceive = (lineItem.quantity_received || 0) + Number(body.quantity_received);
    if (totalWillReceive > lineItem.quantity_ordered) {
      return NextResponse.json(
        { error: `Cannot receive more than ordered (${lineItem.quantity_ordered}). Already received: ${lineItem.quantity_received}` },
        { status: 400 }
      );
    }

    // Generate GRN number
    const grnNumber = body.grn_number || `GRN-${Date.now()}`;

    // Create GRN
    const grnPayload = {
      po_id: parseInt(body.po_id, 10),
      po_line_item_id: parseInt(body.po_line_item_id, 10),
      company_id: companyId,
      user_id: userId,
      grn_number: grnNumber,
      grn_date: body.grn_date || new Date().toISOString().slice(0, 10),
      quantity_received: Number(body.quantity_received),
      unit: body.unit || null,
      quality_status: body.quality_status || 'inspected_good',
      quality_notes: body.quality_notes || null,
      damage_notes: body.damage_notes || null,
      received_by: body.received_by || null,
      received_at_location: body.received_at_location || null,
      rejection_reason: body.rejection_reason || null,
      follow_up_required: body.follow_up_required || false,
      follow_up_notes: body.follow_up_notes || null,
    };

    const { data: grn, error: grnError } = await supabaseServer
      .from('goods_received_notes')
      .insert([grnPayload])
      .select('*')
      .single();

    if (grnError) {
      console.error('POST /api/goods-received-notes error:', grnError);
      return NextResponse.json(
        { error: grnError.message },
        { status: 500 }
      );
    }

    // Update PO line item to track quantity received
    const newQuantityReceived = (lineItem.quantity_received || 0) + Number(body.quantity_received);
    await supabaseServer
      .from('purchase_order_line_items')
      .update({
        quantity_received: newQuantityReceived,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(body.po_line_item_id, 10));

    // If all items on this PO have been fully received, update PO status
    const { data: allLineItems } = await supabaseServer
      .from('purchase_order_line_items')
      .select('quantity_ordered, quantity_received')
      .eq('po_id', parseInt(body.po_id, 10));

    if (allLineItems) {
      const allFullyReceived = allLineItems.every(
        (item: any) => (item.quantity_received || 0) >= item.quantity_ordered
      );

      if (allFullyReceived) {
        await supabaseServer
          .from('purchase_orders')
          .update({
            status: 'fully_received',
            fully_received_on: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(body.po_id, 10));
      } else {
        // At least some items received
        await supabaseServer
          .from('purchase_orders')
          .update({
            status: 'partially_received',
            first_delivery_on: po.status === 'confirmed' ? new Date().toISOString() : undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', parseInt(body.po_id, 10));
      }
    }

    return NextResponse.json({
      ...grn,
      message: 'Goods received and logged successfully',
    });
  } catch (err) {
    console.error('POST /api/goods-received-notes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/goods-received-notes/:id
 * Update GRN (quality checks, follow-up notes, etc.)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const grnId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!grnId) {
      return NextResponse.json(
        { error: 'GRN ID is required' },
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

    // Allow updates to quality-related fields
    if (body.quality_status !== undefined) updatePayload.quality_status = body.quality_status;
    if (body.quality_notes !== undefined) updatePayload.quality_notes = body.quality_notes;
    if (body.damage_notes !== undefined) updatePayload.damage_notes = body.damage_notes;
    if (body.rejection_reason !== undefined) updatePayload.rejection_reason = body.rejection_reason;
    if (body.follow_up_required !== undefined) updatePayload.follow_up_required = body.follow_up_required;
    if (body.follow_up_notes !== undefined) updatePayload.follow_up_notes = body.follow_up_notes;

    const { data, error } = await supabaseServer
      .from('goods_received_notes')
      .update(updatePayload)
      .eq('id', parseInt(grnId, 10))
      .select(GRN_SELECT)
      .single();

    if (error) {
      console.error('PATCH /api/goods-received-notes error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/goods-received-notes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/goods-received-notes/:id
 * Delete a GRN (reverses receipt)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const grnId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!grnId) {
      return NextResponse.json(
        { error: 'GRN ID is required' },
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

    // Fetch GRN to get details before delete
    const { data: grn } = await supabaseServer
      .from('goods_received_notes')
      .select('id, po_id, po_line_item_id, quantity_received')
      .eq('id', parseInt(grnId, 10))
      .single();

    if (!grn) {
      return NextResponse.json(
        { error: 'GRN not found' },
        { status: 404 }
      );
    }

    // Reverse the quantity received in PO line item
    const { data: lineItem } = await supabaseServer
      .from('purchase_order_line_items')
      .select('quantity_received')
      .eq('id', grn.po_line_item_id)
      .single();

    if (lineItem) {
      const newQuantityReceived = Math.max(0, (lineItem.quantity_received || 0) - grn.quantity_received);
      await supabaseServer
        .from('purchase_order_line_items')
        .update({
          quantity_received: newQuantityReceived,
          updated_at: new Date().toISOString(),
        })
        .eq('id', grn.po_line_item_id);

      // Update PO status if needed
      if (newQuantityReceived === 0) {
        await supabaseServer
          .from('purchase_orders')
          .update({
            status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', grn.po_id);
      }
    }

    // Delete GRN
    const { error } = await supabaseServer
      .from('goods_received_notes')
      .delete()
      .eq('id', parseInt(grnId, 10));

    if (error) {
      console.error('DELETE /api/goods-received-notes error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: parseInt(grnId, 10) });
  } catch (err) {
    console.error('DELETE /api/goods-received-notes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
