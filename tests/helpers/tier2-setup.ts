/**
 * Tier 2 Test Setup & Configuration
 * Constants, utilities, and database setup for Tier 2 API tests
 */

import { beforeEach, afterEach, describe } from 'vitest';

// ============================================================================
// TEST CONSTANTS
// ============================================================================

/**
 * Test user and company IDs
 * These should map to actual test data in the demo database
 */
export const TEST_CONFIG = {
  // Base API URL
  API_URL: 'http://localhost:3000',
  
  // Test user credentials (from demo data)
  TEST_USER_ID: 'test-user-123',
  TEST_EMAIL: 'qa_test_user@fieldcost.com',
  
  // Test company ID (use DEMO_COMPANY_ID = 8 from actual data)
  TEST_COMPANY_ID: 8,
  
  // Alternative test company for isolation tests
  TEST_COMPANY_ID_2: 9,
  
  // Request timeout (in ms)
  REQUEST_TIMEOUT: 10000,
  
  // Test timeouts
  TEST_TIMEOUT: 30000,
  
  // Database cleanup - set to true to delete test data after tests
  CLEANUP_AFTER_TESTS: true,
  
  // Logging - set to true to log API requests/responses
  LOG_API_CALLS: process.env.DEBUG_API === 'true',
};

// ============================================================================
// GLOBAL REQUEST HEADERS
// ============================================================================

/**
 * Get standard headers for authenticated API requests
 */
export function getAuthHeaders(userId?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(userId && { 'x-user-id': userId }),
  };
}

/**
 * Get headers for a specific company context
 */
export function getCompanyHeaders(
  companyId: number = TEST_CONFIG.TEST_COMPANY_ID,
  userId: string = TEST_CONFIG.TEST_USER_ID
): Record<string, string> {
  return {
    ...getAuthHeaders(userId),
    'x-company-id': companyId.toString(),
  };
}

// ============================================================================
// STATE TRANSITIONS & ALLOWED STATUSES
// ============================================================================

/**
 * Allowed status transitions for Quotes
 */
export const QUOTE_TRANSITIONS = {
  draft: ['sent', 'deleted'],
  sent: ['accepted', 'rejected'],
  accepted: ['invoiced'],
  rejected: ['draft'],
  invoiced: [] as string[],
} as const;

/**
 * Allowed status transitions for Purchase Orders
 */
export const PO_TRANSITIONS = {
  draft: ['sent', 'deleted'],
  sent: ['confirmed', 'cancelled'],
  confirmed: ['partially_received', 'cancelled'],
  partially_received: ['fully_received', 'cancelled'],
  fully_received: ['closed'],
  closed: [] as string[],
  cancelled: [] as string[],
} as const;

/**
 * Quality status values for GRN
 */
export const QUALITY_STATUSES = [
  'inspected_good',
  'inspected_defective',
  'partial_defect',
  'rejected',
  'on_hold',
] as const;

// ============================================================================
// TEST DATA DEFAULTS
// ============================================================================

/**
 * Default values for test creation
 */
export const TEST_DEFAULTS = {
  // Quote defaults
  QUOTE_VALID_DAYS: 30,
  QUOTE_LINE_DEFAULT_UNIT: 'ea',
  QUOTE_LINE_DEFAULT_RATE: 100,
  
  // PO defaults
  PO_DELIVERY_DAYS: 14,
  PO_LINE_DEFAULT_UNIT: 'pcs',
  PO_LINE_DEFAULT_RATE: 50,
  
  // GRN defaults
  GRN_DEFAULT_LOCATION: 'Main Warehouse',
  GRN_DEFAULT_RECEIVED_BY: 'Test User',
  
  // Supplier defaults
  SUPPLIER_PAYMENT_TERMS: 'Net 30',
  SUPPLIER_RATING: 4,
};

// ============================================================================
// API ENDPOINT CONSTANTS
// ============================================================================

export const ENDPOINTS = {
  QUOTES: '/api/quotes',
  QUOTE_SEND: (id: number) => `/api/quotes/${id}/send`,
  QUOTE_CONVERT: (id: number) => `/api/quotes/${id}/convert`,
  QUOTE_EXPORT: (id: number) => `/api/quotes/${id}/export/pdf`,
  
  PURCHASE_ORDERS: '/api/purchase-orders',
  PO_SEND: (id: number) => `/api/purchase-orders/${id}/send`,
  PO_CONFIRM: (id: number) => `/api/purchase-orders/${id}/confirm`,
  PO_EXPORT: (id: number) => `/api/purchase-orders/${id}/export/pdf`,
  
  SUPPLIERS: '/api/suppliers',
  
  GOODS_RECEIVED_NOTES: '/api/goods-received-notes',
  GRN_REVERSE: (id: number) => `/api/goods-received-notes/${id}/reverse`,
} as const;

