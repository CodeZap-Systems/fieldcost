/**
 * Professional Invoice PDF Generator
 * Generates high-quality, separately formatted invoices
 */

import { PDFDocument, PDFPage, StandardFonts, rgb } from 'pdf-lib';

export interface InvoiceData {
  id: number;
  invoiceNumber: string;
  issuedOn: string;
  dueOn?: string;
  reference?: string;
  description?: string;
  amount: number;
  currency?: string;
  customer?: {
    id: number;
    name: string;
    email?: string;
  };
  lineItems?: Array<{
    id?: number;
    name?: string;
    quantity?: number;
    rate?: number;
    total?: number;
    project?: string;
    note?: string;
  }>;
}

export interface CompanyProfile {
  name: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  logo?: string; // Base64 or URL
  currency?: string;
  taxId?: string;
  bankDetails?: string;
}

const DEFAULT_COMPANY: CompanyProfile = {
  name: 'FieldCost',
  currency: 'ZAR',
};

const COLORS = {
  primary: [51, 102, 153], // Blue
  secondary: [102, 102, 102], // Gray
  accent: [204, 0, 0], // Red
  border: [200, 200, 200], // Light gray
  text: [0, 0, 0], // Black
  lightText: [100, 100, 100], // Dark gray
};

const MEASUREMENTS = {
  pageWidth: 595, // A4 width in points
  pageHeight: 842, // A4 height in points
  marginTop: 40,
  marginBottom: 40,
  marginLeft: 40,
  marginRight: 40,
  contentWidth: 515, // 595 - 40 - 40
  lineHeight: 14,
};

/**
 * Create a professional multi-page PDF with separate invoices
 */
export async function generateInvoicesPdf(
  invoices: InvoiceData[],
  company: CompanyProfile = DEFAULT_COMPANY
): Promise<Buffer> {
  const pdf = await PDFDocument.create();
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Fetch and embed logo if provided
  let logoImage: any = null;
  if (company.logo) {
    try {
      const logoResponse = await fetch(company.logo);
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoBytes = new Uint8Array(logoBuffer);
        
        // Determine image type from content-type or URL
        const contentType = logoResponse.headers.get('content-type') || '';
        if (contentType.includes('png') || company.logo.toLowerCase().endsWith('.png')) {
          logoImage = await pdf.embedPng(logoBytes);
        } else if (contentType.includes('jpeg') || contentType.includes('jpg') || company.logo.toLowerCase().endsWith('.jpg') || company.logo.toLowerCase().endsWith('.jpeg')) {
          logoImage = await pdf.embedJpg(logoBytes);
        }
      }
    } catch (err) {
      console.warn('Failed to load logo:', company.logo, err);
      // Continue without logo if fetch fails
    }
  }

  // Create a separate page for each invoice
  for (const invoice of invoices) {
    const page = pdf.addPage([MEASUREMENTS.pageWidth, MEASUREMENTS.pageHeight]);
    await renderInvoicePage(page, invoice, company, fontRegular, fontBold, logoImage);
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}

/**
 * Render a single invoice page
 */
