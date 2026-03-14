import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { getCompanyContext } from "../../../../lib/companyContext";

interface ProjectPandL {
  projectId: number;
  projectName: string;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
  invoiceCount: number;
  itemCount: number;
}

interface TierData {
  projects: ProjectPandL[];
  totalRevenue: number;
  totalCosts: number;
  totalProfit: number;
  overallMargin: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = resolveServerUserId(searchParams.get("user_id"));
    const companyId = searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json({ error: "company_id required" }, { status: 400 });
    }

    // Validate user has access to company
    await getCompanyContext(userId, companyId);

    // Fetch all projects for this company
    const { data: projects, error: projectsError } = await supabaseServer
      .from("projects")
      .select("id, name")
      .eq("company_id", companyId)
      .order("name");

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return NextResponse.json(
        { error: "Failed to fetch projects" },
        { status: 500 }
      );
    }

    const projectsList = Array.isArray(projects) ? projects : [];

    // Fetch all invoices with line items for this company
    const { data: invoicesData } = await supabaseServer
      .from("invoices")
      .select("id, amount, line_items")
      .eq("company_id", companyId);

    const allInvoices = Array.isArray(invoicesData) ? invoicesData : [];

    // Fetch all items with costs for this company
    const { data: itemsData } = await supabaseServer
      .from("items")
      .select("id, cost")
      .eq("company_id", companyId);

    const allItems = Array.isArray(itemsData) ? itemsData : [];
    const costMap = new Map(allItems.map(item => [item.id, item.cost || 0]));

    // For each project, calculate P&L
    const projectPandL: ProjectPandL[] = projectsList.map((project) => {
      // Calculate revenue: sum line items that reference this project
      let revenue = 0;
      let invoiceCount = 0;
      const invoicesForProject = new Set<number>();

      for (const invoice of allInvoices) {
        if (invoice.line_items && Array.isArray(invoice.line_items)) {
          let hasProjectMatch = false;
          for (const line of invoice.line_items) {
            if (!line) continue;
            
            // Check if this line item belongs to this project
            const lineProject = line.project || line.projectId;
            const projectIdStr = String(project.id);
            
            if (lineProject && (
              String(lineProject) === projectIdStr ||
              lineProject === projectIdStr ||
              lineProject === project.id
            )) {
              revenue += parseFloat(String(line.total || 0));
              hasProjectMatch = true;
            }
          }
          if (hasProjectMatch) {
            invoicesForProject.add(invoice.id);
            invoiceCount++;
          }
        }
      }

      // Calculate costs: sum of item costs used in tasks for this project
      let costs = 0;
      let itemCount = 0;

      // Sum item costs for items used in this project's invoices
      const projectItemIds = new Set<number>();
      for (const invoice of allInvoices) {
        if (invoice.line_items && Array.isArray(invoice.line_items)) {
          for (const line of invoice.line_items) {
            if (!line) continue;
            
            // Check if this line item belongs to this project
            const lineProject = line.project || line.projectId;
            const projectIdStr = String(project.id);
            
            if (lineProject && (
              String(lineProject) === projectIdStr ||
              lineProject === projectIdStr ||
              lineProject === project.id
            )) {
              const itemId = line.item_id || line.itemId;
              if (itemId && typeof itemId === "number") {
                projectItemIds.add(itemId);
              }
            }
          }
        }
      }

      for (const itemId of projectItemIds) {
        const itemCost = costMap.get(itemId) || 0;
        costs += parseFloat(String(itemCost));
        itemCount++;
      }

      const profit = revenue - costs;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        projectId: project.id,
        projectName: project.name,
        revenue,
        costs,
        profit,
        profitMargin,
        invoiceCount,
        itemCount,
      };
    });

    // Calculate totals
    const totalRevenue = projectPandL.reduce((sum, p) => sum + p.revenue, 0);
    const totalCosts = projectPandL.reduce((sum, p) => sum + p.costs, 0);
    const totalProfit = totalRevenue - totalCosts;
    const overallMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    const response: TierData = {
      projects: projectPandL.sort((a, b) => b.profit - a.profit), // Sort by profit descending
      totalRevenue,
      totalCosts,
      totalProfit,
      overallMargin,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/reports/project-pandl error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