// ============================================================================
// TEST DATA BUILDERS
// ============================================================================

/**
 * Build a complete quote object for testing
 */
export function buildTestQuote(overrides = {}) {
  const date = new Date();
  date.setDate(date.getDate() + TEST_DEFAULTS.QUOTE_VALID_DAYS);
  
  return {
    customer_id: 1,
    company_id: TEST_CONFIG.TEST_COMPANY_ID,
    reference: `QUOTE-TEST-${Date.now()}`,
    description: 'Test quote for automated testing',
    valid_until: date.toISOString().split('T')[0],
    lines: [
      {
        item_name: 'Professional Services',
        quantity: 10,
        unit: TEST_DEFAULTS.QUOTE_LINE_DEFAULT_UNIT,
        rate: TEST_DEFAULTS.QUOTE_LINE_DEFAULT_RATE,
        note: 'Test service line item',
      },
    ],
    ...overrides,
  };
}

/**
 * Build a complete purchase order object for testing
 */
export function buildTestPurchaseOrder(overrides = {}) {
  const date = new Date();
  date.setDate(date.getDate() + TEST_DEFAULTS.PO_DELIVERY_DAYS);
  
  return {
    supplier_id: 1,
    company_id: TEST_CONFIG.TEST_COMPANY_ID,
    po_reference: `PO-TEST-${Date.now()}`,
    required_by_date: date.toISOString().split('T')[0],
    description: 'Test purchase order for automated testing',
    lines: [
      {
        item_name: 'Materials',
        quantity_ordered: 100,
        unit: TEST_DEFAULTS.PO_LINE_DEFAULT_UNIT,
        unit_rate: TEST_DEFAULTS.PO_LINE_DEFAULT_RATE,
        note: 'Test material',
      },
    ],
    ...overrides,
  };
}

/**
 * Build a complete GRN object for testing
 */
export function buildTestGRN(poId: number, overrides = {}) {
  return {
    po_id: poId,
    company_id: TEST_CONFIG.TEST_COMPANY_ID,
    received_by: TEST_DEFAULTS.GRN_DEFAULT_RECEIVED_BY,
    received_at_location: TEST_DEFAULTS.GRN_DEFAULT_LOCATION,
    quality_status: 'inspected_good',
    lines: [
      {
        po_line_item_id: 1,
        quantity_received: 50,
      },
    ],
    ...overrides,
  };
}

/**
 * Build a supplier object for testing
 */
export function buildTestSupplier(overrides = {}) {
  const uuid = Math.random().toString(36).substring(7);
  
  return {
    vendor_name: `Test Supplier ${uuid}`,
    contact_name: `Contact ${uuid}`,
    email: `supplier_${uuid}@test.com`,
    phone: `+27${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    address_line1: `${Math.floor(Math.random() * 999)} Industrial Ave`,
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2000',
    country: 'South Africa',
    payment_terms: TEST_DEFAULTS.SUPPLIER_PAYMENT_TERMS,
    rating: TEST_DEFAULTS.SUPPLIER_RATING,
    company_id: TEST_CONFIG.TEST_COMPANY_ID,
    ...overrides,
  };
}

// ============================================================================
// TEST CONTEXT MANAGER
// ============================================================================

/**
 * Track created test resources for cleanup
 */
export class TestResourceTracker {
  private resources: {
    endpoint: string;
    id: number;
  }[] = [];

  /**
   * Track a resource for cleanup
   */
  track(endpoint: string, id: number) {
    this.resources.push({ endpoint, id });
  }

  /**
   * Get all tracked resources
   */
  getAll() {
    return [...this.resources];
  }

  /**
   * Clear tracking
   */
  clear() {
    this.resources = [];
  }
}

/**
 * Setup test hooks with automatic cleanup
 * Usage in tests:
 * ```
 * const tracker = setupTestTransactions();
 * const quote = await api.post(...); // create resource
 * tracker.track('/api/quotes', quote.id);
 * // Resources auto-deleted in afterEach
 * ```
 */
export function setupTestTransactions(): TestResourceTracker {
  const tracker = new TestResourceTracker();
  
  afterEach(async () => {
    if (!TEST_CONFIG.CLEANUP_AFTER_TESTS) {
      tracker.clear();
      return;
    }
    
    // Cleanup would happen here - delete tracked resources
    // This is a placeholder for actual implementation
    tracker.clear();
  });
  
  return tracker;
}

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Wait for specified milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate unique reference for testing
 */
export function generateReference(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get future date string
 */
export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

/**
 * Calculate total from line items
 */
export function calculateLineTotal(quantity: number, rate: number): number {
  return parseFloat((quantity * rate).toFixed(2));
}

/**
 * Round to 2 decimal places (currency)
 */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
