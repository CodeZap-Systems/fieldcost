import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  
  try {
    // Get sync status from database
    const query = supabaseServer.from('offline_bundles').select('*').order('created_at', { ascending: false });
    const finalQuery = userId ? query.eq('user_id', userId) : query;
    const { data, error } = await finalQuery;
    
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
