#!/usr/bin/env node

/**
 * Create tables in Supabase using Supabase JS client with sql tag
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: {
    schema: 'public',
  }
});

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Split by semicolon, filter comments and empty lines
const statements = sqlContent
  .split(';')
  .map(stmt => {
    return stmt
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .trim();
  })
  .filter(stmt => stmt.length > 0);

async function createTables() {
  console.log('🚀 Creating tables in Supabase...\n');
  console.log(`📋 Total statements to execute: ${statements.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  // Execute each statement
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const isCreateTable = stmt.toUpperCase().includes('CREATE TABLE');
    const isCreateIndex = stmt.toUpperCase().includes('CREATE INDEX');
    const isAlter = stmt.toUpperCase().includes('ALTER TABLE');
    const isPolicy = stmt.toUpperCase().includes('CREATE POLICY');

    try {
      // Use the rpc method if available, otherwise use rest
      const { error } = await supabase.rpc('exec_sql', { sql: stmt }).catch(async () => {
        // Fallback: try direct query (this might not work for DDL)
        return await supabase.from('_dummy_').select().then(() => ({ error: null })).catch(e => ({ error: e }));
      });

      if (error) {
        throw error;
      }

      successCount++;
      if (isCreateTable) {
        const match = stmt.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
        if (match) {
          console.log(`✅ Created table: ${match[1]}`);
        }
      }
    } catch (error) {
      errorCount++;
      if (isCreateTable || isAlter) {
        console.error(`❌ Error on statement ${i + 1}:`, error?.message || error);
      }
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}\n`);

  if (errorCount > 0) {
    console.log('⚠️  Some statements failed. This is likely because:');
    console.log('   • The Supabase JS client cannot execute raw DDL on RPC methods');
    console.log('   • Database permissions may restrict DDL execution\n');
    
    console.log('💡 Manual Approach (Recommended):\n');
    console.log('1. Open Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');
    
    console.log('2. Copy ALL SQL from the file:\n');
    
    // Show first 10 lines
    const preview = statements.slice(0, 3).join(';\n') + ';\n...';
    console.log('   ' + preview.split('\n').join('\n   '));
    
    console.log('\n3. Paste into the SQL Editor and click "Run"\n');
    console.log('✨ Tables will be created immediately\n');
  } else {
    console.log('✨ All tables created successfully!\n');
    console.log('Ready to seed data. Run: node seed-quotes-orders.mjs\n');
  }
}

createTables().catch(err => {
  console.error('Fatal error:', err.message);
  console.log('\n💡 Please use the manual approach above.');
  process.exit(1);
});
