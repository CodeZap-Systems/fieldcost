import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');

    if (!id || !company_id) {
      return new Response(JSON.stringify({ error: 'Missing quote ID or company_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch quote with line items
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select(
        `
        *,
        quote_line_items (
          id,
          name,
          quantity,
          unit,
          rate,
          created_at
        )
      `
      )
      .eq('id', id)
      .eq('company_id', company_id)
      .single();

    if (quoteError || !quote) {
      return new Response(JSON.stringify({ error: 'Quote not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch customer details
    const { data: customer } = await supabase
      .from('customers')
      .select('name, email, phone, address')
      .eq('id', quote.customer_id)
      .single();

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(30, 60, 120);
    pdf.text('QUOTATION', 20, yPosition);
    yPosition += 15;

    // Quote info
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Reference: ${quote.reference || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Valid Until: ${quote.valid_until}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Status: ${quote.status.toUpperCase()}`, 20, yPosition);
    yPosition += 12;

    // Customer info section
    pdf.setFontSize(11);
    pdf.setTextColor(30, 60, 120);
    pdf.text('BILL TO:', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    if (customer) {
      pdf.text(`${customer.name}`, 20, yPosition);
      yPosition += 5;
      if (customer.email) {
        pdf.text(`Email: ${customer.email}`, 20, yPosition);
        yPosition += 5;
      }
      if (customer.phone) {
        pdf.text(`Phone: ${customer.phone}`, 20, yPosition);
        yPosition += 5;
      }
      if (customer.address) {
        pdf.text(`Address: ${customer.address}`, 20, yPosition);
        yPosition += 5;
      }
    }
    yPosition += 5;

    // Description
    if (quote.description) {
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const splitDescription = pdf.splitTextToSize(quote.description, 170);
      pdf.text(splitDescription, 20, yPosition);
      yPosition += splitDescription.length * 5 + 5;
    }

    // Line items table
    if (quote.quote_line_items && quote.quote_line_items.length > 0) {
      const tableData = quote.quote_line_items.map((item) => [
        item.name,
        item.quantity.toString(),
        item.unit,
        `R${item.rate.toFixed(2)}`,
        `R${(item.quantity * item.rate).toFixed(2)}`,
      ]);

      // Add total row
      const total = quote.quote_line_items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
      tableData.push(['', '', '', 'TOTAL:', `R${total.toFixed(2)}`]);

      (pdf as any).autoTable({
        head: [['Description', 'Qty', 'Unit', 'Rate', 'Amount']],
        body: tableData,
        startY: yPosition,
        headStyles: {
          fillColor: [30, 60, 120],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 9,
        },
        footStyles: {
          fontStyle: 'bold',
          fontSize: 10,
        },
        margin: 20,
      });

      yPosition = (pdf as any).lastAutoTable.finalY + 10;
    }

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'This quotation is valid for 30 days. Terms and conditions apply.',
      20,
      pageHeight - 20
    );

    // Generate filename
    const filename = `Quote-${quote.reference || quote.id}-${new Date().getTime()}.pdf`;

    // Return PDF as blob
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
