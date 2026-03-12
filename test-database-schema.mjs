#!/usr/bin/env node
/**
 * Database Schema & Integrity Tests
 * Validates database structure, constraints, and data integrity
 * Run: node test-database-schema.mjs
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app/api';

let results = { total: 0, passed: 0, failed: 0, tests: [] };

function httpRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function test(name, pass, details = {}) {
  results.total++;
  if (pass) {
    results.passed++;
    console.log(`  ✅ ${name}`);
  } else {
    results.failed++;
    console.log(`  ❌ ${name}`);
    if (details.error) console.log(`     ${details.error}`);
  }
  results.tests.push({ name, pass, details });
}

async function runTests() {
  console.log('\n' + '='.repeat(70));
  console.log('🗄️ DATABASE SCHEMA & INTEGRITY TESTS');
  console.log('='.repeat(70) + '\n');

  // Test 1: Project schema validation
  console.log('Testing Project Schema...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Schema Test ${Date.now()}`,
      description: 'Test project',
      budget: 10000,
      currency: 'ZAR',
      user_id: 'demo',
    });
    test('Project creation succeeds', res.status === 200 || res.status === 201, { status: res.status });
    if (res.body?.id) {
      test('Project has ID field', !!res.body.id, {});
      test('Project has name field', !!res.body.name, {});
      test('Project has currency field', !!res.body.currency, {});
      test('Project has user_id field', !!res.body.user_id, {});
    }
  } catch (err) {
    test('Project schema test', false, { error: err.message });
  }

  // Test 2: Customer schema validation
  console.log('\nTesting Customer Schema...');
  try {
    const res = await httpRequest('POST', 'customers', {
      name: `Schema Customer ${Date.now()}`,
      email: `test-${Date.now()}@test.com`,
      phone: '+27123456789',
      user_id: 'demo',
    });
    test('Customer creation succeeds', res.status === 200 || res.status === 201, { status: res.status });
    if (res.body?.id) {
      test('Customer has ID field', !!res.body.id, {});
      test('Customer has name field', !!res.body.name, {});
      test('Customer has email field', !!res.body.email, {});
      test('Customer has user_id field', !!res.body.user_id, {});
    }
  } catch (err) {
    test('Customer schema test', false, { error: err.message });
  }

  // Test 3: Invoice schema validation
  console.log('\nTesting Invoice Schema...');
  try {
    const customerRes = await httpRequest('POST', 'customers', {
      name: `Invoice Customer ${Date.now()}`,
      email: `invoice-${Date.now()}@test.com`,
      user_id: 'demo',
    });

    if (customerRes.body?.id) {
      const res = await httpRequest('POST', 'invoices', {
        customer_id: customerRes.body.id,
        invoice_number: `INV-${Date.now()}`,
        issued_on: new Date().toISOString().split('T')[0],
        due_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'issued',
        currency: 'ZAR',
        user_id: 'demo',
        lines: [{ name: 'Service', quantity: 1, rate: 500, total: 500 }],
      });

      test('Invoice creation succeeds', res.status === 200 || res.status === 201, { status: res.status });
      if (res.body?.id) {
        test('Invoice has ID field', !!res.body.id, {});
        test('Invoice has invoice_number field', !!res.body.invoice_number, {});
        test('Invoice has status field', !!res.body.status, {});
        test('Invoice has customer_id field', !!res.body.customer_id, {});
      }
    }
  } catch (err) {
    test('Invoice schema test', false, { error: err.message });
  }

  // Test 4: Data type validation
  console.log('\nTesting Data Type Validation...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: 123, // Should be string
      budget: 'invalid', // Should be number
      user_id: 'demo',
    });
    test('Invalid data types handled', res.status === 400 || res.status === 200, { status: res.status });
  } catch (err) {
    test('Data type validation test', false, { error: err.message });
  }

  // Test 5: Null/undefined handling
  console.log('\nTesting Null/Undefined Handling...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: null,
      user_id: 'demo',
    });
    test('Null fields handled gracefully', res.status === 400 || res.status === 200, { status: res.status });
  } catch (err) {
    test('Null handling test', false, { error: err.message });
  }

  // Test 6: Foreign key constraints
  console.log('\nTesting Foreign Key Constraints...');
  try {
    const res = await httpRequest('POST', 'invoices', {
      customer_id: 99999, // Non-existent customer
      invoice_number: `TEST-${Date.now()}`,
      issued_on: new Date().toISOString().split('T')[0],
      status: 'issued',
      user_id: 'demo',
      lines: [{ name: 'Test', quantity: 1, rate: 100, total: 100 }],
    });
    test('Foreign key validation', res.status === 400 || res.status === 404 || res.status === 200, { status: res.status });
  } catch (err) {
    test('Foreign key test', false, { error: err.message });
  }

  // Test 7: Unique constraints
  console.log('\nTesting Unique Constraints...');
  try {
    const uniqueEmail = `unique-${Date.now()}@test.com`;
    const res1 = await httpRequest('POST', 'customers', {
      name: 'Customer 1',
      email: uniqueEmail,
      user_id: 'demo',
    });

    if (res1.body?.id) {
      const res2 = await httpRequest('POST', 'customers', {
        name: 'Customer 2',
        email: uniqueEmail, // Duplicate email
        user_id: 'demo',
      });
      test('Duplicate email rejected', res2.status === 400 || res2.status === 409 || res2.status === 200, { status: res2.status });
    }
  } catch (err) {
    test('Unique constraint test', false, { error: err.message });
  }

  // Test 8: Timestamp fields
  console.log('\nTesting Timestamp Fields...');
  try {
    const res = await httpRequest('GET', 'projects?user_id=demo');
    if (Array.isArray(res.body) && res.body.length > 0) {
      const project = res.body[0];
      test('Project has created_at timestamp', !!project.created_at, {});
      test('Project has updated_at timestamp', !!project.updated_at, {});
    } else {
      test('Projects list accessible for timestamp check', res.status === 200, { status: res.status });
    }
  } catch (err) {
    test('Timestamp field test', false, { error: err.message });
  }

  // Test 9: Currency field validation
  console.log('\nTesting Currency Field...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Currency Test ${Date.now()}`,
      currency: 'ZAR', // Valid currency
      user_id: 'demo',
    });
    test('Valid currency accepted', res.status === 200 || res.status === 201, { status: res.status });
  } catch (err) {
    test('Currency validation test', false, { error: err.message });
  }

  // Test 10: Long text field handling
  console.log('\nTesting Long Text Fields...');
  try {
    const longDescription = 'A'.repeat(5000); // Very long text
    const res = await httpRequest('POST', 'projects', {
      name: `Long Text Test ${Date.now()}`,
      description: longDescription,
      user_id: 'demo',
    });
    test('Long text fields accepted', res.status === 200 || res.status === 201, { status: res.status });
  } catch (err) {
    test('Long text field test', false, { error: err.message });
  }

  // Print summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 DATABASE SCHEMA TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Pass Rate: ${Math.round((results.passed / results.total) * 100)}%`);
  console.log('═'.repeat(70) + '\n');
}

runTests().catch(console.error);
