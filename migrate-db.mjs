#!/usr/bin/env node

/**
 * Direct PostgreSQL migration using pg library
 */

import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_HOST = 'mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_PORT = 5432;
const SUPABASE_DB = 'postgres';
const SUPABASE_USER = 'postgres';
const PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!PASSWORD) {
  console.error('❌ Error: SUPABASE_DB_PASSWORD environment variable not set');
  process.exit(1);
}

console.log('\n📱 Database Migration Tool\n');
console.log('🔌 Connecting to PostgreSQL...');

// Read SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

const client = new Client({
  host: SUPABASE_HOST,
  port: SUPABASE_PORT,
  database: SUPABASE_DB,
  user: SUPABASE_USER,
  password: PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function migrate() {
  try {
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('▸ Executing SQL migration...\n');
    const result = await client.query(sqlContent);
    
    console.log('✅ Migration successful!\n');
    console.log('📊 Tables created:');
    console.log('   ✓ quotes');
    console.log('   ✓ quote_line_items');
    console.log('   ✓ orders');
    console.log('   ✓ order_line_items\n');

    console.log('🎉 Ready to seed data!\n');
    console.log('Next: node seed-quotes-orders.mjs\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('   ' + error.message + '\n');
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
