#!/usr/bin/env node
/**
 * Test different Sage One BCA authentication methods
 */

import https from 'https';

const SAGE_API_KEY = '8C399659-628C-4EB2-A5D1-B76637E2B7F8';
const SAGE_USERNAME = 'dev@codezap.co.za';
const SAGE_PASSWORD = 'Dingb@tDing4783';

function makeRequest(url, method = 'GET', headers = {}) {
  return new Promise((resolve) => {
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

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data.length < 500 ? data : data.slice(0, 500),
        });
      });
    });

    req.on('error', (error) => {
      resolve({ statusCode: 0, error: error.message });
    });

    req.end();
  });
}

async function testAuthMethods() {
  console.log('🔍 Testing different Sage API authentication methods\n');

  // Test 1: X-API-KEY header
  console.log('1. Testing X-API-KEY header...');
  let res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'X-API-KEY': SAGE_API_KEY,
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 2: Authorization: Bearer with API Key (no curly braces)
  console.log('2. Testing Bearer token with API Key (clean)...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': `Bearer ${SAGE_API_KEY}`,
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 3: Try v1.4.2 endpoint instead of 2.0.0
  console.log('3. Testing old API v1.4.2 endpoint...');
  const credentials = Buffer.from(`${SAGE_USERNAME}:${SAGE_PASSWORD}`).toString('base64');
  res = await makeRequest('https://accounting.sageone.co.za/api/1.4.2/User', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 4: Try without Authorization header to see what error we get
  console.log('4. Testing without auth (to understand error handling)...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {});
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Body: ${res.body}\n`);

  // Test 5: Try different credentials header format
  console.log('5. Testing as query parameter...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current?apikey=' + encodeURIComponent(SAGE_API_KEY), 'GET', {});
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 6: Try basic auth on the v2.0.0 endpoint
  console.log('6. Testing Basic Auth on v2.0.0 endpoint...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/User', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 7: Try accessing just the base endpoint
  console.log('7. Testing base API endpoint...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/', 'GET', {
    'Authorization': `Bearer ${SAGE_API_KEY}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Body: ${res.body.slice(0, 200)}\n`);

  // Test 8: Try Company endpoint directly
  console.log('8. Testing /Company endpoint (without /Current)...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company', 'GET', {
    'Authorization': `Bearer ${SAGE_API_KEY}`,
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  // Test 9: Try with content-type headers adjusted
  console.log('9. Testing with different accept header...');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': `Bearer ${SAGE_API_KEY}`,
    'Accept': 'application/json; version=2.0',
  });
  console.log(`   Status: ${res.statusCode} ${res.statusCode < 300 ? '✅' : '❌'}\n`);

  console.log('\n✅ Tests complete. Check which status code was successful (200-299)');
}

testAuthMethods().catch(console.error);
