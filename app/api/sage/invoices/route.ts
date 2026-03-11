import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    // Get query params for filtering
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const syncStatus = searchParams.get('syncStatus');
    
    let query = supabaseServer
      .from("billing_invoices")
      .select("*")
      .limit(limit)
      .order("created_at", { ascending: false });

    // Optional filter by sync status
    if (syncStatus) {
      query = query.eq("sage_sync_status", syncStatus);
    }

    const { data: invoices, error } = await query;

    if (error) {
      console.warn("Error fetching invoices:", error);
      return NextResponse.json([]);
    }

    // Map invoices to include Sage API format fields
    const formatted = (invoices || []).map(inv => ({
      ID: inv.id || inv.sage_id,
      Reference: inv.reference,
      CustomerName: inv.customer_name,
      InvoiceNumber: inv.invoice_number,
      InvoiceDate: inv.invoice_date,
      Status: inv.sage_sync_status === 'synced' ? 2 : 1,
      Total: inv.total,
      Notes: inv.notes,
      ...inv
    }));

    return NextResponse.json(formatted);
  } catch (e) {
    console.error("Sage invoices GET error:", e);
    return NextResponse.json([]);
  }
}

