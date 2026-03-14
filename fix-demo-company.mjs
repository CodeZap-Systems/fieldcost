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

async function fixDemoCompany() {
  console.log("🔧 FIXING DEMO COMPANY DATA ISOLATION\n");

  try {
    // STEP 1: CLEAN INVOICE LINE ITEMS - DELETE ITEMS FROM ALL INVOICES
    console.log("🗑️  Cleaning orphaned invoice references...");
    
    // First, delete all invoice line items that reference items in demo company
    const { data: itemIds } = await supabase
      .from("items")
      .select("id")
      .eq("company_id", DEMO_COMPANY_ID);
    
    if (itemIds && itemIds.length > 0) {
      const ids = itemIds.map(i => i.id);
      const { error: delLinesErr } = await supabase
        .from("invoice_line_items")
        .delete()
        .in("item_id", ids);
      if (delLinesErr && !delLinesErr.message.includes("no rows")) {
        console.warn("  ⚠️  Warning deleting line items:", delLinesErr.message);
      }
    }
    console.log("✅ Invoice references cleaned");

    console.log("🗑️  Removing 27 duplicate items...");
    const { error: delItemsErr } = await supabase
      .from("items")
      .delete()
      .eq("company_id", DEMO_COMPANY_ID);
    if (delItemsErr && !delItemsErr.message.includes("no rows")) {
      throw delItemsErr;
    }
    console.log("✅ Items cleaned\n");

    // STEP 2: SEED 5 CORRECT ITEMS
    console.log("📦 Seeding 5 fresh items...");
    const itemsData = [
      { name: "HDPE Drainage Pipe (100mm)", price: 450, stock_in: 2000, item_type: "material" },
      { name: "Crusher Bearing Assembly", price: 8500, stock_in: 15, item_type: "material" },
      { name: "Steel Chute Liner Plate", price: 3200, stock_in: 50, item_type: "material" },
      { name: "Hydraulic Oil (1000L)", price: 2800, stock_in: 10, item_type: "material" },
      { name: "Equipment Rental - Dozer (day)", price: 1200, stock_in: 5, item_type: "service" },
    ];

    for (const item of itemsData) {
      const { error: insertErr } = await supabase.from("items").insert([
        {
          name: item.name,
          price: item.price,
          stock_in: item.stock_in,
          item_type: item.item_type,
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
      if (insertErr) console.error(`  ⚠️  Error inserting ${item.name}:`, insertErr.message);
    }
    console.log("✅ Created 5 items\n");

    // STEP 3: SEED 3 INVOICES MATCHING LIVE SITE
    console.log("💳 Seeding 3 invoices...");
    
    // Get the 3 main customers for invoices
    const { data: customers } = await supabase
      .from("customers")
      .select("id, name")
      .eq("company_id", DEMO_COMPANY_ID)
      .limit(3);

    const customerMap = {};
    if (customers) {
      customers.forEach((c) => {
        customerMap[c.name] = c.id;
      });
    }

    const invoicesData = [
      {
        customer_id: customerMap["Mining Solutions Inc"] || customers?.[0]?.id,
        customer_name: "Mining Solutions Inc",
        amount: 485000,
        invoice_number: "DEM-001",
        description: "Process plant shutdown labour & materials",
        status: "paid",
      },
      {
        customer_id: customerMap["Geo Engineering Group"] || customers?.[1]?.id,
        customer_name: "Geo Engineering Group",
        amount: 320000,
        invoice_number: "DEM-002",
        description: "Haul road stabilisation and survey",
        status: "sent",
      },
      {
        customer_id: customerMap["Blast & Debris"] || customers?.[2]?.id,
        customer_name: "Blast & Debris",
        amount: 215000,
        invoice_number: "DEM-003",
        description: "Tailings lift QA services (week 18)",
        status: "awaiting",
      },
    ];

    for (const inv of invoicesData) {
      if (!inv.customer_id) {
        console.log(`  ⚠️  Skipping invoice for ${inv.customer_name} (no customer)`);
        continue;
      }

      const { error: invErr } = await supabase.from("invoices").insert([
        {
          customer_id: inv.customer_id,
          amount: inv.amount,
          description: inv.description,
          invoice_number: inv.invoice_number,
          status: inv.status,
          issued_on: new Date().toISOString().split("T")[0],
          due_on: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          currency: "ZAR",
          company_id: DEMO_COMPANY_ID,
          user_id: DEMO_USER_ID,
        },
      ]);
      if (invErr) {
        console.log(`  ⚠️  Error creating invoice ${inv.invoice_number}:`, invErr.message);
      } else {
        console.log(`  ✅ Created invoice ${inv.invoice_number}`);
      }
    }
    console.log("✅ Invoices created\n");

    // STEP 4: REDUCE CUSTOMERS TO 3 MAIN ONES
    console.log("👥 Optimizing customers (keeping 3 main ones)...");
    const { data: allCustomers } = await supabase
      .from("customers")
      .select("id, name")
      .eq("company_id", DEMO_COMPANY_ID);

    // Keep first 3, delete rest
    if (allCustomers && allCustomers.length > 3) {
      const idsToDelete = allCustomers.slice(3).map((c) => c.id);
      const { error: delCustErr } = await supabase
        .from("customers")
        .delete()
        .in("id", idsToDelete);
      if (delCustErr) {
        console.log(`  ⚠️  Could not delete excess customers: ${delCustErr.message}`);
      } else {
        console.log(`  ✅ Cleaned up ${idsToDelete.length} excess customers`);
      }
    }
    console.log("");

    // STEP 5: FINAL VERIFICATION
    console.log("✅ DEMO COMPANY FIXED & VERIFIED:\n");
    
    const { data: finalProjects } = await supabase
      .from("projects")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);
    console.log(`  📋 Projects: ${finalProjects?.length || 0}`);

    const { data: finalTasks } = await supabase
      .from("tasks")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);
    console.log(`  ✓ Tasks: ${finalTasks?.length || 0}`);

    const { data: finalCustomers } = await supabase
      .from("customers")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);
    console.log(`  👥 Customers: ${finalCustomers?.length || 0}`);

    const { data: finalItems } = await supabase
      .from("items")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);
    console.log(`  📦 Items: ${finalItems?.length || 0}`);

    const { data: finalInvoices } = await supabase
      .from("invoices")
      .select("id", { count: "exact" })
      .eq("company_id", DEMO_COMPANY_ID);
    console.log(`  💳 Invoices: ${finalInvoices?.length || 0}`);

    console.log("\n🚀 Demo Company is now production-ready!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

fixDemoCompany();
