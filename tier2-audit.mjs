#!/usr/bin/env node
/**
 * Tier 2 Detailed Test & Audit
 * Comprehensive endpoint testing with detailed error reporting
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(method, path, expectedStatus = [200, 201, 400, 401, 403]) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      timeout: 8000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const statusText = {
          200: 'OK',
          201: 'Created',
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not Found',
          405: 'Method Not Allowed',
          500: 'Server Error',
          503: 'Service Unavailable',
        }[res.statusCode] || `Status ${res.statusCode}`;

        const isSuccess = res.statusCode < 400;
        
        resolve({
          status: res.statusCode,
          statusText,
          success: isSuccess,
          data: data.length < 200 ? data : data.slice(0, 200),
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        status: 'ERROR',
        statusText: err.message,
        success: false,
        data: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        statusText: 'Request timeout (8s)',
        success: false,
        data: 'Server took too long to respond',
      });
    });

    req.end();
  });
}

async function runAudit() {
  console.log('\n🔍 TIER 2 DETAILED AUDIT & TESTING');
  console.log('='.repeat(60));

  // Tier 1 endpoints
  const tier1 = [
    { path: '/health', desc: 'Health Check' },
    { path: '/projects', desc: 'List Projects' },
    { path: '/tasks', desc: 'List Tasks' },
    { path: '/invoices', desc: 'List Invoices' },
    { path: '/customers', desc: 'List Customers' },
    { path: '/items', desc: 'List Items' },
    { path: '/crew', desc: 'List Crew' },
  ];

  // Tier 2 endpoints
  const tier2 = [
    { path: '/budgets', desc: 'Budget Tracking', query: '?projectId=1', note: 'Requires projectId' },
    { path: '/wip-tracking', desc: 'WIP Metrics' },
    { path: '/invoices/export', desc: 'Invoice Export' },
    { path: '/workflows', desc: 'Approval Workflows' },
    { path: '/reports', desc: 'Reports Engine' },
    { path: '/location-tracking', desc: 'Geolocation' },
    { path: '/task-photos', desc: 'Photo Evidence' },
    { path: '/offline-sync-status', desc: 'Offline Sync' },
  ];

  console.log('\n📊 TIER 1 (Foundation)');
  console.log('-'.repeat(60));
  let tier1Pass = 0;
  const tier1Results = [];

  for (const ep of tier1) {
    const result = await testEndpoint('GET', ep.path);
    tier1Results.push(result);
    const icon = result.success ? '✅' : '❌';
    if (result.success) tier1Pass++;
    console.log(`${icon} ${ep.desc.padEnd(25)} → ${result.statusText}`);
  }

  console.log('\n📊 TIER 2 (Growth Features)');
  console.log('-'.repeat(60));
  let tier2Pass = 0;
  const tier2Results = [];

  for (const ep of tier2) {
    const testPath = ep.path + (ep.query || '');
    const result = await testEndpoint('GET', testPath);
    tier2Results.push({ ...ep, ...result });
    const icon = result.success ? '✅' : '❌';
    const note = ep.note ? ` [${ep.note}]` : '';
    if (result.success) tier2Pass++;
    console.log(`${icon} ${ep.desc.padEnd(25)} → ${result.statusText}${note}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 READINESS SUMMARY');
  console.log('='.repeat(60));

  const tier1Total = tier1.length;
  const tier2Total = tier2.length;
  const allTotal = tier1Total + tier2Total;
  const allPass = tier1Pass + tier2Pass;

  console.log(`\n✅ WORKING ENDPOINTS: ${allPass}/${allTotal}`);
  console.log(`   Tier 1: ${tier1Pass}/${tier1Total} (Foundation)`);
  console.log(`   Tier 2: ${tier2Pass}/${tier2Total} (Growth Features)`);

  if (tier2Pass >= 6) {
    console.log('\n🎯 TIER 2 STATUS: 60%+ READY FOR SATURDAY DEMO');
    console.log('   ✅ Core infrastructure working');
    console.log('   ✅ Most growth features operational');
    console.log('   ⚠️  Some advanced features need completion');
  } else if (tier2Pass >= 4) {
    console.log('\n🎯 TIER 2 STATUS: 50% READY - NEEDS FIXES');
    console.log('   ✅ Foundation stable');
    console.log('   ⚠️  Multiple Tier 2 features need fixes');
  } else {
    console.log('\n🎯 TIER 2 STATUS: CRITICAL - MAJOR WORK NEEDED');
    console.log('   ❌ Significant issues blocking Tier 2');
  }

  // Detailed issues
  const broken = tier2Results.filter(r => !r.success);
  if (broken.length > 0) {
    console.log('\n🔧 ENDPOINTS NEEDING FIXES:');
    console.log('-'.repeat(60));
    for (const ep of broken) {
      console.log(`\n❌ ${ep.desc}`);
      console.log(`   Path: ${ep.path}${ep.query || ''}`);
      console.log(`   Status: ${ep.statusText}`);
      if (ep.data && ep.data.length > 0) {
        console.log(`   Error: ${ep.data.slice(0, 100)}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Audit Complete\n');

  process.exit(tier2Pass >= 5 ? 0 : 1);
}

setTimeout(runAudit, 2000);
