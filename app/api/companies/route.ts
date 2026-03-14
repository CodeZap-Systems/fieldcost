/**
 * API: Companies Management
 * GET /api/companies - List all companies for current user
 * GET /api/companies/:id - Get specific company details
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

/**
 * Mark company as demo based on certain criteria
 */
function markDemoCompany(company: any) {
  return {
    ...company,
    is_demo_company: 
      company.name?.toLowerCase().includes('demo') ||
      company.name?.toLowerCase().includes('test'),
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("id");

    // CRITICAL: Get the authenticated user from the session
    // This is the REAL user making the request, not a fallback
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (authError || !user) {
      console.warn('[GET /api/companies] No authenticated user found');
      return NextResponse.json({
        companies: [],
        total: 0,
      });
    }

    const userId = user.id;
    console.log(`[GET /api/companies] Authenticated user: ${userId}`);

    // CRITICAL: Filter by user_id to prevent data leakage between accounts
    if (!userId) {
      return NextResponse.json({
        companies: [],
        total: 0,
      });
    }

    try {
      // Get ONLY companies belonging to the authenticated user
      const { data: userCompanies, error: userError } = await supabaseServer
        .from("company_profiles")
        .select("*")
        .eq("user_id", userId)
        .limit(50);

      console.log(`[GET /api/companies] userId=${userId}, userCompanies=${JSON.stringify(userCompanies?.map(c => ({ id: c.id, name: c.name, is_demo: c.is_demo })))}`);

      // ALSO fetch demo companies (is_demo=true) for all users
      const { data: demoCompanies, error: demoError } = await supabaseServer
        .from("company_profiles")
        .select("*")
        .eq("is_demo", true)
        .limit(50);

      console.log(`[GET /api/companies] demoCompanies=${JSON.stringify(demoCompanies?.map(c => ({ id: c.id, name: c.name, is_demo: c.is_demo })))}`);

      if (userError) {
        console.error("Database error:", userError);
      }

      // Combine both lists
      const allCompanies = [
        ...(userCompanies || []),
        ...(demoCompanies || [])
      ];

      // Mark demo companies and add is_demo flag
      const companiesWithDemo = allCompanies.map(company => ({
        ...company,
        is_demo: company.is_demo === true,
      }));

      console.log(`[GET /api/companies] Final list: ${JSON.stringify(companiesWithDemo.map(c => ({ id: c.id, name: c.name, is_demo: c.is_demo })))}`);

      // If looking for specific company
      if (companyId) {
        const company = companiesWithDemo.find(c => c.id === parseInt(companyId, 10));
        if (company) {
          return NextResponse.json({ company });
        }
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        companies: companiesWithDemo,
        total: companiesWithDemo.length,
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
