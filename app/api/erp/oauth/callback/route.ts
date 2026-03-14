/**
 * OAuth Callback Handler for Xero/Sage Integration
 * 
 * SECURITY: Blocks demo/test tenants from being registered
 * 
 * This endpoint is called when user returns from Xero/Sage OAuth flow.
 * CRITICAL: We must detect and reject demo companies/organizations.
 * 
 * @route POST /api/erp/oauth/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';

/**
 * Demo tenant blocklist
 * Organizations matching these patterns are NOT allowed to sync
 */
const DEMO_TENANT_BLOCKLIST = [
  // Common demo organization names
  /demo/i,
  /test/i,
  /sandbox/i,
  /example/i,
  /sample/i,
  /trial/i,
  /staging/i,
  /dev/i,
  /development/i,
  /practice/i,
  /training/i,
];

/**
 * Detect if organization is a demo/test organization
 */
function isDemoOrganization(organizationName: string, platformDefaults?: any): boolean {
  // Check against blocklist
  for (const pattern of DEMO_TENANT_BLOCKLIST) {
    if (pattern.test(organizationName)) {
      console.warn(`[OAuthCallback] 🚫 BLOCKED: Demo organization detected: "${organizationName}"`);
      return true;
    }
  }

  // Check Xero-specific indicators
  if (platformDefaults?.shortCode === 'DEMO' || organizationName.includes('DEMO')) {
    return true;
  }

  // Check Sage-specific indicators
  if (platformDefaults?.sandbox === true) {
    return true;
  }

  return false;
}

/**
 * Determine organization environment (live, sandbox, demo)
 */
function detectEnvironment(
  platform: 'xero' | 'sage',
  organizationData: any
): 'live' | 'sandbox' | 'demo' {
  // Xero detection
  if (platform === 'xero') {
    // Xero returns organizationType in OAuth response
    if (organizationData.organizationType === 'DEMO') {
      return 'demo';
    }
    // Xero also returns shortCode which matches org ID
    // Short codes starting with specific patterns indicate sandbox
    if (organizationData.shortCode?.startsWith('!')) {
      return 'sandbox';
    }
  }

  // Sage detection
  if (platform === 'sage') {
    if (organizationData.sandbox === true) {
      return 'sandbox';
    }
  }

  // Check organization name for demo indicators
  const orgName = organizationData.shortName || organizationData.organizationName || '';
  if (isDemoOrganization(orgName, organizationData)) {
    return 'demo';
  }

  // Default to live if not detected as demo/sandbox
  return 'live';
}

export async function POST(request: NextRequest) {
  try {
    const { userId: providedUserId, platform, organizationData, accessToken, refreshToken, tenantId } = await request.json();

    // ========================================================================
    // LAYER 1: Extract and validate user context
    // ========================================================================
    const userId = providedUserId || resolveServerUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    if (!platform || !['xero', 'sage'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // ========================================================================
    // LAYER 2: CRITICAL - Detect organization environment
    // ========================================================================
    const environment = detectEnvironment(platform as 'xero' | 'sage', organizationData);

    console.log(
      `[OAuthCallback] Organization detected: "${organizationData.organizationName}" ` +
      `(Environment: ${environment}, Platform: ${platform})`
    );

    // ========================================================================
    // LAYER 3: HARD STOP - Block demo/sandbox organizations
    // ========================================================================
    if (environment === 'demo') {
      console.error(
        `[OAuthCallback] 🚫 BLOCKED: Cannot register demo organization "${organizationData.organizationName}". ` +
        `Only LIVE organizations can sync to accounting platforms.`
      );

      return NextResponse.json(
        {
          error: 'Demo organizations cannot sync to accounting platforms',
          reason: 'This appears to be a demo or test organization. Only live organizations are allowed to sync.',
          organization: organizationData.organizationName,
        },
        { status: 403 }
      );
    }

    // ========================================================================
    // LAYER 4: Extract company context from user's workspace
    // ========================================================================
    const { data: userData, error: userError } = await supabaseServer
      .from('auth.users')
      .select('user_metadata')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Failed to load user context' },
        { status: 500 }
      );
    }

    const companyId = userData.user_metadata?.companyId;
    if (!companyId) {
      return NextResponse.json(
        { error: 'No company context - user must select company first' },
        { status: 400 }
      );
    }

    // ========================================================================
    // LAYER 5: Verify company is LIVE (not demo)
    // ========================================================================
    const { data: company, error: companyError } = await supabaseServer
      .from('company_profiles')
      .select('id, is_demo, name')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    if (company.is_demo === true) {
      console.error(
        `[OAuthCallback] 🚫 BLOCKED: Attempt to register ERP for DEMO company "${company.name}"`
      );

      return NextResponse.json(
        {
          error: 'Cannot register ERP for demo companies',
          reason: 'ERP sync is only available for live companies.',
          company: company.name,
        },
        { status: 403 }
      );
    }

    // ========================================================================
    // LAYER 6: Register tenant with environment flag
    // ========================================================================
    const { data: tenant, error: tenantError } = await supabaseServer
      .from('tenants')
      .upsert(
        {
          user_id: userId,
          company_id: companyId,
          platform,
          external_org_id: tenantId || organizationData.orgId || organizationData.id,
          access_token: accessToken,
          refresh_token: refreshToken,
          organization_name: organizationData.organizationName,
          environment, // CRITICAL: Store detected environment
          is_active: true,
          last_sync_at: null,
        },
        {
          onConflict: 'user_id,company_id,platform',
        }
      )
      .select()
      .single();

    if (tenantError) {
      console.error('[OAuthCallback] Failed to register tenant:', tenantError);
      return NextResponse.json(
        { error: 'Failed to register ERP integration' },
        { status: 500 }
      );
    }

    // ========================================================================
    // LAYER 7: Log successful registration
    // ========================================================================
    console.log(
      `[OAuthCallback] ✅ SUCCESS: Registered ${platform} tenant ` +
      `(Company: ${companyId}, Environment: ${environment})`
    );

    // Audit log
    try {
      await supabaseServer
        .from('tenant_audit_logs')
        .insert({
          tenant_id: tenant.id,
          user_id: userId,
          action: 'oauth_registration',
          status: 'allowed',
          reason: `Registered ${environment} ${platform} organization`,
          metadata: JSON.stringify({
            organization: organizationData.organizationName,
            environment,
            platform,
            company_id: companyId,
          }),
        });
    } catch (err) {
      console.error('[OAuthCallback] Failed to log registration:', err);
      // Don't fail the registration if audit logging fails
    }

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        platform,
        organization: organizationData.organizationName,
        environment,
        company_id: companyId,
      },
      redirectUrl: `/dashboard?integration=${platform}`,
    });
  } catch (err) {
    console.error('[OAuthCallback] Exception during OAuth callback:', err);
    return NextResponse.json(
      { error: 'Internal server error during OAuth processing' },
      { status: 500 }
    );
  }
}
