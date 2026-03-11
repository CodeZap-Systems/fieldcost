#!/usr/bin/env node
/**
 * Tier 2 Comprehensive Endpoint Test
 * Tests all Tier 2 endpoints to identify working/broken features
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(method, path) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      resolve({
        status: res.statusCode,
        success: res.statusCode < 400,
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERROR', success: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'TIMEOUT', success: false });
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 TIER 2 COMPREHENSIVE ENDPOINT TEST');
  console.log('=' .repeat(50));

  const endpoints = [
    // TIER 1: Foundation
    { path: '/health', tier: 'TIER 1', feature: 'Health Check' },
    { path: '/projects', tier: 'TIER 1', feature: 'Projects' },
    { path: '/tasks', tier: 'TIER 1', feature: 'Tasks' },
    { path: '/invoices', tier: 'TIER 1', feature: 'Invoices' },
    { path: '/customers', tier: 'TIER 1', feature: 'Customers' },
    { path: '/items', tier: 'TIER 1', feature: 'Items' },
    { path: '/crew', tier: 'TIER 1', feature: 'Crew' },

    // TIER 2: Growth Features
    { path: '/budgets', tier: 'TIER 2', feature: 'Budget Tracking' },
    { path: '/wip-tracking', tier: 'TIER 2', feature: 'WIP Metrics' },
    { path: '/invoices/export', tier: 'TIER 2', feature: 'Invoice Export' },
    { path: '/workflows', tier: 'TIER 2', feature: 'Approval Workflows' },
    { path: '/reports', tier: 'TIER 2', feature: 'Reports' },
    { path: '/location-tracking', tier: 'TIER 2', feature: 'Geolocation' },
    { path: '/task-photos', tier: 'TIER 2', feature: 'Photo Evidence' },
    { path: '/offline-sync-status', tier: 'TIER 2', feature: 'Offline Sync' },
  ];

  let tier1Results = [];
  let tier2Results = [];

  console.log('\n📊 Testing Tier 1 (Foundation)...\n');
  for (const ep of endpoints.filter(e => e.tier === 'TIER 1')) {
    const result = await testEndpoint('GET', ep.path);
    tier1Results.push({ ...ep, ...result });
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} GET ${ep.path} → ${result.status}`);
  }

  console.log('\n📊 Testing Tier 2 (Growth Features)...\n');
  for (const ep of endpoints.filter(e => e.tier === 'TIER 2')) {
    const result = await testEndpoint('GET', ep.path);
    tier2Results.push({ ...ep, ...result });
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} GET ${ep.path} → ${result.status}`);
  }

  const allResults = [...tier1Results, ...tier2Results];
  const working = allResults.filter(r => r.success);
  const broken = allResults.filter(r => !r.success);

  console.log('\n' + '='.repeat(50));
  console.log('📈 SUMMARY');
  console.log('='.repeat(50));
  
  console.log(`\n✅ WORKING (${working.length}/${allResults.length}):`);
  for (const r of working) {
    console.log(`   ${r.path.padEnd(25)} → ${r.feature}`);
  }

  if (broken.length > 0) {
    console.log(`\n❌ NEEDS FIXING (${broken.length}/${allResults.length}):`);
    for (const r of broken) {
      console.log(`   ${r.path.padEnd(25)} → ${r.feature} [${r.status}]`);
    }
  }

  console.log('\n🎯 TIER 2 READINESS');
  const tier1Pass = tier1Results.filter(r => r.success).length;
  const tier2Pass = tier2Results.filter(r => r.success).length;
  console.log(`   Tier 1: ${tier1Pass}/${tier1Results.length} endpoints working`);
  console.log(`   Tier 2: ${tier2Pass}/${tier2Results.length} endpoints working`);

  if (tier2Pass >= 5) {
    console.log('\n   ✅ TIER 2 IS ~40-50% READY FOR SATURDAY');
  } else {
    console.log('\n   ⚠️  TIER 2 NEEDS MORE WORK BEFORE SATURDAY');
  }

  process.exit(0);
}

console.log('Waiting for server to be ready...');
setTimeout(runTests, 2000);
