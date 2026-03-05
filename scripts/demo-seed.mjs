#!/usr/bin/env node
import { config as loadEnv } from 'dotenv';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local', override: true });

const DEFAULT_ADMIN_UUID = '11111111-1111-1111-1111-111111111111';
const DEFAULT_SUBCONTRACTOR_UUID = '22222222-2222-2222-2222-222222222222';
const DEFAULT_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sanitize = value => (value && value.trim()) || undefined;
const DEFAULT_DEMO_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_USER_ID) || DEFAULT_ADMIN_UUID;
const DEMO_ADMIN_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_ADMIN_USER_ID) || DEFAULT_DEMO_USER_ID;
const DEMO_SUBCONTRACTOR_USER_ID = sanitize(process.env.NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID) || DEFAULT_SUBCONTRACTOR_UUID;
const demoUserIds = Array.from(new Set([DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID].filter(Boolean)));

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local before running scripts/demo-seed.mjs.');
  process.exit(1);
}
if (!demoUserIds.length) {
  console.error('No deterministic demo user IDs configured. Check NEXT_PUBLIC_DEMO_* env vars.');
  process.exit(1);
}

const supabase = createClient(DEFAULT_SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const DEMO_LABELS = {
  [DEMO_ADMIN_USER_ID]: 'demo-admin',
  [DEMO_SUBCONTRACTOR_USER_ID]: 'demo-subcontractor',
};

const slugify = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'demo';

async function ensureAuthUser(userId) {
  const lookup = await supabase.auth.admin.getUserById(userId);
  if (lookup.data?.user) return lookup.data.user;
  if (lookup.error && !/user not found/i.test(lookup.error.message)) {
    throw new Error(`Unable to verify auth user ${userId}: ${lookup.error.message}`);
  }
  const alias = DEMO_LABELS[userId] || `demo-${userId.slice(0, 8)}`;
  const email = `${slugify(alias)}@fieldcost.demo`;
  const created = await supabase.auth.admin.createUser({
    id: userId,
    email,
    email_confirm: true,
    password: randomUUID(),
    user_metadata: { label: alias, isDemo: true },
    app_metadata: { provider: 'demo-seed-script' },
  });
  if (created.error) {
    throw new Error(`Unable to create auth user ${userId}: ${created.error.message}`);
  }
  return created.data.user;
}

async function ensureDemoUsers() {
  for (const userId of demoUserIds) {
    await ensureAuthUser(userId);
  }
}

async function purgeDemoData() {
  const tables = ['invoice_line_items', 'budgets', 'tasks', 'crew_members', 'invoices', 'items', 'customers', 'projects', 'company_profiles'];
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().in('user_id', demoUserIds);
    if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  }
}

const companySeed = [
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'FieldCost Plant & Infrastructure',
    email: 'ops@fieldcost.demo',
    phone: '+27 11 555 0101',
    address_line1: '12 Pithead Avenue',
    address_line2: 'Suite 400',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2001',
    country: 'South Africa',
    logo_external_url: 'https://placehold.co/240x120?text=FieldCost',
    invoice_template: 'standard',
    default_currency: 'ZAR',
    erp_targets: ['sage-bca-sa', 'xero'],
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    name: 'FieldCost Crushing Partners',
    email: 'finance@fieldcost-partners.demo',
    phone: '+27 21 555 0144',
    address_line1: '44 Reefline Road',
    address_line2: 'Hangar 3',
    city: 'Emalahleni',
    province: 'Mpumalanga',
    postal_code: '1035',
    country: 'South Africa',
    logo_external_url: 'https://placehold.co/240x120?text=Partners',
    invoice_template: 'detailed',
    default_currency: 'ZAR',
    erp_targets: ['sage-bca-sa', 'quickbooks'],
  },
].filter(seed => demoUserIds.includes(seed.user_id));

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
    planned_amount: 1200000,
    actual_amount: 845000,
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'Process Plant Refurb',
    description: 'Replace worn chute liners and recalibrate secondary crushers.',
    photo_url: 'https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=800&q=60',
    planned_amount: 980000,
    actual_amount: 1020000,
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    name: 'Tailings Storage Lift',
    description: 'Raise TSF wall by 3m with compacted engineered fill.',
    photo_url: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60',
    planned_amount: 2400000,
    actual_amount: 1250000,
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    name: 'Drill & Blast Campaign',
    description: '120-hole pattern for north pit pushback.',
    photo_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60',
    planned_amount: 680000,
    actual_amount: 320000,
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    name: 'Crusher Maintenance Blitz',
    description: 'Three-day shutdown to swap liners and bearings.',
    photo_url: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=60',
    planned_amount: 410000,
    actual_amount: 180000,
  },
].filter(seed => demoUserIds.includes(seed.user_id));

