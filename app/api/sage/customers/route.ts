import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  try {
    // Get query params for filtering
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    
    const { data: customers, error } = await supabaseServer
      .from("customers")
      .select("*")
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Error fetching customers:", error);
      // Graceful degradation: return empty array
      return NextResponse.json([]);
    }

    // Map customers to include Sage API format fields
    const formatted = (customers || []).map(c => ({
      ID: c.id || c.sage_id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Status: 1, // Active
      ...c
    }));

    return NextResponse.json(formatted);
  } catch (e) {
    console.error("Sage customers GET error:", e);
    // Graceful degradation: return empty array, not error
    return NextResponse.json([]);
  }
}
