import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';
import { getCompanyContext } from '../../../lib/companyContext';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  const companyId = searchParams.get('company_id');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  if (!companyId) {
    return NextResponse.json({ error: 'company_id required' }, { status: 400 });
  }

  try {
    // Validate user has access to company (CRITICAL: prevent demo/live data mixing)
    await getCompanyContext(userId, companyId);

    // Build queries with strict company_id isolation
    const tasksQuery = supabaseServer
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);
    const projectsQuery = supabaseServer
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);
    const invoicesQuery = supabaseServer
      .from('invoices')
      .select('id, amount', { count: 'exact' })
      .eq('company_id', companyId);
    const customersQuery = supabaseServer
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId);
    const itemsQuery = supabaseServer
      .from('items')
      .select('id, price, stock_in', { count: 'exact' })
      .eq('company_id', companyId);
    
    // Fetch counts for each section
    const [tasksCount, projectsCount, invoicesCount, customersCount, itemsCount] = await Promise.all([
      tasksQuery,
      projectsQuery,
      invoicesQuery,
      customersQuery,
      itemsQuery,
    ]);

    const tasksTotal = tasksCount.count || 0;
    const projectsTotal = projectsCount.count || 0;
    const invoicesData = invoicesCount.data || [];
    const invoicesTotal = invoicesCount.count || 0;
    const customersTotal = customersCount.count || 0;
    const itemsData = itemsCount.data || [];
    const itemsTotal = itemsCount.count || 0;

    // Calculate simple totals
    const totalInvoiceAmount = invoicesData.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
    const totalInventoryValue = itemsData.reduce((sum: number, item: any) => sum + ((item.price || 0) * (item.stock_in || 0)), 0);

    // Return simple report with counts and totals
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      userId,
      sections: {
        projects: {
          count: projectsTotal,
          total: projectsTotal,
        },
        tasks: {
          count: tasksTotal,
          total: tasksTotal,
        },
        customers: {
          count: customersTotal,
          total: customersTotal,
        },
        invoices: {
          count: invoicesTotal,
          total: totalInvoiceAmount,
        },
        inventory: {
          count: itemsTotal,
          total: Math.round(totalInventoryValue * 100) / 100,
        },
      },
    });
  } catch (error: any) {
    console.error('Reports error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
