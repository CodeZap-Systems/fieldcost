/**/**

















































































































































});  });    });      expect([200, 204]).toContain(response.status);        .query({ company_id: 8 });        .delete(`/api/customers/${customerId}`)      const response = await request(API_URL)      const customerId = createResponse.body.id;      const createResponse = await request(API_URL).post('/api/customers').send(customer);      const customer = generateTestCustomer();    test('should delete customer', async () => {  describe('DELETE /api/customers/:id', () => {  });    });      expect(response.status).toBe(400);        });          email: 'invalid-address',          company_id: 8,        .send({        .patch(`/api/customers/${createdCustomerId}`)      const response = await request(API_URL)      }        createdCustomerId = createResponse.body.id;        const createResponse = await request(API_URL).post('/api/customers').send(customer);        const customer = generateTestCustomer();      if (!createdCustomerId) {    test('should validate email on update', async () => {    });      expect([200, 204]).toContain(response.status);        });          email: 'updated@customer.com',          company_id: 8,        .send({        .patch(`/api/customers/${createdCustomerId}`)      const response = await request(API_URL)      }        createdCustomerId = createResponse.body.id;        const createResponse = await request(API_URL).post('/api/customers').send(customer);        const customer = generateTestCustomer();      if (!createdCustomerId) {    test('should update customer', async () => {  describe('PATCH /api/customers/:id', () => {  });    });      expect(response.status).toBe(400);      const response = await request(API_URL).get('/api/customers');    test('should return 400 without company_id', async () => {    });      expect(response.status).toBe(200);        .query({ company_id: 8, search: 'Acme' });        .get('/api/customers')      const response = await request(API_URL)    test('should search customers by name', async () => {    });      expect(response.status).toBe(200);        .query({ company_id: 8, city: 'Johannesburg' });        .get('/api/customers')      const response = await request(API_URL)    test('should filter customers by city', async () => {    });      expect(Array.isArray(response.body)).toBe(true);      expect(response.status).toBe(200);        .query({ company_id: 8 });        .get('/api/customers')      const response = await request(API_URL)    test('should list customers for company', async () => {  describe('GET /api/customers', () => {  });    });      expect([200, 201]).toContain(response.status);      const response = await request(API_URL).post('/api/customers').send(customer);      delete customer.phone;      const customer = generateTestCustomer();    test('should allow optional phone number', async () => {    });      expect(response.status).toBe(400);      const response = await request(API_URL).post('/api/customers').send(customer);      customer.email = 'invalid-email';      const customer = generateTestCustomer();    test('should validate email format', async () => {    });      expect(response.status).toBe(400);      const response = await request(API_URL).post('/api/customers').send(customer);      delete customer.company_id;      const customer = generateTestCustomer();    test('should return 400 without company_id', async () => {    });      expect(response.status).toBe(400);      const response = await request(API_URL).post('/api/customers').send(customer);      delete customer.name;      const customer = generateTestCustomer();    test('should return 400 without customer name', async () => {    });      }        createdCustomerId = response.body.id;      if (response.body.id) {      expect([200, 201]).toContain(response.status);      const response = await request(API_URL).post('/api/customers').send(customer);      const customer = generateTestCustomer();    test('should create new customer', async () => {  describe('POST /api/customers', () => {  let createdCustomerId: number;describe('Customers API', () => {const API_URL = 'http://localhost:3000';import { generateTestCustomer } from '../helpers/generators';import request from 'supertest'; */ * Jest + Supertest tests for customer endpoints * API Tests - Customers * API Tests - Customers
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
