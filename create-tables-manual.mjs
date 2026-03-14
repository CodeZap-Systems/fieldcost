#!/usr/bin/env node

/**
 * Display instructions for manual table creation in Supabase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         SUPABASE TABLE CREATION - MANUAL SETUP                 ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📋 SQL READY TO COPY\n');
console.log('The following SQL will create 4 tables with RLS policies:\n');
console.log('   1. quotes');
console.log('   2. quote_line_items');
console.log('   3. orders');
console.log('   4. order_line_items\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Show the first table as preview
const lines = sqlContent.split('\n');
const endLine = lines.findIndex(l => l.includes('quote_line_items') && l.includes('CREATE TABLE'));
if (endLine > 0) {
  console.log(lines.slice(0, Math.min(30, endLine)).join('\n'));
  console.log('\n... [more SQL] ...\n');
} else {
  console.log(sqlContent.substring(0, 1500) + '\n... [more SQL] ...\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🚀 QUICK STEPS:\n');
console.log('1️⃣  Open Supabase SQL Editor:');
console.log('   👉 https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');

console.log('2️⃣  Copy the SQL file content:');
console.log('   📄 File: COPY_TO_SUPABASE.sql (in current directory)\n');

console.log('3️⃣  Paste into the Supabase SQL Editor\n');

console.log('4️⃣  Click the "Run" button\n');

console.log('✨ RESULT: Tables will be created in ~2-3 seconds\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📊 VERIFICATION:\n');
console.log('After creation, these endpoints will return 200 OK:\n');
console.log('   ✅ GET http://localhost:3000/api/quotes');
console.log('   ✅ GET http://localhost:3000/api/orders\n');

console.log('💡 NEXT STEP:\n');
console.log('After tables are created, run:\n');
console.log('   npm run seed-quotes\n');
console.log('This will populate demo data for testing.\n');

// Save the SQL to a temp file that's easy to copy from
const copyPath = path.join(__dirname, 'READY_TO_PASTE.sql');
fs.writeFileSync(copyPath, sqlContent);
console.log(`📝 SQL also available at: READY_TO_PASTE.sql\n`);

console.log('═══════════════════════════════════════════════════════════════════\n');
