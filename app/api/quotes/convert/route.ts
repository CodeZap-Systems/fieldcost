/**
 * Quote to Invoice Conversion API
 * Convert a quote to an invoice to finalize the deal
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '@/lib/ensureAuthUser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));

    // Validate authentication
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: 'Unable to prepare user context' },
        { status: 500 }
      );
    }

    const { quoteId, companyId } = body;

    if (!quoteId) {
      return NextResponse.json(
        { error: 'quoteId is required' },
        { status: 400 }
      );
    }

    // Get the quote
    const { data: quote, error: quoteError } = await supabaseServer
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .eq('company_id', companyId || 1)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (quote.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Only accepted quotes can be converted to invoices' },
        { status: 400 }
      );
    }

    // Get quote line items
    const { data: lineItems, error: itemsError } = await supabaseServer
      .from('quote_line_items')
      .select('*')
      .eq('quote_id', quoteId);

    if (itemsError) {
      throw itemsError;
    }

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabaseServer
      .from('invoices')
      .insert({
        customer_id: quote.customer_id,
        project_id: quote.project_id,
        company_id: quote.company_id,
        user_id: userId,
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        amount: quote.amount,
        description: quote.description || `Invoice from Quote #${quote.reference}`,
        reference: `INV-${Date.now()}`,
        status: 'draft',
        terms: 'Net 30',
      })
      .select('*')
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    // Create invoice line items from quote line items
    const invoiceLineItems = lineItems.map((line: any) => ({
      invoice_id: invoice.id,
      item_id: line.item_id,
      item_name: line.item_name,
      description: line.description,
      quantity: line.quantity,
      unit: line.unit,
      rate: line.rate,
      company_id: quote.company_id,
      user_id: userId,
    }));

    if (invoiceLineItems.length > 0) {
      const { error: lineError } = await supabaseServer
        .from('invoice_line_items')
        .insert(invoiceLineItems);

      if (lineError) {
        throw lineError;
      }
    }

    // Update quote status to invoiced
    const { error: updateError } = await supabaseServer
      .from('quotes')
      .update({ status: 'invoiced' })
      .eq('id', quoteId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: 'Quote converted to invoice successfully',
      invoice,
      invoiceId: invoice.id,
    });
  } catch (error) {
    console.error('Quote conversion error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to convert quote to invoice',
      },
      { status: 500 }
    );
  }
}
