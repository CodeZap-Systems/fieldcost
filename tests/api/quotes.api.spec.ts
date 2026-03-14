import request from 'supertest';
import { generateTestQuote, generateTestQuoteLineItem, generateTestCustomer } from '../helpers/data-generator.helper';
import { createTestApiClient, ApiClient } from '../helpers/api-client.helper';
import { VALID_QUOTE_DATA, VALID_QUOTE_LINE_ITEMS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

describe('Quotes API Tests', () => {
  let client: ApiClient;
  let companyId: string;
  let customerId: string;
  let quoteId: string;

  beforeAll(async () => {
    client = await createTestApiClient(BASE_URL);
    // Get or create test company
    companyId = process.env.TEST_COMPANY_ID || '1';
    client.setCompanyId(companyId);
  });

  describe('GET /api/quotes', () => {
    test('should return list of quotes', async () => {
      const response = await client.get('/api/quotes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data[0]).toHaveProperty('id');
      expect(response.data[0]).toHaveProperty('quote_number');
    });

    test('should return empty array when no quotes exist', async () => {
      const response = await client.get('/api/quotes', { limit: 1 });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should paginate quotes', async () => {
      const response = await client.get('/api/quotes', { 
        page: 1, 
        limit: 10 
      });
      
      expect(response.status).toBe(200);
      expect(response.data.length).toBeLessThanOrEqual(10);
    });

    test('should search quotes by number', async () => {
      const response = await client.get('/api/quotes', { 
        search: 'QT-' 
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter quotes by status', async () => {
      const response = await client.get('/api/quotes', { 
        status: 'draft' 
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      // All returned quotes should be draft status if filter works
      if (response.data.length > 0) {
        response.data.forEach(quote => {
          expect(quote.status).toBe('draft');
        });
      }
    });
  });

  describe('POST /api/quotes', () => {
    test('should create quote with minimal data', async () => {
      const quoteData = {
        quote_number: `QT-${Date.now()}`,
        description: 'Test quote',
        company_id: companyId,
      };

      const response = await client.post('/api/quotes', quoteData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.quote_number).toBe(quoteData.quote_number);
      
      quoteId = response.data.id;
    });

    test('should create quote with complete data', async () => {
      const quoteData = {
        quote_number: `QT-${Date.now()}`,
        description: 'Complete quote test',
        status: 'draft',
        tax_rate: 0.1,
        discount_percentage: 5,
        company_id: companyId,
      };

      const response = await client.post('/api/quotes', quoteData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.tax_rate).toBe(0.1);
      expect(response.data.discount_percentage).toBe(5);
    });

    test('should fail without quote_number', async () => {
      const quoteData = {
        description: 'Test quote',
        company_id: companyId,
      };

      const response = await client.post('/api/quotes', quoteData);
      
      expect([400, 422]).toContain(response.status);
    });

    test('should fail without company_id', async () => {
      const quoteData = {
        quote_number: `QT-${Date.now()}`,
        description: 'Test quote',
      };

      const response = await client.post('/api/quotes', quoteData);
      
      expect([400, 422]).toContain(response.status);
    });

    test('should set default values', async () => {
      const quoteData = {
        quote_number: `QT-${Date.now()}`,
        description: 'Default values test',
        company_id: companyId,
      };

      const response = await client.post('/api/quotes', quoteData);
      
      expect(response.status).toBe(201);
      expect(response.data.status).toBeDefined();
      expect(response.data.tax_rate).toBeDefined();
    });
  });

  describe('GET /api/quotes/:id', () => {
    test('should get quote by id', async () => {
      // Create quote first
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Get test',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const response = await client.get(`/api/quotes/${quoteId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(quoteId);
      expect(response.data.quote_number).toBeDefined();
    });

    test('should return 404 for non-existent quote', async () => {
      const response = await client.get('/api/quotes/99999');
      
      expect(response.status).toBe(404);
    });

    test('should include line items in response', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'With items',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const response = await client.get(`/api/quotes/${quoteId}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.items)).toBe(true);
    });
  });

  describe('PUT /api/quotes/:id', () => {
    test('should update quote', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Update test',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const updateData = {
        description: 'Updated description',
        status: 'approved',
      };

      const response = await client.put(`/api/quotes/${quoteId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateData.description);
      expect(response.data.status).toBe(updateData.status);
    });

    test('should update tax rate', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Tax update',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const response = await client.put(`/api/quotes/${quoteId}`, {
        tax_rate: 0.15,
      });
      
      expect(response.status).toBe(200);
      expect(response.data.tax_rate).toBe(0.15);
    });

    test('should not allow duplicate quote number', async () => {
      const quoteNumber = `QT-${Date.now()}`;
      
      // Create first quote
      const create1 = await client.post('/api/quotes', {
        quote_number: quoteNumber,
        description: 'First',
        company_id: companyId,
      });

      // Try to create with same number
      const create2 = await client.post('/api/quotes', {
        quote_number: quoteNumber,
        description: 'Duplicate',
        company_id: companyId,
      });

      expect(create2.status).toBe(400);
    });
  });

  describe('DELETE /api/quotes/:id', () => {
    test('should delete quote', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Delete test',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const deleteResponse = await client.delete(`/api/quotes/${quoteId}`);
      
      expect(deleteResponse.status).toBe(200);
      
      // Verify deletion
      const getResponse = await client.get(`/api/quotes/${quoteId}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 when deleting non-existent quote', async () => {
      const response = await client.delete('/api/quotes/99999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('Quote Line Items', () => {
    test('should add line item to quote', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Line items test',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const itemData = {
        description: 'Labor - skilled',
        quantity: 40,
        unit_price: 150,
        tax_rate: 0.1,
      };

      const response = await client.post(`/api/quotes/${quoteId}/items`, itemData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.description).toBe(itemData.description);
    });

    test('should calculate line item total', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Total calculation',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const itemData = {
        description: 'Materials',
        quantity: 100,
        unit_price: 50,
      };

      const response = await client.post(`/api/quotes/${quoteId}/items`, itemData);
      
      expect(response.status).toBe(201);
      expect(response.data.total).toBe(100 * 50);
    });

    test('should get quote with totals', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Totals test',
        tax_rate: 0.1,
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      
      // Add items
      await client.post(`/api/quotes/${quoteId}/items`, {
        description: 'Item 1',
        quantity: 10,
        unit_price: 100,
      });

      const response = await client.get(`/api/quotes/${quoteId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.subtotal).toBeDefined();
      expect(response.data.total).toBeDefined();
    });

    test('should delete line item', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Delete item test',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      
      const itemResponse = await client.post(`/api/quotes/${quoteId}/items`, {
        description: 'Item to delete',
        quantity: 1,
        unit_price: 100,
      });

      const itemId = itemResponse.data.id;
      const deleteResponse = await client.delete(`/api/quotes/${quoteId}/items/${itemId}`);
      
      expect(deleteResponse.status).toBe(200);
    });
  });

  describe('Quote Status Transitions', () => {
    test('should allow draft to approved transition', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Status transition',
        status: 'draft',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const response = await client.put(`/api/quotes/${quoteId}`, {
        status: 'approved',
      });
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('approved');
    });

    test('should allow quote to be converted to invoice', async () => {
      const createResponse = await client.post('/api/quotes', {
        quote_number: `QT-${Date.now()}`,
        description: 'Convert to invoice',
        status: 'approved',
        company_id: companyId,
      });

      const quoteId = createResponse.data.id;
      const response = await client.post(`/api/quotes/${quoteId}/convert-to-invoice`, {});
      
      expect([200, 201]).toContain(response.status);
      expect(response.data.invoice_id).toBeDefined();
    });
  });
});
