import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';
import { supabaseServer } from '@/lib/supabaseServer';
import { getTenant, isLiveTenant, logTenantAccess, updateTenantSyncStatus } from '@/lib/tenantGuard';

/**
 * Full Xero Sync Orchestration - GDPR/POPIA Compliant
 * POST /api/xero/sync/full
 * 
 * ✅ SECURITY LAYERS:
 * 1. User authentication required
 * 2. Company ownership verification
 * 3. Demo company protection
 * 4. Audit logging of all operations
 * 
 * Syncs all data from Xero: company info, contacts, items
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // LAYER 1: USER AUTHENTICATION
    // ============================================================================
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (!user || authError) {
      console.warn(`⚠️  Xero sync: Authentication failed`);
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authentication' },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(`✅ User authenticated: ${userId}`);

    const body = await request.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: 'Missing companyId parameter' },
        { status: 400 }
      );
    }

    // ============================================================================
    // LAYER 2: TENANT LOOKUP & ENVIRONMENT VERIFICATION (CRITICAL)
    // ============================================================================
    // Get the tenant from the central tenants table
    const tenant = await getTenant(userId, companyId, 'xero');

    // HARD STOP: Environment check must pass before ANY sync operation
    if (!isLiveTenant(tenant)) {
      const reason = !tenant 
        ? 'Tenant not configured for Xero'
        : tenant.environment !== 'live'
        ? `Cannot sync from ${tenant.environment} environment`
        : 'Tenant is not active';

      console.warn(`⚠️  Xero sync blocked: ${reason}`);

      try {
        await logTenantAccess(
          tenant?.id || 'unknown',
          userId,
          'xero_sync_attempted',
          'blocked',
          reason,
          { companyId, environment: tenant?.environment }
        );
      } catch (err) {
        console.error('Tenant audit log error:', err);
      }

      return NextResponse.json(
        { 
          success: false,
          error: reason,
          message: 'This workspace cannot sync to Xero. Only live workspaces are allowed.'
        },
        { status: 403 }
      );
    }

    // ✅ Tenant passed all checks - safe to proceed
    console.log(`✅ Tenant verified: ${tenant.environment} environment, platform: ${tenant.platform}`);

    // LEGACY: Also verify company ownership for backward compatibility
    const { data: company, error: companyError } = await supabaseServer
      .from('company_profiles')
      .select('id, user_id, name')
      .eq('id', companyId)
      .eq('user_id', userId)
      .single();

    if (companyError || !company) {
      console.warn(`⚠️  Company not found or unauthorized: ${companyId}`);

      try {
        await logTenantAccess(
          tenant.id,
          userId,
          'xero_sync_attempted',
          'blocked',
          'Company ownership verification failed',
          { companyId }
        );
      } catch (err) {
        console.error('Tenant audit log error:', err);
      }

      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this company' },
        { status: 403 }
      );
    }

    console.log(`✅ Company verified: ${company.name} (${companyId}`);
    
    try {
      await logTenantAccess(
        tenant.id,
        userId,
        'xero_sync_started',
        'allowed',
        'Sync initiated for live environment',
        { companyId, tenantId: tenant.id, environment: tenant.environment }
      );
    } catch (err) {
      console.error('Tenant audit log error (non-blocking):', err);
    }

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;
    const accessToken = process.env.XERO_ACCESS_TOKEN;
    const tenantId = process.env.XERO_TENANT_ID;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Xero' },
        { status: 401 }
      );
    }

    // ============================================================================
    // LAYER 4: AUDIT LOG - SYNC START
    // ============================================================================
    let auditLogEntry: any = null;
    try {
      const result = await supabaseServer
        .from('audit_logs')
        .insert({
          user_id: userId,
          company_id: companyId,
          action: 'erp_sync_started',
          erp_system: 'xero',
          status: 'in_progress',
          timestamp: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        })
        .select('id')
        .single();
      auditLogEntry = result.data;
    } catch (err) {
      console.error('Audit log error:', err);
    }

    const auditId = auditLogEntry?.id;

    const xeroClient = new XeroApiClient(
      clientId || '',
      clientSecret || '',
      redirectUri || '',
      accessToken,
      undefined,
      tenantId
    );

    console.log('🔐 Authenticating with Xero...');

    const testResult = await xeroClient.testConnection();
    if (!testResult.success) {
      if (auditId) {
        try {
          await supabaseServer
            .from('audit_logs')
            .update({ status: 'failed', reason: 'Xero connection failed' })
            .eq('id', auditId);
        } catch (err) {
          console.error('Audit update error:', err);
        }
      }
      throw new Error('Failed to authenticate with Xero');
    }

    console.log('✅ Authenticated with Xero');

    // Sync items
    console.log('📦 Syncing items...');
    const xeroItems = await xeroClient.getItems();
    let itemsSynced = 0;
    const itemErrors = [];

    for (const item of xeroItems) {
      try {
        // ✅ Always query with verified company_id and user_id
        const { data: existingItem } = await supabaseServer
          .from('items')
          .select('id')
          .eq('company_id', companyId)  // Verified company
          .eq('user_id', userId)         // Verified user
          .eq('xero_item_id', item.ItemID)
          .single();

        const itemData = {
          company_id: companyId,         // ✅ Verified company
          user_id: userId,               // ✅ Track owner
          sku: item.Code,
          name: item.Description,
          description: item.Description,
          unit_price: item.SalesDetails?.UnitAmount || item.UnitAmount || 0,
          cost_price: 0,
          xero_item_id: item.ItemID,
          xero_synced_at: new Date().toISOString(),
        };

        if (existingItem) {
          await supabaseServer
            .from('items')
            .update(itemData)
            .eq('id', existingItem.id);
        } else {
          await supabaseServer.from('items').insert([itemData]);
        }
        itemsSynced++;
      } catch (error) {
        itemErrors.push({
          itemId: item.ItemID,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`✅ Synced ${itemsSynced}/${xeroItems.length} items`);

    // Sync contacts
    console.log('👥 Syncing contacts...');
    const xeroContacts = await xeroClient.getContacts();
    let contactsSynced = 0;
    const contactErrors = [];

    for (const contact of xeroContacts) {
      try {
        // ✅ Always query with verified company_id and user_id
        const { data: existingCustomer } = await supabaseServer
          .from('customers')
          .select('id')
          .eq('company_id', companyId)  // Verified company
          .eq('user_id', userId)         // Verified user
          .eq('xero_contact_id', contact.ContactID)
          .single();

        const customerData = {
          company_id: companyId,         // ✅ Verified company
          user_id: userId,               // ✅ Track owner
          name: contact.Name,
          email: contact.EmailAddress || '',
          phone: contact.Phones?.[0]?.PhoneNumber || '',
          xero_contact_id: contact.ContactID,
          xero_synced_at: new Date().toISOString(),
        };

        if (existingCustomer) {
          await supabaseServer
            .from('customers')
            .update(customerData)
            .eq('id', existingCustomer.id);
        } else {
          await supabaseServer.from('customers').insert([customerData]);
        }
        contactsSynced++;
      } catch (error) {
        contactErrors.push({
          contactId: contact.ContactID,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log(`✅ Synced ${contactsSynced}/${xeroContacts.length} contacts`);

    // ============================================================================
    // LAYER 4: AUDIT LOG - SYNC COMPLETION
    // ============================================================================
    const syncResults = {
      items: {
        synced: itemsSynced,
        total: xeroItems.length,
        errors: itemErrors.length,
      },
      contacts: {
        synced: contactsSynced,
        total: xeroContacts.length,
        errors: contactErrors.length,
      },
      totalSynced: itemsSynced + contactsSynced,
    };

    if (auditId) {
      try {
        await supabaseServer
          .from('audit_logs')
          .update({
            status: 'completed',
            metadata: JSON.stringify(syncResults),
          })
          .eq('id', auditId);
      } catch (err) {
        console.error('Audit update error:', err);
      }
    }

    console.log(`✅ Xero sync completed for company ${company.name}:`, syncResults);

    return NextResponse.json(
      {
        success: true,
        message: '✅ Full Xero sync completed',
        companyId,
        companyName: company.name,
        results: syncResults,
        details: {
          itemErrors: itemErrors.length > 0 ? itemErrors : undefined,
          contactErrors: contactErrors.length > 0 ? contactErrors : undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Xero full sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Full sync failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Get Xero Sync Status
 * GET /api/xero/sync/full
 *
 * Returns available Xero endpoints and configuration status
 */
export async function GET(request: NextRequest) {
  try {
    // ✅ Require authentication for status check
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accessToken = process.env.XERO_ACCESS_TOKEN;

    return NextResponse.json(
      {
        success: true,
        authenticated: !!accessToken,
        endpoints: {
          test: '/api/xero/test',
          items: '/api/xero/items',
          contacts: '/api/xero/contacts',
          invoices: '/api/xero/invoices',
          fullSync: '/api/xero/sync/full (POST)',
        },
        credentials: {
          accessToken: !!accessToken,
        },
        message: 'Use POST to /api/xero/sync/full with companyId to sync data',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Status check failed',
      },
      { status: 500 }
    );
  }
}
