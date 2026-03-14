/**
 * Test data generators
 */

export function generateTestProject() {
  return {
    name: `Test Project ${Date.now()}`,
    description: 'Automated test project',
    status: 'active',
    client_id: null,
    budget: 50000,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };
}

export function generateTestTask() {
  return {
    title: `Test Task ${Date.now()}`,
    description: 'Automated test task',
    status: 'todo',
    priority: 'medium',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimated_hours: 8,
  };
}

export function generateTestCustomer() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    name: `Test Customer ${randomId}`,
    email: `customer-${randomId}@test.com`,
    phone: '+1-555-0100',
    address: '123 Test Street, Test City, TC 12345',
    city: 'Test City',
    state: 'TC',
    postal_code: '12345',
    country: 'US',
  };
}

export function generateTestItem() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    name: `Test Item ${randomId}`,
    description: 'Automated test inventory item',
    sku: `TEST-SKU-${randomId}`,
    category: 'Materials',
    unit_price: 99.99,
    quantity_on_hand: 100,
    reorder_level: 20,
  };
}

export function generateTestQuote() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    quote_number: `QT-${randomId}`,
    customer_id: null,
    description: 'Test quote for automated testing',
    status: 'draft',
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 0.1,
    discount_percentage: 0,
  };
}

export function generateTestQuoteLineItem() {
  return {
    description: 'Labor - skilled trades',
    quantity: 8,
    unit_price: 150,
    tax_rate: 0.1,
  };
}

export function generateTestPurchaseOrder() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    po_number: `PO-${randomId}`,
    vendor_id: null, // Will be set to customer ID
    description: 'Test purchase order for automated testing',
    status: 'draft',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 0.1,
  };
}

export function generateTestPOLineItem() {
  return {
    item_id: null, // Will be set
    description: 'Building materials',
    quantity: 10,
    unit_price: 45.50,
    tax_rate: 0.1,
  };
}

export function generateTestInvoice() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    invoice_number: `INV-${randomId}`,
    customer_id: null,
    description: 'Test invoice',
    status: 'draft',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tax_rate: 0.1,
    discount_percentage: 0,
  };
}

export function generateTestInvoiceLineItem() {
  return {
    description: 'Professional services',
    quantity: 1,
    unit_price: 5000,
    tax_rate: 0.1,
  };
}

export function generateTestCompany() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    name: `Test Company ${randomId}`,
    industry: 'Construction',
    website: `https://test-company-${randomId}.com`,
    phone: '+1-555-0101',
    address: '456 Business Ave, Corporate City, CC 54321',
    city: 'Corporate City',
    state: 'CC',
    postal_code: '54321',
    country: 'US',
  };
}

export function generateTestUser() {
  const randomId = Math.random().toString(36).substring(7);
  return {
    email: `testuser-${randomId}@fieldcost-test.com`,
    password: 'SecureTestPass123!',
    full_name: `Test User ${randomId}`,
    role: 'user',
  };
}

export function generateSageCredentials() {
  return {
    business_name: 'Test Business',
    api_token: 'test_sage_token_' + Date.now(),
    api_version: '3.1',
  };
}

export function generateXeroCredentials() {
  return {
    client_id: 'test_xero_client_' + Date.now(),
    client_secret: 'test_xero_secret_' + Date.now(),
    tenant_id: 'test_xero_tenant_' + Date.now(),
  };
}

/**
 * Batch generators
 */
export function generateTestProjectBatch(count: number) {
  return Array.from({ length: count }, () => generateTestProject());
}

export function generateTestTaskBatch(count: number, projectId?: string) {
  return Array.from({ length: count }, () => ({
    ...generateTestTask(),
    project_id: projectId,
  }));
}

export function generateTestCustomerBatch(count: number) {
  return Array.from({ length: count }, () => generateTestCustomer());
}

export function generateTestItemBatch(count: number) {
  return Array.from({ length: count }, () => generateTestItem());
}
