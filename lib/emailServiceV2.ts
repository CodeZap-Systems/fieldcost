/**
 * Email Service with Encrypted PDF Support
 * Send documents via email with optional encryption
 */

import nodemailer from 'nodemailer';

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

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

export interface EmailTemplate {
  invoiceWithEncryption: (
    customerName: string,
    invoiceNumber: string,
    encryptionPassword: string
  ) => { subject: string; html: string };
  quoteWithEncryption: (
    customerName: string,
    quoteReference: string,
    encryptionPassword: string
  ) => { subject: string; html: string };
  poWithEncryption: (
    supplierName: string,
    poReference: string,
    encryptionPassword: string
  ) => { subject: string; html: string };
}

// Email templates
const templates: EmailTemplate = {
  invoiceWithEncryption: (customerName, invoiceNumber, encryptionPassword) => ({
    subject: `Invoice ${invoiceNumber} - Password Protected`,
    html: `
      <h2>Hello ${customerName},</h2>
      <p>Your invoice has been sent with password protection for security.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px;">${encryptionPassword}</code></p>
        <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
      </div>
      
      <p>Please keep this password secure. Do not share it in email.</p>
      <p>If you have any questions, please contact us.</p>
      <p>Thank you!</p>
    `,
  }),

  quoteWithEncryption: (customerName, quoteReference, encryptionPassword) => ({
    subject: `Quote ${quoteReference} - Password Protected`,
    html: `
      <h2>Hello ${customerName},</h2>
      <p>Your quotation has been sent with password protection for security.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Quote Reference:</strong> ${quoteReference}</p>
        <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px;">${encryptionPassword}</code></p>
        <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
      </div>
      
      <p>Please review the quotation and let us know if you have any questions.</p>
      <p>Keep this password secure. Do not share it in email.</p>
      <p>Thank you!</p>
    `,
  }),

  poWithEncryption: (supplierName, poReference, encryptionPassword) => ({
    subject: `Purchase Order ${poReference} - Password Protected`,
    html: `
      <h2>Hello ${supplierName},</h2>
      <p>Your purchase order has been sent with password protection for security.</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>PO Reference:</strong> ${poReference}</p>
        <p><strong>PDF Password:</strong> <code style="background: #fff; padding: 5px 10px; border-radius: 3px;">${encryptionPassword}</code></p>
        <p style="font-size: 12px; color: #666;">This password is required to open the attached PDF.</p>
      </div>
      
      <p>Please confirm receipt of this purchase order.</p>
      <p>Keep this password secure. Do not share it in email.</p>
      <p>Thank you!</p>
    `,
  }),
};

let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize email transporter
 */
function initializeTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  transporter = nodemailer.createTransport(smtpConfig);
  return transporter;
}

/**
 * Send email with attachments
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email sending disabled - SMTP credentials not configured');
      return { success: false, error: 'Email service not configured' };
    }

    const transport = initializeTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
    console.error('Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send invoice with encrypted PDF
 */
export async function sendInvoiceEmail(
  customerEmail: string,
  customerName: string,
  invoiceNumber: string,
  pdfBuffer: Buffer,
  encryptionPassword: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html } = templates.invoiceWithEncryption(customerName, invoiceNumber, encryptionPassword);

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    attachments: [
      {
        filename: `Invoice-${invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

/**
 * Send quote with encrypted PDF
 */
export async function sendQuoteEmail(
  customerEmail: string,
  customerName: string,
  quoteReference: string,
  pdfBuffer: Buffer,
  encryptionPassword: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html } = templates.quoteWithEncryption(customerName, quoteReference, encryptionPassword);

  return sendEmail({
    to: customerEmail,
    subject,
    html,
    attachments: [
      {
        filename: `Quote-${quoteReference}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}

/**
 * Send PO with encrypted PDF
 */
export async function sendPOEmail(
  supplierEmail: string,
  supplierName: string,
  poReference: string,
  pdfBuffer: Buffer,
  encryptionPassword: string
): Promise<{ success: boolean; error?: string }> {
  const { subject, html } = templates.poWithEncryption(supplierName, poReference, encryptionPassword);

  return sendEmail({
    to: supplierEmail,
    subject,
    html,
    attachments: [
      {
        filename: `PO-${poReference}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
