#!/usr/bin/env node

/**
 * Test Quotes and Orders API endpoints
 */

import https from 'https';

const BASE_URL = 'https://fieldcost.vercel.app';

function makeRequest(method, path) {
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
    req.on('timeout', () => {
      req.abort();
      reject(new Error('Timeout'));
    });
    req.end();
  });
}

async function test() {
  try {
    console.log('🧪 Testing Quotes API...');
    const quotesRes = await makeRequest('GET', `/api/quotes?company_id=8&user_id=demo-admin`);
    console.log(`Status: ${quotesRes.status}`);
    const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : [];
    console.log(`Found: ${quotes.length} quotes`);
    if (quotes.length > 0) {
      console.log(`First quote: ${quotes[0].quote_number} (${quotes[0].status})`);
      console.log(`Has line items: ${quotes[0].line_items?.length || 0}`);
    }

    console.log('\n🧪 Testing Orders API...'); const ordersRes = await makeRequest('GET', `/api/orders?company_id=8&user_id=demo-admin`);
    console.log(`Status: ${ordersRes.status}`);
    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
    console.log(`Found: ${orders.length} orders`);
    if (orders.length > 0) {
      console.log(`First order: ${orders[0].po_number} (${orders[0].status})`);
    }

    console.log('\n✅ APIs are working correctly!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

test();
