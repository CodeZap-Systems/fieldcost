import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../lib/demoAuth';

/**
 * POST /api/purchase-orders/[id]/send
 * Send PO to supplier (draft -> sent_to_supplier)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: poId } = await params;
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

    // Update PO status to sent_to_supplier
    const { data: updatedPO, error } = await supabaseServer
      .from('purchase_orders')
      .update({
        status: 'sent_to_supplier',
        sent_to_supplier_on: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(poId, 10))
      .select('*, supplier:suppliers(id, vendor_name, email), line_items:purchase_order_line_items(*)')
      .single();

    if (error) {
      console.error('POST /api/purchase-orders/[id]/send error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // In real implementation, send email to supplier here
    // await sendPOEmail(updatedPO.supplier.email, updatedPO);

    return NextResponse.json({
      ...updatedPO,
      message: 'PO sent to supplier successfully',
    });
  } catch (err) {
    console.error('POST /api/purchase-orders/[id]/send exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
