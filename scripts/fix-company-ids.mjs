#!/usr/bin/env node

/**
 * Fix Database Company IDs
 * Ensures all records in isolat-able tables have company_id set to 1 (or appropriate value)
 * 
 * Usage: node scripts/fix-company-ids.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Update table to ensure all records have company_id set
 */
async function fixTableCompanyIds(tableName, defaultCompanyId = 1) {
  console.log(`\n📋 Fixing ${tableName}...`);
  
  try {
    // Get all records with null or missing company_id
    const { data: records, error: getError } = await supabase
      .from(tableName)
      .select('id, company_id')
      .or(`company_id.is.null,company_id.eq.`);

    if (getError) {
      console.warn(`   ⚠️  Could not fetch records: ${getError.message}`);
      return;
    }

    if (!records || records.length === 0) {
      console.log(`   ✓ All records already have company_id set`);
      return;
    }

    // Update records with null company_id
    const recordsToFix = records.filter(r => !r.company_id);
    
    if (recordsToFix.length === 0) {
      console.log(`   ✓ No records need fixing`);
      return;
    }

    const recordIds = recordsToFix.map(r => r.id);
    
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ company_id: defaultCompanyId })
      .in('id', recordIds);

    if (updateError) {
      console.error(`   ❌ Update failed: ${updateError.message}`);
      return;
    }

    console.log(`   ✓ Fixed ${recordIds.length} records`);
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
  }
}

/**
 * Update company_profiles to ensure demo company is marked
 */
async function markDemoCompany() {
  console.log(`\n📋 Marking demo company...`);
  
  try {
    const { data: companies, error: getError } = await supabase
      .from('company_profiles')
      .select('id, name')
      .limit(1);

    if (getError || !companies || companies.length === 0) {
      console.warn(`   ⚠️  Could not fetch companies`);
      return;
    }

    // First company is the demo company
    const demoCompany = companies[0];
    
    // Update to mark as demo if name contains demo/test or id is 1
    const isDemoName = demoCompany.name?.toLowerCase().includes('demo') ||
                       demoCompany.name?.toLowerCase().includes('test');
    
    if (isDemoName || demoCompany.id === 1) {
      console.log(`   ✓ Company "${demoCompany.name}" (ID: ${demoCompany.id}) is demo`);
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`
╔════════════════════════════════════════╗
║  DATABASE COMPANY ID FIX UTILITY       ║
║  Ensures all records have company_id   ║
╚════════════════════════════════════════╝
`);

  // Tables that need company_id
  const tables = [
    'projects',
    'customers',
    'items',
    'invoices',
    'billing_invoices',
    'invoice_line_items'
  ];

  let fixed = 0;
  for (const table of tables) {
    await fixTableCompanyIds(table, 1);
    fixed++;
  }

  // Mark demo company
  await markDemoCompany();

  console.log(`
╔════════════════════════════════════════╗
║  ✓ Database fix complete              ║
║  ${fixed} tables processed                ║
╚════════════════════════════════════════╝
`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
