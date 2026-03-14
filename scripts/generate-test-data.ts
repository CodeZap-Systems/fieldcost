import { supabaseServer } from "../lib/supabaseServer";

/**
 * Test Data Generator for FieldCost Reports
 * Creates demo projects, invoices, items with costs, and line items
 * for testing P&L and margin report functionality
 */

interface TestDataConfig {
  companyId: number;
  userId: string;
  projectCount: number;
  itemsPerProject: number;
  invoicesPerProject: number;
}

async function generateTestData(config: TestDataConfig) {
  const { companyId, userId, projectCount, itemsPerProject, invoicesPerProject } = config;

  console.log(`🚀 Starting test data generation for company ${companyId}...`);
  console.log(`   Projects: ${projectCount}, Items: ${itemsPerProject}, Invoices: ${invoicesPerProject}`);

  try {
    // Step 1: Create Projects
    console.log(`\n📋 Creating ${projectCount} projects...`);
    const projects = [];
    for (let i = 1; i <= projectCount; i++) {
      const { data: project, error: projectError } = await supabaseServer
        .from("projects")
        .insert({
          name: `Test Project ${i}`,
          description: `Demo project for testing reports - ${i}`,
          company_id: companyId,
          user_id: userId,
          status: "active",
        })
        .select()
        .single();

      if (projectError) {
        console.error(`   ❌ Failed to create project ${i}:`, projectError.message);
        continue;
      }
      projects.push(project);
      console.log(`   ✅ Created: ${project.name} (ID: ${project.id})`);
    }

    // Step 2: Create Items (shared across all projects)
    console.log(`\n📦 Creating ${projectCount * itemsPerProject} items...`);
    const items = [];
    for (let i = 1; i <= projectCount * itemsPerProject; i++) {
      const costBase = Math.random() * 500 + 100; // Cost: 100-600
      const { data: item, error: itemError } = await supabaseServer
        .from("items")
        .insert({
          name: `Item ${i}`,
          description: `Test item ${i}`,
          price: costBase * (1 + Math.random() * 0.5), // Price: cost + 0-50%
          cost: costBase,
          item_type: ["material", "service", "equipment"][Math.floor(Math.random() * 3)],
          company_id: companyId,
          user_id: userId,
        })
        .select()
        .single();

      if (itemError) {
        console.error(`   ❌ Failed to create item ${i}:`, itemError.message);
        continue;
      }
      items.push(item);
      console.log(`   ✅ Created: ${item.name} - Cost: R${item.cost.toFixed(2)}, Price: R${item.price.toFixed(2)}`);
    }

    // Step 3: Create Invoices with Line Items
    console.log(`\n📄 Creating invoices and line items...`);
    for (let p = 0; p < projects.length; p++) {
      const project = projects[p];
      for (let inv = 1; inv <= invoicesPerProject; inv++) {
        // Create invoice
        const invoiceNumber = `INV-${project.id}-${inv}`;
        const { data: invoice, error: invoiceError } = await supabaseServer
          .from("invoices")
          .insert({
            invoice_number: invoiceNumber,
            company_id: companyId,
            user_id: userId,
            customer_id: null, // Optional for testing
            status: ["draft", "sent", "paid"][Math.floor(Math.random() * 3)],
            total: 0, // Will be calculated from line items
          })
          .select()
          .single();

        if (invoiceError) {
          console.error(`   ❌ Failed to create invoice for project ${p + 1}:`, invoiceError.message);
          continue;
        }

        // Create line items for this invoice
        const itemsForInvoice = items.slice(p * itemsPerProject, (p + 1) * itemsPerProject);
        const lineItems = itemsForInvoice
          .slice(0, Math.ceil(itemsForInvoice.length / 2)) // Use ~half the items per invoice
          .map((item) => {
            const quantity = Math.floor(Math.random() * 5) + 1;
            const unitPrice = item.price;
            const total = quantity * unitPrice;

            return {
              item_id: item.id,
              itemId: item.id,
              quantity,
              unit_price: unitPrice,
              total,
              project: String(project.id), // Store project ID in line item
              projectId: String(project.id),
            };
          });

        const invoiceTotal = lineItems.reduce((sum, line) => sum + line.total, 0);

        // Update invoice with line items and total
        const { error: updateError } = await supabaseServer
          .from("invoices")
          .update({
            line_items: lineItems,
            total: invoiceTotal,
          })
          .eq("id", invoice.id);

        if (updateError) {
          console.error(`   ❌ Failed to update invoice ${invoiceNumber}:`, updateError.message);
          continue;
        }

        console.log(
          `   ✅ Invoice ${invoiceNumber}: ${lineItems.length} items, R${invoiceTotal.toFixed(2)}`
        );
      }
    }

    console.log(`\n✨ Test data generation complete!`);
    console.log(`\n📊 Summary:`);
    console.log(`   Projects: ${projects.length}`);
    console.log(`   Items: ${items.length}`);
    console.log(`   Invoices: ${projects.length * invoicesPerProject}`);

    return {
      projectsCreated: projects.length,
      itemsCreated: items.length,
      invoicesCreated: projects.length * invoicesPerProject,
    };
  } catch (error) {
    console.error("❌ Test data generation failed:", error);
    throw error;
  }
}

// Export for use as API endpoint or CLI
export { generateTestData };
