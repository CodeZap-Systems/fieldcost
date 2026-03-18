/**
 * API Tests - Suppliers (White-label Core Feature)
 * Jest + Supertest tests for supplier endpoints
 */
import request from 'supertest';
import { generateTestSupplier } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Suppliers API (Core)', () => {
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
  });
});// moved from tier2