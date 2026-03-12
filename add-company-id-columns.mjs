#!/usr/bin/env node
/**
 * Add company_id columns to existing Supabase tables
 * This ensures all tables support multi-company isolation
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addCompanyIdColumns() {
  console.log('📋 Adding company_id columns to tables...\n');

  const sql = `
    -- Add company_id to projects
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to customers
    ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to items
    ALTER TABLE items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to crew_members
    ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to tasks
    ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to invoices
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to invoice_line_items
    ALTER TABLE invoice_line_items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
    
    -- Add company_id to budgets
    ALTER TABLE budgets ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
  `;

  try {
    // Execute the SQL using rpc
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      // If rpc approach fails, try individual statements
      console.log('⚠️  RPC approach not available, trying direct SQL approach...\n');
      
      const tables = [
        'projects',
        'customers', 
        'items',
        'crew_members',
        'tasks',
        'invoices',
        'invoice_line_items',
        'budgets'
      ];
      
      for (const table of tables) {
        const { error: alterError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (!alterError) {
          console.log(`✅ Verified ${table} table exists`);
        }
      }
      
      console.log('\n📝 Run this SQL in Supabase SQL Editor:');
      console.log(sql);
    } else {
      console.log('✅ Successfully added company_id columns to all tables!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
    console.log(sql);
  }
}

addCompanyIdColumns();
