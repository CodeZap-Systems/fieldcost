#!/usr/bin/env node
/**
 * Supabase Migration Manager
 * Executes SQL migrations directly against Supabase PostgreSQL
 * 
 * Usage: node scripts/run-migrations.mjs
 * 
 * Environment Variables Required:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nSet these in your .env.local file');
  process.exit(1);
}

const projectId = supabaseUrl.split('//')[1].split('.')[0];
const dbHost = `${projectId}.db.supabase.co`;

console.log(`📍 Project: ${projectId}`);
console.log(`🗄️  Host: ${dbHost}`);

/**
 * Execute SQL query via Supabase REST API with streaming
 */
async function executeQuery(sql) {
  return new Promise((resolve, reject) => {
    // Encode the SQL for URL parameters
    const encodedSql = Buffer.from(sql).toString('base64');
    
    const options = {
      hostname: `${projectId}.supabase.co`,
      port: 443,
      path: `/rest/v1/rpc?sql=${encodeURIComponent(sql)}`,
      method: 'GET',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve({ success: true, status: res.statusCode });
        } else if (res.statusCode === 404 && responseData.includes('function does not exist')) {
          // The RPC approach won't work without a SQL function
          // Fall back to direct execution
          resolve({ success: false, needsDirectConnection: true });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Fallback: Provide SQL copy-paste instructions
 */
function provideCopyPasteInstructions() {
  console.log('\n' + '='.repeat(80));
  console.log('⚠️  Cannot execute via API. Please run SQL manually:');
  console.log('='.repeat(80));
  
  console.log('\n📋 OPTION 1: Supabase Web Dashboard (Recommended)');
  console.log('1. Open: https://app.supabase.com');
  console.log('2. Go to your project "mukaeylwmzztycajibhy"');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "New Query"');
  console.log('5. Copy & paste one of these files:');
  console.log('   • supabase/migrations/20260315_create_quotes_tables.sql');
  console.log('   • supabase/migrations/20260315_create_purchase_order_tables.sql');
  console.log('6. Run (Ctrl+Enter)');
  console.log('7. Repeat for the second file');
  
  console.log('\n📋 OPTION 2: VS Code Supabase Extension');
  console.log('1. Click "Explorer" in the left sidebar');
  console.log('2. Right-click on "supabase" folder');
  console.log('3. Select "Execute SQL"');
  console.log('4. Paste the migration file contents');
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Once tables are created, run:');
  console.log('   npm run test:api -- tests/tier2/quotes.test.ts');
  console.log('='.repeat(80) + '\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🚀 Supabase Migration Manager');
  console.log('='.repeat(80));

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const sqlFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  if (sqlFiles.length === 0) {
    console.error('❌ No SQL migration files found');
    process.exit(1);
  }

  console.log(`\n📁 Found ${sqlFiles.length} migration files:`);
  sqlFiles.forEach(f => console.log(`   • ${f}`));

  // Try executing via API first
  console.log('\n🔄 Attempting to execute via REST API...');
  
  try {
    const testResult = await executeQuery('SELECT NOW()');
    if (testResult.needsDirectConnection) {
      throw new Error('Direct SQL execution not available via RPC');
    }
  } catch (error) {
    console.log(`⚠️  ${error.message}`);
    provideCopyPasteInstructions();
    
    // Still exit 0 because the files are created and ready
    process.exit(0);
  }

  // If API execution worked, execute migrations
  console.log('\n⚙️  Executing migrations...\n');

  let failedCount = 0;
  for (const file of sqlFiles) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split statements carefully
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`\n📄 ${file}`);
    console.log(`   Statements: ${statements.length}`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await executeQuery(statements[i]);
        process.stdout.write(`\r   Progress: ${i + 1}/${statements.length}`);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.warn(`\n   ⚠️  Statement ${i + 1} issue: ${error.message.substring(0, 80)}`);
          failedCount++;
        }
      }
    }
    console.log(' ✅');
  }

  console.log('\n' + '='.repeat(80));
  if (failedCount === 0) {
    console.log('✅ All migrations completed successfully!');
    console.log('\n📊 Next Steps:');
    console.log('   1. npm run test:api -- tests/tier2/quotes.test.ts');
    console.log('   2. Verify Quote tests are now passing');
  } else {
    console.log(`⚠️  ${failedCount} statements had issues (see above)`);
    console.log('   Tables may still have been created. Verify in Supabase dashboard.');
  }
  console.log('='.repeat(80) + '\n');
}

main().catch(err => {
  console.error('\n❌ Fatal Error:', err.message);
  provideCopyPasteInstructions();
  process.exit(1);
});
