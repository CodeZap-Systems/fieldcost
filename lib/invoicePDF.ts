/**
 * Invoice PDF Generator
 * Creates a formatted invoice PDF with proper layout
 */

interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

interface InvoicePDFData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  amount: number;
  currency: string;
  lineItems: InvoiceLineItem[];
  companyName?: string;
  notes?: string;
}

export function generateInvoicePDF(data: InvoicePDFData): string {
  // Create HTML invoice template
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${data.invoiceNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          color: #333;
          background: white;
          line-height: 1.4;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid #1e40af;
        }
        .company-info h1 {
          font-size: 22px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 3px;
        }
        .company-info p {
          font-size: 12px;
          color: #666;
        }
        .invoice-details {
          text-align: right;
        }
        .invoice-details h2 {
          font-size: 26px;
          color: #1e40af;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .invoice-details p {
          color: #666;
          font-size: 12px;
          margin: 2px 0;
        }
        .section-title {
          font-size: 11px;
          font-weight: 700;
          color: #333;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .bill-to {
          margin-bottom: 25px;
          font-size: 13px;
        }
        .bill-to p {
          margin: 2px 0;
        }
        table {
          width: 100%;
          margin: 25px 0;
          border-collapse: collapse;
        }
        thead tr {
          background: #1e40af;
          color: white;
        }
        th {
          padding: 10px 8px;
          text-align: left;
          font-weight: 700;
          font-size: 11px;
          border: none;
        }
        td {
          padding: 9px 8px;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        tbody tr:nth-child(even) {
          background: #f9fafb;
        }
        tbody tr:last-child td {
          border-bottom: 2px solid #1e40af;
        }
        .col-desc { width: 45%; text-align: left; }
        .col-qty { width: 8%; text-align: center; }
        .col-price { width: 15%; text-align: right; }
        .col-discount { width: 10%; text-align: right; }
        .col-tax { width: 10%; text-align: right; }
        .col-total { width: 12%; text-align: right; font-weight: 600; }
        .total-section {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        .total-table {
          width: 380px;
        }
        .total-table td {
          padding: 8px 10px;
          border: none;
          font-size: 12px;
        }
        .total-table .label {
          text-align: right;
          font-weight: 600;
          width: 60%;
        }
        .total-table .amount {
          text-align: right;
          width: 40%;
          font-weight: 600;
        }
        .grand-total-row td {
          background: #f0f4ff !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          color: #1e40af !important;
        }
        .notes {
          margin-top: 30px;
          padding: 12px;
          background: #f9fafb;
          border-left: 4px solid #1e40af;
          font-size: 12px;
        }
        .notes h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          color: #333;
        }
        .notes p {
          color: #666;
        }
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 11px;
          color: #999;
        }
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .container { padding: 20px; max-width: 100%; }
          .footer { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="company-info">
            <h1>${data.companyName || 'Company Name'}</h1>
            <p>Professional Services</p>
          </div>
          <div class="invoice-details">
            <h2>INVOICE</h2>
            <p><strong>${data.invoiceNumber}</strong></p>
            <p>Date: ${data.date}</p>
            <p>Due: ${data.dueDate}</p>
          </div>
        </div>

        <!-- Bill To -->
        <div class="bill-to">
          <p class="section-title">Bill To:</p>
          <p><strong>${data.customerName}</strong></p>
        </div>

        <!-- Line Items Table -->
        <table>
          <thead>
            <tr>
              <th class="col-desc">Description</th>
              <th class="col-qty">Qty</th>
              <th class="col-price">Unit Price</th>
              <th class="col-discount">Discount %</th>
              <th class="col-tax">Tax %</th>
              <th class="col-total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.lineItems
              .map(
                (item) => `
              <tr>
                <td class="col-desc">${item.description}</td>
                <td class="col-qty">${item.quantity}</td>
                <td class="col-price">${data.currency}${item.rate.toFixed(2)}</td>
                <td class="col-discount">0%</td>
                <td class="col-tax">0%</td>
                <td class="col-total">${data.currency}${item.total.toFixed(2)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <!-- Totals -->
        <div class="total-section">
          <table class="total-table">
            <tr>
              <td class="label">Subtotal:</td>
              <td class="amount">${data.currency}${data.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label">Discount:</td>
              <td class="amount">${data.currency}0.00</td>
            </tr>
            <tr>
              <td class="label">Tax:</td>
              <td class="amount">${data.currency}0.00</td>
            </tr>
            <tr class="grand-total-row">
              <td class="label">Total Due:</td>
              <td class="amount">${data.currency}${data.amount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${
          data.notes
            ? `
        <!-- Notes -->
        <div class="notes">
          <h3>Notes</h3>
          <p>${data.notes}</p>
        </div>
        `
            : ""
        }

        <!-- Footer -->
        <div class="footer">
          <p>Thank you for your business</p>
          <p>Invoice generated on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

/**
 * Convert HTML to PDF using browser's print functionality
 * This creates a properly formatted, printable invoice
 */
export function downloadInvoicePDF(data: InvoicePDFData) {
  const htmlContent = generateInvoicePDF(data);
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const window_print = window.open(url, "_blank");
  
  if (window_print) {
    window_print.addEventListener("load", () => {
      window_print.print();
    });
  }
}

/**
 * Export invoice as PDF file directly (client-side)
 */
export function exportInvoiceAsPDF(data: InvoicePDFData) {
  const htmlContent = generateInvoicePDF(data);
  const dataUri = `data:text/html,${encodeURIComponent(htmlContent)}`;
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = `Invoice-${data.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

