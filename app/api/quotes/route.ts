/**
 * Quotes API Route
 * Handles CRUD operations for quotes using Invoice pattern
 * Reuses invoicing logic but with quote-specific fields (valid_until, status states: draft/sent/accepted/rejected)
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '@/lib/demoAuth';
import { getCompanyContext } from '@/lib/companyContext';
import {
  generateInvoiceNumber,
  normalizeDateInput,
  normalizeStatus,
  prepareLineItems,
  sanitize,
  sanitizeCurrency,
} from '@/lib/invoiceValidation';

const QUOTE_SELECT = '*';
const VALID_QUOTE_STATUSES = new Set(['draft', 'sent', 'accepted', 'rejected']);

// Get authenticated user with fallback to demo user
async function resolveUserContext(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const { data } = await supabaseServer.auth.getUser(token);
      if (data?.user?.id) {
        return data.user.id;
      }
    } catch (err) {
      console.warn('[resolveUserContext] Failed to get user from auth header:', err);
    }
  }
  const { searchParams } = new URL(req.url);
  const fallback = searchParams.get('user_id');
  const resolved = resolveServerUserId(fallback);
  console.warn(`[resolveUserContext] Using fallback user: ${resolved}`);
  return resolved;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Get authenticated user with fallback
    const userId = await resolveUserContext(req);
    const companyIdParam = searchParams.get('company_id');
    
    if (!companyIdParam || !companyIdParam.trim()) {
      console.warn(`[SECURITY] GET /api/quotes: Missing company_id for user ${userId}`);
      return NextResponse.json(
        { error: 'company_id parameter is required for data isolation' },
        { status: 400 }
      );
    }
    
    const trimmed = companyIdParam.trim();
    const asInt = parseInt(trimmed, 10);
    let companyId: string | number = Number.isFinite(asInt) ? asInt : trimmed;
    
    let query = supabaseServer.from('quotes').select(QUOTE_SELECT).order('id', { ascending: false });
    
    // Apply company filter
    query = query.eq('company_id', companyId);
    
    // For non-demo companies, also filter by user_id
    // For demo companies, allow all users to see shared demo data
    const isDemoCompany = companyId === 8 || companyId === '8';
    if (userId && !isDemoCompany) {
      query = query.eq('user_id', userId);
    }
    
    // Apply status filter if provided
    const statusFilter = searchParams.get('status');
    if (statusFilter && VALID_QUOTE_STATUSES.has(statusFilter.toLowerCase())) {
      query = query.eq('status', statusFilter.toLowerCase());
    }
    
    // Apply expiration filter
    const expiring = searchParams.get('expiring');
    if (expiring === 'true') {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      query = query.lte('valid_until', sevenDaysFromNow.toISOString().split('T')[0]);
      query = query.gte('valid_until', new Date().toISOString().split('T')[0]);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('GET /api/quotes error:', error);
      return NextResponse.json([], { status: 500 });
    }
    
    // Attach line items to quotes
    const quoteIds = (data || []).map((q: any) => q.id).filter((id): id is number => typeof id === 'number');
    let lineItems: any[] = [];
    
    if (quoteIds.length > 0) {
      const { data: lines } = await supabaseServer
        .from('quote_line_items')
        .select('*')
        .in('quote_id', quoteIds);
      
      lineItems = lines || [];
    }
    
    const grouped: Record<number, any[]> = {};
    lineItems.forEach((line: any) => {
      const quoteId = line.quote_id;
      if (!grouped[quoteId]) grouped[quoteId] = [];
      grouped[quoteId].push(line);
    });
    
    const quotes = (data || []).map((quote: any) => ({
      ...quote,
      line_items: grouped[quote.id] || [],
    }));
    
    return NextResponse.json(quotes);
  } catch (err) {
    console.error('GET /api/quotes exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, lines, validUntil } = body;
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = user.id;
    const companyId = body.company_id;
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer is required' }, { status: 400 });
    }
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }
    
    // Ensure user is authenticated
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }
    
    // Validate company access
    let validCompanyId: number;
    try {
      const { companyId: validated } = await getCompanyContext(userId, companyId);
      validCompanyId = validated;
    } catch (error) {
      return NextResponse.json({ error: 'Company access denied' }, { status: 403 });
    }
    
    // Prepare line items
    const { lines: normalizedLines, total } = prepareLineItems(lines || [], userId);
    
    const referenceNumber = sanitize(body.reference) || `QUOTE-${Date.now()}`;
    const validUntilDate = normalizeDateInput(validUntil) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const quotePayload = {
      customer_id: customerId,
      customer_name: sanitize(body.customer_name),
      amount: body.amount || total,
      description: sanitize(body.description) || null,
      reference: referenceNumber,
      quote_number: `Q-${Date.now().toString(36).toUpperCase()}`,
      status: 'draft',
      valid_until: validUntilDate,
      user_id: userId,
      company_id: validCompanyId,
    };
    
    // Create quote
    const { data: insertedQuote, error: quoteError } = await supabaseServer
      .from('quotes')
      .insert([quotePayload])
      .select()
      .single();
    
    if (quoteError) {
      console.error('POST /api/quotes insert error:', quoteError);
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }
    
    // Add line items
    if (normalizedLines.length > 0 && insertedQuote?.id) {
      const linePayload = normalizedLines.map((line: any) => ({
        ...line,
        quote_id: insertedQuote.id,
        company_id: validCompanyId,
      }));
      
      const { error: lineError } = await supabaseServer
        .from('quote_line_items')
        .insert(linePayload);
      
      if (lineError) {
        console.error('POST /api/quotes line items error:', lineError);
        // Continue anyway, quote was created
      }
    }
    
    return NextResponse.json({ ...insertedQuote, line_items: normalizedLines }, { status: 201 });
  } catch (err) {
    console.error('POST /api/quotes exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id } = await Promise.resolve(body);
    
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { status, rejection_reason, ...updateFields } = body;
    
    if (status && !VALID_QUOTE_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const updatePayload: any = { ...updateFields };
    
    if (status) {
      updatePayload.status = status;
      if (status === 'rejected' && rejection_reason) {
        updatePayload.rejection_reason = rejection_reason;
      }
    }
    
    const { data, error } = await supabaseServer
      .from('quotes')
      .update(updatePayload)
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/quotes exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check quote status before deletion
    const { data: quote } = await supabaseServer
      .from('quotes')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    
    if (quote.status !== 'draft') {
      return NextResponse.json({ error: 'Can only delete draft quotes' }, { status: 403 });
    }
    
    const { error } = await supabaseServer
      .from('quotes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/quotes exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
