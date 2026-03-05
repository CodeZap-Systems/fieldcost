import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseServer } from "../../../../lib/supabaseServer";
import { supabase } from "../../../../lib/supabaseClient";
import { resolveServerUserId } from "../../../../lib/serverUser";

const INVOICE_SELECT = "*, customer:customers(id, name, email, user_id), line_items:invoice_line_items(*)";
const TEMPLATE_OPTIONS = new Set(["standard", "detailed"]);

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

const numberFormatter = (currency = "ZAR") => new Intl.NumberFormat("en-ZA", { style: "currency", currency });

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

async function buildPdf(invoices: InvoiceRow[], company: CompanyProfileRow | null, template: "standard" | "detailed") {
  const pdf = await PDFDocument.create();
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const formatter = numberFormatter(company?.default_currency || "ZAR");

  for (const inv of invoices) {
    const page = pdf.addPage([595, 842]);
    let y = 790;

    const drawLine = (text: string, options?: { size?: number; bold?: boolean; color?: [number, number, number] }) => {
      const size = options?.size ?? 10;
      const color = options?.color ?? [0, 0, 0];
      page.drawText(text, {
        x: 50,
        y,
        size,
        font: options?.bold ? fontBold : fontRegular,
        color: rgb(color[0], color[1], color[2]),
      });
      y -= size + 6;
    };

    drawLine(company?.name || "FieldCost", { size: 18, bold: true });
    if (company?.email) drawLine(company.email, { color: [0.35, 0.35, 0.35] });
    if (company?.phone) drawLine(company.phone, { color: [0.35, 0.35, 0.35] });
    if (company?.address_line1) drawLine(company.address_line1, { color: [0.35, 0.35, 0.35] });
    if (company?.address_line2) drawLine(company.address_line2, { color: [0.35, 0.35, 0.35] });

    y -= 8;
    drawLine(`Invoice #: ${inv.invoice_number || `#${inv.id}`}`, { size: 12, bold: true });
    drawLine(`Issued: ${formatDate(inv.issued_on)}`);
    drawLine(`Due: ${formatDate(inv.due_on)}`);
    drawLine(`Reference: ${inv.reference || ""}`);

    y -= 8;
    drawLine("Bill To:", { size: 11, bold: true });
    drawLine(inv.customer?.name || "");
    if (inv.customer?.email) drawLine(inv.customer.email);

    y -= 8;
    drawLine("Line items:", { size: 11, bold: true });

    for (const line of inv.line_items || []) {
      const rate = line.rate ?? 0;
      const quantity = line.quantity ?? 0;
      const total = line.total ?? rate * quantity;
      drawLine(`${line.name ?? "Line item"} - ${quantity} x ${formatter.format(rate)} = ${formatter.format(total)}`);
      if (line.project) drawLine(`Project: ${line.project}`, { size: 9, color: [0.35, 0.35, 0.35] });
      if (line.note && template === "detailed") drawLine(`Note: ${line.note}`, { size: 9, color: [0.35, 0.35, 0.35] });
      y -= 2;
      if (y < 80) break;
    }

    y -= 8;
    drawLine(`Total: ${formatter.format(inv.amount ?? 0)}`, { size: 14, bold: true });
    if (template === "detailed" && inv.description) {
      drawLine(inv.description, { size: 10 });
    }
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

export async function GET(req: Request) {
  try {
    const userId = await resolveUserId(req);
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "ledger").toLowerCase();
    const idsParam = searchParams.get("ids");
    const template = TEMPLATE_OPTIONS.has((searchParams.get("template") || "standard").toLowerCase())
      ? (searchParams.get("template") as "standard" | "detailed")
      : "standard";

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

    const pdfBuffer = await buildPdf(invoiceRows, companyRow, template);
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoices-${template}.pdf"`,
      },
    });
  } catch (err) {
    console.error("GET /api/invoices/export exception", err);
    return NextResponse.json({ error: "Unable to export invoices" }, { status: 500 });
  }
}

export const runtime = "nodejs";
