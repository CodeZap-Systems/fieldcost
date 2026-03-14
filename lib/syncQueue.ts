/**
 * Sync Queue Processor
 * 
 * CRITICAL: Central enforcement point for ERP sync jobs
 * 
 * SECURITY PRINCIPLES:
 * 1. All sync jobs MUST check tenant.environment === 'live' BEFORE execution
 * 2. Demo/sandbox tenants are ALWAYS skipped - no exceptions
 * 3. Every job is logged for audit trail (GDPR/POPIA compliance)
 * 4. Token verification happens with tenant_id + environment scoping
 */

import { supabaseServer } from './supabaseServer';
import { getTenant, isLiveTenant, logTenantAccess, updateTenantSyncStatus } from './tenantGuard';
import { createXeroInvoice, type XeroInvoicePayload } from './xeroClient';
import { createSageInvoice, type SageInvoicePayload } from './sageOneClient';

export interface SyncJob {
  id: string;
  tenant_id: string;
  user_id: string;
  company_id: number;
  job_type: 'invoice' | 'journal' | 'payment' | 'expense';
  platform: 'sage' | 'xero';
  payload: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

/**
 * Main sync job processor
 * 
 * This is the CENTRAL GUARD for all ERP sync operations.
 * No sync job reaches the platform without passing this gate.
 */
export async function processSyncJob(job: SyncJob): Promise<void> {
  try {
    console.log(`[SyncQueue] Processing job ${job.id} (${job.job_type} → ${job.platform})`);

    // ========================================================================
    // LAYER 1: FETCH TENANT & VERIFY ENVIRONMENT (CRITICAL)
    // ========================================================================
    const tenant = await getTenant(job.user_id, job.company_id, job.platform);

    if (!isLiveTenant(tenant)) {
      const reason = !tenant
        ? `Tenant not configured for ${job.platform}`
        : `Cannot sync from ${tenant.environment} environment`;

      console.warn(`[SyncQueue] 🚫 BLOCKED: ${reason} (Job: ${job.id})`);

      // Mark job as skipped (not error - this is expected for demo jobs)
      await updateJobStatus(job.id, 'skipped', `Demo/sandbox blocked: ${reason}`);

      // Log blocked attempt for audit
      if (tenant) {
        await logTenantAccess(
          tenant.id,
          job.user_id,
          `sync_job_${job.job_type}`,
          'blocked',
          reason,
          { job_id: job.id, platform: job.platform }
        );
      }

      return;
    }

    // ========================================================================
    // LAYER 2: VERIFY TENANT IS ACTIVE & NOT DELETED
    // ========================================================================
    if (!tenant.is_active) {
      console.warn(`[SyncQueue] 🚫 BLOCKED: Inactive tenant (Job: ${job.id})`);
      await updateJobStatus(job.id, 'skipped', 'Tenant inactive');
      return;
    }

    // ========================================================================
    // LAYER 3: VERIFY TOKEN IS VALID & NOT EXPIRED
    // ========================================================================
    if (!tenant.access_token) {
      console.error(`[SyncQueue] 🚫 BLOCKED: No access token (Job: ${job.id})`);
      await updateJobStatus(job.id, 'failed', 'Missing access token');

      await logTenantAccess(
        tenant.id,
        job.user_id,
        `sync_job_${job.job_type}`,
        'blocked',
        'Missing access token',
        { job_id: job.id }
      );
      return;
    }

    // Check token expiration
    if (tenant.token_expires_at) {
      const expiresAt = new Date(tenant.token_expires_at);
      if (expiresAt < new Date()) {
        console.warn(`[SyncQueue] 🚫 BLOCKED: Token expired (Job: ${job.id})`);
        await updateJobStatus(job.id, 'failed', 'Access token expired');

        await logTenantAccess(
          tenant.id,
          job.user_id,
          `sync_job_${job.job_type}`,
          'blocked',
          'Token expired',
          { job_id: job.id, expires_at: tenant.token_expires_at }
        );
        return;
      }
    }

    // ========================================================================
    // LAYER 4: EXECUTE SYNC BASED ON PLATFORM & JOB TYPE
    // ========================================================================
    await updateJobStatus(job.id, 'processing');

    try {
      let result: any;

      if (job.platform === 'xero') {
        result = await processXeroSync(job, tenant);
      } else if (job.platform === 'sage') {
        result = await processSageSync(job, tenant);
      } else {
        throw new Error(`Unknown platform: ${job.platform}`);
      }

      // ====================================================================
      // LAYER 5: MARK SUCCESSFUL & LOG
      // ====================================================================
      await updateJobStatus(job.id, 'completed');
      await updateTenantSyncStatus(tenant.id, 'success');

      await logTenantAccess(
        tenant.id,
        job.user_id,
        `sync_job_${job.job_type}`,
        'allowed',
        `Successfully synced ${job.job_type}`,
        { job_id: job.id, result }
      );

      console.log(`[SyncQueue] ✅ Success: Job ${job.id} completed (${job.platform})`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      await updateJobStatus(job.id, 'failed', errorMessage);
      await updateTenantSyncStatus(tenant.id, 'failed', errorMessage);

      await logTenantAccess(
        tenant.id,
        job.user_id,
        `sync_job_${job.job_type}`,
        'blocked',
        `Sync failed: ${errorMessage}`,
        { job_id: job.id, error: errorMessage }
      );

      console.error(`[SyncQueue] ❌ Failed: Job ${job.id}`, err);
      throw err;
    }
  } catch (err) {
    console.error(`[SyncQueue] FATAL: Job ${job.id} processing failed`, err);
    await updateJobStatus(
      job.id,
      'failed',
      err instanceof Error ? err.message : 'Unknown error'
    );
  }
}

/**
 * Process Xero sync with tenant token scoped to this tenant+environment
 */
async function processXeroSync(job: SyncJob, tenant: any): Promise<any> {
  console.log(`[SyncQueue] Processing Xero ${job.job_type} (Tenant: ${tenant.id})`);

  switch (job.job_type) {
    case 'invoice':
      return await createXeroInvoice(
        job.payload as XeroInvoicePayload,
        tenant.access_token,  // Token scoped to this tenant
        tenant.external_org_id  // Xero tenant ID
      );

    case 'journal':
      // Implement journal entry for Xero
      throw new Error('Xero journal entries not yet implemented');

    case 'payment':
      // Implement payment for Xero
      throw new Error('Xero payments not yet implemented');

    case 'expense':
      // Implement expense for Xero
      throw new Error('Xero expenses not yet implemented');

    default:
      throw new Error(`Unknown job type: ${job.job_type}`);
  }
}

/**
 * Process Sage sync with tenant token scoped to this tenant+environment
 */
async function processSageSync(job: SyncJob, tenant: any): Promise<any> {
  console.log(`[SyncQueue] Processing Sage ${job.job_type} (Tenant: ${tenant.id})`);

  switch (job.job_type) {
    case 'invoice':
      return await createSageInvoice(
        job.payload as SageInvoicePayload,
        tenant.access_token,  // Token scoped to this tenant
      );

    case 'journal':
      // Implement journal entry for Sage
      throw new Error('Sage journal entries not yet implemented');

    case 'payment':
      // Implement payment for Sage
      throw new Error('Sage payments not yet implemented');

    case 'expense':
      // Implement expense for Sage
      throw new Error('Sage expenses not yet implemented');

    default:
      throw new Error(`Unknown job type: ${job.job_type}`);
  }
}

/**
 * Update job status in database
 */
export async function updateJobStatus(
  jobId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped',
  errorMessage?: string
): Promise<void> {
  try {
    const update: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'completed' || status === 'skipped') {
      update.processed_at = new Date().toISOString();
    }

    if (errorMessage) {
      update.error_message = errorMessage;
    }

    await supabaseServer
      .from('sync_jobs')
      .update(update)
      .eq('id', jobId);
  } catch (err) {
    console.error(`[SyncQueue] Failed to update job ${jobId}:`, err);
  }
}

/**
 * Queue a new sync job
 */
export async function queueSyncJob(
  userId: string,
  companyId: number,
  platform: 'sage' | 'xero',
  jobType: 'invoice' | 'journal' | 'payment' | 'expense',
  payload: Record<string, any>
): Promise<string | null> {
  try {
    const { data, error } = await supabaseServer
      .from('sync_jobs')
      .insert({
        user_id: userId,
        company_id: companyId,
        platform,
        job_type: jobType,
        payload,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error(`[SyncQueue] Failed to queue job:`, error);
      return null;
    }

    return data?.id ?? null;
  } catch (err) {
    console.error(`[SyncQueue] Exception queueing job:`, err);
    return null;
  }
}
