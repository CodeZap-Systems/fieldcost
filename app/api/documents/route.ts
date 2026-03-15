/**
 * Documents API Route
 * Manage document uploads, linking to projects, and verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { resolveServerUserId } from '@/lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '@/lib/ensureAuthUser';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get('user_id'));

    // Validate authentication
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: 'Unable to prepare user context' },
        { status: 500 }
      );
    }

    const {
      action,
      fileName,
      fileUrl,
      fileType,
      projectId,
      companyId,
      documentType,
    } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'action is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'upload': {
        return await uploadDocument({
          fileName,
          fileUrl,
          fileType,
          projectId,
          companyId,
          userId,
          documentType,
        });
      }

      case 'link-to-project': {
        const { documentId } = body;
        return await linkToProject({
          documentId,
          projectId,
          companyId,
          userId,
        });
      }

      case 'verify': {
        const { documentId } = body;
        return await verifyDocument({
          documentId,
          companyId,
          userId,
        });
      }

      case 'get-project-documents': {
        return await getProjectDocuments({
          projectId,
          companyId,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Documents API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Upload document
 */
async function uploadDocument({
  fileName,
  fileUrl,
  fileType,
  projectId,
  companyId,
  userId,
  documentType,
}: {
  fileName: string;
  fileUrl: string;
  fileType: string;
  projectId?: number;
  companyId: number;
  userId: string;
  documentType?: string;
}) {
  try {
    const { data, error } = await supabaseServer
      .from('documents')
      .insert({
        name: fileName,
        file_url: fileUrl,
        file_type: fileType,
        document_type: documentType || 'general',
        project_id: projectId || null,
        company_id: companyId,
        uploaded_by: userId,
        status: 'pending_verification',
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: data,
    });
  } catch (error) {
    console.error('Upload document error:', error);
    throw error;
  }
}

/**
 * Link document to project
 */
async function linkToProject({
  documentId,
  projectId,
  companyId,
  userId,
}: {
  documentId: number;
  projectId: number;
  companyId: number;
  userId: string;
}) {
  try {
    const { error } = await supabaseServer
      .from('documents')
      .update({ project_id: projectId })
      .eq('id', documentId)
      .eq('company_id', companyId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Document linked to project',
      documentId,
    });
  } catch (error) {
    console.error('Link to project error:', error);
    throw error;
  }
}

/**
 * Verify document
 */
async function verifyDocument({
  documentId,
  companyId,
  userId,
}: {
  documentId: number;
  companyId: number;
  userId: string;
}) {
  try {
    const { error } = await supabaseServer
      .from('documents')
      .update({
        status: 'verified',
        verified_at: new Date(),
        verified_by: userId,
      })
      .eq('id', documentId)
      .eq('company_id', companyId);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Document verified',
      documentId,
    });
  } catch (error) {
    console.error('Verify document error:', error);
    throw error;
  }
}

/**
 * Get all documents for a project
 */
async function getProjectDocuments({
  projectId,
  companyId,
}: {
  projectId: number;
  companyId: number;
}) {
  try {
    const { data, error } = await supabaseServer
      .from('documents')
      .select('*')
      .eq('project_id', projectId)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      success: true,
      documents: data || [],
    });
  } catch (error) {
    console.error('Get project documents error:', error);
    throw error;
  }
}

/**
 * GET endpoint to retrieve documents
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('project_id');
    const companyId = searchParams.get('company_id');

    if (!projectId || !companyId) {
      return NextResponse.json(
        { error: 'project_id and company_id are required' },
        { status: 400 }
      );
    }

    return await getProjectDocuments({
      projectId: parseInt(projectId),
      companyId: parseInt(companyId),
    });
  } catch (error) {
    console.error('GET documents error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    );
  }
}
