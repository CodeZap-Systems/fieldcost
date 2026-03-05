import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const query = supabaseServer
    .from('tasks')
    .select('*, crew_member:crew_members(id, name, hourly_rate)')
    .order('id', { ascending: false });
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
    console.error('POST /api/tasks ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }
  const crewId = body.crew_member_id ? Number(body.crew_member_id) : null;
  const payload = {
    name: body.name,
    description: body.description ?? null,
    project_id: body.project_id ?? null,
    status: body.status ?? 'todo',
    seconds: body.seconds ?? 0,
    assigned_to: body.assigned_to ?? null,
    crew_member_id: crewId,
    billable: typeof body.billable === 'boolean' ? body.billable : body.billable === 'false' ? false : true,
    photo_url: body.photo_url ?? null,
    user_id: userId,
  };
  const { data, error } = await supabaseServer
    .from('tasks')
    .insert([payload])
    .select('*, crew_member:crew_members(id, name, hourly_rate)');
  if (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, user_id: incomingUserId, ...fields } = body;
  const userId = resolveServerUserId(incomingUserId);
  if (Object.prototype.hasOwnProperty.call(fields, 'crew_member_id')) {
    fields.crew_member_id = fields.crew_member_id ? Number(fields.crew_member_id) : null;
  }
  if (Object.prototype.hasOwnProperty.call(fields, 'billable') && typeof fields.billable !== 'boolean') {
    fields.billable = fields.billable !== 'false';
  }
  const { data, error } = await supabaseServer
    .from('tasks')
    .update(fields)
    .eq('id', id)
    .eq('user_id', userId)
    .select('*, crew_member:crew_members(id, name, hourly_rate)');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(req: Request) {
  const { id, user_id: incomingUserId } = await req.json();
  const userId = resolveServerUserId(incomingUserId);
  const { error } = await supabaseServer.from('tasks').delete().eq('id', id).eq('user_id', userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
