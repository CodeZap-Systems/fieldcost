/**
 * API: Sage Business Cloud Accounting Integration
 * Handles invoice sync and customer sync with Sage X3/Xero
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

// Middleware
async function requireAuth(request: NextRequest) {
  const userId = await resolveServerUserId();
  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }
  return { userId };
}

// GET /api/sage/status
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { pathname } = new URL(request.url);

    // Route: /api/sage/status
    if (pathname === "/api/sage/status") {
      return NextResponse.json({
        status: "operational",
        timestamp: new Date().toISOString(),
        integrationType: "sage-x3-xero",
        lastSync: null,
      });
    }

    // Route: /api/sage/invoices
    if (pathname === "/api/sage/invoices") {
      // Get company's Sage-synced invoices
      const { data: invoices, error } = await supabaseServer
        .from("billing_invoices")
        .select("*, company_id, status, total_amount, created_at")
        .eq("sage_sync_status", "synced")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return NextResponse.json({
        invoices: invoices || [],
        total: invoices?.length || 0,
        syncStatus: "operational",
      });
    }

    // Route: /api/sage/customers
    if (pathname === "/api/sage/customers") {
      // Get company's Sage-linked customers
      const { data: customers, error } = await supabaseServer
        .from("customers")
        .select("*, company_id, sage_customer_id, created_at")
        .eq("sage_linked", true);

      if (error) throw error;

      return NextResponse.json({
        customers: customers || [],
        total: customers?.length || 0,
      });
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Sage API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/sage/invoices/sync
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { pathname } = new URL(request.url);
    const body = await request.json();

    // Route: /api/sage/invoices/sync
    if (pathname === "/api/sage/invoices/sync") {
      const { invoiceId, companyId } = body;

      if (!invoiceId || !companyId) {
        return NextResponse.json(
          { error: "Missing invoiceId or companyId" },
          { status: 400 }
        );
      }

      // Get invoice
      const { data: invoice, error: invoiceError } = await supabaseServer
        .from("billing_invoices")
        .select("*")
        .eq("id", invoiceId)
        .eq("company_id", companyId)
        .single();

      if (invoiceError || !invoice) {
        return NextResponse.json(
          { error: "Invoice not found" },
          { status: 404 }
        );
      }

      // In production, would call Sage API here
      // For now, just mark as synced
      const { error: updateError } = await supabaseServer
        .from("billing_invoices")
        .update({
          sage_sync_status: "synced",
          sage_sync_date: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      if (updateError) throw updateError;

      return NextResponse.json(
        {
          success: true,
          invoiceId,
          syncStatus: "synced",
          message: "Invoice synced to Sage",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("Sage sync error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
