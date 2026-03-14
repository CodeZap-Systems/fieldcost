import { NextRequest, NextResponse } from "next/server";
import { SageOneApiClient } from "@/lib/sageOneApiClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { getTenant, isLiveTenant, logTenantAccess, updateTenantSyncStatus } from "@/lib/tenantGuard";

/**
 * Full Sage Data Sync - GDPR/POPIA Compliant
 * POST /api/sage/sync/full
 * 
 * ✅ SECURITY LAYERS:
 * 1. User authentication required
 * 2. Company ownership verification
 * 3. Demo company protection
 * 4. Audit logging of all operations
 * 
 * Orchestrates complete sync of all Sage data:
 * - Current company info
 * - Customers (contacts)
 * - Items/inventory
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // LAYER 1: USER AUTHENTICATION
    // ============================================================================
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (!user || authError) {
      console.warn(`⚠️  Sage sync: Authentication failed`);
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Missing or invalid authentication",
        },
        { status: 401 }
      );
    }

    const userId = user.id;
    console.log(`✅ User authenticated: ${userId}`);

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
    // Get the tenant from the central tenants table
    const tenant = await getTenant(userId, companyId, 'sage');

    // HARD STOP: Environment check must pass before ANY sync operation
    if (!isLiveTenant(tenant)) {
      const reason = !tenant 
        ? 'Tenant not configured for Sage'
        : tenant.environment !== 'live'
        ? `Cannot sync from ${tenant.environment} environment`
        : 'Tenant is not active';

      console.warn(`⚠️  Sage sync blocked: ${reason}`);

      try {
        await logTenantAccess(
          tenant?.id || 'unknown',
          userId,
          'sage_sync_attempted',
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
          message: 'This workspace cannot sync to Sage. Only live workspaces are allowed.'
        },
        { status: 403 }
      );
    }

    // ✅ Tenant passed all checks - safe to proceed
    console.log(`✅ Tenant verified: ${tenant.environment} environment, platform: ${tenant.platform}`);

    // LEGACY: Also verify company ownership for backward compatibility
    const { data: company, error: companyError } = await supabaseServer
      .from("company_profiles")
      .select("id, user_id, name")
      .eq("id", companyId)
      .eq("user_id", userId)
      .single();

    if (companyError || !company) {
      console.warn(
        `⚠️  Company not found or unauthorized: ${companyId}`
      );
      
      try {
        await logTenantAccess(
          tenant.id,
          userId,
          'sage_sync_attempted',
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
          error: "Forbidden: You do not have access to this company",
        },
        { status: 403 }
      );
    }

    console.log(`✅ Company verified: ${company.name} (${companyId})`);

    try {
      await logTenantAccess(
        tenant.id,
        userId,
        'sage_sync_started',
        'allowed',
        'Sync initiated for live environment',
        { companyId, tenantId: tenant.id, environment: tenant.environment }
      );
    } catch (err) {
      console.error('Tenant audit log error (non-blocking):', err);
    }

    // ✅ Demo company protection already enforced by tenant guard above
    // (isLiveTenant() blocks demo, sandbox, and inactive tenants)

    console.log(`🔄 Starting full Sage sync for company: ${company.name}`);

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
          erp_system: 'sage',
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

    // Initialize Sage client
    const client = new SageOneApiClient(
      sageUsername || "",
      sagePassword || "",
      sageToken,
      sageApiUrl
    );

    // Authenticate
    console.log("🔐 Authenticating with Sage API...");
    const authSuccess = await client.authenticate();
    if (!authSuccess) {
      if (auditId) {
        try {
          await supabaseServer
            .from('audit_logs')
            .update({ status: 'failed', reason: 'Sage connection failed' })
            .eq('id', auditId);
        } catch (err) {
          console.error('Audit update error:', err);
        }
      }
      return NextResponse.json(
        {
          success: false,
          error: "Failed to authenticate with Sage One API",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    console.log("✅ Sage authentication successful");

    // Get current company
    console.log("📋 Fetching company information...");
    const companyResult = await client.getCurrentCompany();

    // Get customers
    console.log("👥 Fetching customers from Sage...");
    const customersResult = await client.getContacts();
    const customers = customersResult.data || [];

    // Get items
    console.log("📦 Fetching items from Sage...");
    const itemsResult = await client.getItems();
    const items = itemsResult.data || [];

    // Sync results tracking
    const results = {
      company: {
        synced: false,
        error: null as string | null,
      },
      customers: {
        synced: 0,
        skipped: 0,
        errors: [] as string[],
      },
      items: {
        synced: 0,
        skipped: 0,
        errors: [] as string[],
      },
    };

    // Store company info in database
    try {
      if (companyResult.success && companyResult.data) {
        // ✅ Only update verified company
        const { error } = await supabaseServer
          .from("company_profiles")
          .update({
            sage_company_id: companyResult.data.ID,
            sage_company_name: companyResult.data.Name,
            sage_synced_at: new Date().toISOString(),
          })
          .eq("id", companyId)
          .eq("user_id", userId);  // ✅ Verify ownership on update

        if (!error) {
          results.company.synced = true;
          console.log("✅ Company info synced");
        } else {
          results.company.error = error.message;
          console.error("❌ Failed to sync company info:", error.message);
        }
      }
    } catch (error) {
      results.company.error = String(error);
    }

    // Sync customers
    for (const customer of customers) {
      try {
        const result = await supabaseServer
          .from("customers")
          .select("id")
          .eq("company_id", companyId)    // ✅ Verified company
          .eq("user_id", userId)           // ✅ Verified user
          .eq("sage_contact_id", customer.ID)
          .single();
        
        const existing = result.data;

        if (existing) {
          const { error } = await supabaseServer
            .from("customers")
            .update({
              name: customer.Name,
              email: customer.Email || "",
              sage_contact_id: customer.ID,
              sage_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (!error) {
            results.customers.synced++;
          } else {
            results.customers.errors.push(
              `Failed to update: ${customer.Name} - ${error.message}`
            );
            results.customers.skipped++;
          }
        } else {
          const { error } = await supabaseServer
            .from("customers")
            .insert({
              company_id: companyId,      // ✅ Verified company
              user_id: userId,             // ✅ Track owner
              name: customer.Name,
              email: customer.Email || "",
              sage_contact_id: customer.ID,
              sage_synced_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (!error) {
            results.customers.synced++;
          } else {
            results.customers.errors.push(
              `Failed to create: ${customer.Name} - ${error.message}`
            );
            results.customers.skipped++;
          }
        }
      } catch (error) {
        results.customers.errors.push(`Error: ${String(error)}`);
        results.customers.skipped++;
      }
    }

    console.log(
      `✅ Customers synced: ${results.customers.synced}, Skipped: ${results.customers.skipped}`
    );

    // Sync items
    for (const item of items) {
      try {
        const result = await supabaseServer
          .from("items")
          .select("id")
          .eq("company_id", companyId)    // ✅ Verified company
          .eq("user_id", userId)           // ✅ Verified user
          .eq("sage_item_id", item.ID)
          .single();
        
        const existing = result.data;

        if (existing) {
          const { error } = await supabaseServer
            .from("items")
            .update({
              name: item.Name,
              description: item.Description || "",
              sku: item.Code,
              unit_price: item.SalesPrice || 0,
              cost_price: item.PurchasePrice || 0,
              quantity_on_hand: item.Quantity || 0,
              unit_of_measure: item.UnitOfSales || "unit",
              sage_item_id: item.ID,
              sage_synced_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);

          if (!error) {
            results.items.synced++;
          } else {
            results.items.errors.push(
              `Failed to update: ${item.Code} - ${error.message}`
            );
            results.items.skipped++;
          }
        } else {
          const { error } = await supabaseServer
            .from("items")
            .insert({
              company_id: companyId,      // ✅ Verified company
              user_id: userId,             // ✅ Track owner
              name: item.Name,
              description: item.Description || "",
              sku: item.Code,
              unit_price: item.SalesPrice || 0,
              cost_price: item.PurchasePrice || 0,
              quantity_on_hand: item.Quantity || 0,
              unit_of_measure: item.UnitOfSales || "unit",
              sage_item_id: item.ID,
              sage_synced_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (!error) {
            results.items.synced++;
          } else {
            results.items.errors.push(
              `Failed to create: ${item.Code} - ${error.message}`
            );
            results.items.skipped++;
          }
        }
      } catch (error) {
        results.items.errors.push(`Error: ${String(error)}`);
        results.items.skipped++;
      }
    }

    console.log(
      `✅ Items synced: ${results.items.synced}, Skipped: ${results.items.skipped}`
    );

    // ============================================================================
    // LAYER 4: AUDIT LOG - SYNC COMPLETION
    // ============================================================================
    if (auditId) {
      try {
        await supabaseServer
          .from('audit_logs')
          .update({
            status: 'completed',
            metadata: JSON.stringify(results),
          })
          .eq('id', auditId);
      } catch (err) {
        console.error('Audit update error:', err);
      }
    }

    console.log(`✅ Sage sync completed for company ${company.name}:`, results);

    return NextResponse.json(
      {
        success: true,
        message: "✅ Full sync from Sage One completed",
        companyId,
        companyName: company.name,
        results,
        summary: {
          company: results.company.synced ? "✅ Synced" : "❌ Failed",
          customers: `${results.customers.synced}/${customers.length} synced`,
          items: `${results.items.synced}/${items.length} synced`,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Sage full sync error:", error);
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
