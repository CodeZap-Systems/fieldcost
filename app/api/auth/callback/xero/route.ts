import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Xero OAuth Callback Handler
 * POST /api/auth/callback/xero
 * 
 * Handles the OAuth callback from Xero after user authentication
 * Exchanges authorization code for access token and stores credentials
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state, tenantId } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Xero configuration' },
        { status: 500 }
      );
    }

    // Create Xero client and exchange code for token
    const xeroClient = new XeroApiClient(clientId, clientSecret, redirectUri);
    const tokenResponse = await xeroClient.exchangeCodeForToken(code);

    if (tenantId) {
      xeroClient.setTenantId(tenantId);
    }

    // Test connection
    const testResult = await xeroClient.testConnection();

    if (!testResult.success) {
      return NextResponse.json(
        { error: 'Failed to authenticate with Xero' },
        { status: 401 }
      );
    }

    // Store Xero credentials (you would typically store in database)
    const credentials = {
      accessToken: xeroClient.getAccessToken(),
      refreshToken: xeroClient.getRefreshToken(),
      tenantId: xeroClient.getTenantId(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    };

    return NextResponse.json(
      {
        success: true,
        message: '✅ Successfully authenticated with Xero',
        credentials,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Xero callback error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Xero OAuth Authorization Endpoint
 * GET /api/auth/callback/xero
 * 
 * Redirects to Xero authorization page
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.XERO_CLIENT_ID;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Xero configuration' },
        { status: 500 }
      );
    }

    const xeroClient = new XeroApiClient(clientId, '', redirectUri);
    const authUrl = xeroClient.getAuthorizationUrl();

    return NextResponse.json(
      {
        success: true,
        authUrl,
        message: 'Redirect to this URL to authenticate with Xero',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate auth URL',
      },
      { status: 500 }
    );
  }
}
