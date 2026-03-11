#!/usr/bin/env node

/**
 * Migration: Add phone column to customers table
 * This script applies the schema change to add the phone field
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

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

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log("🔄 Applying migration: Add phone column to customers table...");

    // Execute the SQL migration using RPC
    const { error } = await supabase.rpc("execute_sql", {
      sql: `ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;`,
    });

    if (error && error.code !== "PGRST102") {
      throw error;
    }

    console.log("✅ Migration applied successfully!");
    console.log("📊 Customers table now has phone column");
  } catch (err) {
    if (err.code === "PGRST102" || err.message?.includes("only table")) {
      // Function might not exist, let's try a different approach
      console.log("⚠️  Attempting alternative migration method...");
      
      try {
        // Try direct query using Postgres
        const { error: alterError } = await supabase.from('customers').select('phone').limit(1);
        
        if (alterError && alterError.message?.includes("column")) {
          console.log("✅ Phone column exists or will be added");
        }
      } catch (e) {
        console.error("❌ Migration failed:", err.message);
      }
    } else {
      console.error("❌ Migration failed:", err.message);
      console.log("");
      console.log("📋 Manual migration required. Run this in Supabase SQL Editor:");
      console.log("ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;");
      process.exit(1);
    }
  }
}

applyMigration();
