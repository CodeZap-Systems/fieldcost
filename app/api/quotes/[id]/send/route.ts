import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../../lib/demoAuth';

/**
 * POST /api/quotes/[id]/send
 * Send a draft quote to customer
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;
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

    // Fetch the quote
    const { data: quote, error: quoteError } = await supabaseServer
      .from('quotes')
      .select('*, line_items:quote_line_items(*), customer:customers(id, name, email)')
      .eq('id', parseInt(quoteId, 10))
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Validate quote is in draft status
    if (quote.status !== 'draft') {
      return NextResponse.json(
        { error: `Quote must be in draft status to send. Current status: ${quote.status}` },
        { status: 400 }
      );
    }

    // Update quote to sent status
    const { data: updatedQuote, error: updateError } = await supabaseServer
      .from('quotes')
      .update({
        status: 'sent',
        sent_on: new Date().toISOString(),
      })
      .eq('id', parseInt(quoteId, 10))
      .select('*, line_items:quote_line_items(*), customer:customers(id, name, email)')
      .single();

    if (updateError || !updatedQuote) {
      console.error('POST /api/quotes/[id]/send update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to send quote' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedQuote);
  } catch (err) {
    console.error('POST /api/quotes/[id]/send exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
