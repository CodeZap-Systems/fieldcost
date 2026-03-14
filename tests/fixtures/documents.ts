/**
 * Test Fixtures - Document Data
 * Provides realistic test data for invoices, quotes, and orders
 */

export interface DocumentLine {
  itemId: number | null;
  itemName: string;
  quantity: number;
  rate: number;
  total: number;
  project?: string;
  note?: string;
}

export interface TestInvoice {
  customerId: number;
  customerName: string;
  amount: number;
  description: string;
  reference: string;
  lines: DocumentLine[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  currency: 'ZAR' | 'USD' | 'GBP';
}

export interface TestQuote {
  customerId: number;
  customerName: string;
  amount: number;
  description: string;
  reference: string;
  lines: DocumentLine[];
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  validUntil?: string;
}

export interface TestOrder {
  vendorId: number;
  vendorName: string;
  projectId?: number;
  projectName?: string;
  amount: number;
  description: string;
  reference: string;
  lines: DocumentLine[];
  status: 'draft' | 'sent_to_supplier' | 'confirmed' | 'partially_received' | 'fully_received' | 'invoiced';
  poDate?: string;
  deliveryDate?: string;
  requiredBy?: string;
}

/**
 * Sample invoice fixture
 */
export const SAMPLE_INVOICE: TestInvoice = {
  customerId: 1,
  customerName: 'ABC Construction Ltd',
  amount: 12500.00,
  description: 'Services rendered for Q1 2026',
  reference: 'INV-001-2026',
  lines: [
    {
      itemId: 1,
      itemName: 'Consulting Services',
      quantity: 40,
      rate: 150.00,
      total: 6000.00,
      project: 'Main Site Development',
    },
    {
      itemId: 2,
      itemName: 'Equipment Rental',
      quantity: 5,
      rate: 1300.00,
      total: 6500.00,
      project: 'Main Site Development',
      note: 'Scaffolding rental for 2 weeks',
    },
  ],
  status: 'sent',
  currency: 'ZAR',
};

/**
 * Sample quote fixture
 */
export const SAMPLE_QUOTE: TestQuote = {
  customerId: 1,
  customerName: 'XYZ Development Inc',
  amount: 45000.00,
  description: 'Quote for construction services',
  reference: 'QUOTE-001-2026',
  lines: [
    {
      itemId: 3,
      itemName: 'Site Preparation',
      quantity: 1,
      rate: 15000.00,
      total: 15000.00,
      project: 'Expansion Project',
    },
    {
      itemId: 4,
      itemName: 'Foundation Work',
      quantity: 1,
      rate: 20000.00,
      total: 20000.00,
      project: 'Expansion Project',
    },
    {
      itemId: 2,
      itemName: 'Equipment Rental',
      quantity: 8,
      rate: 1300.00,
      total: 10000.00,
      project: 'Expansion Project',
    },
  ],
  status: 'sent',
  validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

/**
 * Sample purchase order fixture (Supplier Purchase Order)
 */
export const SAMPLE_ORDER: TestOrder = {
  vendorId: 5,
  vendorName: 'BuildSupplies Inc',
  projectId: 1,
  projectName: 'Main Site Development',
  amount: 8500.00,
  description: 'Supplier Purchase Order for building materials',
  reference: 'PO-001-2026',
  lines: [
    {
      itemId: 10,
      itemName: 'Cement Bags (50kg)',
      quantity: 100,
      rate: 45.00,
      total: 4500.00,
      note: 'Grade C30',
    },
    {
      itemId: 11,
      itemName: 'Steel Rebar (12mm)',
      quantity: 200,
      rate: 20.00,
      total: 4000.00,
      note: 'Grade 500',
    },
  ],
  status: 'sent_to_supplier',
  poDate: new Date().toISOString().split('T')[0],
  deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
};

/**
 * Generate random test invoice
 */
export function generateTestInvoice(overrides?: Partial<TestInvoice>): TestInvoice {
  const timestamp = Date.now();
  return {
    ...SAMPLE_INVOICE,
    customerId: Math.floor(Math.random() * 100),
    reference: `INV-${Math.floor(Math.random() * 9999)}-2026`,
    ...overrides,
  };
}

/**
 * Generate random test quote
 */
export function generateTestQuote(overrides?: Partial<TestQuote>): TestQuote {
  return {
    ...SAMPLE_QUOTE,
    customerId: Math.floor(Math.random() * 100),
    reference: `QUOTE-${Math.floor(Math.random() * 9999)}-2026`,
    ...overrides,
  };
}

/**
 * Generate random test order
 */
export function generateTestOrder(overrides?: Partial<TestOrder>): TestOrder {
  return {
    ...SAMPLE_ORDER,
    customerId: Math.floor(Math.random() * 100),
    reference: `PO-${Math.floor(Math.random() * 9999)}-2026`,
    ...overrides,
  };
}
