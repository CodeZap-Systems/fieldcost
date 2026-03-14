#!/usr/bin/env node

const endpoints = ["projects", "tasks", "customers", "items", "invoices"];
const DEMO_COMPANY_ID = 8;

async function testAPI() {
  console.log("\n🧪 TESTING DEMO COMPANY API ENDPOINTS\n");
  console.log(`Company ID: ${DEMO_COMPANY_ID}\n`);

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000/api/${endpoint}?company_id=${DEMO_COMPANY_ID}`);
      const data = await response.json();
      const count = Array.isArray(data) ? data.length : (data?.length || 0);
      
      const emoji = endpoint === "projects" ? "📋" : 
                   endpoint === "tasks" ? "✓" : 
                   endpoint === "customers" ? "👥" :
                   endpoint === "items" ? "📦" :
                   endpoint === "invoices" ? "💳" : "📊";
      
      console.log(`${emoji} ${endpoint.padEnd(12)}: ${count}`);
    } catch (err) {
      console.log(`❌ ${endpoint.padEnd(12)}: ERROR - ${err.message}`);
    }
  }

  console.log("\n✅ API test complete!\n");
}

// Give server time to start
setTimeout(testAPI, 2000);
