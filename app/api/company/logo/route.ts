import { Buffer } from "node:buffer";
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { ensureAuthUser, EnsureAuthUserError } from "../../../../lib/demoAuth";

const BUCKET_ID = "branding";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const runtime = "nodejs";

async function ensureBucketExists() {
  const { data, error } = await supabaseServer.storage.getBucket(BUCKET_ID);
  if (data) {
    if (!data.public) {
      const { error: updateError } = await supabaseServer.storage.updateBucket(BUCKET_ID, { public: true });
      if (updateError) {
        throw new Error(`Unable to update branding bucket: ${updateError.message}`);
      }
    }
    return;
  }
  if (error && !/not found/i.test(error.message)) {
    throw new Error(`Unable to inspect branding bucket: ${error.message}`);
  }
  const { error: createError } = await supabaseServer.storage.createBucket(BUCKET_ID, { public: true });
  if (createError && !/exists/i.test(createError.message)) {
    throw new Error(`Unable to create branding bucket: ${createError.message}`);
  }
}

function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return cleaned || "logo.png";
}

export async function POST(request: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Storage credentials missing" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const incomingUserId = typeof formData.get("user_id") === "string" ? (formData.get("user_id") as string) : null;
    const userId = resolveServerUserId(incomingUserId);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No logo file provided" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Logo exceeds 5 MB limit" }, { status: 400 });
    }

    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      throw error;
    }

    await ensureBucketExists();

    const filePath = `${userId}/logos/${Date.now()}_${sanitizeFileName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabaseServer.storage.from(BUCKET_ID).upload(filePath, buffer, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabaseServer.storage.from(BUCKET_ID).getPublicUrl(filePath);
    return NextResponse.json({ path: filePath, publicUrl: data?.publicUrl ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload logo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
