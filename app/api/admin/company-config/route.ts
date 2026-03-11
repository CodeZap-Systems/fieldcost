/**
 * ADMIN API - Company Tier 3 Configuration
 * 
 * Manage Tier 3 settings per company (SLA, RBAC, currencies, workflows)
 */

import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export interface CompanyTier3Config {
  id: string;
  companyId: string;
  slaTier: 'gold' | 'platinum';
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: 'ZAR' | 'USD' | 'EUR';
  supportedCurrencies: Array<'ZAR' | 'USD' | 'EUR'>;
  maxActiveProjects: number;
  maxUsers: number;
  parentCompanyId?: string;
  registrationNumber: string;
  enabledFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    // Mock data - in production fetch from database
    const sampleConfig: CompanyTier3Config = {
      id: companyId || 'demo-001',
      companyId: companyId || 'demo-001',
      slaTier: 'platinum',
      supportEmail: 'support@company.com',
      supportPhone: '+27 11 234 5678',
      defaultCurrency: 'ZAR',
      supportedCurrencies: ['ZAR', 'USD', 'EUR'],
      maxActiveProjects: 50,
      maxUsers: 500,
      registrationNumber: 'CC2024000123',
      enabledFeatures: [
        'multiCompany',
        'multiCurrency',
        'gpsTracking',
        'photoEvidence',
        'offlineSync',
        'fieldRoleRBAC',
        'auditTrails',
        'customWorkflows',
        'miningWorkflows',
        'dedicatedSupport',
        'apiAccess',
        'wipTracking',
        'advancedReporting',
      ],
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ config: sampleConfig });
  } catch (error) {
    console.error('Company config GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch configuration' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      companyId,
      slaTier,
      supportEmail,
      supportPhone,
      defaultCurrency,
      supportedCurrencies,
      maxActiveProjects,
      maxUsers,
      parentCompanyId,
      registrationNumber,
      enabledFeatures,
    } = body;

    if (!companyId) {
      return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    }

    // In production, update the database
    // await supabase
    //   .from('tier3_companies')
    //   .update({
    //     sla_tier: slaTier,
    //     support_email: supportEmail,
    //     support_phone: supportPhone,
    //     default_currency: defaultCurrency,
    //     supported_currencies: supportedCurrencies,
    //     max_active_projects: maxActiveProjects,
    //     max_users: maxUsers,
    //     parent_company_id: parentCompanyId,
    //     registration_number: registrationNumber,
    //     enabled_features: enabledFeatures,
    //   })
    //   .eq('company_id', companyId);

    return NextResponse.json({
      success: true,
      message: 'Company configuration updated successfully',
    });
  } catch (error) {
    console.error('Company config PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 });
  }
}
