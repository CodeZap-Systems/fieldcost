import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  // CRITICAL: Require company_id for data isolation - prevent demo/live data mixing
  if (!companyId || !companyId.trim()) {
    console.warn(`[SECURITY] GET /api/offline-sync-status: Missing company_id for user ${userId}`);
    return NextResponse.json(
      { error: 'company_id parameter is required for data isolation' },
      { status: 400 }
    );
  }
  
  try {
    // Validate user has access to company
    await getCompanyContext(userId, companyId);
    
    // Get sync status from database
    const { data, error } = await supabaseServer
      .from('offline_bundles')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    // Get sync logs for status
    const { data: syncLogs, error: logsError } = await supabaseServer
      .from('offline_sync_log')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (logsError) console.error('Error fetching sync logs:', logsError);
    
    const logs = syncLogs || [];
    const pending = logs.filter((item: any) => item.status === 'in_progress').length;
    const synced = logs.filter((item: any) => item.status === 'completed').length;
    const failed = logs.filter((item: any) => item.status === 'failed').length;
    
    return NextResponse.json({
      status: failed > 0 ? 'has_errors' : pending > 0 ? 'syncing' : 'synced',
      pending_items: pending,
      synced_items: synced,
      failed_items: failed,
      total_items: logs.length,
      last_sync: logs[0]?.sync_completed_at || logs[0]?.sync_started_at || null,
      bundles: data || []
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = resolveServerUserId(body.user_id);
  
  try {
    const payload = {
      device_id: body.device_id || 'unknown-device',
      bundle_created_at: new Date().toISOString(),
      bundles_synced: body.bundles_synced || 0,
      tasks_inside_bundle: body.tasks_inside_bundle || 0,
      photos_inside_bundle: body.photos_inside_bundle || 0,
      data_size_mb: body.data_size_mb || 0,
      requires_manual_review: body.requires_manual_review || false,
      user_id: userId,
    };

    const { data, error } = await supabaseServer
      .from('offline_bundles')
      .insert([payload])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err) {
    console.error('POST /api/offline-sync-status error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
