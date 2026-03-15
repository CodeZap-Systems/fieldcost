/**
 * k6 Load Test - Invoice Management Endpoints
 * Tests invoice creation, pdf generation, and listing under load
 *
 * Run with:
 * k6 run tests/load/invoice-load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m30s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    'http_req_duration': [
      'p(95) < 500',
      'p(99) < 1000',
    ],
    'http_req_failed': ['rate < 0.1'],
    'checks': ['rate > 0.95'],
  },
};

// Helper to get demo user with initial data
function getDemoUserContext() {
  const demoPayload = JSON.stringify({
    company: `LoadTest Invoice ${__VU} ${Date.now()}`,
  });

  const demoParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const demoResponse = http.post(`${BASE_URL}/api/demo`, demoPayload, demoParams);

  try {
    const body = JSON.parse(demoResponse.body);
    return {
      userId: body.demoUserId || `demo-user-${__VU}`,
      customerId: body.customers?.[0]?.id || 1,
      itemId: body.items?.[0]?.id || 1,
      success: demoResponse.status < 300,
    };
  } catch (e) {
    return {
      userId: `demo-user-${__VU}`,
      customerId: 1,
      itemId: 1,
      success: false,
    };
  }
}

// Test: Create Invoice
export function createInvoice(userId, customerId, invoiceNumber) {
  group('Create Invoice (POST /api/invoices)', function () {
    const payload = JSON.stringify({
      customer_id: customerId,
      invoice_number: `INV-${__VU}-${invoiceNumber}-${Date.now()}`,
      description: 'Load test invoice',
      amount: Math.floor(Math.random() * 10000) + 1000,
      status: 'draft',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.post(`${BASE_URL}/api/invoices`, payload, params);

    check(response, {
      'create status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'create response time < 500ms': (r) => r.timings.duration < 500,
      'has invoice ID': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id !== undefined;
        } catch (e) {
          return false;
        }
      },
    });

    try {
      const body = JSON.parse(response.body);
      return body.id;
    } catch (e) {
      return null;
    }
  });
}

// Test: List Invoices
export function listInvoices(userId) {
  group('List Invoices (GET /api/invoices)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/invoices`, params);

    check(response, {
      'list status is 200': (r) => r.status === 200,
      'list response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Get Invoice Detail
export function getInvoiceDetail(userId, invoiceId) {
  if (!invoiceId) return;

  group('Get Invoice Detail (GET /api/invoices/:id)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/invoices/${invoiceId}`, params);

    check(response, {
      'get detail status is 200': (r) => r.status === 200,
      'get detail response time < 500ms': (r) => r.timings.duration < 500,
      'has invoice details': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.invoice_number !== undefined;
        } catch (e) {
          return false;
        }
      },
    });
  });
}

// Test: Update Invoice
export function updateInvoice(userId, invoiceId) {
  if (!invoiceId) return;

  group('Update Invoice (PATCH /api/invoices/:id)', function () {
    const payload = JSON.stringify({
      status: 'sent',
      updated_at: new Date().toISOString(),
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.patch(`${BASE_URL}/api/invoices/${invoiceId}`, payload, params);

    check(response, {
      'update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'update response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Generate PDF (heavier operation)
export function generateInvoicePDF(userId, invoiceId) {
  if (!invoiceId) return;

  group('Generate Invoice PDF (GET /api/invoices/:id/export/pdf)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/invoices/${invoiceId}/export/pdf`, params);

    check(response, {
      'PDF generation status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'PDF response time < 1000ms': (r) => r.timings.duration < 1000,
      'response is PDF': (r) => r.headers['Content-Type']?.includes('pdf') || r.status >= 400,
    });
  });
}

// Test: Delete Invoice
export function deleteInvoice(userId, invoiceId) {
  if (!invoiceId) return;

  group('Delete Invoice (DELETE /api/invoices/:id)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.delete(`${BASE_URL}/api/invoices/${invoiceId}`, params);

    check(response, {
      'delete status is 2xx or 204': (r) => (r.status >= 200 && r.status < 300) || r.status === 204,
      'delete response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Main test execution
export default function () {
  // Get demo user context
  const context = getDemoUserContext();
  if (!context.success) {
    console.warn(`Failed to get demo context for VU ${__VU}`);
    sleep(1);
    return;
  }

  const { userId, customerId } = context;

  // Simulate invoice management workflow
  const invoiceId = createInvoice(userId, customerId, __ITER);
  sleep(1);

  listInvoices(userId);
  sleep(0.5);

  if (invoiceId) {
    getInvoiceDetail(userId, invoiceId);
    sleep(0.5);

    // Update invoice
    updateInvoice(userId, invoiceId);
    sleep(0.5);

    // Generate PDF (heavier operation, do less frequently)
    if (__ITER % 3 === 0) {
      generateInvoicePDF(userId, invoiceId);
      sleep(2); // Give server more time after PDF generation
    } else {
      sleep(0.5);
    }

    // Delete occasionally
    if (__ITER % 7 === 0) {
      deleteInvoice(userId, invoiceId);
    }
  }
}
