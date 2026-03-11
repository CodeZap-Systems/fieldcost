/**
 * ADMIN API - Tier 3 Features Management
 * 
 * Manage which Tier 3 features are available per plan
 */

import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const TIER3_FEATURES = [
      { key: 'multiCompany', name: 'Multi-Company Set Up', category: 'core', default: true },
      { key: 'multiCurrency', name: 'Multi-Currency (ZAR/USD/EUR)', category: 'core', default: true },
      { key: 'gpsTracking', name: 'GPS Tracking & Geolocation', category: 'core', default: true },
      { key: 'photoEvidence', name: 'Legal Photo Evidence Chain', category: 'core', default: true },
      { key: 'offlineSync', name: 'Offline Mobile Sync', category: 'core', default: true },
      { key: 'fieldRoleRBAC', name: '6-Role RBAC (30+ Permissions)', category: 'core', default: true },
      { key: 'auditTrails', name: 'Complete Audit Trails', category: 'core', default: true },
      { key: 'customWorkflows', name: 'Custom Workflow Builder', category: 'advanced', default: true },
      { key: 'miningWorkflows', name: 'Mining-Specific Workflows', category: 'advanced', default: true },
      { key: 'dedicatedSupport', name: 'Dedicated Support + SLA', category: 'advanced', default: true },
      { key: 'apiAccess', name: 'REST API Access (7 endpoints)', category: 'integration', default: true },
      { key: 'wipTracking', name: 'Live WIP Tracking & Reporting', category: 'advanced', default: true },
      { key: 'advancedReporting', name: 'Advanced Financial Reporting', category: 'advanced', default: true },
    ];

    return NextResponse.json({ features: TIER3_FEATURES });
  } catch (error) {
    console.error('Tier 3 features GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { planId, featureKey, isEnabled } = body;

    if (!planId || !featureKey || isEnabled === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: planId, featureKey, isEnabled" },
        { status: 400 }
      );
    }

    // In production, this would update the database
    // await supabase
    //   .from('plan_features')
    //   .upsert({
    //     plan_id: planId,
    //     feature_key: featureKey,
    //     is_enabled: isEnabled,
    //   });

    return NextResponse.json({
      success: true,
      message: `Feature ${featureKey} ${isEnabled ? 'enabled' : 'disabled'} for plan`,
    });
  } catch (error) {
    console.error('Tier 3 features POST error:', error);
    return NextResponse.json({ error: 'Failed to update features' }, { status: 500 });
  }
}
