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
      projectId,
      taskId,
      status,
      earnedValue,
      actualCostToDate,
      budgetedCostToDate,
      variance,
      currency,
      photoCertificationCount,
      crewPresenceVerified,
    } = body;

    if (!projectId || !taskId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, taskId, status' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['todo', 'in_progress', 'complete', 'approved', 'invoiced'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Create WIP snapshot
    const { data, error } = await supabase
      .from('tier3_wip_snapshots')
      .insert([
        {
          project_id: projectId,
          task_id: taskId,
          status,
          earned_value: earnedValue || 0,
          actual_cost_to_date: actualCostToDate || 0,
          budgeted_cost_to_date: budgetedCostToDate || 0,
          variance: variance || 0,
          currency: currency || 'ZAR',
          photo_certification_count: photoCertificationCount || 0,
          crew_presence_verified: crewPresenceVerified || false,
          snapshot_at: new Date().toISOString(),
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
    const projectId = request.nextUrl.searchParams.get('projectId');
    const taskId = request.nextUrl.searchParams.get('taskId');

    let query = supabase
      .from('tier3_wip_snapshots')
      .select('*')
      .order('snapshot_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    if (taskId) {
      query = query.eq('task_id', taskId);
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

export async function PUT(request: NextRequest) {
  try {
    const wipId = request.nextUrl.searchParams.get('wipId');
    if (!wipId) {
      return NextResponse.json(
        { error: 'wipId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('tier3_wip_snapshots')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', wipId)
      .select()
      .single();

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
