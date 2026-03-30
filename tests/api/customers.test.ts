/**
 * API Tests - Customers
 * Jest + Supertest tests for customer endpoints
 */

import request from 'supertest';
import { generateTestCustomer } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Customers API', () => {
  let createdCustomerId: number;

  describe('POST /api/customers', () => {
    test('should create new customer', async () => {
      const customer = generateTestCustomer();

      const response = await request(API_URL).post('/api/customers').send(customer);

      expect([200, 201]).toContain(response.status);
      if (response.body.id) {
        createdCustomerId = response.body.id;
      }
    });

    test('should return 400 without customer name', async () => {
      const customer = generateTestCustomer();
      delete customer.name;

      const response = await request(API_URL).post('/api/customers').send(customer);

      expect(response.status).toBe(400);
    });

    test('should validate email format', async () => {
      const customer = generateTestCustomer();
      customer.email = 'invalid-email';

      const response = await request(API_URL).post('/api/customers').send(customer);

      expect(response.status).toBe(400);
    });

    test('should require company_id', async () => {
      const customer = generateTestCustomer();
      delete customer.company_id;

      const response = await request(API_URL).post('/api/customers').send(customer);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/customers', () => {
    test('should list customers for company', async () => {
      const response = await request(API_URL)
        .get('/api/customers')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter customers by city', async () => {
      const response = await request(API_URL)
        .get('/api/customers')
        .query({ company_id: 8, city: 'Cape Town' });

      expect(response.status).toBe(200);
    });

    test('should search customers by name', async () => {
      const response = await request(API_URL)
        .get('/api/customers')
        .query({ company_id: 8, search: 'Acme' });

      expect(response.status).toBe(200);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/customers');

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/customers/:id', () => {
    test('should update customer', async () => {
      if (!createdCustomerId) {
        const customer = generateTestCustomer();
        const createResponse = await request(API_URL).post('/api/customers').send(customer);
        createdCustomerId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/customers/${createdCustomerId}`)
        .send({
          company_id: 8,
          email: 'newemail@customer.com',
          phone: '+27 12 345 6789',
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should validate email format on update', async () => {
      if (!createdCustomerId) {
        const customer = generateTestCustomer();
        const createResponse = await request(API_URL).post('/api/customers').send(customer);
        createdCustomerId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/customers/${createdCustomerId}`)
        .send({
          company_id: 8,
          email: 'invalid',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/customers/:id', () => {
    test('should delete customer', async () => {
      const customer = generateTestCustomer();
      const createResponse = await request(API_URL).post('/api/customers').send(customer);
      const customerId = createResponse.body.id;

      const response = await request(API_URL)
        .delete(`/api/customers/${customerId}`)
        .query({ company_id: 8 });

      expect([200, 204]).toContain(response.status);
    });
  });
});
