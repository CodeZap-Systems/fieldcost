/**
 * ERP Platform Adapter - Comprehensive Field Mapping
 * Sage Business Cloud (One) vs Xero integrations
 *
 * FIELD MAPPING REFERENCE:
 * ┌──────────────────────┬─────────────────────────┬──────────────────────┐
 * │ FieldCost Field      │ Xero                    │ Sage One             │
 * ├──────────────────────┼─────────────────────────┼──────────────────────┤
 * │ Project              │ Tracking Category Opt.  │ Invoice Reference    │
 * │ Client/Customer      │ Contact                 │ Contact (CUSTOMER)   │
 * │ Invoice              │ ACCREC (DRAFT)          │ Sales Invoice (DRAFT)│
 * │ Line Item            │ LineItem + TaxType name │ line_item + tax_id   │
 * │ VAT/Tax              │ "OUTPUT2" (string)      │ UUID from /tax_rates │
 * │ Account              │ AccountCode (string)    │ ledger_account_id    │
 * │ Budget               │ NOT synced              │ NOT synced           │
 * │ WIP                  │ NOT synced              │ NOT synced           │
 * │ Timers               │ NOT synced              │ NOT synced           │
 * │ Payment Status       │ ← Pulled from Xero      │ ← Pulled from Sage   │
 * └──────────────────────┴─────────────────────────┴──────────────────────┘
 */

export type ErpPlatform = 'sage-one' | 'xero';

export interface ErpProjectPayload {
  projectCode: string;
  projectName: string;
  customerName: string;
  customerId?: string;
  description?: string;
  budgetValue?: number;
  status?: string;
}

/**
 * Detect target ERP platform from environment or request
 */
export function detectErpPlatform(erp?: string | null): ErpPlatform {
  if (!erp) {
    const envErp = process.env.TARGET_ERP?.toLowerCase();
    if (envErp === 'xero') return 'xero';
    if (envErp === 'sage-one' || envErp === 'sage') return 'sage-one';
    return 'sage-one'; // Default to Sage One
  }
  return erp.toLowerCase().includes('xero') ? 'xero' : 'sage-one';
}

/**
 * Transform project payload based on ERP platform architecture
 *
 * Sage One: Projects are universal, linked directly to transactions
 * Example: { projectCode: 'PRJ-2024-001', projectName: 'Highway Upgrade' }
 *
 * Xero: Projects are scoped to customers, must create customer first
 * Example: { projectCode: 'PRJ-2024-001', projectName: 'Highway Upgrade', customerId: 'xero-uuid' }
 */
export function transformProjectPayload(
  payload: ErpProjectPayload,
  platform: ErpPlatform
): Record<string, unknown> {
  if (platform === 'xero') {
    return transformProjectForXero(payload);
  }
  return transformProjectForSageOne(payload);
}

/**
 * Sage One: Projects stored as invoice reference field
 * Customers must be type=CUSTOMER for Sales Invoice
 */
function transformProjectForSageOne(payload: ErpProjectPayload): Record<string, unknown> {
  return {
    projectReference: payload.projectCode, // Stored in invoice reference
    projectName: payload.projectName,
    invoiceReference: `${payload.projectCode} - ${payload.projectName}`,
    description: payload.description || `Customer: ${payload.customerName}`,
    budgetValue: payload.budgetValue,
    status: payload.status || 'Active',
    customerType: 'CUSTOMER', // Required for Sales Invoice
  };
}

/**
 * Xero: Projects as Tracking Category Options
 * Scoped to customer contacts
 */
function transformProjectForXero(payload: ErpProjectPayload): Record<string, unknown> {
  if (!payload.customerId) {
    throw new Error('Xero projects require customerId (customer-scoped)');
  }

  return {
    projectCode: payload.projectCode,
    projectName: payload.projectName,
    trackingCategory: 'Projects', // Category name
    trackingOption: payload.projectName, // Option name
    contactID: payload.customerId, // Customer Contact UUID
    description: payload.description,
    budgetedAmount: payload.budgetValue,
    projectStatus: payload.status || 'DRAFT',
  };
}

// ============================================
// CUSTOMER/CLIENT MAPPING
// ============================================

/**
 * Map FieldCost client to ERP contact/customer
 * Sage: Contact with type=CUSTOMER (required for invoicing)
 * Xero: Contact (standard)
 */
export function mapCustomerToErp(
  name: string,
  fieldcostId: string,
  platform: ErpPlatform
): Record<string, unknown> {
  if (platform === 'xero') {
    return {
      contactName: name,
      contactId: fieldcostId,
      type: 'CUSTOMER',
    };
  }

  return {
    contactName: name,
    contactId: fieldcostId,
    contactType: 'CUSTOMER', // MUST be CUSTOMER for Sales Invoice
  };
}

// ============================================
// TAX/VAT MAPPING
// ============================================

/**
 * Map FieldCost VAT to ERP tax type
 * Xero: "OUTPUT2" (string tax type name for standard VAT)
 * Sage: UUID from /tax_rates endpoint (e.g., 15% VAT UUID)
 */
