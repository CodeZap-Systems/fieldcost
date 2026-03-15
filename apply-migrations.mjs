#!/usr/bin/env node
/**
 * Manually apply Supabase migrations to ensure tables exist
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

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
