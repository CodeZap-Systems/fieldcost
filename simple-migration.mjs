import pg from "pg";

const { Client } = pg;

async function runMigration() {
  const client = new Client({
    host: "mukaeylwmzztycajibhy.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "xVfx4JdW3L5kMp8Q",
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔧 Connecting to Supabase PostgreSQL...");
    await client.connect();
    console.log("✅ Connected!\n");

    // 1. Drop constraint
    console.log("Running: ALTER TABLE company_profiles DROP CONSTRAINT...");
    await client.query(
      `ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;`
    );
    console.log("✅ Dropped constraint\n");

    // 2. Add is_demo column
    console.log("Running: ALTER TABLE company_profiles ADD COLUMN is_demo...");
    await client.query(
      `ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;`
    );
    console.log("✅ Added column\n");

    // 3. Create index
    console.log("Running: CREATE INDEX on is_demo...");
    await client.query(
      `CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);`
    );
    console.log("✅ Created index\n");

    // 4. Update
    console.log("Running: UPDATE company_profiles SET is_demo...");
    const result = await client.query(
      `UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;`
    );
    console.log(`✅ Updated ${result.rowCount} rows\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ MIGRATION COMPLETE!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🎉 You can now create multiple companies!");
    console.log("   Refresh your browser and try again.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Details:", error);
  } finally {
    await client.end();
  }
}

runMigration();
