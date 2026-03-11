import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../lib/serverUser";

const BUCKET_ID = "photos";
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB cap for quick evidence snaps

export const runtime = "nodejs";

async function ensureBucketExists() {
  const { data, error } = await supabaseServer.storage.getBucket(BUCKET_ID);
  if (!data) {
    if (error && !/not found/i.test(error.message)) {
      throw new Error(`Unable to read storage bucket: ${error.message}`);
    }
    const { error: createError } = await supabaseServer.storage.createBucket(BUCKET_ID, { public: true });
    if (createError && !/exists/i.test(createError.message)) {
      throw new Error(`Unable to create photos bucket: ${createError.message}`);
    }
    return;
  }
  if (!data.public) {
    const { error: updateError } = await supabaseServer.storage.updateBucket(BUCKET_ID, { public: true });
    if (updateError) {
      throw new Error(`Unable to mark photos bucket public: ${updateError.message}`);
    }
  }
}

function sanitizeFileName(name: string) {
  const withoutUnsafe = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return withoutUnsafe || "evidence.jpg";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');
  const userId = resolveServerUserId(searchParams.get('user_id'));

  try {
    // If taskId provided, list photos for that task
    if (taskId) {
      const { data, error } = await supabaseServer
        .from('photo_evidence')
        .select('*')
        .eq('task_id', parseInt(taskId))
        .order('created_at', { ascending: false });

      if (error) {
        // Gracefully handle missing table (happens before schema patch)
        if (error.message.includes('not found')) {
          return NextResponse.json({ photos: [], count: 0, note: 'photo_evidence table pending' });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ photos: data || [], count: data?.length || 0 });
    }

    // Otherwise list all photos for current user
    if (userId) {
      const { data, error } = await supabaseServer
        .from('photo_evidence')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // Gracefully handle missing table (happens before schema patch)
        if (error.message.includes('not found')) {
          return NextResponse.json({ photos: [], count: 0, note: 'photo_evidence table pending' });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ photos: data || [], count: data?.length || 0 });
    }

    return NextResponse.json({ photos: [], count: 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch photos';
    // Return empty array instead of error if table doesn't exist yet
    if (message.includes('not found')) {
      return NextResponse.json({ photos: [], count: 0, note: 'photo_evidence table pending' });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Server storage credentials missing" }, { status: 500 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const taskId = formData.get("taskId");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No photo attached" }, { status: 400 });
    }
    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json({ error: "Task reference missing" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Photo exceeds 10 MB limit" }, { status: 400 });
    }

    await ensureBucketExists();

    const filePath = `tasks/${taskId}/${Date.now()}_${sanitizeFileName(file.name)}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseServer.storage.from(BUCKET_ID).upload(filePath, buffer, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseServer.storage.from(BUCKET_ID).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error("Unable to build photo URL");
    }

    return NextResponse.json({ publicUrl: data.publicUrl, path: filePath });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload photo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
