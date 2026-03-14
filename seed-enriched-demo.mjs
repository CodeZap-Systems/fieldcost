import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseKey = "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI";
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedEnrichedDemo() {
  try {
    console.log("🌱 Seeding Enriched Demo Data...\n");
    
    // Get demo company
    const { data: demoCompanies } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("is_demo", true);
    
    if (!demoCompanies || demoCompanies.length === 0) {
      console.error("❌ Demo Company not found!");
      return;
    }
    
    const demoCompanyId = demoCompanies[0].id;
    const userId = demoCompanies[0].user_id;
    console.log(`✅ Demo Company ID: ${demoCompanyId}\n`);

    // First, delete demo company's existing data to avoid duplicates
    console.log("🗑️  Cleaning up old demo data...");
    await supabase.from("tasks").delete().eq("company_id", demoCompanyId);
    await supabase.from("projects").delete().eq("company_id", demoCompanyId);
    await supabase.from("crew").delete().eq("company_id", demoCompanyId);
    await supabase.from("customers").delete().eq("company_id", demoCompanyId);
    await supabase.from("items").delete().eq("company_id", demoCompanyId);
    console.log("✅ Cleaned up\n");

    // Create projects
    const projectsData = [
      {
        name: "Haul Road Rehab",
        description: "Stabilise, widen, and cap the 4 km haul road between pits.",
        photo_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
        company_id: demoCompanyId,
        user_id: userId,
      },
      {
        name: "Process Plant Refurb",
        description: "Replace worn chute liners and recalibrate secondary crushers.",
        photo_url: "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=800&q=60",
        company_id: demoCompanyId,
        user_id: userId,
      },
      {
        name: "Tailings Storage Lift",
        description: "Raise TSF wall by 3m with compacted engineered fill.",
        photo_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60",
        company_id: demoCompanyId,
        user_id: userId,
      },
    ];

    console.log("📋 Creating projects...");
    const { data: projects } = await supabase
      .from("projects")
      .insert(projectsData)
      .select("id, name");
    console.log(`✅ Created ${projects.length} projects\n`);

    // Create crew members - skip if table doesn't exist
    const crewData = [
      { name: "Dingani Ncube", hourly_rate: 565, company_id: demoCompanyId, user_id: userId },
      { name: "Lerato Maseko", hourly_rate: 395, company_id: demoCompanyId, user_id: userId },
      { name: "Nomsa Khumalo", hourly_rate: 380, company_id: demoCompanyId, user_id: userId },
      { name: "Sipho Dlamini", hourly_rate: 420, company_id: demoCompanyId, user_id: userId },
      { name: "Thando Nkosi", hourly_rate: 440, company_id: demoCompanyId, user_id: userId },
    ];

    console.log("👥 Creating crew...");
    try {
      const crewResult = await supabase
        .from("crew")
        .insert(crewData)
        .select("id, name");
      console.log(`✅ Created ${crewResult.data?.length || 0} crew members\n`);
    } catch (err) {
      console.log("⚠️  Crew table skipped (may not exist)\n");
    }

    // Create tasks with realistic hour tracking (seconds = hours * 3600)
    const tasksData = [
      {
        name: "Crest drainage tie-in",
        description: "Install HDPE drains into existing spillway.",
        project_id: projects[2].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "todo",
        seconds: 0,
      },
      {
        name: "Geotech inspections",
        description: "Log compaction results and densities by zone.",
        project_id: projects[2].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "in_progress",
        seconds: 90 * 3600,
      },
      {
        name: "Crusher recalibration",
        description: "Laser align crusher gap before restart.",
        project_id: projects[1].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "todo",
        seconds: 0,
      },
      {
        name: "Chute liner strip-out",
        description: "Remove worn liners on secondary feed chute.",
        project_id: projects[1].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "done",
        seconds: 340 * 3600,
      },
      {
        name: "Lime stabilisation run 1",
        description: "Blend lime across km 2-3 section.",
        project_id: projects[0].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "in_progress",
        seconds: 145 * 3600,
      },
      {
        name: "Survey control & pegging",
        description: "Lay out widened alignment and check crossfall.",
        project_id: projects[0].id,
        company_id: demoCompanyId,
        user_id: userId,
        status: "done",
        seconds: 270 * 3600,
      },
    ];

    console.log("✅ Creating tasks...");
    let tasksCountCreated = 0;
    try {
      const tasksResult = await supabase.from("tasks").insert(tasksData).select("id");
      if (tasksResult.error) {
        console.log(`⚠️  Tasks error: ${tasksResult.error.message}\n`);
      } else {
        tasksCountCreated = tasksResult.data?.length || 0;
        console.log(`✅ Created ${tasksCountCreated} tasks\n`);
      }
    } catch (err) {
      console.log(`⚠️  Tasks: ${err.message}\n`);
    }

    // Create customers/contacts
    const customersData = [
      { name: "Mining Solutions Inc", email: "contact@miningsol.com", company_id: demoCompanyId, user_id: userId },
      { name: "Geo Engineering Group", email: "info@geoeng.com", company_id: demoCompanyId, user_id: userId },
      { name: "Blast & Debris", email: "ops@blastndebs.com", company_id: demoCompanyId, user_id: userId },
      { name: "Conveyor Systems Ltd", email: "sales@conveyorsys.com", company_id: demoCompanyId, user_id: userId },
      { name: "Equipment Rentals SA", email: "rentals@equipmentsa.com", company_id: demoCompanyId, user_id: userId },
    ];

    console.log("🏢 Creating customers...");
    let customersCountCreated = 0;
    try {
      const customersResult = await supabase.from("customers").insert(customersData).select("id");
      customersCountCreated = customersResult.data?.length || 0;
      console.log(`✅ Created ${customersCountCreated} customers\n`);
    } catch (err) {
      console.log(`⚠️  Customers: ${err.message}\n`);
    }

    // Create items
    const itemsData = [
      { name: "HDPE Drainage Pipe (100mm)", price: 450, company_id: demoCompanyId, user_id: userId },
      { name: "Crusher Bearing Assembly", price: 15000, company_id: demoCompanyId, user_id: userId },
      { name: "Steel Chute Liner Plate", price: 8500, company_id: demoCompanyId, user_id: userId },
      { name: "Hydraulic Oil (1000L)", price: 12000, company_id: demoCompanyId, user_id: userId },
      { name: "Equipment Rental - Dozer (day)", price: 3500, company_id: demoCompanyId, user_id: userId },
    ];

    console.log("📦 Creating items...");
    let itemsCountCreated = 0;
    try {
      const itemsResult = await supabase.from("items").insert(itemsData).select("id");
      itemsCountCreated = itemsResult.data?.length || 0;
      console.log(`✅ Created ${itemsCountCreated} items\n`);
    } catch (err) {
      console.log(`⚠️  Items: ${err.message}\n`);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✅ DEMO COMPANY ENRICHED WITH REAL DATA!\n");
    console.log("📊 Data Summary:");
    console.log(`  • Projects: ${projects.length}`);
    console.log(`  • Tasks: ${tasksCountCreated}`);
    console.log(`  • Customers: ${customersCountCreated}`);
    console.log(`  • Items: ${itemsCountCreated}`);
    console.log("\n🚀 Demo Company is now ready for client presentation!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
  }
}

seedEnrichedDemo();
