#!/usr/bin/env node
/**
 * Apply RLS Policy Fixes Directly to Supabase
 * Uses Service Role Key for PostgreSQL connection
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const policyUpdates = [
  {
    table: 'customers',
    policyName: 'Users can access own customers'
  },
  {
    table: 'projects',
    policyName: 'Users can access own projects'
  },
  {
    table: 'items',
    policyName: 'Users can access own items'
  },
  {
    table: 'crew_members',
    policyName: 'Users can access own crew'
  },
  {
    table: 'tasks',
    policyName: 'Users can access own tasks'
  },
  {
    table: 'invoices',
    policyName: 'Users can access own invoices'
  },
  {
    table: 'invoice_line_items',
    policyName: 'Users can access own invoice lines'
  },
  {
    table: 'budgets',
    policyName: 'Users can access own budgets'
  }
];

async function applyPolicies() {
  console.log('🔐 Applying RLS Policy Fixes to Supabase');
  console.log('==========================================\n');

  let successCount = 0;
  let failCount = 0;

  for (const policy of policyUpdates) {
    try {
      console.log(`applying policy for ${policy.table}...`);

      // Instead of using exec_sql (which doesn't exist), we'll use the REST API
      // with raw SQL execution via the database connection
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/graphql_query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY
        },
        body: JSON.stringify({
          query: `mutation { execute_sql(statement: "DROP POLICY IF EXISTS \\"${policy.policyName}\\" ON ${policy.table}; CREATE POLICY \\"${policy.policyName}\\" ON ${policy.table} FOR ALL USING (EXISTS (SELECT 1 FROM company_profiles WHERE company_profiles.id = ${policy.table}.company_id AND company_profiles.user_id = auth.uid()));") { success } }`
        })
      });

      if (response.ok) {
        console.log(`  ✓ ${policy.table}`);
        successCount++;
      } else {
        console.log(`  ✗ ${policy.table} - ${response.statusText}`);
        failCount++;
      }
    } catch (err) {
      console.log(`  ✗ ${policy.table} - ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  ✅ Applied: ${successCount}`);
  if (failCount > 0) {
    console.log(`  ❌ Failed: ${failCount}`);
    console.log('\n⚠️  Could not apply via API. Please apply manually:');
    console.log('  1. Open Supabase Dashboard: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
    console.log('  2. Copy SQL from rls-policies.sql');
    console.log('  3. Execute in SQL Editor');
  } else {
    console.log('\n✨ All RLS policies applied successfully!');
  }
}

applyPolicies().catch(console.error);
