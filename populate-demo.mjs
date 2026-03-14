#!/usr/bin/env node

/**
 * FieldCost Demo Data Population - FIXED VERSION
 * Includes required company_id and customer_id parameters
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';
const DEMO_USER_ID = 'demo';
const DEMO_COMPANY_ID = '1';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : {},
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: { raw: data } });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createCustomers() {
  log('\n📊 Creating Customers...', 'cyan');
  const customers = [
    { name: 'Acme Construction Inc', email: 'contact@acme.com', phone: '+1-555-0101', city: 'Austin', state: 'TX' },
    { name: 'BuildRight Engineering', email: 'info@buildright.com', phone: '+1-555-0102', city: 'Denver', state: 'CO' },
    { name: 'Urban Development Corp', email: 'projects@urbandv.com', phone: '+1-555-0103', city: 'Seattle', state: 'WA' },
  ];

  const ids = [];
  for (const c of customers) {
    try {
      const res = await makeRequest('POST', `/api/customers`, {
        ...c,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${c.name}`, 'green');
        ids.push(res.data.id);
      } else {
        log(`⚠️  ${c.name} (${res.status})`, 'yellow');
      }
    } catch (e) {
      log(`❌ ${c.name}`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return ids;
}

async function createItems() {
  log('\n📦 Creating Inventory Items...', 'cyan');
  const items = [
    { name: 'Steel Beams Grade A', sku: 'SB-GA', category: 'Materials', unit_price: 850, quantity_on_hand: 50 },
    { name: 'Concrete Mix Premium', sku: 'CM-P', category: 'Materials', unit_price: 125, quantity_on_hand: 200 },
    { name: 'Skilled Electrician', sku: 'LABOR-E', category: 'Labor', unit_price: 95, quantity_on_hand: 0 },
    { name: 'Project Manager', sku: 'LABOR-PM', category: 'Labor', unit_price: 150, quantity_on_hand: 0 },
    { name: 'Excavator Rental', sku: 'EXC-CAT', category: 'Equipment', unit_price: 550, quantity_on_hand: 3 },
  ];

  const ids = [];
  for (const item of items) {
    try {
      const res = await makeRequest('POST', `/api/items`, {
        ...item,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${item.name}`, 'green');
        ids.push(res.data.id);
      } else {
        log(`⚠️  ${item.name}`, 'yellow');
      }
    } catch (e) {
      log(`❌ ${item.name}`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return ids;
}

async function createProjects() {
  log('\n🏗️  Creating Projects...', 'cyan');
  const projects = [
    { 
      name: 'Downtown Office Complex Phase 1', 
      description: 'New 24-story mixed-use office and retail',
      status: 'active', 
      budget: 15000000,
      start_date: '2024-01-15',
      end_date: '2025-12-31',
    },
    { 
      name: 'Residential Development - 150 Units', 
      description: 'Modern residential community with amenities',
      status: 'active', 
      budget: 8500000,
      start_date: '2024-03-01',
      end_date: '2025-09-30',
    },
    { 
      name: 'Highway Expansion Infrastructure', 
      description: 'Interstate highway widening and upgrade',
      status: 'active', 
      budget: 22000000,
      start_date: '2023-08-01',
      end_date: '2026-06-30',
    },
  ];

  const ids = [];
  for (const p of projects) {
    try {
      const res = await makeRequest('POST', `/api/projects`, {
        ...p,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${p.name.substring(0, 35)}...`, 'green');
        ids.push(res.data.id);
      } else {
        log(`⚠️  Project error (${res.status})`, 'yellow');
      }
    } catch (e) {
      log(`❌ Project error`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return ids;
}

async function createQuotes() {
  log('\n💬 Creating Quotes...', 'cyan');
  const quotes = [
    { quote_number: `QT-2024-001`, description: 'Foundation and structural work', status: 'approved', tax_rate: 0.08 },
    { quote_number: `QT-2024-002`, description: 'HVAC and mechanical systems', status: 'draft', tax_rate: 0.08 },
    { quote_number: `QT-2024-003`, description: 'Residential development services', status: 'sent', tax_rate: 0.08 },
  ];

  let count = 0;
  for (const q of quotes) {
    try {
      const res = await makeRequest('POST', `/api/quotes`, {
        ...q,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status)) {
        log(`✅ ${q.quote_number}`, 'green');
        count++;
      } else {
        log(`⚠️  ${q.quote_number} (${res.status})`, 'yellow');
      }
    } catch (e) {
      log(`❌ Quote error`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return count;
}

async function createPurchaseOrders() {
  log('\n📋 Creating Purchase Orders...', 'cyan');
  const pos = [
    { po_number: `PO-2024-001`, description: 'Steel and materials delivery', status: 'approved', tax_rate: 0.08, vendor_id: '1' },
    { po_number: `PO-2024-002`, description: 'Electrical equipment and supplies', status: 'received', tax_rate: 0.08, vendor_id: '2' },
    { po_number: `PO-2024-003`, description: 'Concrete and formwork materials', status: 'draft', tax_rate: 0.08, vendor_id: '3' },
  ];

  let count = 0;
  for (const po of pos) {
    try {
      const res = await makeRequest('POST', `/api/purchase-orders`, {
        ...po,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status)) {
        log(`✅ ${po.po_number}`, 'green');
        count++;
      } else {
        log(`⚠️  ${po.po_number} (${res.status})`, 'yellow');
      }
    } catch (e) {
      log(`❌ PO error`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return count;
}

async function createInvoices(customerIds) {
  log('\n📄 Creating Invoices...', 'cyan');
  
  if (customerIds.length === 0) {
    log('⚠️  No customers available - skipping invoices', 'yellow');
    return 0;
  }

  const invoices = [
    { 
      invoice_number: `INV-2024-001`, 
      description: 'Foundation work - March billing',
      status: 'paid',
      customer_id: customerIds[0],
      amount: 125000,
      tax_rate: 0.08,
      issue_date: '2024-03-01',
      due_date: '2024-04-01',
    },
    { 
      invoice_number: `INV-2024-002`, 
      description: 'Structural steel installation - Progress',
      status: 'sent',
      customer_id: customerIds[0] || customerIds[1],
      amount: 175000,
      tax_rate: 0.08,
      issue_date: '2024-03-10',
      due_date: '2024-04-10',
    },
    { 
      invoice_number: `INV-2024-003`, 
      description: 'Project management and consulting',
      status: 'draft',
      customer_id: customerIds[1] || customerIds[0],
      amount: 95000,
      tax_rate: 0.08,
      issue_date: '2024-03-15',
      due_date: '2024-04-15',
    },
    { 
      invoice_number: `INV-2024-004`, 
      description: 'Residential development - site prep',
      status: 'overdue',
      customer_id: customerIds[2] || customerIds[0],
      amount: 250000,
      tax_rate: 0.08,
      issue_date: '2024-02-01',
      due_date: '2024-03-01',
    },
  ];

  let count = 0;
  for (const inv of invoices) {
    try {
      const res = await makeRequest('POST', `/api/invoices`, {
        ...inv,
        company_id: DEMO_COMPANY_ID,
        is_demo: true,
      });
      if ([200, 201].includes(res.status)) {
        log(`✅ ${inv.invoice_number}`, 'green');
        count++;
      } else {
        log(`⚠️  ${inv.invoice_number} (${res.status})`, 'yellow');
      }
    } catch (e) {
      log(`❌ Invoice error`, 'red');
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return count;
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║  📊 FieldCost Demo Data Population                        ║', 'cyan');
  log('║  Preparing Demo Company for Client Signoff                ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');

  try {
    const customerIds = await createCustomers();
    const itemIds = await createItems();
    const projectIds = await createProjects();
    const quoteCount = await createQuotes();
    const poCount = await createPurchaseOrders();
    const invoiceCount = await createInvoices(customerIds);

    const total = customerIds.length + itemIds.length + projectIds.length + quoteCount + poCount + invoiceCount;

    log('\n╔═══════════════════════════════════════════════════════════╗', 'green');
    log('║         ✅ DEMO DATA POPULATION COMPLETE                 ║', 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log(`║ Customers Created: ${String(customerIds.length).padEnd(41)} ║`, 'green');
    log(`║ Items Created: ${String(itemIds.length).padEnd(46)} ║`, 'green');
    log(`║ Projects Created: ${String(projectIds.length).padEnd(43)} ║`, 'green');
    log(`║ Quotes Created: ${String(quoteCount).padEnd(45)} ║`, 'green');
    log(`║ Purchase Orders Created: ${String(poCount).padEnd(35)} ║`, 'green');
    log(`║ Invoices Created: ${String(invoiceCount).padEnd(43)} ║`, 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log(`║ TOTAL DATA POINTS: ${String(total).padEnd(39)} ║`, 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log('║ 🌐 View Dashboard: https://fieldcost.vercel.app/         ║', 'green');
    log('║ 🎯 Click "Demo Workspace" to see all test data            ║', 'green');
    log('║ ⏱️  Ready for client signoff in 30 minutes!               ║', 'green');
    log('╚═══════════════════════════════════════════════════════════╝\n', 'green');

  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