async function renderInvoicePage(
  page: PDFPage,
  invoice: InvoiceData,
  company: CompanyProfile,
  fontRegular: any,
  fontBold: any,
  logoImage?: any
): Promise<void> {
  const { pageWidth, pageHeight, marginTop, marginLeft, marginRight, contentWidth } = MEASUREMENTS;
  let yPosition = pageHeight - marginTop;

  const drawText = (
    text: string,
    options?: {
      fontSize?: number;
      bold?: boolean;
      color?: number[];
      yOffset?: number;
      align?: 'left' | 'center' | 'right';
    }
  ) => {
    const font = options?.bold ? fontBold : fontRegular;
    const color = options?.color || COLORS.text;
    const fontSize = options?.fontSize || 10;
    const textColor = rgb(color[0] / 255, color[1] / 255, color[2] / 255);

    let xPos = marginLeft;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    if (options?.align === 'center') {
      xPos = (pageWidth - textWidth) / 2;
    } else if (options?.align === 'right') {
      xPos = pageWidth - marginRight - textWidth;
    }

    page.drawText(text, {
      x: xPos,
      y: yPosition - (options?.yOffset || 0),
      size: fontSize,
      font,
      color: textColor,
    });

    yPosition -= fontSize + 4;
  };

  const drawLine = (thickness = 1, color = COLORS.border) => {
    const lineColor = rgb(color[0] / 255, color[1] / 255, color[2] / 255);
    page.drawLine({
      start: { x: marginLeft, y: yPosition },
      end: { x: pageWidth - marginRight, y: yPosition },
      thickness,
      color: lineColor,
    });
    yPosition -= thickness + 8;
  };

  // Header Section
  // Draw logo if available
  if (logoImage) {
    const logoWidth = 60;
    const logoHeight = logoImage.height > 0 ? (logoImage.width > 0 ? (logoWidth * logoImage.height) / logoImage.width : logoWidth) : logoWidth;
    page.drawImage(logoImage, {
      x: marginLeft,
      y: yPosition - logoHeight,
      width: logoWidth,
      height: Math.min(logoHeight, 60), // Cap height at 60 points
    });
    yPosition -= Math.min(logoHeight, 60) + 8;
  }

  drawText(company.name, { fontSize: 24, bold: true, color: COLORS.primary });
  yPosition -= 4;

  if (company.email) drawText(company.email, { fontSize: 9, color: COLORS.lightText });
  if (company.phone) drawText(company.phone, { fontSize: 9, color: COLORS.lightText });
  if (company.address1) drawText(company.address1, { fontSize: 9, color: COLORS.lightText });
  if (company.address2) drawText(company.address2, { fontSize: 9, color: COLORS.lightText });

  yPosition -= 12;
  drawLine(2, COLORS.primary);

  // Invoice Title and Meta
  page.drawText('INVOICE', {
    x: marginLeft,
    y: yPosition,
    size: 16,
    font: fontBold,
    color: rgb(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255),
  });

  const metaX = pageWidth - marginRight - 150;
  const metaLineHeight = 12;
  let metaY = yPosition;

  const drawMeta = (label: string, value: string) => {
    page.drawText(label, {
      x: metaX,
      y: metaY,
      size: 9,
      font: fontBold,
      color: rgb(COLORS.secondary[0] / 255, COLORS.secondary[1] / 255, COLORS.secondary[2] / 255),
    });

    page.drawText(value, {
      x: metaX + 70,
      y: metaY,
      size: 10,
      font: fontBold,
      color: rgb(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255),
    });

    metaY -= metaLineHeight;
  };

  drawMeta('Invoice #:', invoice.invoiceNumber || `#${invoice.id}`);
  drawMeta('Issued:', invoice.issuedOn || new Date().toISOString().split('T')[0]);
  if (invoice.dueOn) drawMeta('Due:', invoice.dueOn);

  yPosition -= 50;
  drawLine();

  // Bill To Section
  drawText('BILL TO', { fontSize: 11, bold: true, color: COLORS.primary });
  if (invoice.customer?.name) {
    drawText(invoice.customer.name, { fontSize: 11, bold: true });
  }
  if (invoice.customer?.email) {
    drawText(invoice.customer.email, { fontSize: 9, color: COLORS.lightText });
  }
  if (invoice.reference) {
    yPosition -= 4;
    drawText(`Reference: ${invoice.reference}`, { fontSize: 9, color: COLORS.lightText });
  }

  yPosition -= 8;
  drawLine();

  // Line Items Table Header
  const colWidths = { desc: 250, qty: 60, rate: 80, total: 85 };
  const tableStartY = yPosition;
  const tableHeaderY = yPosition;

  page.drawText('Description', {
    x: marginLeft,
    y: tableHeaderY,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Qty', {
    x: marginLeft + colWidths.desc,
    y: tableHeaderY,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Rate', {
    x: marginLeft + colWidths.desc + colWidths.qty,
    y: tableHeaderY,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('Total', {
    x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
    y: tableHeaderY,
    size: 10,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  yPosition -= 16;
  drawLine(1, COLORS.primary);

  // Line Items
  const formatter = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: company.currency || 'ZAR',
  });

  for (const item of invoice.lineItems || []) {
    const qty = item.quantity || 0;
    const rate = item.rate || 0;
    const total = item.total || qty * rate;

    page.drawText(item.name || 'Line Item', {
      x: marginLeft,
      y: yPosition,
      size: 9,
      font: fontRegular,
      color: rgb(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255),
    });

    page.drawText(String(qty), {
      x: marginLeft + colWidths.desc,
      y: yPosition,
      size: 9,
      font: fontRegular,
      color: rgb(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255),
    });

    page.drawText(formatter.format(rate), {
      x: marginLeft + colWidths.desc + colWidths.qty,
      y: yPosition,
      size: 9,
      font: fontRegular,
      color: rgb(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255),
    });

    page.drawText(formatter.format(total), {
      x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
      y: yPosition,
      size: 9,
      font: fontBold,
      color: rgb(COLORS.text[0] / 255, COLORS.text[1] / 255, COLORS.text[2] / 255),
    });

    yPosition -= 14;

    // Item details if available
    if (item.project) {
      page.drawText(`Project: ${item.project}`, {
        x: marginLeft + 10,
        y: yPosition,
        size: 8,
        font: fontRegular,
        color: rgb(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255),
      });
      yPosition -= 10;
    }

    if (item.note) {
      page.drawText(`Note: ${item.note}`, {
        x: marginLeft + 10,
        y: yPosition,
        size: 8,
        font: fontRegular,
        color: rgb(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255),
      });
      yPosition -= 10;
    }
  }

  yPosition -= 4;
  drawLine(1, COLORS.primary);

  // Totals Section
  const totalLabelX = marginLeft + colWidths.desc + colWidths.qty + colWidths.rate - 30;

  page.drawText('TOTAL:', {
    x: totalLabelX,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: rgb(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255),
  });

  page.drawText(formatter.format(invoice.amount || 0), {
    x: marginLeft + colWidths.desc + colWidths.qty + colWidths.rate,
    y: yPosition,
    size: 14,
    font: fontBold,
    color: rgb(COLORS.primary[0] / 255, COLORS.primary[1] / 255, COLORS.primary[2] / 255),
  });

  yPosition -= 28;

  // Footer Notes
  if (invoice.description) {
    drawLine(1, COLORS.border);
    drawText(invoice.description, { fontSize: 9, color: COLORS.lightText });
  }

  // Footer
  yPosition = MEASUREMENTS.marginBottom + 20;
  drawLine(1, COLORS.border);

  const footerText = `Generated by FieldCost • ${new Date().toLocaleDateString()} • Thank you for your business!`;
  page.drawText(footerText, {
    x: marginLeft,
    y: yPosition,
    size: 8,
    font: fontRegular,
    color: rgb(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255),
  });

  if (company.bankDetails) {
    page.drawText(company.bankDetails, {
      x: marginLeft,
      y: yPosition - 10,
      size: 7,
      font: fontRegular,
      color: rgb(COLORS.lightText[0] / 255, COLORS.lightText[1] / 255, COLORS.lightText[2] / 255),
    });
  }
}
