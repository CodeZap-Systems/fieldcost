#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseKey = "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log("🔧 Running migration: Allow multiple companies per user...\n");

    // Drop the unique constraint
    console.log("  1️⃣  Dropping UNIQUE constraint on user_id...");
    const { error: dropError } = await supabase.rpc("exec_sql", {
      sql: `ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;`,
    });

    if (dropError && !dropError.message?.includes("does not exist")) {
      throw dropError;
    }
    console.log("     ✅ Constraint dropped\n");

    // Add is_demo column
    console.log("  2️⃣  Adding is_demo column...");
    const { error: addColumnError } = await supabase.rpc("exec_sql", {
      sql: `ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;`,
    });

    if (addColumnError) {
      console.log("     ⚠️  " + addColumnError.message + "\n");
    } else {
      console.log("     ✅ Column added\n");
    }

    // Create index
    console.log("  3️⃣  Creating index on is_demo...");
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql: `CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);`,
    });

    if (indexError) {
      console.log("     ⚠️  " + indexError.message + "\n");
    } else {
      console.log("     ✅ Index created\n");
    }

    // Update null values
    console.log("  4️⃣  Setting default is_demo values...");
    const { error: updateError } = await supabase.rpc("exec_sql", {
      sql: `UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;`,
    });

    if (updateError) {
      console.log("     ⚠️  " + updateError.message + "\n");
    } else {
      console.log("     ✅ Defaults set\n");
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!\n");
    console.log("👥 Users can now create multiple companies:");
    console.log("   • 1 Demo company (is_demo=true) with sample data");
    console.log("   • Multiple Live companies (is_demo=false) that start blank");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
