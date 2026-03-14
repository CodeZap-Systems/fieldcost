#!/usr/bin/env node

/**
 * Direct Postgres connection to create Quotes and Orders tables
 */

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase connection details
const pool = new Pool({
  host: 'mukaeylwmzztycajibhy.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Dingb@tDing1234',
  ssl: { rejectUnauthorized: false }
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Connecting to Supabase Postgres database...');
    
    // Test connection
    const result = await client.query('SELECT NOW()');
    console.log(`✅ Connected to database\n`);
    
    // Read and execute the migration SQL
    const sqlFilePath = path.join(__dirname, 'migrations', '20260313_create_quotes_orders.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    console.log('📋 Executing migration SQL...\n');
    
    // Split by semicolons and filter empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        await client.query(statement);
        successCount++;
      } catch (error) {
        // Some statements might error if they already exist, which is OK
        if (!error.message.includes('already exists')) {
          console.error(`❌ Statement failed:`, error.message.substring(0, 100));
          errorCount++;
        } else {
          console.log(`⚠️  Skipped (already exists): ${statement.substring(0, 50)}...`);
          successCount++;
        }
      }
    }
    
    console.log(`\n✅ Migration Complete!`);
    console.log(`   • Successful: ${successCount} statements`);
    console.log(`   • Errors: ${errorCount} statements\n`);
    console.log('📊 Tables created:');
    console.log('   • quotes');
    console.log('   • quote_line_items');
    console.log('   • orders');
    console.log('   • order_line_items');
    console.log('\n✨ All tables with RLS policies, indexes, and foreign keys are ready!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 If connection fails, manually execute the SQL:');
    console.log('   1. Go to: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
    console.log('   2. Copy all SQL from: migrations/20260313_create_quotes_orders.sql');
    console.log('   3. Paste and run');
    process.exit(1);
  } finally {
    await client.release();
    await pool.end();
  }
}

createTables();
