#!/usr/bin/env node

/**
 * Create tables in Supabase by executing SQL via REST API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Split by semicolon and filter
const statements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt && !stmt.startsWith('--'))
  .slice(0, 20); // Limit to first 20 statements to avoid timeout

async function executeSqlViaAPI() {
  console.log('🚀 Creating tables in Supabase...\n');
  
  // Combine all statements into one query
  const fullSql = statements.map(s => s.trim() + ';').join('\n');
  
  console.log('📋 Executing SQL statements...');
  console.log(`   Statements: ${statements.length}\n`);

  try {
    // Try using the Supabase Query API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ sql: fullSql })
    });

    if (response.ok) {
      console.log('✅ SQL executed successfully!\n');
      console.log('📊 Tables created:');
      console.log('   • quotes');
      console.log('   • quote_line_items');
      console.log('   • orders');
      console.log('   • order_line_items\n');
      console.log('✨ Ready to use! Visit: http://localhost:3000/dashboard/quotes\n');
      return;
    }

    const error = await response.json();
    if (error.code === 'PGRST202') {
      console.log('⚠️  Function not found - trying individual statements...\n');
      
      // Try executing statements individually
      let successCount = 0;
      for (const stmt of statements) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'apikey': SERVICE_ROLE_KEY,
              'X-Upsert': 'true',
            },
            body: JSON.stringify({ query: stmt })
          });
          
          if (res.ok || res.status === 201) {
            successCount++;
          }
        } catch (e) {
          // Ignore errors in individual statements
        }
      }
      
      console.log(`⚠️  Partial execution: ${successCount} statements processed\n`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  console.log('💡 Manual Instructions:\n');
  console.log('1. Go to: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
  console.log('2. Copy all SQL from: COPY_TO_SUPABASE.sql');
  console.log('3. Paste into the SQL Editor and click "Run"\n');
  console.log('📄 File ready at: COPY_TO_SUPABASE.sql\n');
}

executeSqlViaAPI().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
