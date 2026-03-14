import { NextRequest, NextResponse } from 'next/server';
import XeroApiClient from '@/lib/xeroApiClient';

/**
 * Test Xero Connection
 * GET /api/xero/test
 * 
 * Tests Xero API connection and returns authorization URL if not authenticated
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;
    const accessToken = process.env.XERO_ACCESS_TOKEN;
    const tenantId = process.env.XERO_TENANT_ID;

    console.log('🔐 Checking Xero configuration...');
    console.log('ClientID:', !!clientId);
    console.log('ClientSecret:', !!clientSecret);
    console.log('RedirectURI:', !!redirectUri);
    console.log('AccessToken:', !!accessToken);
    console.log('TenantID:', !!tenantId);

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing Xero configuration',
          required: ['XERO_CLIENT_ID', 'XERO_CLIENT_SECRET', 'XERO_REDIRECT_URI'],
          found: {
            clientId: !!clientId,
            clientSecret: !!clientSecret,
            redirectUri: !!redirectUri,
          },
        },
        { status: 400 }
      );
    }

    // If no access token, return authorization URL
    if (!accessToken) {
      const xeroClient = new XeroApiClient(clientId, clientSecret, redirectUri);
      const authUrl = xeroClient.getAuthorizationUrl();

      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: 'Not authenticated. Redirect to authUrl to authorize.',
          authUrl,
          credentials: {
            clientId,
            redirectUri,
            authenticated: false,
          },
        },
        { status: 401 }
      );
    }

    // If we have access token, try to test connection
    const xeroClient = new XeroApiClient(
      clientId,
      clientSecret,
      redirectUri,
      accessToken,
      undefined,
      tenantId
    );

    const testResult = await xeroClient.testConnection();

    return NextResponse.json(
      {
        success: testResult.success,
        authenticated: testResult.success,
        message: testResult.success
          ? '✅ Successfully connected to Xero'
          : '❌ Failed to connect to Xero',
        data: testResult,
        credentials: {
          clientId,
          redirectUri,
          tenantId: tenantId || 'not set',
          authenticated: testResult.success,
        },
      },
      { status: testResult.success ? 200 : 401 }
    );
  } catch (error) {
    console.error('Xero test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
      },
      { status: 500 }
    );
  }
}

/**
 * Initiate Xero OAuth Flow
 * POST /api/xero/test
 * 
 * Starts the OAuth flow by returning the authorization URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { redirectAfterAuth } = body;

    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = process.env.XERO_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing Xero configuration' },
        { status: 500 }
      );
    }

    const xeroClient = new XeroApiClient(clientId, clientSecret, redirectUri);
    const authUrl = xeroClient.getAuthorizationUrl();

    return NextResponse.json(
      {
        success: true,
        authUrl,
        message: 'Redirect user to authUrl to complete Xero authentication',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initiate auth',
      },
      { status: 500 }
    );
  }
}
