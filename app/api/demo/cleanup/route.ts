import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID } from '../../../../lib/userIdentity';

const demoUserIds = [DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID].filter(Boolean);

/**
 * Demo Data Cleanup - Removes demo data older than 30 days
 * This keeps the demo environment fresh while preserving recent test data
 * 
 * Usage:
 * - Can be called manually: GET /api/demo/cleanup
 * - Could be set up as a scheduled cron job
 * - Runs once per day recommended
 */
export async function GET() {
  if (!demoUserIds.length) {
    return NextResponse.json(
      { error: 'No demo user IDs configured', cleaned: 0 },
      { status: 400 }
    );
  }

  try {
    // Calculate 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    let totalCleaned = 0;
    const tables = ['invoices', 'items', 'tasks', 'projects', 'customers', 'budgets'];

    for (const table of tables) {
      const { data: toDelete, error: fetchError } = await supabaseServer
        .from(table)
        .select('id')
        .in('user_id', demoUserIds)
        .lt('created_at', cutoffDate);

      if (fetchError) {
        console.warn(`Could not query ${table} for cleanup:`, fetchError.message);
        continue;
      }

      if (toDelete && toDelete.length > 0) {
        const { error: deleteError } = await supabaseServer
          .from(table)
          .delete()
          .in('user_id', demoUserIds)
          .lt('created_at', cutoffDate);

        if (deleteError) {
          console.error(`Error cleaning ${table}:`, deleteError.message);
        } else {
          totalCleaned += toDelete.length;
          console.log(`Cleaned ${toDelete.length} records from ${table}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned ${totalCleaned} demo records older than 30 days`,
      cleaned: totalCleaned,
      cutoffDate,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Demo cleanup error:', err);
    return NextResponse.json(
      { error: 'Cleanup failed', details: String(err) },
      { status: 500 }
    );
  }
}

/**
 * POST version for programmatic cleanup triggers
 */
export async function POST() {
  return GET();
}
