import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      entityType,
      entityId,
      action,
      userId,
      userRole,
      changeDetails,
      photoEvidenceId,
      gpsLatitude,
      gpsLongitude,
    } = body;

    if (!companyId || !entityType || !entityId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, entityType, entityId, action' },
        { status: 400 }
      );
    }

    // Get client IP for audit trail
    const clientIp = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Create audit log entry
    const { data, error } = await supabase
      .from('tier3_audit_logs')
      .insert([
        {
          company_id: companyId,
          entity_type: entityType,
          entity_id: entityId,
          action,
          user_id: userId || null,
          user_role: userRole || null,
          timestamp: new Date().toISOString(),
          change_details: changeDetails || {},
          photo_evidence_id: photoEvidenceId || null,
          gps_latitude: gpsLatitude || null,
          gps_longitude: gpsLongitude || null,
          ip_address: clientIp,
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
    const companyId = request.nextUrl.searchParams.get('companyId');
    const entityType = request.nextUrl.searchParams.get('entityType');
    const entityId = request.nextUrl.searchParams.get('entityId');
    const userId = request.nextUrl.searchParams.get('userId');
    const limit = request.nextUrl.searchParams.get('limit') || '100';
    const offset = request.nextUrl.searchParams.get('offset') || '0';

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('tier3_audit_logs')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .order('timestamp', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      totalCount: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
