#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log("🔧 Running migration: Allow multiple companies per user...\n");

    // Drop the unique constraint
    const { error: dropError } = await supabase.rpc("exec_sql", {
      sql: `ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;`,
    });

    if (dropError && !dropError.message?.includes("does not exist")) {
      throw dropError;
    }
    console.log("✅ Dropped UNIQUE constraint on user_id");

    // Add is_demo column
    const { error: addColumnError } = await supabase.rpc("exec_sql", {
      sql: `ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;`,
    });

    if (addColumnError) console.log("⚠️  is_demo column: " + addColumnError.message);
    else console.log("✅ Added is_demo column");

    // Create index
    const { error: indexError } = await supabase.rpc("exec_sql", {
      sql: `CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);`,
    });

    if (indexError) console.log("⚠️  Index creation: " + indexError.message);
    else console.log("✅ Created index on is_demo");

    // Update null values
    const { error: updateError } = await supabase.rpc("exec_sql", {
      sql: `UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;`,
    });

    if (updateError) console.log("⚠️  Update is_demo: " + updateError.message);
    else console.log("✅ Set default is_demo values");

    console.log("\n✅ Migration completed successfully!");
    console.log(
      "👥 Users can now create multiple companies (1 demo, multiple live)"
    );
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
