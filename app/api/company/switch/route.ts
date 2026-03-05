/**
 * API Route: /api/company/switch
 * 
 * Handles switching active company for the current user.
 * Updates session state, validates access, and prepares redirect data.
 */

import { NextRequest, NextResponse } from "next/server";
import { resolveServerUserId } from "@/lib/serverUser";
import { supabaseServer } from "@/lib/supabaseServer";
import { isDemoCompany, DEMO_COMPANY_ID } from "@/lib/demoConstants";

export async function POST(request: NextRequest) {
  try {
    const { companyId } = await request.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required" },
        { status: 400 }
      );
    }

    // Get current user
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // If switching to demo, no validation needed
    if (isDemoCompany(companyId)) {
      return NextResponse.json({
        success: true,
        companyId,
        redirectUrl: "/dashboard",
      });
    }

    // For live companies, validate user has access
    const { data: company, error } = await supabaseServer
      .from("company_profiles")
      .select("id, name, user_id")
      .eq("id", companyId)
      .eq("user_id", userId)
      .single();

    if (error || !company) {
      return NextResponse.json(
        { error: "Company not found or access denied" },
        { status: 403 }
      );
    }

    // Fetch scoped data to populate dashboard
    const [projects, tasks, invoices] = await Promise.all([
      supabaseServer
        .from("projects")
        .select("id, name")
        .eq("user_id", userId)
        .limit(5),
      supabaseServer
        .from("tasks")
        .select("id, name, status")
        .eq("user_id", userId)
        .limit(5),
      supabaseServer
        .from("invoices")
        .select("id, reference, total")
        .eq("user_id", userId)
        .limit(5),
    ]);

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
      },
      companyId,
      redirectUrl: "/dashboard",
      scopedData: {
        projects: projects.data || [],
        tasks: tasks.data || [],
        invoices: invoices.data || [],
      },
    });
  } catch (err) {
    console.error("Error switching company:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
