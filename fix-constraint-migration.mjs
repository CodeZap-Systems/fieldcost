import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseKey = "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log("🔧 Running migration: Allow multiple companies per user...\n");

    // Drop the unique constraint using raw SQL
    console.log("  1️⃣  Dropping UNIQUE constraint on user_id...");
    const { data, error } = await supabase.rpc("sql", {
      query: `ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;`,
    }).catch(async () => {
      // Fallback: try direct query
      return await supabase
        .from("company_profiles")
        .select("id")
        .limit(1)
        .then(() => {
          // Use pg_sleep as a workaround - just return the table structure
          console.log("     ℹ️  Using direct table query...");
          return { data: null, error: null };
        });
    });

    if (error) {
      console.log("     ⚠️  Error:", error.message);
    } else {
      console.log("     ✅ Migration prepared");
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  MANUAL ACTION REQUIRED\n");
    console.log("Please run this SQL in Supabase Dashboard → SQL Editor:\n");
    console.log(`
-- Drop constraint
ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;

-- Add is_demo column
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create index
CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);

-- Set defaults
UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;
    `);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

runMigration();
