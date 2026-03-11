/**
 * ADMIN CMS API - Audit Logs Endpoint
 * 
 * Retrieve audit logs with filtering for compliance and troubleshooting
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";

export async function GET(req: NextRequest) {
  try {
    // Verify admin access
    const userId = await resolveServerUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get filter parameters
    const action = searchParams.get("action");
    const resourceType = searchParams.get("resource_type");
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Build query
    let query = supabaseServer
      .from("admin_audit_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (action && action !== "all") {
      query = query.eq("action", action);
    }

    if (resourceType && resourceType !== "all") {
      query = query.eq("resource_type", resourceType);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error } = await query;

    if (error) throw error;

    return NextResponse.json({ logs: logs || [] }, { status: 200 });
  } catch (error: any) {
    console.error("Get audit logs error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

