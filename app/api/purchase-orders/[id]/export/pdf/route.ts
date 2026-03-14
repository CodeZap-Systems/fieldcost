import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');

    if (!id || !company_id) {
      return new Response(JSON.stringify({ error: 'Missing PO ID or company_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch PO with line items
    const { data: po, error: poError } = await supabase
      .from('purchase_orders')
      .select(
        `
        *,
        purchase_order_line_items (
          id,
          name,
          quantity_ordered,
          quantity_received,
          unit,
          unit_rate,
          created_at
        )
      `
      )
      .eq('id', id)
      .eq('company_id', company_id)
      .single();

    if (poError || !po) {
      return new Response(JSON.stringify({ error: 'Purchase Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch supplier details
    const { data: supplier } = await supabase
      .from('suppliers')
      .select('vendor_name, contact_name, email, phone, address_line1, address_line2, city, province, postal_code, country, payment_terms')
      .eq('id', po.supplier_id)
      .single();

    // Generate PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(30, 60, 120);
    pdf.text('PURCHASE ORDER', 20, yPosition);
    yPosition += 15;

    // PO info
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`PO Number: ${po.reference || 'N/A'}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Date: ${new Date(po.created_at).toLocaleDateString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Status: ${po.status.replace(/_/g, ' ').toUpperCase()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Required by: ${po.required_by_date || 'N/A'}`, 20, yPosition);
    yPosition += 12;

    // Supplier info section
    pdf.setFontSize(11);
    pdf.setTextColor(30, 60, 120);
    pdf.text('SHIP TO / SUPPLIER:', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    if (supplier) {
      pdf.text(`${supplier.vendor_name}`, 20, yPosition);
      yPosition += 5;
      if (supplier.contact_name) {
        pdf.text(`Contact: ${supplier.contact_name}`, 20, yPosition);
        yPosition += 5;
      }
      if (supplier.email) {
        pdf.text(`Email: ${supplier.email}`, 20, yPosition);
        yPosition += 5;
      }
      if (supplier.phone) {
        pdf.text(`Phone: ${supplier.phone}`, 20, yPosition);
        yPosition += 5;
      }
      const addressParts = [supplier.address_line1, supplier.address_line2].filter(Boolean).join(', ');
      if (addressParts) {
        pdf.text(`Address: ${addressParts}`, 20, yPosition);
        yPosition += 5;
      }
      if (supplier.city) {
        pdf.text(`${supplier.city}, ${supplier.province} ${supplier.postal_code}`, 20, yPosition);
        yPosition += 5;
      }
      if (supplier.payment_terms) {
        pdf.text(`Payment Terms: ${supplier.payment_terms}`, 20, yPosition);
        yPosition += 5;
      }
    }
    yPosition += 5;

    // Description
    if (po.description) {
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const splitDescription = pdf.splitTextToSize(po.description, 170);
      pdf.text(splitDescription, 20, yPosition);
      yPosition += splitDescription.length * 5 + 5;
    }

    // Line items table
    if (po.purchase_order_line_items && po.purchase_order_line_items.length > 0) {
      const tableData = po.purchase_order_line_items.map((item) => [
        item.name,
        item.quantity_ordered.toString(),
        `${item.quantity_received || 0}/${item.quantity_ordered}`,
        item.unit,
        `R${item.unit_rate.toFixed(2)}`,
        `R${(item.quantity_ordered * item.unit_rate).toFixed(2)}`,
      ]);

      // Add total row
      const total = po.purchase_order_line_items.reduce(
        (sum, item) => sum + item.quantity_ordered * item.unit_rate,
        0
      );
      tableData.push(['', '', '', '', 'TOTAL:', `R${total.toFixed(2)}`]);

      pdf.autoTable({
        head: [['Description', 'Qty', 'Received', 'Unit', 'Rate', 'Amount']],
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

      yPosition = pdf.lastAutoTable.finalY + 10;
    }

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      'Please confirm receipt of this purchase order. Deliver by the required date.',
      20,
      pageHeight - 20
    );

    // Generate filename
    const filename = `PO-${po.reference || po.id}-${new Date().getTime()}.pdf`;

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
