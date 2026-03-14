import { NextRequest, NextResponse } from "next/server";
import { createSageInvoice, type SageInvoicePayload } from "@/lib/sageOneClient";
import { createXeroInvoice, type XeroInvoicePayload } from "@/lib/xeroClient";
import { SageOneApiClient } from "@/lib/sageOneApiClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { getTenant, isLiveTenant, logTenantAccess } from "@/lib/tenantGuard";

/**
 * Push WIP invoice to Sage One or Xero
 * POST /api/invoices/push-to-erp
 * 
 * ✅ SECURITY LAYERS:
 * 1. User authentication required (401 if missing)
 * 2. Company ownership verification (403 if not owned)
 * 3. Tenant environment check (403 if demo/sandbox - CRITICAL)
 * 4. Audit logging of all push attempts
 * 
 * POST /api/invoices/push-to-erp
 * 
 * Request body:
 * {
 *   erp: "sage" | "xero",
 *   wipAmount: number,
 *   retentionAmount: number,
 *   netClaimable: number,
 *   customerId: string,
 *   projectName: string,
 *   description: string,
 *   // For Sage:
 *   sageToken?: string,
 *   sageCookie?: string,
 *   // For Xero:
 *   xeroAccessToken?: string,
 *   xeroTenantId?: string
 * }
 */

