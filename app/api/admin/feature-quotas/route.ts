/**
 * ADMIN API - Feature Quotas Management
 * 
 * Manage feature usage limits per company
 */

import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export interface FeatureQuota {
  id: string;
  companyId: string;
  featureKey: string;
  maxUsage: number;
  currentUsage: number;
  resetPeriod: 'monthly' | 'yearly' | 'never';
  lastResetAt?: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    // Mock data - in production fetch from database
    const sampleQuotas: FeatureQuota[] = companyId ? [
      {
        id: '1',
        companyId,
        featureKey: 'apiCalls',
        maxUsage: 100000,
        currentUsage: 45230,
        resetPeriod: 'monthly',
        lastResetAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        companyId,
        featureKey: 'photoStorage',
        maxUsage: 500,
        currentUsage: 287,
        resetPeriod: 'never',
      },
      {
        id: '3',
        companyId,
        featureKey: 'customWorkflows',
        maxUsage: 50,
        currentUsage: 12,
        resetPeriod: 'never',
      },
      {
        id: '4',
        companyId,
        featureKey: 'gpsLocations',
        maxUsage: 1000000,
        currentUsage: 567890,
        resetPeriod: 'monthly',
      },
    ] : [];

    return NextResponse.json({ quotas: sampleQuotas });
  } catch (error) {
    console.error('Feature quotas GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotas' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { quotaId, maxUsage, resetPeriod } = body;

    if (!quotaId) {
      return NextResponse.json({ error: "Missing quotaId" }, { status: 400 });
    }

    // In production, update the database
    // await supabase
    //   .from('feature_quotas')
    //   .update({ max_usage: maxUsage, reset_period: resetPeriod })
    //   .eq('id', quotaId);

    return NextResponse.json({
      success: true,
      message: 'Quota updated successfully',
    });
  } catch (error) {
    console.error('Feature quotas PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update quota' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { companyId, featureKey, maxUsage, resetPeriod } = body;

    if (!companyId || !featureKey || !maxUsage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, insert into database
    // await supabase
    //   .from('feature_quotas')
    //   .insert({
    //     company_id: companyId,
    //     feature_key: featureKey,
    //     max_usage: maxUsage,
    //     reset_period: resetPeriod || 'monthly',
    //   });

    return NextResponse.json({
      success: true,
      message: 'Quota created successfully',
    });
  } catch (error) {
    console.error('Feature quotas POST error:', error);
    return NextResponse.json({ error: 'Failed to create quota' }, { status: 500 });
  }
}
