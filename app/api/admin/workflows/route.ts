/**
 * ADMIN API - Custom Workflows Management
 * 
 * Create and manage custom mining/construction workflows
 */

import { adminAuthMiddleware } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  allowedTransitions: string[];
  requiresPhotoEvidence: boolean;
  requiresGPSVerification: boolean;
  estimatedDurationHours: number;
  notifyRoles: string[];
}

export interface CustomWorkflow {
  id: string;
  companyId: string;
  name: string;
  description: string;
  applicableTo: 'mining' | 'construction' | 'general';
  stages: WorkflowStage[];
  requiresApproval: boolean;
  approvalChain: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    // Mock data - in production fetch from database
    const sampleWorkflows: CustomWorkflow[] = companyId ? [
      {
        id: 'wf-001',
        companyId,
        name: 'Open Pit Mining Daily Cycle',
        description: 'Standard workflow for open pit mining operations',
        applicableTo: 'mining',
        stages: [
          {
            id: 'stage-1',
            name: 'Safety Check',
            order: 1,
            allowedTransitions: ['stage-2'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: true,
            estimatedDurationHours: 1,
            notifyRoles: ['supervisor', 'site_manager'],
          },
          {
            id: 'stage-2',
            name: 'Excavation',
            order: 2,
            allowedTransitions: ['stage-3'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: false,
            estimatedDurationHours: 8,
            notifyRoles: ['site_manager'],
          },
          {
            id: 'stage-3',
            name: 'Quality Verification',
            order: 3,
            allowedTransitions: ['stage-4'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: true,
            estimatedDurationHours: 2,
            notifyRoles: ['project_manager'],
          },
          {
            id: 'stage-4',
            name: 'Sign-off',
            order: 4,
            allowedTransitions: [],
            requiresPhotoEvidence: false,
            requiresGPSVerification: false,
            estimatedDurationHours: 0.5,
            notifyRoles: ['project_manager'],
          },
        ],
        requiresApproval: true,
        approvalChain: ['supervisor', 'project_manager'],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
      {
        id: 'wf-002',
        companyId,
        name: 'Building Foundation Template',
        description: 'Workflow for construction foundation work',
        applicableTo: 'construction',
        stages: [
          {
            id: 'stage-1',
            name: 'Site Preparation',
            order: 1,
            allowedTransitions: ['stage-2'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: true,
            estimatedDurationHours: 4,
            notifyRoles: ['supervisor'],
          },
          {
            id: 'stage-2',
            name: 'Formwork Installation',
            order: 2,
            allowedTransitions: ['stage-3'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: false,
            estimatedDurationHours: 6,
            notifyRoles: ['supervisor', 'site_manager'],
          },
          {
            id: 'stage-3',
            name: 'Concrete Pour',
            order: 3,
            allowedTransitions: ['stage-4'],
            requiresPhotoEvidence: true,
            requiresGPSVerification: false,
            estimatedDurationHours: 8,
            notifyRoles: ['site_manager'],
          },
          {
            id: 'stage-4',
            name: 'Inspection & Approval',
            order: 4,
            allowedTransitions: [],
            requiresPhotoEvidence: true,
            requiresGPSVerification: false,
            estimatedDurationHours: 2,
            notifyRoles: ['project_manager'],
          },
        ],
        requiresApproval: true,
        approvalChain: ['supervisor', 'project_manager'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ] : [];

    return NextResponse.json({ workflows: sampleWorkflows });
  } catch (error) {
    console.error('Workflows GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { companyId, name, description, applicableTo, stages, requiresApproval, approvalChain } = body;

    if (!companyId || !name || !stages || stages.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, insert into database
    // await supabase
    //   .from('custom_workflows')
    //   .insert({
    //     company_id: companyId,
    //     name,
    //     description,
    //     applicable_to: applicableTo,
    //     stages: JSON.stringify(stages),
    //     requires_approval: requiresApproval,
    //     approval_chain: approvalChain,
    //   });

    return NextResponse.json({
      success: true,
      message: 'Workflow created successfully',
    });
  } catch (error) {
    console.error('Workflows POST error:', error);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { workflowId, name, description, stages, requiresApproval, approvalChain } = body;

    if (!workflowId) {
      return NextResponse.json({ error: "Missing workflowId" }, { status: 400 });
    }

    // In production, update the database
    // await supabase
    //   .from('custom_workflows')
    //   .update({
    //     name,
    //     description,
    //     stages: JSON.stringify(stages),
    //     requires_approval: requiresApproval,
    //     approval_chain: approvalChain,
    //   })
    //   .eq('id', workflowId);

    return NextResponse.json({
      success: true,
      message: 'Workflow updated successfully',
    });
  } catch (error) {
    console.error('Workflows PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await adminAuthMiddleware(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get('id');

    if (!workflowId) {
      return NextResponse.json({ error: "Missing workflowId" }, { status: 400 });
    }

    // In production, mark as inactive
    // await supabase
    //   .from('custom_workflows')
    //   .update({ is_active: false })
    //   .eq('id', workflowId);

    return NextResponse.json({
      success: true,
      message: 'Workflow deactivated successfully',
    });
  } catch (error) {
    console.error('Workflows DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}
