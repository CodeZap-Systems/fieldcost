/**
 * API: Demo Company Data Cleanup
 * Automatically deletes non-demo data from Demo Company after 30 days
 * 
 * This endpoint can be called by:
 * - Cron jobs (e.g., daily via Vercel cron or external service)
 * - Manual cleanup triggers
 * - Background jobs
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { DEMO_COMPANY_ID } from '@/lib/demoConstants';

interface CleanupResult {
  timestamp: string;
  demoCompanyId: number | string;
  tablesProcessed: string[];
  recordsDeleted: Record<string, number>;
  errors: Record<string, string>;
}

async function cleanupTable(tableName: string, daysOld: number = 30): Promise<number> {
  try {
    // Calculate cutoff date (30 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    const cutoffISO = cutoffDate.toISOString();

    console.log(`[cleanup] Processing ${tableName}: removing records older than ${cutoffISO}`);

    // Delete non-demo records older than 30 days from Demo Company
    const { data, error, count } = await supabaseServer
      .from(tableName)
      .delete()
      .eq('company_id', DEMO_COMPANY_ID)
      .eq('is_demo', false)
      .lt('created_at', cutoffISO);

    if (error) {
      console.error(`[cleanup] Error deleting from ${tableName}:`, error.message);
      throw error;
    }

    const deletedCount = count || 0;
    console.log(`[cleanup] Deleted ${deletedCount} records from ${tableName}`);
    return deletedCount;
  } catch (err) {
    console.error(`[cleanup] Exception in ${tableName}:`, err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    // Optional: Add authentication/authorization check
    // You could require an API key or check for admin role
    const authHeader = req.headers.get('authorization');
    const expectedKey = process.env.CLEANUP_API_KEY;

    // Allow if no key is set (development) or if key matches
    if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing API key' },
        { status: 401 }
      );
    }

    const result: CleanupResult = {
      timestamp: new Date().toISOString(),
      demoCompanyId: DEMO_COMPANY_ID,
      tablesProcessed: [],
      recordsDeleted: {},
      errors: {},
    };

    // Tables that contain user-created data in Demo Company
    const tablesToClean = [
      'projects',
      'customers',
      'items',
      'tasks',
      'invoices',
      'budgets',
    ];

    console.log(`[cleanup] Starting cleanup of Demo Company (ID=${DEMO_COMPANY_ID})`);
    console.log(`[cleanup] Tables to process: ${tablesToClean.join(', ')}`);

    // Process each table
    for (const tableName of tablesToClean) {
      try {
        const deleted = await cleanupTable(tableName);
        result.tablesProcessed.push(tableName);
        result.recordsDeleted[tableName] = deleted;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        result.errors[tableName] = errorMsg;
      }
    }

    // Calculate summary
    const totalDeleted = Object.values(result.recordsDeleted).reduce((a, b) => a + b, 0);
    const hadErrors = Object.keys(result.errors).length > 0;

    console.log(`[cleanup] Cleanup complete:`);
    console.log(`  - Total records deleted: ${totalDeleted}`);
    console.log(`  - Tables processed: ${result.tablesProcessed.length}`);
    console.log(`  - Errors: ${Object.keys(result.errors).length}`);

    return NextResponse.json(
      {
        success: !hadErrors,
        message: `Cleanup completed. Deleted ${totalDeleted} records from ${result.tablesProcessed.length} tables.`,
        ...result,
      },
      { status: hadErrors ? 207 : 200 }
    );
  } catch (err) {
    console.error('[cleanup] Unexpected error:', err);
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// Also support GET for monitoring/testing
export async function GET(req: Request) {
  try {
    console.log('[cleanup] GET request - returning cleanup instructions');
    return NextResponse.json({
      message: 'Demo Company data cleanup endpoint',
      method: 'POST',
      description: 'Deletes non-demo data from Demo Company (is_demo=false) older than 30 days',
      authentication: 'Optional - set CLEANUP_API_KEY env var and pass as Bearer token',
      example: {
        url: '/api/demo/cleanup-expired-data',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_CLEANUP_API_KEY',
        },
      },
      schedule: 'Recommended: Daily via cron job',
      tables: ['projects', 'customers', 'items', 'tasks', 'invoices', 'budgets'],
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
