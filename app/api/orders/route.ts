/**
 * Purchase Orders API Route
 * Handles CRUD operations for purchase orders using Invoice pattern
 * Reuses invoice logic but with order-specific fields (vendor, delivery_date, status: draft/confirmed/delivered)
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '@/lib/demoAuth';
import { getCompanyContext } from '@/lib/companyContext';
import {
  normalizeDateInput,
  prepareLineItems,
  sanitize,
} from '@/lib/invoiceValidation';

const ORDER_SELECT = '*';
const VALID_ORDER_STATUSES = new Set(['draft', 'confirmed', 'delivered', 'cancelled']);

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
      console.warn(`[SECURITY] GET /api/orders: Missing company_id for user ${userId}`);
      return NextResponse.json(
        { error: 'company_id parameter is required for data isolation' },
        { status: 400 }
      );
    }
    
    const trimmed = companyIdParam.trim();
    const asInt = parseInt(trimmed, 10);
    let companyId: string | number = Number.isFinite(asInt) ? asInt : trimmed;
    
    let query = supabaseServer.from('orders').select(ORDER_SELECT).order('id', { ascending: false });
    
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
    if (statusFilter && VALID_ORDER_STATUSES.has(statusFilter.toLowerCase())) {
      query = query.eq('status', statusFilter.toLowerCase());
    }
    
    // Apply date range filter
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    if (fromDate) {
      query = query.gte('created_at', `${fromDate}T00:00:00`);
    }
    if (toDate) {
      query = query.lte('created_at', `${toDate}T23:59:59`);
    }
    
    // Apply search filter
    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      query = query.or(`reference.ilike.%${searchTerm}%,vendor_name.ilike.%${searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('GET /api/orders error:', error);
      return NextResponse.json([], { status: 500 });
    }
    
    // Attach line items to orders
    const orderIds = (data || []).map((o: any) => o.id).filter((id): id is number => typeof id === 'number');
    let lineItems: any[] = [];
    
    if (orderIds.length > 0) {
      const { data: lines } = await supabaseServer
        .from('order_line_items')
        .select('*')
        .in('order_id', orderIds);
      
      lineItems = lines || [];
    }
    
    const grouped: Record<number, any[]> = {};
    lineItems.forEach((line: any) => {
      const orderId = line.order_id;
      if (!grouped[orderId]) grouped[orderId] = [];
      grouped[orderId].push(line);
    });
    
    const orders = (data || []).map((order: any) => ({
      ...order,
      line_items: grouped[order.id] || [],
    }));
    
    return NextResponse.json(orders);
  } catch (err) {
    console.error('GET /api/orders exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, vendorId, vendorName, lines, deliveryDate } = body;
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = user.id;
    const companyId = body.company_id;
    
    if (!customerId && !vendorId && !vendorName) {
      return NextResponse.json({ error: 'Vendor or customer is required' }, { status: 400 });
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
    
    const referenceNumber = sanitize(body.reference) || `PO-${Date.now()}`;
    const deliveryDateValue = normalizeDateInput(deliveryDate) || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const orderPayload = {
      customer_id: customerId || null,
      vendor_id: vendorId || null,
      vendor_name: sanitize(vendorName) || sanitize(body.vendor_name) || null,
      amount: body.amount || total,
      description: sanitize(body.description) || null,
      reference: referenceNumber,
      po_number: `PO-${Date.now().toString(36).toUpperCase()}`,
      status: 'draft',
      delivery_date: deliveryDateValue,
      user_id: userId,
      company_id: validCompanyId,
    };
    
    // Create order
    const { data: insertedOrder, error: orderError } = await supabaseServer
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();
    
    if (orderError) {
      console.error('POST /api/orders insert error:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }
    
    // Add line items
    if (normalizedLines.length > 0 && insertedOrder?.id) {
      const linePayload = normalizedLines.map((line: any) => ({
        ...line,
        order_id: insertedOrder.id,
        company_id: validCompanyId,
      }));
      
      const { error: lineError } = await supabaseServer
        .from('order_line_items')
        .insert(linePayload);
      
      if (lineError) {
        console.error('POST /api/orders line items error:', lineError);
      }
    }
    
    return NextResponse.json({ ...insertedOrder, line_items: normalizedLines }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    
    const { data: { user } } = await supabaseServer.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { status, cancellation_reason, received_quantities, ...updateFields } = body;
    
    if (status && !VALID_ORDER_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    const updatePayload: any = { ...updateFields };
    
    if (status) {
      updatePayload.status = status;
      if (status === 'cancelled' && cancellation_reason) {
        updatePayload.cancellation_reason = cancellation_reason;
      }
    }
    
    const { data, error } = await supabaseServer
      .from('orders')
      .update(updatePayload)
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('PATCH /api/orders exception:', err);
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
    
    // Check order status before deletion
    const { data: order } = await supabaseServer
      .from('orders')
      .select('status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    if (order.status !== 'draft') {
      return NextResponse.json({ error: 'Can only delete draft orders' }, { status: 403 });
    }
    
    const { error } = await supabaseServer
      .from('orders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/orders exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
