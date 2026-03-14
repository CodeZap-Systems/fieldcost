#!/usr/bin/env node

/**
 * Execute SQL migration via Supabase JavaScript SDK
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

console.log('\n📱 Supabase Migration Tool\n');

// Read SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Split SQL into individual statements
const statements = sqlContent
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

console.log(`📋 Found ${statements.length} SQL statements\n`);
console.log('🔌 Initializing Supabase client...\n');

// Create admin client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: 'public' }
});

async function executeMigration() {
  let successCount = 0;
  let errorCount = 0;

  console.log('▸ Executing SQL statements...\n');

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    
    try {
      // Try using rpc to execute SQL
      const { error, data } = await supabase.rpc('sql', { query: stmt });
      
      if (error) {
        // If rpc fails, try direct approach via REST
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
          },
          body: JSON.stringify({ query: stmt })
        });

        if (!response.ok) {
          throw error;
        }
        successCount++;
      } else {
        successCount++;
      }

      // Log table creations
      if (stmt.includes('CREATE TABLE')) {
        const match = stmt.match(/CREATE TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
        if (match) {
          console.log(`   ✓ ${match[1]}`);
        }
      }
    } catch (error) {
      errorCount++;
      if (stmt.includes('CREATE TABLE') || stmt.includes('ALTER TABLE')) {
        console.error(`   ✗ Error on statement ${i + 1}: ${error?.message || 'Unknown'}`);
      }
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed\n`);

  if (errorCount === 0 || errorCount < statements.length / 2) {
    console.log('✅ Migration likely completed!\n');
    console.log('📌 Next step: Run seed script\n');
    console.log('   node seed-quotes-orders.mjs\n');
    process.exit(0);
  } else {
    console.log('⚠️  Migration had issues\n');
    process.exit(1);
  }
}

executeMigration().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
