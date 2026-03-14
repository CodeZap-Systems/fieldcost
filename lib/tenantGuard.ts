/**
 * Tenant Guard - Central enforcement point for multi-platform ERP isolation
 * 
 * This module provides guard functions to ensure:
 * 1. Only LIVE tenants can sync to accounting platforms
 * 2. Demo/sandbox tenants are blocked at the earliest point
 * 3. All sync attempts are logged for audit trails
 * 4. GDPR/POPIA compliance is maintained
 * 
 * Usage:
 * ```typescript
 * const tenant = await getTenant(userId, platform);
 * if (!isLiveTenant(tenant)) {
 *   return 403; // Hard stop - no demo sync allowed
 * }
 * ```
 */

import { supabaseServer } from './supabaseServer';

/**
 * Tenant interface matches database schema
 */
export interface Tenant {
  id: string;
  company_id: number;
  user_id: string;
  platform: 'sage' | 'xero';
  external_org_id: string;
  environment: 'demo' | 'sandbox' | 'live';
  access_token: string;
  refresh_token?: string;
  token_expires_at?: string;
  last_sync_at?: string;
  organization_name?: string;
  is_active: boolean;
}

/**
 * Fetch tenant by user, company, and platform
 * 
 * @throws Error if tenant not found
 */
export async function getTenant(
  userId: string,
  companyId: number,
  platform: 'sage' | 'xero'
): Promise<Tenant | null> {
  try {
    const { data: tenant, error } = await supabaseServer
      .from('tenants')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .eq('platform', platform)
      .single();

    if (error) {
      console.error(`[TenantGuard] Failed to fetch tenant: ${error.message}`);
      return null;
    }

    return tenant as Tenant;
  } catch (err) {
    console.error(`[TenantGuard] Exception fetching tenant:`, err);
    return null;
  }
}

/**
 * Check if tenant is in LIVE environment
 * 
 * This is the PRIMARY guard function. A tenant MUST pass this check
 * before ANY sync operation is allowed.
 * 
 * @returns true if environment is 'live', false otherwise
 */
export function isLiveTenant(tenant: Tenant | null): boolean {
  if (!tenant) {
    console.warn(`[TenantGuard] No tenant found - sync blocked`);
    return false;
  }

  if (tenant.environment !== 'live') {
    console.warn(
      `[TenantGuard] BLOCKED: Sync attempt on ${tenant.environment} tenant ` +
      `(Platform: ${tenant.platform}, Company: ${tenant.company_id})`
    );
    return false;
  }

  if (!tenant.is_active) {
    console.warn(
      `[TenantGuard] BLOCKED: Sync attempt on inactive tenant ` +
      `(Platform: ${tenant.platform}, Company: ${tenant.company_id})`
    );
    return false;
  }

  return true;
}

/**
 * Log tenant access attempt for audit trail
 */
export async function logTenantAccess(
  tenantId: string,
  userId: string,
  action: string,
  status: 'allowed' | 'blocked',
  reason?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabaseServer
      .from('tenant_audit_logs')
      .insert({
        tenant_id: tenantId,
        user_id: userId,
        action,
        status,
        reason,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
  } catch (err) {
    console.error(`[TenantGuard] Failed to log tenant access:`, err);
    // Don't throw - audit logging should not fail the operation
  }
}

/**
 * Update tenant sync status
 */
export async function updateTenantSyncStatus(
  tenantId: string,
  status: 'in_progress' | 'success' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const update: any = {
      sync_status: status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'success') {
      update.last_sync_at = new Date().toISOString();
      update.sync_error_message = null;
    } else if (status === 'failed' && errorMessage) {
      update.sync_error_message = errorMessage;
    }

    await supabaseServer
      .from('tenants')
      .update(update)
      .eq('id', tenantId);
  } catch (err) {
    console.error(`[TenantGuard] Failed to update tenant sync status:`, err);
  }
}

/**
 * Verify tenant exists and user owns it
 * Returns tenant if valid, null if not found or user doesn't own it
 */
export async function verifyTenantOwnership(
  userId: string,
  tenantId: string
): Promise<Tenant | null> {
  try {
    const { data: tenant, error } = await supabaseServer
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .eq('user_id', userId)
      .single();

    if (error || !tenant) {
      return null;
    }

    return tenant as Tenant;
  } catch (err) {
    console.error(`[TenantGuard] Exception verifying tenant ownership:`, err);
    return null;
  }
}

/**
 * Get all live tenants for a user (for multi-platform sync)
 */
export async function getLiveTenants(userId: string): Promise<Tenant[]> {
  try {
    const { data: tenants, error } = await supabaseServer
      .from('tenants')
      .select('*')
      .eq('user_id', userId)
      .eq('environment', 'live')
      .eq('is_active', true);

    if (error) {
      console.error(`[TenantGuard] Failed to fetch live tenants: ${error.message}`);
      return [];
    }

    return (tenants || []) as Tenant[];
  } catch (err) {
    console.error(`[TenantGuard] Exception fetching live tenants:`, err);
    return [];
  }
}

/**
 * Check if tenant needs token refresh
 */
export function tokenNeedsRefresh(tenant: Tenant): boolean {
  if (!tenant.token_expires_at) {
    return false;
  }

  const expiresAt = new Date(tenant.token_expires_at);
  const now = new Date();
  const minutesUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60);

  // Refresh if less than 5 minutes remaining
  return minutesUntilExpiry < 5;
}

/**
 * Update tenant tokens after refresh
 */
export async function updateTenantTokens(
  tenantId: string,
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number
): Promise<void> {
  try {
    const update: any = {
      access_token: accessToken,
      updated_at: new Date().toISOString(),
    };

    if (refreshToken) {
      update.refresh_token = refreshToken;
    }

    if (expiresIn) {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
      update.token_expires_at = expiresAt.toISOString();
    }

    await supabaseServer
      .from('tenants')
      .update(update)
      .eq('id', tenantId);
  } catch (err) {
    console.error(`[TenantGuard] Failed to update tenant tokens:`, err);
  }
}
