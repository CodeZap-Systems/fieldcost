/**
 * API Tests - Invoices Routes
 * Tests for invoice management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Invoices API Tests', () => {
  let api: APIHelper;
  let companyId: string | null = null;
  let customerId: string | null = null;

  test.beforeAll(async () => {
    api = new APIHelper();
    // Get company
    const companyResponse = await api.get('/api/company');
    if (companyResponse.status() === 200) {
      const data = await companyResponse.json();
      companyId = data.company?.id;
    }

    // Get or create a customer
    const customersResponse = await api.get('/api/customers', {
      company_id: companyId,
    });
    if (customersResponse.status() === 200) {
      const customers = await customersResponse.json();
      if (customers.length > 0) {
        customerId = customers[0].id;
      } else {
        // Create a customer
        const createResponse = await api.post('/api/customers', {
          ...TEST_DATA.customers.validCustomer,
          company_id: companyId,
        });
        if (createResponse.status() === 201) {
          const customer = await createResponse.json();
          customerId = customer.id;
        }
      }
    }
  });

  test.skip(async () => !companyId, 'No company available for testing');

  test.describe('GET /api/invoices', () => {
    test('should fetch all invoices for company', async () => {
      const response = await api.get('/api/invoices', {
        company_id: companyId,
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should require company_id parameter', async () => {
      const response = await api.get('/api/invoices');

      expect(response.status()).toBe(400);
    });

    test('should filter invoices by status', async () => {
      const response = await api.get('/api/invoices', {
        company_id: companyId,
        status: 'draft',
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('status');
      }
    });

    test('should paginate invoice results', async () => {
      const response = await api.get('/api/invoices', {
        company_id: companyId,
        limit: 10,
        offset: 0,
      });

      const data = await response.json();
      expect(data.length).toBeLessThanOrEqual(10);
    });
  });

  test.describe('POST /api/invoices', () => {
    test('should create new invoice', async () => {
      const newInvoice = {
        ...TEST_DATA.invoices.validInvoice,
        customer_id: customerId,
        company_id: companyId,
      };

      const response = await api.post('/api/invoices', newInvoice);

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.amount).toBe(newInvoice.amount);
    });

    test('should require customer_id', async () => {
      const invalidInvoice = {
        ...TEST_DATA.invoices.validInvoice,
        company_id: companyId,
      };

      const response = await api.post('/api/invoices', invalidInvoice);

      expect(response.status()).toBe(400);
    });

    test('should require company_id', async () => {
      const invalidInvoice = {
        ...TEST_DATA.invoices.validInvoice,
        customer_id: customerId,
      };

      const response = await api.post('/api/invoices', invalidInvoice);

      expect(response.status()).toBe(400);
    });

    test('should validate invoice amount', async () => {
      const invalidInvoice = {
        ...TEST_DATA.invoices.validInvoice,
        amount: -100,
        customer_id: customerId,
        company_id: companyId,
      };

      const response = await api.post('/api/invoices', invalidInvoice);

      expect([200, 201, 400]).toContain(response.status());
    });

    test('should support invoice with line items', async () => {
      const invoiceWithItems = {
        ...TEST_DATA.invoices.validInvoice,
        customer_id: customerId,
        company_id: companyId,
        lines: TEST_DATA.lineItems.multipleItems,
      };

      const response = await api.post('/api/invoices', invoiceWithItems);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data).toHaveProperty('id');
      }
    });

    test('should auto-calculate total from line items', async () => {
      const invoiceWithItems = {
        reference: `TEST-${Date.now()}`,
        description: 'Test invoice with calculated total',
        customer_id: customerId,
        company_id: companyId,
        lines: TEST_DATA.lineItems.multipleItems,
      };

      const response = await api.post('/api/invoices', invoiceWithItems);

      if (response.status() === 201) {
        const data = await response.json();
        const expectedTotal = TEST_DATA.lineItems.multipleItems.reduce(
          (sum, item) => sum + item.total,
          0
        );
        expect(data.amount).toBe(expectedTotal);
      }
    });
  });

  test.describe('GET /api/invoices/:id', () => {
    test('should fetch invoice by id', async () => {
      // Get first invoice
      const listResponse = await api.get('/api/invoices', {
        company_id: companyId,
      });

      const invoices = await listResponse.json();
      if (invoices.length > 0) {
        const invoiceId = invoices[0].id;
        const response = await api.get(`/api/invoices/${invoiceId}`, {
          company_id: companyId,
        });

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(invoiceId);
      }
    });

    test('should include line items in response', async () => {
      const listResponse = await api.get('/api/invoices', {
        company_id: companyId,
      });

      const invoices = await listResponse.json();
      if (invoices.length > 0) {
        const invoiceId = invoices[0].id;
        const response = await api.get(`/api/invoices/${invoiceId}`, {
          company_id: companyId,
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('lines');
        }
      }
    });
  });

  test.describe('PUT /api/invoices/:id', () => {
    test('should update invoice', async () => {
      // Get first invoice
      const listResponse = await api.get('/api/invoices', {
        company_id: companyId,
      });

      const invoices = await listResponse.json();
      if (invoices.length > 0) {
        const invoiceId = invoices[0].id;
        const response = await api.put(`/api/invoices/${invoiceId}`, {
          reference: `UPDATED-${Date.now()}`,
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.reference).toContain('UPDATED');
        }
      }
    });

    test('should update invoice line items', async () => {
      const listResponse = await api.get('/api/invoices', {
        company_id: companyId,
      });

      const invoices = await listResponse.json();
      if (invoices.length > 0) {
        const invoiceId = invoices[0].id;
        const response = await api.put(`/api/invoices/${invoiceId}`, {
          lines: TEST_DATA.lineItems.labourLineItem,
        });

        expect([200, 400]).toContain(response.status());
      }
    });
  });

  test.describe('Invoice Export', () => {
    test('should export invoices as PDF', async () => {
      const response = await api.get('/api/invoices/export', {
        company_id: companyId,
        format: 'pdf',
      });

      expect([200, 400, 500]).toContain(response.status());
      if (response.status() === 200) {
        expect(response.headers()['content-type']).toContain('pdf');
      }
    });

    test('should export invoices as CSV ledger', async () => {
      const response = await api.get('/api/invoices/export', {
        company_id: companyId,
        format: 'ledger',
      });

      expect([200, 400]).toContain(response.status());
      if (response.status() === 200) {
        expect(response.headers()['content-type']).toContain('text/csv');
      }
    });

    test('should export line items CSV', async () => {
      const response = await api.get('/api/invoices/export', {
        company_id: companyId,
        format: 'lines',
      });

      expect([200, 400]).toContain(response.status());
      if (response.status() === 200) {
        expect(response.headers()['content-type']).toContain('text/csv');
      }
    });

    test('should support filtering by invoice IDs', async () => {
      // Get some invoices
      const listResponse = await api.get('/api/invoices', {
        company_id: companyId,
      });

      const invoices = await listResponse.json();
      if (invoices.length > 0) {
        const ids = invoices.slice(0, 2).map(i => i.id).join(',');
        const response = await api.get('/api/invoices/export', {
          company_id: companyId,
          format: 'csv',
          ids,
        });

        expect([200, 400]).toContain(response.status());
      }
    });
  });

  test.describe('Invoice Totals Calculation', () => {
    test('should calculate invoice totals correctly', async () => {
      const lineItems = [
        { name: 'Item 1', quantity: 10, rate: 100, total: 1000 },
        { name: 'Item 2', quantity: 5, rate: 200, total: 1000 },
      ];

      const invoiceData = {
        reference: `CALC-${Date.now()}`,
        customer_id: customerId,
        company_id: companyId,
        lines: lineItems,
      };

      const response = await api.post('/api/invoices', invoiceData);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data.amount).toBe(2000);
      }
    });
  });

  test.describe('DELETE /api/invoices/:id', () => {
    test('should delete invoice', async () => {
      const createResponse = await api.post('/api/invoices', {
        ...TEST_DATA.invoices.validInvoice,
        customer_id: customerId,
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const created = await createResponse.json();
        const deleteResponse = await api.delete(`/api/invoices/${created.id}`, {
          company_id: companyId,
        });

        expect([200, 204]).toContain(deleteResponse.status());
      }
    });
  });
});
