import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';
import { isSchemaCacheError } from '../../../lib/supabaseErrors';

const QUOTE_SELECT = '*, customer:customers(id, name, email), project:projects(id, name)';

/**
 * GET /api/quotes
 * Fetch all quotes for a company with filtering options
 * Required: company_id
 * Optional: customer_id, project_id, status
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyIdParam = searchParams.get('company_id');

    // CRITICAL: Require company_id for data isolation
    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/quotes: Missing company_id for user ${userId}`);
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

    // Build query with company_id filter
    let query = supabaseServer
      .from('quotes')
      .select(QUOTE_SELECT)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    // Optional filters
    const customerId = searchParams.get('customer_id');
    if (customerId) {
      query = query.eq('customer_id', parseInt(customerId, 10));
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
      console.error('GET /api/quotes error:', error);
      return NextResponse.json([], { status: 200 }); // Return empty array for graceful degradation
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error('GET /api/quotes exception:', err);
    return NextResponse.json([], { status: 200 });
  }
}

/**
 * POST /api/quotes
 * Create a new quotation with line items
 * Required: customer_id, company_id
 * Optional: project_id, reference, description, valid_until, lines
 */
export async function POST(req: Request) {
  try {
    // Parse JSON with proper error handling
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.warn('POST /api/quotes: Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));

    // Validate authentication
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }

    // Validate required fields - return 400 for client errors
    if (!body.customer_id) {
      return NextResponse.json(
        { error: 'customer_id is required to create a quote' },
        { status: 400 }
      );
    }

    // Get company_id from body OR query parameters
    let companyId = body.company_id || searchParams.get('company_id');
    try {
      const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
      companyId = validCompanyId;
    } catch (e) {
      console.warn('Company context error, using default:', e);
      companyId = 1;
    }

    // Validate line items - return 400 for missing lines (client error)
    const lines = Array.isArray(body.lines) ? body.lines : Array.isArray(body.line_items) ? body.line_items : [];
    if (!lines || lines.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required to create a quote' },
        { status: 400 }
      );
    }

    // Validate and calculate line totals
    let quoteTotal = 0;
    const validatedLines = lines.map((line: any) => {
      const quantity = Number(line.quantity) || 1;
      const rate = Number(line.rate) || 0;
      const total = quantity * rate;
      quoteTotal += total;

      return {
        item_id: line.item_id || null,
        item_name: line.item_name || line.name || 'Unnamed Item',
        description: line.description || null,
        quantity,
        unit: line.unit || 'ea',
        rate,
        note: line.note || null,
      };
    });

    // Generate reference number if not provided
    const reference = body.reference || `QT-${Date.now()}`;

    // Prepare quote payload
    const quotePayload = {
      customer_id: parseInt(body.customer_id, 10),
      project_id: body.project_id ? parseInt(body.project_id, 10) : null,
      company_id: companyId,
      user_id: userId,
      amount: quoteTotal,
      description: body.description || null,
      reference,
      status: 'draft',
      valid_until: body.valid_until || null,
    };

    // Insert quote
    const { data: quoteData, error: quoteError } = await supabaseServer
      .from('quotes')
      .insert([quotePayload])
      .select('*')
      .single();

    if (quoteError) {
      console.error('POST /api/quotes error:', quoteError);
      return NextResponse.json(
        { error: quoteError.message || 'Failed to create quote' },
        { status: 500 }
      );
    }

    if (!quoteData) {
      return NextResponse.json(
        { error: 'Quote not created' },
        { status: 500 }
      );
    }

    // Insert line items
    const lineItemPayloads = validatedLines.map((line: any) => ({
      quote_id: quoteData.id,
      item_id: line.item_id,
      item_name: line.item_name,
      description: line.description,
      quantity: line.quantity,
      unit: line.unit,
      rate: line.rate,
      note: line.note,
      company_id: companyId,
      user_id: userId,
    }));

    const { error: lineError } = await supabaseServer
      .from('quote_line_items')
      .insert(lineItemPayloads);

    if (lineError) {
      console.error('POST /api/quotes line insert error:', lineError);
      // Delete the quote if line insertion fails
      await supabaseServer.from('quotes').delete().eq('id', quoteData.id);
      return NextResponse.json(
        { error: 'Quote line items could not be stored' },
        { status: 500 }
      );
    }

    // Fetch the complete quote with line items
    const { data: fullQuote, error: fetchError } = await supabaseServer
      .from('quotes')
      .select(`${QUOTE_SELECT}, line_items:quote_line_items(*)`)
      .eq('id', quoteData.id)
      .single();

    if (fetchError) {
      console.error('POST /api/quotes fetch error:', fetchError);
      return NextResponse.json(quoteData); // Return basic quote if fetch fails
    }

    return NextResponse.json(fullQuote);
  } catch (err) {
    console.error('POST /api/quotes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quotes/:id
 * Update an existing quote (only draft quotes can be modified)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const quoteId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
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

    // Check quote exists and is in draft status
    const { data: existingQuote, error: checkError } = await supabaseServer
      .from('quotes')
      .select('id, status')
      .eq('id', parseInt(quoteId, 10))
      .single();

    if (checkError || !existingQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (existingQuote.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft quotes can be modified' },
        { status: 400 }
      );
    }

    // Prepare update payload (only allow certain fields to be updated)
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.description !== undefined) {
      updatePayload.description = body.description;
    }
    if (body.valid_until !== undefined) {
      updatePayload.valid_until = body.valid_until;
    }

    // Update quote
    const { data: updatedQuote, error: updateError } = await supabaseServer
      .from('quotes')
      .update(updatePayload)
      .eq('id', parseInt(quoteId, 10))
      .select(`${QUOTE_SELECT}, line_items:quote_line_items(*)`)
      .single();

    if (updateError) {
      console.error('PATCH /api/quotes error:', updateError);
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedQuote);
  } catch (err) {
    console.error('PATCH /api/quotes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/quotes/:id
 * Delete a quote (only draft quotes can be deleted)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const quoteId = searchParams.get('id');
    const userId = resolveServerUserId(searchParams.get('user_id'));

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
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

    // Check quote exists and is in draft status
    const { data: existingQuote, error: checkError } = await supabaseServer
      .from('quotes')
      .select('id, status')
      .eq('id', parseInt(quoteId, 10))
      .single();

    if (checkError || !existingQuote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    if (existingQuote.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft quotes can be deleted' },
        { status: 400 }
      );
    }

    // Delete quote (cascade will delete line items)
    const { error: deleteError } = await supabaseServer
      .from('quotes')
      .delete()
      .eq('id', parseInt(quoteId, 10));

    if (deleteError) {
      console.error('DELETE /api/quotes error:', deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: parseInt(quoteId, 10) });
  } catch (err) {
    console.error('DELETE /api/quotes exception:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
