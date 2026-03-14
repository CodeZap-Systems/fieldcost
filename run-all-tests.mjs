#!/usr/bin/env node
/**
 * Master Automated Test Runner
 * Executes all test suites and generates comprehensive report
 * Run: node run-all-tests.mjs
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const testSuites = [
  {
    name: '🏥 Core API & CRUD Tests',
    file: 'comprehensive-automated-tests.mjs',
    description: 'Basic connectivity, CRUD operations, data isolation',
  },
  {
    name: '🗄️ Database Schema Tests',
    file: 'test-database-schema.mjs',
    description: 'Schema validation, constraints, data types',
  },
  {
    name: '⚡ Performance Tests',
    file: 'test-performance.mjs',
    description: 'Response times, throughput, concurrent operations',
  },
  {
    name: '📋 Data Validation Tests',
    file: 'test-data-validation.mjs',
    description: 'Input validation, sanitization, edge cases',
  },
];

let allResults = {
  suites: [],
  startTime: new Date(),
  endTime: null,
};

function runTest(file, name) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testProcess = spawn('node', [file], {
      stdio: 'pipe',
      cwd: process.cwd(),
    });

    let output = '';
    let errorOutput = '';

    testProcess.stdout.on('data', (data) => {
      output += data.toString();
      testProcess.stdout.write(data);
    });

    testProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      testProcess.stderr.write(data);
    });

    testProcess.on('close', (code) => {
      const duration = Date.now() - startTime;
      resolve({
        file,
        name,
        code,
        output,
        errorOutput,
        duration,
        success: code === 0,
      });
    });

    testProcess.on('error', (err) => {
      const duration = Date.now() - startTime;
      resolve({
        file,
        name,
        code: 1,
        output,
        errorOutput: err.message,
        duration,
        success: false,
      });
    });
  });
}

async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('║' + ' '.repeat(15) + '🚀 COMPREHENSIVE AUTOMATED TEST SUITE - MASTER RUNNER' + ' '.repeat(9) + '║');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('╚' + '═'.repeat(78) + '╝\n');

  console.log(`📍 Environment: https://fieldcost.vercel.app`);
  console.log(`⏰ Started: ${allResults.startTime.toISOString()}`);
  console.log(`📊 Test Suites to Run: ${testSuites.length}\n`);

  for (let i = 0; i < testSuites.length; i++) {
    const suite = testSuites[i];
    console.log(`\n${'═'.repeat(80)}`);
    console.log(`📌 Running Test Suite ${i + 1}/${testSuites.length}`);
    console.log(`${suite.name}`);
    console.log(`   ${suite.description}`);
    console.log(`${'═'.repeat(80)}\n`);

    const result = await runTest(suite.file, suite.name);
    allResults.suites.push(result);

    console.log(`\n✅ Suite completed in ${(result.duration / 1000).toFixed(2)}s\n`);

    // Small delay between test runs
    if (i < testSuites.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  allResults.endTime = new Date();

  // Print final summary
  printFinalSummary();
}

function printFinalSummary() {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('║' + ' '.repeat(25) + '📊 FINAL TEST RESULTS SUMMARY' + ' '.repeat(24) + '║');
  console.log('║' + ' '.repeat(78) + '║');
  console.log('╚' + '═'.repeat(78) + '╝\n');

  const totalDuration = allResults.endTime - allResults.startTime;
  const successCount = allResults.suites.filter(s => s.success).length;
  const failureCount = allResults.suites.filter(s => !s.success).length;

  console.log('Test Suite Results:');
  console.log('─'.repeat(80));

  for (const suite of allResults.suites) {
    const status = suite.success ? '✅ PASSED' : '❌ FAILED';
    const duration = (suite.duration / 1000).toFixed(2);
    console.log(`${status} | ${suite.name.padEnd(40)} | ${duration}s`);
  }

  console.log('─'.repeat(80));
  console.log(`Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
  console.log(`Suites Passed: ${successCount}/${allResults.suites.length}`);
  console.log(`Suites Failed: ${failureCount}/${allResults.suites.length}`);

  if (failureCount === 0) {
    console.log(`\n✅ ALL TEST SUITES PASSED! Application is ready for production.\n`);
  } else {
    console.log(`\n⚠️  ${failureCount} test suite(s) had issues. Review output above.\n`);
  }

  console.log('═'.repeat(80));
  console.log(`\nTest Execution Timeline:`);
  console.log(`  Started: ${allResults.startTime.toISOString()}`);
  console.log(`  Ended:   ${allResults.endTime.toISOString()}`);
  console.log(`  Total:   ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`\n═'.repeat(80)}\n`);

  // Save report
  const reportPath = path.join(process.cwd(), 'TEST_RESULTS_AUTOMATED.json');
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);
}

runAllTests().catch(console.error);
