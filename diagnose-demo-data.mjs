import pg from "pg";

const { Client } = pg;

async function diagnose() {
  const client = new Client({
    connectionString:
      "postgresql://postgres:xVfx4JdW3L5kMp8Q@mukaeylwmzztycajibhy.supabase.co:5432/postgres?sslmode=require",
  });

  try {
    await client.connect();
    console.log("🔍 Diagnostics: Demo Data Segregation\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // 1. Check companies
    console.log("1️⃣  COMPANIES:\n");
    const companies = await client.query(
      `SELECT id, name, is_demo FROM company_profiles ORDER BY id;`
    );
    companies.rows.forEach((c) => {
      const type = c.is_demo ? "🎭 DEMO" : "🏢 LIVE";
      console.log(`   ${type}: "${c.name}" (ID: ${c.id})`);
    });

    // 2. Check items by company
    console.log("\n2️⃣  ITEMS BY COMPANY:\n");
    const items = await client.query(
      `SELECT company_id, COUNT(*) as count FROM items GROUP BY company_id ORDER BY company_id;`
    );
    if (items.rows.length === 0) {
      console.log("   ⚠️  No items in database!");
    } else {
      items.rows.forEach((row) => {
        const companyName =
          companies.rows.find((c) => c.id === row.company_id)?.name ||
          "UNKNOWN";
        console.log(`   Company ${row.company_id} (${companyName}): ${row.count} items`);
      });
    }

    // 3. Check projects by company
    console.log("\n3️⃣  PROJECTS BY COMPANY:\n");
    const projects = await client.query(
      `SELECT company_id, COUNT(*) as count FROM projects GROUP BY company_id ORDER BY company_id;`
    );
    if (projects.rows.length === 0) {
      console.log("   ⚠️  No projects in database!");
    } else {
      projects.rows.forEach((row) => {
        const companyName =
          companies.rows.find((c) => c.id === row.company_id)?.name ||
          "UNKNOWN";
        console.log(`   Company ${row.company_id} (${companyName}): ${row.count} projects`);
      });
    }

    // 4. Sample items from database
    console.log("\n4️⃣  SAMPLE ITEMS:\n");
    const sampleItems = await client.query(
      `SELECT id, name, company_id FROM items LIMIT 5;`
    );
    sampleItems.rows.forEach((item) => {
      const companyName =
        companies.rows.find((c) => c.id === item.company_id)?.name ||
        "UNKNOWN";
      console.log(`   "${item.name}" → Company ${item.company_id} (${companyName})`);
    });

    // 5. Check constraint
    console.log("\n5️⃣  CONSTRAINT STATUS:\n");
    const constraints = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'company_profiles' 
      AND constraint_type = 'UNIQUE' 
      AND constraint_name LIKE '%user_id%';
    `);
    if (constraints.rows.length === 0) {
      console.log("   ✅ UNIQUE constraint REMOVED (good!)");
    } else {
      console.log("   ❌ UNIQUE constraint still exists:", constraints.rows);
    }

    await client.end();

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🔧 LIKELY ISSUE:");
    console.log("   All items are being assigned to SAME company");
    console.log("   OR queries are NOT filtering by company_id\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

diagnose();
