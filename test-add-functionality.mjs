#!/usr/bin/env node
/**
 * Test Add Functionality for All Core Collections
 * Tests: Crew Members, Customers, Tasks, Items, Projects, Budgets, Invoices
 */

const BASE_URL = 'http://localhost:3000';
// Use a valid UUID format for demo user
const DEMO_USER_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const TEST_COMPANY_ID = 'demo-company-id';

const tests = [];

function logTest(name, passed, details = '') {
  tests.push({ name, passed, details });
  const icon = passed ? '✓' : '✗';
  console.log(`${icon} ${name}${details ? ': ' + details : ''}`);
}

async function testAddCrew() {
  try {
    const res = await fetch(`${BASE_URL}/api/crew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        name: 'Test Crew Member',
        email: 'crew@test.com',
        phone: '555-1234',
        hourly_rate: 75,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      logTest('ADD Crew Member', false, `${res.status}: ${data.error || JSON.stringify(data)}`);
    } else {
      logTest('ADD Crew Member', res.ok, `ID: ${data.id || 'ERROR'}`);
    }
    return data;
  } catch (e) {
    logTest('ADD Crew Member', false, e.message);
  }
}

async function testAddCustomer() {
  try {
    const res = await fetch(`${BASE_URL}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        name: 'Test Customer LLC',
        email: 'customer@test.com',
        phone: '555-5678',
        address: '123 Test St',
      }),
    });
    const data = await res.json();
    logTest('ADD Customer', res.ok, `ID: ${data.id || 'ERROR'}`);
    return data;
  } catch (e) {
    logTest('ADD Customer', false, e.message);
  }
}

async function testAddProject(customerId) {
  try {
    const res = await fetch(`${BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        name: 'Test Project',
        description: 'Test project description',
        customer_id: customerId || 1,
        status: 'active',
      }),
    });
    const data = await res.json();
    logTest('ADD Project', res.ok, `ID: ${data.id || 'ERROR'}`);
    return data;
  } catch (e) {
    logTest('ADD Project', false, e.message);
  }
}

async function testAddTask(projectId, crewId) {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        name: 'Test Task',
        description: 'Test task description',
        project_id: projectId || 1,
        crew_member_id: crewId || null,
        status: 'todo',
        billable: true,
        seconds: 3600,
      }),
    });
    const data = await res.json();
    logTest('ADD Task', res.ok, `ID: ${data.id || 'ERROR'}`);
    return data;
  } catch (e) {
    logTest('ADD Task', false, e.message);
  }
}

async function testAddItem() {
  try {
    const res = await fetch(`${BASE_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        name: 'Test Item',
        unit_price: 99.99,
        category: 'materials',
      }),
    });
    const data = await res.json();
    logTest('ADD Item', res.ok, `ID: ${data.id || 'ERROR'}`);
    return data;
  } catch (e) {
    logTest('ADD Item', false, e.message);
  }
}

async function testAddBudget(projectId) {
  try {
    const res = await fetch(`${BASE_URL}/api/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: DEMO_USER_ID,
        company_id: TEST_COMPANY_ID,
        project_id: projectId || 1,
        planned_amount: 5000.00,
        actual_amount: 3500.00,
      }),
    });
    const data = await res.json();
    logTest('ADD Budget', res.ok, `Project ${projectId || '1'}`);
    return data;
  } catch (e) {
    logTest('ADD Budget', false, e.message);
  }
}

async function testGetCollections() {
  try {
    const params = new URLSearchParams({
      user_id: DEMO_USER_ID,
      company_id: TEST_COMPANY_ID,
    });

    const [crew, customers, tasks, items, projects] = await Promise.all([
      fetch(`${BASE_URL}/api/crew?${params}`).then(r => r.json()),
      fetch(`${BASE_URL}/api/customers?${params}`).then(r => r.json()),
      fetch(`${BASE_URL}/api/tasks?${params}`).then(r => r.json()),
      fetch(`${BASE_URL}/api/items?${params}`).then(r => r.json()),
      fetch(`${BASE_URL}/api/projects?${params}`).then(r => r.json()),
    ]);

    logTest('GET Crew Members', Array.isArray(crew), `Count: ${crew?.length || '?'}`);
    logTest('GET Customers', Array.isArray(customers), `Count: ${customers?.length || '?'}`);
    logTest('GET Tasks', Array.isArray(tasks), `Count: ${tasks?.length || '?'}`);
    logTest('GET Items', Array.isArray(items), `Count: ${items?.length || '?'}`);
    logTest('GET Projects', Array.isArray(projects), `Count: ${projects?.length || '?'}`);
  } catch (e) {
    logTest('GET Collections', false, e.message);
  }
}

async function testErpPushEndpoint() {
  try {
    // Test Sage push with demo mode
    const sageRes = await fetch(`${BASE_URL}/api/invoices/push-to-erp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        erp: 'sage',
        wipAmount: 1500.00,
        retentionAmount: 150.00,
        netClaimable: 1350.00,
        customerId: '1',
        projectName: 'Test Project',
        description: 'Test Sage WIP Push',
        sageToken: 'demo-mode',
        sageCookie: 'demo-mode',
      }),
    });
    const sageData = await sageRes.json();
    logTest('PUSH WIP to Sage (Demo)', sageRes.ok, `InvoiceID: ${sageData.invoiceId || 'ERROR'}`);

    // Test Xero push with demo mode
    const xeroRes = await fetch(`${BASE_URL}/api/invoices/push-to-erp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        erp: 'xero',
        wipAmount: 2000.00,
        retentionAmount: 200.00,
        netClaimable: 1800.00,
        customerId: '1',
        projectName: 'Test Project',
        description: 'Test Xero WIP Push',
        xeroAccessToken: 'demo-mode',
        xeroTenantId: 'demo-mode',
      }),
    });
    const xeroData = await xeroRes.json();
    logTest('PUSH WIP to Xero (Demo)', xeroRes.ok, `InvoiceID: ${xeroData.invoiceId || 'ERROR'}`);
  } catch (e) {
    logTest('ERP Push Endpoint', false, e.message);
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  TESTING ADD FUNCTIONALITY - COMPANY SCOPED');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Test adds
  const crew = await testAddCrew();
  const customer = await testAddCustomer();
  const project = await testAddProject(customer?.id);
  const task = await testAddTask(project?.id, crew?.id);
  const item = await testAddItem();
  const budget = await testAddBudget(project?.id);

  console.log();

  // Test gets
  await testGetCollections();

  console.log();

  // Test ERP
  await testErpPushEndpoint();

  console.log('\n═══════════════════════════════════════════════════════════');
  const passed = tests.filter(t => t.passed).length;
  const total = tests.length;
  console.log(`RESULTS: ${passed}/${total} tests passed`);
  console.log('═══════════════════════════════════════════════════════════\n');

  process.exit(passed === total ? 0 : 1);
}

runAllTests();
