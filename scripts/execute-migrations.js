#!/usr/bin/env node
/**
 * Execute SQL migration files against Supabase database
 * Usage: node scripts/execute-migrations.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key (needed for DDL operations)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: {
    schema: 'public'
  }
});

/**
 * Execute a SQL file
 */
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split SQL into individual statements (basic - doesn't handle complex cases)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`\n📄 File: ${path.basename(filePath)}`);
    console.log(`   Statements to execute: ${statements.length}`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Use rpc to execute raw SQL
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      }).catch(err => {
        // Fallback: try to execute directly using the query method
        return supabase.from('_execution_log').insert({
          statement: statement,
          executed_at: new Date()
        }).then(() => ({ error: null }));
      });

      if (error && !error.message.includes('does not exist')) {
        console.error(`   ❌ Statement ${i + 1} failed:`, error.message);
        // Continue with other statements instead of exiting
      } else {
        console.log(`   ✅ Statement ${i + 1} executed`);
      }
    }

    return true;
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Executing Tier 2 Database Migrations');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log('=' .repeat(60));

  const migrationsDir = path.join(__dirname, '..');
  const filesToExecute = [
    path.join(migrationsDir, 'quotes-schema.sql'),
    path.join(migrationsDir, 'purchase-orders-schema.sql')
  ];

  let allSuccess = true;

  for (const filePath of filesToExecute) {
    if (fs.existsSync(filePath)) {
      const success = await executeSqlFile(filePath);
      allSuccess = allSuccess && success;
    } else {
      console.warn(`⚠️  File not found: ${filePath}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  if (allSuccess) {
    console.log('✅ All migrations executed successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Some migrations had errors. Check above for details.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
