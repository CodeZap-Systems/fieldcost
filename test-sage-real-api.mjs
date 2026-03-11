#!/usr/bin/env node
/**
 * Test Sage One BCA Real API Integration
 * Tests connection with actual production credentials
 */

import https from 'https';
import http from 'http';

// Test credentials
const SAGE_API_KEY = '8C399659-628C-4EB2-A5D1-B76637E2B7F8';
const SAGE_USERNAME = 'dev@codezap.co.za';
const SAGE_PASSWORD = 'Dingb@tDing4783';
const SAGE_API_URL = 'https://resellers.accounting.sageone.co.za/api/2.0.0';
const SAGE_COMPANY_ENDPOINT = 'https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current';

console.log('🔐 Testing Sage One BCA Real API Connection');
console.log('============================================\n');

// Helper function to make HTTPS requests
function makeRequest(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    };

    console.log(`\n→ ${method} ${url}`);
    console.log(`  Headers:`, JSON.stringify(headers, null, 2));

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`← Status: ${res.statusCode}`);
        try {
          const parsed = data ? JSON.parse(data) : {};
          console.log(`  Response:`, JSON.stringify(parsed, null, 2).slice(0, 500));
          resolve({
            statusCode: res.statusCode,
            data: parsed,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        } catch (err) {
          console.log(`  Raw response:`, data.slice(0, 200));
          resolve({
            statusCode: res.statusCode,
            data: data,
            success: res.statusCode >= 200 && res.statusCode < 300,
          });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`✗ Request failed:`, error.message);
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testApiKey() {
  console.log('\n1️⃣  TEST: API Key Authentication');
  console.log('—'.repeat(40));

  try {
    const result = await makeRequest(
      SAGE_COMPANY_ENDPOINT,
      'GET',
      {
        'Authorization': `Bearer ${SAGE_API_KEY}`,
      }
    );

    if (result.success) {
      console.log('\n✅ API Key Authentication: SUCCESS');
      return true;
    } else {
      console.log('\n❌ API Key Authentication: FAILED');
      return false;
    }
  } catch (error) {
    console.log(`\n❌ API Key Test Error: ${error.message}`);
    return false;
  }
}

async function testBasicAuth() {
  console.log('\n2️⃣  TEST: Basic Auth (Username/Password)');
  console.log('—'.repeat(40));

  try {
    const credentials = Buffer.from(`${SAGE_USERNAME}:${SAGE_PASSWORD}`).toString('base64');
    const result = await makeRequest(
      `${SAGE_API_URL}/User`,
      'GET',
      {
        'Authorization': `Basic ${credentials}`,
      }
    );

    if (result.success) {
      console.log('\n✅ Basic Auth: SUCCESS');
      return true;
    } else {
      console.log('\n❌ Basic Auth: FAILED');
      return false;
    }
  } catch (error) {
    console.log(`\n❌ Basic Auth Test Error: ${error.message}`);
    return false;
  }
}

async function testCompanyEndpoint() {
  console.log('\n3️⃣  TEST: Get Company Information');
  console.log('—'.repeat(40));

  try {
    const result = await makeRequest(
      SAGE_COMPANY_ENDPOINT,
      'GET',
      {
        'Authorization': `Bearer ${SAGE_API_KEY}`,
      }
    );

    if (result.success) {
      console.log('\n✅ Company Endpoint: SUCCESS');
      console.log('\nCompany Data:', JSON.stringify(result.data, null, 2));
      return true;
    } else {
      console.log('\n❌ Company Endpoint: FAILED');
      return false;
    }
  } catch (error) {
    console.log(`\n❌ Company Endpoint Test Error: ${error.message}`);
    return false;
  }
}

async function testCreateInvoice() {
  console.log('\n4️⃣  TEST: Create Test Invoice');
  console.log('—'.repeat(40));

  try {
    const invoicePayload = {
      ContactName: 'Test Customer',
      InvoiceNumber: `FC-TEST-${Date.now().toString().slice(-6)}`,
      InvoiceDate: new Date().toISOString().split('T')[0],
      DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      Notes: 'Test WIP invoice from FieldCost integration test',
      LineItems: [
        {
          Description: 'Test Work in Progress',
          Quantity: 1.0,
          UnitAmount: 1000.00,
        }
      ],
    };

    const result = await makeRequest(
      `${SAGE_API_URL}/Invoice`,
      'POST',
      {
        'Authorization': `Bearer ${SAGE_API_KEY}`,
      },
      invoicePayload
    );

    if (result.success) {
      console.log('\n✅ Create Invoice: SUCCESS');
      console.log('\nCreated Invoice:', JSON.stringify(result.data, null, 2));
      return true;
    } else {
      console.log('\n❌ Create Invoice: FAILED');
      console.log('Status:', result.statusCode);
      return false;
    }
  } catch (error) {
    console.log(`\n❌ Create Invoice Test Error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    apiKey: false,
    basicAuth: false,
    company: false,
    invoice: false,
  };

  try {
    results.apiKey = await testApiKey();
    results.basicAuth = await testBasicAuth();
    results.company = await testCompanyEndpoint();
    
    if (results.apiKey || results.basicAuth) {
      results.invoice = await testCreateInvoice();
    }
  } catch (error) {
    console.error('\nFatal error:', error);
  }

  // Summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('='.repeat(40));
  console.log(`API Key Auth:        ${results.apiKey ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Basic Auth:          ${results.basicAuth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Company Endpoint:    ${results.company ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Create Invoice:      ${results.invoice ? '✅ PASS' : '❌ FAIL'}`);
  
  const passed = Object.values(results).filter(v => v).length;
  const total = Object.values(results).length;
  console.log(`\nResult: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Sage API integration is ready.');
    process.exit(0);
  } else if (passed > 0) {
    console.log('\n⚠️  Some tests passed. Sage API is partially working.');
    process.exit(1);
  } else {
    console.log('\n❌ All tests failed. Check credentials and API URL.');
    process.exit(1);
  }
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
