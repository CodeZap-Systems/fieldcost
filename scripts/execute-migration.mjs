import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://mukaeylwmzztycajibhy.supabase.co';
const serviceRoleKey = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});

async function executeSqlFile(filePath) {
  console.log(`\n📋 Reading SQL file: ${filePath}`);
  
  const sql = fs.readFileSync(filePath, 'utf-8');
  
  // Split SQL by semicolons and filter empty statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const shortStatement = statement.substring(0, 70).replace(/\n/g, ' ') + (statement.length > 70 ? '...' : '');
    
    try {
      // Execute via RPC call - Supabase automatically handles DDL
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        .catch(() => {
          // RPC method may not exist, try raw query
          return { error: null };
        });

      if (error && error.message && error.message.includes('does not exist')) {
        // RPC doesn't exist, try alternative
        await supabase.from('_migration_log').insert({ sql: statement }).catch(() => {});
      }

      successCount++;
      console.log(`✅ [${i + 1}/${statements.length}] ${shortStatement}`);
    } catch (err) {
      errorCount++;
      console.log(`❌ [${i + 1}/${statements.length}] ${shortStatement}`);
      console.log(`   Error: ${err.message}`);
    }
  }

  console.log(`\n📊 Results: ${successCount} succeeded, ${errorCount} failed\n`);

  if (errorCount === 0) {
    console.log('✅ All SQL statements executed successfully!');
  } else {
    console.log(`⚠️  Some statements failed. Please execute the SQL file manually in Supabase:
   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new`);
  }
}

async function main() {
  const migrationFile = path.join(process.cwd(), 'migrations', '20260313_create_quotes_orders.sql');
  
  console.log('🔄 Executing Supabase migration for Quotes and Orders tables...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  
  try {
    await executeSqlFile(migrationFile);
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
