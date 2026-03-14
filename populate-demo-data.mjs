#!/usr/bin/env node

/**
 * Populate FieldCost Demo Company with Realistic Data
 * For Client Signoff Demonstration
 * 
 * Run: node populate-demo-data.mjs
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';
const DEMO_COMPANY_ID = '1'; // Demo company ID
const IS_DEMO = true;

// Test user
const USER_ID = 'demo';
const TEST_EMAIL = 'qa_test_user@fieldcost.com';
const TEST_PASSWORD = 'TestPassword123';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Demo-Data-Loader/1.0',
      },
      timeout: 15000,
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: { raw: data },
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function getAuthToken() {
  try {
    log('🔑 Authenticating...', 'blue');
    const response = await makeRequest('POST', '/api/auth/login', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (response.status === 200 && response.data.session?.access_token) {
      log('✅ Authentication successful', 'green');
      return response.data.session.access_token;
    } else if (response.data.token) {
      return response.data.token;
    } else {
      throw new Error(`Auth failed: ${response.status}`);
    }
  } catch (error) {
    log(`❌ Auth error: ${error.message}`, 'red');
    throw error;
  }
}

async function createCustomers(token) {
  log('\n📊 Creating Customers...', 'cyan');
  
  const customers = [
    {
      name: 'Acme Construction Inc',
      email: 'contact@aceconstruct.com',
      phone: '+1-555-0101',
      address: '123 Construction Ave, Austin, TX 78701',
      city: 'Austin',
      state: 'TX',
      postal_code: '78701',
      country: 'US',
    },
    {
      name: 'BuildRight Engineering',
      email: 'info@buildright.com',
      phone: '+1-555-0102',
      address: '456 Engineering Blvd, Denver, CO 80202',
      city: 'Denver',
      state: 'CO',
      postal_code: '80202',
      country: 'US',
    },
    {
      name: 'Urban Development Corp',
      email: 'projects@urbandev.com',
      phone: '+1-555-0103',
      address: '789 Downtown Plaza, Seattle, WA 98101',
      city: 'Seattle',
      state: 'WA',
      postal_code: '98101',
      country: 'US',
    },
    {
      name: 'Prairie Builders LLC',
      email: 'quotes@prairiebuilders.com',
      phone: '+1-555-0104',
      address: '321 Prairie Rd, Kansas City, MO 64101',
      city: 'Kansas City',
      state: 'MO',
      postal_code: '64101',
      country: 'US',
    },
  ];

  const customerIds = [];
  
  for (const customer of customers) {
    try {
      const response = await makeRequest('POST', '/api/customers', {
        ...customer,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created customer: ${customer.name}`, 'green');
        customerIds.push(response.data.id);
      } else {
        log(`⚠️  Customer creation issue: ${customer.name} (${response.status})`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create customer: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return customerIds;
}

async function createItems(token) {
  log('\n📦 Creating Inventory Items...', 'cyan');
  
  const items = [
    {
      name: 'Steel Beams - Grade A',
      description: 'Structural steel beams for foundation work',
      sku: 'SB-GRADE-A',
      category: 'Materials',
      unit_price: 850.00,
      quantity_on_hand: 50,
      reorder_level: 10,
    },
    {
      name: 'Concrete Mix - Premium',
      description: 'High-strength concrete mix for structural work',
      sku: 'CONC-PREM',
      category: 'Materials',
      unit_price: 125.00,
      quantity_on_hand: 200,
      reorder_level: 50,
    },
    {
      name: 'Skilled Electrician',
      description: 'Professional electrician labor',
      sku: 'LABOR-ELEC',
      category: 'Labor',
      unit_price: 95.00,
      quantity_on_hand: 0,
      reorder_level: 0,
    },
    {
      name: 'Senior Project Manager',
      description: 'Experienced project management services',
      sku: 'LABOR-PM',
      category: 'Labor',
      unit_price: 150.00,
      quantity_on_hand: 0,
      reorder_level: 0,
    },
    {
      name: 'Heavy Excavator Rental',
      description: 'CAT 320 Excavator - daily rental',
      sku: 'EQUIP-EXC',
      category: 'Equipment',
      unit_price: 550.00,
      quantity_on_hand: 3,
      reorder_level: 1,
    },
    {
      name: 'Safety Equipment Bundle',
      description: 'Complete site safety equipment package',
      sku: 'SAFETY-BUNDLE',
      category: 'Supplies',
      unit_price: 2500.00,
      quantity_on_hand: 12,
      reorder_level: 3,
    },
  ];

  const itemIds = [];

  for (const item of items) {
    try {
      const response = await makeRequest('POST', '/api/items', {
        ...item,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created item: ${item.name}`, 'green');
        itemIds.push(response.data.id);
      } else {
        log(`⚠️  Item creation issue: ${item.name}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create item: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return itemIds;
}

async function createProjects(token) {
  log('\n🏗️  Creating Projects...', 'cyan');
  
  const projects = [
    {
      name: 'Downtown Office Complex - Phase 1',
      description: 'New 24-story mixed-use office and retail complex in downtown Seattle',
      status: 'active',
      budget: 15000000,
      start_date: '2024-01-15',
      end_date: '2025-12-31',
    },
    {
      name: 'Residential Developer - Suburban Homes',
      description: 'Development of 150-unit residential community with modern amenities',
      status: 'active',
      budget: 8500000,
      start_date: '2024-03-01',
      end_date: '2025-09-30',
    },
    {
      name: 'Highway Expansion Project',
      description: 'Interstate highway widening and infrastructure upgrade',
      status: 'active',
      budget: 22000000,
      start_date: '2023-08-01',
      end_date: '2026-06-30',
    },
    {
      name: 'Commercial Multi-Tenant Building',
      description: 'Modern commercial space with retail, offices, and light industrial',
      status: 'planning',
      budget: 5200000,
      start_date: '2024-06-01',
      end_date: '2025-06-30',
    },
  ];

  const projectIds = [];

  for (const project of projects) {
    try {
      const response = await makeRequest('POST', '/api/projects', {
        ...project,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created project: ${project.name}`, 'green');
        projectIds.push({ id: response.data.id, name: project.name });
      } else {
        log(`⚠️  Project creation issue: ${project.name}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create project: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return projectIds;
}

async function createTasks(token, projects) {
  log('\n✅ Creating Tasks...', 'cyan');
  
  const tasksByProject = {
    tasks: [
      {
        title: 'Site Survey and Preparation',
        description: 'Complete geological survey and site preparation planning',
        status: 'in_progress',
        priority: 'high',
        estimated_hours: 120,
      },
      {
        title: 'Foundation Work',
        description: 'Excavation and foundation installation',
        status: 'todo',
        priority: 'high',
        estimated_hours: 500,
      },
      {
        title: 'Structural Steel Installation',
        description: 'Install primary structural steel framework',
        status: 'todo',
        priority: 'high',
        estimated_hours: 400,
      },
      {
        title: 'Electrical Systems Installation',
        description: 'Complete electrical wiring and systems installation',
        status: 'todo',
        priority: 'medium',
        estimated_hours: 300,
      },
      {
        title: 'HVAC Installation',
        description: 'Install heating, ventilation, and air conditioning systems',
        status: 'todo',
        priority: 'medium',
        estimated_hours: 250,
      },
    ],
  };

  let taskCount = 0;

  if (projects.length > 0) {
    for (const task of tasksByProject.tasks) {
      try {
        const response = await makeRequest('POST', '/api/tasks', {
          ...task,
          project_id: projects[0].id,
          company_id: DEMO_COMPANY_ID,
          is_demo: IS_DEMO,
        }, token);

        if (response.status === 201 && response.data.id) {
          log(`✅ Created task: ${task.title}`, 'green');
          taskCount++;
        } else {
          log(`⚠️  Task creation issue: ${task.title}`, 'yellow');
        }
      } catch (error) {
        log(`❌ Failed to create task: ${error.message}`, 'red');
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return taskCount;
}

async function createQuotes(token, customers) {
  log('\n💬 Creating Quotes...', 'cyan');
  
  const quotes = [
    {
      quote_number: `QT-2024-001`,
      description: 'Foundation and structural work for Phase 1 downtown complex',
      status: 'approved',
      tax_rate: 0.08,
      discount_percentage: 0,
      valid_until: '2024-04-30',
      customer_id: customers[0] || null,
    },
    {
      quote_number: `QT-2024-002`,
      description: 'HVAC and mechanical systems installation quote',
      status: 'draft',
      tax_rate: 0.08,
      discount_percentage: 5,
      valid_until: '2024-04-15',
      customer_id: customers[1] || null,
    },
    {
      quote_number: `QT-2024-003`,
      description: 'Residential development - materials and labor',
      status: 'sent',
      tax_rate: 0.08,
      discount_percentage: 0,
      valid_until: '2024-05-31',
      customer_id: customers[2] || null,
    },
  ];

  let quoteCount = 0;

  for (const quote of quotes) {
    try {
      const response = await makeRequest('POST', '/api/quotes', {
        ...quote,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created quote: ${quote.quote_number}`, 'green');
        quoteCount++;
      } else {
        log(`⚠️  Quote creation issue: ${quote.quote_number}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create quote: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return quoteCount;
}

async function createPurchaseOrders(token, customers) {
  log('\n📦 Creating Purchase Orders...', 'cyan');
  
  const purchaseOrders = [
    {
      po_number: `PO-2024-001`,
      description: 'Steel and materials delivery for foundation work',
      status: 'approved',
      vendor_id: customers[0] || null,
      order_date: '2024-03-10',
      expected_delivery: '2024-03-20',
      tax_rate: 0.08,
    },
    {
      po_number: `PO-2024-002`,
      description: 'Electrical equipment and supplies',
      status: 'received',
      vendor_id: customers[1] || null,
      order_date: '2024-02-28',
      expected_delivery: '2024-03-15',
      received_date: '2024-03-14',
      tax_rate: 0.08,
    },
    {
      po_number: `PO-2024-003`,
      description: 'Concrete and formwork materials',
      status: 'draft',
      vendor_id: customers[2] || null,
      order_date: '2024-03-15',
      expected_delivery: '2024-03-25',
      tax_rate: 0.08,
    },
  ];

  let poCount = 0;

  for (const po of purchaseOrders) {
    try {
      const response = await makeRequest('POST', '/api/purchase-orders', {
        ...po,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created PO: ${po.po_number}`, 'green');
        poCount++;
      } else {
        log(`⚠️  PO creation issue: ${po.po_number}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create PO: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return poCount;
}

async function createInvoices(token, customers) {
  log('\n📄 Creating Invoices...', 'cyan');
  
  const invoices = [
    {
      invoice_number: `INV-2024-001`,
      description: 'Foundation work - Phase 1 - March billing',
      status: 'paid',
      customer_id: customers[0] || null,
      issue_date: '2024-03-01',
      due_date: '2024-04-01',
      tax_rate: 0.08,
      discount_percentage: 0,
    },
    {
      invoice_number: `INV-2024-002`,
      description: 'Structural steel installation - Progress billing',
      status: 'sent',
      customer_id: customers[1] || null,
      issue_date: '2024-03-10',
      due_date: '2024-04-10',
      tax_rate: 0.08,
      discount_percentage: 0,
    },
    {
      invoice_number: `INV-2024-003`,
      description: 'Project management and consulting services',
      status: 'draft',
      customer_id: customers[2] || null,
      issue_date: '2024-03-15',
      due_date: '2024-04-15',
      tax_rate: 0.08,
      discount_percentage: 0,
    },
    {
      invoice_number: `INV-2024-004`,
      description: 'Residential development - site preparation and labor',
      status: 'overdue',
      customer_id: customers[3] || null,
      issue_date: '2024-02-01',
      due_date: '2024-03-01',
      tax_rate: 0.08,
      discount_percentage: 0,
    },
  ];

  let invoiceCount = 0;

  for (const invoice of invoices) {
    try {
      const response = await makeRequest('POST', '/api/invoices', {
        ...invoice,
        company_id: DEMO_COMPANY_ID,
        is_demo: IS_DEMO,
      }, token);

      if (response.status === 201 && response.data.id) {
        log(`✅ Created invoice: ${invoice.invoice_number}`, 'green');
        invoiceCount++;
      } else {
        log(`⚠️  Invoice creation issue: ${invoice.invoice_number}`, 'yellow');
      }
    } catch (error) {
      log(`❌ Failed to create invoice: ${error.message}`, 'red');
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return invoiceCount;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║    FieldCost Demo Data Population - Client Signoff Prep        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════╝\n', 'cyan');

  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Create all demo data
    const customerIds = await createCustomers(token);
    const itemIds = await createItems(token);
    const projects = await createProjects(token);
    const taskCount = await createTasks(token, projects);
    const quoteCount = await createQuotes(token, customerIds);
    const poCount = await createPurchaseOrders(token, customerIds);
    const invoiceCount = await createInvoices(token, customerIds);

    log('\n╔════════════════════════════════════════════════════════════════╗', 'green');
    log('║                      📊 DATA POPULATION COMPLETE                  ║', 'green');
    log('╠════════════════════════════════════════════════════════════════╣', 'green');
    log(`║ ✅ Customers Created: ${String(customerIds.length).padEnd(42)} ║`, 'green');
    log(`║ ✅ Items Created: ${String(itemIds.length).padEnd(46)} ║`, 'green');
    log(`║ ✅ Projects Created: ${String(projects.length).padEnd(42)} ║`, 'green');
    log(`║ ✅ Tasks Created: ${String(taskCount).padEnd(47)} ║`, 'green');
    log(`║ ✅ Quotes Created: ${String(quoteCount).padEnd(46)} ║`, 'green');
    log(`║ ✅ Purchase Orders Created: ${String(poCount).padEnd(33)} ║`, 'green');
    log(`║ ✅ Invoices Created: ${String(invoiceCount).padEnd(44)} ║`, 'green');
    log('╠════════════════════════════════════════════════════════════════╣', 'green');
    log(`║ 🎯 Total Data Points: ${String(customerIds.length + itemIds.length + projects.length + taskCount + quoteCount + poCount + invoiceCount).padEnd(38)} ║`, 'green');
    log('╠════════════════════════════════════════════════════════════════╣', 'green');
    log('║ 🌐 View Demo: https://fieldcost.vercel.app/dashboard            ║', 'green');
    log('║ 📝 Demo User: Demo Workspace                                    ║', 'green');
    log('╚════════════════════════════════════════════════════════════════╝\n', 'green');

  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
