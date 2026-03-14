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

const supabase = createClient(getEnv("NEXT_PUBLIC_SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"));

const DEMO_COMPANY_ID = 8;

async function diagnose() {
  console.log("🔍 DATABASE ISOLATION DIAGNOSTIC\n");

  try {
    // Get all companies
    console.log("📊 COMPANY PROFILES:");
    const { data: companies, error: compError } = await supabase.from("company_profiles").select("id, name, is_demo, user_id");
    if (compError) throw compError;
    companies.forEach((c) => {
      console.log(`  Company ${c.id}: "${c.name}" (is_demo=${c.is_demo})`);
    });

    console.log(`\n📈 DATA ISOLATION SUMMARY:\n`);

    // For each company, count data
    for (const company of companies) {
      console.log(`\n🏢 Company ${company.id} ("${company.name}" - is_demo=${company.is_demo}):`);

      // Count projects
      const { data: projects, error: projErr } = await supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("company_id", company.id);
      console.log(`  • Projects: ${projects?.length || 0}`);

      // Count customers
      const { data: customers, error: custErr } = await supabase
        .from("customers")
        .select("id", { count: "exact" })
        .eq("company_id", company.id);
      console.log(`  • Customers: ${customers?.length || 0}`);

      // Count items
      const { data: items, error: itemErr } = await supabase
        .from("items")
        .select("id", { count: "exact" })
        .eq("company_id", company.id);
      console.log(`  • Items: ${items?.length || 0}`);

      // Count tasks
      const { data: tasks, error: taskErr } = await supabase
        .from("tasks")
        .select("id", { count: "exact" })
        .eq("company_id", company.id);
      console.log(`  • Tasks: ${tasks?.length || 0}`);

      // Count invoices
      const { data: invoices, error: invErr } = await supabase
        .from("invoices")
        .select("id", { count: "exact" })
        .eq("company_id", company.id);
      console.log(`  • Invoices: ${invoices?.length || 0}`);
    }

    // Check DEMO company specifically
    console.log(`\n🎯 DEMO COMPANY (ID=${DEMO_COMPANY_ID}) DETAILED:\n`);

    const { data: demoCompany } = await supabase
      .from("company_profiles")
      .select("*")
      .eq("id", DEMO_COMPANY_ID)
      .single();

    if (demoCompany) {
      console.log(`  Name: ${demoCompany.name}`);
      console.log(`  is_demo: ${demoCompany.is_demo}`);
      console.log(`  user_id: ${demoCompany.user_id}`);

      // Get all demo data with IDs
      const { data: demoItems } = await supabase.from("items").select("id, name").eq("company_id", DEMO_COMPANY_ID);
      const { data: demoTasks } = await supabase.from("tasks").select("id, name").eq("company_id", DEMO_COMPANY_ID);
      const { data: demoProjects } = await supabase.from("projects").select("id, name").eq("company_id", DEMO_COMPANY_ID);
      const { data: demoCustomers } = await supabase.from("customers").select("id, name").eq("company_id", DEMO_COMPANY_ID);
      const { data: demoInvoices } = await supabase.from("invoices").select("id, invoice_number, amount").eq("company_id", DEMO_COMPANY_ID);

      console.log(`\n  Projects (${demoProjects?.length || 0}):`);
      demoProjects?.forEach((p) => console.log(`    - ${p.id}: ${p.name}`));

      console.log(`\n  Tasks (${demoTasks?.length || 0}):`);
      demoTasks?.forEach((t) => console.log(`    - ${t.id}: ${t.name}`));

      console.log(`\n  Customers (${demoCustomers?.length || 0}):`);
      demoCustomers?.forEach((c) => console.log(`    - ${c.id}: ${c.name}`));

      console.log(`\n  Items (${demoItems?.length || 0}):`);
      demoItems?.forEach((i) => console.log(`    - ${i.id}: ${i.name}`));

      console.log(`\n  Invoices (${demoInvoices?.length || 0}):`);
      demoInvoices?.forEach((inv) => console.log(`    - ${inv.id}: ${inv.invoice_number} (${inv.amount})`));
    }

    console.log("\n✅ DIAGNOSTIC COMPLETE\n");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

diagnose();
