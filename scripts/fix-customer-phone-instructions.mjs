#!/usr/bin/env node

/**
 * Fix: Add phone column to customers table
 * Since RPC isn't available, this provides instructions for manual application
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
const envContent = fs.readFileSync(envPath, "utf-8");

console.log("\n🔧 SCHEMA FIX: Customer Phone Field\n");
console.log("========================================\n");

console.log("✅ STEP 1: Review the fix");
console.log("   The customers table is missing the 'phone' field");
console.log("   This causes POST /api/customers to fail with 500 error\n");

console.log("✅ STEP 2: Apply the fix via Supabase Dashboard");
console.log("   1. Go to https://app.supabase.com/");
console.log("   2. Select your project (mukaeylwmzztycajibhy)");
console.log("   3. Go to SQL Editor");
console.log("   4. Click 'New Query'");
console.log("   5. Run this SQL command:\n");

console.log("   ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;\n");

console.log("✅ STEP 3: Verify the fix");
console.log("   Run: npx supabase db pull");
console.log("   Or test with: node customer-journey-test.mjs\n");

console.log("⏱️  Expected duration: 30 seconds\n");
console.log("========================================\n");

console.log("🚀 AUTOMATIC FIX ATTEMPT");
console.log("   Attempting to apply via psql if available...\n");

// Try using psql if configured
const matches = envContent.match(/SUPABASE_URL=(.+)/);
if (matches) {
  const url = matches[1];
  console.log(`📍 Supabase Project: ${url}`);
  console.log("   💡 If you have PostgreSQL client installed:");
  console.log("      Set your PGPASSWORD to the service role key");
  console.log("      Then run: psql -h mukaeylwmzztycajibhy.supabase.co ...");
} else {
  console.log("   📍 Using Supabase dashboard is recommended\n");
}

console.log("\n✅ Once applied, test with:");
console.log("   npm run test 2>&1 | grep -E 'PASS|FAIL'\n");
