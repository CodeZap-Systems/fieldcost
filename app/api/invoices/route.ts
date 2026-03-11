import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import {
  buildStoredInvoiceLine,
  deleteStoredInvoice,
  getStoredInvoice,
  getStoredInvoices,
  updateStoredInvoice,
  saveStoredInvoice,
  storedInvoiceToApi,
  type StoredInvoiceRecord,
} from '../../../lib/invoiceStore';
import { canMutateInvoices } from '../../../lib/invoicePermissions';
import {
  generateInvoiceNumber,
  normalizeDateInput,
  normalizeStatus,
  prepareLineItems,
  sanitize,
  sanitizeCurrency,
  type NormalizedLineItem,
} from '../../../lib/invoiceValidation';
import { isSchemaCacheError } from '../../../lib/supabaseErrors';

const INVOICE_SELECT = '*, customer:customers(id, name, email)';

type InvoiceRow = {
  id: number | null;
  user_id?: string | null;
  line_items?: unknown;
};

async function attachInvoiceLines<T extends InvoiceRow>(rows: T[], userId?: string | null) {
  if (!rows?.length) return rows;
  const invoiceIds = rows.map(row => row.id).filter((id): id is number => typeof id === 'number');
  if (!invoiceIds.length) return rows;
  const fromFn = supabaseServer?.from;
  if (typeof fromFn !== 'function') {
    console.warn('attachInvoiceLines skipped: supabaseServer.from unavailable');
    return rows;
  }
  const client: any = fromFn.call(supabaseServer, 'invoice_line_items');
  if (!client || typeof client.select !== 'function') {
    console.warn('attachInvoiceLines skipped: select builder unavailable');
    return rows;
  }
  let query: any;
  try {
    query = client.select('*').in('invoice_id', invoiceIds);
    if (userId && query && typeof query.eq === 'function') {
      query = query.eq('user_id', userId);
    }
  } catch (builderError) {
    console.warn('attachInvoiceLines builder error', builderError);
    return rows;
  }
  if (!query || typeof query.then !== 'function') {
    console.warn('attachInvoiceLines skipped: query is not awaitable');
    return rows;
  }
  const { data, error } = await query;
  if (error) {
    if (!isSchemaCacheError(error)) {
      console.error('attachInvoiceLines error:', error);
    }
    return rows;
  }
  if (!Array.isArray(data)) {
    return rows;
  }
  const grouped = data.reduce<Record<number, typeof data>>((acc, line) => {
    const invoiceId = typeof line.invoice_id === 'number' ? line.invoice_id : null;
    if (invoiceId === null) return acc;
    if (!acc[invoiceId]) acc[invoiceId] = [];
    acc[invoiceId].push(line);
    return acc;
  }, {});
  return rows.map(row => (typeof row.id === 'number' ? { ...row, line_items: grouped[row.id] ?? [] } : { ...row }));
}

type CustomerIdentifier = {
  customer_id?: unknown;
  customerId?: unknown;
  customer?: string | null;
};

