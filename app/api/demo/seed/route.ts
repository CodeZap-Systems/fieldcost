import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { ensureAuthUser, EnsureAuthUserError } from '../../../../lib/demoAuth';
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID } from '../../../../lib/userIdentity';

const demoUserIds = Array.from(
  new Set(
    [DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID].filter((value): value is string => Boolean(value?.trim()))
  )
);

const customerSeed = [
  { user_id: DEMO_ADMIN_USER_ID, name: 'Mbali Civil Works', email: 'projects@mbali.co.za' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Kopano Mining JV', email: 'ops@kopanomining.africa' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Sunset Aggregates', email: 'finance@sunsetagg.co.za' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Highveld Crushing', email: 'info@highveldcrushing.co.za' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'MoAfrika Minerals', email: 'admin@moafrika-minerals.co.za' },
].filter(seed => demoUserIds.includes(seed.user_id));

const projectSeed = [
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'Haul Road Rehab',
    description: 'Stabilise, widen, and cap the 4 km haul road between pits.',
    photo_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60',
    planned_amount: 1_200_000,
    actual_amount: 845_000,
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'Process Plant Refurb',
    description: 'Replace worn chute liners and recalibrate secondary crushers.',
    photo_url: 'https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=800&q=60',
    planned_amount: 980_000,
    actual_amount: 1_020_000,
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'Tailings Storage Lift',
    description: 'Raise TSF wall by 3m with compacted engineered fill.',
    photo_url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60',
    planned_amount: 2_400_000,
    actual_amount: 1_250_000,
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    name: 'Drill & Blast Campaign',
    description: '120-hole pattern for north pit pushback.',
    photo_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
    planned_amount: 680_000,
    actual_amount: 320_000,
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    name: 'Crusher Maintenance Blitz',
    description: 'Three-day shutdown to swap liners and bearings.',
    photo_url: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=60',
    planned_amount: 410_000,
    actual_amount: 180_000,
  },
].filter(seed => demoUserIds.includes(seed.user_id));

const itemSeed = [
  { user_id: DEMO_ADMIN_USER_ID, name: 'Diesel (50 ppm)', price: 24.85, stock_in: 18_000, stock_used: 13_200, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Explosive Pack ANFO (1 t)', price: 8_650, stock_in: 18, stock_used: 12, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Conveyor Belt Repair Kit', price: 14_500, stock_in: 9, stock_used: 4, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'On-site Survey Crew (day)', price: 7_800, stock_in: 22, stock_used: 15, item_type: 'service' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Crusher Specialist Callout', price: 12_500, stock_in: 12, stock_used: 6, item_type: 'service' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Wear Plate Set', price: 9_800, stock_in: 30, stock_used: 21, item_type: 'physical' },
].filter(seed => demoUserIds.includes(seed.user_id));

const taskSeed = [
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Haul Road Rehab', name: 'Survey control & pegging', description: 'Lay out widened alignment and check crossfall.', status: 'done', seconds: 16_200, assigned_to: 'Sipho Dlamini' },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Haul Road Rehab', name: 'Lime stabilisation run 1', description: 'Blend lime across km 2-3 section.', status: 'in-progress', seconds: 8_700, assigned_to: 'Lerato Maseko' },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Process Plant Refurb', name: 'Chute liner strip-out', description: 'Remove worn liners on secondary feed chute.', status: 'done', seconds: 20_400, assigned_to: 'Thando Nkosi' },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Process Plant Refurb', name: 'Crusher recalibration', description: 'Laser align crusher gap before restart.', status: 'todo', seconds: 0, assigned_to: 'Nomsa Khumalo' },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Tailings Storage Lift', name: 'Geotech inspections', description: 'Log compaction results and densities by zone.', status: 'in-progress', seconds: 5_400, assigned_to: 'Sipho Dlamini' },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Tailings Storage Lift', name: 'Crest drainage tie-in', description: 'Install HDPE drains into existing spillway.', status: 'todo', seconds: 0, assigned_to: 'Lerato Maseko' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Drill & Blast Campaign', name: 'Pattern drilling', description: 'Complete 120-hole pattern with 165 mm holes.', status: 'in-progress', seconds: 11_100, assigned_to: 'Sipho Dlamini' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Drill & Blast Campaign', name: 'Explosive loading', description: 'Load ANFO and boosters with QA sheet.', status: 'todo', seconds: 0, assigned_to: 'Thando Nkosi' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Crusher Maintenance Blitz', name: 'Liner swap prep', description: 'Loosen backing material and stage new sets.', status: 'done', seconds: 9_600, assigned_to: 'Nomsa Khumalo' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Crusher Maintenance Blitz', name: 'Bearing inspection', description: 'Inspect main shaft bearings during shutdown.', status: 'in-progress', seconds: 4_200, assigned_to: 'Lerato Maseko' },
].filter(seed => demoUserIds.includes(seed.user_id));