export function mapVatToErp(
  vatPercentage: number,
  platform: ErpPlatform,
  sageVatUuid?: string
): Record<string, unknown> {
  if (platform === 'xero') {
    return {
      taxType: 'OUTPUT2', // Standard Output VAT in Xero
      taxPercentage: vatPercentage,
      taxCode: 'OUTPUT2',
    };
  }

  // Sage: Must use UUID from /tax_rates API
  return {
    taxRateId: sageVatUuid || '00000000-0000-0000-0000-000000000000',
    taxPercentage: vatPercentage,
    taxName: `${vatPercentage}% VAT`,
  };
}

// ============================================
// ACCOUNT/LEDGER MAPPING
// ============================================

/**
 * Map FieldCost account to ERP account reference
 * Xero: AccountCode (string, e.g. "200")
 * Sage: ledger_account_id (UUID from /ledger_accounts)
 */
export function mapAccountToErp(
  accountCode: string,
  platform: ErpPlatform,
  sageLedgerAccountUuid?: string
): Record<string, unknown> {
  if (platform === 'xero') {
    return {
      accountCode: accountCode, // e.g. "200" - simple string code
    };
  }

  // Sage: Must resolve to UUID via /ledger_accounts
  return {
    ledgerAccountId: sageLedgerAccountUuid || '00000000-0000-0000-0000-000000000000',
    accountCode: accountCode,
  };
}

// ============================================
// LINE ITEM MAPPING
// ============================================

export interface FieldCostLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  accountCode?: string; // Account reference
  taxPercentage?: number; // VAT percentage
}

/**
 * Map line items to ERP format
 * Xero: LineItem with TaxType name ("OUTPUT2")
 * Sage: line_item with tax_rate_id (UUID)
 */
export function mapLineItemsToErp(
  items: FieldCostLineItem[],
  platform: ErpPlatform,
  sageMetadata?: { vatUuid?: string; ledgerAccountUuids?: Record<string, string> }
): Array<Record<string, unknown>> {
  return items.map((item) => {
    const baseItem = {
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    };

    if (platform === 'xero') {
      return {
        ...baseItem,
        accountCode: item.accountCode || '200',
        taxType: 'OUTPUT2', // Tax type as string
        taxPercentage: item.taxPercentage || 15,
      };
    }

    // Sage: Resolve all IDs via API calls
    const ledgerUuid = item.accountCode
      ? sageMetadata?.ledgerAccountUuids?.[item.accountCode]
      : undefined;

    return {
      ...baseItem,
      ledgerAccountId: ledgerUuid || '00000000-0000-0000-0000-000000000000',
      taxRateId: sageMetadata?.vatUuid || '00000000-0000-0000-0000-000000000000',
      taxPercentage: item.taxPercentage || 15,
    };
  });
}

// ============================================
// FIELD SYNC CONTROL
// ============================================

/**
 * Determine if a FieldCost field should be synced to ERP
 * Budget, WIP, and Timers are FieldCost-only (not synced)
 */
export function shouldSyncFieldToErp(
  fieldName: 'budget' | 'wip' | 'timers' | 'project' | 'client' | 'invoice' | 'line' | 'vat' | 'account'
): boolean {
  const fieldCostOnlyFields = ['budget', 'wip', 'timers'];
  return !fieldCostOnlyFields.includes(fieldName);
}

/**
 * Generate project code if not provided
 * Format: PRJ-YYYY-####
 */
export function generateProjectCode(customerName?: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const year = new Date().getFullYear();
  return `PRJ-${year}-${random.toString().padStart(4, '0')}`;
}

/**
 * Validate project payload for target platform
 */
export function validateProjectPayload(payload: ErpProjectPayload, platform: ErpPlatform): string[] {
  const errors: string[] = [];

  if (!payload.projectCode || payload.projectCode.trim() === '') {
    errors.push('projectCode is required');
  }
  if (!payload.projectName || payload.projectName.trim() === '') {
    errors.push('projectName is required');
  }
  if (!payload.customerName || payload.customerName.trim() === '') {
    errors.push('customerName is required');
  }

  if (platform === 'xero') {
    if (!payload.customerId || payload.customerId.trim() === '') {
      errors.push('customerId is required for Xero projects (customer-scoped)');
    }
  }

  if (payload.budgetValue !== undefined && payload.budgetValue < 0) {
    errors.push('budgetValue cannot be negative');
  }

  return errors;
}

/**
 * Map generic invoice data to platform-specific project reference
 */
export function mapInvoiceProject(
  projectData: { code: string; name: string; customer: string; customerId?: string },
  platform: ErpPlatform
): Record<string, unknown> {
  if (platform === 'xero') {
    return {
      projectID: projectData.customerId, // Use customerId for Xero lookup
      projectRef: projectData.code,
    };
  }

  // Sage One - use project code directly
  return {
    projectRef: projectData.code,
    projectCode: projectData.code,
  };
}
