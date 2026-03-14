#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";

const envFile = ".env.local";
const envContent = fs.readFileSync(envFile, "utf8");

function getEnv(key) {
  const line = envContent.split("\n").find((l) => l.startsWith(key));
  if (!line) throw new Error(`${key} not found in ${envFile}`);
  return line.split("=")[1].trim().replace(/^["']|["']$/g, "");
}

const supabase = createClient(
  getEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getEnv("SUPABASE_SERVICE_ROLE_KEY")
);

const DEMO_COMPANY_ID = 8;
const DEMO_USER_ID = "22222222-2222-2222-2222-222222222222";

async function seedLiveData() {
  console.log("🚀 SEEDING DEMO WITH LIVE SITE DATA\n");

  try {
    // EXACT DATA FROM LIVE SITE

    // Projects (3)
    const projectsData = [
      {
        id: 100,
        name: "Haul Road Rehab",
        description: "Road rehabilitation and stabilization project",
      },
      {
        id: 101,
        name: "Process Plant Refurb",
        description: "Industrial process plant refurbishment",
      },
      {
        id: 102,
        name: "Tailings Storage Lift",
        description: "Tailings storage expansion and lift",
      },
    ];

    // Tasks (6) - with exact hour tracking
    const tasksData = [
      {
        name: "Crest drainage tie-in",
        description: "Install HDPE drains into existing spillway.",
        project_id: 102,
        status: "todo",
        seconds: 0,
      },
      {
        name: "Geotech inspections",
        description: "Log compaction results and densities by zone.",
        project_id: 102,
        status: "in_progress",
        seconds: 90 * 3600,
      },
      {
        name: "Crusher recalibration",
        description: "Laser align crusher gap before restart.",
        project_id: 101,
        status: "todo",
        seconds: 0,
      },
      {
        name: "Chute liner strip-out",
        description: "Remove worn liners on secondary feed chute.",
        project_id: 101,
        status: "done",
        seconds: 340 * 3600,
      },
      {
        name: "Lime stabilisation run 1",
        description: "Blend lime across km 2-3 section.",
        project_id: 100,
        status: "in_progress",
        seconds: 145 * 3600,
      },
      {
        name: "Survey control & pegging",
        description: "Lay out widened alignment and check crossfall.",
        project_id: 100,
        status: "done",
        seconds: 270 * 3600,
      },
    ];

    // Customers (3) - from live site invoices
    const customersData = [
      {
        id: 122,
        name: "Mbali Civil Works",
        email: "info@mbalicivil.co.za",
      },
      {
        id: 123,
        name: "Kopano Mining JV",
        email: "contact@kopanomining.co.za",
      },
      {
        id: 124,
        name: "Sunset Aggregates",
        email: "ops@sunsetagg.co.za",
      },
    ];

    // Items (3) - simplified, from live site demo inventory
    const itemsData = [
      {
        id: 109,
        name: "Diesel (50 ppm)",
        price: 24.85,
        stock_in: 18000,
        stock_used: 13200,
        item_type: "physical",
      },
      {
        id: 110,
        name: "Explosive Pack ANFO (1 t)",
        price: 8650.0,
        stock_in: 18,
        stock_used: 12,
        item_type: "physical",
      },
      {
        id: 111,
        name: "On-site Survey Crew (day)",
        price: 7800.0,
        stock_in: 22,
        stock_used: 15,
        item_type: "service",
      },
    ];

    // Invoices (3) - from live site
    const invoicesData = [
      {
        id: 99,
        customer_id: 122,
        customer_name: "Mbali Civil Works",
        amount: 485000,
        invoice_number: "#75",
        description: "Progress draw #3 - Haul road stabilisation and survey.",
        status: "sent",
      },
      {
        id: 100,
        customer_id: 123,
        customer_name: "Kopano Mining JV",
        amount: 320000,
        invoice_number: "#76",
        description: "Process plant shutdown labour & materials.",
        status: "sent",
      },
      {
        id: 101,
        customer_id: 124,
        customer_name: "Sunset Aggregates",
        amount: 215000,
        invoice_number: "#77",
        description: "Tailings lift QA services (week 18).",
        status: "sent",
      },
    ];

    // Crew members (5) - from live site
    const crewData = [
      { id: 1, name: "Dingani Ncube", hourly_rate: 565 },
      { id: 2, name: "Lerato Maseko", hourly_rate: 395 },
      { id: 3, name: "Nomsa Khumalo", hourly_rate: 380 },
      { id: 4, name: "Sipho Dlamini", hourly_rate: 420 },
      { id: 5, name: "Thando Nkosi", hourly_rate: 440 },
    ];

    // DELETE EXISTING DATA
    console.log("🗑️  Cleaning old data...");
    await supabase.from("invoice_line_items").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("invoices").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("items").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("tasks").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("projects").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("customers").delete().eq("company_id", DEMO_COMPANY_ID);
    await supabase.from("crew_members").delete().eq("company_id", DEMO_COMPANY_ID);
    console.log("✅ Cleaned\n");

    // INSERT PROJECTS
    console.log("📋 Creating 3 projects...");
    for (const proj of projectsData) {
      await supabase.from("projects").insert([
        {
          name: proj.name,
          description: proj.description,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
    }
    console.log("✅ Projects created\n");

    // INSERT CREW
    console.log("👥 Creating 5 crew members...");
    for (const member of crewData) {
      await supabase.from("crew_members").insert([
        {
          name: member.name,
          hourly_rate: member.hourly_rate,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
    }
    console.log("✅ Crew created\n");

    // INSERT TASKS
    console.log("✓ Creating 6 tasks...");
    const { data: projects } = await supabase
      .from("projects")
      .select("id, name")
      .eq("company_id", DEMO_COMPANY_ID);

    for (const task of tasksData) {
      const project = projects?.find((p) => p.name === projectsData.find(pd => pd.id === task.project_id)?.name);
      if (project) {
        await supabase.from("tasks").insert([
          {
            name: task.name,
            description: task.description,
            project_id: project.id,
            status: task.status,
            seconds: task.seconds,
            billable: true,
            company_id: DEMO_COMPANY_ID,
            user_id: DEMO_USER_ID,
          },
        ]);
      }
    }
    console.log("✅ Tasks created\n");

    // INSERT CUSTOMERS
    console.log("👥 Creating 3 customers...");
    for (const cust of customersData) {
      await supabase.from("customers").insert([
        {
          name: cust.name,
          email: cust.email,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
    }
    console.log("✅ Customers created\n");

    // INSERT ITEMS
    console.log("📦 Creating 3 items...");
    for (const item of itemsData) {
      await supabase.from("items").insert([
        {
          name: item.name,
          price: item.price,
          stock_in: item.stock_in,
          stock_used: item.stock_used,
          item_type: item.item_type,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
    }
    console.log("✅ Items created\n");

    // INSERT INVOICES
    console.log("💳 Creating 3 invoices...");
    for (const inv of invoicesData) {
      const { data: customers } = await supabase
        .from("customers")
        .select("id")
        .eq("company_id", DEMO_COMPANY_ID)
        .eq("name", inv.customer_name)
        .maybeSingle();

      if (customers) {
        await supabase.from("invoices").insert([
          {
            customer_id: customers.id,
            amount: inv.amount,
            description: inv.description,
            invoice_number: inv.invoice_number,
            status: inv.status,
            currency: "ZAR",
            issued_on: new Date().toISOString().split("T")[0],
            due_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            company_id: DEMO_COMPANY_ID,
            user_id: DEMO_USER_ID,
          },
        ]);
      }
    }
    console.log("✅ Invoices created\n");

    // FINAL SUMMARY
    console.log("🎉 DEMO DATA FULLY SEEDED FROM LIVE SITE!\n");

    const { data: finalProjects } = await supabase
      .from("projects")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    const { data: finalTasks } = await supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    const { data: finalCustomers } = await supabase
      .from("customers")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    const { data: finalItems } = await supabase
      .from("items")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    const { data: finalInvoices } = await supabase
      .from("invoices")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    const { data: finalCrew } = await supabase
      .from("crew_members")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);

    console.log("📊 DEMO COMPANY FINAL STATE:\n");
    console.log(`  📋 Projects: ${finalProjects?.length || 0}`);
    console.log(`  ✓ Tasks: ${finalTasks?.length || 0}`);
    console.log(`  👥 Customers: ${finalCustomers?.length || 0}`);
    console.log(`  📦 Items: ${finalItems?.length || 0}`);
    console.log(`  💳 Invoices: ${finalInvoices?.length || 0}`);
    console.log(`  👤 Crew: ${finalCrew?.length || 0}`);

    console.log("\n✅ Demo Company ready for client presentation!\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

seedLiveData();
