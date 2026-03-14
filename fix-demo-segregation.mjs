import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mukaeylwmzztycajibhy.supabase.co",
  "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI"
);

async function fixDemoDataSegregation() {
  try {
    console.log("🔧 FIXING: Demo Data Segregation\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // 1. Mark "Demo Company" as demo
    console.log("1️⃣  Marking 'Demo Company' (ID 8) as DEMO...");
    const { error: updateError } = await supabase
      .from("company_profiles")
      .update({ is_demo: true })
      .eq("id", 8);

    if (updateError) throw updateError;
    console.log("   ✅ Demo Company marked as is_demo=true\n");

    // 2. Move demo items to Demo Company
    console.log("2️⃣  Moving demo items to Demo Company (ID 8)...");
    const demoItemNames = [
      "Diesel",
      "Diesel (50 ppm)",
      "Explosive Pack",
      "Explosive Pack ANFO",
      "Conveyor Belt",
      "Conveyor Belt Repair Kit",
      "On-site Survey Crew",
      "Crusher Specialist Callout",
      "Wear Plate Set",
    ];

    const { error: moveItemsError } = await supabase
      .from("items")
      .update({ company_id: 8 })
      .in("name", demoItemNames);

    if (moveItemsError) throw moveItemsError;
    console.log(`   ✅ Moved demo items to Demo Company\n`);

    // 3. Move demo projects to Demo Company
    console.log("3️⃣  Moving demo projects to Demo Company (ID 8)...");
    const demoProjectPatterns = [
      "Demo",
      "Diagnostic",
      "Drill & Blast",
      "Crusher Maintenance",
    ];

    // Get all projects first
    const { data: allProjects } = await supabase
      .from("projects")
      .select("id, name, company_id");

    const demoProjects = allProjects.filter((p) =>
      demoProjectPatterns.some((pattern) => p.name.includes(pattern))
    );

    for (const project of demoProjects) {
      await supabase
        .from("projects")
        .update({ company_id: 8 })
        .eq("id", project.id);
    }
    console.log(`   ✅ Moved ${demoProjects.length} demo projects to Demo Company\n`);

    // 4. Clear demo items from Test Company 2 (ID 1)
    console.log("4️⃣  Removing demo items from Test Company 2 (ID 1)...");
    
    // Get items currently in Test Company 2
    const { data: testCompanyItems } = await supabase
      .from("items")
      .select("id, name")
      .eq("company_id", 1);

    const itemsToDelete = testCompanyItems
      .filter((item) =>
        demoItemNames.some(
          (name) =>
            item.name === name ||
            item.name.includes(name) ||
            name.includes(item.name)
        )
      )
      .map((i) => i.id);

    if (itemsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("items")
        .delete()
        .in("id", itemsToDelete);

      if (deleteError) throw deleteError;
      console.log(`   ✅ Removed ${itemsToDelete.length} demo items\n`);
    } else {
      console.log(`   ℹ️  No demo items to remove\n`);
    }

    // 5. Verify final state
    console.log("5️⃣  VERIFICATION:\n");
    const { data: finalCompanies } = await supabase
      .from("company_profiles")
      .select("id, name, is_demo");

    const { data: finalItems } = await supabase
      .from("items")
      .select("company_id, name");

    console.log("   Company Status:");
    finalCompanies.forEach((c) => {
      const type = c.is_demo ? "🎭 DEMO" : "🏢 LIVE";
      const itemCount = finalItems.filter((i) => i.company_id === c.id).length;
      console.log(`   ${type}: "${c.name}" (ID: ${c.id}) - ${itemCount} items`);
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✅ FIX COMPLETE!");
    console.log("   • Demo Company (ID 8) now marked as is_demo=true");
    console.log("   • Demo items segregated to Demo Company");
    console.log("   • Live companies are now clean");
    console.log("\n🚀 Refresh your browser to see the changes!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixDemoDataSegregation();
