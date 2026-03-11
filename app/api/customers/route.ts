import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  try {
    const userId = resolveServerUserId(undefined);
    
    // Get customers from database with company_id
    if (userId && userId !== 'demo-user') {
      const { data, error } = await supabaseServer
        .from('customers')
        .select('*')
        .eq('user_id', userId);
      
      if (!error && Array.isArray(data)) {
        return NextResponse.json(data.map(c => ({
          ...c,
          company_id: c.company_id || 1
        })));
      }
    } else {
      // Demo user - get demo customers
      const { data, error } = await supabaseServer
        .from('customers')
        .select('*');
      
      if (!error && Array.isArray(data)) {
        return NextResponse.json(data.map(c => ({
          ...c,
          company_id: c.company_id || 1
        })));
      }
    }
    
    // Graceful degradation: return empty array
    return NextResponse.json([]);
  } catch (e) {
    // Handle all errors gracefully
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
    console.error('POST /api/customers ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const payload = { ...body, user_id: userId, company_id: validCompanyId };
    const { data, error } = await supabaseServer.from('customers').insert([payload]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: 'User ID and customer ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('customers')
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
    return NextResponse.json({ error: 'User ID and customer ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('customers')
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
