import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Get Xero Invoices
 * GET /api/xero/invoices
 * 
 * Fetches all invoices from Xero
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;
    const accessToken = process.env.XERO_ACCESS_TOKEN;
    const tenantId = process.env.XERO_TENANT_ID;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Xero. Call /api/xero/test to authenticate.' },
        { status: 401 }
      );
    }

    const xeroClient = new XeroApiClient(
      clientId || '',
      clientSecret || '',
      redirectUri || '',
      accessToken,
      undefined,
      tenantId
    );

    const invoices = await xeroClient.getInvoices(
      'Status=="DRAFT" || Status=="SUBMITTED" || Status=="AUTHORISED"'
    );

    return NextResponse.json(
      {
        success: true,
        count: invoices.length,
        invoices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Xero invoices error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch invoices',
      },
      { status: 500 }
    );
  }
}

/**
 * Create Invoice in Xero
 * POST /api/xero/invoices
 * 
 * Creates a new invoice in Xero from FieldCost project data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contactName,
      lineItems,
      reference,
      dueDate,
    } = body;

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

    if (!contactName || !lineItems || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { error: 'Missing required fields: contactName, lineItems (array)' },
        { status: 400 }
      );
    }

    const xeroClient = new XeroApiClient(
      clientId || '',
      clientSecret || '',
      redirectUri || '',
      accessToken,
      undefined,
      tenantId
    );

    console.log('📝 Creating invoice in Xero...');

    const invoice = await xeroClient.createInvoice({
      Type: 'ACCREC', // Sales invoice
      Contact: { Name: contactName },
      LineItems: lineItems,
      DueDate: dueDate,
      Reference: reference,
    });

    console.log('✅ Invoice created:', invoice.InvoiceID);

    return NextResponse.json(
      {
        success: true,
        message: 'Invoice created in Xero',
        invoice,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Xero invoice creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
}
