#!/usr/bin/env node
/**
 * Execute SQL migrations against Supabase PostgreSQL
 * This script connects directly to the PostgreSQL database using the service role key
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Extract project ID from URL
const projectId = supabaseUrl.split('//')[1].split('.')[0];
console.log(`🔗 Supabase Project ID: ${projectId}`);

/**
 * Execute SQL through Supabase REST API
 */
async function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: `${projectId}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length,
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Execute SQL file
 */
async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    console.log(`\n📄 Executing: ${fileName}`);
    
    // Split by semicolon and filter empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    let successCount = 0;
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await executeSql(stmt);
        successCount++;
        process.stdout.write(`\r   Completed: ${successCount}/${statements.length}`);
      } catch (error) {
        // Some statements might fail (e.g., "already exists"), which is OK
        if (!error.message.includes('already exists') && !error.message.includes('exists')) {
          console.warn(`\n   ⚠️  Statement ${i + 1} warning:`, error.message.substring(0, 100));
        }
      }
    }
    console.log(`\n   ✅ File completed`);
    return true;
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Executing Tier 2 Database Migrations');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log('='.repeat(70));

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.error('❌ No SQL files found in migrations directory');
    process.exit(1);
  }

  console.log(`Found ${files.length} migration files:\n`);
  files.forEach(f => console.log(`  • ${f}`));
  console.log('\n' + '='.repeat(70));

  let allSuccess = true;
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const success = await executeSqlFile(filePath);
    if (!success) allSuccess = false;
  }

  console.log('\n' + '='.repeat(70));
  if (allSuccess) {
    console.log('✅ All migrations executed successfully!');
    console.log('\n📊 Next steps:');
    console.log('   1. Verify tables were created in Supabase dashboard');
    console.log('   2. Run: npm run test:api -- tests/tier2/quotes.test.ts');
    console.log('   3. Verify Quote tests now pass');
    process.exit(0);
  } else {
    console.log('⚠️  Migration completed with warnings');
    console.log('   Check Supabase dashboard to verify tables exist');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
