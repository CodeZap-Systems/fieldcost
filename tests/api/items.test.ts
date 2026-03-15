/**
 * API Tests - Inventory Items
 * Jest + Supertest tests for inventory endpoint
 */

import request from 'supertest';
import { generateTestInventoryItem } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Inventory Items API', () => {
  let createdItemId: number;

  describe('POST /api/items', () => {
    test('should create new inventory item', async () => {
      const item = generateTestInventoryItem();

      const response = await request(API_URL).post('/api/items').send(item);

      expect([200, 201]).toContain(response.status);
      if (response.body.id) {
        createdItemId = response.body.id;
      }
    });

    test('should return 400 without item description', async () => {
      const item = generateTestInventoryItem();
      delete item.description;

      const response = await request(API_URL).post('/api/items').send(item);

      expect(response.status).toBe(400);
    });

    test('should return 400 without company_id', async () => {
      const item = generateTestInventoryItem();
      delete item.company_id;

      const response = await request(API_URL).post('/api/items').send(item);

      expect(response.status).toBe(400);
    });

    test('should validate quantity is non-negative', async () => {
      const item = generateTestInventoryItem();
      item.quantity = -5;

      const response = await request(API_URL).post('/api/items').send(item);

      expect(response.status).toBe(400);
    });

    test('should validate unit_cost is positive', async () => {
      const item = generateTestInventoryItem();
      item.unit_cost = 0;

      const response = await request(API_URL).post('/api/items').send(item);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/items', () => {
    test('should list items for company', async () => {
      const response = await request(API_URL)
        .get('/api/items')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter items by category', async () => {
      const response = await request(API_URL)
        .get('/api/items')
        .query({ company_id: 8, category: 'Tools' });

      expect(response.status).toBe(200);
    });

    test('should search items by description', async () => {
      const response = await request(API_URL)
        .get('/api/items')
        .query({ company_id: 8, search: 'Hammer' });

      expect(response.status).toBe(200);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/items');

      expect(response.status).toBe(400);
    });

    test('should filter low-stock items', async () => {
      const response = await request(API_URL)
        .get('/api/items')
        .query({ company_id: 8, low_stock: 'true' });

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/items/:id', () => {
    test('should update item quantity', async () => {
      if (!createdItemId) {
        const item = generateTestInventoryItem();
        const createResponse = await request(API_URL).post('/api/items').send(item);
        createdItemId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/items/${createdItemId}`)
        .send({
          company_id: 8,
          quantity: 100,
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should update item price', async () => {
      if (!createdItemId) {
        const item = generateTestInventoryItem();
        const createResponse = await request(API_URL).post('/api/items').send(item);
        createdItemId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/items/${createdItemId}`)
        .send({
          company_id: 8,
          unit_cost: 299.99,
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should validate quantity on update', async () => {
      if (!createdItemId) {
        const item = generateTestInventoryItem();
        const createResponse = await request(API_URL).post('/api/items').send(item);
        createdItemId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/items/${createdItemId}`)
        .send({
          company_id: 8,
          quantity: -10,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/items/:id', () => {
    test('should delete item', async () => {
      const item = generateTestInventoryItem();
      const createResponse = await request(API_URL).post('/api/items').send(item);
      const itemId = createResponse.body.id;

      const response = await request(API_URL)
        .delete(`/api/items/${itemId}`)
        .query({ company_id: 8 });

      expect([200, 204]).toContain(response.status);
    });
  });
});
