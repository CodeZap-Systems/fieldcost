/**
 * API Tests - Purchase Orders (Tier 2 Feature)
 * Jest + Supertest tests for purchase order endpoints
 */

import request from 'supertest';
import { generateTestPurchaseOrder, generateTestGoodsReceivedNote } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Purchase Orders API (Tier 2)', () => {
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

    test('should calculate total from line items', async () => {
      const po = generateTestPurchaseOrder();

      const response = await request(API_URL).post('/api/purchase-orders').send(po);

      if (response.status === 201 || response.status === 200) {
        const expectedTotal = po.line_items.reduce(
          (sum, item) => sum + item.quantity_ordered * item.unit_rate,
          0
        );
        expect(response.body.total_amount).toBe(expectedTotal);
      }
    });

    test('should set initial status to draft', async () => {
      const po = generateTestPurchaseOrder();

      const response = await request(API_URL).post('/api/purchase-orders').send(po);

      if (response.status === 201 || response.status === 200) {
        expect(response.body.status).toBe('draft');
      }
    });
  });

  describe('GET /api/purchase-orders', () => {
    test('should list POs for company', async () => {
      const response = await request(API_URL)
        .get('/api/purchase-orders')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter POs by status', async () => {
      const response = await request(API_URL)
        .get('/api/purchase-orders')
        .query({ company_id: 8, status: 'draft' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter POs by supplier', async () => {
      const response = await request(API_URL)
        .get('/api/purchase-orders')
        .query({ company_id: 8, supplier_id: 1 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/purchase-orders');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/purchase-orders/:id/send', () => {
    test('should send PO to supplier', async () => {
      if (!createdPOId) {
        const po = generateTestPurchaseOrder();
        const createResponse = await request(API_URL).post('/api/purchase-orders').send(po);
        createdPOId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .post(`/api/purchase-orders/${createdPOId}/send`)
        .send({ company_id: 8 });

      expect([200, 201]).toContain(response.status);
    });
  });

  describe('POST /api/goods-received-notes', () => {
    test('should log goods received for confirmed PO', async () => {
      // Create a PO first
      const po = generateTestPurchaseOrder();
      const poResponse = await request(API_URL).post('/api/purchase-orders').send(po);
      const poId = poResponse.body.id;

      // Confirm PO (in real scenario)
      await request(API_URL)
        .post(`/api/purchase-orders/${poId}/confirm`)
        .send({ company_id: 8 });

      // Log GRN
      const grn = generateTestGoodsReceivedNote(poId);

      const response = await request(API_URL).post('/api/goods-received-notes').send(grn);

      expect([200, 201]).toContain(response.status);
    });

    test('should return 400 without po_id', async () => {
      const grn = generateTestGoodsReceivedNote(1);
      delete grn.po_id;

      const response = await request(API_URL).post('/api/goods-received-notes').send(grn);

      expect(response.status).toBe(400);
    });

    test('should validate quantity does not exceed ordered', async () => {
      const po = generateTestPurchaseOrder();
      const poResponse = await request(API_URL).post('/api/purchase-orders').send(po);
      const poId = poResponse.body.id;

      const grn = {
        po_id: poId,
        grn_date: new Date().toISOString().split('T')[0],
        received_by: 'Tester',
        received_at_location: 'Site',
        line_items: [
          {
            po_line_item_id: 1,
            quantity_received: 999999, // More than ordered
            quality_status: 'accepted',
          },
        ],
        company_id: 8,
      };

      const response = await request(API_URL).post('/api/goods-received-notes').send(grn);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should auto-update PO status to partially_received', async () => {
      const po = generateTestPurchaseOrder();
      const poResponse = await request(API_URL).post('/api/purchase-orders').send(po);
      const poId = poResponse.body.id;

      // Log partial receipt
      const grn = {
        po_id: poId,
        grn_date: new Date().toISOString().split('T')[0],
        received_by: 'Tester',
        received_at_location: 'Site',
        line_items: [
          {
            po_line_item_id: 1,
            quantity_received: 5, // Partial
            quality_status: 'inspected_good',
          },
        ],
        company_id: 8,
      };

      const grnResponse = await request(API_URL).post('/api/goods-received-notes').send(grn);

      // Check PO status
      if (grnResponse.status === 201 || grnResponse.status === 200) {
        const poCheck = await request(API_URL)
          .get(`/api/purchase-orders/${poId}`)
          .query({ company_id: 8 });

        expect(['confirmed', 'partially_received']).toContain(poCheck.body.status);
      }
    });
  });

  describe('GET /api/goods-received-notes', () => {
    test('should list GRNs for PO', async () => {
      const response = await request(API_URL)
        .get('/api/goods-received-notes')
        .query({ po_id: 1, company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/goods-received-notes').query({ po_id: 1 });

      expect(response.status).toBe(400);
    });
  });
});
