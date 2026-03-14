#!/usr/bin/env node

/**
 * Quick Demo Data Population for Client Signoff
 * Uses direct API calls without auth
 * Run: node quick-demo-setup.mjs
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';
const DEMO_USER_ID = 'demo';
const DEMO_COMPANY_ID = '1';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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
      headers: {
        'Content-Type': 'application/json',
      },
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
    { user_id: DEMO_USER_ID, name: 'Acme Construction Inc', email: 'contact@acme.com', phone: '+1-555-0101' },
    { user_id: DEMO_USER_ID, name: 'BuildRight Engineering', email: 'info@buildright.com', phone: '+1-555-0102' },
    { user_id: DEMO_USER_ID, name: 'Urban Development Corp', email: 'projects@urbandv.com', phone: '+1-555-0103' },
  ];

  const ids = [];
  for (const c of customers) {
    try {
      const res = await makeRequest('POST', `/api/customers?user_id=${DEMO_USER_ID}`, c);
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${c.name}`, 'green');
        ids.push(res.data.id);
      }
    } catch (e) {
      log(`⚠️  ${c.name} - ${e.message}`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return ids;
}

async function createItems() {
  log('\n📦 Creating Inventory...', 'cyan');
  const items = [
    { user_id: DEMO_USER_ID, name: 'Steel Beams Grade A', sku: 'SB-GA', category: 'Materials', unit_price: 850 },
    { user_id: DEMO_USER_ID, name: 'Concrete Mix Premium', sku: 'CM-P', category: 'Materials', unit_price: 125 },
    { user_id: DEMO_USER_ID, name: 'Skilled Electrician', sku: 'ELEC', category: 'Labor', unit_price: 95 },
    { user_id: DEMO_USER_ID, name: 'Project Manager', sku: 'PM', category: 'Labor', unit_price: 150 },
    { user_id: DEMO_USER_ID, name: 'Excavator Rental', sku: 'EXC', category: 'Equipment', unit_price: 550 },
  ];

  const ids = [];
  for (const item of items) {
    try {
      const res = await makeRequest('POST', `/api/items?user_id=${DEMO_USER_ID}`, item);
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${item.name}`, 'green');
        ids.push(res.data.id);
      }
    } catch (e) {
      log(`⚠️  ${item.name}`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return ids;
}

async function createProjects() {
  log('\n🏗️  Creating Projects...', 'cyan');
  const projects = [
    { 
      user_id: DEMO_USER_ID, 
      name: 'Downtown Office Complex - Phase 1', 
      description: 'New 24-story mixed-use office and retail',
      status: 'active', 
      budget: 15000000 
    },
    { 
      user_id: DEMO_USER_ID, 
      name: 'Residential Developer - 150 Units', 
      description: 'Development of modern residential community',
      status: 'active', 
      budget: 8500000 
    },
    { 
      user_id: DEMO_USER_ID, 
      name: 'Highway Expansion Project', 
      description: 'Interstate highway widening',
      status: 'active', 
      budget: 22000000 
    },
  ];

  const ids = [];
  for (const p of projects) {
    try {
      const res = await makeRequest('POST', `/api/projects?user_id=${DEMO_USER_ID}`, p);
      if ([200, 201].includes(res.status) && res.data.id) {
        log(`✅ ${p.name.substring(0, 30)}...`, 'green');
        ids.push(res.data.id);
      }
    } catch (e) {
      log(`⚠️  Project creation`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return ids;
}

async function createQuotes() {
  log('\n💬 Creating Quotes...', 'cyan');
  const quotes = [
    { 
      user_id: DEMO_USER_ID, 
      quote_number: `QT-2024-001`, 
      description: 'Foundation and structural work',
      status: 'approved',
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      quote_number: `QT-2024-002`, 
      description: 'HVAC and mechanical systems',
      status: 'draft',
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      quote_number: `QT-2024-003`, 
      description: 'Residential development',
      status: 'sent',
      tax_rate: 0.08
    },
  ];

  let count = 0;
  for (const q of quotes) {
    try {
      const res = await makeRequest('POST', `/api/quotes?user_id=${DEMO_USER_ID}`, q);
      if ([200, 201].includes(res.status)) {
        log(`✅ ${q.quote_number}`, 'green');
        count++;
      }
    } catch (e) {
      log(`⚠️  Quote`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return count;
}

async function createPurchaseOrders() {
  log('\n📋 Creating Purchase Orders...', 'cyan');
  const pos = [
    { 
      user_id: DEMO_USER_ID, 
      po_number: `PO-2024-001`, 
      description: 'Steel and materials delivery',
      status: 'approved',
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      po_number: `PO-2024-002`, 
      description: 'Electrical equipment',
      status: 'received',
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      po_number: `PO-2024-003`, 
      description: 'Concrete and formwork',
      status: 'draft',
      tax_rate: 0.08
    },
  ];

  let count = 0;
  for (const po of pos) {
    try {
      const res = await makeRequest('POST', `/api/purchase-orders?user_id=${DEMO_USER_ID}`, po);
      if ([200, 201].includes(res.status)) {
        log(`✅ ${po.po_number}`, 'green');
        count++;
      }
    } catch (e) {
      log(`⚠️  PO`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return count;
}

async function createInvoices() {
  log('\n📄 Creating Invoices...', 'cyan');
  const invoices = [
    { 
      user_id: DEMO_USER_ID, 
      invoice_number: `INV-2024-001`, 
      description: 'Foundation work - Progress billing',
      status: 'paid',
      amount: 125000,
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      invoice_number: `INV-2024-002`, 
      description: 'Structural steel installation',
      status: 'sent',
      amount: 175000,
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      invoice_number: `INV-2024-003`, 
      description: 'Project management services',
      status: 'draft',
      amount: 95000,
      tax_rate: 0.08
    },
    { 
      user_id: DEMO_USER_ID, 
      invoice_number: `INV-2024-004`, 
      description: 'Residential development',
      status: 'overdue',
      amount: 250000,
      tax_rate: 0.08
    },
  ];

  let count = 0;
  for (const inv of invoices) {
    try {
      const res = await makeRequest('POST', `/api/invoices?user_id=${DEMO_USER_ID}`, inv);
      if ([200, 201].includes(res.status)) {
        log(`✅ ${inv.invoice_number}`, 'green');
        count++;
      }
    } catch (e) {
      log(`⚠️  Invoice`, 'yellow');
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return count;
}

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║  FieldCost Demo Data Population - Client Signoff          ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');

  try {
    const customerIds = await createCustomers();
    const itemIds = await createItems();
    const projectIds = await createProjects();
    const quoteCount = await createQuotes();
    const poCount = await createPurchaseOrders();
    const invoiceCount = await createInvoices();

    const total = customerIds.length + itemIds.length + projectIds.length + quoteCount + poCount + invoiceCount;

    log('\n╔═══════════════════════════════════════════════════════════╗', 'green');
    log('║            ✅ demo data population complete               ║', 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log(`║ Customers: ${String(customerIds.length).padEnd(48)} ║`, 'green');
    log(`║ Items: ${String(itemIds.length).padEnd(51)} ║`, 'green');
    log(`║ Projects: ${String(projectIds.length).padEnd(48)} ║`, 'green');
    log(`║ Quotes: ${String(quoteCount).padEnd(50)} ║`, 'green');
    log(`║ Purchase Orders: ${String(poCount).padEnd(41)} ║`, 'green');
    log(`║ Invoices: ${String(invoiceCount).padEnd(47)} ║`, 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log(`║ TOTAL: ${String(total).padEnd(53)} ║`, 'green');
    log('╠═══════════════════════════════════════════════════════════╣', 'green');
    log('║ 🌐 View: https://fieldcost.vercel.app/dashboard           ║', 'green');
    log('║ 🎯 Demo Workspace - Ready for client signoff!             ║', 'green');
    log('╚═══════════════════════════════════════════════════════════╝\n', 'green');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
