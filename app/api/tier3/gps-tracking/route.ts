import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validateGPSCoordinates } from '@/lib/tier3';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, crewMemberId, latitude, longitude, accuracy, altitude, isOfflineMode } = body;

    if (!taskId || !crewMemberId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, crewMemberId, latitude, longitude' },
        { status: 400 }
      );
    }

    // Validate GPS coordinates
    const gpsData = { latitude, longitude, accuracy, altitude, timestamp: new Date().toISOString() };
    const validation = validateGPSCoordinates(gpsData);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid GPS coordinates', details: validation.errors },
        { status: 400 }
      );
    }

    // Record location snapshot
    const { data, error } = await supabase
      .from('task_location_snapshots')
      .insert([
        {
          task_id: taskId,
          crew_member_id: crewMemberId,
          latitude,
          longitude,
          accuracy,
          altitude,
          gps_timestamp: new Date().toISOString(),
          status: isOfflineMode ? 'offline' : 'present',
          is_offline_mode: isOfflineMode || false,
          synced_at: isOfflineMode ? null : new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const taskId = request.nextUrl.searchParams.get('taskId');
    const crewMemberId = request.nextUrl.searchParams.get('crewMemberId');
    const limit = request.nextUrl.searchParams.get('limit') || '100';

    let query = supabase
      .from('task_location_snapshots')
      .select('*')
      .order('gps_timestamp', { ascending: false })
      .limit(parseInt(limit));

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    if (crewMemberId) {
      query = query.eq('crew_member_id', crewMemberId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
