#!/usr/bin/env node

/**
 * CLI tool to create tables in Supabase via psql
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'mukaeylwmzztycajibhy.supabase.co';
const POSTGRES_USER = 'postgres';

// Read SQL file
const sqlFilePath = path.join(__dirname, 'COPY_TO_SUPABASE.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║              SUPABASE CLI TABLE CREATION TOOL                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Save SQL to temp file
const tempSqlFile = path.join(__dirname, 'temp_migration.sql');
fs.writeFileSync(tempSqlFile, sqlContent);
console.log('✅ SQL prepared in temp file\n');

// Try different connection methods
console.log('🔍 Connection Options:\n');

const connectionString = `postgres://${POSTGRES_USER}:[PASSWORD]@${SUPABASE_URL}:5432/postgres`;

console.log('📋 Your Supabase Details:');
console.log(`   Host: ${SUPABASE_URL}`);
console.log(`   User: ${POSTGRES_USER}`);
console.log(`   Database: postgres\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🚀 Method 1: Using psql (Fastest)\n');

console.log('If psql is installed:\n');
console.log('   psql -h ' + SUPABASE_URL);
console.log('        -U ' + POSTGRES_USER);
console.log('        -d postgres');
console.log('        -f ' + tempSqlFile + '\n');

console.log('When prompted, enter your database password.\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('🎯 Method 2: Using Environment Variable\n');

console.log('If you have your password, set it and run:\n');
console.log('   $env:SUPABASE_DB_PASSWORD="your_password"');
console.log('   psql -h ' + SUPABASE_URL);
console.log('        -U ' + POSTGRES_USER);
console.log('        -w');
console.log('        -d postgres');
console.log('        -f ' + tempSqlFile + '\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📌 Method 3: Supabase Web Dashboard (Easiest)\n');

console.log('Go to: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');
console.log('   1. Create new query');
console.log('   2. Copy from: ' + sqlFilePath);
console.log('   3. Paste into SQL editor');
console.log('   4. Click "Run"\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Check if psql is available
try {
  execSync('psql --version', { stdio: 'pipe' });
  console.log('✅ psql is installed on your machine\n');
} catch (e) {
  console.log('⚠️  psql not found\n');
  console.log('Install PostgreSQL to use CLI method:\n');
  console.log('   Windows: choco install postgresql');
  console.log('   Or: https://www.postgresql.org/download/\n');
}

console.log('📂 Files ready:');
console.log('   • Original: ' + sqlFilePath);
console.log('   • Temp copy: ' + tempSqlFile + '\n');

console.log('═══════════════════════════════════════════════════════════════════\n');
