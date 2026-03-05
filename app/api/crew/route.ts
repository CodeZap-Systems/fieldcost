import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const query = supabaseServer.from('crew_members').select('*').order('name', { ascending: true });
  const finalQuery = userId ? query.eq('user_id', userId) : query;
  const { data, error } = await finalQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
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
    console.error('POST /api/crew ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  const payload = {
    name: body.name,
    hourly_rate: typeof body.hourly_rate === 'number' ? body.hourly_rate : Number(body.hourly_rate) || 0,
    user_id: userId,
  };

  const { data, error } = await supabaseServer.from('crew_members').insert([payload]).select();
  if (error) {
    console.error('POST /api/crew error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data?.[0]);
}
