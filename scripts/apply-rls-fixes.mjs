#!/usr/bin/env node
/**
 * Apply RLS Policy Fixes for Data Isolation
 * Fixes company-based access control via Supabase SQL Editor
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const SQL_FIXES = `
-- RLS Policy Fixes: Change from user_id to company_id based isolation
-- This ensures users can only access data for companies they own

-- ============ CUSTOMERS ============
DROP POLICY IF EXISTS "Users can access own customers" ON customers;
CREATE POLICY "Users can access own customers" ON customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = customers.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ PROJECTS ============
DROP POLICY IF EXISTS "Users can access own projects" ON projects;
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = projects.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ ITEMS ============
DROP POLICY IF EXISTS "Users can access own items" ON items;
CREATE POLICY "Users can access own items" ON items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = items.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ CREW_MEMBERS ============
DROP POLICY IF EXISTS "Users can access own crew" ON crew_members;
CREATE POLICY "Users can access own crew" ON crew_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = crew_members.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ TASKS ============
DROP POLICY IF EXISTS "Users can access own tasks" ON tasks;
CREATE POLICY "Users can access own tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = tasks.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ INVOICES ============
DROP POLICY IF EXISTS "Users can access own invoices" ON invoices;
CREATE POLICY "Users can access own invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = invoices.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ INVOICE_LINE_ITEMS ============
DROP POLICY IF EXISTS "Users can access own invoice lines" ON invoice_line_items;
CREATE POLICY "Users can access own invoice lines" ON invoice_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = invoice_line_items.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ BUDGETS ============
DROP POLICY IF EXISTS "Users can access own budgets" ON budgets;
CREATE POLICY "Users can access own budgets" ON budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = budgets.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );
`;

async function main() {
  console.log('🔐 FieldCost RLS Policy Fix');
  console.log('============================\n');
  
  console.log('📋 Generated SQL Policies:\n');
  console.log(SQL_FIXES);
  
  console.log('\n\n📲 To apply these policies:\n');
  console.log('Option 1 - Supabase Dashboard (Easiest):');
  console.log('  1. Open: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
  console.log('  2. Copy + paste the SQL above');
  console.log('  3. Click "Run"\n');
  
  console.log('Option 2 - Supabase CLI:');
  console.log('  supabase db push\n');
  
  console.log('Option 3 - psql (if installed):');
  console.log('  psql postgresql://postgres:password@mukaeylwmzztycajibhy.supabase.co:5432/postgres < policies.sql\n');
  
  // Save to file for easy copy/paste
  const outputFile = join(__dirname, '..', 'rls-policies.sql');
  writeFileSync(outputFile, SQL_FIXES);
  console.log(`✅ SQL saved to: rls-policies.sql`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
