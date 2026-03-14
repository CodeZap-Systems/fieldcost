#!/usr/bin/env node

/**
 * Populate Company ID 8 with Quotes and Orders
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';
const COMPANY_ID = '8';

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

    req.on('error', (e) => {
      reject(e);
    });

    req.on('timeout', () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function populateQuotes() {
  log('\n💬 Creating Quotes...', 'cyan');

  // Get customers first
  const customersRes = await makeRequest('GET', `/api/customers?company_id=${COMPANY_ID}`);
  const customers = Array.isArray(customersRes.data) ? customersRes.data : [];
  
  if (customers.length === 0) {
    log('⚠️  No customers found', 'yellow');
    return 0;
  }

  const quotes = [
    {
      quote_number: `QT-${COMPANY_ID}-001`,
      customer_id: customers[0].id,
      description: 'Equipment Supply and Installation',
      amount: 125000,
      status: 'draft',
      valid_until: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Excavator Rental (3 months)', quantity: 1, unit_price: 75000 },
        { description: 'Operator Labor', quantity: 3, unit_price: 15000 },
      ],
    },
    {
      quote_number: `QT-${COMPANY_ID}-002`,
      customer_id: customers[1].id,
      description: 'Rock Crusher Maintenance',
      amount: 45000,
      status: 'draft',
      valid_until: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Crusher Belt Replacement', quantity: 2, unit_price: 15000 },
        { description: 'Installation & Testing', quantity: 1, unit_price: 15000 },
      ],
    },
    {
      quote_number: `QT-${COMPANY_ID}-003`,
      customer_id: customers[2].id,
      description: 'Haul Road Rehabilitation Materials',
      amount: 285000,
      status: 'draft',
      valid_until: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Gravel Base (500 tons)', quantity: 500, unit_price: 350 },
        { description: 'Recycled Asphalt (300 tons)', quantity: 300, unit_price: 280 },
      ],
    },
    {
      quote_number: `QT-${COMPANY_ID}-004`,
      customer_id: customers[3].id,
      description: 'Safety Equipment Bundle',
      amount: 22500,
      status: 'draft',
      valid_until: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Hard Hats (100 units)', quantity: 100, unit_price: 150 },
        { description: 'Safety Vests (100 units)', quantity: 100, unit_price: 75 },
      ],
    },
    {
      quote_number: `QT-${COMPANY_ID}-005`,
      customer_id: customers[4].id,
      description: 'Drilling Services - Phase 1',
      amount: 195000,
      status: 'draft',
      valid_until: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Drilling per hole', quantity: 120, unit_price: 1500 },
      ],
    },
  ];

  let created = 0;
  for (const quote of quotes) {
    const res = await makeRequest('POST', `/api/quotes?company_id=${COMPANY_ID}`, quote);
    if (res.status === 201 || res.status === 200) {
      log(`✅ ${quote.quote_number}`, 'green');
      created++;
    } else {
      log(`⚠️  ${quote.quote_number} (${res.status})`, 'yellow');
    }
  }

  return created;
}

async function populateOrders() {
  log('\n📦 Creating Purchase Orders...', 'cyan');

  const customersRes = await makeRequest('GET', `/api/customers?company_id=${COMPANY_ID}`);
  const customers = Array.isArray(customersRes.data) ? customersRes.data : [];
  
  if (customers.length === 0) {
    log('⚠️  No customers found', 'yellow');
    return 0;
  }

  const orders = [
    {
      order_number: `PO-${COMPANY_ID}-001`,
      customer_id: customers[0].id,
      description: 'Excavator Rental Agreement',
      amount: 75000,
      status: 'draft',
      due_date: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'CAT 336 Excavator', quantity: 1, unit_price: 75000 },
      ],
    },
    {
      order_number: `PO-${COMPANY_ID}-002`,
      customer_id: customers[1].id,
      description: 'Crusher Parts Supply',
      amount: 48000,
      status: 'draft',
      due_date: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Replacement Liners', quantity: 6, unit_price: 8000 },
      ],
    },
    {
      order_number: `PO-${COMPANY_ID}-003`,
      customer_id: customers[2].id,
      description: 'Road Construction Materials',
      amount: 310000,
      status: 'draft',
      due_date: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'Crushed Stone (800 tons)', quantity: 800, unit_price: 300 },
        { description: 'Gravel (400 tons)', quantity: 400, unit_price: 275 },
      ],
    },
    {
      order_number: `PO-${COMPANY_ID}-004`,
      customer_id: customers[3].id,
      description: 'Bulk Safety Equipment',
      amount: 28000,
      status: 'draft',
      due_date: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'First Aid Kits (50 units)', quantity: 50, unit_price: 400 },
        { description: 'Fire Extinguishers (20 units)', quantity: 20, unit_price: 600 },
      ],
    },
    {
      order_number: `PO-${COMPANY_ID}-005`,
      customer_id: customers[4].id,
      description: 'Explosives & Accessories',
      amount: 65000,
      status: 'draft',
      due_date: '2026-04-14',
      company_id: COMPANY_ID,
      line_items: [
        { description: 'ANFO (400 bags)', quantity: 400, unit_price: 150 },
        { description: 'Detonators (500 units)', quantity: 500, unit_price: 15 },
      ],
    },
  ];

  let created = 0;
  for (const order of orders) {
    const res = await makeRequest('POST', `/api/orders?company_id=${COMPANY_ID}`, order);
    if (res.status === 201 || res.status === 200) {
      log(`✅ ${order.order_number}`, 'green');
      created++;
    } else {
      log(`⚠️  ${order.order_number} (${res.status})`, 'yellow');
    }
  }

  return created;
}

async function main() {
  log(`\n🚀 Populating Company ID ${COMPANY_ID}\n`, 'cyan');

  try {
    const quotesCreated = await populateQuotes();
    const ordersCreated = await populateOrders();

    log('\n✅ POPULATION COMPLETE', 'green');
    log(`Quotes Created: ${quotesCreated}`);
    log(`Orders Created: ${ordersCreated}`);
    log(`TOTAL: ${quotesCreated + ordersCreated}\n`);
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
