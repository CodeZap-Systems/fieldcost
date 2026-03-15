/**
 * Encrypted Document Export Utility
 * Standardized encryption for all document types (invoices, quotes, POs)
 */

import { PDFDocument } from 'pdf-lib';
import { encryptPDF, shouldEncryptPDF } from './pdfEncryption';
import { supabaseServer } from './supabaseServer';

export interface EncryptedDocumentExportOptions {
  documentType: 'invoice' | 'quote' | 'purchase_order';
  userId: string;
  companyId: string;
  documentId: string | number;
  pdfBuffer: Buffer;
  filename: string;
}

export interface DocumentEncryptionSettings {
  encryptionEnabled: boolean;
  encryptionPassword?: string;
  documentType: string;
}

/**
 * Get encryption settings for a company
 */
export async function getDocumentEncryptionSettings(
  userId: string,
  companyId: string,
  documentType?: string
): Promise<DocumentEncryptionSettings> {
  try {
    const { data: company } = await supabaseServer
      .from('company_profiles')
      .select('pdf_encryption_enabled, pdf_encryption_password')
      .eq('user_id', userId)
      .eq('id', companyId)
      .maybeSingle();

    return {
      encryptionEnabled: company?.pdf_encryption_enabled === true,
      encryptionPassword: company?.pdf_encryption_password,
      documentType: documentType || 'general',
    };
  } catch (error) {
    console.error('Failed to get encryption settings:', error);
    return {
      encryptionEnabled: false,
      documentType: documentType || 'general',
    };
  }
}

/**
 * Export document with optional encryption
 */
export async function exportDocumentWithEncryption(
  options: EncryptedDocumentExportOptions
): Promise<{
  buffer: Buffer;
  encrypted: boolean;
  filename: string;
}> {
  const { pdfBuffer, userId, companyId, filename } = options;

  try {
    // Get encryption settings
    const settings = await getDocumentEncryptionSettings(userId, companyId, options.documentType);

    // Apply encryption if enabled
    if (shouldEncryptPDF(settings.encryptionEnabled, settings.encryptionPassword)) {
      const encryptedBuffer = await encryptPDF(pdfBuffer, settings.encryptionPassword || '');
      return {
        buffer: encryptedBuffer,
        encrypted: true,
        filename,
      };
    }

    return {
      buffer: pdfBuffer,
      encrypted: false,
      filename,
    };
  } catch (error) {
    console.error('Document export with encryption failed:', error);
    // Return unencrypted if encryption fails
    return {
      buffer: pdfBuffer,
      encrypted: false,
      filename,
    };
  }
}

/**
 * Log document export for audit trail
 */
export async function logDocumentExport(
  userId: string,
  companyId: string,
  documentType: string,
  documentId: string | number,
  encrypted: boolean,
  filename: string
): Promise<void> {
  try {
    await supabaseServer.from('document_export_logs').insert({
      user_id: userId,
      company_id: companyId,
      document_type: documentType,
      document_id: documentId.toString(),
      encrypted,
      filename,
      exported_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log document export:', error);
    // Don't throw - logging failure shouldn't block the export
  }
}

/**
 * Get document export history
 */
export async function getDocumentExportHistory(
  userId: string,
  companyId: string,
  limit = 50
): Promise<any[]> {
  try {
    const { data } = await supabaseServer
      .from('document_export_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('company_id', companyId)
      .order('exported_at', { ascending: false })
      .limit(limit);

    return data || [];
  } catch (error) {
    console.error('Failed to get export history:', error);
    return [];
  }
}
