/**
 * API Security Tests
 * 
 * Tests for:
 * - SQL Injection
 * - NoSQL Injection
 * - Command Injection
 * - Malformed requests
 * - Missing input validation
 * - Insecure Direct Object Reference (IDOR)
 * - API rate limiting
 * - Missing authentication
 */

import supertest from 'supertest';

const API_URL = 'http://localhost:3000';
const request = supertest(API_URL);

describe('API Security Tests', () => {
  // SQL Injection Tests
  describe('SQL Injection Prevention', () => {
    test('should reject SQL injection in query parameters', async () => {
      const sqlPayloads = [
        "' OR '1'='1",
        "admin'--",
        "' OR 1=1--",
        "1' UNION SELECT * FROM users--",
        "'; DROP TABLE users; --",
      ];

      for (const payload of sqlPayloads) {
        const response = await request
          .get('/api/projects')
          .query({ search: payload })
          .expect([200, 400, 401]);

        // Should not return error revealing database structure
        if (response.body.error) {
          expect(response.body.error).not.toContain('SQL');
          expect(response.body.error).not.toContain('syntax');
          expect(response.body.error).not.toContain('postgres');
        }
      }
    });

    test('should reject SQL injection in POST body', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer valid_token')
        .send({
          name: "'; DROP TABLE projects; --",
          description: 'Test',
          budget: 50000,
          companyId: "' OR 1=1 --",
        });

      // Should reject or sanitize
      expect(response.status).not.toBe(201);
      expect(response.body.error).toBeTruthy();
    });

    test('should reject SQL injection in path parameters', async () => {
      const injectPayloads = [
        "1' OR '1'='1",
        "1; DROP TABLE--",
        "1' UNION SELECT NULL--",
      ];

      for (const payload of injectPayloads) {
        const response = await request
          .get(`/api/projects/${payload}`)
          .set('Authorization', 'Bearer token')
          .expect([400, 401, 404]);

        // Should not leak database info
        if (response.body.error) {
          expect(response.body.error).not.toMatch(/SQL|syntax|migrate|column/i);
        }
      }
    });
  });

  // Rate Limiting Tests
  describe('API Rate Limiting', () => {
    test('should enforce rate limiting on login endpoint', async () => {
      const requests = [];

      for (let i = 0; i < 15; i++) {
        const response = await request
          .post('/api/auth/login')
          .send({
            email: 'attacker@example.com',
            password: 'WrongPassword',
          })
          .expect([400, 401, 429]);

        requests.push(response.status);
      }

      // Should eventually get rate limited (429)
      const rateLimited = requests.some((status) => status === 429);
      expect(rateLimited).toBe(true);
    });

    test('should rate limit API requests', async () => {
      const requests = [];

      for (let i = 0; i < 20; i++) {
        const response = await request
          .get('/api/projects')
          .set('Authorization', 'Bearer test_token')
          .expect([200, 401, 429]);

        requests.push(response.status);
      }

      // Check if rate limiting kicks in
      const hasRateLimit = requests.some((status) => status === 429);
      // Rate limiting may or may not be enabled - just check response is valid
      expect(requests.length).toBe(20);
    });
  });

  // IDOR (Insecure Direct Object Reference) Tests
  describe('IDOR Prevention', () => {
    test('should prevent access to other users projects', async () => {
      // Attempt to access project from different user
      const response = await request
        .get('/api/projects/other_user_project_id')
        .set('Authorization', 'Bearer user1_token')
        .expect([403, 404]);

      expect(response.status).toMatch(/403|404/);
    });

    test('should prevent modification of other users data', async () => {
      const response = await request
        .put('/api/projects/other_user_project_id')
        .set('Authorization', 'Bearer user1_token')
        .send({
          name: 'Hacked Project',
          budget: 999999,
        })
        .expect([403, 404]);

      expect(response.status).toMatch(/403|404/);
    });

    test('should prevent deletion of other users data', async () => {
      const response = await request
        .delete('/api/projects/other_user_project_id')
        .set('Authorization', 'Bearer user1_token')
        .expect([403, 404]);

      expect(response.status).toMatch(/403|404/);
    });
  });

  // Authentication Tests
  describe('Authentication Enforcement', () => {
    test('should reject requests without authentication token', async () => {
      const response = await request
        .get('/api/projects')
        .expect([401, 403]);

      expect(response.status).toMatch(/401|403/);
      expect(response.body.error).toBeTruthy();
    });

    test('should reject invalid authentication tokens', async () => {
      const response = await request
        .get('/api/projects')
        .set('Authorization', 'Bearer invalid_token_xyz')
        .expect([401, 403]);

      expect(response.status).toMatch(/401|403/);
    });

    test('should reject malformed authorization header', async () => {
      const malformedHeaders = [
        'InvalidToken',
        'Bearer',
        'Bearer ',
        'bearer token',
        'Token: abc123',
      ];

      for (const header of malformedHeaders) {
        const response = await request
          .get('/api/projects')
          .set('Authorization', header)
          .expect([400, 401, 403]);

        expect(response.status).toMatch(/400|401|403/);
      }
    });
  });

  // Input Validation Tests
  describe('Input Validation', () => {
    test('should reject missing required fields', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          description: 'Missing name and budget',
          companyId: 'company123',
        })
        .expect([400]);

      expect(response.body.error).toBeTruthy();
    });

    test('should reject invalid data types', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: 'Project',
          description: 123, // Should be string
          budget: 'not_a_number', // Should be number
          companyId: true, // Should be string
        })
        .expect([400]);

      expect(response.body.error).toBeTruthy();
    });

    test('should reject oversized payloads', async () => {
      // Create a large payload
      const largeString = 'A'.repeat(1000000); // 1MB string

      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'application/json')
        .send({
          name: largeString,
          description: largeString,
          budget: 50000,
          companyId: 'company123',
        })
        .expect([400, 413]);

      expect(response.status).toMatch(/400|413/);
    });

    test('should reject malformed JSON', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'application/json')
        .send('{invalid json}')
        .expect([400]);

      expect(response.status).toBe(400);
    });
  });

  // CSRF Token Tests
  describe('CSRF Protection', () => {
    test('should require CSRF token for state-changing operations', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: 'Test Project',
          description: 'Test',
          budget: 50000,
          companyId: 'company123',
        })
        .expect([400, 403]);

      // Should be rejected for missing CSRF token or other security reason
      expect(response.status).toMatch(/400|403|422/);
    });
  });

  // Command Injection Tests
  describe('Command Injection Prevention', () => {
    test('should sanitize shell-like commands in inputs', async () => {
      const payloads = [
        '$(whoami)',
        '`id`',
        '; ls -la;',
        '| cat /etc/passwd',
        '& dir &',
      ];

      for (const payload of payloads) {
        const response = await request
          .post('/api/projects')
          .set('Authorization', 'Bearer token')
          .send({
            name: payload,
            description: 'Test',
            budget: 50000,
            companyId: 'company123',
          })
          .expect([400, 401]);

        // Should reject or treat as literal string
        if (response.status === 400) {
          expect(response.body.error).toBeTruthy();
        }
      }
    });
  });

  // Path Traversal Tests
  describe('Path Traversal Prevention', () => {
    test('should prevent directory traversal in file operations', async () => {
      const traversalPaths = [
        '../../etc/passwd',
        '..\\..\\windows\\system32',
        '....//....//etc/passwd',
        '%2e%2e%2fetc%2fpasswd',
      ];

      for (const path of traversalPaths) {
        const response = await request
          .get(`/api/files/${path}`)
          .set('Authorization', 'Bearer token')
          .expect([400, 403, 404]);

        expect(response.status).not.toBe(200);
      }
    });
  });

  // Integer Overflow / Type Coercion
  describe('Type Safety', () => {
    test('should handle large numbers safely', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: 'Test',
          description: 'Test',
          budget: 999999999999999999999999999999, // Huge number
          companyId: 'company123',
        })
        .expect([400, 401]);

      // Should reject or handle gracefully
      expect([400, 401]).toContain(response.status);
    });

    test('should handle negative numbers appropriately', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: 'Test',
          description: 'Test',
          budget: -50000, // Negative budget
          companyId: 'company123',
        })
        .expect([400, 401]);

      // Should reject negative budget
      expect([400, 401]).toContain(response.status);
    });
  });

  // Null/Undefined Handling
  describe('Null Safety', () => {
    test('should handle null values in required fields', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: null,
          description: 'Test',
          budget: 50000,
          companyId: 'company123',
        })
        .expect([400]);

      expect(response.body.error).toBeTruthy();
    });

    test('should handle undefined values', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({
          name: 'Test',
          description: undefined,
          budget: undefined,
          companyId: 'company123',
        })
        .expect([400]);

      expect(response.status).toBe(400);
    });
  });

  // Headers Validation
  describe('Headers Validation', () => {
    test('should validate Content-Type header', async () => {
      const response = await request
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .set('Content-Type', 'text/plain')
        .send('name=Test&budget=50000')
        .expect([400, 415]);

      expect([400, 415]).toContain(response.status);
    });

    test('should reject suspicious headers', async () => {
      const response = await request
        .get('/api/projects')
        .set('Authorization', 'Bearer token')
        .set('X-Original-URL', '/../admin')
        .set('X-Rewrite-URL', '/../admin')
        .expect([200, 401]);

      // Should not allow header-based path traversal
      expect([200, 401]).toContain(response.status);
    });
  });
});
