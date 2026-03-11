import fs from "fs";

const BASE_URL = "https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app";
const DEMO_USER = "demo";
const DEMO_EMAIL = "demo@fieldcost.local";

console.log("🚀 STAGING ENVIRONMENT E2E TEST (TIER 2)");
console.log("============================\n");
console.log(`Testing against: ${BASE_URL}\n`);

const results = [];
let testNum = 1;

// Test 1: Dashboard Access
console.log(`[TEST ${testNum}] GET /dashboard - Access user dashboard`);
try {
  const res = await fetch(`${BASE_URL}/dashboard`);
  if (res.ok) {
    console.log(`✅ PASS: Dashboard accessible\n`);
    results.push({ test: "Dashboard Access", status: "PASS" });
  } else {
    console.log(`❌ FAIL: ${res.status}\n`);
    results.push({ test: "Dashboard Access", status: "FAIL" });
  }
} catch (err) {
  console.log(`❌ FAIL: ${err.message}\n`);
  results.push({ test: "Dashboard Access", status: "FAIL" });
}
testNum++;

// Test 2: View Projects
console.log(`[TEST ${testNum}] GET /api/projects - View user projects`);
try {
  const res = await fetch(`${BASE_URL}/api/projects?user_id=${DEMO_USER}`);
  const data = await res.json();
  if (res.ok && Array.isArray(data)) {
    console.log(`✅ PASS: Projects loaded (${data.length} projects)\n`);
    results.push({ test: "View Projects", status: "PASS", count: data.length });
  } else {
    console.log(`❌ FAIL: ${res.status}\n`);
    results.push({ test: "View Projects", status: "FAIL" });
  }
} catch (err) {
  console.log(`❌ FAIL: ${err.message}\n`);
  results.push({ test: "View Projects", status: "FAIL" });
}
testNum++;

// Test 3: Create Project
console.log(`[TEST ${testNum}] POST /api/projects - Create first project`);
let projectId = null;
const timestamp = Date.now();
try {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Staging Test Project ${timestamp}`,
      description: "Staging test project",
      user_id: DEMO_USER,
      status: "active",
    }),
  });
  const data = await res.json();
  if (res.ok && data.id) {
    projectId = data.id;
    console.log(`✅ PASS: Project created (ID: ${projectId})\n`);
    results.push({ test: "Create Project", status: "PASS", projectId });
  } else {
    console.log(`❌ FAIL: ${res.status}\n`);
    results.push({ test: "Create Project", status: "FAIL" });
  }
} catch (err) {
  console.log(`❌ FAIL: ${err.message}\n`);
  results.push({ test: "Create Project", status: "FAIL" });
}
testNum++;

// Test 4: Reports Endpoint
console.log(`[TEST ${testNum}] GET /api/reports - Access reports`);
try {
  const res = await fetch(`${BASE_URL}/api/reports?user_id=${DEMO_USER}`);
  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (res.ok && data.sections) {
      console.log(`✅ PASS: Reports returned JSON with sections\n`);
      results.push({ test: "Reports Endpoint", status: "PASS" });
    } else {
      console.log(`❌ FAIL: Invalid JSON response\n`);
      results.push({ test: "Reports Endpoint", status: "FAIL" });
    }
  } else if (contentType && contentType.includes('text/html')) {
    console.log(`❌ FAIL: Endpoint still returning HTML (content-type: ${contentType})\n`);
    results.push({ test: "Reports Endpoint", status: "FAIL", reason: "HTML response" });
  } else {
    console.log(`❌ FAIL: Unexpected content-type: ${contentType}\n`);
    results.push({ test: "Reports Endpoint", status: "FAIL" });
  }
} catch (err) {
  console.log(`❌ FAIL: ${err.message}\n`);
  results.push({ test: "Reports Endpoint", status: "FAIL" });
}

// Summary
const passed = results.filter(r => r.status === "PASS").length;
const failed = results.filter(r => r.status === "FAIL").length;
const passRate = (passed / results.length * 100).toFixed(1);

console.log("\n============================================================");
console.log("📊 STAGING TEST SUMMARY");
console.log("============================================================");
console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
console.log(`Pass Rate: ${passRate}%\n`);

results.forEach(r => {
  const icon = r.status === "PASS" ? "✅" : "❌";
  console.log(`${icon} ${r.test}`);
});

console.log("\n" + "=".repeat(60));

// Save report
fs.writeFileSync('./staging-test-report.json', JSON.stringify({ timestamp: new Date().toISOString(), results, passRate }, null, 2));
console.log('\n📄 Report saved to: ./staging-test-report.json');
