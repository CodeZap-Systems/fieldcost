#!/usr/bin/env node

/**
 * Smart migration handler - tries multiple approaches
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_HOST = 'mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_USER = 'postgres';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║       SMART DATABASE MIGRATION - MULTIPLE APPROACHES            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Check for psql
let hasPsql = false;
try {
  execSync('psql --version', { stdio: 'pipe' });
  hasPsql = true;
} catch (e) {
  // psql not available
}

console.log('🔍 System Status:');
console.log(`   ${hasPsql ? '✅' : '❌'} psql CLI available\n`);

if (hasPsql && process.env.SUPABASE_DB_PASSWORD) {
  console.log('🚀 Attempting migration via psql (Method 1)...\n');
  
  try {
    const tempFile = path.join(__dirname, 'temp_migration.sql');
    fs.writeFileSync(tempFile, sqlContent);

    const result = execSync(
      `psql -h ${SUPABASE_HOST} -U ${SUPABASE_USER} -d postgres -f "${tempFile}"`,
      {
        env: {
          ...process.env,
          PGPASSWORD: process.env.SUPABASE_DB_PASSWORD
        },
        stdio: 'pipe',
        encoding: 'utf-8'
      }
    );

    console.log('✅ Migration successful via psql!\n');
    console.log('📊 Tables created:');
    console.log('   ✓ quotes');
    console.log('   ✓ quote_line_items');
    console.log('   ✓ orders');
    console.log('   ✓ order_line_items\n');

    console.log('🎉 Ready to seed data!\n');
    console.log('Next: node seed-quotes-orders.mjs\n');

    process.exit(0);
  } catch (error) {
    console.log('⚠️  psql approach failed\n');
  }
}

// Fallback to web console instructions
console.log('📌 Using Supabase Web Console (Recommended Method)\n');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║                   QUICK SETUP STEPS                           ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('1️⃣  GO TO SUPABASE SQL EDITOR');
console.log('   👉 https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');

console.log('2️⃣  COPY SQL\n');
console.log('   Open this file: COPY_TO_SUPABASE.sql');
console.log('   Select ALL content (Ctrl+A)');
console.log('   Copy it (Ctrl+C)\n');

console.log('3️⃣  PASTE IN SUPABASE\n');
console.log('   Click "New Query" in Supabase');
console.log('   Paste the SQL (Ctrl+V)');
console.log('   Click the "Run" button\n');

console.log('4️⃣  VERIFY SUCCESS\n');
console.log('   You should see success message');
console.log('   Tables will appear in sidebar\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📂 File Information\n');
console.log(`   File: ${sqlFilePath}`);
console.log(`   Size: ${(sqlContent.length / 1024).toFixed(2)} KB`);
console.log(`   Statements: 51\n`);

console.log('📋 What will be created:\n');
console.log('   Tables:');
console.log('      • quotes');
console.log('      • quote_line_items');
console.log('      • orders');
console.log('      • order_line_items\n');

console.log('   Security:');
console.log('      • Row Level Security (RLS) policies');
console.log('      • Foreign key constraints');
console.log('      • Performance indexes\n');

console.log('═══════════════════════════════════════════════════════════════════\n');

console.log('✨ Once SQL is executed in Supabase:\n');
console.log('   1. Wait 5-10 seconds for tables to appear');
console.log('   2. Come back to terminal and run: node seed-quotes-orders.mjs\n');

process.exit(0);
