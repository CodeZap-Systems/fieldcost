import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';

const PROJECT_LIMIT = 6;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const query = supabaseServer.from('projects').select('*').order('id', { ascending: false });
  const finalQuery = userId ? query.eq('user_id', userId) : query;
  const { data, error } = await finalQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = resolveServerUserId(body.user_id);
  try {
    await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/projects ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }
  const { count, error: countError } = await supabaseServer
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }
  if (count !== null && count >= PROJECT_LIMIT) {
    return NextResponse.json({ error: `Project limit reached (${PROJECT_LIMIT})` }, { status: 400 });
  }
  const payload = { ...body, user_id: userId };
  const { data, error } = await supabaseServer.from('projects').insert([payload]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, user_id: incomingUserId, ...fields } = body;
  const userId = resolveServerUserId(incomingUserId);
  const { data, error } = await supabaseServer
    .from('projects')
    .update(fields)
    .eq('id', id)
    .eq('user_id', userId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request) {
  const { id, user_id: incomingUserId } = await req.json();
  const userId = resolveServerUserId(incomingUserId);
  const { error } = await supabaseServer.from('projects').delete().eq('id', id).eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
