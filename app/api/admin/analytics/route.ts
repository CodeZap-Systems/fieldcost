/**
 * ADMIN CMS API - Analytics Endpoint
 * 
 * Provides subscription analytics and business metrics
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
    const range = searchParams.get("range") || "12m";

    // Check permissions
    const { data: adminUser } = await supabaseServer
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!adminUser || !adminUser.can_view_analytics) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get date range
    const now = new Date();
    let startDate = new Date();
    switch (range) {
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "12m":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "all":
        startDate.setFullYear(2000);
        break;
    }

    // Get subscription analytics
    const { data: subscriptions } = await supabaseServer
      .from("company_subscriptions")
      .select("id, plan_id, status, subscription_plan (tier_level, monthly_price, annual_price, billing_cycle), created_at");

    // Get invoices
    const { data: invoices } = await supabaseServer
      .from("billing_invoices")
      .select("*")
      .gte("created_at", startDate.toISOString());

    // Calculate metrics
    let mrr = 0;
    let arr = 0;

    subscriptions?.forEach((sub: any) => {
      if (sub.status === "active" || sub.status === "trial") {
        const plan = sub.subscription_plan;
        if (plan) {
          if (plan.billing_cycle === "monthly") {
            mrr += plan.monthly_price || 0;
          } else {
            arr += plan.annual_price || 0;
            mrr += (plan.annual_price || 0) / 12;
          }
        }
      }
    });

    // Calculate churn
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: cancelledRecent } = await supabaseServer
      .from("company_subscriptions")
      .select("*")
      .eq("status", "cancelled")
      .gte("cancelled_date", thirtyDaysAgo.toISOString());

    const totalActiveThirtyDaysAgo =
      (subscriptions?.filter((s: any) => s.status === "active").length || 0) +
      (cancelledRecent?.length || 0);

    const churnRate =
      totalActiveThirtyDaysAgo > 0
        ? ((cancelledRecent?.length || 0) / totalActiveThirtyDaysAgo) * 100
        : 0;

    // Build monthly subscription growth
    const subscriptionGrowth: Array<{ month: string; subscriptions: number }> = [];
    const currentMonth = new Date();
    for (let i = 11; i >= 0; i--) {
      const month = new Date(currentMonth);
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().substring(0, 7);

      const monthSubs = subscriptions?.filter((s: any) => {
        const createdMonth = new Date(s.created_at).toISOString().substring(0, 7);
        return createdMonth <= monthStr;
      }).length || 0;

      subscriptionGrowth.push({
        month: monthStr,
        subscriptions: monthSubs,
      });
    }

    // Customer breakdown by tier
    const tiers = ["1", "2", "3"];
    const customerBreakdown = tiers.map((tier) => {
      const tierSubs = subscriptions?.filter((s: any) => {
        const plan = s.subscription_plan;
        return plan && String(plan.tier_level) === tier && s.status === "active";
      });

      let tierMrr = 0;
      tierSubs?.forEach((sub: any) => {
        const plan = sub.subscription_plan;
        if (plan) {
          if (plan.billing_cycle === "monthly") {
            tierMrr += plan.monthly_price || 0;
          } else {
            tierMrr += (plan.annual_price || 0) / 12;
          }
        }
      });

      return {
        tier: `Tier ${tier}`,
        count: tierSubs?.length || 0,
        mrr: tierMrr,
      };
    });

    // Revenue trend
    const revenueTrend: Array<{ month: string; mrr: number; arr: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().substring(0, 7);

      const monthSubs = subscriptions?.filter((s: any) => {
        const createdMonth = new Date(s.created_at).toISOString().substring(0, 7);
        return createdMonth <= monthStr && s.status === "active";
      });

      let monthMrr = 0;
      let monthArr = 0;
      monthSubs?.forEach((sub: any) => {
        const plan = sub.subscription_plan;
        if (plan) {
          if (plan.billing_cycle === "monthly") {
            monthMrr += plan.monthly_price || 0;
          } else {
            monthArr += plan.annual_price || 0;
            monthMrr += (plan.annual_price || 0) / 12;
          }
        }
      });

      revenueTrend.push({
        month: monthStr,
        mrr: Math.round(monthMrr * 100) / 100,
        arr: Math.round(monthArr * 100) / 100,
      });
    }

    // Cohort retention (simplified - previous 6 months)
    const cohortRetention: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthStr = month.toISOString().substring(0, 7);

      const cohortSubs = subscriptions?.filter((s: any) => {
        const createdMonth = new Date(s.created_at).toISOString().substring(0, 7);
        return createdMonth === monthStr;
      }).length || 1;

      const cohortRetained = subscriptions?.filter((s: any) => {
        const createdMonth = new Date(s.created_at).toISOString().substring(0, 7);
        return (
          createdMonth === monthStr && 
          (s.status === "active" || s.status === "trial")
        );
      }).length || 0;

      cohortRetention[monthStr] = (cohortRetained / Math.max(cohortSubs, 1)) * 100;
    }

    const analytics = {
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(arr * 100) / 100,
      churn_rate: Math.round(churnRate * 100) / 100,
      subscription_growth: subscriptionGrowth,
      revenue_trend: revenueTrend,
      customer_breakdown: customerBreakdown,
      cohort_retention: cohortRetention,
    };

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error: any) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
