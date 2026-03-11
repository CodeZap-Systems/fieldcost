import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePhotoEvidenceChain } from '@/lib/tier3';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      taskId,
      projectId,
      photoUrl,
      photoHash,
      capturedByCrewMemberId,
      capturedAtLatitude,
      capturedAtLongitude,
      capturedAtGpsAccuracy,
      legalGradeVerified,
      mimeType,
    } = body;

    if (!taskId || !projectId || !photoUrl || !photoHash) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, projectId, photoUrl, photoHash' },
        { status: 400 }
      );
    }

    // Create photo evidence entry
    const { data: photoData, error: photoError } = await supabase
      .from('photo_evidence')
      .insert([
        {
          task_id: taskId,
          project_id: projectId,
          photo_url: photoUrl,
          photo_hash: photoHash,
          captured_at: new Date().toISOString(),
          captured_by_crew_member_id: capturedByCrewMemberId || null,
          captured_at_latitude: capturedAtLatitude,
          captured_at_longitude: capturedAtLongitude,
          captured_at_gps_accuracy: capturedAtGpsAccuracy,
          legal_grade_verified: legalGradeVerified || false,
          mime_type: mimeType || 'image/jpeg',
          file_size_bytes: body.fileSizeBytes || 0,
        },
      ])
      .select()
      .single();

    if (photoError) {
      return NextResponse.json(
        { error: photoError.message },
        { status: 500 }
      );
    }

    // Generate photo evidence chain for legal defensibility
    const chainResult = generatePhotoEvidenceChain(photoData);

    // Record chain of custody entry
    const { error: chainError } = await supabase
      .from('photo_evidence_chain')
      .insert([
        {
          photo_id: photoData.id,
          chain_sequence: 1,
          holder_user_id: capturedByCrewMemberId || null,
          held_from: new Date().toISOString(),
          held_to: null,
          action: 'PHOTO_CAPTURED',
          notes: `Photo captured and verified. Hash: ${photoHash}`,
        },
      ]);

    if (chainError) {
      console.error('Chain of custody error:', chainError);
      // Don't fail the request if chain creation fails
    }

    return NextResponse.json(
      {
        photoEvidence: photoData,
        chain: chainResult,
      },
      { status: 201 }
    );
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
    const projectId = request.nextUrl.searchParams.get('projectId');
    const photoId = request.nextUrl.searchParams.get('photoId');
    const includeChain = request.nextUrl.searchParams.get('includeChain') === 'true';

    let query = supabase.from('photo_evidence').select('*');

    if (photoId) {
      query = query.eq('id', photoId);
      const { data, error } = await query.single();
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });

      if (includeChain) {
        const { data: chainData } = await supabase
          .from('photo_evidence_chain')
          .select('*')
          .eq('photo_id', photoId)
          .order('chain_sequence', { ascending: true });

        return NextResponse.json({ ...data, chain: chainData || [] });
      }
      return NextResponse.json(data);
    }

    if (taskId) {
      query = query.eq('task_id', taskId);
    }

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query.order('captured_at', { ascending: false });

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
    const photoId = request.nextUrl.searchParams.get('photoId');
    if (!photoId) {
      return NextResponse.json(
        { error: 'photoId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase
      .from('photo_evidence')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', photoId)
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
