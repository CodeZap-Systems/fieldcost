#!/usr/bin/env node

/**
 * CLI Database Migration Tool for Supabase
 * Uses pg library to connect directly to PostgreSQL
 */

import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const { Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_HOST = 'mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_PORT = 5432;
const SUPABASE_DB = 'postgres';
const SUPABASE_USER = 'postgres';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║          DATABASE MIGRATION - SUPABASE TABLE CREATOR            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Read SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

console.log('📋 SQL File Details:');
console.log(`   • Location: ${sqlFilePath}`);
console.log(`   • Size: ${(sqlContent.length / 1024).toFixed(2)} KB`);
console.log(`   • Tables: 4 (quotes, quote_line_items, orders, order_line_items)\n`);

// Prompt user for password
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptPassword() {
  return new Promise((resolve) => {
    rl.question('🔐 Enter your Supabase database password: ', (password) => {
      rl.close();
      resolve(password);
    });
  });
}

async function migrateDatabase(password) {
  const client = new Client({
    host: SUPABASE_HOST,
    port: SUPABASE_PORT,
    database: SUPABASE_DB,
    user: SUPABASE_USER,
    password: password,
    ssl: 'require',
  });

  console.log('\n🔌 Connecting to Supabase...');

  try {
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📊 Executing migration...\n');

    // Execute the entire SQL at once
    await client.query(sqlContent);

    console.log('✅ Migration completed successfully!\n');
    console.log('📋 Created objects:');
    console.log('   ✅ quotes table');
    console.log('   ✅ quote_line_items table');
    console.log('   ✅ orders table');
    console.log('   ✅ order_line_items table');
    console.log('   ✅ RLS policies (4 per table)');
    console.log('   ✅ Indexes');
    console.log('   ✅ Foreign keys\n');

    console.log('🎉 Ready to use!\n');
    console.log('📌 Next steps:');
    console.log('   1. Run: node seed-quotes-orders.mjs');
    console.log('   2. Visit: http://localhost:3000/dashboard/quotes\n');

  } catch (error) {
    console.error('❌ Error:', error.message, '\n');

    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Connection failed. Possible reasons:');
      console.log('   • Wrong password');
      console.log('   • Network connectivity issue');
      console.log('   • Supabase service unavailable\n');
    }

    console.log('📌 Alternative: Use Supabase Web Interface\n');
    console.log('   1. Go to: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
    console.log('   2. Create new query');
    console.log('   3. Copy from: COPY_TO_SUPABASE.sql');
    console.log('   4. Paste and click "Run"\n');

    process.exit(1);
  } finally {
    await client.end();
  }
}

// Check if password provided via env var
const envPassword = process.env.SUPABASE_DB_PASSWORD;

if (envPassword) {
  console.log('✅ Using password from environment variable\n');
  migrateDatabase(envPassword);
} else {
  console.log('💡 You can also set password as environment variable:\n');
  console.log('   $env:SUPABASE_DB_PASSWORD="your_password"\n');
  promptPassword().then(password => {
    if (!password) {
      console.log('\n❌ Password required. Exiting.\n');
      process.exit(1);
    }
    migrateDatabase(password);
  });
}
