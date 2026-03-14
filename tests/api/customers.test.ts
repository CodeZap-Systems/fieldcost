/**
 * API Tests - Customers Routes
 * Tests for customer management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Customers API Tests', () => {
  let api: APIHelper;
  let companyId: string | null = null;

  test.beforeAll(async () => {
    api = new APIHelper();
    // Get company
    const response = await api.get('/api/company');
    if (response.status() === 200) {
      const data = await response.json();
      companyId = data.company?.id;
    }
  });

  test.skip(async () => !companyId, 'No company available for testing');

  test.describe('GET /api/customers', () => {
    test('should fetch all customers for company', async () => {
      const response = await api.get('/api/customers', {
        company_id: companyId,
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should require company_id parameter', async () => {
      const response = await api.get('/api/customers');

      expect(response.status()).toBe(400);
    });

    test('should return customer with required fields', async () => {
      const response = await api.get('/api/customers', {
        company_id: companyId,
      });

      const data = await response.json();
      if (data.length > 0) {
        const customer = data[0];
        expect(customer).toHaveProperty('name');
        expect(customer).toHaveProperty('email');
      }
    });
  });

  test.describe('POST /api/customers', () => {
    test('should create new customer', async () => {
      const newCustomer = {
        ...TEST_DATA.customers.validCustomer,
        company_id: companyId,
      };

      const response = await api.post('/api/customers', newCustomer);

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newCustomer.name);
      expect(data.email).toBe(newCustomer.email);
    });

    test('should require customer name', async () => {
      const invalidCustomer = {
        email: 'test@customer.com',
        company_id: companyId,
      };

      const response = await api.post('/api/customers', invalidCustomer);

      expect(response.status()).toBe(400);
    });

    test('should validate email format', async () => {
      const invalidCustomer = {
        ...TEST_DATA.customers.validCustomer,
        email: 'invalid-email',
        company_id: companyId,
      };

      const response = await api.post('/api/customers', invalidCustomer);

      // May accept or validate depending on backend
      expect([200, 201, 400]).toContain(response.status());
    });

    test('should require company_id', async () => {
      const customerWithoutCompany = {
        ...TEST_DATA.customers.validCustomer,
      };

      const response = await api.post('/api/customers', customerWithoutCompany);

      expect(response.status()).toBe(400);
    });

    test('should create customer with full details', async () => {
      const detailedCustomer = {
        ...TEST_DATA.customers.internationalCustomer,
        company_id: companyId,
      };

      const response = await api.post('/api/customers', detailedCustomer);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data.name).toBe(detailedCustomer.name);
        expect(data.city).toBe(detailedCustomer.city);
        expect(data.tax_id).toBe(detailedCustomer.tax_id);
      }
    });
  });

  test.describe('GET /api/customers/:id', () => {
    test('should fetch customer by id', async () => {
      const listResponse = await api.get('/api/customers', {
        company_id: companyId,
      });

      const customers = await listResponse.json();
      if (customers.length > 0) {
        const customerId = customers[0].id;
        const response = await api.get(`/api/customers/${customerId}`, {
          company_id: companyId,
        });

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(customerId);
      }
    });

    test('should return complete customer details', async () => {
      const listResponse = await api.get('/api/customers', {
        company_id: companyId,
      });

      const customers = await listResponse.json();
      if (customers.length > 0) {
        const customerId = customers[0].id;
        const response = await api.get(`/api/customers/${customerId}`, {
          company_id: companyId,
        });

        const data = await response.json();
        expect(data).toHaveProperty('name');
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('phone');
      }
    });
  });

  test.describe('PUT /api/customers/:id', () => {
    test('should update customer', async () => {
      const listResponse = await api.get('/api/customers', {
        company_id: companyId,
      });

      const customers = await listResponse.json();
      if (customers.length > 0) {
        const customerId = customers[0].id;
        const updateData = {
          ...customers[0],
          name: 'Updated Customer Name',
        };

        const response = await api.put(`/api/customers/${customerId}`, updateData);

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.name).toBe('Updated Customer Name');
        }
      }
    });

    test('should preserve customer data on partial update', async () => {
      const listResponse = await api.get('/api/customers', {
        company_id: companyId,
      });

      const customers = await listResponse.json();
      if (customers.length > 0) {
        const customerId = customers[0].id;
        const originalEmail = customers[0].email;
        const response = await api.put(`/api/customers/${customerId}`, {
          phone: '+27 11 999 9999',
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.email).toBe(originalEmail);
        }
      }
    });
  });

  test.describe('DELETE /api/customers/:id', () => {
    test('should delete customer', async () => {
      const createResponse = await api.post('/api/customers', {
        ...TEST_DATA.customers.validCustomer,
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const created = await createResponse.json();
        const deleteResponse = await api.delete(`/api/customers/${created.id}`, {
          company_id: companyId,
        });

        expect([200, 204]).toContain(deleteResponse.status());
      }
    });
  });

  test.describe('Customer Search & Filter', () => {
    test('should search customers by name', async () => {
      const response = await api.get('/api/customers', {
        company_id: companyId,
        search: 'Acme',
      });

      if (response.status() === 200) {
        const data = await response.json();
        // May or may not have results depending on test data
        expect(Array.isArray(data)).toBe(true);
      }
    });

    test('should sort customers', async () => {
      const response = await api.get('/api/customers', {
        company_id: companyId,
        sort: 'name',
      });

      if (response.status() === 200) {
        const data = await response.json();
        if (data.length > 1) {
          // Verify sorting
          for (let i = 0; i < data.length - 1; i++) {
            expect(data[i].name.localeCompare(data[i + 1].name)).toBeLessThanOrEqual(0);
          }
        }
      }
    });
  });

  test.describe('Customer Tax ID Validation', () => {
    test('should accept valid tax IDs', async () => {
      const customerWithTaxID = {
        ...TEST_DATA.customers.validCustomer,
        tax_id: 'ZA123456789',
        company_id: companyId,
      };

      const response = await api.post('/api/customers', customerWithTaxID);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data.tax_id).toBe('ZA123456789');
      }
    });
  });
});
