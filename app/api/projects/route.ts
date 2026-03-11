import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

const PROJECT_LIMIT = 6;

export async function GET(req: Request) {
  try {
    // Try to get user context, but gracefully handle missing auth
    const userId = resolveServerUserId(undefined);
    
    // Get all projects - for now return from database, not Sage
    // (Sage doesn't have a "projects" endpoint; projects are in Time Tracking)
    if (userId && userId !== 'demo-user') {
      const { data, error } = await supabaseServer
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .limit(PROJECT_LIMIT);
      
      if (!error && data) {
        return NextResponse.json(data);
      }
    }
    
    // Return empty array for demo users or on error (graceful degradation)
    return NextResponse.json([]);
  } catch (e) {
    return NextResponse.json([]);
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
    console.error('POST /api/projects ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    // Skip project limit for demo users
    const isDemoUser = userId === 'demo' || userId?.startsWith('demo-');
    
    if (!isDemoUser) {
      const { count, error: countError } = await supabaseServer
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('company_id', validCompanyId);
      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }
      if (count !== null && count >= PROJECT_LIMIT) {
        return NextResponse.json({ error: `Project limit reached (${PROJECT_LIMIT})` }, { status: 400 });
      }
    }
    
    const payload = { ...body, user_id: userId, company_id: validCompanyId };
    const { data, error } = await supabaseServer.from('projects').insert([payload]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0], { status: 201 });
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
    return NextResponse.json({ error: 'User ID and project ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('projects')
      .update(fields)
      .eq('id', id)
      .eq('user_id', userId)
      .eq('company_id', validCompanyId)
      .select();
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
    return NextResponse.json({ error: 'User ID and project ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('projects')
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
