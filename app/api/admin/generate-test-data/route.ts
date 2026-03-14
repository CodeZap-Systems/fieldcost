import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { getCompanyContext } from "../../../../lib/companyContext";

/**
 * POST /api/admin/generate-test-data
 * 
 * Generates test data for reports testing
 * Only available in development or for admin users
 * 
 * Required query params:
 * - company_id: Company to generate data for
 * - user_id: Authenticated user
 * 
 * Optional query params:
 * - projects: Number of projects (default: 3)
 * - items_per_project: Items per project (default: 5)
 * - invoices_per_project: Invoices per project (default: 3)
 */

export async function POST(req: Request) {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Test data generation is only available in development" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get("user_id"));
    const companyId = searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json(
        { error: "company_id parameter required" },
        { status: 400 }
      );
    }

    // Validate user has access to company
    const context = await getCompanyContext(userId, companyId);

    // Parse config from query params
    const projectCount = Math.min(parseInt(searchParams.get("projects") || "3", 10), 10);
    const itemsPerProject = Math.min(parseInt(searchParams.get("items_per_project") || "5", 10), 20);
    const invoicesPerProject = Math.min(parseInt(searchParams.get("invoices_per_project") || "3", 10), 10);

    console.log(
      `[API] Generating test data: projects=${projectCount}, items=${itemsPerProject}, invoices=${invoicesPerProject}`
    );

    // Step 1: Create Projects
    const projects = [];
    for (let i = 1; i <= projectCount; i++) {
      const { data: project, error: projectError } = await supabaseServer
        .from("projects")
        .insert({
          name: `Test Project ${i}`,
          description: `Demo project for reports testing - Project ${i}`,
          company_id: context.companyId,
          user_id: userId,
          status: "active",
        })
        .select()
        .single();

      if (projectError) {
        console.error(`Failed to create project ${i}:`, projectError.message);
        continue;
      }
      projects.push(project);
    }

    // Step 2: Create Items
    const items = [];
    for (let i = 1; i <= projectCount * itemsPerProject; i++) {
      const costBase = Math.random() * 500 + 100;
      const { data: item, error: itemError } = await supabaseServer
        .from("items")
        .insert({
          name: `Test Item ${i}`,
          description: `Demo item for testing - Item ${i}`,
          price: parseFloat((costBase * (1 + Math.random() * 0.5)).toFixed(2)),
          cost: parseFloat(costBase.toFixed(2)),
          item_type: ["material", "service", "equipment"][Math.floor(Math.random() * 3)],
          company_id: context.companyId,
          user_id: userId,
        })
        .select()
        .single();

      if (itemError) {
        console.error(`Failed to create item ${i}:`, itemError.message);
        continue;
      }
      items.push(item);
    }

    // Step 3: Create Invoices with Line Items
    let invoiceCount = 0;
    let lineItemCount = 0;

    for (let p = 0; p < projects.length; p++) {
      const project = projects[p];
      for (let inv = 1; inv <= invoicesPerProject; inv++) {
        const invoiceNumber = `TST-${project.id}-${Date.now()}-${inv}`;

        const { data: invoice, error: invoiceError } = await supabaseServer
          .from("invoices")
          .insert({
            invoice_number: invoiceNumber,
            company_id: context.companyId,
            user_id: userId,
            customer_id: null,
            status: ["draft", "sent", "paid"][Math.floor(Math.random() * 3)],
            total: 0,
          })
          .select()
          .single();

        if (invoiceError) {
          console.error(`Failed to create invoice for project ${p}:`, invoiceError.message);
          continue;
        }

        // Assign items to this invoice
        const itemsForInvoice = items.slice(p * itemsPerProject, (p + 1) * itemsPerProject);
        const selectedItems = itemsForInvoice.slice(0, Math.ceil(itemsForInvoice.length / 2));

        const lineItems = selectedItems.map((item) => {
          const quantity = Math.floor(Math.random() * 5) + 1;
          const unitPrice = item.price;
          const total = quantity * unitPrice;

          return {
            item_id: item.id,
            itemId: item.id,
            quantity,
            unit_price: unitPrice,
            total,
            project: String(project.id),
            projectId: String(project.id),
          };
        });

        const invoiceTotal = lineItems.reduce((sum, line) => sum + line.total, 0);

        const { error: updateError } = await supabaseServer
          .from("invoices")
          .update({
            line_items: lineItems,
            total: invoiceTotal,
          })
          .eq("id", invoice.id);

        if (!updateError) {
          invoiceCount++;
          lineItemCount += lineItems.length;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Test data generated successfully",
      stats: {
        projectsCreated: projects.length,
        itemsCreated: items.length,
        invoicesCreated: invoiceCount,
        lineItemsCreated: lineItemCount,
        companyId: context.companyId,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/generate-test-data error:", error);
    return NextResponse.json(
      { error: "Failed to generate test data", details: String(error) },
      { status: 500 }
    );
  }
}
