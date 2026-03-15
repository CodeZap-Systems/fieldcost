/**
 * API Tests - Suppliers (Tier 2 Feature)
 * Jest + Supertest tests for supplier endpoints
 */

import request from 'supertest';
import { generateTestSupplier } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Suppliers API (Tier 2)', () => {
  let createdSupplierId: number;

  describe('POST /api/suppliers', () => {
    test('should create new supplier', async () => {
      const supplier = generateTestSupplier();

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect([200, 201]).toContain(response.status);
      if (response.body.id) {
        createdSupplierId = response.body.id;
      }
    });

    test('should return 400 without vendor_name', async () => {
      const supplier = generateTestSupplier();
      delete supplier.vendor_name;

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect(response.status).toBe(400);
    });

    test('should return 400 without company_id', async () => {
      const supplier = generateTestSupplier();
      delete supplier.company_id;

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect(response.status).toBe(400);
    });

    test('should validate email format', async () => {
      const supplier = generateTestSupplier();
      supplier.email = 'invalid-email';

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });

    test('should allow optional fields', async () => {
      const supplier = generateTestSupplier();
      delete supplier.phone;
      delete supplier.address_line1;

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect([200, 201]).toContain(response.status);
    });

    test('should store rating between 1-5', async () => {
      const supplier = generateTestSupplier();
      supplier.rating = 4;

      const response = await request(API_URL).post('/api/suppliers').send(supplier);

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('GET /api/suppliers', () => {
    test('should list suppliers for company', async () => {
      const response = await request(API_URL)
        .get('/api/suppliers')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter suppliers by rating', async () => {
      const response = await request(API_URL)
        .get('/api/suppliers')
        .query({ company_id: 8, min_rating: 3 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/suppliers');

      expect(response.status).toBe(400);
    });

    test('should handle pagination', async () => {
      const response = await request(API_URL)
        .get('/api/suppliers')
        .query({ company_id: 8, limit: 10, offset: 0 });

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/suppliers/:id', () => {
    test('should update supplier details', async () => {
      if (!createdSupplierId) {
        const supplier = generateTestSupplier();
        const createResponse = await request(API_URL).post('/api/suppliers').send(supplier);
        createdSupplierId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/suppliers/${createdSupplierId}`)
        .send({
          company_id: 8,
          payment_terms: 'Net 60',
          rating: 5,
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should validate email format on update', async () => {
      if (!createdSupplierId) {
        const supplier = generateTestSupplier();
        const createResponse = await request(API_URL).post('/api/suppliers').send(supplier);
        createdSupplierId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/suppliers/${createdSupplierId}`)
        .send({
          company_id: 8,
          email: 'invalid',
        });

      expect(response.status).toBe(400);
    });

    test('should return 400 for invalid supplier id', async () => {
      const response = await request(API_URL)
        .patch('/api/suppliers/99999')
        .send({
          company_id: 8,
          payment_terms: 'Net 30',
        });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('DELETE /api/suppliers/:id', () => {
    test('should delete supplier if no active POs', async () => {
      const supplier = generateTestSupplier();
      const createResponse = await request(API_URL).post('/api/suppliers').send(supplier);
      const supplierId = createResponse.body.id;

      const response = await request(API_URL)
        .delete(`/api/suppliers/${supplierId}`)
        .query({ company_id: 8 });

      expect([200, 204]).toContain(response.status);
    });

    test('should return 400 for invalid supplier id', async () => {
      const response = await request(API_URL)
        .delete('/api/suppliers/99999')
        .query({ company_id: 8 });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
