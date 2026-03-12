import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { supabase } from "../../../../lib/supabaseClient";
import { resolveServerUserId } from "../../../../lib/serverUser";
import { generateInvoicesPdf, InvoiceData, CompanyProfile } from "../../../../lib/invoicePdfGenerator";

const INVOICE_SELECT = "*, customer:customers(id, name, email, user_id), line_items:invoice_line_items(*)";

type InvoiceLineRow = {
  id?: number;
  name?: string | null;
  quantity?: number | null;
  rate?: number | null;
  total?: number | null;
  project?: string | null;
  note?: string | null;
  source?: string | null;
  task_ref?: string | null;
};

type InvoiceRow = {
  id: number;
  amount: number;
  reference?: string | null;
  invoice_number?: string | null;
  issued_on?: string | null;
  due_on?: string | null;
  created_at?: string | null;
  description?: string | null;
  currency?: string | null;
  customer?: { id: number; name: string; email?: string | null } | null;
  line_items?: InvoiceLineRow[] | null;
};

type CompanyProfileRow = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  default_currency?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return value;
  }
};

async function resolveUserId(req: Request) {
  const { data } = await supabase.auth.getUser();
  if (data?.user?.id) return data.user.id;
  const { searchParams } = new URL(req.url);
  return resolveServerUserId(searchParams.get("user_id"));
}

function buildCsv(rows: string[][]) {
  const escape = (value: string) => {
    if (value.includes("\"") || value.includes(",") || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };
  return rows.map(row => row.map(col => escape(col ?? "")).join(",")).join("\n");
}

function buildLedgerRows(invoices: InvoiceRow[]) {
  const header = ["Issued Date", "Client", "Reference", "Invoice Number", "Total"];
  const rows = invoices.map(inv => [
    formatDate(inv.issued_on || inv.created_at),
    inv.customer?.name || "",
    inv.reference || "",
    inv.invoice_number || `#${inv.id}`,
    `${inv.amount ?? 0}`,
  ]);
  return [header, ...rows];
}

function buildLineRows(invoices: InvoiceRow[]) {
  const header = [
    "Invoice Number",
    "Client",
    "Line Item",
    "Quantity",
    "Rate",
    "Total",
    "Project",
    "Note",
  ];
  const rows: string[][] = [];
  invoices.forEach(inv => {
    (inv.line_items || []).forEach((line: InvoiceLineRow) => {
      rows.push([
        inv.invoice_number || `#${inv.id}`,
        inv.customer?.name || "",
        line.name || "",
        `${line.quantity ?? 0}`,
        `${line.rate ?? 0}`,
        `${line.total ?? 0}`,
        line.project || "",
        line.note || "",
      ]);
    });
  });
  return [header, ...rows];
}

async function buildPdf(invoices: InvoiceRow[], company: CompanyProfileRow | null) {
  // Convert database rows to InvoiceData format for professional PDF generation
  const invoiceData: InvoiceData[] = invoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number || `#${inv.id}`,
    issuedOn: formatDate(inv.issued_on || inv.created_at),
    dueOn: formatDate(inv.due_on),
    reference: inv.reference || undefined,
    description: inv.description || undefined,
    amount: inv.amount || 0,
    currency: company?.default_currency || "ZAR",
    customer: inv.customer ? {
      id: inv.customer.id,
      name: inv.customer.name,
      email: inv.customer.email || undefined,
    } : undefined,
    lineItems: (inv.line_items || []).map(line => ({
      id: line.id,
      name: line.name || "Line Item",
      quantity: line.quantity || 0,
      rate: line.rate || 0,
      total: line.total || (line.rate || 0) * (line.quantity || 0),
      project: line.project || undefined,
      note: line.note || undefined,
    })),
  }));

  // Convert company profile to CompanyProfile format
  const companyProfile: CompanyProfile = {
    name: company?.name || "FieldCost",
    email: company?.email || undefined,
    phone: company?.phone || undefined,
    address1: company?.address_line1 || undefined,
    address2: company?.address_line2 || undefined,
    currency: company?.default_currency || "ZAR",
  };

  return generateInvoicesPdf(invoiceData, companyProfile);
}

export async function GET(req: Request) {
  try {
    const userId = await resolveUserId(req);
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "ledger").toLowerCase();
    const idsParam = searchParams.get("ids");

    const ids = idsParam
      ? idsParam
          .split(",")
          .map(value => Number(value.trim()))
          .filter(value => Number.isFinite(value))
      : [];

    let query = supabaseServer.from("invoices").select(INVOICE_SELECT).eq("user_id", userId).order("issued_on", { ascending: false });
    if (ids.length) {
      query = query.in("id", ids);
    }
    const { data: invoices, error } = await query;
    if (error) {
      console.error("GET /api/invoices/export query error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: company } = await supabaseServer
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    const invoiceRows: InvoiceRow[] = Array.isArray(invoices) ? (invoices as InvoiceRow[]) : [];
    const companyRow: CompanyProfileRow | null = (company as CompanyProfileRow) ?? null;

    if (format === "ledger") {
      const csv = buildCsv(buildLedgerRows(invoiceRows));
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="invoices-ledger.csv"`,
        },
      });
    }

    if (format === "lines") {
      const csv = buildCsv(buildLineRows(invoiceRows));
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="invoices-line-items.csv"`,
        },
      });
    }

    try {
      const pdfBuffer = await buildPdf(invoiceRows, companyRow);
      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="invoices-professional.pdf"`,
        },
      });
    } catch (pdfErr) {
      console.error("GET /api/invoices/export PDF generation failed, falling back to CSV", pdfErr);
      // Fallback to CSV if PDF generation fails
      const csv = buildCsv(buildLedgerRows(invoiceRows));
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="invoices-ledger.csv"`,
        },
      });
    }
  } catch (err) {
    console.error("GET /api/invoices/export exception", err);
    return NextResponse.json({ error: "Unable to export invoices" }, { status: 500 });
  }
}

export const runtime = "nodejs";
