import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../lib/demoAuth';

/**
 * POST /api/purchase-orders/[id]/confirm
 * Confirm PO with supplier (sent_to_supplier -> confirmed)
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

    // Fetch current PO to validate
    const { data: currentPO, error: fetchError } = await supabaseServer
      .from('purchase_orders')
      .select('id, status')
      .eq('id', parseInt(poId, 10))
      .single();

    if (fetchError || !currentPO) {
      return NextResponse.json(
        { error: 'Purchase order not found' },
        { status: 404 }
      );
    }

    if (currentPO.status !== 'sent_to_supplier') {
      return NextResponse.json(
        { error: 'PO must be in "sent_to_supplier" status to confirm' },
        { status: 400 }
      );
    }

    // Update PO status to confirmed
    const { data: updatedPO, error } = await supabaseServer
      .from('purchase_orders')
      .update({
        status: 'confirmed',
        confirmed_on: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(poId, 10))
      .select('*, supplier:suppliers(id, vendor_name), project:projects(id, name), line_items:purchase_order_line_items(*)')
      .single();

    if (error) {
      console.error('POST /api/purchase-orders/[id]/confirm error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...updatedPO,
      message: 'PO confirmed successfully. Awaiting delivery.',
    });
  } catch (err) {
    console.error('POST /api/purchase-orders/[id]/confirm exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
