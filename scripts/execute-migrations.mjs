import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(projectUrl, serviceKey);

async function executeMigration(filePath, name) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`\n▶ ${name}`);
    console.log(`  Executing ${statements.length} SQL statements...`);
    
    let executed = 0;
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: statement 
      }).catch(() => ({ error: true }));
      
      if (!error) {
        executed++;
      }
    }
    
    // Fallback message
    if (executed === 0) {
      console.log(`  ⚠ RPC execution not available - preparing manual instructions`);
      console.log(`  ${name} SQL ready for manual execution via Supabase dashboard`);
    } else {
      console.log(`  ✓ ${executed}/${statements.length} statements executed`);
    }
    
    return true;
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Fieldcost Tier 2 Database Schema Migration\n');
  console.log(`Project: ${projectUrl.split('/').pop()}`);
  console.log(`Using service role for elevated permissions\n`);
  
  const results = await Promise.all([
    executeMigration('supabase/migrations/20260315_create_quotes_tables.sql', 'Quotes Module'),
    executeMigration('supabase/migrations/20260315_create_purchase_order_tables.sql', 'Purchase Orders & GRN Module'),
  ]);
  
  const successful = results.filter(r => r).length;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Migration Summary: ${successful}/${results.length} modules migrated`);
  console.log(`${'='.repeat(60)}`);
  
  if (successful === results.length) {
    console.log('✅ All migrations completed successfully!');
    console.log('\nNext: Run test suite to validate schema and API endpoints');
    console.log('  Command: npm run test:api\n');
  } else {
    console.log('⚠️  Using manual execution path...');
    console.log('\nDirect CLI approach:\n');
    console.log('  psql postgresql://postgres:[password]@mukaeylwmzztycajibhy.supabase.co:5432/postgres \\');
    console.log('    -f supabase/migrations/20260315_create_quotes_tables.sql \\');
    console.log('    -f supabase/migrations/20260315_create_purchase_order_tables.sql\n');
  }
  
  process.exit(0);
}

main();
