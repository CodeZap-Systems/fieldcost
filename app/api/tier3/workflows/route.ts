import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MINING_WORKFLOW_TEMPLATE } from '@/lib/tier3';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      name,
      applicableTo,
      stages,
      requiresApproval,
      approvalChain,
    } = body;

    if (!companyId || !name || !stages || !Array.isArray(stages)) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, name, stages (array)' },
        { status: 400 }
      );
    }

    // Create custom workflow
    const { data: workflowData, error: workflowError } = await supabase
      .from('custom_workflows')
      .insert([
        {
          company_id: companyId,
          name,
          applicable_to: applicableTo || 'general',
          requires_approval: requiresApproval || false,
          approval_chain: approvalChain || [],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (workflowError) {
      return NextResponse.json(
        { error: workflowError.message },
        { status: 500 }
      );
    }

    // Insert workflow stages
    const stageInserts = stages.map((stage: any, index: number) => ({
      workflow_id: workflowData.id,
      name: stage.name,
      stage_order: stage.order || index + 1,
      allowed_transitions: stage.allowedTransitions || [],
      requires_photo_evidence: stage.requiresPhotoEvidence || false,
      requires_gps_verification: stage.requiresGPSVerification || false,
      estimated_duration_hours: stage.estimatedDurationHours || 0,
      notify_roles: stage.notifyRoles || [],
    }));

    const { error: stagesError } = await supabase
      .from('workflow_stages')
      .insert(stageInserts);

    if (stagesError) {
      console.error('Stages insertion error:', stagesError);
      // Don't fail if stages don't insert
    }

    // Fetch complete workflow with stages
    const { data: completeWorkflow } = await supabase
      .from('custom_workflows')
      .select('*, workflow_stages(*)')
      .eq('id', workflowData.id)
      .single();

    return NextResponse.json(completeWorkflow, { status: 201 });
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
    const workflowId = request.nextUrl.searchParams.get('workflowId');
    const applicableTo = request.nextUrl.searchParams.get('applicableTo');

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('custom_workflows')
      .select('*, workflow_stages(*)')
      .eq('company_id', companyId);

    if (workflowId) {
      query = query.eq('id', workflowId);
      const { data, error } = await query.single();
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json(data);
    }

    if (applicableTo) {
      query = query.eq('applicable_to', applicableTo);
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


