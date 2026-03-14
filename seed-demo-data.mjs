#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mukaeylwmzztycajibhy.supabase.co";
const supabaseKey = "sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDemoData() {
  try {
    console.log("🌱 Seeding Demo Data into Localhost Database...\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Get demo company (ID 8 - is_demo=true)
    const { data: demoCompanies, error: companyError } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("is_demo", true);

    if (companyError || !demoCompanies || demoCompanies.length === 0) {
      console.error("❌ Demo Company not found!");
      return;
    }

    const demoCompany = demoCompanies[0];
    const demoCompanyId = demoCompany.id;
    console.log(`✅ Found Demo Company: "${demoCompany.name}" (ID: ${demoCompanyId})\n`);

    // Seed Items
    console.log("1️⃣  Seeding Items...");
    const items = [
      { name: "Diesel (50 ppm)", price: 24.85, stock_in: 18000, stock_used: 13200, item_type: "physical" },
      { name: "Explosive Pack ANFO (1 t)", price: 8650, stock_in: 18, stock_used: 12, item_type: "physical" },
      { name: "Conveyor Belt Repair Kit", price: 14500, stock_in: 9, stock_used: 4, item_type: "physical" },
      { name: "On-site Survey Crew (day)", price: 7800, stock_in: 22, stock_used: 15, item_type: "service" },
      { name: "Crusher Specialist Callout", price: 12500, stock_in: 12, stock_used: 6, item_type: "service" },
      { name: "Wear Plate Set", price: 9800, stock_in: 30, stock_used: 21, item_type: "physical" },
    ];

    const itemsWithCompany = items.map(item => ({
      ...item,
      company_id: demoCompanyId,
      user_id: demoCompany.user_id,
    }));

    const { error: itemError } = await supabase
      .from("items")
      .insert(itemsWithCompany);

    if (itemError) {
      console.log(`   ⚠️  Items: ${itemError.message}`);
    } else {
      console.log(`   ✅ Added ${items.length} items\n`);
    }

    // Seed Projects
    console.log("2️⃣  Seeding Projects...");
    const projects = [
      {
        name: "Haul Road Rehab",
        description: "Stabilise, widen, and cap the 4 km haul road between pits.",
        photo_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Process Plant Refurb",
        description: "Replace worn chute liners and recalibrate secondary crushers.",
        photo_url: "https://images.unsplash.com/photo-1457449940276-e8deed18bfff?auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Tailings Storage Lift",
        description: "Raise TSF wall by 3m with compacted engineered fill.",
        photo_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Drill & Blast Campaign",
        description: "120-hole pattern for north pit pushback.",
        photo_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60",
      },
      {
        name: "Crusher Maintenance Blitz",
        description: "Three-day shutdown to swap liners and bearings.",
        photo_url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=60",
      },
    ];

    const projectsWithCompany = projects.map(proj => ({
      ...proj,
      company_id: demoCompanyId,
      user_id: demoCompany.user_id,
    }));

    const { data: createdProjects, error: projectError } = await supabase
      .from("projects")
      .insert(projectsWithCompany)
      .select("id, name");

    if (projectError) {
      console.log(`   ⚠️  Projects: ${projectError.message}`);
    } else {
      console.log(`   ✅ Added ${projects.length} projects\n`);
    }

    // Seed Customers
    console.log("3️⃣  Seeding Customers...");
    const customers = [
      { name: "Mbali Civil Works", email: "projects@mbali.co.za" },
      { name: "Kopano Mining JV", email: "ops@kopanomining.africa" },
      { name: "Sunset Aggregates", email: "finance@sunsetagg.co.za" },
      { name: "Highveld Crushing", email: "info@highveldcrushing.co.za" },
      { name: "MoAfrika Minerals", email: "admin@moafrika-minerals.co.za" },
    ];

    const customersWithCompany = customers.map(cust => ({
      ...cust,
      company_id: demoCompanyId,
      user_id: demoCompany.user_id,
    }));

    const { data: createdCustomers, error: customerError } = await supabase
      .from("customers")
      .insert(customersWithCompany)
      .select("id, name");

    if (customerError) {
      console.log(`   ⚠️  Customers: ${customerError.message}`);
    } else {
      console.log(`   ✅ Added ${customers.length} customers\n`);
    }

    // Seed Tasks (requires project IDs)
    console.log("4️⃣  Seeding Tasks...");
    if (createdProjects && createdProjects.length > 0) {
      const projectMap = {};
      createdProjects.forEach(p => {
        projectMap[p.name] = p.id;
      });

      const tasks = [
        { project: "Haul Road Rehab", name: "Survey control & pegging", description: "Lay out widened alignment and check crossfall.", status: "done", seconds: 16200, assigned_to: "Sipho Dlamini" },
        { project: "Haul Road Rehab", name: "Lime stabilisation run 1", description: "Blend lime across km 2-3 section.", status: "in-progress", seconds: 8700, assigned_to: "Lerato Maseko" },
        { project: "Process Plant Refurb", name: "Chute liner strip-out", description: "Remove worn liners on secondary feed chute.", status: "done", seconds: 20400, assigned_to: "Thando Nkosi" },
        { project: "Process Plant Refurb", name: "Crusher recalibration", description: "Laser align crusher gap before restart.", status: "todo", seconds: 0, assigned_to: "Nomsa Khumalo" },
        { project: "Tailings Storage Lift", name: "Geotech inspections", description: "Log compaction results and densities by zone.", status: "in-progress", seconds: 5400, assigned_to: "Sipho Dlamini" },
        { project: "Tailings Storage Lift", name: "Crest drainage tie-in", description: "Install HDPE drains into existing spillway.", status: "todo", seconds: 0, assigned_to: "Lerato Maseko" },
        { project: "Drill & Blast Campaign", name: "Pattern drilling", description: "Complete 120-hole pattern with 165 mm holes.", status: "in-progress", seconds: 11100, assigned_to: "Sipho Dlamini" },
        { project: "Drill & Blast Campaign", name: "Explosive loading", description: "Load ANFO and boosters with QA sheet.", status: "todo", seconds: 0, assigned_to: "Thando Nkosi" },
        { project: "Crusher Maintenance Blitz", name: "Liner swap prep", description: "Loosen backing material and stage new sets.", status: "done", seconds: 9600, assigned_to: "Nomsa Khumalo" },
        { project: "Crusher Maintenance Blitz", name: "Bearing inspection", description: "Inspect main shaft bearings during shutdown.", status: "in-progress", seconds: 4200, assigned_to: "Lerato Maseko" },
      ];

      const tasksWithCompany = tasks
        .filter(t => projectMap[t.project])
        .map(t => ({
          name: t.name,
          description: t.description,
          status: t.status,
          seconds: t.seconds,
          assigned_to: t.assigned_to,
          project_id: projectMap[t.project],
          company_id: demoCompanyId,
          user_id: demoCompany.user_id,
          billable: true,
        }));

      const { error: taskError } = await supabase
        .from("tasks")
        .insert(tasksWithCompany);

      if (taskError) {
        console.log(`   ⚠️  Tasks: ${taskError.message}`);
      } else {
        console.log(`   ✅ Added ${tasksWithCompany.length} tasks\n`);
      }
    }

    // Seed Invoices
    console.log("5️⃣  Seeding Invoices...");
    if (createdCustomers && createdCustomers.length > 0) {
      const invoices = [
        { customer: "Mbali Civil Works", amount: 485000, description: "Progress draw #3 - Haul road stabilisation and survey." },
        { customer: "Kopano Mining JV", amount: 320000, description: "Process plant shutdown labour & materials." },
        { customer: "Sunset Aggregates", amount: 215000, description: "Tailings lift QA services (week 18)." },
        { customer: "Highveld Crushing", amount: 155000, description: "Crusher blitz callout fee and spares." },
        { customer: "MoAfrika Minerals", amount: 265000, description: "Drill & blast campaign progress payment." },
      ];

      const customerMap = {};
      createdCustomers.forEach(c => {
        customerMap[c.name] = c.id;
      });

      const invoicesWithCompany = invoices
        .filter(i => customerMap[i.customer])
        .map(i => ({
          customer_id: customerMap[i.customer],
          amount: i.amount,
          description: i.description,
          status: "draft",
          company_id: demoCompanyId,
          user_id: demoCompany.user_id,
        }));

      const { error: invoiceError } = await supabase
        .from("invoices")
        .insert(invoicesWithCompany);

      if (invoiceError) {
        console.log(`   ⚠️  Invoices: ${invoiceError.message}`);
      } else {
        console.log(`   ✅ Added ${invoicesWithCompany.length} invoices\n`);
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✅ DEMO DATA SEEDING COMPLETE!\n");
    console.log("📊 Now your localhost Demo Company has:");
    console.log(`   • ${items.length} items/inventory`);
    console.log(`   • ${projects.length} projects`);
    console.log(`   • ${customers.length} customers`);
    console.log(`   • 10 tasks (across all projects)`);
    console.log(`   • 5 invoices\n`);
    console.log("🚀 Refresh your browser to see all the demo data!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

seedDemoData();