const itemSeed = [
  { user_id: DEMO_ADMIN_USER_ID, name: 'Diesel (50 ppm)', price: 24.85, stock_in: 18000, stock_used: 13200, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Explosive Pack ANFO (1 t)', price: 8650, stock_in: 18, stock_used: 12, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Conveyor Belt Repair Kit', price: 14500, stock_in: 9, stock_used: 4, item_type: 'physical' },
  { user_id: DEMO_ADMIN_USER_ID, name: 'On-site Survey Crew (day)', price: 7800, stock_in: 22, stock_used: 15, item_type: 'service' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Crusher Specialist Callout', price: 12500, stock_in: 12, stock_used: 6, item_type: 'service' },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Wear Plate Set', price: 9800, stock_in: 30, stock_used: 21, item_type: 'physical' },
].filter(seed => demoUserIds.includes(seed.user_id));

const crewSeed = [
  { user_id: DEMO_ADMIN_USER_ID, name: 'Sipho Dlamini', hourly_rate: 420 },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Lerato Maseko', hourly_rate: 395 },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Thando Nkosi', hourly_rate: 440 },
  { user_id: DEMO_ADMIN_USER_ID, name: 'Nomsa Khumalo', hourly_rate: 380 },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Mandla Radebe', hourly_rate: 360 },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, name: 'Zanele Molefe', hourly_rate: 345 },
].filter(seed => demoUserIds.includes(seed.user_id));

const taskSeed = [
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Haul Road Rehab', name: 'Survey control & pegging', description: 'Lay out widened alignment and check crossfall.', status: 'done', seconds: 16200, assigned_to: 'Sipho Dlamini', billable: true },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Haul Road Rehab', name: 'Lime stabilisation run 1', description: 'Blend lime across km 2-3 section.', status: 'in-progress', seconds: 8700, assigned_to: 'Lerato Maseko', billable: true },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Process Plant Refurb', name: 'Chute liner strip-out', description: 'Remove worn liners on secondary feed chute.', status: 'done', seconds: 20400, assigned_to: 'Thando Nkosi', billable: true },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Process Plant Refurb', name: 'Crusher recalibration', description: 'Laser align crusher gap before restart.', status: 'todo', seconds: 0, assigned_to: 'Nomsa Khumalo', billable: true },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Tailings Storage Lift', name: 'Geotech inspections', description: 'Log compaction results and densities by zone.', status: 'in-progress', seconds: 5400, assigned_to: 'Sipho Dlamini', billable: false },
  { user_id: DEMO_ADMIN_USER_ID, project_name: 'Tailings Storage Lift', name: 'Crest drainage tie-in', description: 'Install HDPE drains into existing spillway.', status: 'todo', seconds: 0, assigned_to: 'Lerato Maseko', billable: true },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Drill & Blast Campaign', name: 'Pattern drilling', description: 'Complete 120-hole pattern with 165 mm holes.', status: 'in-progress', seconds: 11100, assigned_to: 'Sipho Dlamini', billable: true },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Drill & Blast Campaign', name: 'Explosive loading', description: 'Load ANFO and boosters with QA sheet.', status: 'todo', seconds: 0, assigned_to: 'Thando Nkosi', billable: true },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Crusher Maintenance Blitz', name: 'Liner swap prep', description: 'Loosen backing material and stage new sets.', status: 'done', seconds: 9600, assigned_to: 'Nomsa Khumalo', billable: true },
  { user_id: DEMO_SUBCONTRACTOR_USER_ID, project_name: 'Crusher Maintenance Blitz', name: 'Bearing inspection', description: 'Inspect main shaft bearings during shutdown.', status: 'in-progress', seconds: 4200, assigned_to: 'Lerato Maseko', billable: false },
].filter(seed => demoUserIds.includes(seed.user_id));

