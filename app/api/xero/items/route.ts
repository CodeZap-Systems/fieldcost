import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Get Xero Items
 * GET /api/xero/items
 * 
 * Fetches all items from Xero
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

    const items = await xeroClient.getItems();

    return NextResponse.json(
      {
        success: true,
        count: items.length,
        items,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Xero items error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch items',
      },
      { status: 500 }
    );
  }
}

/**
 * Sync Xero Items to Database
 * POST /api/xero/items
 * 
 * Syncs items from Xero to FieldCost items table
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

    console.log('🔄 Fetching items from Xero...');
    const xeroItems = await xeroClient.getItems();
    console.log(`✅ Retrieved ${xeroItems.length} items from Xero`);

    let synced = 0;
    let skipped = 0;
    const errors = [];

    for (const item of xeroItems) {
      try {
        // Check if item already exists
        const { data: existingItem } = await supabase
          .from('items')
          .select('id')
          .eq('xero_item_id', item.ItemID)
          .single();

        const itemData = {
          company_id: companyId,
          sku: item.Code,
          name: item.Description,
          description: item.Description,
          unit_price: item.SalesDetails?.UnitAmount || item.UnitAmount || 0,
          cost_price: 0,
          xero_item_id: item.ItemID,
          xero_synced_at: new Date().toISOString(),
        };

        if (existingItem) {
          // Update existing
          await supabase
            .from('items')
            .update(itemData)
            .eq('id', existingItem.id);
          synced++;
        } else {
          // Insert new
          await supabase.from('items').insert([itemData]);
          synced++;
        }
      } catch (error) {
        skipped++;
        errors.push({
          itemId: item.ItemID,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${synced} items from Xero`,
        synced,
        skipped,
        total: xeroItems.length,
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
