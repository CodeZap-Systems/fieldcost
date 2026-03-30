#!/usr/bin/env node
/**
 * Manually apply Supabase migrations to ensure tables exist
 *
 * SAFETY GUARDRAILS:
 *   - Requires DEMO_MODE=true
 *   - Requires ENVIRONMENT=staging (refuses to run against production)
 *   - Reads credentials exclusively from environment variables
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Guardrails ---
if (process.env.DEMO_MODE !== 'true') {
  console.error('❌ Refused: DEMO_MODE must be set to "true" to run this script.');
  process.exit(1);
}
if (process.env.ENVIRONMENT !== 'staging') {
  console.error('❌ Refused: ENVIRONMENT must be set to "staging" to run this script.');
  console.error('   This script must never run against production.');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('❌ Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function applyMigrations() {
  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Found ${files.length} migration files:\n`);

  for (const file of files) {
    console.log(`Applying ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    
    try {
      const { error } = await supabase.rpc('exec', { sql });
      
      if (error) {
        // Try a different approach - split by statement
        const statements = sql.split(';').filter(s => s.trim());
        let success = true;
        
        for (const stmt of statements) {
          if (!stmt.trim()) continue;
          const { error: stmtError } = await supabase.rpc('exec', { sql: stmt + ';' });
          if (stmtError) {
            console.error(`  ❌ Error:`, stmtError.message);
            success = false;
            break;
          }
        }
        
        if (success) {
          console.log(`  ✅ Applied`);
        }
      } else {
        console.log(`  ✅ Applied`);
      }
    } catch (err) {
      console.error(`  ❌ Exception:`, err.message);
    }
  }
}

applyMigrations();
