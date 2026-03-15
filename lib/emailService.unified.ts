/**
 * Unified Email Service (Consolidated v1 & v2)
 * Handles transactional emails with optional encrypted PDF attachments
 * Supports quotes, purchase orders, and invoices
 */

import nodemailer from 'nodemailer';

// Configuration
const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || '';
const SMTP_FROM = process.env.SMTP_FROM || process.env.EMAIL_FROM || 'noreply@fieldcost.com';
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

let transporter: nodemailer.Transporter | null = null;

/**
 * Get or create email transporter
 */
function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn('Email service not fully configured - SMTP credentials missing');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE || SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
    return transporter;
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    return null;
  }
}

/**
 * Email attachment interface
 */
export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

/**
 * Send email options
 */
export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

/**
 * Email result
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send generic email with attachments
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const transport = getTransporter();
    if (!transport) {
      console.warn('Email service not configured - email skipped');
      return { success: true }; // Gracefully degrade instead of failing
    }

    const mailOptions = {
      from: SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      replyTo: options.replyTo,
      attachments: options.attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType || 'application/pdf',
      })),
    };

    const info = await transport.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send quote email
 * @param customerEmail - Recipient email
 * @param customerName - Recipient name
 * @param quoteReference - Quote number/reference
 * @param quoteAmount - Quote amount (optional, for basic emails)
 * @param quoteValidUntil - Validity expiration date
 * @param companyName - Sender company name
 * @param pdfBuffer - Optional encrypted PDF content
 * @param encryptionPassword - Optional encryption password
 */
export async function sendQuoteEmail(
  customerEmail: string,
  customerName: string,
  quoteReference: string,
  quoteValidUntil: string,
  companyName: string = 'FieldCost Team',
  pdfBuffer?: Buffer,
  encryptionPassword?: string,
  quoteAmount?: number
): Promise<EmailResult> {
  try {
    const hasAttachment = !!pdfBuffer;
    
    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your Quotation is Ready</h2>
          <p>Hi ${customerName},</p>
          <p>We're pleased to provide you with the following quotation:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Quote Reference:</strong> ${quoteReference}</p>
            ${quoteAmount ? `<p><strong>Quote Amount:</strong> R${quoteAmount.toFixed(2)}</p>` : ''}
            <p><strong>Valid Until:</strong> ${new Date(quoteValidUntil).toLocaleDateString('en-ZA')}</p>
          </div>
    `;

    if (hasAttachment && encryptionPassword) {
      html += `
          <p><strong>Security Note:</strong> This quote is password protected.</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${encryptionPassword}</code></p>
            <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">Please keep this password secure and do not share it in email.</p>
          </div>
      `;
    } else if (!hasAttachment) {
      html += `
          <p>Please review the quotation details or log into your account to view full details.</p>
      `;
    }

    html += `
          <p>If you have any questions or would like to discuss this quote, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br/>${companyName}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    const attachments = pdfBuffer
      ? [{ filename: `Quote-${quoteReference}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
      : undefined;

    return sendEmail({
      to: customerEmail,
      subject: hasAttachment ? `Quote ${quoteReference} - Password Protected` : `Quotation ${quoteReference} - Ready for Review`,
      html,
      attachments,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send quote email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send purchase order email to supplier
 * @param supplierEmail - Recipient email
 * @param supplierName - Recipient name
 * @param poReference - PO number/reference
 * @param poAmount - PO amount (optional)
 * @param companyName - Sender company name
 * @param pdfBuffer - Optional encrypted PDF content
 * @param encryptionPassword - Optional encryption password
 */
export async function sendPOEmail(
  supplierEmail: string,
  supplierName: string,
  poReference: string,
  companyName: string = 'FieldCost Team',
  pdfBuffer?: Buffer,
  encryptionPassword?: string,
  poAmount?: number
): Promise<EmailResult> {
  try {
    const hasAttachment = !!pdfBuffer;

    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Purchase Order Issued</h2>
          <p>Hi ${supplierName},</p>
          <p>A new purchase order has been issued and is ready for processing:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>PO Reference:</strong> ${poReference}</p>
            ${poAmount ? `<p><strong>PO Amount:</strong> R${poAmount.toFixed(2)}</p>` : ''}
            <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
          </div>
    `;

    if (hasAttachment && encryptionPassword) {
      html += `
          <p><strong>Security Note:</strong> This purchase order is password protected.</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${encryptionPassword}</code></p>
            <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">Please keep this password secure and do not share it in email.</p>
          </div>
      `;
    } else if (!hasAttachment) {
      html += `
          <p>Please review the purchase order details in your account portal.</p>
      `;
    }

    html += `
          <p>Please confirm receipt of this purchase order and advise on delivery timeline.</p>
          <p>If you have any questions, please contact us.</p>
          
          <p>Best regards,<br/>${companyName}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    const attachments = pdfBuffer
      ? [{ filename: `PO-${poReference}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
      : undefined;

    return sendEmail({
      to: supplierEmail,
      subject: hasAttachment ? `Purchase Order ${poReference} - Password Protected` : `Purchase Order ${poReference}`,
      html,
      attachments,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send PO email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send invoice email
 * @param customerEmail - Recipient email
 * @param customerName - Recipient name
 * @param invoiceNumber - Invoice number/reference
 * @param companyName - Sender company name
 * @param pdfBuffer - Optional encrypted PDF content
 * @param encryptionPassword - Optional encryption password
 * @param invoiceAmount - Optional invoice amount
 */
export async function sendInvoiceEmail(
  customerEmail: string,
  customerName: string,
  invoiceNumber: string,
  companyName: string = 'FieldCost Team',
  pdfBuffer?: Buffer,
  encryptionPassword?: string,
  invoiceAmount?: number
): Promise<EmailResult> {
  try {
    const hasAttachment = !!pdfBuffer;

    let html = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Invoice Issued</h2>
          <p>Hi ${customerName},</p>
          <p>Your invoice is ready for payment:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            ${invoiceAmount ? `<p><strong>Invoice Amount:</strong> R${invoiceAmount.toFixed(2)}</p>` : ''}
            <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString('en-ZA')}</p>
          </div>
    `;

    if (hasAttachment && encryptionPassword) {
      html += `
          <p><strong>Security Note:</strong> This invoice is password protected.</p>
          <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px; font-family: monospace;">${encryptionPassword}</code></p>
            <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
            <p style="font-size: 12px; color: #666; margin-bottom: 0;">Please keep this password secure and do not share it in email.</p>
          </div>
      `;
    } else if (!hasAttachment) {
      html += `
          <p>Please review the invoice details in your account portal.</p>
      `;
    }

    html += `
          <p>Thank you for your business. If you have any questions, please contact us.</p>
          
          <p>Best regards,<br/>${companyName}</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            This is an automated message. Please do not reply to this email.
          </p>
        </body>
      </html>
    `;

    const attachments = pdfBuffer
      ? [{ filename: `Invoice-${invoiceNumber}.pdf`, content: pdfBuffer, contentType: 'application/pdf' }]
      : undefined;

    return sendEmail({
      to: customerEmail,
      subject: hasAttachment ? `Invoice ${invoiceNumber} - Password Protected` : `Invoice ${invoiceNumber}`,
      html,
      attachments,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send invoice email:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export default {
  sendEmail,
  sendQuoteEmail,
  sendPOEmail,
  sendInvoiceEmail,
};
