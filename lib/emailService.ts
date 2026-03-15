/**
 * Email Service
 * Handles sending transactional emails for quotes and purchase orders
 */

import nodemailer from 'nodemailer';

// Configure email service
// Using environment variables for configuration
const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@fieldcost.com';

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 * Supports SMTP configuration via environment variables
 */
function getTransporter() {
  if (!transporter && EMAIL_HOST && EMAIL_USER && EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

/**
 * Send quote email to customer
 */
export async function sendQuoteEmail(
  customerEmail: string,
  customerName: string,
  quoteReference: string,
  quoteAmount: number,
  quoteValidUntil: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      console.warn('Email service not configured - quote email skipped');
      return { success: true }; // Don't fail if email not configured
    }

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your Quotation is Ready</h2>
          <p>Hi ${customerName},</p>
          <p>We're pleased to provide you with the following quotation:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Quote Reference:</strong> ${quoteReference}</p>
            <p><strong>Quote Amount:</strong> R${quoteAmount.toFixed(2)}</p>
            <p><strong>Valid Until:</strong> ${new Date(quoteValidUntil).toLocaleDateString('en-ZA')}</p>
          </div>
          
          <p>Please review the attached quotation document or log into your account to view full details.</p>
          
          <p>If you have any questions or would like to discuss this quote, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br/>
          ${companyName || 'FieldCost Team'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: customerEmail,
      subject: `Quotation ${quoteReference} - Ready for Review`,
      html: emailBody,
    });

    console.log(`Quote email sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send quote email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send purchase order email to supplier
 */
export async function sendPOEmail(
  supplierEmail: string,
  supplierName: string,
  poReference: string,
  poAmount: number,
  requiredByDate: string,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      console.warn('Email service not configured - PO email skipped');
      return { success: true }; // Don't fail if email not configured
    }

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Purchase Order Received</h2>
          <p>Hi ${supplierName},</p>
          <p>We have sent you a purchase order for processing:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>PO Reference:</strong> ${poReference}</p>
            <p><strong>Order Amount:</strong> R${poAmount.toFixed(2)}</p>
            <p><strong>Required By:</strong> ${new Date(requiredByDate).toLocaleDateString('en-ZA')}</p>
          </div>
          
          <p>Please find the complete purchase order details in the attached document or log into your account to view and confirm receipt.</p>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Please review the order details carefully</li>
            <li>Confirm receipt by the deadline</li>
            <li>Contact us if you have any questions</li>
          </ul>
          
          <p>Thank you for your business.<br/>
          ${companyName || 'FieldCost Team'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: supplierEmail,
      subject: `Purchase Order ${poReference} - Action Required`,
      html: emailBody,
    });

    console.log(`PO email sent to ${supplierEmail}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send PO email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send GRN receipt confirmation email
 */
export async function sendGRNConfirmationEmail(
  supplierEmail: string,
  supplierName: string,
  poReference: string,
  grnQuantity: number,
  companyName?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getTransporter();
    if (!mailer) {
      console.warn('Email service not configured - GRN email skipped');
      return { success: true };
    }

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Goods Receipt Confirmed</h2>
          <p>Hi ${supplierName},</p>
          <p>We have received and logged the goods for the following purchase order:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>PO Reference:</strong> ${poReference}</p>
            <p><strong>Quantity Received:</strong> ${grnQuantity} units</p>
            <p><strong>Date Received:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
          </div>
          
          <p>Thank you for your prompt delivery. For any inquiries regarding this receipt, please contact us.</p>
          
          <p>Best regards,<br/>
          ${companyName || 'FieldCost Team'}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    await mailer.sendMail({
      from: EMAIL_FROM,
      to: supplierEmail,
      subject: `Goods Receipt Confirmation - PO ${poReference}`,
      html: emailBody,
    });

    console.log(`GRN confirmation email sent to ${supplierEmail}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send GRN email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
