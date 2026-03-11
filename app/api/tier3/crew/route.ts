import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TIER3_ROLE_PERMISSIONS } from '@/lib/tier3';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, userId, role } = body;

    if (!companyId || !userId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, userId, role' },
        { status: 400 }
      );
    }

    // Verify role exists in TIER3_ROLE_PERMISSIONS
    const validRoles = Object.keys(TIER3_ROLE_PERMISSIONS);
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Assign field role to user
    const { data, error } = await supabase
      .from('tier3_field_roles')
      .insert([
        {
          company_id: companyId,
          user_id: userId,
          role,
          assigned_at: new Date().toISOString(),
          assigned_by: body.assignedBy || null,
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
    const userId = request.nextUrl.searchParams.get('userId');

    let query = supabase.from('tier3_field_roles').select('*');

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (userId) {
      query = query.eq('user_id', userId);
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

export async function DELETE(request: NextRequest) {
  try {
    const roleId = request.nextUrl.searchParams.get('roleId');

    if (!roleId) {
      return NextResponse.json(
        { error: 'roleId is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('tier3_field_roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
