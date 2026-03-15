import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../lib/demoAuth';

const QUOTE_SELECT = '*, customer:customers(id, name, email), project:projects(id, name), line_items:quote_line_items(*)';

/**
 * GET /api/quotes/[id]
 * Fetch a single quote by ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
    const { searchParams } = new URL(req.url);
    const companyIdParam = searchParams.get('company_id');

    // CRITICAL: Require company_id for data isolation
    if (!companyIdParam || !companyIdParam.trim()) {
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

    const { data: quote, error } = await supabaseServer
      .from('quotes')
      .select(QUOTE_SELECT)
      .eq('id', parseInt(quoteId, 10))
      .eq('company_id', companyId)
      .single();

    if (error || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);
  } catch (err) {
    console.error('GET /api/quotes/[id] exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quotes/[id]
 * Update a quote
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Require company_id for data isolation
    if (!companyIdParam || !companyIdParam.trim()) {
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

    // Fetch current quote
    const { data: currentQuote, error: fetchError } = await supabaseServer
      .from('quotes')
      .select('*')
      .eq('id', parseInt(quoteId, 10))
      .eq('company_id', companyId)
      .single();

    if (fetchError || !currentQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Validate status transitions
    if (body.status &&body.status !== currentQuote.status) {
      const validTransitions: Record<string, string[]> = {
        draft: ['sent', 'deleted'],
        sent: ['accepted', 'rejected'],
        accepted: ['rejected'],
        rejected: ['draft'],
      };

      const allowed = validTransitions[currentQuote.status] || [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${currentQuote.status} to ${body.status}` },
          { status: 400 }
        );
      }
    }

    // Handle line items update
    let updatePayload: any = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    // Add timestamp for status changes
    if (body.status === 'sent') {
      updatePayload.sent_on = new Date().toISOString();
    } else if (body.status === 'accepted') {
      updatePayload.accepted_on = new Date().toISOString();
    } else if (body.status === 'rejected') {
      updatePayload.rejected_on = new Date().toISOString();
    }

    // Remove lines from updatePayload as we handle them separately
    const { lines, ...quoteUpdate } = updatePayload;

    // Update quote
    const { data: updatedQuote, error: updateError } = await supabaseServer
      .from('quotes')
      .update(quoteUpdate)
      .eq('id', parseInt(quoteId, 10))
      .eq('company_id', companyId)
      .select(QUOTE_SELECT)
      .single();

    if (updateError || !updatedQuote) {
      console.error('PATCH /api/quotes/[id] error:', updateError);
      return NextResponse.json(
        { error: updateError?.message || 'Failed to update quote' },
        { status: 500 }
      );
    }

    // Handle line items if provided
    if (Array.isArray(lines) && currentQuote.status === 'draft') {
      // Delete existing line items
      await supabaseServer
        .from('quote_line_items')
        .delete()
        .eq('quote_id', parseInt(quoteId, 10));

      // Insert new line items
      if (lines.length > 0) {
        const linePayloads = lines.map((line: any) => ({
          quote_id: parseInt(quoteId, 10),
          item_id: line.item_id || null,
          item_name: line.item_name,
          description: line.description || null,
          quantity: line.quantity,
          unit: line.unit || 'ea',
          rate: line.rate,
          note: line.note || null,
          company_id: companyId,
          user_id: userId,
        }));

        const { error: lineError } = await supabaseServer
          .from('quote_line_items')
          .insert(linePayloads);

        if (lineError) {
          console.error('PATCH /api/quotes/[id] line items error:', lineError);
          return NextResponse.json(
            { error: 'Failed to update line items' },
            { status: 500 }
          );
        }
      }

      // Fetch updated quote with new line items
      const { data: finalQuote } = await supabaseServer
        .from('quotes')
        .select(QUOTE_SELECT)
        .eq('id', parseInt(quoteId, 10))
        .single();

      return NextResponse.json(finalQuote);
    }

    return NextResponse.json(updatedQuote);
  } catch (err) {
    console.error('PATCH /api/quotes/[id] exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/quotes/[id]
 * Delete a quote (only draft quotes can be deleted)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // CRITICAL: Require company_id for data isolation
    if (!companyIdParam || !companyIdParam.trim()) {
      return NextResponse.json(
        { error: 'company_id parameter is required for data isolation' },
        { status: 400 }
      );
    }

    const companyId = parseInt(companyIdParam.trim(), 10);

    // Fetch quote to verify status and ownership
    const { data: quote, error: fetchError } = await supabaseServer
      .from('quotes')
      .select('*')
      .eq('id', parseInt(quoteId, 10))
      .eq('company_id', companyId)
      .single();

    if (fetchError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of draft quotes
    if (quote.status !== 'draft') {
      return NextResponse.json(
        { error: `Cannot delete ${quote.status} quote. Only draft quotes can be deleted.` },
        { status: 400 }
      );
    }

    // Delete quote (line items will be cascade-deleted)
    const { error: deleteError } = await supabaseServer
      .from('quotes')
      .delete()
      .eq('id', parseInt(quoteId, 10))
      .eq('company_id', companyId);

    if (deleteError) {
      console.error('DELETE /api/quotes/[id] error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/quotes/[id] exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
