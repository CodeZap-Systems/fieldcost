import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { ensureAuthUser } from '../../../../lib/demoAuth';
import { getCompanyContext } from '../../../../lib/companyContext';
import { normalizeUserId } from '../../../../lib/demoUserUUIDs';

interface TestResult {
  testName: string;
  status: 'PASS' | 'FAIL';
  details: string;
  error?: string;
}

export async function GET() {
  const testUserId = 'demo-diagnostic-user';
  const results: TestResult[] = [];

  console.log('[livecompany-test] Starting live company mode diagnostic for user:', testUserId);

  // Test 1: Ensure Auth User
  try {
    console.log('[livecompany-test] Test 1: ensureAuthUser...');
    const user = await ensureAuthUser(testUserId);
    results.push({
      testName: 'ensureAuthUser',
      status: 'PASS',
      details: user ? `Auth user created/found: ${user.id}` : 'Returned undefined (expected for demo users)',
    });
    console.log('[livecompany-test] ✅ Test 1 passed');
  } catch (err) {
    results.push({
      testName: 'ensureAuthUser',
      status: 'FAIL',
      details: `Failed to ensure auth user`,
      error: String(err),
    });
    console.error('[livecompany-test] ❌ Test 1 failed:', err);
  }

  // Test 2: Get Company Context
  try {
    console.log('[livecompany-test] Test 2: getCompanyContext...');
    const context = await getCompanyContext(testUserId);
    results.push({
      testName: 'getCompanyContext',
      status: 'PASS',
      details: `Company context obtained: companyId=${context.companyId}`,
    });
    console.log('[livecompany-test] ✅ Test 2 passed');
  } catch (err) {
    results.push({
      testName: 'getCompanyContext',
      status: 'FAIL',
      details: 'Failed to get company context',
      error: String(err),
    });
    console.error('[livecompany-test] ❌ Test 2 failed:', err);
  }

  // Test 3: Query via API /api/projects
  try {
    console.log('[livecompany-test] Test 3: POST /api/projects...');
    const projectResponse = await fetch('https://fieldcost.vercel.app/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Diagnostic Test Project',
        user_id: testUserId,
        description: 'Test project for diagnostic',
      }),
    });
    
    const projectBody = await projectResponse.json();
    
    if (projectResponse.ok) {
      results.push({
        testName: 'POST /api/projects',
        status: 'PASS',
        details: `Project created: ${projectBody.id || 'ID not returned'}`,
      });
      console.log('[livecompany-test] ✅ Test 3 passed');
    } else {
      results.push({
        testName: 'POST /api/projects',
        status: 'FAIL',
        details: `HTTP ${projectResponse.status}`,
        error: projectBody.error || JSON.stringify(projectBody),
      });
      console.error('[livecompany-test] ❌ Test 3 failed:', projectBody);
    }
  } catch (err) {
    results.push({
      testName: 'POST /api/projects',
      status: 'FAIL',
      details: 'Network or parse error',
      error: String(err),
    });
    console.error('[livecompany-test] ❌ Test 3 failed:', err);
  }

  // Test 4: Query via API /api/customers
  try {
    console.log('[livecompany-test] Test 4: POST /api/customers...');
    const customerResponse = await fetch('https://fieldcost.vercel.app/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Diagnostic Test Customer',
        email: 'diagnostic@test.local',
        user_id: testUserId,
      }),
    });
    
    const customerBody = await customerResponse.json();
    
    if (customerResponse.ok || customerResponse.status === 200) {
      results.push({
        testName: 'POST /api/customers',
        status: 'PASS',
        details: `Customer created: ${customerBody.id || 'ID not returned'}`,
      });
      console.log('[livecompany-test] ✅ Test 4 passed');
    } else {
      results.push({
        testName: 'POST /api/customers',
        status: 'FAIL',
        details: `HTTP ${customerResponse.status}`,
        error: customerBody.error || JSON.stringify(customerBody),
      });
      console.error('[livecompany-test] ❌ Test 4 failed:', customerBody);
    }
  } catch (err) {
    results.push({
      testName: 'POST /api/customers',
      status: 'FAIL',
      details: 'Network or parse error',
      error: String(err),
    });
    console.error('[livecompany-test] ❌ Test 4 failed:', err);
  }

  // Test 5: Check if demo-live-test user exists
  try {
    console.log('[livecompany-test] Test 5: Check auth.users for demo-live-test...');
    const demoLiveTestId = normalizeUserId('demo-live-test');
    const { data, error } = await supabaseServer.auth.admin.listUsers();
    
    if (error) {
      results.push({
        testName: 'Check demo-live-test user',
        status: 'FAIL',
        details: 'Could not list users',
        error: error.message,
      });
    } else if (data && Array.isArray(data.users)) {
      const testUser = (data.users as any[]).find((u: any) => u.id === demoLiveTestId);
      if (testUser) {
        results.push({
          testName: 'Check demo-live-test user',
          status: 'PASS',
          details: `User exists in auth.users (id: ${testUser.id}, email: ${testUser.email})`,
        });
      } else {
        results.push({
          testName: 'Check demo-live-test user',
          status: 'FAIL',
          details: `demo-live-test user (${demoLiveTestId}) not found in auth.users`,
        });
      }
    } else {
      results.push({
        testName: 'Check demo-live-test user',
        status: 'FAIL',
        details: 'Could not parse user list',
      });
    }
    console.log('[livecompany-test] ✅ Test 5 checked');
  } catch (err) {
    results.push({
      testName: 'Check demo-live-test user',
      status: 'FAIL',
      details: 'Exception during user check',
      error: String(err),
    });
  }

  // Summary
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;

  console.log(`[livecompany-test] Summary: ${passCount} passed, ${failCount} failed`);

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    testUser: testUserId,
    results,
    summary: {
      passed: passCount,
      failed: failCount,
      passRate: `${Math.round((passCount / results.length) * 100)}%`,
    },
  });
}

export const runtime = 'nodejs';
