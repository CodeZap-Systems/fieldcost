/**
 * Settings Backup and Restore Utility
 * Export and import company settings including encryption configurations
 */

import { supabaseServer } from './supabaseServer';

export interface CompanySettingsBackup {
  version: string;
  exportDate: string;
  companyName: string;
  settings: {
    invoiceTemplate?: string;
    defaultCurrency?: string;
    pdfEncryptionEnabled: boolean;
    pdfEncryptionPassword?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      province?: string;
      postalCode?: string;
      country?: string;
    };
  };
}

/**
 * Export company settings as JSON
 */
export async function exportCompanySettings(
  userId: string,
  companyId: string
): Promise<{
  success: boolean;
  data?: CompanySettingsBackup;
  error?: string;
}> {
  try {
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .eq('id', companyId)
      .maybeSingle();

    if (error || !company) {
      return { success: false, error: 'Company not found' };
    }

    const backup: CompanySettingsBackup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      companyName: company.name,
      settings: {
        invoiceTemplate: company.invoice_template,
        defaultCurrency: company.default_currency,
        pdfEncryptionEnabled: company.pdf_encryption_enabled === true,
        // Note: Password is intentionally not exported for security
        address: {
          line1: company.address_line1,
          line2: company.address_line2,
          city: company.city,
          province: company.province,
          postalCode: company.postal_code,
          country: company.country,
        },
      },
    };

    return { success: true, data: backup };
  } catch (error) {
    console.error('Failed to export settings:', error);
    return { success: false, error: 'Failed to export settings' };
  }
}

/**
 * Import company settings from backup
 * Note: Passwords are not imported for security - must be set manually
 */
export async function importCompanySettings(
  userId: string,
  companyId: string,
  backup: CompanySettingsBackup,
  options: {
    overwriteEncryption?: boolean;
    overwriteAddress?: boolean;
  } = {}
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    // Restore non-sensitive settings
    if (backup.settings.invoiceTemplate) {
      updates.invoice_template = backup.settings.invoiceTemplate;
    }
    if (backup.settings.defaultCurrency) {
      updates.default_currency = backup.settings.defaultCurrency;
    }

    // Restore encryption flag (but not password for security)
    if (options.overwriteEncryption && backup.settings.pdfEncryptionEnabled !== undefined) {
      updates.pdf_encryption_enabled = backup.settings.pdfEncryptionEnabled;
      // Password is NOT restored - user must set it manually after import
    }

    // Restore address if requested
    if (options.overwriteAddress && backup.settings.address) {
      if (backup.settings.address.line1) updates.address_line1 = backup.settings.address.line1;
      if (backup.settings.address.line2) updates.address_line2 = backup.settings.address.line2;
      if (backup.settings.address.city) updates.city = backup.settings.address.city;
      if (backup.settings.address.province) updates.province = backup.settings.address.province;
      if (backup.settings.address.postalCode) updates.postal_code = backup.settings.address.postalCode;
      if (backup.settings.address.country) updates.country = backup.settings.address.country;
    }

    const { error } = await supabaseServer
      .from('company_profiles')
      .update(updates)
      .eq('user_id', userId)
      .eq('id', companyId);

    if (error) {
      return { success: false, error: error.message };
    }

    let message = 'Settings imported successfully';
    if (options.overwriteEncryption && backup.settings.pdfEncryptionEnabled) {
      message += '. Note: Encryption password was not imported for security. Please set it manually in settings.';
    }

    return { success: true, message };
  } catch (error) {
    console.error('Failed to import settings:', error);
    return { success: false, error: 'Failed to import settings' };
  }
}

/**
 * Create a file for downloading settings backup
 */
export function getDownloadBackupFilename(companyName: string): string {
  const sanitized = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  return `${sanitized}-settings-backup-${date}.json`;
}

/**
 * Validate backup file format
 */
export function validateBackup(data: unknown): data is CompanySettingsBackup {
  if (!data || typeof data !== 'object') return false;

  const backup = data as Record<string, unknown>;

  return (
    backup.version === '1.0' &&
    typeof backup.exportDate === 'string' &&
    typeof backup.companyName === 'string' &&
    backup.settings &&
    typeof (backup.settings as Record<string, unknown>).pdfEncryptionEnabled === 'boolean'
  );
}
