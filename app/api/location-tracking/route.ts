import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  // CRITICAL: Require company_id for data isolation - prevent demo/live data mixing
  if (!companyId || !companyId.trim()) {
    console.warn(`[SECURITY] GET /api/location-tracking: Missing company_id for user ${userId}`);
    return NextResponse.json(
      { error: 'company_id parameter is required for data isolation' },
      { status: 400 }
    );
  }
  
  try {
    // Validate user has access to company
    await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('task_location_snapshots')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = resolveServerUserId(body.user_id);
  
  try {
    if (userId) await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/location-tracking ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  const payload = {
    task_id: body.task_id || 0,
    crew_member_id: body.crew_member_id || 0,
    latitude: body.latitude,
    longitude: body.longitude,
    accuracy: body.accuracy || null,
    gps_timestamp: body.gps_timestamp || new Date().toISOString(),
    status: 'present',
    is_offline_mode: body.is_offline_mode || false,
    user_id: userId,
  };

  try {
    const { data, error } = await supabaseServer
      .from('task_location_snapshots')
      .insert([payload])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err) {
    console.error('POST /api/location-tracking error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Test geofence validation
export async function PUT(req: Request) {
  const body = await req.json();
  const { location_id, geofence_validated } = body;

  if (!location_id) {
    return NextResponse.json({ error: 'Missing location_id' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from('task_location_snapshots')
      .update({ status: geofence_validated ? 'present' : 'departed' })
      .eq('id', location_id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data?.[0] || {});
  } catch (err) {
    console.error('PUT /api/location-tracking error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
