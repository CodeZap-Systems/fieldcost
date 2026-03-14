/**
 * API Tests for Inventory Endpoints
 */

import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { getDefaultTestUser } from '@tests/helpers/test-user';
import { inventoryTestData } from '@tests/fixtures/test-data';

const API_URL = process.env.API_URL || 'http://localhost:3000';
let authToken: string;

describe('API Inventory Tests', () => {
  
  beforeAll(async () => {
    const user = getDefaultTestUser();
    const loginRes = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    
    authToken = loginRes.body.token;
  });

  describe('POST /api/inventory', () => {
    it('should create inventory item with valid data', async () => {
      const response = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inventoryTestData.valid);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(inventoryTestData.valid.name);
    });

    it('should reject item without name', async () => {
      const response = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inventoryTestData.valid,
          name: '',
        });
      
      expect(response.status).toBe(400);
    });

    it('should reject item with negative price', async () => {
      const response = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...inventoryTestData.valid,
          unitPrice: -100,
        });
      
      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const response = await request(API_URL)
        .post('/api/inventory')
        .send(inventoryTestData.valid);
      
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/inventory', () => {
    it('should list all inventory items', async () => {
      const response = await request(API_URL)
        .get('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by category', async () => {
      const response = await request(API_URL)
        .get('/api/inventory?category=materials')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
    });

    it('should search by name', async () => {
      const response = await request(API_URL)
        .get('/api/inventory?search=cement')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/inventory/:id', () => {
    it('should return item details', async () => {
      const createRes = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inventoryTestData.valid);
      
      const itemId = createRes.body.id;
      
      const response = await request(API_URL)
        .get(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(itemId);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(API_URL)
        .get('/api/inventory/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/inventory/:id', () => {
    it('should update inventory item', async () => {
      const createRes = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inventoryTestData.valid);
      
      const itemId = createRes.body.id;
      
      const response = await request(API_URL)
        .put(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 500,
          unitPrice: 150,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(500);
    });
  });

  describe('DELETE /api/inventory/:id', () => {
    it('should delete inventory item', async () => {
      const createRes = await request(API_URL)
        .post('/api/inventory')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inventoryTestData.valid);
      
      const itemId = createRes.body.id;
      
      const response = await request(API_URL)
        .delete(`/api/inventory/${itemId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200) || expect(response.status).toBe(204);
    });
  });

  describe('GET /api/inventory/low-stock', () => {
    it('should list low stock items', async () => {
      const response = await request(API_URL)
        .get('/api/inventory/low-stock')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
