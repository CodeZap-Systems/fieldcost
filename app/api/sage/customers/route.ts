import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { data: customers, error } = await supabaseServer
      .from("customers")
      .select("*")
      .limit(50);

    if (error) {
      return NextResponse.json({
        customers: [],
        total: 0,
      });
    }

    return NextResponse.json({
      customers: customers || [],
      total: customers?.length || 0,
    });
  } catch (e) {
    return NextResponse.json({
      customers: [],
      total: 0,
    });
  }
}
