#!/usr/bin/env node

/**
 * Test Project Creation for Demo Users
 */

const BASE_URL = "http://localhost:3000";
const DEMO_USER = "demo-user-1";

async function testProjectCreation() {
  console.log("🧪 Testing Project Creation (Demo User - No Limit)\n");

  try {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `Test Project ${Date.now()}`,
        description: "Testing demo project limit removal",
        user_id: DEMO_USER,
      }),
    });

    const data = await res.json();

    console.log(`Status Code: ${res.status}`);
    console.log(`\nResponse:`, JSON.stringify(data, null, 2));

    if (res.status === 201) {
      console.log("\n✅ SUCCESS: Project created for demo user!");
      console.log(`   Project ID: ${data.id}`);
      console.log(`   Project Name: ${data.name}`);
    } else if (res.status === 400 && data.error?.includes("limit")) {
      console.log("\n❌ FAILED: Project limit still enforced");
    } else {
      console.log(`\n⚠️  Status ${res.status}: ${data.error}`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

testProjectCreation();
