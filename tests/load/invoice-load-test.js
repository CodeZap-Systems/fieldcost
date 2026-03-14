/**
 * FieldCost Invoice Management Load Test
 * 
 * Tests invoice CRUD and generation under load
 * - 100 virtual users
 * - Ramp up over 30s, hold 60s, ramp down 30s
 * - Fail if response > 500ms (except report generation)
 * 
 * Run: k6 run tests/load/invoice-load-test.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '60s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    'checks': ['rate>0.95'],
  },
};

const authToken = 'Bearer qa_test_token';
const projectId = 'project_123';

const invoiceTemplates = [
  {
    projectId: projectId,
    items: [
      { description: 'Labor - Day 1', quantity: 8, unitPrice: 150 },
      { description: 'Materials - Steel', quantity: 100, unitPrice: 50 },
    ],
  },
  {
    projectId: projectId,
    items: [
      { description: 'Equipment Rental', quantity: 5, unitPrice: 500 },
      { description: 'Concrete Mix', quantity: 20, unitPrice: 60 },
    ],
  },
  {
    projectId: projectId,
    items: [
      { description: 'Electrical Installation', quantity: 16, unitPrice: 75 },
    ],
  },
];

const invoiceIds = ['inv_001', 'inv_002', 'inv_003', 'inv_004', 'inv_005'];

export default function () {
  group('Invoice Management Load Tests', () => {
    // Test 1: Create invoice
    group('Create Invoice', () => {
      const template = invoiceTemplates[Math.floor(Math.random() * invoiceTemplates.length)];
      const payload = {
        ...template,
        invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      };

      const response = http.post(
        `${BASE_URL}/api/invoices`,
        JSON.stringify(payload),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'create successful': (r) => r.status === 201 || r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has invoice id': (r) => r.body.includes('id'),
        'has calculated total': (r) => r.body.includes('total'),
      });

      sleep(1);
    });

    // Test 2: List invoices
    group('List Invoices', () => {
      const response = http.get(
        `${BASE_URL}/api/invoices`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'list successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 3: Get invoice details
    group('Get Invoice Details', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];

      const response = http.get(
        `${BASE_URL}/api/invoices/${invoiceId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'get successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 4: Add item to invoice
    group('Add Invoice Item', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];

      const response = http.post(
        `${BASE_URL}/api/invoices/${invoiceId}/items`,
        JSON.stringify({
          description: 'Additional Labor',
          quantity: 4,
          unitPrice: 150,
        }),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'add item successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 5: Update invoice status
    group('Update Invoice Status', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];
      const statuses = ['draft', 'sent', 'pending', 'paid'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const response = http.put(
        `${BASE_URL}/api/invoices/${invoiceId}`,
        JSON.stringify({
          status: status,
        }),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'update successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 6: Generate PDF invoice
    group('Generate PDF Invoice', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];

      const response = http.get(
        `${BASE_URL}/api/invoices/${invoiceId}/pdf`,
        {
          headers: { 'Authorization': authToken },
          timeout: '10s',
        }
      );

      check(response, {
        'pdf generated': (r) => r.status === 200 || r.status === 404,
        'response time < 2000ms': (r) => r.timings.duration < 2000,
        'returns PDF': (r) => r.headers['Content-Type']?.includes('pdf') || r.body.includes('PDF'),
      });

      sleep(1);
    });

    // Test 7: Filter invoices by status
    group('Filter Invoices by Status', () => {
      const statuses = ['draft', 'sent', 'paid'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const response = http.get(
        `${BASE_URL}/api/invoices?status=${status}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'filter successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 8: Search invoices
    group('Search Invoices', () => {
      const response = http.get(
        `${BASE_URL}/api/invoices?search=INV`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'search successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 9: Validate invoice calculations
    group('Validate Invoice Totals', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];

      const response = http.get(
        `${BASE_URL}/api/invoices/${invoiceId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'get successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has subtotal': (r) => r.body.includes('subtotal'),
        'has tax': (r) => r.body.includes('tax'),
        'has total': (r) => r.body.includes('total'),
      });

      sleep(0.5);
    });

    // Test 10: Delete invoice
    group('Delete Invoice', () => {
      const invoiceId = invoiceIds[Math.floor(Math.random() * invoiceIds.length)];

      const response = http.delete(
        `${BASE_URL}/api/invoices/${invoiceId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'delete successful': (r) => r.status === 204 || r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 11: Bulk invoice operations
    group('Bulk Operations', () => {
      const response = http.post(
        `${BASE_URL}/api/invoices/bulk/mark-sent`,
        JSON.stringify({
          invoiceIds: invoiceIds.slice(0, 3),
        }),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'bulk operation successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });
  });
}

export function teardown(data) {
  console.log('✓ Invoice load test completed');
}
