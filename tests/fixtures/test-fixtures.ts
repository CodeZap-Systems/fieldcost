/**
 * Test fixtures - shared test data
 */

export const TEST_CREDENTIALS = {
  valid: {
    email: 'qa_test_user@fieldcost.com',
    password: 'TestPassword123',
  },
  invalid: {
    email: 'invalid@fieldcost.com',
    password: 'WrongPassword123',
  },
  expired: {
    email: 'expired@fieldcost.com',
    password: 'ExpiredPass123',
  },
};

export const VALID_COMPANY_DATA = {
  basic: {
    name: 'QA Test Company',
    industry: 'Construction',
    phone: '+1-555-0100',
    address: '123 Test Street',
  },
  complete: {
    name: 'Complete Test Company',
    industry: 'Engineering',
    website: 'https://test-company.com',
    phone: '+1-555-0101',
    address: '456 Business Ave',
    city: 'Test City',
    state: 'TC',
    postal_code: '12345',
    country: 'US',
  },
};

export const VALID_PROJECT_DATA = {
  simple: {
    name: 'Simple Test Project',
    status: 'active',
  },
  complete: {
    name: 'Complete Test Project',
    description: 'Full project with all details',
    status: 'active',
    budget: 50000,
    client_id: null,
  },
  highBudget: {
    name: 'High Budget Project',
    budget: 250000,
    status: 'active',
  },
  completed: {
    name: 'Completed Project',
    status: 'completed',
    budget: 100000,
  },
};

export const VALID_TASK_DATA = {
  simple: {
    title: 'Simple Test Task',
    status: 'todo',
  },
  complete: {
    title: 'Complete Test Task',
    description: 'Task with all details',
    status: 'todo',
    priority: 'high',
    estimated_hours: 8,
  },
  urgent: {
    title: 'Urgent Task',
    priority: 'urgent',
    status: 'todo',
  },
};

export const VALID_CUSTOMER_DATA = {
  simple: {
    name: 'Test Customer Inc',
    email: 'contact@testcustomer.com',
  },
  complete: {
    name: 'Complete Customer Corp',
    email: 'contact@completecustomer.com',
    phone: '+1-555-0102',
    address: '789 Customer St',
    city: 'Client City',
    state: 'CC',
    postal_code: '54321',
    country: 'US',
  },
  government: {
    name: 'Government Agency Test',
    email: 'procurement@govtest.gov',
    phone: '+1-555-0103',
    address: '111 Government Blvd',
  },
};

export const VALID_ITEM_DATA = {
  labor: {
    name: 'Test Labor - Skilled',
    sku: 'LAB-001',
    category: 'Labor',
    unit_price: 150,
  },
  material: {
    name: 'Test Material - Steel Beams',
    sku: 'MAT-001',
    category: 'Materials',
    unit_price: 500,
    quantity_on_hand: 50,
  },
  equipment: {
    name: 'Test Equipment - Excavator',
    sku: 'EQ-001',
    category: 'Equipment',
    unit_price: 5000,
    quantity_on_hand: 2,
  },
};

export const VALID_QUOTE_DATA = {
  simple: {
    description: 'Simple test quote',
    status: 'draft',
  },
  complete: {
    description: 'Complete test quote with all details',
    status: 'draft',
    tax_rate: 0.1,
    discount_percentage: 5,
  },
  approved: {
    description: 'Pre-approved quote',
    status: 'approved',
  },
  expired: {
    description: 'Expired quote',
    status: 'expired',
  },
};

export const VALID_QUOTE_LINE_ITEMS = {
  labor: {
    description: 'Labor - skilled trades',
    quantity: 40,
    unit_price: 150,
  },
  materials: {
    description: 'Building materials',
    quantity: 100,
    unit_price: 50,
  },
  equipment: {
    description: 'Equipment rental',
    quantity: 1,
    unit_price: 2500,
  },
};

export const VALID_PURCHASE_ORDER_DATA = {
  simple: {
    description: 'Simple test PO',
    status: 'draft',
  },
  complete: {
    description: 'Complete test PO with all details',
    status: 'draft',
    tax_rate: 0.1,
  },
  approved: {
    description: 'Approved purchase order',
    status: 'approved',
  },
  received: {
    description: 'Received purchase order',
    status: 'received',
  },
};

export const VALID_PO_LINE_ITEMS = {
  materials: {
    description: 'Building materials delivery',
    quantity: 500,
    unit_price: 100,
  },
  supplies: {
    description: 'Office supplies',
    quantity: 50,
    unit_price: 25,
  },
  services: {
    description: 'Installation services',
    quantity: 1,
    unit_price: 5000,
  },
};

export const VALID_INVOICE_DATA = {
  simple: {
    description: 'Simple test invoice',
    status: 'draft',
  },
  complete: {
    description: 'Complete test invoice',
    status: 'draft',
    tax_rate: 0.1,
    discount_percentage: 0,
  },
  sent: {
    description: 'Sent invoice',
    status: 'sent',
  },
  paid: {
    description: 'Paid invoice',
    status: 'paid',
  },
  overdue: {
    description: 'Overdue invoice',
    status: 'overdue',
  },
};

export const VALID_INVOICE_LINE_ITEMS = {
  labor: {
    description: 'Professional services - 40 hours',
    quantity: 40,
    unit_price: 150,
  },
  materials: {
    description: 'Materials delivery',
    quantity: 1,
    unit_price: 10000,
  },
};

export const INVALID_DATA = {
  missingEmail: {
    password: 'TestPassword123',
  },
  missingPassword: {
    email: 'test@test.com',
  },
  invalidEmail: {
    email: 'not-an-email',
    password: 'TestPassword123',
  },
  weakPassword: {
    email: 'test@test.com',
    password: '123',
  },
  emptyProject: {
    name: '',
  },
  largeNumber: {
    budget: 999999999999999,
  },
};

export const ERP_CREDENTIALS = {
  sage: {
    business_name: 'Test Business',
    api_token: 'test_sage_api_token_12345',
    api_version: '3.1',
  },
  xero: {
    client_id: 'test_xero_client_id',
    client_secret: 'test_xero_secret',
    tenant_id: 'test_xero_tenant',
  },
};

export const PAGINATION_TEST_DATA = {
  pageSize: 10,
  totalItems: 50,
  expectedPages: 5,
};

export const SEARCH_QUERIES = {
  common: ['project', 'task', 'customer', 'invoice'],
  special: ['@', '#', '$', '%'],
  longString: 'A'.repeat(255),
  unicode: '你好世界',
};

export const DATE_RANGES = {
  currentDay: {
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  },
  currentMonth: {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  },
  lastQuarter: {
    from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  },
};

export const API_RESPONSE_TIMES = {
  fast: 200,
  normal: 500,
  slow: 2000,
  timeout: 30000,
};
