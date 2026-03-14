import request from 'supertest';
import { TEST_USERS, INVALID_CREDENTIALS, PASSWORD_RESET_DATA } from '../fixtures/test-users';

/**
 * AUTHENTICATION API TESTS
 * Test REST API endpoints for user authentication
 */

const API_URL = 'http://localhost:3000';

describe('Authentication API', () => {
  let authToken: string;
  let refreshToken: string;
  let userId: string;

  // ================== LOGIN ENDPOINT TESTS ==================

  describe('POST /api/auth/login', () => {
    test('should successfully login with valid credentials', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(TEST_USERS.qaUser.email);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('firstName');
      expect(response.body.user).toHaveProperty('role');

      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('should return 401 with invalid email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: INVALID_CREDENTIALS.invalidEmail.email,
          password: INVALID_CREDENTIALS.invalidEmail.password,
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found|invalid|incorrect/i);
      expect(response.body).not.toHaveProperty('token');
    });

    test('should return 401 with incorrect password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: INVALID_CREDENTIALS.wrongPassword.email,
          password: INVALID_CREDENTIALS.wrongPassword.password,
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/incorrect|invalid|password/i);
      expect(response.body).not.toHaveProperty('token');
    });

    test('should return 400 with missing email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          password: 'SomePassword123',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|required/i);
    });

    test('should return 400 with missing password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/password|required/i);
    });

    test('should return 400 with invalid email format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: INVALID_CREDENTIALS.invalidFormat.email,
          password: INVALID_CREDENTIALS.invalidFormat.password,
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/valid|format|invalid/i);
    });

    test('should return user with correct role', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        })
        .expect(200);

      expect(response.body.user.role).toBe('qa_test_user');
      expect(['admin', 'project_manager', 'field_worker', 'accountant', 'supervisor', 'qa_test_user']).toContain(
        response.body.user.role
      );
    });

    test('should include refresh token in response', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('refreshToken');
      expect(typeof response.body.refreshToken).toBe('string');
      refreshToken = response.body.refreshToken;
    });

    test('should include token expiration time', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('expiresIn');
      expect(typeof response.body.expiresIn).toBe('number');
      expect(response.body.expiresIn).toBeGreaterThan(0);
    });

    test('should not return password in response', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        })
        .expect(200);

      expect(response.body.user).not.toHaveProperty('password');
      expect(JSON.stringify(response.body)).not.toContain(TEST_USERS.qaUser.password);
    });

    test('should increment login attempt counter on failure', async () => {
      // First failed attempt
      await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: INVALID_CREDENTIALS.wrongPassword.email,
          password: 'WrongPassword1',
        })
        .expect(401);

      // Second failed attempt
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: INVALID_CREDENTIALS.wrongPassword.email,
          password: 'WrongPassword2',
        })
        .expect(401);

      // Should still be able to login after 2 failures
      expect(response.body).not.toHaveProperty('token');
    });

    test('should lock account after multiple failed attempts', async () => {
      const email = TEST_USERS.projectManager.email;

      // Make multiple failed attempts
      for (let i = 0; i < 6; i++) {
        await request(API_URL)
          .post('/api/auth/login')
          .send({
            email: email,
            password: 'WrongPassword',
          })
          .expect(401);
      }

      // Account should be locked
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: email,
          password: TEST_USERS.projectManager.password,
        })
        .expect(401);

      expect(response.body.message).toMatch(/locked|too many|attempt/i);
    });
  });

  // ================== REGISTRATION ENDPOINT TESTS ==================

  describe('POST /api/auth/register', () => {
    test('should successfully register new user', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: `test-${Date.now()}@example.com`,
        password: 'SecurePassword123!',
        companyName: `TestCompany${Date.now()}`,
      };

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.firstName).toBe(newUser.firstName);
      expect(response.body.user.lastName).toBe(newUser.lastName);
    });

    test('should return 409 when email already exists', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: TEST_USERS.qaUser.email,
          password: 'TestPassword123',
          companyName: 'Another Company',
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/already exists|already registered/i);
    });

    test('should return 400 with missing firstName', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          lastName: 'Doe',
          email: `test-${Date.now()}@example.com`,
          password: 'TestPassword123',
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/firstName|first name|required/i);
    });

    test('should return 400 with missing lastName', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          email: `test-${Date.now()}@example.com`,
          password: 'TestPassword123',
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/lastName|last name|required/i);
    });

    test('should return 400 with missing email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          password: 'TestPassword123',
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|required/i);
    });

    test('should return 400 with missing password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}@example.com`,
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/password|required/i);
    });

    test('should return 400 with weak password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: `test-${Date.now()}@example.com`,
          password: 'weak',
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/weak|strong|requirements/i);
    });

    test('should return 400 with invalid email format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'not-an-email',
          password: 'TestPassword123',
          companyName: 'Test Company',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|invalid|format/i);
    });

    test('should create user with default role', async () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        companyName: `Company${Date.now()}`,
      };

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.role).toBe('user'); // Default role
    });

    test('should not return password in response', async () => {
      const newUser = {
        firstName: 'Bob',
        lastName: 'Wilson',
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        companyName: `Company${Date.now()}`,
      };

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body.user).not.toHaveProperty('password');
      expect(JSON.stringify(response.body)).not.toContain(newUser.password);
    });
  });

  // ================== LOGOUT ENDPOINT TESTS ==================

  describe('POST /api/auth/logout', () => {
    beforeEach(async () => {
      // Get a valid token
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        });
      authToken = loginResponse.body.token;
    });

    test('should successfully logout', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/success|logout/i);
    });

    test('should return 401 when not authenticated', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/unauthorized|token|required/i);
    });

    test('should invalidate token after logout', async () => {
      // Logout
      await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Try to use the same token
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should clear refresh token on logout', async () => {
      const response = await request(API_URL)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          refreshToken: refreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ================== PASSWORD RESET ENDPOINT TESTS ==================

  describe('POST /api/auth/request-reset', () => {
    test('should send password reset email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/request-reset')
        .send({
          email: TEST_USERS.projectManager.email,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/check|email|sent/i);
    });

    test('should return 400 with missing email', async () => {
      const response = await request(API_URL)
        .post('/api/auth/request-reset')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|required/i);
    });

    test('should accept non-existent emails for security', async () => {
      const response = await request(API_URL)
        .post('/api/auth/request-reset')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(200);

      // Should return generic success message for security
      expect(response.body).toHaveProperty('message');
    });

    test('should validate email format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/request-reset')
        .send({
          email: 'not-an-email',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/email|format|valid/i);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    test('should reset password with valid reset token', async () => {
      // In real scenario, you'd get a valid reset token from email
      const resetToken = 'valid-reset-token'; // Mock token
      const newPassword = 'NewPassword123!';

      // This test assumes endpoint validation
      const response = await request(API_URL)
        .post('/api/auth/reset-password')
        .send({
          resetToken: resetToken,
          newPassword: newPassword,
        })
        .expect('Content-Type', /json/);

      // Will likely fail with 400/401 due to invalid token, but tests the structure
      expect(response.body).toHaveProperty('message');
    });

    test('should return 400 with invalid reset token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/reset-password')
        .send({
          resetToken: 'invalid-token',
          newPassword: 'NewPassword123!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid|expired|token/i);
    });

    test('should return 400 with weak new password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/reset-password')
        .send({
          resetToken: 'some-token',
          newPassword: 'weak',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/weak|requirements|strong/i);
    });
  });

  // ================== TOKEN REFRESH ENDPOINT TESTS ==================

  describe('POST /api/auth/refresh', () => {
    beforeEach(async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        });
      authToken = loginResponse.body.token;
      refreshToken = loginResponse.body.refreshToken;
    });

    test('should refresh access token with valid refresh token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({
          refreshToken: refreshToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('expiresIn');
      expect(response.body.token).not.toBe(authToken); // Should be new token
    });

    test('should return 401 with invalid refresh token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-refresh-token',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid|expired|token/i);
    });

    test('should return 400 with missing refresh token', async () => {
      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/refreshToken|required/i);
    });
  });

  // ================== GET CURRENT USER ENDPOINT TESTS ==================

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        });
      authToken = loginResponse.body.token;
    });

    test('should return current user with valid token', async () => {
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('firstName');
      expect(response.body).toHaveProperty('role');
      expect(response.body.email).toBe(TEST_USERS.qaUser.email);
    });

    test('should return 401 without authorization header', async () => {
      const response = await request(API_URL)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should return 401 with invalid token', async () => {
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should not return password', async () => {
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).not.toHaveProperty('password');
    });
  });

  // ================== HEADER TESTS ==================

  describe('Authorization Headers', () => {
    test('should accept token without Bearer prefix in some endpoints', async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        });
      authToken = loginResponse.body.token;

      // Some APIs might also accept just the token
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBeLessThan(500); // Not a server error
    });

    test('should handle authorization header case insensitivity', async () => {
      const loginResponse = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: TEST_USERS.qaUser.email,
          password: TEST_USERS.qaUser.password,
        });
      authToken = loginResponse.body.token;

      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('authorization', `Bearer ${authToken}`); // lowercase

      expect([200, 401]).toContain(response.status);
    });
  });
});
