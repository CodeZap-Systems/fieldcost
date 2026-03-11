#!/usr/bin/env node

/**
 * Apply phone field migration to Supabase using psql
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase credentials");
  process.exit(1);
}

// Extract project ref and region from URL
// URL: https://mukaeylwmzztycajibhy.supabase.co
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];

if (!projectRef) {
  console.error("❌ Could not extract project reference from URL");
  process.exit(1);
}

async function applyMigration() {
  try {
    console.log(`🔄 Applying migration using psql...\n`);
    
    // Build psql connection string
    // Format: postgresql://postgres:password@host:5432/postgres
    const dbHost = `${projectRef}.supabase.co`;
    const dbPort = 5432;
    const dbUser = "postgres";
    const dbPassword = serviceKey; // Service key works for direct connection
    
    // Build SQL command
    const sqlCommand = "ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;";
    
    // Escape for shell
    const escapedSql = sqlCommand.replace(/"/g, '\\"');
    
    // Try to run with psql
    const psqlCmd = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -c "${escapedSql}"`;
    
    console.log("ℹ️  To complete the schema migration manually:");
    console.log(`   1. Set your database password: ${serviceKey}\n`);
    console.log(`   2. Run this command:\n`);
    console.log(`      PGPASSWORD="${serviceKey}" psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -c "ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;"\n`);
    
    try {
      // Try PowerShell/Windows approach
      const { stdout, stderr } = await execAsync(
        `cmd /c "set PGPASSWORD=${serviceKey} && psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d postgres -c \\"ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;\\""`,
        { timeout: 30000 }
      );
      
      if (stderr && !stderr.includes("NOTICE")) {
        console.log("⚠️  Warning:", stderr);
      } else {
        console.log("✅ Migration applied successfully!");
      }
    } catch (psqlError) {
      console.log("❌ psql command failed (this is expected if PostgreSQL client not installed)");
      console.log("\n📋 MANUAL STEP REQUIRED:");
      console.log("   Visit: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql");
      console.log("   Run this SQL:\n");
      console.log("   " + sqlCommand);
    }
    
  } catch (err) {
    console.error("Error:", err.message);
  }
}

applyMigration();
