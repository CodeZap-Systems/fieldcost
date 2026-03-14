/**
 * Test Data Fixtures
 * Mock data for projects, tasks, customers, items, invoices
 */

export const TEST_PROJECTS = {
  residential: {
    name: 'Residential House Renovation',
    description: 'Complete renovation of a 3-bedroom house',
    location: '123 Main St, Sydney NSW 2000',
    clientName: 'John Smith',
    clientEmail: 'john.smith@example.com',
    startDate: '2026-03-15',
    endDate: '2026-06-15',
    budget: 50000,
  },
  commercial: {
    name: 'Commercial Office Fit-Out',
    description: 'Office space renovation and setup',
    location: '456 Business Ave, Melbourne VIC 3000',
    clientName: 'ABC Corporation',
    clientEmail: 'contact@abccorp.com',
    startDate: '2026-04-01',
    endDate: '2026-08-31',
    budget: 150000,
  },
  mining: {
    name: 'Mining Site Development',
    description: 'Site preparation and infrastructure development',
    location: 'West Mine, Kalgoorlie WA 6430',
    clientName: 'Mining Corp',
    clientEmail: 'ops@miningcorp.com',
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    budget: 500000,
  },
};

export const TEST_TASKS = {
  demolition: {
    title: 'Site Demolition',
    description: 'Remove existing structures',
    status: 'pending',
    priority: 'high',
    assignedTo: 'field_worker@fieldcost.com',
    dueDate: '2026-03-20',
    estimatedHours: 40,
    budget: 5000,
  },
  excavation: {
    title: 'Excavation & Site Prep',
    description: 'Excavate and prepare site for construction',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'field_worker@fieldcost.com',
    dueDate: '2026-04-10',
    estimatedHours: 80,
    budget: 15000,
  },
  foundation: {
    title: 'Foundation Work',
    description: 'Pour concrete foundation',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-05-01',
    estimatedHours: 60,
    budget: 20000,
  },
  framing: {
    title: 'Framing',
    description: 'Install structural framing',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-01',
    estimatedHours: 100,
    budget: 30000,
  },
};

export const TEST_CUSTOMERS = {
  johnSmith: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+61412345678',
    address: '123 Main St, Sydney NSW 2000',
    type: 'residential',
    notes: 'Residential client - prefers evening contact',
  },
  abcCorp: {
    name: 'ABC Corporation',
    email: 'contact@abccorp.com',
    phone: '+61398765432',
    address: '456 Business Ave, Melbourne VIC 3000',
    type: 'commercial',
    notes: 'Large commercial client - morning meetings preferred',
  },
  miningCorp: {
    name: 'Mining Corp Pty Ltd',
    email: 'ops@miningcorp.com',
    phone: '+61849876543',
    address: 'West Mine, Kalgoorlie WA 6430',
    type: 'commercial',
    notes: 'Mining operations - strict safety protocols',
  },
  greenAustralia: {
    name: 'Green Australia Supplies',
    email: 'sales@greenaus.com',
    phone: '+61767890123',
    address: '789 Supply Rd, Brisbane QLD 4000',
    type: 'supplier',
    notes: 'Material supplier - net-30 terms',
  },
};

export const TEST_ITEMS = {
  cement: {
    name: 'Portland Cement',
    sku: 'CEMENT-001',
    description: 'High-strength Portland cement (50kg bags)',
    category: 'materials',
    quantity: 100,
    unit: 'bag',
    unitCost: 15.50,
    supplier: 'Green Australia Supplies',
  },
  rebar: {
    name: 'Steel Reinforcement Bar',
    sku: 'REBAR-016',
    description: '16mm steel rebar (12m lengths)',
    category: 'materials',
    quantity: 250,
    unit: 'length',
    unitCost: 45.00,
    supplier: 'Green Australia Supplies',
  },
  bricks: {
    name: 'Clay Bricks',
    sku: 'BRICK-STD',
    description: 'Standard clay bricks',
    category: 'materials',
    quantity: 5000,
    unit: 'unit',
    unitCost: 1.20,
    supplier: 'Green Australia Supplies',
  },
  labor: {
    name: 'General Labor',
    sku: 'LABOR-001',
    description: 'General construction labor (per hour)',
    category: 'labor',
    quantity: 1000,
    unit: 'hour',
    unitCost: 65.00,
  },
  excavator: {
    name: 'Excavator Hire',
    sku: 'EQUIP-EXC',
    description: 'CAT 320 Excavator daily hire',
    category: 'equipment',
    quantity: 30,
    unit: 'day',
    unitCost: 350.00,
  },
};

export const TEST_INVOICES = {
  deposit: {
    invoiceNumber: 'INV-2026-0001',
    customerName: 'John Smith',
    description: 'Project deposit',
    items: [
      {
        description: 'Residential House Renovation - 50% Deposit',
        quantity: 1,
        unitPrice: 25000,
      },
    ],
    total: 25000,
  },
  progress: {
    invoiceNumber: 'INV-2026-0002',
    customerName: 'ABC Corporation',
    description: 'Progress billing - excavation complete',
    items: [
      { description: 'Excavation & Site Prep', quantity: 80, unitPrice: 150 },
      { description: 'Materials - Cement', quantity: 50, unitPrice: 15.50 },
      { description: 'Materials - Rebar', quantity: 100, unitPrice: 45.00 },
    ],
    total: 15725,
  },
  final: {
    invoiceNumber: 'INV-2026-0003',
    customerName: 'Mining Corp',
    description: 'Final invoice - project completion',
    items: [
      { description: 'All services rendered', quantity: 1, unitPrice: 450000 },
    ],
    total: 450000,
  },
};

export const TEST_COMPANY = {
  name: 'QA Test Company',
  description: 'Automated testing company for FieldCost',
  address: '999 Test St, Sydney NSW 2000',
  phone: '+61212345678',
  email: 'qa@fieldcost-test.com',
  abn: '12345678901',
  website: 'https://fieldcost-test.com',
};

export const ERP_TEST_DATA = {
  sageConnection: {
    endpoint: 'https://api.columbus.sage.com',
    username: 'test_user',
    password: 'test_password',
  },
  sageInvoice: {
    customerRef: 'CUST001',
    invoiceRef: 'INV-20260301-001',
    amount: 5000,
    dueDate: '2026-04-01',
  },
};
