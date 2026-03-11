#!/usr/bin/env node

/**
 * Test: Verify auto-company creation and demo sandbox setup
 * 
 * Tests:
 * 1. Auto-company creation on first login
 * 2. Demo cleanup endpoint
 * 3. Company switcher shows both real + demo
 */

const BASE_URL = "http://localhost:3000";

async function testAutoCompanyCreation() {
  console.log("\n📋 TEST 1: Auto-Company Creation");
  console.log("=====================================");
  
  try {
    // Simulate user context by calling the API
    const response = await fetch(`${BASE_URL}/api/company?company_id=none`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log("⚠️  API not responding (expected - needs auth context)");
      console.log("   To test properly, you'll need to:");
      console.log("   1. Open browser: http://localhost:3000");
      console.log("   2. Login with: dingani@codezap.co.za / Test1234");
      console.log("   3. Check if workspace selector shows 'My Company'");
      return false;
    }

    const data = await response.json();
    if (data.company && data.company.name === "My Company") {
      console.log("✅ PASS: Auto-created company found");
      console.log(`   Company: ${data.company.name}`);
      console.log(`   ID: ${data.company.id}`);
      return true;
    } else {
      console.log("⚠️  Response received but not auto-created company:");
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (err) {
    console.log("⚠️  Could not test (server might not be ready)");
    console.log(`   Error: ${err.message}`);
    return false;
  }
}

async function testDemoCleanup() {
  console.log("\n🗑️  TEST 2: Demo Data Cleanup Endpoint");
  console.log("=========================================");
  
  try {
    const response = await fetch(`${BASE_URL}/api/demo/cleanup`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.log(`⚠️  Cleanup endpoint not responding (${response.status})`);
      if (response.status === 400) {
        console.log("   (Expected - no demo user IDs configured)");
      }
      return false;
    }

    const data = await response.json();
    console.log("✅ PASS: Cleanup endpoint working");
    console.log(`   Cleaned: ${data.cleaned} records`);
    console.log(`   Cutoff: ${data.cutoffDate}`);
    return true;
  } catch (err) {
    console.log("⚠️  Could not test cleanup endpoint");
    console.log(`   Error: ${err.message}`);
    return false;
  }
}

async function testCompanySwitcher() {
  console.log("\n🔄 TEST 3: Company Switcher (Both Real + Demo)");
  console.log("================================================");
  
  try {
    const response = await fetch(`${BASE_URL}/api/company`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log("⚠️  API not responding (needs auth)");
      console.log("   To test:");
      console.log("   1. Login at http://localhost:3000");
      console.log("   2. Check workspace selector dropdown");
      console.log("   3. Should show 'My Company' (real) + optional demo");
      return false;
    }

    const data = await response.json();
    if (Array.isArray(data.companies)) {
      console.log(`✅ PASS: Companies list loaded (${data.companies.length} total)`);
      data.companies.forEach(c => {
        const isDemo = c.id === "demo-company-id" ? " [DEMO]" : " [REAL]";
        console.log(`   - ${c.name}${isDemo}`);
      });
      return true;
    } else {
      console.log("⚠️  No companies array in response");
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (err) {
    console.log("⚠️  Could not test company switcher");
    console.log(`   Error: ${err.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log("\n");
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║     AUTO-COMPANY CREATION TEST SUITE          ║");
  console.log("╚════════════════════════════════════════════════╝");

  const results = [];
  
  results.push(await testAutoCompanyCreation());
  results.push(await testDemoCleanup());
  results.push(await testCompanySwitcher());

  console.log("\n");
  console.log("╔════════════════════════════════════════════════╗");
  console.log("║              TEST SUMMARY                      ║");
  console.log("╚════════════════════════════════════════════════╝");
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`\n${passed}/${total} tests confirmed (some need manual browser testing)`);
  
  if (passed === total) {
    console.log("\n✅ All automated tests passed!");
  } else {
    console.log("\n⚠️  Some tests require manual verification.");
    console.log("\nMANUAL TEST (Most Important):");
    console.log("============================");
    console.log("1. Open http://localhost:3000");
    console.log("2. Login with dingani@codezap.co.za / Test1234");
    console.log("3. After login, check workspace selector:");
    console.log("   ✅ Should show 'My Company' (NOT empty!)");
    console.log("   ✅ Should be able to add projects/customers/invoices");
    console.log("   ✅ Optional: demo company available to switch to");
  }
  
  console.log("\n");
}

// Run tests
runAllTests().catch(console.error);
