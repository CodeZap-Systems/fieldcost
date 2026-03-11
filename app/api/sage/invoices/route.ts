import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data: invoices, error } = await supabaseServer
      .from("billing_invoices")
      .select("*")
      .limit(50)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        invoices: [],
        total: 0,
        syncStatus: "operational",
      });
    }

    return NextResponse.json({
      invoices: invoices || [],
      total: invoices?.length || 0,
      syncStatus: "operational",
    });
  } catch (e) {
    return NextResponse.json({
      invoices: [],
      total: 0,
      syncStatus: "operational",
    });
  }
}
