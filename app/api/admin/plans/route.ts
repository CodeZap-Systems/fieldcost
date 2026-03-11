/**
 * API: Subscription Plans Management
 * POST /api/admin/plans - Create plan
 * GET /api/admin/plans - List plans
 * GET /api/admin/plans/:id - Get plan details
 * PATCH /api/admin/plans/:id - Update plan
 * DELETE /api/admin/plans/:id - Delete plan (soft delete)
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { resolveServerUserId } from "@/lib/serverUser";
import { SubscriptionPlan, CreatePlanInput } from "@/lib/cms-types";

// Middleware to check admin access
async function requireAdmin(request: NextRequest) {
  const userId = await resolveServerUserId();
  if (!userId) {
    return { error: "Unauthorized", status: 401 };
  }

  // Check if user is admin
  const { data: admin, error } = await supabaseServer
    .from("admin_users")
    .select("id, role, can_manage_plans")
    .eq("user_id", userId)
    .single();

  if (error || !admin || !admin.can_manage_plans) {
    return { error: "Insufficient permissions", status: 403 };
  }

  return { admin, userId };
}

// ============================================================================
// GET /api/admin/plans - List all subscription plans
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Get all plans
    const { data: plans, error } = await supabaseServer
      .from("subscription_plans")
      .select(
        `*,
         plan_features (*)
        `
      )
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      plans: plans || [],
      total: plans?.length || 0,
    });
  } catch (err) {
    console.error("Error fetching plans:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/admin/plans - Create new subscription plan
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = (await request.json()) as CreatePlanInput;

    // Validate required fields
    if (!body.name || !body.tier_level || body.monthly_price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create plan
    const { data: plan, error } = await supabaseServer
      .from("subscription_plans")
      .insert({
        name: body.name,
        tier_level: body.tier_level,
        description: body.description,
        monthly_price: body.monthly_price,
        annual_price: body.annual_price,
        setup_fee: body.setup_fee || 0,
        max_projects: body.max_projects,
        max_tasks: body.max_tasks,
        max_team_members: body.max_team_members,
        max_invoices: body.max_invoices,
        max_storage_gb: body.max_storage_gb,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "create",
      entity_type: "plan",
      entity_id: plan.id,
      entity_name: plan.name,
      changes_json: body,
      status: "success",
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (err) {
    console.error("Error creating plan:", err);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH /api/admin/plans/:id - Update subscription plan
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const planId = request.nextUrl.searchParams.get("id");
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Update plan
    const { data: plan, error } = await supabaseServer
      .from("subscription_plans")
      .update(body)
      .eq("id", planId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "update",
      entity_type: "plan",
      entity_id: planId,
      entity_name: plan.name,
      changes_json: body,
      status: "success",
    });

    return NextResponse.json(plan);
  } catch (err) {
    console.error("Error updating plan:", err);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE /api/admin/plans/:id - Deactivate plan
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const planId = request.nextUrl.searchParams.get("id");
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID required" },
        { status: 400 }
      );
    }

    // Soft delete by setting is_active to false
    const { data: plan, error } = await supabaseServer
      .from("subscription_plans")
      .update({ is_active: false })
      .eq("id", planId)
      .select()
      .single();

    if (error) throw error;

    // Log audit
    await supabaseServer.from("admin_audit_logs").insert({
      admin_id: auth.admin.id,
      admin_name: auth.userId,
      action: "delete",
      entity_type: "plan",
      entity_id: planId,
      entity_name: plan.name,
      status: "success",
    });

    return NextResponse.json({ message: "Plan deactivated" });
  } catch (err) {
    console.error("Error deleting plan:", err);
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
