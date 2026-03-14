#!/usr/bin/env node

/**
 * Debug Demo Data - Check API responses
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app';
const DEMO_USER_ID = 'demo';

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
        resolve({
          status: res.statusCode,
          rawData: data,
          data: (() => { try { return JSON.parse(data); } catch { return data; } })(),
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  console.log('Testing API endpoints...\n');

  // Test customer creation
  console.log('1️⃣ Testing customer creation:');
  const customerRes = await makeRequest('POST', `/api/customers?user_id=${DEMO_USER_ID}`, {
    user_id: DEMO_USER_ID,
    name: 'Test Customer',
    email: 'test@example.com',
  });

  console.log(`Status: ${customerRes.status}`);
  console.log(`Response:`, customerRes.data);
  console.log();

  // Test invoice creation
  console.log('2️⃣ Testing invoice creation:');
  const invoiceRes = await makeRequest('POST', `/api/invoices?user_id=${DEMO_USER_ID}`, {
    user_id: DEMO_USER_ID,
    invoice_number: `TEST-${Date.now()}`,
    description: 'Test invoice',
    amount: 1000,
  });

  console.log(`Status: ${invoiceRes.status}`);
  console.log(`Response:`, invoiceRes.data);
  console.log();

  // Test GET customers
  console.log('3️⃣ Testing GET customers:');
  const customersGetRes = await makeRequest('GET', `/api/customers?user_id=${DEMO_USER_ID}`, null);
  
  console.log(`Status: ${customersGetRes.status}`);
  console.log(`Response:`, customersGetRes.data);
}

test().catch(console.error);
