import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

const PROJECT_LIMIT = 6;

export async function GET(req: Request) {
  try {
    const userId = resolveServerUserId(undefined);
    
    // Get projects from database
    if (userId && userId !== 'demo-user') {
      let query = supabaseServer
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .limit(PROJECT_LIMIT);
        
      const { data, error } = await query;
      
      if (!error && data) {
        // Ensure company_id is in response
        return NextResponse.json(data.map(p => ({
          ...p,
          company_id: p.company_id || 1  // Default to 1 if not set
        })));
      }
    } else {
      // Demo user or unspecified - get demo projects
      const { data, error } = await supabaseServer
        .from('projects')
        .select('*')
        .limit(PROJECT_LIMIT);
      
      if (!error && data) {
        return NextResponse.json(data.map(p => ({
          ...p,
          company_id: p.company_id || 1
        })));
      }
    }
    
    // Graceful degradation: return empty array
    return NextResponse.json([]);
  } catch (e) {
    console.error('GET /api/projects error:', e);
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

  // Determine company ID with fallback for demo users
  const isDemoUser = userId === 'demo' || userId?.startsWith('demo-');
  let validCompanyId = 1; // Default demo company
  let companyContextError: Error | null = null;
  
  console.log(`[POST /api/projects] User: "${userId}" (isDemoUser: ${isDemoUser})`);
  
  try {
    console.log(`[POST /api/projects] Attempting getCompanyContext...`);
    const context = await getCompanyContext(userId, companyId);
    validCompanyId = context.companyId;
    console.log(`[POST /api/projects] ✅ Got company context: companyId=${validCompanyId}`);
  } catch (contextError) {
    companyContextError = contextError as Error;
    console.warn(`[POST /api/projects] ⚠️  getCompanyContext failed: ${(contextError as Error).message}`);
    
    if (!isDemoUser) {
      console.error(`[POST /api/projects] ❌ Non-demo user failed company context, returning 500`);
      return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
    }
    
    console.log(`[POST /api/projects] ℹ️  Demo user fallback triggered, using company_id=1`);
    // Demo users fall back to company_id = 1
  }
  
  try {
    
    if (!isDemoUser) {
      let countQuery = supabaseServer
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      // Try to use company_id filter if available
      try {
        countQuery = countQuery.eq('company_id', validCompanyId);
      } catch (e) {
        // Column might not exist
      }
      
      const { count, error: countError } = await countQuery;
      if (countError && !countError.message?.includes('company_id')) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }
      if (count !== null && count >= PROJECT_LIMIT) {
        return NextResponse.json({ error: `Project limit reached (${PROJECT_LIMIT})` }, { status: 400 });
      }
    }
    
    // Build payload - exclude company_id to avoid schema errors if column doesn't exist
    const payload = {
      name: body.name,
      description: body.description ?? null,
      photo_url: body.photo_url ?? null,
      user_id: userId,
      ...(body.company_id !== undefined && { company_id: validCompanyId })
    };
    
    const { data, error } = await supabaseServer.from('projects').insert([payload]).select();
    
    if (error) {
      // If schema cache error, try without company_id
      if (error.message?.includes('company_id')) {
        const simplePayload = {
          name: body.name,
          description: body.description ?? null,
          photo_url: body.photo_url ?? null,
          user_id: userId
        };
        const { data: simpleData, error: simpleError } = await supabaseServer
          .from('projects')
          .insert([simplePayload])
          .select();
        
        if (simpleError) {
          console.error('POST /api/projects error:', simpleError);
          return NextResponse.json({ error: simpleError.message }, { status: 500 });
        }
        
        return NextResponse.json({
          ...simpleData[0],
          company_id: validCompanyId
        }, { status: 201 });
      }
      
      console.error('POST /api/projects error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      ...data[0],
      company_id: validCompanyId
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/projects exception:', err);
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
