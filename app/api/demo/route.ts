import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';
import { ensureAuthUser, EnsureAuthUserError } from '../../../lib/demoAuth';
import { applyRateLimit } from '../../../lib/rateLimit';

function sanitizeCompanyName(company?: string) {
  const trimmed = company?.trim();
  if (!trimmed) return null;
  const slug = trimmed.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'demo';
  return { label: trimmed, slug };
}

export async function POST(req: Request) {
  try {
    // Apply rate limiting: max 10 demo logins per 15 minutes per IP
    const rateLimitCheck = applyRateLimit(req, { maxRequests: 10, windowMs: 15 * 60 * 1000 });
    if (!rateLimitCheck.allowed) {
      return rateLimitCheck.response;
    }
    const body = await req.json();
    const sanitized = sanitizeCompanyName(body?.company);
    if (!sanitized) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const demoUserId = `demo-${sanitized.slug}-${Date.now()}`;
    await ensureAuthUser(demoUserId);

    const projectsInsert = await supabaseServer
      .from('projects')
      .insert([
        { name: 'Demo Project Alpha', description: 'Earthworks for Site A', user_id: demoUserId },
        { name: 'Demo Project Beta', description: 'Mining pit expansion', user_id: demoUserId },
      ])
      .select();
    if (projectsInsert.error) throw projectsInsert.error;
    const [projectAlpha, projectBeta] = projectsInsert.data ?? [];

    const customersInsert = await supabaseServer
      .from('customers')
      .insert([
        { name: 'Acme Construction', email: 'acme@example.com', user_id: demoUserId },
        { name: 'Beta Mining', email: 'beta@example.com', user_id: demoUserId },
      ])
      .select();
    if (customersInsert.error) throw customersInsert.error;
    const [customerAcme, customerBeta] = customersInsert.data ?? [];

    const itemsInsert = await supabaseServer.from('items').insert([
      { name: 'Diesel', price: 20.0, stock_in: 1000, stock_used: 200, user_id: demoUserId },
      { name: 'Cement', price: 80.0, stock_in: 500, stock_used: 120, user_id: demoUserId },
    ]);
    if (itemsInsert.error) throw itemsInsert.error;

    const taskPayload = [] as { name: string; project_id: number; seconds: number; status: string; user_id: string }[];
    if (projectAlpha?.id) {
      taskPayload.push(
        { name: 'Excavate trench', project_id: projectAlpha.id, seconds: 7200, status: 'done', user_id: demoUserId },
        { name: 'Pour concrete', project_id: projectAlpha.id, seconds: 3600, status: 'in-progress', user_id: demoUserId }
      );
    }
    if (projectBeta?.id) {
      taskPayload.push({ name: 'Haul material', project_id: projectBeta.id, seconds: 1800, status: 'todo', user_id: demoUserId });
    }
    if (taskPayload.length) {
      const tasksInsert = await supabaseServer.from('tasks').insert(taskPayload);
      if (tasksInsert.error) throw tasksInsert.error;
    }

    const invoicePayload = [] as { customer_id: number; amount: number; description: string; user_id: string }[];
    if (customerAcme?.id) {
      invoicePayload.push({ customer_id: customerAcme.id, amount: 5000.0, description: 'Earthworks completed', user_id: demoUserId });
    }
    if (customerBeta?.id) {
      invoicePayload.push({ customer_id: customerBeta.id, amount: 12000.0, description: 'Mining pit expansion', user_id: demoUserId });
    }
    if (invoicePayload.length) {
      const invoicesInsert = await supabaseServer.from('invoices').insert(invoicePayload);
      if (invoicesInsert.error) throw invoicesInsert.error;
    }

    const budgetPayload = [] as { project_id: number; planned_amount: number; actual_amount: number; user_id: string }[];
    if (projectAlpha?.id) {
      budgetPayload.push({ project_id: projectAlpha.id, planned_amount: 10000.0, actual_amount: 8000.0, user_id: demoUserId });
    }
    if (projectBeta?.id) {
      budgetPayload.push({ project_id: projectBeta.id, planned_amount: 20000.0, actual_amount: 12000.0, user_id: demoUserId });
    }
    if (budgetPayload.length) {
      const budgetsInsert = await supabaseServer.from('budgets').insert(budgetPayload);
      if (budgetsInsert.error) throw budgetsInsert.error;
    }

    return NextResponse.json({ success: true, company: sanitized.label, demoUserId });
  } catch (error) {
    if (error instanceof EnsureAuthUserError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error('POST /api/demo error:', error);
    return NextResponse.json({ error: 'Failed to seed demo data' }, { status: 500 });
  }
}
