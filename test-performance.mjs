#!/usr/bin/env node
/**
 * Performance & Load Testing
 * Tests API response times, throughput, and handles concurrent operations
 * Run: node test-performance.mjs
 */

import https from 'https';
import { URL } from 'url';

const BASE_URL = 'https://fieldcost.vercel.app/api';

let results = {
  responseTimes: [],
  totalTime: 0,
  successCount: 0,
  failureCount: 0,
  concurrentTests: [],
};

function httpRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 20000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        try {
          resolve({ 
            status: res.statusCode, 
            body: data ? JSON.parse(data) : null,
            responseTime
          });
        } catch {
          resolve({ status: res.statusCode, body: data, responseTime });
        }
      });
    });

    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      reject({ error: err.message, responseTime });
    });

    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      reject({ error: 'Timeout', responseTime });
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function recordResponse(time, success = true) {
  results.responseTimes.push(time);
  if (success) results.successCount++;
  else results.failureCount++;
}

async function testResponseTimes() {
  console.log('\n' + '='.repeat(70));
  console.log('⚡ RESPONSE TIME TESTS');
  console.log('='.repeat(70) + '\n');

  const endpoints = [
    { method: 'GET', path: 'projects?user_id=demo' },
    { method: 'GET', path: 'customers?user_id=demo' },
    { method: 'GET', path: 'invoices?user_id=demo' },
    { method: 'GET', path: 'tasks?user_id=demo' },
    { method: 'GET', path: 'reports?user_id=demo' },
  ];

  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint.method} ${endpoint.path}`);
    const times = [];

    for (let i = 0; i < 5; i++) {
      try {
        const res = await httpRequest(endpoint.method, endpoint.path);
        times.push(res.responseTime);
        recordResponse(res.responseTime, res.status === 200);
        console.log(`  Request ${i + 1}: ${res.responseTime}ms`);
      } catch (err) {
        recordResponse(0, false);
        console.log(`  Request ${i + 1}: FAILED`);
      }
    }

    if (times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
      const max = Math.max(...times);
      const min = Math.min(...times);
      console.log(`  Average: ${avg}ms, Min: ${min}ms, Max: ${max}ms`);
    }
    console.log('');
  }
}

async function testConcurrentOperations() {
  console.log('\n' + '='.repeat(70));
  console.log('🔄 CONCURRENT OPERATIONS TEST');
  console.log('='.repeat(70) + '\n');

  console.log('Executing 10 concurrent requests...\n');

  const promises = [];
  const startTime = Date.now();

  for (let i = 0; i < 10; i++) {
    promises.push(
      httpRequest('GET', `projects?user_id=demo`)
        .then((res) => {
          recordResponse(res.responseTime, res.status === 200);
          return { success: true, index: i, time: res.responseTime };
        })
        .catch((err) => {
          recordResponse(err.responseTime || 0, false);
          return { success: false, index: i, error: err.error };
        })
    );
  }

  const concurrentResults = await Promise.all(promises);
  const totalTime = Date.now() - startTime;

  console.log('Concurrent Request Results:');
  for (const result of concurrentResults) {
    if (result.success) {
      console.log(`  ✅ Request ${result.index + 1}: ${result.time}ms`);
    } else {
      console.log(`  ❌ Request ${result.index + 1}: ${result.error}`);
    }
  }

  console.log(`\nTotal time for 10 concurrent requests: ${totalTime}ms`);
  console.log(`Average per request: ${Math.round(totalTime / 10)}ms`);

  results.concurrentTests.push({
    count: 10,
    totalTime,
    successCount: concurrentResults.filter(r => r.success).length,
    failureCount: concurrentResults.filter(r => !r.success).length,
  });
}

async function testThroughput() {
  console.log('\n' + '='.repeat(70));
  console.log('📊 THROUGHPUT TEST');
  console.log('='.repeat(70) + '\n');

  console.log('Sending 20 sequential requests...\n');

  const startTime = Date.now();
  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < 20; i++) {
    try {
      const res = await httpRequest('GET', 'projects?user_id=demo');
      if (res.status === 200) successCount++;
      else failureCount++;
      process.stdout.write('.');
    } catch (err) {
      failureCount++;
      process.stdout.write('F');
    }
  }

  const totalTime = Date.now() - startTime;
  const throughput = (20 / (totalTime / 1000)).toFixed(2);

  console.log(`\n\nThroughput Test Results:`);
  console.log(`  Total Time: ${totalTime}ms`);
  console.log(`  Successful: ${successCount}/20`);
  console.log(`  Failed: ${failureCount}/20`);
  console.log(`  Throughput: ${throughput} requests/second`);
}

async function testCreateOperations() {
  console.log('\n' + '='.repeat(70));
  console.log('🔨 CREATE OPERATIONS PERFORMANCE');
  console.log('='.repeat(70) + '\n');

  console.log('Testing creation speed for various resources...\n');

  // Project creation
  console.log('Creating 5 projects:');
  const projectTimes = [];
  for (let i = 1; i <= 5; i++) {
    try {
      const start = Date.now();
      const res = await httpRequest('POST', 'projects', {
        name: `Perf Test Project ${Date.now()}-${i}`,
        budget: 10000,
        user_id: 'demo',
      });
      const time = Date.now() - start;
      projectTimes.push(time);
      console.log(`  Project ${i}: ${time}ms - ${res.status === 200 || res.status === 201 ? '✅' : '❌'}`);
    } catch (err) {
      console.log(`  Project ${i}: FAILED`);
    }
  }

  if (projectTimes.length > 0) {
    const avg = Math.round(projectTimes.reduce((a, b) => a + b) / projectTimes.length);
    console.log(`  Average: ${avg}ms\n`);
  }

  // Customer creation
  console.log('Creating 5 customers:');
  const customerTimes = [];
  for (let i = 1; i <= 5; i++) {
    try {
      const start = Date.now();
      const res = await httpRequest('POST', 'customers', {
        name: `Perf Customer ${Date.now()}-${i}`,
        email: `perf-${Date.now()}-${i}@test.com`,
        user_id: 'demo',
      });
      const time = Date.now() - start;
      customerTimes.push(time);
      console.log(`  Customer ${i}: ${time}ms - ${res.status === 200 || res.status === 201 ? '✅' : '❌'}`);
    } catch (err) {
      console.log(`  Customer ${i}: FAILED`);
    }
  }

  if (customerTimes.length > 0) {
    const avg = Math.round(customerTimes.reduce((a, b) => a + b) / customerTimes.length);
    console.log(`  Average: ${avg}ms\n`);
  }
}

async function testReadPerformance() {
  console.log('\n' + '='.repeat(70));
  console.log('📖 READ OPERATIONS PERFORMANCE');
  console.log('='.repeat(70) + '\n');

  const operations = [
    { name: 'List Projects', method: 'GET', path: 'projects?user_id=demo' },
    { name: 'List Customers', method: 'GET', path: 'customers?user_id=demo' },
    { name: 'List Invoices', method: 'GET', path: 'invoices?user_id=demo' },
    { name: 'List Tasks', method: 'GET', path: 'tasks?user_id=demo' },
  ];

  for (const op of operations) {
    console.log(`Testing: ${op.name}`);
    const times = [];

    for (let i = 0; i < 5; i++) {
      try {
        const start = Date.now();
        const res = await httpRequest(op.method, op.path);
        const time = Date.now() - start;
        times.push(time);
        console.log(`  Request ${i + 1}: ${time}ms`);
      } catch (err) {
        console.log(`  Request ${i + 1}: FAILED`);
      }
    }

    if (times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
      const max = Math.max(...times);
      const min = Math.min(...times);
      console.log(`  Avg: ${avg}ms, Min: ${min}ms, Max: ${max}ms\n`);
    }
  }
}

async function runAllTests() {
  console.log('\n╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(22) + '⚡ PERFORMANCE TEST SUITE' + ' '.repeat(20) + '║');
  console.log('╚' + '═'.repeat(68) + '╝\n');

  try {
    await testResponseTimes();
    await testConcurrentOperations();
    await testThroughput();
    await testCreateOperations();
    await testReadPerformance();
  } catch (err) {
    console.error('Test error:', err);
  }

  // Summary
  console.log('\n' + '═'.repeat(70));
  console.log('📊 PERFORMANCE SUMMARY');
  console.log('═'.repeat(70));
  console.log(`Total Requests: ${results.successCount + results.failureCount}`);
  console.log(`Successful: ${results.successCount}`);
  console.log(`Failed: ${results.failureCount}`);

  if (results.responseTimes.length > 0) {
    const avg = Math.round(results.responseTimes.reduce((a, b) => a + b) / results.responseTimes.length);
    const max = Math.max(...results.responseTimes);
    const min = Math.min(...results.responseTimes);
    console.log(`\nResponse Time Statistics:`);
    console.log(`  Average: ${avg}ms`);
    console.log(`  Min: ${min}ms`);
    console.log(`  Max: ${max}ms`);
  }

  console.log('\n✅ Performance tests complete!\n');
}

runAllTests().catch(console.error);
