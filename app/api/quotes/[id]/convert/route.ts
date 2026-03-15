import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../../lib/demoAuth';

/**
 * POST /api/quotes/[id]/convert
 * Convert an accepted quote to an invoice
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
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

    // Fetch the quote with all details
    const { data: quote, error: quoteError } = await supabaseServer
      .from('quotes')
      .select('*, line_items:quote_line_items(*)')
      .eq('id', parseInt(quoteId, 10))
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Validate quote is accepted
    if (quote.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Only accepted quotes can be converted to invoices' },
        { status: 400 }
      );
    }

    // Create invoice from quote
    const invoicePayload = {
      customer_id: quote.customer_id,
      amount: quote.amount,
      description: body.description || quote.description || `Invoice from Quote ${quote.reference}`,
      reference: body.reference || quote.reference,
      status: 'draft',
      issued_on: new Date().toISOString().slice(0, 10),
      due_on: body.due_on || null,
      currency: body.currency || 'ZAR',
      user_id: userId,
      company_id: quote.company_id,
    };

    const { data: invoice, error: invoiceError } = await supabaseServer
      .from('invoices')
      .insert([invoicePayload])
      .select('*')
      .single();

    if (invoiceError || !invoice) {
      console.error('POST /api/quotes/[id]/convert invoice creation error:', invoiceError);
      return NextResponse.json(
        { error: 'Failed to create invoice from quote' },
        { status: 500 }
      );
    }

    // Create invoice line items from quote line items
    const invoiceLineItems = quote.line_items.map((line: { item_id?: number; item_name: string; quantity: number; rate: number; note?: string }) => ({
      invoice_id: invoice.id,
      item_id: line.item_id,
      name: line.item_name,
      quantity: line.quantity,
      rate: line.rate,
      total: line.quantity * line.rate,
      project: quote.project?.name || null,
      note: line.note,
      source: `quote_${quote.id}`,
      user_id: userId,
      company_id: quote.company_id,
    }));

    const { error: lineError } = await supabaseServer
      .from('invoice_line_items')
      .insert(invoiceLineItems);

    if (lineError) {
      console.error('POST /api/quotes/[id]/convert line creation error:', lineError);
      // Delete the invoice if line creation fails
      await supabaseServer.from('invoices').delete().eq('id', invoice.id);
      return NextResponse.json(
        { error: 'Failed to create invoice line items' },
        { status: 500 }
      );
    }

    // Update quote status to accepted (if not already)
    const { data: updatedQuote } = await supabaseServer
      .from('quotes')
      .update({
        status: 'accepted',
        accepted_on: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(quoteId, 10))
      .select('*')
      .single();

    return NextResponse.json({
      quote: updatedQuote,
      invoice,
      message: 'Quote converted to invoice successfully',
    });
  } catch (err) {
    console.error('POST /api/quotes/[id]/convert exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
