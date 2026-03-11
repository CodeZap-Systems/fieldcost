/**
 * API: Company Subscriptions Management
 * GET /api/admin/subscriptions - List subscriptions
 * GET /api/admin/subscriptions?company_id=xxx - Get company subscription
 * POST /api/admin/subscriptions - Create subscription
 * PATCH /api/admin/subscriptions - Update subscription
 * POST /api/admin/subscriptions/upgrade - Upgrade subscription
 * POST /api/admin/subscriptions/cancel - Cancel subscription
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";
import { CompanySubscription, UpgradeSubscriptionInput } from "@/lib/cms-types";

async function requireAdmin(request: NextRequest) {
  const userId = await resolveServerUserId();
  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  const { data: admin } = await supabaseServer
    .from("admin_users")
    .select("id, can_manage_subscriptions")
    .eq("user_id", userId)
    .single();

  if (!admin || !admin.can_manage_subscriptions) {
    return { error: "Insufficient permissions", status: 403 };
  }

  return { admin, userId };
}

// ============================================================================
// GET /api/admin/subscriptions - List or get company subscription
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companyId = request.nextUrl.searchParams.get("company_id");
    const status = request.nextUrl.searchParams.get("status");

    let query = supabaseServer
      .from("company_subscriptions")
      .select(
        `*,
         subscription_plan:plan_id (
           id, name, tier_level, monthly_price, max_projects, max_team_members
         ),
         company_profile:company_id (
           id, name, email
         )
        `
      );

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data: subscriptions, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      subscriptions: subscriptions || [],
      total: subscriptions?.length || 0,
    });
  } catch (err) {
    console.error("Error fetching subscriptions:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/admin/subscriptions - Create subscription
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { company_id, plan_id, billing_cycle = "monthly" } = body;

    if (!company_id || !plan_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if company exists
    const { data: company } = await supabaseServer
      .from("company_profiles")
      .select("id")
      .eq("id", company_id)
      .single();

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Create subscription
    const renewalDate = new Date();
    renewalDate.setMonth(
      renewalDate.getMonth() + (billing_cycle === "annual" ? 12 : 1)
    );

    const { data: subscription, error } = await supabaseServer
      .from("company_subscriptions")
      .insert({
        company_id,
        plan_id,
        status: "active",
        billing_cycle,
        renewal_date: renewalDate.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "create",
      entity_type: "subscription",
      entity_id: subscription.id,
      entity_name: `Subscription for ${company_id}`,
      changes_json: body,
      status: "success",
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (err) {
    console.error("Error creating subscription:", err);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/admin/subscriptions - Update subscription
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const companyId = request.nextUrl.searchParams.get("company_id");
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { data: subscription, error } = await supabaseServer
      .from("company_subscriptions")
      .update(body)
      .eq("company_id", companyId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "update",
      entity_type: "subscription",
      entity_id: subscription.id,
      entity_name: `Subscription for ${companyId}`,
      changes_json: body,
      status: "success",
    });

    return NextResponse.json(subscription);
  } catch (err) {
    console.error("Error updating subscription:", err);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