async function resolveCustomerId(userId: string, idPayload: CustomerIdentifier) {
  const rawId = idPayload.customer_id ?? idPayload.customerId;
  if (rawId !== undefined && rawId !== null && rawId !== '') {
    const parsed = Number(rawId);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return null;
  }
  if (idPayload.customer) {
    const { data, error } = await supabaseServer
      .from('customers')
      .select('id')
      .eq('user_id', userId)
      .eq('name', idPayload.customer)
      .maybeSingle();
    if (error) {
      console.error('resolveCustomerId lookup error:', error);
      return null;
    }
    return data?.id ?? null;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyId = searchParams.get('company_id');
    const stored = userId ? await getStoredInvoices(userId) : [];
    const query = supabaseServer.from('invoices').select(INVOICE_SELECT).order('id', { ascending: false });
    let finalQuery = userId ? query.eq('user_id', userId) : query;
    // Add company filter if available
    if (companyId) {
      finalQuery = finalQuery.eq('company_id', companyId);
    }
    const { data, error } = await finalQuery;
    if (error) {
      if (isSchemaCacheError(error)) {
        return NextResponse.json(stored.map(storedInvoiceToApi));
      }
      console.error('GET /api/invoices error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const hydrated = await attachInvoiceLines(data ?? [], userId);
    // Ensure company_id is in response
    const withCompanyId = (hydrated || []).map(inv => ({ 
      ...inv, 
      company_id: inv.company_id || companyId 
    }));
    const offline = stored.map(storedInvoiceToApi);
    return NextResponse.json([...withCompanyId, ...offline]);
  } catch (err) {
    console.error('GET /api/invoices exception:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

async function persistOfflineInvoice(options: {
  userId: string;
  customerId: number;
  customerName: string | null;
  payload: {
    amount: number;
    description: string | null;
    reference: string | null;
    invoice_number: string;
    issued_on: string | null;
    due_on: string | null;
    status: string;
    currency: string | null;
  };
  lines: NormalizedLineItem[];
}) {
  const { userId, customerId, customerName, payload, lines } = options;
  const storedLines = normalizedToStoredLines(lines);
  const record = await saveStoredInvoice(
    userId,
    {
      customer_id: customerId,
      customer_name: customerName,
      amount: payload.amount,
      description: payload.description,
      reference: payload.reference,
      invoice_number: payload.invoice_number,
      issued_on: payload.issued_on,
      due_on: payload.due_on,
      status: payload.status,
      currency: payload.currency,
      line_items: storedLines,
    } as Omit<StoredInvoiceRecord, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  );
  return storedInvoiceToApi(record);
}

function normalizedToStoredLines(lines: NormalizedLineItem[]) {
  return lines.map(line =>
    buildStoredInvoiceLine({
      item_id: line.item_id,
      name: line.name,
      quantity: line.quantity,
      rate: line.rate,
      total: line.total,
      project: line.project,
      note: line.note,
      source: line.source,
      task_ref: line.task_ref,
    })
  );
}

function storedLinesToNormalized(userId: string, lines: StoredInvoiceRecord['line_items']) {
  return lines.map(line => ({
    item_id: typeof line.item_id === 'number' ? line.item_id : null,
    name: line.name,
    quantity: line.quantity,
    rate: line.rate,
    total: line.total,
    project: line.project,
    note: line.note,
    source: line.source,
    task_ref: line.task_ref,
    user_id: userId,
  }));
}


export async function POST(req: Request) {
  try {
    // Restrict to admin only
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!canMutateInvoices(user?.user_metadata?.role)) {
      console.warn('POST /api/invoices forbidden for role:', user?.user_metadata?.role);
      return NextResponse.json({ error: 'You do not have permission to create invoices.' }, { status: 403 });
    }
    const body = await req.json();
    const userId = resolveServerUserId(body.user_id);
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error('POST /api/invoices ensureAuthUser error:', error);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }
    const customerId = await resolveCustomerId(userId, body);
    if (!customerId) {
      return NextResponse.json({ error: 'Customer selection is required to create an invoice.' }, { status: 400 });
    }
    const customerName = typeof body.customer_name === 'string' ? body.customer_name : null;
    const reference = sanitize(body.reference);
    const issuedOn = normalizeDateInput(body.issued_on) ?? new Date().toISOString().slice(0, 10);
    const dueOn = normalizeDateInput(body.due_on);
    const status = normalizeStatus(body.status);
    const currency = sanitizeCurrency(body.currency);

    const { lines, total: lineTotal } = prepareLineItems(body.lines, userId);
    if (!lines.length) {
      return NextResponse.json({ error: 'At least one invoice line item is required.' }, { status: 400 });
    }
    const computedAmount = lineTotal || Number(body.amount) || 0;
    const payload = {
      customer_id: customerId,
      amount: computedAmount,
      description: body.description ?? null,
      reference: reference || null,
      invoice_number: sanitize(body.invoice_number) || generateInvoiceNumber(userId),
      issued_on: issuedOn,
      due_on: dueOn,
      status,
      currency,
      user_id: userId,
    };
    const offlinePayload = {
      amount: payload.amount,
      description: payload.description,
      reference: payload.reference,
      invoice_number: payload.invoice_number,
      issued_on: payload.issued_on,
      due_on: payload.due_on,
      status: payload.status,
      currency: payload.currency,
    };
    const inserted = await supabaseServer.from('invoices').insert([payload]).select('*');
    if (inserted.error) {
      if (isSchemaCacheError(inserted.error)) {
        const offlineResponse = await persistOfflineInvoice({
          userId,
          customerId,
          customerName,
          payload: offlinePayload,
          lines,
        });
        return NextResponse.json(offlineResponse);
      }
      console.error('POST /api/invoices error:', inserted.error);
      return NextResponse.json({ error: inserted.error.message }, { status: 500 });
    }
    const invoice = inserted.data?.[0];
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not created' }, { status: 500 });
    }
    const linePayload = lines.map(line => ({ ...line, invoice_id: invoice.id }));
    const { error: lineError } = await supabaseServer.from('invoice_line_items').insert(linePayload);
    if (lineError) {
      if (isSchemaCacheError(lineError)) {
        await supabaseServer.from('invoices').delete().eq('id', invoice.id);
        const offlineResponse = await persistOfflineInvoice({
          userId,
          customerId,
          customerName,
          payload: offlinePayload,
          lines,
        });
        return NextResponse.json(offlineResponse);
      }
      console.error('POST /api/invoices line insert error:', lineError);
      return NextResponse.json({ error: 'Invoice lines could not be stored' }, { status: 500 });
    }
    const { data, error } = await supabaseServer
      .from('invoices')
      .select(INVOICE_SELECT)
      .eq('id', invoice.id)
      .maybeSingle();
    if (error) {
      console.error('POST /api/invoices error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const [hydrated] = await attachInvoiceLines(data ? [data] : [], userId);
    return NextResponse.json(hydrated ?? data);
  } catch (err) {
    console.error('POST /api/invoices exception:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Restrict to admin only
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!canMutateInvoices(user?.user_metadata?.role)) {
      console.warn('PATCH /api/invoices forbidden for role:', user?.user_metadata?.role);
      return NextResponse.json({ error: 'You do not have permission to update invoices.' }, { status: 403 });
    }
    const body = await req.json();
    const { id, user_id: incomingUserId } = body;
    const userId = resolveServerUserId(incomingUserId);
    const numericId = typeof id === 'number' ? id : Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: 'Valid invoice id required.' }, { status: 400 });
    }
    const wantsCustomerChange =
      body.customer_id !== undefined || body.customerId !== undefined || typeof body.customer === 'string';
    if (numericId < 0) {
      return patchOfflineInvoice({ body, userId, invoiceId: numericId, wantsCustomerChange });
    }
    const updateFields: Record<string, unknown> = {};
    if (body.amount !== undefined) updateFields.amount = Number(body.amount) || 0;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.reference !== undefined) updateFields.reference = sanitize(body.reference) || null;
    if (body.invoice_number !== undefined) updateFields.invoice_number = sanitize(body.invoice_number) || null;
    if (body.currency !== undefined) updateFields.currency = sanitizeCurrency(body.currency);
    if (body.status !== undefined) updateFields.status = normalizeStatus(body.status);
    if (body.issued_on !== undefined) updateFields.issued_on = normalizeDateInput(body.issued_on);
    if (body.due_on !== undefined) updateFields.due_on = normalizeDateInput(body.due_on);

    let newLines: NormalizedLineItem[] | null = null;
    if (Array.isArray(body.lines)) {
      const prepared = prepareLineItems(body.lines, userId);
      if (!prepared.lines.length) {
        return NextResponse.json({ error: 'Updated invoices require at least one line item.' }, { status: 400 });
      }
      newLines = prepared.lines;
      updateFields.amount = prepared.total;
    }
    if (wantsCustomerChange) {
      const newCustomerId = await resolveCustomerId(userId, body);
      if (!newCustomerId) {
        return NextResponse.json({ error: 'Customer not found for this workspace.' }, { status: 400 });
      }
      updateFields.customer_id = newCustomerId;
    }
    if (!Object.keys(updateFields).length) {
      return NextResponse.json({ error: 'No invoice changes supplied.' }, { status: 400 });
    }
    const { data, error } = await supabaseServer
      .from('invoices')
      .update(updateFields)
      .eq('id', numericId)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();
    if (error) {
      console.error('PATCH /api/invoices error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    }
    if (newLines) {
      await supabaseServer.from('invoice_line_items').delete().eq('invoice_id', numericId).eq('user_id', userId);
      const linePayload = newLines.map(line => ({ ...line, invoice_id: numericId }));
      const { error: lineError } = await supabaseServer.from('invoice_line_items').insert(linePayload);
      if (lineError) {
        console.error('PATCH /api/invoices line update error:', lineError);
        return NextResponse.json({ error: 'Invoice lines could not be updated' }, { status: 500 });
      }
    }
    const { data: refreshed, error: fetchError } = await supabaseServer
      .from('invoices')
      .select(INVOICE_SELECT)
      .eq('id', numericId)
      .eq('user_id', userId)
      .maybeSingle();
    if (fetchError) {
      console.error('PATCH /api/invoices fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    const [hydrated] = await attachInvoiceLines(refreshed ? [refreshed] : [], userId);
    return NextResponse.json(hydrated ?? refreshed);
  } catch (err) {
    console.error('PATCH /api/invoices exception:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

async function patchOfflineInvoice(options: {
  body: any;
  userId: string;
  invoiceId: number;
  wantsCustomerChange: boolean;
}) {
  const { body, userId, invoiceId, wantsCustomerChange } = options;
  const existing = await getStoredInvoice(userId, invoiceId);
  if (!existing) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }
  let customerId = existing.customer_id;
  if (wantsCustomerChange) {
    const resolved = await resolveCustomerId(userId, body);
    if (!resolved) {
      return NextResponse.json({ error: 'Customer not found for this workspace.' }, { status: 400 });
    }
    customerId = resolved;
  }
  const customerName = typeof body.customer_name === 'string' ? body.customer_name : existing.customer_name;
  const updateFields: Record<string, unknown> = {};
  if (body.description !== undefined) updateFields.description = body.description;
  if (body.reference !== undefined) updateFields.reference = sanitize(body.reference) || null;
  if (body.invoice_number !== undefined) updateFields.invoice_number = sanitize(body.invoice_number) || existing.invoice_number;
  if (body.currency !== undefined) updateFields.currency = sanitizeCurrency(body.currency);
  if (body.status !== undefined) updateFields.status = normalizeStatus(body.status);
  if (body.issued_on !== undefined) updateFields.issued_on = normalizeDateInput(body.issued_on);
  if (body.due_on !== undefined) updateFields.due_on = normalizeDateInput(body.due_on);
  let normalizedLines = storedLinesToNormalized(userId, existing.line_items);
  let storedLines = existing.line_items;
  let lineTotal = normalizedLines.reduce((sum, line) => sum + line.total, 0);
  if (Array.isArray(body.lines)) {
    const prepared = prepareLineItems(body.lines, userId);
    if (!prepared.lines.length) {
      return NextResponse.json({ error: 'Updated invoices require at least one line item.' }, { status: 400 });
    }
    normalizedLines = prepared.lines;
    storedLines = normalizedToStoredLines(prepared.lines);
    lineTotal = prepared.total;
  }
  if (wantsCustomerChange) {
    updateFields.customer_id = customerId;
  }
  if (typeof body.customer_name === 'string') {
    updateFields.customer_name = customerName;
  }
  if (body.amount !== undefined) {
    updateFields.amount = Number(body.amount) || 0;
  }
  if (Array.isArray(body.lines)) {
    updateFields.amount = lineTotal;
    updateFields.line_items = storedLines;
  }
  if (!Object.keys(updateFields).length) {
    return NextResponse.json({ error: 'No invoice changes supplied.' }, { status: 400 });
  }
  const updated = await updateStoredInvoice(userId, invoiceId, {
    amount:
      typeof updateFields.amount === 'number'
        ? (updateFields.amount as number)
        : Array.isArray(body.lines)
          ? lineTotal
          : existing.amount,
    description: (updateFields.description as string | undefined) ?? existing.description,
    reference: (updateFields.reference as string | null | undefined) ?? existing.reference,
    invoice_number: (updateFields.invoice_number as string | undefined) ?? existing.invoice_number,
    issued_on: (updateFields.issued_on as string | null | undefined) ?? existing.issued_on,
    due_on: (updateFields.due_on as string | null | undefined) ?? existing.due_on,
    status: (updateFields.status as string | undefined) ?? existing.status,
    currency: (updateFields.currency as string | undefined) ?? existing.currency,
    customer_id: customerId,
    customer_name: (updateFields.customer_name as string | undefined) ?? existing.customer_name,
    line_items: Array.isArray(body.lines) ? storedLines : existing.line_items,
    pending_sync: true,
  });
  if (!updated) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
  }
  return NextResponse.json(storedInvoiceToApi(updated));
}

export async function DELETE(req: Request) {
  try {
    // Restrict to admin only
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!canMutateInvoices(user?.user_metadata?.role)) {
      console.warn('DELETE /api/invoices forbidden for role:', user?.user_metadata?.role);
      return NextResponse.json({ error: 'You do not have permission to delete invoices.' }, { status: 403 });
    }
    const { id, user_id: incomingUserId } = await req.json();
    const userId = resolveServerUserId(incomingUserId);
    const numericId = typeof id === 'number' ? id : Number(id);
    const hasNumericId = Number.isFinite(numericId);
    if (hasNumericId && numericId < 0) {
      await deleteStoredInvoice(userId, numericId);
      return NextResponse.json({ success: true });
    }
    const { error } = await supabaseServer.from('invoices').delete().eq('id', id).eq('user_id', userId);
    if (error) {
      if (isSchemaCacheError(error) && hasNumericId) {
        await deleteStoredInvoice(userId, numericId);
        return NextResponse.json({ success: true });
      }
      console.error('DELETE /api/invoices error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/invoices exception:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
