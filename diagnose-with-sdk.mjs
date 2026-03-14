import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mukaeylwmzztycajibhy.supabase.co",
  "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI"
);

async function diagnose() {
  try {
    console.log("🔍 Diagnosing Demo Data Segregation Issue...\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // 1. Get all companies
    console.log("1️⃣  COMPANIES IN DATABASE:\n");
    const { data: companies, error: compError } = await supabase
      .from("company_profiles")
      .select("id, name, is_demo")
      .order("id");

    if (compError) throw compError;

    companies.forEach((c) => {
      const type = c.is_demo ? "🎭 DEMO" : "🏢 LIVE";
      console.log(`   ${type}: "${c.name}" (ID: ${c.id})`);
    });

    // 2. Get items by company
    console.log("\n2️⃣  ITEMS BY COMPANY:\n");
    const { data: items, error: itemError } = await supabase
      .from("items")
      .select("id, name, company_id");

    if (itemError) throw itemError;

    if (items.length === 0) {
      console.log("   ⚠️  No items found!");
    } else {
      const grouped = {};
      items.forEach((item) => {
        if (!grouped[item.company_id]) grouped[item.company_id] = [];
        grouped[item.company_id].push(item.name);
      });

      Object.entries(grouped).forEach(([compId, names]) => {
        const company = companies.find((c) => c.id == compId);
        const type = company?.is_demo ? "🎭 DEMO" : "🏢 LIVE";
        console.log(
          `   ${type} Company ${compId} ("${company?.name || "UNKNOWN"}"): ${names.length} items`
        );
        names.slice(0, 3).forEach((name) => console.log(`      • ${name}`));
        if (names.length > 3) console.log(`      ... and ${names.length - 3} more`);
      });
    }

    // 3. Get projects by company
    console.log("\n3️⃣  PROJECTS BY COMPANY:\n");
    const { data: projects, error: projError } = await supabase
      .from("projects")
      .select("id, name, company_id");

    if (projError && projError.code !== 'PGRST116') throw projError;

    if (!projects || projects.length === 0) {
      console.log("   ℹ️  No projects table or empty");
    } else {
      const grouped = {};
      projects.forEach((proj) => {
        if (!grouped[proj.company_id]) grouped[proj.company_id] = [];
        grouped[proj.company_id].push(proj.name);
      });

      Object.entries(grouped).forEach(([compId, names]) => {
        const company = companies.find((c) => c.id == compId);
        const type = company?.is_demo ? "🎭 DEMO" : "🏢 LIVE";
        console.log(
          `   ${type} Company ${compId} ("${company?.name || "UNKNOWN"}"): ${names.length} projects`
        );
        names.slice(0, 3).forEach((name) => console.log(`      • ${name}`));
      });
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📊 ANALYSIS:");

    // Check if all items go to single company
    if (items.length > 0) {
      const companyIds = new Set(items.map((i) => i.company_id));
      if (companyIds.size === 1) {
        console.log("   ❌ PROBLEM: All items assigned to ONE company!");
        console.log(`      Solution: Items need to be segregated by company_id`);
      } else {
        console.log(`   ✅ Items spread across ${companyIds.size} companies`);
      }
    }

    // Check if demo flag is set
    console.log("\n4️⃣  DEMO FLAG STATUS:\n");
    const demoCompanies = companies.filter((c) => c.is_demo);
    const liveCompanies = companies.filter((c) => !c.is_demo);
    console.log(`   Demo companies: ${demoCompanies.length}`);
    console.log(`   Live companies: ${liveCompanies.length}`);

    if (demoCompanies.length === 0) {
      console.log("\n   ⚠️  NO DEMO COMPANY FOUND!");
      console.log("      Every company is marked as LIVE");
      console.log("      This is why demo data appears everywhere!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

diagnose();
