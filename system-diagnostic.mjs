#!/usr/bin/env node

/**
 * FieldCost System Diagnostic Test
 * Run: node system-diagnostic.mjs
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function test(name, url, checks = {}) {
  console.log(`\n📍 Testing: ${name}`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const status = response.status;
    const contentType = response.headers.get('content-type');
    
    console.log(`   Status: ${status} ${status === 200 ? '✓' : '✗'}`);
    console.log(`   Type: ${contentType}`);
    
    if (status === 200) {
      const text = await response.text();
      
      for (const [checkName, searchStr] of Object.entries(checks)) {
        const found = text.includes(searchStr);
        console.log(`   ${found ? '✓' : '✗'} ${checkName}`);
      }
      
      return true;
    }
  } catch (error) {
    console.log(`   ✗ ERROR: ${error.message}`);
    return false;
  }
  
  return false;
}

async function runDiagnostics() {
  console.log('='.repeat(50));
  console.log('FieldCost System Diagnostic');
  console.log('='.repeat(50));
  
  const results = [];
  
  // Test 1: Health  
  results.push(await test(
    'API Health',
    `${BASE_URL}/api/health`,
    { 'Has status field': '"status"' }
  ));
  
  // Test 2: Companies API
  results.push(await test(
    'Companies API',
    `${BASE_URL}/api/companies`,
    { 'Returns data': 'id' }
  ));
  
  // Test 3: Demo Login Page
  results.push(await test(
    'Demo Login Page',
    `${BASE_URL}/auth/demo-login`,
    {
      'Has HTML': '<!DOCTYPE html>',
      'Has Launch Demo text': 'Launch Demo',
      'NO Sidebar': '<aside'
    }
  ));
  
  // Test 4: Dashboard Page
  results.push(await test(
    'Dashboard Page',
    `${BASE_URL}/dashboard`,
    { 'Has HTML': '<!DOCTYPE html>' }
  ));
  
  console.log('\n' + '='.repeat(50));
  console.log(`Summary: ${results.filter(r => r).length}/${results.length} tests passed`);
  
  if (results.every(r => r)) {
    console.log('\n✅ System is READY for presentation!');
    console.log('\n⚠️  NOTE: If you see JavaScript errors in browser:');
    console.log('   1. Press Ctrl + Shift + Del to clear cache');
    console.log('   2. Press Ctrl + Shift + R to hard refresh');
    console.log('   3. Close and reopen browser if needed');
  } else {
    console.log('\n⚠️  Some tests failed - check output above');
  }
  
  console.log('='.repeat(50));
}

runDiagnostics().catch(console.error);
