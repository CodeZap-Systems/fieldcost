import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Fetch counts for each section
    const [tasksCount, projectsCount, invoicesCount, customersCount, itemsCount] = await Promise.all([
      supabaseServer
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseServer
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseServer
        .from('invoices')
        .select('id, amount', { count: 'exact' })
        .eq('user_id', userId),
      supabaseServer
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabaseServer
        .from('items')
        .select('id, price, stock_in', { count: 'exact' })
        .eq('user_id', userId),
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
