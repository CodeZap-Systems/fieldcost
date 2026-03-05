import { NextResponse } from 'next/server';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../lib/demoAuth';
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID, normalizeUserId } from '../../../../lib/userIdentity';

function uniqueTargets(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value?.trim()))));
}

export async function POST(req: Request) {
  let body: { user_ids?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    // ignore malformed / empty payloads and fall back to defaults
  }

  const fallback = uniqueTargets([DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID]);
  const targets = uniqueTargets(Array.isArray(body.user_ids) && body.user_ids.length ? body.user_ids : fallback);

  if (targets.length === 0) {
    return NextResponse.json({ error: 'No user_ids provided and no demo defaults available.' }, { status: 400 });
  }

  const created: string[] = [];
  const failed: Array<{ user_id: string; error: string }> = [];

  for (const candidate of targets) {
    const normalized = normalizeUserId(candidate, candidate);
    if (!normalized) continue;
    try {
      await ensureAuthUser(normalized);
      created.push(normalized);
    } catch (error) {
      const message = error instanceof EnsureAuthUserError ? error.message : 'Unexpected error ensuring auth user';
      console.error('POST /api/demo/users ensureAuthUser error:', error);
      failed.push({ user_id: normalized, error: message });
    }
  }

  const status = failed.length ? (created.length ? 207 : 500) : 200;
  return NextResponse.json({ created, failed }, { status });
}
