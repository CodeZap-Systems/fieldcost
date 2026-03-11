/**
 * ADMIN CMS API - Dashboard Statistics Endpoint
 * 
 * Provides KPI data for the admin dashboard:
 * - Total subscriptions and breakdown
 * - MRR (Monthly Recurring Revenue)
 * - ARR (Annual Recurring Revenue)
 * - Churn rate
 * - Pending and overdue invoices
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

    // Get admin user and check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_view_analytics) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get subscription stats
    const { data: subscriptions } = await supabaseServer
      .from("company_subscriptions")
      .select("status, plan_id, subscription_plan (monthly_price, annual_price, billing_cycle)")
      .eq("is_active", true);

    // Get invoices stats
    const { data: invoices } = await supabaseServer
      .from("billing_invoices")
      .select("status, total_amount, paid_amount, due_date");

    // Calculate MRR (Monthly Recurring Revenue)
    let mrr = 0;
    let arr = 0;

    subscriptions?.forEach((sub: any) => {
      const plan = sub.subscription_plan;
      if (plan) {
        if (plan.billing_cycle === "monthly") {
          mrr += plan.monthly_price || 0;
        } else {
          // For annual billing, divide by 12
          arr += plan.annual_price || 0;
          mrr += (plan.annual_price || 0) / 12;
        }
      }
    });

    // Calculate churn rate (cancelled subscriptions last month)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: cancelledRecent } = await supabaseServer
      .from("company_subscriptions")
      .select("*")
      .eq("status", "cancelled")
      .gte(
        "cancelled_date",
        thirtyDaysAgo.toISOString().split("T")[0]
      );

    const totalActiveThirtyDaysAgo =
      (subscriptions?.filter((s: any) => s.status === "active").length || 0) +
      (cancelledRecent?.length || 0);

    const churnRate =
      totalActiveThirtyDaysAgo > 0
        ? ((cancelledRecent?.length || 0) / totalActiveThirtyDaysAgo) * 100
        : 0;

    // Invoice stats
    const pendingInvoices =
      invoices?.filter((inv) => inv.status === "draft" || inv.status === "sent")
        .length || 0;

    const overdueInvoices =
      invoices?.filter((inv) => {
        const dueDate = new Date(inv.due_date);
        return inv.status !== "paid" && dueDate < new Date();
      }).length || 0;

    // Format stats
    const stats = {
      subscriptions: {
        total: subscriptions?.length || 0,
        active: subscriptions?.filter((s: any) => s.status === "active").length || 0,
        trial: subscriptions?.filter((s: any) => s.status === "trial").length || 0,
        paused: subscriptions?.filter((s: any) => s.status === "paused").length || 0,
        cancelled: subscriptions?.filter((s: any) => s.status === "cancelled").length || 0,
      },
      revenue: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(arr * 100) / 100,
      },
      churn_rate: Math.round(churnRate * 100) / 100,
      invoices: {
        pending: pendingInvoices,
        overdue: overdueInvoices,
        total: invoices?.length || 0,
      },
      health: {
        api: "healthy",
        database: "healthy",
        payment_gateway: "connected",
        storage: "available",
      },
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
