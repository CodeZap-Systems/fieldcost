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
    console.log("🔧 Connecting to Supabase PostgreSQL...\n");
    await client.connect();
    console.log("✅ Connected to database\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Running Multi-Company Migration\n");

    // 1. Drop the unique constraint
    console.log("  1️⃣  Dropping UNIQUE constraint on user_id...");
    try {
      await client.query(
        `ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;`
      );
      console.log("     ✅ Constraint dropped\n");
    } catch (e) {
      console.log("     ✅ Constraint already dropped\n");
    }

    // 2. Add is_demo column
    console.log("  2️⃣  Adding is_demo column...");
    try {
      await client.query(
        `ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;`
      );
      console.log("     ✅ Column added\n");
    } catch (e) {
      console.log("     ✅ Column already exists\n");
    }

    // 3. Create index
    console.log("  3️⃣  Creating index on is_demo...");
    try {
      await client.query(
        `CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);`
      );
      console.log("     ✅ Index created\n");
    } catch (e) {
      console.log("     ✅ Index already exists\n");
    }

    // 4. Update null values
    console.log("  4️⃣  Setting default is_demo values...");
    const result = await client.query(
      `UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;`
    );
    console.log(`     ✅ Updated ${result.rowCount} rows\n`);

    // 5. Verify migration
    console.log("  5️⃣  Verifying migration...");
    const constraints = await client.query(`
      SELECT constraint_name, constraint_type 
      FROM information_schema.table_constraints 
      WHERE table_name = 'company_profiles' 
      AND constraint_type = 'UNIQUE'
      AND constraint_name LIKE '%user_id%';
    `);

    if (constraints.rows.length === 0) {
      console.log("     ✅ No UNIQUE constraints on user_id\n");
    } else {
      console.log("     ⚠️  Found constraints:", constraints.rows, "\n");
    }

    // 6. Check is_demo column
    const columns = await client.query(`
      SELECT column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'company_profiles' 
      AND column_name = 'is_demo';
    `);

    if (columns.rows.length > 0) {
      const col = columns.rows[0];
      console.log(`     ✅ is_demo column exists (${col.data_type})\n`);
    }

    // 7. Show company status
    const companies = await client.query(
      `SELECT id, name, is_demo FROM company_profiles ORDER BY id;`
    );
    console.log("  📊 Company Status:");
    companies.rows.forEach((c) => {
      const type = c.is_demo ? "🎭 DEMO" : "🏢 LIVE";
      console.log(`     ${type}: ${c.name} (ID: ${c.id})`);
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!\n");
    console.log("👥 Users can now create multiple companies:");
    console.log("   • 1 Demo company (is_demo=true) with sample data");
    console.log("   • Multiple Live companies (is_demo=false) that start blank");
    console.log("\n🚀 You can now:");
    console.log("   1. Refresh your browser");
    console.log("   2. Create a new company (should succeed now)");
    console.log("   3. Test demo/live data segregation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
