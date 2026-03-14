#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseKey = "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI";

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║     MIGRATE TABLES - Using Supabase SDK (Service Role)         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Read SQL
const sqlPath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

console.log(`📋 SQL File: ${sqlPath}\n`);

async function migrateTables() {
  try {
    console.log('▸ Method 1: Trying via RPC (sql function)...\n');

    // Try Method 1: Use sql RPC function
    const result1 = await supabase.rpc('sql', {
      query: sqlContent
    }).catch(e => {
      console.log(`   ✗ RPC method failed: ${e.message}\n`);
      return null;
    });

    if (result1) {
      console.log('✅ Method 1 succeeded!\n');
    } else {
      console.log('▸ Method 2: Trying via exec_sql function...\n');

      // Try Method 2: exec_sql
      const result2 = await supabase.rpc('exec_sql', {
        sql: sqlContent
      }).catch(e => {
        console.log(`   ✗ exec_sql failed: ${e.message}\n`);
        return null;
      });

      if (result2) {
        console.log('✅ Method 2 succeeded!\n');
      } else {
        console.log('▸ Method 3: Trying direct REST POST...\n');

        // Try Method 3: Direct REST API call
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            sql: sqlContent,
            schema: 'public'
          })
        }).catch(e => {
          console.log(`   ✗ REST method failed: ${e.message}\n`);
          return null;
        });

        if (response && response.ok) {
          console.log('✅ Method 3 succeeded!\n');
        } else {
          throw new Error('All migration methods failed. Tables not created.');
        }
      }
    }

    console.log('✅ Migration completed!\n');
    console.log('📊 Created:');
    console.log('   ✓ quotes');
    console.log('   ✓ quote_line_items');
    console.log('   ✓ orders');
    console.log('   ✓ order_line_items\n');

    console.log('Next: node seed-quotes-orders.mjs\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 This is expected - Supabase SDK is designed for data operations.');
    console.log('For DDL (CREATE TABLE), we need to use Supabase web console directly.\n');

    console.log('✅ SOLUTION: Paste SQL in Supabase Web Console\n');
    console.log('1. Go to: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
    console.log('2. Paste the content of: COPY_TO_SUPABASE.sql');
    console.log('3. Click "Run"\n');

    process.exit(1);
  }
}

migrateTables();
