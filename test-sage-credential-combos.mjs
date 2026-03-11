#!/usr/bin/env node
/**
 * Test Sage API with different credential combinations
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
      rejectUnauthorized: false, // Allow self-signed certs
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data.length < 1000 ? data : data.slice(0, 500),
        });
      });
    });

    req.on('error', (error) => {
      resolve({ statusCode: 0, error: error.message, body: '' });
    });

    req.end();
  });
}

async function testCredentialCombos() {
  console.log('🔑 Testing Sage API with different credential combinations\n');

  // Test 1: Basic Auth with username + API Key as password
  console.log('1. Basic Auth: username + API Key as password');
  let credentials = Buffer.from(`${SAGE_USERNAME}:${SAGE_API_KEY}`).toString('base64');
  let res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`   ✅ SUCCESS!`);
    console.log(`   Body: ${res.body.slice(0, 200)}`);
  } else {
    console.log(`   Body: ${res.body.slice(0, 100)}`);
  }
  console.log();

  // Test 2: Basic Auth with just email (no domain) + API Key
  console.log('2. Basic Auth: email (no domain) + password');
  const emailLocal = SAGE_USERNAME.split('@')[0];
  credentials = Buffer.from(`${emailLocal}:${SAGE_PASSWORD}`).toString('base64');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`   ✅ SUCCESS!`);
    console.log(`   Body: ${res.body.slice(0, 200)}`);
  }
  console.log();

  // Test 3: Try API Key as both user and password
  console.log('3. Basic Auth: API Key + API Key');
  credentials = Buffer.from(`${SAGE_API_KEY}:${SAGE_API_KEY}`).toString('base64');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`   ✅ SUCCESS!`);
  }
  console.log();

  // Test 4: Try with just API Key in Bearer token but different format
  console.log('4. Bearer with bare API Key (different formats)');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company/Current', 'GET', {
    'Authorization': SAGE_API_KEY,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`   ✅ SUCCESS!`);
  }
  console.log();

  // Test 5: Check if we need a different endpoint path
  console.log('5. Try without /Current suffix');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Company', 'GET', {
    'Authorization': `Bearer ${SAGE_API_KEY}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Headers:`, Object.keys(res.headers));
  if (res.headers['www-authenticate']) {
    console.log(`   WWW-Authenticate: ${res.headers['www-authenticate']}`);
  }
  console.log();

  // Test 6: Try fetching companies list
  console.log('6. Trying /Contact endpoint');
  credentials = Buffer.from(`${SAGE_USERNAME}:${SAGE_PASSWORD}`).toString('base64');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/2.0.0/Contact', 'GET', {
    'Authorization': `Basic ${credentials}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode < 300 && res.statusCode !== 401 && res.statusCode !== 403) {
    console.log(`   ✅ Interesting status: ${res.statusCode}`);
    console.log(`   Body: ${res.body.slice(0, 200)}`);
  }
  console.log();

  // Test 7: Try the old resellers endpoint with v1.4.2
  console.log('7. Testing old resellers endpoint with v1.4.2');
  res = await makeRequest('https://resellers.accounting.sageone.co.za/api/1.4.2/Company', 'GET', {
    'Authorization': `Basic ${Buffer.from(`${SAGE_USERNAME}:${SAGE_PASSWORD}`).toString('base64')}`,
  });
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 200) {
    console.log(`   ✅ SUCCESS with v1.4.2!`);
    console.log(`   Body: ${res.body.slice(0, 200)}`);
  }
  console.log();
}

testCredentialCombos().catch(console.error);
