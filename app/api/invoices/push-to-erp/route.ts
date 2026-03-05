import { NextRequest, NextResponse } from "next/server";
import { createSageInvoice, type SageInvoicePayload } from "@/lib/sageOneClient";
import { createXeroInvoice, type XeroInvoicePayload } from "@/lib/xeroClient";

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
          message: `[DEMO] WIP invoice simulated for Sage One (ID: ${mockInvoiceId})`,
          details: {
            wipAmount: parseFloat(wipAmount.toFixed(2)),
            retentionAmount: parseFloat(retentionAmount.toFixed(2)),
            netClaimable: parseFloat(netClaimable.toFixed(2)),
            projectName,
          },
        });
      }

      // Production mode - require real credentials
      if (!body.sageToken && !body.sageCookie) {
        return NextResponse.json(
          {
            error: "Sage authentication required: provide sageToken and/or sageCookie. Configure SAGE_ONE_USERNAME and SAGE_ONE_PASSWORD in environment variables.",
          },
          { status: 400 }
        );
      }

      const payload: SageInvoicePayload = {
        customerId,
        description,
        lineAmount: parseFloat(wipAmount.toFixed(2)),
        retentionAmount: parseFloat(retentionAmount.toFixed(2)),
        netAmount: parseFloat(netClaimable.toFixed(2)),
        projectName,
        invoiceType: "Sales",
      };

      const result = await createSageInvoice(payload);

      if (result.success) {
        return NextResponse.json({
          success: true,
          erp: "sage",
          invoiceId: result.invoiceId,
          message: `WIP invoice pushed to Sage One (ID: ${result.invoiceId})`,
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
            erp: "sage",
            error: result.error,
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
        contactId: customerId,
        description,
        lineAmount: parseFloat(wipAmount.toFixed(2)),
        retentionAmount: parseFloat(retentionAmount.toFixed(2)),
        netAmount: parseFloat(netClaimable.toFixed(2)),
        projectName,
        invoiceType: "ACCREC",
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
