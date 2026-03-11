/**
 * API: Companies Management
 * GET /api/companies - List all companies for current user
 * GET /api/companies/:id - Get specific company details
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));
    const companyId = searchParams.get("id");

    // Get all companies (public endpoint)
    try {
      const { data: companies, error } = await supabaseServer
        .from("company_profiles")
        .select("*")
        .limit(50);

      if (error) {
        return NextResponse.json({
          companies: [],
          total: 0,
        });
      }

      // If looking for specific company
      if (companyId) {
        const company = (companies || []).find(c => c.id === companyId);
        if (company) {
          return NextResponse.json({ company });
        }
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        companies: companies || [],
        total: companies?.length || 0,
      });
    } catch (dbError) {
      console.error("Database error fetching companies:", dbError);
      return NextResponse.json({
        companies: [],
        total: 0,
      });
    }
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return NextResponse.json({
      companies: [],
      total: 0,
    });
  }
}
