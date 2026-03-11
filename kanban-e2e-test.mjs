import fs from "fs";

const BASE_URL = "https://fieldcost.vercel.app";
const userId = "demo";

async function runTests() {
  console.log("🚀 KANBAN BOARD E2E TEST SUITE\n");
  console.log(`Testing against: ${BASE_URL}\n`);

  const results = [];
  let testNum = 1;

  // Test 1: GET /api/tasks - list all tasks
  console.log(`[TEST ${testNum}] GET /api/tasks - List all tasks`);
  try {
    const res = await fetch(`${BASE_URL}/api/tasks?user_id=${userId}`);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      console.log(`✅ PASS: Retrieved ${data.length} tasks\n`);
      results.push({ test: `GET /api/tasks`, status: "PASS" });
    } else {
      console.log(`❌ FAIL: Expected array, got ${JSON.stringify(data).slice(0, 50)}\n`);
      results.push({ test: `GET /api/tasks`, status: "FAIL" });
    }
  } catch (err) {
    console.log(`❌ FAIL: ${err.message}\n`);
    results.push({ test: `GET /api/tasks`, status: "FAIL" });
  }
  testNum++;

  // Test 2: Create a new task via POST /api/tasks
  console.log(`[TEST ${testNum}] POST /api/tasks - Create new task`);
  const timestamp = Date.now();
  const taskName = `E2E Test Task ${timestamp}`;
  let createdTaskId = null;
  try {
    const payload = {
      name: taskName,
      description: "E2E test task for Kanban workflow",
      status: "todo",
      seconds: 0,
      user_id: userId,
      assigned_to: null,
      crew_member_id: null,
      project_id: null,
      billable: true,
    };
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.id) {
      createdTaskId = data.id;
      console.log(`✅ PASS: Created task with ID ${createdTaskId} (name: "${taskName}")\n`);
      results.push({ test: `POST /api/tasks - Create`, status: "PASS", taskId: createdTaskId });
    } else {
      console.log(`❌ FAIL: ${res.status} - ${JSON.stringify(data).slice(0, 100)}\n`);
      results.push({ test: `POST /api/tasks - Create`, status: "FAIL" });
    }
  } catch (err) {
    console.log(`❌ FAIL: ${err.message}\n`);
    results.push({ test: `POST /api/tasks - Create`, status: "FAIL" });
  }
  testNum++;

  // Test 3: Verify task appears in list with "todo" status
  if (createdTaskId) {
    console.log(`[TEST ${testNum}] GET /api/tasks - Verify new task in list with "todo" status`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks?user_id=${userId}`);
      const data = await res.json();
      const newTask = data.find(t => t.id === createdTaskId);
      if (newTask && newTask.status === "todo" && newTask.name === taskName) {
        console.log(`✅ PASS: Task found in list with status "todo"\n`);
        results.push({ test: `GET /api/tasks - Verify new task`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: Task not found or incorrect status. Found: ${JSON.stringify(newTask).slice(0, 100)}\n`);
        results.push({ test: `GET /api/tasks - Verify new task`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `GET /api/tasks - Verify new task`, status: "FAIL" });
    }
    testNum++;

    // Test 4: Drag task to "in-progress" - PATCH /api/tasks
    console.log(`[TEST ${testNum}] PATCH /api/tasks - Move task to "in-progress"`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: createdTaskId, status: "in-progress", user_id: userId }),
      });
      const data = await res.json();
      if (res.ok && (data.status === "in-progress" || res.status === 204)) {
        console.log(`✅ PASS: Task moved to "in-progress"\n`);
        results.push({ test: `PATCH /api/tasks - Move to in-progress`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: ${res.status} - ${JSON.stringify(data).slice(0, 100)}\n`);
        results.push({ test: `PATCH /api/tasks - Move to in-progress`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `PATCH /api/tasks - Move to in-progress`, status: "FAIL" });
    }
    testNum++;

    // Test 5: Verify status change persists
    console.log(`[TEST ${testNum}] GET /api/tasks - Verify status persisted to "in-progress"`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks?user_id=${userId}`);
      const data = await res.json();
      const updatedTask = data.find(t => t.id === createdTaskId);
      if (updatedTask && updatedTask.status === "in-progress") {
        console.log(`✅ PASS: Status persisted correctly as "in-progress"\n`);
        results.push({ test: `GET /api/tasks - Verify status persisted`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: Status not updated. Found: ${JSON.stringify(updatedTask).slice(0, 100)}\n`);
        results.push({ test: `GET /api/tasks - Verify status persisted`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `GET /api/tasks - Verify status persisted`, status: "FAIL" });
    }
    testNum++;

    // Test 6: Drag task to "done" - PATCH /api/tasks
    console.log(`[TEST ${testNum}] PATCH /api/tasks - Move task to "done"`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: createdTaskId, status: "done", user_id: userId }),
      });
      const data = await res.json();
      if (res.ok && (data.status === "done" || res.status === 204)) {
        console.log(`✅ PASS: Task moved to "done"\n`);
        results.push({ test: `PATCH /api/tasks - Move to done`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: ${res.status} - ${JSON.stringify(data).slice(0, 100)}\n`);
        results.push({ test: `PATCH /api/tasks - Move to done`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `PATCH /api/tasks - Move to done`, status: "FAIL" });
    }
    testNum++;

    // Test 7: Verify final status persists
    console.log(`[TEST ${testNum}] GET /api/tasks - Verify status persisted to "done"`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks?user_id=${userId}`);
      const data = await res.json();
      const finalTask = data.find(t => t.id === createdTaskId);
      if (finalTask && finalTask.status === "done") {
        console.log(`✅ PASS: Final status "done" persisted correctly\n`);
        results.push({ test: `GET /api/tasks - Verify final status`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: Final status not correct. Found: ${JSON.stringify(finalTask).slice(0, 100)}\n`);
        results.push({ test: `GET /api/tasks - Verify final status`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `GET /api/tasks - Verify final status`, status: "FAIL" });
    }
    testNum++;

    // Test 8: Verify task can be moved back to "todo"
    console.log(`[TEST ${testNum}] PATCH /api/tasks - Move completed task back to "todo"`);
    try {
      const res = await fetch(`${BASE_URL}/api/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: createdTaskId, status: "todo", user_id: userId }),
      });
      const data = await res.json();
      if (res.ok && (data.status === "todo" || res.status === 204)) {
        console.log(`✅ PASS: Task moved back to "todo"\n`);
        results.push({ test: `PATCH /api/tasks - Move back to todo`, status: "PASS" });
      } else {
        console.log(`❌ FAIL: ${res.status} - ${JSON.stringify(data).slice(0, 100)}\n`);
        results.push({ test: `PATCH /api/tasks - Move back to todo`, status: "FAIL" });
      }
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}\n`);
      results.push({ test: `PATCH /api/tasks - Move back to todo`, status: "FAIL" });
    }
    testNum++;
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  const passed = results.filter(r => r.status === "PASS").length;
  const total = results.length;
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${total - passed}`);
  console.log(`Pass Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  results.forEach((r, i) => {
    const icon = r.status === "PASS" ? "✅" : "❌";
    console.log(`${icon} ${i + 1}. ${r.test}`);
  });

  console.log("\n" + "=".repeat(60));
  if (passed === total) {
    console.log("🎉 ALL TESTS PASSED - KANBAN BOARD WORKFLOW IS AIRTIGHT!");
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed. Review above for details.`);
  }
  console.log("=".repeat(60) + "\n");

  // Save results to file
  const reportPath = "./kanban-e2e-report.json";
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        totalTests: total,
        passed,
        failed: total - passed,
        passRate: `${((passed / total) * 100).toFixed(1)}%`,
        results,
      },
      null,
      2
    )
  );
  console.log(`📄 Report saved to: ${reportPath}\n`);
}

runTests().catch(console.error);
