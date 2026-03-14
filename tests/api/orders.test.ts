/**
 * API Test Suite - Purchase Orders
 * Tests for purchase order endpoints using Jest and Supertest
 */

import request from 'supertest';
import { SAMPLE_ORDER, generateTestOrder } from '../fixtures/documents';

const BASE_URL = 'http://localhost:3000';

describe('Purchase Orders API - Jest Tests', () => {
  let orderId: number;
  let authToken: string;
  
  beforeAll(async () => {
    // Setup auth token
  });

  describe('POST /api/orders - Create Purchase Order', () => {
    test('API-201: Should create purchase order', async () => {
      const order = generateTestOrder();
      
      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customer_id).toBe(order.customerId);
      expect(response.body.amount).toBe(order.amount);
      
      orderId = response.body.id;
    });

    test('API-202: Should create order with vendor information', async () => {
      const order = generateTestOrder();
      
      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('vendor_id');
      expect(response.body).toHaveProperty('vendor_name');
    });

    test('API-203: Should set delivery date', async () => {
      const deliveryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const order = generateTestOrder({ deliveryDate });
      
      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      expect(response.status).toBe(201);
      expect(response.body.delivery_date).toBe(deliveryDate);
    });

    test('API-204: Should validate required fields', async () => {
      const order = generateTestOrder();
      delete (order as any).customerId;
      
      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('API-205: Should set initial status to draft', async () => {
      const order = generateTestOrder();
      
      const response = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('draft');
    });
  });

  describe('GET /api/orders - Fetch Purchase Orders', () => {
    test('API-206: Should fetch all purchase orders', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-207: Should filter by status', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, status: 'confirmed' });
      
      expect(response.status).toBe(200);
      
      response.body.forEach((order: any) => {
        expect(order.status).toBe('confirmed');
      });
    });

    test('API-208: Should filter by date range', async () => {
      const fromDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];
      
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, from: fromDate, to: toDate });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-209: Should search by reference', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1, search: 'PO-' });
      
      expect(response.status).toBe(200);
    });

    test('API-210: Should include line items in response', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      
      if (response.body.length > 0) {
        expect(Array.isArray(response.body[0].line_items || response.body[0].lines)).toBe(true);
      }
    });
  });

  describe('PATCH /api/orders/{id} - Update Purchase Order', () => {
    test('API-211: Should confirm purchase order', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'confirmed' });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('confirmed');
    });

    test('API-212: Should mark order as delivered', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      // First confirm
      await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'confirmed' });
      
      // Then mark delivered
      const updateResponse = await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'delivered' });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('delivered');
    });

    test('API-213: Should handle partial delivery', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          status: 'delivered',
          received_quantities: [50, 100] // Partial quantities
        });
      
      expect(updateResponse.status).toBe(200);
    });

    test('API-214: Should cancel order with reason', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ 
          status: 'cancelled',
          cancellation_reason: 'No longer needed'
        });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.status).toBe('cancelled');
    });

    test('API-215: Should update delivery date', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      const newDate = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const updateResponse = await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ delivery_date: newDate });
      
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.delivery_date).toBe(newDate);
    });
  });

  describe('DELETE /api/orders/{id} - Delete Purchase Order', () => {
    test('API-216: Should delete draft order', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const deleteResponse = await request(BASE_URL)
        .delete(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(deleteResponse.status).toBe(200);
    });

    test('API-217: Should not delete confirmed order', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      // Confirm order
      await request(BASE_URL)
        .patch(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'confirmed' });
      
      // Try to delete
      const deleteResponse = await request(BASE_URL)
        .delete(`/api/orders/${id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(deleteResponse.status).toBe(403);
    });
  });

  describe('POST /api/orders/{id}/receive - Receive Goods', () => {
    test('API-218: Should record full receipt', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const receiveResponse = await request(BASE_URL)
        .post(`/api/orders/${id}/receive`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          received_quantities: order.lines.map(line => line.quantity),
          notes: 'All items received in good condition'
        });
      
      expect(receiveResponse.status).toBe(200);
      expect(receiveResponse.body.status).toBe('delivered');
    });

    test('API-219: Should record partial receipt', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const receiveResponse = await request(BASE_URL)
        .post(`/api/orders/${id}/receive`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          received_quantities: [50, 50], // Less than ordered
          notes: 'Partial delivery'
        });
      
      expect(receiveResponse.status).toBe(200);
      expect(receiveResponse.body).toHaveProperty('status');
    });

    test('API-220: Should validate received quantities', async () => {
      const order = generateTestOrder();
      const createResponse = await request(BASE_URL)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(order);
      
      const id = createResponse.body.id;
      
      const receiveResponse = await request(BASE_URL)
        .post(`/api/orders/${id}/receive`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          received_quantities: [1000, 1000] // More than ordered
        });
      
      expect(receiveResponse.status).toBe(400);
    });
  });

  describe('GET /api/orders/pending-delivery - Pending Delivery', () => {
    test('API-221: Should get orders pending delivery', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders/pending-delivery')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('API-222: Should flag overdue deliveries', async () => {
      const response = await request(BASE_URL)
        .get('/api/orders/pending-delivery')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ company_id: 1 });
      
      expect(response.status).toBe(200);
      
      response.body.forEach((order: any) => {
        if (new Date(order.delivery_date) < new Date()) {
          expect(order).toHaveProperty('overdue');
          expect(order.overdue).toBe(true);
        }
      });
    });
  });
});
