/**
 * API Tests - Purchase Orders (White-label Core Feature)
 * Jest + Supertest tests for purchase order endpoints
 */
import request from 'supertest';
import { generateTestPurchaseOrder, generateTestGoodsReceivedNote } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Purchase Orders API (Core)', () => {
  let createdPOId: number;

  describe('POST /api/purchase-orders', () => {
    test('should create purchase order with line items', async () => {
      const po = generateTestPurchaseOrder();

      const response = await request(API_URL).post('/api/purchase-orders').send(po);

      expect([200, 201]).toContain(response.status);
      if (response.body.id) {
        createdPOId = response.body.id;
      }
    });

    test('should return 400 without supplier_id', async () => {
      const po = generateTestPurchaseOrder();
      delete po.supplier_id;

      const response = await request(API_URL).post('/api/purchase-orders').send(po);

      expect(response.status).toBe(400);
    });

    test('should return 400 without company_id', async () => {
      const po = generateTestPurchaseOrder();
      delete po.company_id;

      const response = await request(API_URL).post('/api/purchase-orders').send(po);

      expect(response.status).toBe(400);
    });
  });
});// moved from tier2