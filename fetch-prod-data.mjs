#!/usr/bin/env node
/**
 * Fetch production demo data from vercel.app
 * and prepare it for local seeding
 */

const PROD_URL = "https://fieldcost.vercel.app";

async function fetchProdData() {
  console.log("📥 Fetching demo data from production...\n");
  
  try {
    // Fetch tasks data
    const taskRes = await fetch(`${PROD_URL}/api/projects?user_id=11111111-1111-1111-1111-111111111111&company_id=1`);
    const projects = await taskRes.json();
    
    const customersRes = await fetch(`${PROD_URL}/api/customers?user_id=11111111-1111-1111-1111-111111111111&company_id=1`);
    const customers = await customersRes.json();
    
    const itemsRes = await fetch(`${PROD_URL}/api/items?user_id=11111111-1111-1111-1111-111111111111&company_id=1`);
    const items = await itemsRes.json();
    
    const invoicesRes = await fetch(`${PROD_URL}/api/invoices?user_id=11111111-1111-1111-1111-111111111111&company_id=1`);
    const invoices = await invoicesRes.json();
    
    const tasksRes = await fetch(`${PROD_URL}/api/tasks?user_id=11111111-1111-1111-1111-111111111111&company_id=1`);
    const tasks = await tasksRes.json();
    
    console.log("✅ Fetched Production Data:");
    console.log(`   Projects: ${Array.isArray(projects) ? projects.length : 0}`);
    console.log(`   Customers: ${Array.isArray(customers) ? customers.length : 0}`);
    console.log(`   Items: ${Array.isArray(items) ? items.length : 0}`);
    console.log(`   Invoices: ${Array.isArray(invoices) ? invoices.length : 0}`);
    console.log(`   Tasks: ${Array.isArray(tasks) ? tasks.length : 0}\n`);
    
    // Output data as JSON
    console.log("📊 Projects Data:");
    console.log(JSON.stringify(projects, null, 2));
    
    return { projects, customers, items, invoices, tasks };
  } catch (err) {
    console.error("❌ Error fetching production data:", err.message);
    process.exit(1);
  }
}

fetchProdData().then(() => {
  console.log("\n✅ Data fetch complete. Use this data to update the seed endpoint.");
});