const invoiceSeed = [
  {
    user_id: DEMO_ADMIN_USER_ID,
    customer_name: 'Mbali Civil Works',
    amount: 485000,
    description: 'Progress draw #3 - Haul road stabilisation and survey.',
    reference: 'Haul road stabilisation draw',
    invoice_number: 'FC-ADM-001',
    issued_on: '2025-02-05',
    due_on: '2025-02-20',
    status: 'sent',
    currency: 'ZAR',
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    customer_name: 'Kopano Mining JV',
    amount: 320000,
    description: 'Process plant shutdown labour & materials.',
    reference: 'Shutdown labour & materials',
    invoice_number: 'FC-ADM-002',
    issued_on: '2025-01-28',
    due_on: '2025-02-12',
    status: 'sent',
    currency: 'ZAR',
  },
  {
    user_id: DEMO_ADMIN_USER_ID,
    customer_name: 'Sunset Aggregates',
    amount: 215000,
    description: 'Tailings lift QA services (week 18).',
    reference: 'TSF lift QA services',
    invoice_number: 'FC-ADM-003',
    issued_on: '2025-02-10',
    due_on: '2025-02-25',
    status: 'sent',
    currency: 'ZAR',
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    customer_name: 'Highveld Crushing',
    amount: 155000,
    description: 'Crusher blitz callout fee and spares.',
    reference: 'Crusher maintenance blitz',
    invoice_number: 'FC-SUB-001',
    issued_on: '2025-02-03',
    due_on: '2025-02-18',
    status: 'sent',
    currency: 'ZAR',
  },
  {
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    customer_name: 'MoAfrika Minerals',
    amount: 265000,
    description: 'Drill & blast campaign progress payment.',
    reference: 'Drill & blast progress',
    invoice_number: 'FC-SUB-002',
    issued_on: '2025-02-07',
    due_on: '2025-02-22',
    status: 'sent',
    currency: 'ZAR',
  },
].filter(seed => demoUserIds.includes(seed.user_id));

const invoiceLineSeed = [
  {
    invoice_number: 'FC-ADM-001',
    user_id: DEMO_ADMIN_USER_ID,
    lines: [
      { name: 'Survey crew (day)', quantity: 3, rate: 7800, project: 'Haul Road Rehab', note: 'Control + pegging' },
      { name: 'Diesel (50 ppm)', quantity: 2500, rate: 24.85, project: 'Haul Road Rehab', note: 'Graders + compaction' },
    ],
  },
  {
    invoice_number: 'FC-ADM-002',
    user_id: DEMO_ADMIN_USER_ID,
    lines: [
      { name: 'Liner strip crew', quantity: 4, rate: 11200, project: 'Process Plant Refurb', note: 'Shutdown labour' },
      { name: 'Conveyor Belt Repair Kit', quantity: 2, rate: 14500, project: 'Process Plant Refurb', note: 'Material supply' },
    ],
  },
  {
    invoice_number: 'FC-ADM-003',
    user_id: DEMO_ADMIN_USER_ID,
    lines: [
      { name: 'Geotech inspections', quantity: 2, rate: 9400, project: 'Tailings Storage Lift', note: 'Week 18 QA' },
      { name: 'On-site Survey Crew (day)', quantity: 1, rate: 7800, project: 'Tailings Storage Lift', note: 'Confirm densities' },
    ],
  },
  {
    invoice_number: 'FC-SUB-001',
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    lines: [
      { name: 'Crusher Specialist Callout', quantity: 2, rate: 12500, project: 'Crusher Maintenance Blitz', note: 'Rapid response team' },
      { name: 'Wear Plate Set', quantity: 4, rate: 9800, project: 'Crusher Maintenance Blitz', note: 'Liner replacements' },
    ],
  },
  {
    invoice_number: 'FC-SUB-002',
    user_id: DEMO_SUBCONTRACTOR_USER_ID,
    lines: [
      { name: 'Drilling pattern shift', quantity: 3, rate: 15800, project: 'Drill & Blast Campaign', note: 'Pattern drilling' },
      { name: 'Explosive Pack ANFO (1 t)', quantity: 3, rate: 8650, project: 'Drill & Blast Campaign', note: 'Bulk ANFO loads' },
    ],
  },
];

const keyFor = (userId, name) => `${userId}::${name}`;

async function insertReturning(table, records) {
  if (!records.length) return [];
  const { data, error } = await supabase.from(table).insert(records).select();
  if (error) throw new Error(`Failed to insert into ${table}: ${error.message}`);
  return data ?? [];
}