const invoiceSeed = [
  { user_id: DEMO_ADMIN_USER_ID, customer_name: 'Mbali Civil Works', amount: 485_000, description: 'Progress draw #3 - Haul road stabilisation and survey.' },
  { user_id: DEMO_ADMIN_USER_ID, customer_name: 'Kopano Mining JV', amount: 320_000, description: 'Process plant shutdown labour & materials.' },
  { user_id: DEMO_ADMIN_USER_ID, customer_name: 'Sunset Aggregates', amount: 215_000, description: 'Tailings lift QA services (week 18).' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, customer_name: 'Highveld Crushing', amount: 155_000, description: 'Crusher blitz callout fee and spares.' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, customer_name: 'MoAfrika Minerals', amount: 265_000, description: 'Drill & blast campaign progress payment.' },
].filter(seed => demoUserIds.includes(seed.user_id));

const keyFor = (userId: string, name: string) => `${userId}::${name}`;

async function ensureDemoUsers() {
  for (const userId of demoUserIds) {
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        throw error;
      }
      throw new Error(`Unable to ensure auth user ${userId}`);
    }
  }
}

async function purgeDemoData() {
  const tables = ['budgets', 'tasks', 'invoices', 'items', 'customers', 'projects'];
  for (const table of tables) {
    const { error } = await supabaseServer.from(table).delete().in('user_id', demoUserIds);
    if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

async function insertReturning<T>(table: string, payload: T[]): Promise<T[]> {
  if (!payload.length) return [] as T[];
  const { data, error } = await supabaseServer.from(table).insert(payload).select();
  if (error) throw new Error(`Failed to insert ${table}: ${error.message}`);
  return (data ?? []) as T[];
}

async function insertSimple<T>(table: string, payload: T[]) {
  if (!payload.length) return 0;
  const { error } = await supabaseServer.from(table).insert(payload);
  if (error) throw new Error(`Failed to insert ${table}: ${error.message}`);
  return payload.length;
}

export async function POST() {
  if (!demoUserIds.length) {
    return NextResponse.json({ error: 'No deterministic demo user IDs configured.' }, { status: 400 });
  }

  try {
    await ensureDemoUsers();
    await purgeDemoData();

    const customers = await insertReturning('customers', customerSeed) as Array<typeof customerSeed[0] & { id: number }>;
    const customerMap = new Map<string, number>();
    customers.forEach(customer => {
      if (customer?.id) customerMap.set(keyFor(customer.user_id, customer.name), customer.id);
    });

    const projectInsertPayload = projectSeed.map(({ user_id, name, description, photo_url }) => ({
      user_id,
      name,
      description,
      photo_url,
    }));
    const projects = await insertReturning('projects', projectInsertPayload) as Array<typeof projectInsertPayload[0] & { id: number }>;
    const projectMap = new Map<string, number>();
    projects.forEach(project => {
      if (project?.id) projectMap.set(keyFor(project.user_id, project.name), project.id);
    });

    const budgetPayload = projectSeed
      .map(seed => {
        const projectId = projectMap.get(keyFor(seed.user_id, seed.name));
        if (!projectId) return null;
        return {
          project_id: projectId,
          planned_amount: seed.planned_amount,
          actual_amount: seed.actual_amount,
          user_id: seed.user_id,
        };
      })
      .filter(Boolean) as Array<{ project_id: number; planned_amount: number; actual_amount: number; user_id: string }>;

    const taskPayload = taskSeed
      .map(seed => {
        const projectId = projectMap.get(keyFor(seed.user_id, seed.project_name));
        if (!projectId) return null;
        return {
          user_id: seed.user_id,
          project_id: projectId,
          name: seed.name,
          description: seed.description,
          status: seed.status,
          seconds: seed.seconds,
          assigned_to: seed.assigned_to,
        };
      })
      .filter(Boolean) as Array<{
        user_id: string;
        project_id: number;
        name: string;
        description: string;
        status: string;
        seconds: number;
        assigned_to: string;
      }>;

    const invoicePayload = invoiceSeed
      .map(seed => {
        const customerId = customerMap.get(keyFor(seed.user_id, seed.customer_name));
        if (!customerId) return null;
        return {
          user_id: seed.user_id,
          customer_id: customerId,
          amount: seed.amount,
          description: seed.description,
        };
      })
      .filter(Boolean) as Array<{ user_id: string; customer_id: number; amount: number; description: string }>;

    const budgetsInserted = await insertSimple('budgets', budgetPayload);
    const itemsInserted = await insertSimple('items', itemSeed);
    const tasksInserted = await insertSimple('tasks', taskPayload);
    const invoicesInserted = await insertSimple('invoices', invoicePayload);

    return NextResponse.json({
      users: demoUserIds,
      customers: customers.length,
      projects: projects.length,
      budgets: budgetsInserted,
      items: itemsInserted,
      tasks: tasksInserted,
      invoices: invoicesInserted,
    });
  } catch (error) {
    console.error('POST /api/demo/seed error:', error);
    const message = error instanceof EnsureAuthUserError ? error.message : (error as Error).message;
    return NextResponse.json({ error: message || 'Unable to seed demo workspace' }, { status: 500 });
  }
}
