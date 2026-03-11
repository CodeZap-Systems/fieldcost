import { NextRequest, NextResponse } from "next/server";
import { createSageInvoice, type SageInvoicePayload } from "@/lib/sageOneClient";
import { createXeroInvoice, type XeroInvoicePayload } from "@/lib/xeroClient";
import { SageOneApiClient } from "@/lib/sageOneApiClient";

/**
 * Push WIP invoice to Sage One or Xero
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
  customerName?: string;
  customerEmail?: string;
  xeroAccessToken?: string;
  xeroTenantId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WipInvoicePushRequest;

    const { erp, wipAmount, retentionAmount, netClaimable, customerId, projectName, description } = body;

    // Validate required fields
    if (!erp || !customerId || !projectName || !description) {
      return NextResponse.json(
        {
          error: "Missing required fields: erp, customerId, projectName, description",
        },
        { status: 400 }
      );
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
      
      if (!username || !password) {
        return NextResponse.json(
          {
            error: "Sage One BCA credentials required",
            solution: "Provide SAGE_API_USERNAME and SAGE_API_PASSWORD in environment variables, or pass sage_username/sage_password in request body",
            demo_mode: "Use sageToken='demo-mode' to test without credentials"
          },
          { status: 400 }
        );
      }

      try {
        // Initialize Sage API client
        sageClient = new SageOneApiClient(username, password);
        const authSuccess = await sageClient.authenticate();
        
        if (!authSuccess) {
          return NextResponse.json(
            {
              success: false,
              erp: "sage",
              error: "Failed to authenticate with Sage One BCA",
              hint: "Check credentials: SAGE_API_USERNAME and SAGE_API_PASSWORD"
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
