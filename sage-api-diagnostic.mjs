/**
 * Sage API Authentication Diagnostic
 * Helps identify correct authentication method
 */

import https from 'https';

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
      const bodyStr = JSON.stringify(body);
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
          resolve({ success: res.statusCode < 400, status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ success: res.statusCode < 400, status: res.statusCode, data, raw: true });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runDiagnostics() {
  console.log('='.repeat(60));
  console.log('SAGE ONE API DIAGNOSTICS');
  console.log('='.repeat(60));

  const email = 'dev@codezap.co.za';
  const password = 'Dingb@tDing4783';
  const credentials = Buffer.from(`${email}:${password}`).toString('base64');

  // Test 1: Try resellers endpoint
  console.log('\n[TEST 1] Resellers Portal API');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest(
      'resellers.accounting.sageone.co.za',
      '/api/1.4.2/User',
      'GET',
      { 'Authorization': `Basic ${credentials}` }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 2: Try main accounting endpoint without auth
  console.log('\n[TEST 2] Main API without Authentication');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2/Company'
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 3: Try with Basic Auth on main endpoint
  console.log('\n[TEST 3] Main API with Basic Auth');
  console.log('-'.repeat(60));
  console.log(`Credentials Base64: ${credentials.substring(0, 20)}...`);
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2/User',
      'GET',
      { 'Authorization': `Basic ${credentials}` }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 4: Try token endpoint with form data
  console.log('\n[TEST 4] Token Endpoint (Form Data)');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/oauth/token',
      'POST',
      { 'Content-Type': 'application/x-www-form-urlencoded' },
      {
        username: email,
        password: password,
        grant_type: 'password',
        scope: 'full',
      }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 5: Check if we can reach the API at all
  console.log('\n[TEST 5] API Root Endpoint');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2'
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  // Test 6: Try with different header format
  console.log('\n[TEST 6] Authorization with Different Format');
  console.log('-'.repeat(60));
  try {
    const res = await makeRequest(
      'accounting.sageone.co.za',
      '/api/1.4.2/User',
      'GET',
      {
        'X-User': email,
        'X-Password': password,
      }
    );
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, res.data);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('DIAGNOSTICS COMPLETE');
  console.log('='.repeat(60));
  console.log('\nNext Steps:');
  console.log('1. Check which endpoint returns useful data');
  console.log('2. Verify credentials are correct');
  console.log('3. Contact Sage support if needed');
  console.log('4. Update authentication method based on results');
}

runDiagnostics().catch(console.error);
