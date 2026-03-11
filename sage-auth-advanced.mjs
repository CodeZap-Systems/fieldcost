/**
 * Alternative Sage API Authentication Tests
 * Tests API key and OAuth2 approaches
 */

import https from 'https';
import querystring from 'querystring';

function makeRequest(hostname, path, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port: 443,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FieldCost/1.0',
        ...headers,
      },
    };

    if (body) {
      let bodyStr;
      if (typeof body === 'string') {
        bodyStr = body;
      } else {
        bodyStr = JSON.stringify(body);
      }
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ success: res.statusCode < 400, status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ success: res.statusCode < 400, status: res.statusCode, data, raw: true, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      let bodyStr;
      if (typeof body === 'string') {
        bodyStr = body;
      } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        bodyStr = querystring.stringify(body);
        options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
      } else {
        bodyStr = JSON.stringify(body);
      }
      req.write(bodyStr);
    }

    req.end();
  });
}

async function testAlternativeAuth() {
  console.log('='.repeat(70));
  console.log('SAGE ONE ALTERNATIVE AUTHENTICATION TESTS');
  console.log('='.repeat(70));

  const email = 'dev@codezap.co.za';
  const password = 'Dingb@tDing4783';

  // Test 1: Try plain text credentials in query string
  console.log('\n[TEST 1] Credentials in Query String');
  console.log('-'.repeat(70));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      `/api/1.4.2/User?username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 2: OAuth2 with URL-encoded form
  console.log('\n[TEST 2] OAuth2 Token Endpoint (URL-Encoded)');
  console.log('-'.repeat(70));
  try {
    const body = querystring.stringify({
      username: email,
      password: password,
      grant_type: 'password',
    });
    
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/oauth/token',
      'POST',
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 3: Check if resellers endpoint needs different path
  console.log('\n[TEST 3] Resellers Token Endpoint');
  console.log('-'.repeat(70));
  try {
    const res = await makeRequest(
      'resellers.accounting.sageone.co.za',
      '/oauth/token',
      'POST',
      { 'Content-Type': 'application/json' },
      {
        username: email,
        password: password,
        grant_type: 'password',
        client_id: 'mobile',
      }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 4: Try "Bearer" token with credentials
  console.log('\n[TEST 4] Bearer Token with Base64 Credentials');
  console.log('-'.repeat(70));
  const credentials = Buffer.from(`${email}:${password}`).toString('base64');
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2/User',
      'GET',
      { 'Authorization': `Bearer ${credentials}` }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 5: Check response headers for clues
  console.log('\n[TEST 5] Analyze Response Headers');
  console.log('-'.repeat(70));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2',
      'OPTIONS'
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response Headers:`, res.headers);
    console.log(`Response Data:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 6: Check Sage's documentation server
  console.log('\n[TEST 6] API Documentation Check');
  console.log('-'.repeat(70));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api',
      'GET'
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('ANALYSIS SUMMARY');
  console.log('='.repeat(70));
  console.log(`
The Sage One BCA API authentication issue appears to be one of:
1. Credentials might be incorrect or account not properly activated
2. API might require an API key instead of user credentials
3. Account might need special permissions for API access
4. API might expect OAuth2 flow with client ID/secret

RECOMMENDATIONS:
1. Verify the account login works at: https://resellers.accounting.sageone.co.za/
2. Check account settings for API key generation
3. Contact Sage support for API authentication documentation
4. Alternative: Use Sage UI to generate API tokens or API keys
  `);
}

testAlternativeAuth().catch(console.error);
