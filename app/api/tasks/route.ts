import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('tasks')
      .select('*, crew_member:crew_members(id, name, hourly_rate)')
      .eq('user_id', userId)
      .eq('company_id', validCompanyId)
      .order('id', { ascending: false });
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const userId = resolveServerUserId(body.user_id);
  const companyId = body.company_id;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    await ensureAuthUser(userId);
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/tasks ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
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
      company_id: validCompanyId,
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
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, user_id: incomingUserId, company_id: incomingCompanyId, ...fields } = body;
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and task ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
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
      .eq('company_id', validCompanyId)
      .select('*, crew_member:crew_members(id, name, hourly_rate)');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { id, user_id: incomingUserId, company_id: incomingCompanyId } = await req.json();
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and task ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
