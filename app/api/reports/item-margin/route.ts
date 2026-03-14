import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { getCompanyContext } from "../../../../lib/companyContext";

interface ItemMargin {
  itemId: number;
  itemName: string;
  itemType: string;
  cost: number;
  sellingPrice: number;
  margin: number;
  marginPercent: number;
  usageCount: number;
}

interface TierData {
  items: ItemMargin[];
  totalCost: number;
  totalSellingPrice: number;
  totalMargin: number;
  avgMarginPercent: number;
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

    // Fetch all items for this company
    const { data: itemsData } = await supabaseServer
      .from("items")
      .select("id, name, price, cost, item_type")
      .eq("company_id", companyId)
      .order("name");

    const itemsList = Array.isArray(itemsData) ? itemsData : [];

    // Fetch all invoices to count item usage
    const { data: invoicesData } = await supabaseServer
      .from("invoices")
      .select("id, line_items")
      .eq("company_id", companyId);

    const allInvoices = Array.isArray(invoicesData) ? invoicesData : [];

    // Count usage for each item
    const usageMap = new Map<number, number>();
    for (const invoice of allInvoices) {
      if (invoice.line_items && Array.isArray(invoice.line_items)) {
        for (const line of invoice.line_items) {
          if (line && (line.item_id || line.itemId)) {
            const itemId = line.item_id || line.itemId;
            usageMap.set(itemId, (usageMap.get(itemId) || 0) + 1);
          }
        }
      }
    }

    // Calculate margins
    const itemMargins: ItemMargin[] = itemsList.map((item) => {
      const cost = item.cost || 0;
      const sellingPrice = item.price || 0;
      const margin = sellingPrice - cost;
      const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;
      const usageCount = usageMap.get(item.id) || 0;

      return {
        itemId: item.id,
        itemName: item.name,
        itemType: item.item_type || "physical",
        cost,
        sellingPrice,
        margin,
        marginPercent,
        usageCount,
      };
    });

    // Calculate totals
    const totalCost = itemMargins.reduce((sum, item) => sum + item.cost, 0);
    const totalSellingPrice = itemMargins.reduce((sum, item) => sum + item.sellingPrice, 0);
    const totalMargin = totalSellingPrice - totalCost;
    const avgMarginPercent = totalSellingPrice > 0 ? (totalMargin / totalSellingPrice) * 100 : 0;

    const response: TierData = {
      items: itemMargins.sort((a, b) => b.marginPercent - a.marginPercent), // Sort by margin % descending
      totalCost,
      totalSellingPrice,
      totalMargin,
      avgMarginPercent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/reports/item-margin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
