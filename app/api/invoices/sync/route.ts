import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { ensureAuthUser, EnsureAuthUserError } from "../../../../lib/demoAuth";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { canMutateInvoices } from "../../../../lib/invoicePermissions";
import {
  deleteStoredInvoice,
  listPendingInvoices,
  recordInvoiceSyncFailure,
} from "../../../../lib/invoiceStore";
import { isSchemaCacheError } from "../../../../lib/supabaseErrors";

export async function POST(req: Request) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!canMutateInvoices(user?.user_metadata?.role)) {
      return NextResponse.json({ error: "You do not have permission to sync invoices." }, { status: 403 });
    }
    const body = await req.json();
    const userId = resolveServerUserId(body.user_id);
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }
    const pending = await listPendingInvoices(userId);
    if (!pending.length) {
      return NextResponse.json({ synced: 0, remaining: 0, message: "No offline invoices queued." });
    }
    const failures: Array<{ id: number; error: string }> = [];
    let synced = 0;
    for (const record of pending) {
      const payload = {
        customer_id: record.customer_id,
        amount: record.amount,
        description: record.description,
        reference: record.reference,
        invoice_number: record.invoice_number,
        issued_on: record.issued_on,
        due_on: record.due_on,
        status: record.status,
        currency: record.currency,
        user_id: userId,
      };
      const inserted = await supabaseServer.from("invoices").insert([payload]).select("*");
      if (inserted.error || !inserted.data?.[0]) {
        const message = inserted.error?.message ?? "Failed to create invoice record.";
        failures.push({ id: record.id, error: message });
        await recordInvoiceSyncFailure(userId, record.id, message);
        if (inserted.data?.[0]?.id) {
          await supabaseServer.from("invoices").delete().eq("id", inserted.data[0].id);
        }
        if (isSchemaCacheError(inserted.error)) {
          break;
        }
        continue;
      }
      const persistedInvoice = inserted.data[0];
      const linePayload = record.line_items.map(line => ({
        invoice_id: persistedInvoice.id,
        user_id: userId,
        item_id: line.item_id,
        name: line.name,
        quantity: line.quantity,
        rate: line.rate,
        total: line.total,
        project: line.project,
        note: line.note,
        source: line.source,
        task_ref: line.task_ref,
      }));
      const { error: lineError } = await supabaseServer.from("invoice_line_items").insert(linePayload);
      if (lineError) {
        const message = lineError.message;
        failures.push({ id: record.id, error: message });
        await recordInvoiceSyncFailure(userId, record.id, message);
        await supabaseServer.from("invoices").delete().eq("id", persistedInvoice.id);
        if (isSchemaCacheError(lineError)) {
          break;
        }
        continue;
      }
      await deleteStoredInvoice(userId, record.id);
      synced += 1;
    }
    const remaining = (await listPendingInvoices(userId)).length;
    return NextResponse.json({ synced, remaining, failures, lastSynced: synced ? new Date().toISOString() : null });
  } catch (err) {
    console.error("POST /api/invoices/sync exception", err);
    return NextResponse.json({ error: "Unable to sync invoices" }, { status: 500 });
  }
}
