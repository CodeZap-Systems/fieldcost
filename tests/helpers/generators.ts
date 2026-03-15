/**
 * Test Data Generators
 * Generate realistic test data for testing
 */

import { v4 as uuidv4 } from 'uuid';

const DEMO_COMPANY_ID = 8;

/**
 * Generate test user
 */
export function generateTestUser() {
  const uuid = uuidv4().substring(0, 8);
  return {
    email: `test_${uuid}@fieldcost.com`,
    password: 'TestPassword123',
    name: `Test User ${uuid}`,
    role: 'admin',
  };
}

/**
 * Generate test project
 */
export function generateTestProject() {
  return {
    name: `Test Project ${Date.now()}`,
    description: `Automated test project created at ${new Date().toISOString()}`,
    location: `Location ${Math.random().toString(36).substring(7)}`,
    status: 'active',
    budget: Math.floor(Math.random() * 50000) + 5000,
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test customer
 */
export function generateTestCustomer() {
  const uuid = uuidv4().substring(0, 6);
  return {
    name: `Customer ${uuid}`,
    email: `customer_${uuid}@example.com`,
    phone: `+27${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    address: `${Math.floor(Math.random() * 999)} Main St`,
    city: 'Cape Town',
    province: 'Western Cape',
    postal_code: '8000',
    country: 'South Africa',
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test task
 */
export function generateTestTask() {
  return {
    name: `Test Task ${Date.now()}`,
    description: 'Automated test task for verification',
    status: 'pending',
    priority: 'medium',
    project_id: 1,
    assigned_to: 'Test User',
    billable: true,
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test inventory item
 */
export function generateTestInventoryItem() {
  return {
    name: `Item ${Date.now()}`,
    description: 'Test inventory item',
    category: 'Materials',
    unit: 'ea',
    quantity: Math.floor(Math.random() * 100) + 10,
    cost: parseFloat((Math.random() * 1000).toFixed(2)),
    supplier: 'Test Supplier',
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test invoice
 */
export function generateTestInvoice() {
  const invoiceNumber = `INV-${Date.now()}`;
  return {
    invoice_number: invoiceNumber,
    customer_id: 1,
    project_id: 1,
    description: `Invoice ${invoiceNumber}`,
    amount: parseFloat((Math.random() * 50000 + 1000).toFixed(2)),
    tax: parseFloat((Math.random() * 10000).toFixed(2)),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test quote (Tier 2)
 */
export function generateTestQuote() {
  return {
    customer_id: 1,
    project_id: 1,
    description: `Test Quote ${Date.now()}`,
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    line_items: [
      {
        name: 'Professional Services',
        quantity: 10,
        unit: 'hrs',
        rate: 150,
      },
      {
        name: 'Software License',
        quantity: 1,
        unit: 'ea',
        rate: 5000,
      },
    ],
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test supplier (Tier 2)
 */
export function generateTestSupplier() {
  const uuid = uuidv4().substring(0, 6);
  return {
    vendor_name: `Supplier ${uuid}`,
    contact_name: `Contact ${uuid}`,
    email: `supplier_${uuid}@example.com`,
    phone: `+27${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    address_line1: `${Math.floor(Math.random() * 999)} Industrial Ave`,
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2000',
    country: 'South Africa',
    payment_terms: 'Net 30',
    tax_id: `ZA${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    rating: Math.floor(Math.random() * 5) + 1,
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test purchase order (Tier 2)
 */
export function generateTestPurchaseOrder() {
  return {
    supplier_id: 1,
    po_reference: `PO-${Date.now()}`,
    project_id: 1,
    required_by_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    line_items: [
      {
        name: 'Construction Materials',
        quantity_ordered: 50,
        unit: 'kg',
        unit_rate: 150,
      },
      {
        name: 'Labour Hours',
        quantity_ordered: 20,
        unit: 'hrs',
        unit_rate: 200,
      },
    ],
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate test goods received note (Tier 2)
 */
export function generateTestGoodsReceivedNote(poId: number) {
  return {
    po_id: poId,
    grn_date: new Date().toISOString().split('T')[0],
    received_by: 'Test Receiver',
    received_at_location: 'Site A',
    line_items: [
      {
        po_line_item_id: 1,
        quantity_received: 50,
        quality_status: 'inspected_good',
      },
    ],
    company_id: DEMO_COMPANY_ID,
  };
}

/**
 * Generate random email
 */
export function generateTestEmail(): string {
  const uuid = uuidv4().substring(0, 8);
  return `test_${uuid}@fieldcost.com`;
}

/**
 * Generate random company name
 */
export function generateCompanyName(): string {
  const adjectives = ['Golden', 'Silver', 'Blue', 'Green', 'Smart'];
  const nouns = ['Build', 'Construct', 'Develop', 'Create', 'Design'];
  const suffixes = ['Co', 'Ltd', 'Inc', 'Solutions', 'Services'];
  
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  } ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}
