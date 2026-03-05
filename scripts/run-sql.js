#!/usr/bin/env node
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { Client } = require('pg');
const { config: loadEnv } = require('dotenv');

loadEnv({ path: '.env.local', override: true });

const [,, filePath, manualConnection] = process.argv;
if (!filePath) {
  console.error('Usage: node scripts/run-sql.js <sql-file> [connection-string]');
  process.exit(1);
}

let sql;
try {
  sql = readFileSync(resolve(filePath), 'utf8');
} catch (error) {
  console.error(`Unable to read ${filePath}:`, error.message);
  process.exit(1);
}

const connectionString =
  manualConnection ||
  process.env.SUPABASE_DB_URL ||
  process.env.DATABASE_URL ||
  process.env.PG_CONNECTION_STRING ||
  process.env.PG_CONN ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DB_CONNECTION_STRING;

if (!connectionString) {
  console.error('Missing PostgreSQL connection string. Set SUPABASE_DB_URL or PG_CONN.');
  process.exit(1);
}

(async () => {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log(`${filePath} applied successfully.`);
})().catch(error => {
  console.error(`Failed to apply ${filePath}:`, error.message);
  process.exit(1);
});
