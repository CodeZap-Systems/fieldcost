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
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("id");

    if (companyId) {
      // Get specific company
      const { data: company, error } = await supabaseServer
        .from("company_profiles")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error || !company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ company });
    }

    // Get all companies for current user
    // User can access companies they own or are team members of
    const { data: userCompanies, error } = await supabaseServer
      .from("company_profiles")
      .select("*")
      .or(
        `owner_id.eq.${userId},team_members.cs.{"${userId}"}`
      );

    if (error) {
      console.error("Error fetching companies:", error);
      return NextResponse.json(
        { error: "Failed to fetch companies" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      companies: userCompanies || [],
      total: userCompanies?.length || 0,
    });
  } catch (err) {
    console.error("Error in GET /api/companies:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
