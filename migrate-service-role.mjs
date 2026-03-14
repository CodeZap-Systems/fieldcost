#!/usr/bin/env node

/**
 * Execute migration using Supabase Service Role & Postgres
 * Same approach as seed-demo-data.mjs
 */

import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Credentials from .env
const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';
const HOST_PARTS = SUPABASE_URL.replace('https://', '').split('.supabase.co')[0];
const DB_HOST = `${HOST_PARTS}.supabase.co`;
const DB_USER = 'postgres';
const DB_PASSWORD = 'Dingb@tDing4783';
const DB_NAME = 'postgres';
const DB_PORT = 5432;

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║  EXECUTE MIGRATION USING SERVICE ROLE (Like seed-demo-data)    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Read SQL
const sqlPath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

console.log(`📋 SQL File: ${sqlPath}`);
console.log(`📊 Size: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

// Connect to PostgreSQL
const client = new Client({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  try {
    console.log('🔌 Connecting to Supabase PostgreSQL...\n');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('▸ Executing SQL migration...\n');

    // Execute all SQL at once
    const result = await client.query(sqlContent);

    console.log('✅ Migration completed successfully!\n');

    console.log('📊 Created:');
    console.log('   ✓ quotes table');
    console.log('   ✓ quote_line_items table');
    console.log('   ✓ orders table');
    console.log('   ✓ order_line_items table');
    console.log('   ✓ RLS policies');
    console.log('   ✓ Indexes\n');

    console.log('🎉 Ready for data seeding!\n');
    console.log('Next step: node seed-quotes-orders.mjs\n');

    await client.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   • Check .env credentials are correct');
    console.error('   • Verify network connectivity');
    console.error('   • Ensure Supabase project is active\n');

    await client.end();
    process.exit(1);
  }
}

migrate();
