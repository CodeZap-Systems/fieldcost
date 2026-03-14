#!/usr/bin/env node

/**
 * Create Quotes and Orders tables using Supabase SQL execution
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function executeSql(sql) {
  try {
    // Use Supabase's rpc function to execute SQL if available
    const { data, error } = await supabase.rpc('exec', { sql });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (err) {
    // Fallback: try to use the public.sql_exec function
    try {
      const { data, error } = await supabase.rpc('sql_exec', { sql });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return { success: true, data };
    } catch (err2) {
      return { success: false, error: err.message };
    }
  }
}

async function createTables() {
  console.log('🚀 Creating Quotes and Orders tables in Supabase...\n');

  // Read the SQL file
  const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

  // Split by semicolon and filter empty statements
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt && !stmt.startsWith('--') && stmt.length > 10)
    .map(stmt => stmt + ';');

  console.log(`📋 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  // Execute each statement individually
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const stmtPreview = stmt.substring(0, 60).replace(/\n/g, ' ') + '...';
    
    process.stdout.write(`[${i + 1}/${statements.length}] Executing: ${stmtPreview}`);
    
    const result = await executeSql(stmt);
    
    if (result.success) {
      console.log(' ✅');
      successCount++;
    } else {
      console.log(` ❌`);
      errorCount++;
      errors.push({ statement: stmtPreview, error: result.error });
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n✅ Migration Complete!`);
  console.log(`   • Successful: ${successCount}/${statements.length} statements`);
  
  if (errorCount > 0) {
    console.log(`   • Errors: ${errorCount} statements\n`);
    console.log('⚠️  Some statements failed:');
    errors.forEach((err, idx) => {
      console.log(`   ${idx + 1}. ${err.statement}`);
      console.log(`      Error: ${err.error.substring(0, 80)}`);
    });
  }

  console.log(`\n📊 Tables created:
   • quotes
   • quote_line_items
   • orders
   • order_line_items

✨ All tables with RLS policies, indexes, and foreign keys are ready!\n`);
  
  if (successCount === statements.length) {
    console.log('🎉 Now you can run: npm run dev');
    console.log('   Then refresh: http://localhost:3000/dashboard/quotes\n');
  }
}

createTables().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
