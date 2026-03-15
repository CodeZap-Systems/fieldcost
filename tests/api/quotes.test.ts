/**
 * API Tests - Quotes (Tier 2 Feature)
 * Jest + Supertest tests for quotation endpoints
 */

import request from 'supertest';
import { generateTestQuote } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Quotes API (Tier 2)', () => {
  let createdQuoteId: number;

  describe('POST /api/quotes', () => {
    test('should create quote with line items', async () => {
      const quote = generateTestQuote();

      const response = await request(API_URL).post('/api/quotes').send(quote);

      expect([200, 201]).toContain(response.status);
      if (response.status === 201 || response.status === 200) {
        expect(response.body).toHaveProperty('id');
        createdQuoteId = response.body.id;
      }
    });

    test('should return 400 without customer_id', async () => {
      const quote = generateTestQuote();
      delete quote.customer_id;

      const response = await request(API_URL).post('/api/quotes').send(quote);

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should return 400 without company_id', async () => {
      const quote = generateTestQuote();
      delete quote.company_id;

      const response = await request(API_URL).post('/api/quotes').send(quote);

      expect(response.status).toBe(400);
    });

    test('should calculate total from line items', async () => {
      const quote = generateTestQuote();

      const response = await request(API_URL).post('/api/quotes').send(quote);

      if (response.status === 201 || response.status === 200) {
        const expectedTotal = quote.line_items.reduce(
          (sum, item) => sum + item.quantity * item.rate,
          0
        );
        expect(response.body.total_amount).toBe(expectedTotal);
      }
    });

    test('should allow empty description', async () => {
      const quote = generateTestQuote();
      quote.description = '';

      const response = await request(API_URL).post('/api/quotes').send(quote);

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('GET /api/quotes', () => {
    test('should list quotes for company', async () => {
      const response = await request(API_URL)
        .get('/api/quotes')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter quotes by status', async () => {
      const response = await request(API_URL)
        .get('/api/quotes')
        .query({ company_id: 8, status: 'draft' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter quotes by customer', async () => {
      const response = await request(API_URL)
        .get('/api/quotes')
        .query({ company_id: 8, customer_id: 1 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/quotes');

      expect(response.status).toBe(400);
    });

    test('should return empty array for non-existent customer', async () => {
      const response = await request(API_URL)
        .get('/api/quotes')
        .query({ company_id: 8, customer_id: 99999 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PATCH /api/quotes/:id', () => {
    test('should update draft quote', async () => {
      if (!createdQuoteId) {
        const quote = generateTestQuote();
        const createResponse = await request(API_URL).post('/api/quotes').send(quote);
        createdQuoteId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/quotes/${createdQuoteId}`)
        .send({
          company_id: 8,
          description: 'Updated description',
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should return 400 for invalid quote id', async () => {
      const response = await request(API_URL).patch('/api/quotes/99999').send({
        company_id: 8,
        description: 'Updated',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should allow updating line items', async () => {
      if (!createdQuoteId) {
        const quote = generateTestQuote();
        const createResponse = await request(API_URL).post('/api/quotes').send(quote);
        createdQuoteId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/quotes/${createdQuoteId}`)
        .send({
          company_id: 8,
          line_items: [
            {
              name: 'Updated Service',
              quantity: 5,
              unit: 'hrs',
              rate: 200,
            },
          ],
        });

      expect([200, 204]).toContain(response.status);
    });
  });

  describe('POST /api/quotes/:id/send', () => {
    test('should send quote to customer', async () => {
      if (!createdQuoteId) {
        const quote = generateTestQuote();
        const createResponse = await request(API_URL).post('/api/quotes').send(quote);
        createdQuoteId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .post(`/api/quotes/${createdQuoteId}/send`)
        .send({ company_id: 8 });

      expect([200, 201]).toContain(response.status);
    });

    test('should return 400 for invalid quote id', async () => {
      const response = await request(API_URL)
        .post('/api/quotes/99999/send')
        .send({ company_id: 8 });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('DELETE /api/quotes/:id', () => {
    test('should delete draft quote', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(API_URL).post('/api/quotes').send(quote);
      const quoteId = createResponse.body.id;

      const response = await request(API_URL)
        .delete(`/api/quotes/${quoteId}`)
        .query({ company_id: 8 });

      expect([200, 204]).toContain(response.status);
    });

    test('should return 400 for invalid quote id', async () => {
      const response = await request(API_URL)
        .delete('/api/quotes/99999')
        .query({ company_id: 8 });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
