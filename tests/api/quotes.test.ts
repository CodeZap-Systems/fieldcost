/**
 * API Test Suite - Quotes
 * Tests for quote endpoints using Jest and Supertest
 */

import request from 'supertest';
import { SAMPLE_QUOTE, generateTestQuote } from '../fixtures/documents';

const BASE_URL = 'http://localhost:3000';

describe('Quotes API - Jest Tests', () => {
  let quoteId: number;
  let authToken: string;
  
  beforeAll(async () => {
    // Setup auth token
  });

  describe('POST /api/quotes - Create Quote', () => {
    test('API-101: Should create quote with valid data', async () => {
      const quote = generateTestQuote();
      
      const response = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customer_id).toBe(quote.customerId);
      expect(response.body.amount).toBe(quote.amount);
      
      quoteId = response.body.id;
    });

    test('API-102: Should create quote with valid_until date', async () => {
      const quote = generateTestQuote({
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      const response = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('valid_until');
    });

    test('API-103: Should validate customer_id', async () => {
      const quote = generateTestQuote();
      delete (quote as any).customerId;
      
      const response = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      expect(response.status).toBe(400);
    });

    test('API-104: Should create quote with multiple line items', async () => {
      const quote = generateTestQuote();
      
      const response = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      expect(response.status).toBe(201);
      expect(Array.isArray(response.body.line_items || response.body.lines)).toBe(true);
    });

    test('API-105: Should set initial status to draft', async () => {
      const quote = generateTestQuote();
      
      const response = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('draft');
    });
  });

  describe('GET /api/quotes - Fetch Quotes', () => {
    test('API-106: Should fetch all quotes', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-107: Should filter quotes by status', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, status: 'accepted' });
      
      expect(response.status).toBe(200);
      
      response.body.forEach((quote: any) => {
        expect(quote.status).toBe('accepted');
      });
    });

    test('API-108: Should filter quotes expiring soon', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, expiring: 'true' });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-109: Should include customer and line items', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      
      if (response.body.length > 0) {
        const quote = response.body[0];
        expect(quote).toHaveProperty('customer');
        expect(Array.isArray(quote.line_items || quote.lines)).toBe(true);
      }
    });
  });

  describe('PATCH /api/quotes/{id} - Update Quote', () => {
    test('API-110: Should accept quote', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const id = createResponse.body.id;
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'accepted' });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('accepted');
    });

    test('API-111: Should reject quote with reason', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const id = createResponse.body.id;
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          status: 'rejected',
          rejection_reason: 'Price too high'
        });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('rejected');
    });

    test('API-112: Should convert quote to invoice', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const quoteId = createResponse.body.id;
      
      const convertResponse = await request(BASE_URL)
        .post(`/api/quotes/${quoteId}/convert-to-invoice`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(convertResponse.status).toBe(201);
      expect(convertResponse.body).toHaveProperty('invoice_id');
    });

    test('API-113: Should not allow status changes after acceptance', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const id = createResponse.body.id;
      
      // Accept quote first
      await request(BASE_URL)
        .patch(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'accepted' });
      
      // Try to change back to draft
      const updateResponse = await request(BASE_URL)
        .patch(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'draft' });
      
      expect(updateResponse.status).toBe(400);
    });
  });

  describe('DELETE /api/quotes/{id} - Delete Quote', () => {
    test('API-114: Should delete draft quote', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const id = createResponse.body.id;
      
      const deleteResponse = await request(BASE_URL)
        .delete(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(deleteResponse.status).toBe(200);
    });

    test('API-115: Should not delete accepted quote', async () => {
      const quote = generateTestQuote();
      const createResponse = await request(BASE_URL)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(quote);
      
      const id = createResponse.body.id;
      
      // Accept quote
      await request(BASE_URL)
        .patch(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'accepted' });
      
      // Try to delete
      const deleteResponse = await request(BASE_URL)
        .delete(`/api/quotes/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(deleteResponse.status).toBe(403);
    });
  });

  describe('GET /api/quotes/expiring - Expiring Quotes', () => {
    test('API-116: Should get quotes expiring within 7 days', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes/expiring')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, days: 7 });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-117: Should calculate days until expiration', async () => {
      const response = await request(BASE_URL)
        .get('/api/quotes/expiring')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, days: 30 });
      
      expect(response.status).toBe(200);
      
      response.body.forEach((quote: any) => {
        expect(quote).toHaveProperty('days_until_expiration');
        expect(quote.days_until_expiration).toBeLessThanOrEqual(30);
      });
    });
  });
});
