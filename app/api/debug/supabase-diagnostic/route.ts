import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { normalizeUserId } from '../../../../lib/demoUserUUIDs';

interface DiagnosticResult {
  status: 'success' | 'error';
  timestamp: string;
  environment: {
    serviceRoleKeyExists: boolean;
    serviceRoleKeyLength: number;
    supabaseUrlExists: boolean;
  };
  authTests: {
    canListUsers: boolean;
    error?: string;
  };
  tableTests: {
    canAccessCompanyProfiles: boolean;
    companyProfilesCount: number;
    error?: string;
  };
  demoUserTests: {
    canCreateDemoUser: boolean;
    demoUserId?: string;
    error?: string;
  };
  summary: {
    configValid: boolean;
    authWorking: boolean;
    databaseWorking: boolean;
    recommendation: string;
  };
}

export async function GET() {
  const result: DiagnosticResult = {
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: {
      serviceRoleKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceRoleKeyLength: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').length,
      supabaseUrlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    authTests: {
      canListUsers: false,
    },
    tableTests: {
      canAccessCompanyProfiles: false,
      companyProfilesCount: 0,
    },
    demoUserTests: {
      canCreateDemoUser: false,
    },
    summary: {
      configValid: false,
      authWorking: false,
      databaseWorking: false,
      recommendation: 'Configuration needs verification',
    },
  };

  // Test 1: Service Role Key Configuration
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[supabase-diagnostic] ❌ SUPABASE_SERVICE_ROLE_KEY is NOT set');
    result.authTests.error = 'SUPABASE_SERVICE_ROLE_KEY environment variable is missing';
    result.status = 'error';
    result.summary.recommendation = 'Add SUPABASE_SERVICE_ROLE_KEY to Vercel environment variables';
    return NextResponse.json(result, { status: 500 });
  }

  console.log('[supabase-diagnostic] ✅ SUPABASE_SERVICE_ROLE_KEY is set (length: ' + result.environment.serviceRoleKeyLength + ')');

  // Test 2: Auth User Listing
  try {
    console.log('[supabase-diagnostic] Testing auth.admin.listUsers()...');
    const { data, error } = await supabaseServer.auth.admin.listUsers();
    
    if (error) {
      console.error('[supabase-diagnostic] ❌ Auth list error:', error.message);
      result.authTests.error = `Auth error: ${error.message}`;
      result.authTests.canListUsers = false;
    } else {
      console.log(`[supabase-diagnostic] ✅ Auth working - found ${data?.users?.length || 0} users`);
      result.authTests.canListUsers = true;
    }
  } catch (err) {
    console.error('[supabase-diagnostic] ❌ Auth exception:', err);
    result.authTests.error = String(err);
    result.authTests.canListUsers = false;
  }

  // Test 3: Company Profiles Table Access
  try {
    console.log('[supabase-diagnostic] Testing company_profiles table access...');
    const { data, error, count } = await supabaseServer
      .from('company_profiles')
      .select('*', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.error('[supabase-diagnostic] ❌ Table access error:', error.message);
      result.tableTests.error = `Table error: ${error.message}`;
      result.tableTests.canAccessCompanyProfiles = false;
    } else {
      console.log(`[supabase-diagnostic] ✅ Table accessible - ${count || 0} rows found`);
      result.tableTests.canAccessCompanyProfiles = true;
      result.tableTests.companyProfilesCount = count || 0;
    }
  } catch (err) {
    console.error('[supabase-diagnostic] ❌ Table access exception:', err);
    result.tableTests.error = String(err);
    result.tableTests.canAccessCompanyProfiles = false;
  }

  // Test 4: Demo User Creation Simulation
  try {
    console.log('[supabase-diagnostic] Testing demo user creation flow...');
    const testUserName = 'demo-diagnostic-test';
    const testUserId = normalizeUserId(testUserName);
    console.log(`[supabase-diagnostic] Normalized user ID: "${testUserName}" → "${testUserId}"`);
    
    // First check if exists
    const { data: existingUser, error: lookupError } = await supabaseServer.auth.admin.getUserById(testUserId);
    
    if (existingUser) {
      console.log(`[supabase-diagnostic] Demo user already exists: ${testUserId}`);
      result.demoUserTests.canCreateDemoUser = true;
      result.demoUserTests.demoUserId = testUserId;
    } else if (lookupError && !/user not found/i.test(lookupError.message)) {
      console.error(`[supabase-diagnostic] ❌ Lookup error: ${lookupError.message}`);
      result.demoUserTests.error = `Lookup error: ${lookupError.message}`;
      result.demoUserTests.canCreateDemoUser = false;
    } else {
      // Try to create
      console.log(`[supabase-diagnostic] Attempting to create test user: ${testUserId}`);
      const { data: newUser, error: createError } = await supabaseServer.auth.admin.createUser({
        id: testUserId,
        email: 'demo-diagnostic-test@fieldcost.demo',
        email_confirm: true,
        password: 'test-password-123',
        user_metadata: {
          label: 'demo-diagnostic-test',
          isDemo: true,
        },
      });
      
      if (createError) {
        console.error(`[supabase-diagnostic] ❌ Create error: ${createError.message}`);
        result.demoUserTests.error = `Create error: ${createError.message}`;
        result.demoUserTests.canCreateDemoUser = false;
      } else {
        console.log(`[supabase-diagnostic] ✅ Demo user created: ${testUserId}`);
        result.demoUserTests.canCreateDemoUser = true;
        result.demoUserTests.demoUserId = testUserId;
      }
    }
  } catch (err) {
    console.error('[supabase-diagnostic] ❌ Demo user exception:', err);
    result.demoUserTests.error = String(err);
    result.demoUserTests.canCreateDemoUser = false;
  }

  // Test 5: Company Profiles Insert
  if (result.demoUserTests.canCreateDemoUser && result.demoUserTests.demoUserId) {
    try {
      console.log(`[supabase-diagnostic] Testing company_profiles insert for user...`);
      const { error: insertError } = await supabaseServer
        .from('company_profiles')
        .insert([{
          user_id: result.demoUserTests.demoUserId,
          name: 'Diagnostic Test Company',
          default_currency: 'ZAR',
        }])
        .select('id')
        .single();
      
      if (insertError) {
        console.error(`[supabase-diagnostic] ❌ Insert error: ${insertError.message}`);
        result.tableTests.error = `Insert error: ${insertError.message}`;
      } else {
        console.log(`[supabase-diagnostic] ✅ Company insert successful`);
      }
    } catch (err) {
      console.error('[supabase-diagnostic] ❌ Insert exception:', err);
    }
  }

  // Summary
  result.summary.configValid = result.environment.serviceRoleKeyExists && result.environment.supabaseUrlExists;
  result.summary.authWorking = result.authTests.canListUsers && result.demoUserTests.canCreateDemoUser;
  result.summary.databaseWorking = result.tableTests.canAccessCompanyProfiles;

  if (result.summary.configValid && result.summary.authWorking && result.summary.databaseWorking) {
    result.summary.recommendation = '✅ All systems operational - issue may be in application logic';
    result.status = 'success';
  } else if (!result.summary.configValid) {
    result.summary.recommendation = '❌ Environment variables not properly configured - check Vercel settings';
    result.status = 'error';
  } else if (!result.summary.authWorking) {
    result.summary.recommendation = '❌ Auth system not working - verify service role key has admin permissions';
    result.status = 'error';
  } else if (!result.summary.databaseWorking) {
    result.summary.recommendation = '❌ Database access failed - check RLS policies and connection';
    result.status = 'error';
  }

  console.log('[supabase-diagnostic] Summary:', result.summary);
  return NextResponse.json(result, { status: result.status === 'error' ? 500 : 200 });
}

export const runtime = 'nodejs';
