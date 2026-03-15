/**
 * API Tests - Authentication
 * Jest + Supertest tests for auth endpoints
 */

import request from 'supertest';

const API_URL = 'http://localhost:3000';

describe('Authentication API', () => {
  describe('POST /api/auth/signin', () => {
    test('should login with valid credentials', async () => {
      const response = await request(API_URL).post('/api/auth/signin').send({
        email: 'qa_test_user@fieldcost.com',
        password: 'TestPassword123',
      });

      expect(response.status).toBeLessThanOrEqual(301); // Allow redirect
      expect(response.body).toBeDefined();
    });

    test('should return 400 with invalid password', async () => {
      const response = await request(API_URL).post('/api/auth/signin').send({
        email: 'qa_test_user@fieldcost.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should return 400 with missing email', async () => {
      const response = await request(API_URL).post('/api/auth/signin').send({
        password: 'TestPassword123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should return 400 with missing password', async () => {
      const response = await request(API_URL).post('/api/auth/signin').send({
        email: 'qa_test_user@fieldcost.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should return 400 with non-existent user', async () => {
      const response = await request(API_URL).post('/api/auth/signin').send({
        email: 'nonexistent@fieldcost.com',
        password: 'TestPassword123',
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('POST /api/auth/signout', () => {
    test('should signout user', async () => {
      const response = await request(API_URL).post('/api/auth/signout');

      expect([200, 301, 302]).toContain(response.status);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('should accept password reset request', async () => {
      const response = await request(API_URL).post('/api/auth/reset-password').send({
        email: 'qa_test_user@fieldcost.com',
      });

      expect([200, 400]).toContain(response.status);
    });

    test('should return 400 with missing email', async () => {
      const response = await request(API_URL).post('/api/auth/reset-password').send({});

      expect(response.status).toBe(400);
    });
  });
});
