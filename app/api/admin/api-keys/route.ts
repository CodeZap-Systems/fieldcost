/**
 * ADMIN API - API Keys Management
 * 
 * Manage API access keys for Tier 3 companies
 */

import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export interface APIKey {
  id: string;
  companyId: string;
  keyName: string;
  keyHash: string;
  keyPrefix: string;
  permissions: string[];
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export async function GET(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    // Mock data - in production fetch from database
    const sampleKeys: APIKey[] = companyId ? [
      {
        id: 'key-001',
        companyId,
        keyName: 'Production - Main App',
        keyPrefix: 'sk_live_abc123',
        keyHash: 'hashed_key_value',
        permissions: ['tasks:read', 'tasks:write', 'projects:read', 'invoices:read'],
        rateLimit: {
          requestsPerMinute: 600,
          requestsPerDay: 500000,
        },
        status: 'active',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'key-002',
        companyId,
        keyName: 'Development - Testing',
        keyPrefix: 'sk_test_def456',
        keyHash: 'hashed_key_value',
        permissions: ['tasks:read', 'tasks:write', 'projects:read'],
        rateLimit: {
          requestsPerMinute: 100,
          requestsPerDay: 10000,
        },
        status: 'active',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'key-003',
        companyId,
        keyName: 'Legacy Integration (Revoked)',
        keyPrefix: 'sk_live_old789',
        keyHash: 'hashed_key_value',
        permissions: ['tasks:read', 'projects:read'],
        rateLimit: {
          requestsPerMinute: 300,
          requestsPerDay: 100000,
        },
        status: 'revoked',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ] : [];

    return NextResponse.json({ keys: sampleKeys });
  } catch (error) {
    console.error('API keys GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { companyId, keyName, permissions, requestsPerMinute, requestsPerDay, expiresAt } = body;

    if (!companyId || !keyName || !permissions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, generate and hash the API key
    // const newKey = generateSecureKey();
    // const keyHash = hashKey(newKey);
    // await supabase
    //   .from('api_keys')
    //   .insert({
    //     company_id: companyId,
    //     key_name: keyName,
    //     key_hash: keyHash,
    //     key_prefix: newKey.substring(0, 20),
    //     permissions,
    //     requests_per_minute: requestsPerMinute || 600,
    //     requests_per_day: requestsPerDay || 500000,
    //     expires_at: expiresAt,
    //   });

    return NextResponse.json({
      success: true,
      message: 'API key created successfully',
      // In production, return the full key once (never show again)
      // key: newKey,
    });
  } catch (error) {
    console.error('API keys POST error:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { keyId, keyName, permissions, requestsPerMinute, requestsPerDay } = body;

    if (!keyId) {
      return NextResponse.json({ error: "Missing keyId" }, { status: 400 });
    }

    // In production, update the database
    // await supabase
    //   .from('api_keys')
    //   .update({
    //     key_name: keyName,
    //     permissions,
    //     requests_per_minute: requestsPerMinute,
    //     requests_per_day: requestsPerDay,
    //   })
    //   .eq('id', keyId);

    return NextResponse.json({
      success: true,
      message: 'API key updated successfully',
    });
  } catch (error) {
    console.error('API keys PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json({ error: "Missing keyId" }, { status: 400 });
    }

    // In production, revoke the key
    // await supabase
    //   .from('api_keys')
    //   .update({ status: 'revoked' })
    //   .eq('id', keyId);

    return NextResponse.json({
      success: true,
      message: 'API key revoked successfully',
    });
  } catch (error) {
    console.error('API keys DELETE error:', error);
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
  }
}
