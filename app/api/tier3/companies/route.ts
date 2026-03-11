import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Tier3Company } from '@/lib/tier3';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<Tier3Company>;

    // Validate required fields
    if (!body.name || !body.registrationNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: name, registrationNumber' },
        { status: 400 }
      );
    }

    // Create Tier 3 company
    const { data, error } = await supabase
      .from('tier3_companies')
      .insert([
        {
          name: body.name,
          registration_number: body.registrationNumber,
          parent_company_id: body.parentCompanyId || null,
          default_currency: body.defaultCurrency || 'ZAR',
          supported_currencies: body.supportedCurrencies || ['ZAR', 'USD', 'EUR'],
          tier: 3,
          max_active_projects: body.maxActiveProjects || 50,
          max_users: body.maxUsers || 200,
          has_dedicated_support: body.hasDedicatedSupport ?? true,
          sla_tier: body.slaTier || 'gold',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const companyId = request.nextUrl.searchParams.get('companyId');

    let query = supabase.from('tier3_companies').select('*');

    if (companyId) {
      query = query.eq('id', companyId);
      const { data, error } = await query.single();
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json(data);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const companyId = request.nextUrl.searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'companyId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tier3_companies')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
