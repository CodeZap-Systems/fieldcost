/**
 * API Tests - Quotes (White-label Core Feature)
 * Jest + Supertest tests for quotation endpoints
 */
import request from 'supertest';
import { generateTestQuote } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Quotes API (Core)', () => {
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
  });
});// moved from tier2