import request from 'supertest';
import { createTestApiClient, ApiClient } from '../helpers/api-client.helper';
import { VALID_PURCHASE_ORDER_DATA, VALID_PO_LINE_ITEMS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

describe('Purchase Orders API Tests', () => {
  let client: ApiClient;
  let companyId: string;
  let vendorId: string;
  let itemId: string;
  let poId: string;

  beforeAll(async () => {
    client = await createTestApiClient(BASE_URL);
    companyId = process.env.TEST_COMPANY_ID || '1';
    client.setCompanyId(companyId);
  });

  describe('GET /api/purchase-orders', () => {
    test('should return list of purchase orders', async () => {
      const response = await client.get('/api/purchase-orders');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      if (response.data.length > 0) {
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('po_number');
      }
    });

    test('should return empty array when no POs exist', async () => {
      const response = await client.get('/api/purchase-orders');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should paginate purchase orders', async () => {
      const response = await client.get('/api/purchase-orders', { 
        page: 1, 
        limit: 10 
      });
      
      expect(response.status).toBe(200);
      expect(response.data.length).toBeLessThanOrEqual(10);
    });

    test('should search purchase orders by number', async () => {
      const response = await client.get('/api/purchase-orders', { 
        search: 'PO-' 
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter purchase orders by status', async () => {
      const response = await client.get('/api/purchase-orders', { 
        status: 'draft' 
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      if (response.data.length > 0) {
        response.data.forEach(po => {
          expect(po.status).toBe('draft');
        });
      }
    });

    test('should filter by vendor', async () => {
      const response = await client.get('/api/purchase-orders', { 
        vendor_id: '1' 
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter by date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const response = await client.get('/api/purchase-orders', {
        start_date: startDate.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('POST /api/purchase-orders', () => {
    test('should create PO with minimal data', async () => {
      const poData = {
        po_number: `PO-${Date.now()}`,
        description: 'Test PO',
        vendor_id: '1',
        company_id: companyId,
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.po_number).toBe(poData.po_number);
      
      poId = response.data.id;
    });

    test('should create PO with complete data', async () => {
      const poData = {
        po_number: `PO-${Date.now()}`,
        description: 'Complete PO test',
        vendor_id: '1',
        status: 'draft',
        tax_rate: 0.1,
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        company_id: companyId,
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.tax_rate).toBe(0.1);
      expect(response.data.status).toBe('draft');
    });

    test('should fail without po_number', async () => {
      const poData = {
        description: 'Test PO',
        vendor_id: '1',
        company_id: companyId,
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect([400, 422]).toContain(response.status);
    });

    test('should fail without company_id', async () => {
      const poData = {
        po_number: `PO-${Date.now()}`,
        description: 'Test PO',
        vendor_id: '1',
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect([400, 422]).toContain(response.status);
    });

    test('should fail without vendor_id', async () => {
      const poData = {
        po_number: `PO-${Date.now()}`,
        description: 'Test PO',
        company_id: companyId,
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect([400, 422]).toContain(response.status);
    });

    test('should set default values', async () => {
      const poData = {
        po_number: `PO-${Date.now()}`,
        description: 'Default values test',
        vendor_id: '1',
        company_id: companyId,
      };

      const response = await client.post('/api/purchase-orders', poData);
      
      expect(response.status).toBe(201);
      expect(response.data.status).toBeDefined();
      expect(response.data.order_date).toBeDefined();
    });
  });

  describe('GET /api/purchase-orders/:id', () => {
    test('should get PO by id', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Get test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.get(`/api/purchase-orders/${poId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(poId);
      expect(response.data.po_number).toBeDefined();
    });

    test('should return 404 for non-existent PO', async () => {
      const response = await client.get('/api/purchase-orders/99999');
      
      expect(response.status).toBe(404);
    });

    test('should include line items in response', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'With items',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.get(`/api/purchase-orders/${poId}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.items)).toBe(true);
    });

    test('should include vendor details', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Vendor details test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.get(`/api/purchase-orders/${poId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.vendor).toBeDefined();
    });
  });

  describe('PUT /api/purchase-orders/:id', () => {
    test('should update PO', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Update test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const updateData = {
        description: 'Updated description',
        status: 'approved',
      };

      const response = await client.put(`/api/purchase-orders/${poId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateData.description);
      expect(response.data.status).toBe(updateData.status);
    });

    test('should update tax rate', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Tax update',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.put(`/api/purchase-orders/${poId}`, {
        tax_rate: 0.15,
      });
      
      expect(response.status).toBe(200);
      expect(response.data.tax_rate).toBe(0.15);
    });

    test('should update expected delivery date', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Delivery date update',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 20);
      
      const response = await client.put(`/api/purchase-orders/${poId}`, {
        expected_delivery: newDate.toISOString().split('T')[0],
      });
      
      expect(response.status).toBe(200);
      expect(response.data.expected_delivery).toBe(newDate.toISOString().split('T')[0]);
    });

    test('should not allow duplicate PO number', async () => {
      const poNumber = `PO-${Date.now()}`;
      
      const create1 = await client.post('/api/purchase-orders', {
        po_number: poNumber,
        description: 'First',
        vendor_id: '1',
        company_id: companyId,
      });

      const create2 = await client.post('/api/purchase-orders', {
        po_number: poNumber,
        description: 'Duplicate',
        vendor_id: '1',
        company_id: companyId,
      });

      expect(create2.status).toBe(400);
    });
  });

  describe('DELETE /api/purchase-orders/:id', () => {
    test('should delete PO', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Delete test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const deleteResponse = await client.delete(`/api/purchase-orders/${poId}`);
      
      expect(deleteResponse.status).toBe(200);
      
      const getResponse = await client.get(`/api/purchase-orders/${poId}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 404 when deleting non-existent PO', async () => {
      const response = await client.delete('/api/purchase-orders/99999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('Purchase Order Line Items', () => {
    test('should add line item to PO', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Line items test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const itemData = {
        item_id: '1',
        description: VALID_PO_LINE_ITEMS.materials.description,
        quantity: VALID_PO_LINE_ITEMS.materials.quantity,
        unit_price: VALID_PO_LINE_ITEMS.materials.unit_price,
      };

      const response = await client.post(`/api/purchase-orders/${poId}/items`, itemData);
      
      expect(response.status).toBe(201);
      expect(response.data.id).toBeDefined();
      expect(response.data.description).toBe(itemData.description);
    });

    test('should calculate line item total', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Total calculation',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const itemData = {
        description: 'Materials',
        quantity: 100,
        unit_price: 50,
      };

      const response = await client.post(`/api/purchase-orders/${poId}/items`, itemData);
      
      expect(response.status).toBe(201);
      expect(response.data.total).toBe(100 * 50);
    });

    test('should get PO with totals', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Totals test',
        vendor_id: '1',
        tax_rate: 0.1,
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      
      await client.post(`/api/purchase-orders/${poId}/items`, {
        description: 'Item 1',
        quantity: 10,
        unit_price: 100,
      });

      const response = await client.get(`/api/purchase-orders/${poId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.subtotal).toBeDefined();
      expect(response.data.total).toBeDefined();
    });

    test('should delete line item', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Delete item test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      
      const itemResponse = await client.post(`/api/purchase-orders/${poId}/items`, {
        description: 'Item to delete',
        quantity: 1,
        unit_price: 100,
      });

      const itemId = itemResponse.data.id;
      const deleteResponse = await client.delete(`/api/purchase-orders/${poId}/items/${itemId}`);
      
      expect(deleteResponse.status).toBe(200);
    });

    test('should update line item quantity', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Update item test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      
      const itemResponse = await client.post(`/api/purchase-orders/${poId}/items`, {
        description: 'Item quantity update',
        quantity: 10,
        unit_price: 100,
      });

      const itemId = itemResponse.data.id;
      const updateResponse = await client.put(`/api/purchase-orders/${poId}/items/${itemId}`, {
        quantity: 20,
      });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.data.quantity).toBe(20);
    });
  });

  describe('Purchase Order Status Transitions', () => {
    test('should allow draft to approved transition', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Status transition',
        vendor_id: '1',
        status: 'draft',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.put(`/api/purchase-orders/${poId}`, {
        status: 'approved',
      });
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('approved');
    });

    test('should allow approved to received transition', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Receive test',
        vendor_id: '1',
        status: 'approved',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.put(`/api/purchase-orders/${poId}`, {
        status: 'received',
      });
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('received');
    });

    test('should calculate received date', async () => {
      const createResponse = await client.post('/api/purchase-orders', {
        po_number: `PO-${Date.now()}`,
        description: 'Received date test',
        vendor_id: '1',
        company_id: companyId,
      });

      const poId = createResponse.data.id;
      const response = await client.put(`/api/purchase-orders/${poId}`, {
        status: 'received',
      });
      
      expect(response.status).toBe(200);
      expect(response.data.received_date).toBeDefined();
    });
  });

  describe('Purchase Order Reporting', () => {
    test('should generate PO report', async () => {
      const response = await client.get('/api/purchase-orders/report', {
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });
      
      expect([200, 404]).toContain(response.status);
    });

    test('should export PO as CSV', async () => {
      const response = await client.get('/api/purchase-orders/export/csv', {
        format: 'csv',
      });
      
      expect([200, 404]).toContain(response.status);
    });
  });
});
