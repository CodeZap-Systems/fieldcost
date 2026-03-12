import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { getCompanyContext } from '../../../lib/companyContext';

export async function GET(req: Request) {
  try {
    const userId = resolveServerUserId(undefined);
    
    // Get items from database with company_id
    if (userId && userId !== 'demo-user') {
      const { data, error } = await supabaseServer
        .from('items')
        .select('*')
        .eq('user_id', userId);
      
      if (!error && Array.isArray(data)) {
        return NextResponse.json(data.map(item => ({
          ...item,
          company_id: item.company_id || 1
        })));
      }
    } else {
      // Demo user - get demo items
      const { data, error } = await supabaseServer
        .from('items')
        .select('*');
      
      if (!error && Array.isArray(data)) {
        return NextResponse.json(data.map(item => ({
          ...item,
          company_id: item.company_id || 1
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
    console.error('POST /api/items ensureAuthUser error:', error);
    return NextResponse.json({ error: 'Unable to prepare user context' }, { status: 500 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const payload = {
      name: body.name,
      price: body.price ?? null,
      stock_in: body.stock_in ?? 0,
      stock_used: body.stock_used ?? 0,
      item_type: body.item_type ?? 'physical',
      user_id: userId,
      ...(body.company_id !== undefined && { company_id: validCompanyId })
    };
    
    const { data, error } = await supabaseServer.from('items').insert([payload]).select();
    
    if (error) {
      // If schema cache error, try without company_id
      if (error.message?.includes('company_id')) {
        const simplePayload = {
          name: body.name,
          price: body.price ?? null,
          stock_in: body.stock_in ?? 0,
          stock_used: body.stock_used ?? 0,
          item_type: body.item_type ?? 'physical',
          user_id: userId
        };
        const { data: simpleData, error: simpleError } = await supabaseServer
          .from('items')
          .insert([simplePayload])
          .select();
        
        if (simpleError) {
          console.error('POST /api/items error:', simpleError);
          return NextResponse.json({ error: simpleError.message }, { status: 500 });
        }
        
        return NextResponse.json({
          ...simpleData[0],
          company_id: validCompanyId
        }, { status: 201 });
      }
      
      console.error('POST /api/items error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      ...data[0],
      company_id: validCompanyId
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/items exception:', err);
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, user_id: incomingUserId, company_id: incomingCompanyId, ...fields } = body;
  const userId = resolveServerUserId(incomingUserId);
  const companyId = incomingCompanyId;
  
  if (!userId || !id) {
    return NextResponse.json({ error: 'User ID and item ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { data, error } = await supabaseServer
      .from('items')
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
    return NextResponse.json({ error: 'User ID and item ID required' }, { status: 400 });
  }

  try {
    const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
    
    const { error } = await supabaseServer
      .from('items')
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
