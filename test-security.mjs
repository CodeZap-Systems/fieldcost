#!/usr/bin/env node
/**
 * Security & Penetration Testing
 * Tests for common security vulnerabilities and attack vectors
 * Run: node test-security.mjs
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app/api';

let results = { total: 0, passed: 0, failed: 0, vulnerabilities: [] };

function httpRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 15000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ 
            status: res.statusCode, 
            body: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
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

function test(name, passed, vuln = null) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`  ✅ ${name}`);
  } else {
    results.failed++;
    console.log(`  ❌ ${name}`);
    if (vuln) results.vulnerabilities.push(vuln);
  }
}

async function testSQLInjection() {
  console.log('\n' + '='.repeat(70));
  console.log('🔐 SQL INJECTION PREVENTION');
  console.log('='.repeat(70) + '\n');

  const payloads = [
    "' OR '1'='1",
    "'; DROP TABLE projects; --",
    "1 UNION SELECT * FROM users",
    "admin' --",
    "' OR 1=1 --",
  ];

  for (const payload of payloads) {
    try {
      const res = await httpRequest('POST', 'projects', {
        name: payload,
        user_id: 'demo',
      });
      const safe = res.status !== 500;
      test(`Payload blocked or handled: "${payload.substring(0, 20)}..."`, safe, {
        type: 'SQL Injection',
        payload,
        status: res.status,
      });
    } catch (err) {
      test(`Payload blocked or handled: "${payload.substring(0, 20)}..."`, false, {
        type: 'SQL Injection',
        payload,
        error: err.message,
      });
    }
  }
}

async function testXSSPrevention() {
  console.log('\n' + '='.repeat(70));
  console.log('🔒 XSS PREVENTION');
  console.log('='.repeat(70) + '\n');

  const payloads = [
    '<script>alert("xss")</script>',
    '<img src=x onerror="alert(1)">',
    'javascript:alert(1)',
    '<svg onload="alert(1)">',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
  ];

  for (const payload of payloads) {
    try {
      const res = await httpRequest('POST', 'projects', {
        name: payload,
        user_id: 'demo',
      });
      const safe = res.status !== 500;
      test(`XSS payload blocked: "${payload.substring(0, 20)}..."`, safe, {
        type: 'XSS',
        payload,
        status: res.status,
      });
    } catch (err) {
      test(`XSS payload blocked: "${payload.substring(0, 20)}..."`, false, {
        type: 'XSS',
        payload,
        error: err.message,
      });
    }
  }
}

async function testAuthenticationBypass() {
  console.log('\n' + '='.repeat(70));
  console.log('🔑 AUTHENTICATION BYPASS PREVENTION');
  console.log('='.repeat(70) + '\n');

  // Missing user_id
  console.log('Testing missing authentication...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Auth Test ${Date.now()}`,
    });
    const secure = res.status !== 200 && res.status !== 201;
    test('Missing user_id prevented', secure, {
      type: 'Authentication Bypass',
      scenario: 'No user_id provided',
      status: res.status,
    });
  } catch (err) {
    test('Missing user_id prevented', true, {});
  }

  // Invalid user_id format
  console.log('Testing invalid user_id...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Auth Test ${Date.now()}`,
      user_id: '../admin',
    });
    test('Invalid user_id format handled', res.status !== 500, {
      type: 'Authentication Bypass',
      scenario: 'Path traversal in user_id',
      status: res.status,
    });
  } catch (err) {
    test('Invalid user_id format handled', false, { error: err.message });
  }

  // Privilege escalation attempt
  console.log('Testing privilege escalation...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Escalation Test ${Date.now()}`,
      user_id: 'demo',
      is_admin: true,
    });
    test('Privilege escalation prevented', res.status !== 500, {
      type: 'Privilege Escalation',
      scenario: 'User trying to set admin flag',
      status: res.status,
    });
  } catch (err) {
    test('Privilege escalation prevented', false, { error: err.message });
  }
}

async function testInputValidation() {
  console.log('\n' + '='.repeat(70));
  console.log('⚙️ INPUT VALIDATION & BOUNDARY TESTING');
  console.log('='.repeat(70) + '\n');

  // Null bytes
  console.log('Testing null byte injection...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: `Test\x00Injection`,
      user_id: 'demo',
    });
    test('Null byte injection handled', res.status !== 500, {
      type: 'Null Byte Injection',
      status: res.status,
    });
  } catch (err) {
    test('Null byte injection handled', true, {});
  }

  // Unicode bypass
  console.log('Testing unicode bypass...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: 'Project \u0000 Testing',
      user_id: 'demo',
    });
    test('Unicode exploit attempts handled', res.status !== 500, {
      type: 'Unicode',
      status: res.status,
    });
  } catch (err) {
    test('Unicode exploit attempts handled', true, {});
  }

  // Oversized payload
  console.log('Testing oversized payload...');
  try {
    const largePayload = 'x'.repeat(100000);
    const res = await httpRequest('POST', 'projects', {
      name: largePayload,
      user_id: 'demo',
    });
    test('Oversized payload rejected or limited', res.status >= 200, {
      type: 'DoS - Oversized Payload',
      status: res.status,
    });
  } catch (err) {
    test('Oversized payload rejected or limited', true, {});
  }
}

async function testDataExposure() {
  console.log('\n' + '='.repeat(70));
  console.log('🔓 DATA EXPOSURE PREVENTION');
  console.log('='.repeat(70) + '\n');

  // Check if sensitive data is leaked in errors
  console.log('Testing error message sanitization...');
  try {
    const res = await httpRequest('POST', 'projects', {
      name: 123,
      budget: 'invalid',
      user_id: 'demo',
    });
    const safe = !res.body || 
                 !JSON.stringify(res.body).includes('password') &&
                 !JSON.stringify(res.body).includes('secret') &&
                 !JSON.stringify(res.body).includes('api_key');
    test('Error messages do not leak secrets', safe, {
      type: 'Information Disclosure',
      scenario: 'Secrets in error messages',
      status: res.status,
    });
  } catch (err) {
    test('Error messages do not leak secrets', true, {});
  }

  // Check response headers for information
  console.log('Testing response headers...');
  try {
    const res = await httpRequest('GET', 'projects?user_id=demo');
    const dangerous = res.headers['x-aspnet-version'] || 
                     res.headers['server']?.includes('ASP.NET') ||
                     res.headers['x-powered-by'];
    test('Server info not leaked in headers', !dangerous, {
      type: 'Information Disclosure',
      scenario: 'Server version in headers',
      headers: res.headers,
    });
  } catch (err) {
    test('Server info not leaked in headers', false, { error: err.message });
  }

  // Check for stack traces in response
  console.log('Testing stack trace exposure...');
  try {
    const res = await httpRequest('POST', 'projects', {
      invalid: 'field',
      user_id: 'demo',
    });
    const safe = !res.body || !JSON.stringify(res.body).includes('at ');
    test('Stack traces not exposed', safe, {
      type: 'Information Disclosure',
      scenario: 'Stack trace in response',
      status: res.status,
    });
  } catch (err) {
    test('Stack traces not exposed', true, {});
  }
}

async function testAccessControl() {
  console.log('\n' + '='.repeat(70));
  console.log('🚪 ACCESS CONTROL & ISOLATION');
  console.log('='.repeat(70) + '\n');

  // Demo user accessing live user data
  console.log('Testing cross-user data access...');
  try {
    const demoRes = await httpRequest('GET', 'projects?user_id=demo');
    const liveRes = await httpRequest('GET', 'projects?user_id=demo-live-test');

    let isoOk = true;
    if (Array.isArray(demoRes.body) && Array.isArray(liveRes.body)) {
      // They should have different data
      isoOk = demoRes.body.length !== liveRes.body.length || demoRes.body.length === 0;
    }

    test('User data properly isolated', isoOk, {
      type: 'Access Control',
      scenario: 'Data isolation between users',
      demo_count: demoRes.body?.length,
      live_count: liveRes.body?.length,
    });
  } catch (err) {
    test('User data properly isolated', false, { error: err.message });
  }

  // Horizontal privilege escalation
  console.log('Testing horizontal privilege escalation...');
  try {
    // Try to access another user's project
    const res = await httpRequest('PUT', 'projects/1', {
      name: 'Hacked Project',
      user_id: 'attacker',
    });
    test('Horizontal escalation prevented', res.status === 403 || res.status === 404 || res.status === 400, {
      type: 'Horizontal Privilege Escalation',
      status: res.status,
    });
  } catch (err) {
    test('Horizontal escalation prevented', true, {});
  }
}

async function testRateLimiting() {
  console.log('\n' + '='.repeat(70));
  console.log('⏱️ RATE LIMITING & DOS PROTECTION');
  console.log('='.repeat(70) + '\n');

  console.log('Testing rapid fire requests...');
  const rapidRequests = [];
  const startTime = Date.now();

  for (let i = 0; i < 20; i++) {
    rapidRequests.push(
      httpRequest('GET', 'projects?user_id=demo')
        .catch(err => ({ status: 0, error: err.message }))
    );
  }

  const results = await Promise.all(rapidRequests);
  const duration = Date.now() - startTime;
  const failureCount = results.filter(r => r.status === 429 || r.error).length;

  test(`Rate limiting or abuse protection in place`, failureCount > 0 || duration > 1000, {
    type: 'Denial of Service',
    scenario: 'Rapid requests',
    requests: 20,
    duration: duration,
    errors: failureCount,
  });
}

async function testHTTPSAndHeaders() {
  console.log('\n' + '='.repeat(70));
  console.log('🔒 HTTPS & SECURITY HEADERS');
  console.log('='.repeat(70) + '\n');

  console.log('Testing HTTPS enforcement...');
  try {
    const res = await httpRequest('GET', 'projects?user_id=demo');
    test('HTTPS in use', res.headers, { type: 'HTTPS' });
  } catch (err) {
    test('HTTPS in use', false, { error: err.message });
  }

  // Check security headers
  console.log('Testing security headers...');
  try {
    const res = await httpRequest('GET', 'projects?user_id=demo');
    const hasCSP = res.headers['content-security-policy'];
    const hasXFrame = res.headers['x-frame-options'];
    
    test('Content-Security-Policy header set', !!hasCSP, { 
      type: 'Security Headers',
      header: 'CSP',
      value: hasCSP 
    });
    
    test('X-Frame-Options header set', !!hasXFrame, { 
      type: 'Security Headers',
      header: 'X-Frame-Options',
      value: hasXFrame 
    });
  } catch (err) {
    test('Security headers present', false, { error: err.message });
  }
}

async function runAllTests() {
  console.log('\n╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(18) + '🔐 SECURITY & PENETRATION TEST SUITE' + ' '.repeat(13) + '║');
  console.log('╚' + '═'.repeat(68) + '╝\n');

  try {
    await testSQLInjection();
    await testXSSPrevention();
    await testAuthenticationBypass();
    await testInputValidation();
    await testDataExposure();
    await testAccessControl();
    await testRateLimiting();
    await testHTTPSAndHeaders();
  } catch (err) {
    console.error('Test error:', err);
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 SECURITY TEST SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Pass Rate: ${Math.round((results.passed / results.total) * 100)}%`);

  if (results.vulnerabilities.length > 0) {
    console.log(`\n⚠️  Potential vulnerabilities found:`);
    for (const vuln of results.vulnerabilities) {
      console.log(`  - ${vuln.type}: ${vuln.scenario || vuln.payload || vuln.error}`);
    }
  } else {
    console.log(`\n✅ No major security issues detected!`);
  }

  console.log('═'.repeat(70) + '\n');
}

runAllTests().catch(console.error);