interface WipInvoicePushRequest {
  erp: "sage" | "xero";
  companyId: number;  // REQUIRED: which company is pushing
  wipAmount: number;
  retentionAmount: number;
  netClaimable: number;
  customerId: string;
  projectName: string;
  description: string;
  sageToken?: string;
  sageCookie?: string;
  sage_username?: string;
  sage_password?: string;
  sage_api_key?: string;
  customerName?: string;
  customerEmail?: string;
  xeroAccessToken?: string;
  xeroTenantId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // LAYER 1: USER AUTHENTICATION
    // ============================================================================
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    
    if (!user || authError) {
      console.warn(`⚠️  WIP push: Authentication failed`);
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authentication' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const body = (await request.json()) as WipInvoicePushRequest;
    const { erp, companyId, wipAmount, retentionAmount, netClaimable, customerId, projectName, description } = body;

    // ============================================================================
    // LAYER 2: VALIDATE REQUEST
    // ============================================================================
    if (!erp || !companyId || !customerId || !projectName || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields: erp, companyId, customerId, projectName, description",
        },
        { status: 400 }
      );
    }

    // ============================================================================
    // LAYER 3: TENANT LOOKUP & ENVIRONMENT VERIFICATION (CRITICAL)
    // ============================================================================
    const platformId = erp === 'sage' ? 'sage' : 'xero';
    const tenant = await getTenant(userId, companyId, platformId as 'sage' | 'xero');

    // HARD STOP: Environment check must pass before ANY data is pushed
    if (!isLiveTenant(tenant)) {
      const reason = !tenant 
        ? `Tenant not configured for ${erp}`
        : tenant.environment !== 'live'
        ? `Cannot push from ${tenant.environment} environment`
        : 'Tenant is not active';

      console.warn(`⚠️  WIP push blocked: ${reason}`);

      try {
        await logTenantAccess(
          tenant?.id || 'unknown',
          userId,
          `${erp}_invoice_push_attempted`,
          'blocked',
          reason,
          { companyId, platform: erp }
        );
      } catch (err) {
        console.error('Tenant audit log error:', err);
      }

      return NextResponse.json(
        {
          success: false,
          error: reason,
          message: 'This workspace cannot push invoices to Xero/Sage. Only live workspaces are allowed.'
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
          `${erp}_invoice_push_attempted`,
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

    console.log(`✅ Company verified: ${company.name} (${companyId})`);

    try {
      await logTenantAccess(
        tenant.id,
        userId,
        `${erp}_invoice_push_started`,
        'allowed',
        'Invoice push initiated for live environment',
        { companyId, tenantId: tenant.id, environment: tenant.environment }
      );
    } catch (err) {
      console.error('Tenant audit log error (non-blocking):', err);
    }

    if (erp === "sage") {
      // Check for demo mode
      const isDemoMode = body.sageToken === "demo-mode" || body.sageCookie === "demo-mode";
      
      if (isDemoMode) {
        // Return mock success for demo
        const mockInvoiceId = `SAGE-DEMO-${Date.now().toString().slice(-6)}`;
        return NextResponse.json({
          success: true,
          erp: "sage",
          invoiceId: mockInvoiceId,
          message: `[DEMO] WIP invoice simulated for Sage One BCA (ID: ${mockInvoiceId})`,
          details: {
            wipAmount: parseFloat(wipAmount.toFixed(2)),
            retentionAmount: parseFloat(retentionAmount.toFixed(2)),
            netClaimable: parseFloat(netClaimable.toFixed(2)),
            projectName,
          },
        });
      }

      // Production mode - use real Sage API
      let sageClient: SageOneApiClient | null = null;
      
      // Get credentials from request or environment
      const username = process.env.SAGE_API_USERNAME || body.sage_username;
      const password = process.env.SAGE_API_PASSWORD || body.sage_password;
      const apiKey = process.env.SAGE_API_KEY || body.sage_api_key;
      const apiUrl = process.env.SAGE_API_URL || 'https://resellers.accounting.sageone.co.za/api/2.0.0';
      
      if (!apiKey && (!username || !password)) {
        return NextResponse.json(
          {
            error: "Sage One BCA credentials required",
            solution: "Provide SAGE_API_KEY in environment variables, or SAGE_API_USERNAME/SAGE_API_PASSWORD. Alternatively, pass sage_api_key or sage_username/sage_password in request body",
            demo_mode: "Use sageToken='demo-mode' to test without credentials"
          },
          { status: 400 }
        );
      }

      try {
        // Initialize Sage API client with credentials and API Key
        sageClient = new SageOneApiClient(username || '', password || '', apiKey, apiUrl);
        const authSuccess = await sageClient.authenticate();
        
        if (!authSuccess) {
          return NextResponse.json(
            {
              success: false,
              erp: "sage",
              error: "Failed to authenticate with Sage One BCA",
              hint: apiKey ? "Check SAGE_API_KEY" : "Check SAGE_API_USERNAME and SAGE_API_PASSWORD"
            },
            { status: 401 }
          );
        }

        // Prepare invoice payload for Sage
        const sagePayload = {
          CustomerName: body.customerName || `Customer #${customerId}`,
          CustomerEmail: body.customerEmail || "",
          InvoiceNumber: `FC-WIP-${Date.now().toString().slice(-6)}`,
          InvoiceDate: new Date().toISOString().split('T')[0],
          Notes: `WIP Claim from FieldCost\nProject: ${projectName}\nNet Claimable: R${netClaimable.toFixed(2)}\nRetention: R${retentionAmount.toFixed(2)}`,
          Items: [
            {
              Description: `Work in Progress - ${projectName}`,
              Quantity: 1.0,
              UnitAmount: wipAmount
            }
          ]
        };

        // Create invoice in Sage One BCA
        const sageResult = await sageClient.createInvoice(sagePayload);
        
        if (sageResult.success && sageResult.data) {
          return NextResponse.json({
            success: true,
            erp: "sage",
            invoiceId: sageResult.data.InvoiceID,
            message: `WIP invoice successfully created in Sage One BCA`,
            details: {
              wipAmount: parseFloat(wipAmount.toFixed(2)),
              retentionAmount: parseFloat(retentionAmount.toFixed(2)),
              netClaimable: parseFloat(netClaimable.toFixed(2)),
              projectName,
              sage_reference: sageResult.data.InvoiceNumber
            },
            sage_response: sageResult.data
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              erp: "sage",
              error: sageResult.error || "Failed to create invoice in Sage One BCA"
            },
            { status: 500 }
          );
        }
      } catch (err) {
        return NextResponse.json(
          {
            success: false,
            erp: "sage",
            error: err instanceof Error ? err.message : "Sage One BCA API error"
          },
          { status: 500 }
        );
      }
    } else if (erp === "xero") {
      // Check for demo mode
      const isDemoMode = body.xeroAccessToken === "demo-mode" || body.xeroTenantId === "demo-mode";
      
      if (isDemoMode) {
        // Return mock success for demo
        const mockInvoiceId = `XERO-DEMO-${Date.now().toString().slice(-6)}`;
        return NextResponse.json({
          success: true,
          erp: "xero",
          invoiceId: mockInvoiceId,
          message: `[DEMO] WIP invoice simulated for Xero (ID: ${mockInvoiceId})`,
          details: {
            wipAmount: parseFloat(wipAmount.toFixed(2)),
            retentionAmount: parseFloat(retentionAmount.toFixed(2)),
            netClaimable: parseFloat(netClaimable.toFixed(2)),
            projectName,
          },
        });
      }

      // Production mode - require real credentials
      if (!body.xeroAccessToken || !body.xeroTenantId) {
        return NextResponse.json(
          {
            error: "Xero authentication required: provide xeroAccessToken and xeroTenantId. Configure XERO_CLIENT_ID and XERO_CLIENT_SECRET in environment variables.",
          },
          { status: 400 }
        );
      }

      const payload: XeroInvoicePayload = {
        customerId,
        description,
        lineAmount: parseFloat(wipAmount.toFixed(2)),
        retentionAmount: parseFloat(retentionAmount.toFixed(2)),
        netAmount: parseFloat(netClaimable.toFixed(2)),
        projectName,
      };

      const result = await createXeroInvoice(payload, body.xeroAccessToken, body.xeroTenantId);

      if (result.success) {
        return NextResponse.json({
          success: true,
          erp: "xero",
          invoiceId: result.invoiceId,
          message: `WIP invoice pushed to Xero (ID: ${result.invoiceId})`,
          details: {
            wipAmount: parseFloat(wipAmount.toFixed(2)),
            retentionAmount: parseFloat(retentionAmount.toFixed(2)),
            netClaimable: parseFloat(netClaimable.toFixed(2)),
            projectName,
          },
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            erp: "xero",
            error: result.error,
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "Invalid ERP: must be 'sage' or 'xero'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
