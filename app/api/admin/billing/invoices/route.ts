/**
 * API: Billing & Invoices Management
 * GET /api/admin/billing/invoices - List invoices
 * POST /api/admin/billing/invoices - Create invoice
 * GET /api/admin/billing/invoices/:id - Get invoice details
 * PATCH /api/admin/billing/invoices/:id - Update invoice
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";
import { CreateInvoiceInput } from "@/lib/cms-types";

async function requireBillingAdmin(request: NextRequest) {
  const userId = await resolveServerUserId();
  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("id, can_manage_billing")
    .eq("user_id", userId)
    .single();

  if (!admin || !admin.can_manage_billing) {
    return { error: "Insufficient permissions", status: 403 };
  }

  return { admin, userId };
}

// Helper to generate invoice number
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");

  // Get last invoice number for this month
  const { data } = await supabaseServer
    .from("billing_invoices")
    .select("invoice_number")
    .ilike("invoice_number", `INV-${year}-${month}-%`)
    .order("invoice_number", { ascending: false })
    .limit(1);

  let nextNumber = 1;
  if (data && data.length > 0) {
    const lastNumber = parseInt(data[0].invoice_number.split("-").pop() || "0");
    nextNumber = lastNumber + 1;
  }

  return `INV-${year}-${month}-${String(nextNumber).padStart(3, "0")}`;
}

// ============================================================================
// GET /api/admin/billing/invoices - List invoices
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await requireBillingAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companyId = request.nextUrl.searchParams.get("company_id");
    const status = request.nextUrl.searchParams.get("status");
    const limit = request.nextUrl.searchParams.get("limit") || "50";

    let query = supabaseServer
      .from("billing_invoices")
      .select(
        `*,
         company_profile:company_id (
           id, name, email
         )
        `
      )
      .order("issue_date", { ascending: false })
      .limit(parseInt(limit));

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data: invoices, error } = await query;

    if (error) throw error;

    // Get stats
    const { data: stats } = await supabaseServer
      .from("billing_invoices")
      .select("total_amount, paid_amount, status");

    const totalAmount = stats?.reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
    const paidAmount = stats?.reduce((sum, inv) => sum + inv.paid_amount, 0) || 0;
    const pendingAmount = totalAmount - paidAmount;

    return NextResponse.json({
      invoices: invoices || [],
      total: invoices?.length || 0,
      stats: {
        total_amount: totalAmount,
        paid_amount: paidAmount,
        pending_amount: pendingAmount,
      },
    });
  } catch (err) {
    console.error("Error fetching invoices:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/admin/billing/invoices - Create invoice
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const auth = await requireBillingAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = (await request.json()) as CreateInvoiceInput;
    const {
      company_id,
      subscription_id,
      issue_date,
      due_date,
      items,
      notes,
    } = body;

    // Validate required fields
    if (!company_id || !subscription_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = items.reduce(
      (sum, item) => sum + (item.tax_percent ? (item.amount * item.tax_percent) / 100 : 0),
      0
    );
    const total_amount = subtotal + tax_amount;

    // Create invoice
    const { data: invoice, error } = await supabaseServer
      .from("billing_invoices")
      .insert({
        invoice_number: invoiceNumber,
        company_id,
        subscription_id,
        issue_date,
        due_date,
        subtotal,
        tax_amount,
        total_amount,
        invoice_items: items,
        notes,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "create",
      entity_type: "invoice",
      entity_id: invoice.id,
      entity_name: invoiceNumber,
      changes_json: { items, total: total_amount },
      status: "success",
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error("Error creating invoice:", err);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/admin/billing/invoices/:id - Update invoice
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireBillingAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const invoiceId = request.nextUrl.searchParams.get("id");
    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { data: invoice, error } = await supabaseServer
      .from("billing_invoices")
      .update(body)
      .eq("id", invoiceId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "update",
      entity_type: "invoice",
      entity_id: invoiceId,
      entity_name: invoice.invoice_number,
      changes_json: body,
      status: "success",
    });

    return NextResponse.json(invoice);
  } catch (err) {
    console.error("Error updating invoice:", err);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
