import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../lib/serverUser';

// Explicitly set the route methods to GET only
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = resolveServerUserId(searchParams.get('user_id'));
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Fetch all required data in parallel
    const [tasksRes, projectsRes, invoicesRes, customersRes, itemsRes] = await Promise.all([
      supabaseServer
        .from('tasks')
        .select('id, name, seconds, status, project_id, billable')
        .eq('user_id', userId),
      supabaseServer
        .from('projects')
        .select('id, name, status')
        .eq('user_id', userId),
      supabaseServer
        .from('invoices')
        .select('id, amount, tax_amount, status, project_id, customer_id')
        .eq('user_id', userId),
      supabaseServer
        .from('customers')
        .select('id, name, email')
        .eq('user_id', userId),
      supabaseServer
        .from('items')
        .select('id, name, unit_price, quantity, category')
        .eq('user_id', userId),
    ]);

    const tasks = tasksRes.data || [];
    const projects = projectsRes.data || [];
    const invoices = invoicesRes.data || [];
    const customers = customersRes.data || [];
    const items = itemsRes.data || [];

    // Calculate metrics
    const totalHoursLogged = Math.round((tasks.reduce((sum, t) => sum + (t.seconds || 0), 0) / 3600) * 100) / 100;
    const billableHours = Math.round(((tasks.filter(t => t.billable).reduce((sum, t) => sum + (t.seconds || 0), 0) / 3600) * 100)) / 100;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const activeTasks = tasks.filter(t => t.status !== 'done').length;

    // Revenue metrics
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalTaxCollected = invoices.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid').length;

    // Inventory value
    const inventoryValue = items.reduce((sum, item) => sum + ((item.unit_price || 0) * (item.quantity || 0)), 0);

    // Project breakdown
    const projectStats = projects.map(project => {
      const projectTasks = tasks.filter(t => t.project_id === project.id);
      const projectInvoices = invoices.filter(inv => inv.project_id === project.id);
      
      return {
        id: project.id,
        name: project.name,
        status: project.status,
        taskCount: projectTasks.length,
        completedTasks: projectTasks.filter(t => t.status === 'done').length,
        hoursLogged: Math.round((projectTasks.reduce((sum, t) => sum + (t.seconds || 0), 0) / 3600) * 100) / 100,
        revenue: projectInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
        invoiceCount: projectInvoices.length,
      };
    });

    // Customer breakdown
    const customerStats = customers.map(customer => {
      const customerInvoices = invoices.filter(inv => inv.customer_id === customer.id);
      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        invoiceCount: customerInvoices.length,
        totalAmount: customerInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
        status: customerInvoices.some(inv => inv.status === 'pending') ? 'pending' : 
                customerInvoices.some(inv => inv.status === 'paid') ? 'paid' : 'none',
      };
    });

    // Category breakdown
    const categoryStats = items.reduce((acc: Record<string, any>, item) => {
      if (!acc[item.category || 'uncategorized']) {
        acc[item.category || 'uncategorized'] = {
          count: 0,
          totalValue: 0,
          items: [],
        };
      }
      acc[item.category || 'uncategorized'].count += 1;
      acc[item.category || 'uncategorized'].totalValue += (item.unit_price || 0) * (item.quantity || 0);
      acc[item.category || 'uncategorized'].items.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        value: (item.unit_price || 0) * (item.quantity || 0),
      });
      return acc;
    }, {});

    // Task status breakdown
    const tasksByStatus = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    };

    // Return comprehensive report
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      userId,
      summary: {
        totalProjects: projects.length,
        totalCustomers: customers.length,
        totalTasks,
        completedTasks,
        activeTasks,
        totalHoursLogged,
        billableHours,
        taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      revenue: {
        totalRevenue,
        paidRevenue: paidInvoices,
        pendingRevenue: pendingInvoices,
        totalTaxCollected,
        invoiceCount: invoices.length,
        unpaidInvoiceCount: unpaidInvoices,
        averageInvoiceValue: invoices.length > 0 ? Math.round((totalRevenue / invoices.length) * 100) / 100 : 0,
      },
      inventory: {
        totalItems: items.length,
        totalValue: Math.round(inventoryValue * 100) / 100,
        categories: Object.keys(categoryStats).length,
        byCategory: categoryStats,
      },
      projects: projectStats,
      customers: customerStats,
      tasksByStatus,
      invoices: {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        pending: invoices.filter(inv => inv.status === 'pending').length,
        draft: invoices.filter(inv => inv.status === 'draft').length,
        cancelled: invoices.filter(inv => inv.status === 'cancelled').length,
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
