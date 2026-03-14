import { NextRequest, NextResponse } from "next/server";
import { SageOneApiClient } from "@/lib/sageOneApiClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { getTenant, isLiveTenant, logTenantAccess } from "@/lib/tenantGuard";

/**
 * Sync Customers from Sage to FieldCost Database
 * POST /api/sage/customers/sync
 * 
 * ✅ SECURITY LAYERS:
 * 1. User authentication required
 * 2. Company ownership verification
 * 3. Tenant environment check (CRITICAL - blocks demo)
 * 4. Audit logging of all sync attempts
 * 
 * Pulls contacts/customers from Sage One and stores them in FieldCost database
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // LAYER 1: USER AUTHENTICATION
    // ============================================================================
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (!user || authError) {
      console.warn(`⚠️  Sage customers sync: Authentication failed`);
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Missing or invalid authentication'
        },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get company_id from request body
    const body = await request.json().catch(() => ({}));
    const companyId = body.company_id;

    if (!companyId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing company_id in request body",
        },
        { status: 400 }
      );
    }

    // ============================================================================
    // LAYER 2: TENANT LOOKUP & ENVIRONMENT VERIFICATION (CRITICAL)
    // ============================================================================
    const tenant = await getTenant(userId, companyId, 'sage');

    // HARD STOP: Environment check must pass before ANY sync
    if (!isLiveTenant(tenant)) {
      const reason = !tenant 
        ? 'Tenant not configured for Sage'
        : tenant.environment !== 'live'
        ? `Cannot sync from ${tenant.environment} environment`
        : 'Tenant is not active';

      console.warn(`⚠️  Sage customers sync blocked: ${reason}`);

      try {
        await logTenantAccess(
          tenant?.id || 'unknown',
          userId,
          'sage_customers_sync_attempted',
          'blocked',
          reason,
          { companyId }
        );
      } catch (err) {
        console.error('Tenant audit log error:', err);
      }

      return NextResponse.json(
        {
          success: false,
          error: reason,
          message: 'This workspace cannot sync from Sage. Only live workspaces are allowed.'
        },
        { status: 403 }
      );
    }

    // ✅ Tenant passed all checks
    console.log(`✅ Tenant verified: ${tenant.environment} environment, platform: sage`);

    // LEGACY: Verify company ownership for backward compatibility
    const { data: company, error: companyError } = await supabaseServer
      .from('company_profiles')
      .select('id, user_id, name')
      .eq('id', companyId)
      .eq('user_id', userId)
      .single();

    if (companyError || !company) {
      try {
        await logTenantAccess(
          tenant.id,
          userId,
          'sage_customers_sync_attempted',
          'blocked',
          'Company ownership verification failed',
          { companyId }
        );
      } catch (err) {
        console.error('Tenant audit log error:', err);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: You do not have access to this company'
        },
        { status: 403 }
      );
    }

    try {
      await logTenantAccess(
        tenant.id,
        userId,
        'sage_customers_sync_started',
        'allowed',
        'Customers sync initiated for live environment',
        { companyId, environment: tenant.environment }
      );
    } catch (err) {
      console.error('Tenant audit log error (non-blocking):', err);
    }

    const sageToken = process.env.SAGE_API_TOKEN;
    const sageUsername = process.env.SAGE_API_USERNAME;
    const sagePassword = process.env.SAGE_API_PASSWORD;
    const sageApiUrl = process.env.SAGE_API_URL;

    if (!sageToken && (!sageUsername || !sagePassword)) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Sage API credentials",
        },
        { status: 400 }
      );
    }

    // Initialize Sage client
    const client = new SageOneApiClient(
      sageUsername || "",
      sagePassword || "",
      sageToken,
      sageApiUrl
    );

    // Authenticate
    const authSuccess = await client.authenticate();
    if (!authSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Sage One API",
        },
        { status: 401 }
      );
    }

    // Get contacts from Sage
    const contactsResult = await client.getContacts();

    if (!contactsResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: contactsResult.error,
        },
        { status: 500 }
      );
    }

    const sageContacts = contactsResult.data || [];

    if (sageContacts.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No customers found in Sage to sync",
          synced: 0,
          skipped: 0,
          errors: [],
        },
        { status: 200 }
      );
    }

    // Sync customers to FieldCost database
    const syncResults = {
      synced: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const sageContact of sageContacts) {
      try {
        // Check if customer already exists
        const result = await supabaseServer
          .from("customers")
          .select("id")
          .eq("company_id", companyId)
          .eq("sage_contact_id", sageContact.ID)
          .single();
        
        const existing = result.data;

        if (existing) {
          // Update existing customer
          const { error } = await supabaseServer
            .from("customers")
            .update({
              name: sageContact.Name,
              email: sageContact.Email || "",
              sage_contact_id: sageContact.ID,
              sage_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (error) {
            syncResults.errors.push(
              `Failed to update customer ${sageContact.Name}: ${error.message}`
            );
            syncResults.skipped++;
          } else {
            syncResults.synced++;
          }
        } else {
          // Create new customer
          const { error } = await supabaseServer
            .from("customers")
            .insert({
              company_id: companyId,
              name: sageContact.Name,
              email: sageContact.Email || "",
              sage_contact_id: sageContact.ID,
              sage_synced_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (error) {
            syncResults.errors.push(
              `Failed to create customer ${sageContact.Name}: ${error.message}`
            );
            syncResults.skipped++;
          } else {
            syncResults.synced++;
          }
        }
      } catch (error) {
        syncResults.errors.push(
          `Error processing customer ${sageContact.Name}: ${String(error)}`
        );
        syncResults.skipped++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${syncResults.synced} customers from Sage One`,
        synced: syncResults.synced,
        skipped: syncResults.skipped,
        total: sageContacts.length,
        errors: syncResults.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sage customers sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: String(error),
      },
      { status: 500 }
    );
  }
}