async function insertSimple(table, records) {
  if (!records.length) return 0;
  const { error } = await supabase.from(table).insert(records);
  if (error) throw new Error(`Failed to insert into ${table}: ${error.message}`);
  return records.length;
}

async function seedDemoData() {
  console.log('Seeding FieldCost demo data...');
  await ensureDemoUsers();
  console.log('✓ Auth users ensured');
  await purgeDemoData();
  console.log('✓ Previous demo rows cleared');

  const companiesInserted = await insertSimple('company_profiles', companySeed);
  console.log('✓ Companies:', companiesInserted);

  const customers = await insertReturning('customers', customerSeed);
  const customerMap = new Map();
  customers.forEach(customer => {
    if (customer?.id) customerMap.set(keyFor(customer.user_id, customer.name), customer.id);
  });

  const projectInsertPayload = projectSeed.map(({ planned_amount, actual_amount, ...project }) => project);
  const projects = await insertReturning('projects', projectInsertPayload);
  const projectMap = new Map();
  projects.forEach(project => {
    if (project?.id) projectMap.set(keyFor(project.user_id, project.name), project.id);
  });

  const crewMembers = await insertReturning('crew_members', crewSeed);
  const crewMap = new Map();
  crewMembers.forEach(member => {
    if (member?.id) crewMap.set(keyFor(member.user_id, member.name), member.id);
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
    .filter(Boolean);

  const taskPayload = taskSeed
    .map(seed => {
      const projectId = projectMap.get(keyFor(seed.user_id, seed.project_name));
      const crewId = crewMap.get(keyFor(seed.user_id, seed.assigned_to));
      if (!projectId) return null;
      return {
        user_id: seed.user_id,
        project_id: projectId,
        name: seed.name,
        description: seed.description,
        status: seed.status,
        seconds: seed.seconds,
        assigned_to: seed.assigned_to,
        crew_member_id: crewId ?? null,
        billable: seed.billable ?? true,
      };
    })
    .filter(Boolean);

  const invoicePayload = invoiceSeed
    .map(seed => {
      const customerId = customerMap.get(keyFor(seed.user_id, seed.customer_name));
      if (!customerId) return null;
      return {
        user_id: seed.user_id,
        customer_id: customerId,
        amount: seed.amount,
        description: seed.description,
        reference: seed.reference,
        invoice_number: seed.invoice_number,
        issued_on: seed.issued_on,
        due_on: seed.due_on,
        status: seed.status ?? 'sent',
        currency: seed.currency ?? 'ZAR',
      };
    })
    .filter(Boolean);

  const budgetsInserted = await insertSimple('budgets', budgetPayload);
  const itemsInserted = await insertSimple('items', itemSeed);
  const tasksInserted = await insertSimple('tasks', taskPayload);

  console.log('✓ Crew:', crewMembers.length);
  const invoices = await insertReturning('invoices', invoicePayload);
  const invoiceMap = new Map();
  invoices.forEach(invoice => {
    if (invoice?.invoice_number) invoiceMap.set(invoice.invoice_number, invoice);
  });

  const lineRecords = invoiceLineSeed
    .filter(seed => demoUserIds.includes(seed.user_id))
    .map(seed => {
      const invoice = invoiceMap.get(seed.invoice_number);
      if (!invoice?.id) return null;
      return seed.lines.map(line => ({
        invoice_id: invoice.id,
        user_id: seed.user_id,
        name: line.name,
        quantity: line.quantity,
        rate: line.rate,
        total: line.total ?? Number((line.quantity * line.rate).toFixed(2)),
        project: line.project ?? null,
        note: line.note ?? null,
        source: line.source ?? null,
        task_ref: line.task_ref ?? null,
      }));
    })
    .filter(Boolean)
    .flat();

  const linesInserted = await insertSimple('invoice_line_items', lineRecords);

  console.log('✓ Customers:', customers.length);
  console.log('✓ Projects:', projects.length);
  console.log('✓ Budgets:', budgetsInserted);
  console.log('✓ Items:', itemsInserted);
  console.log('✓ Tasks:', tasksInserted);
  console.log('✓ Invoices:', invoices.length);
  console.log('✓ Invoice lines:', linesInserted);
  console.log('Demo workspace ready!');
}

seedDemoData().catch(error => {
  console.error('Demo seed failed:', error.message);
  process.exit(1);
});
