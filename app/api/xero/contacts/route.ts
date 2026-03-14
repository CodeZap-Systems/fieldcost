import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Get Xero Contacts
 * GET /api/xero/contacts
 * 
 * Fetches all contacts from Xero
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

    const contacts = await xeroClient.getContacts();

    return NextResponse.json(
      {
        success: true,
        count: contacts.length,
        contacts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Xero contacts error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch contacts',
      },
      { status: 500 }
    );
  }
}

/**
 * Sync Xero Contacts to Database
 * POST /api/xero/contacts
 * 
 * Syncs contacts from Xero to FieldCost customers table
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

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

    if (!companyId) {
      return NextResponse.json(
        { error: 'Missing companyId parameter' },
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

    console.log('🔄 Fetching contacts from Xero...');
    const xeroContacts = await xeroClient.getContacts();
    console.log(`✅ Retrieved ${xeroContacts.length} contacts from Xero`);

    let synced = 0;
    let skipped = 0;
    const errors = [];

    for (const contact of xeroContacts) {
      try {
        // Check if contact already exists
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('xero_contact_id', contact.ContactID)
          .single();

        const customerData = {
          company_id: companyId,
          name: contact.Name,
          email: contact.EmailAddress || '',
          phone: contact.Phones?.[0]?.PhoneNumber || '',
          xero_contact_id: contact.ContactID,
          xero_synced_at: new Date().toISOString(),
        };

        if (existingCustomer) {
          // Update existing
          await supabase
            .from('customers')
            .update(customerData)
            .eq('id', existingCustomer.id);
          synced++;
        } else {
          // Insert new
          await supabase.from('customers').insert([customerData]);
          synced++;
        }
      } catch (error) {
        skipped++;
        errors.push({
          contactId: contact.ContactID,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${synced} contacts from Xero`,
        synced,
        skipped,
        total: xeroContacts.length,
        errors: errors.length > 0 ? errors : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Xero sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed',
      },
      { status: 500 }
    );
  }
}
