/**
 * FieldCost Authentication Load Test
 * 
 * Tests login endpoint under load
 * - 100 virtual users
 * - Ramp up over 30s
 * - Hold for 60s
 * - Ramp down over 30s
 * - Fail if response > 500ms
 * 
 * Run: k6 run tests/load/auth-load-test.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Performance thresholds
export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up to 100 users over 30s
    { duration: '60s', target: 100 }, // Stay at 100 users for 60s
    { duration: '30s', target: 0 },   // Ramp down to 0 users over 30s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests < 500ms, 99% < 1000ms
    http_req_failed: ['rate<0.01'],                   // Error rate < 1%
    'checks': ['rate>0.95'],                          // Check pass rate > 95%
  },
};

// Test data
const testUsers = [
  { email: 'qa_admin@fieldcost.com', password: 'TestPassword123!' },
  { email: 'qa_pm@fieldcost.com', password: 'TestPassword123!' },
  { email: 'qa_field@fieldcost.com', password: 'TestPassword123!' },
  { email: 'qa_accountant@fieldcost.com', password: 'TestPassword123!' },
];

const validationPayloads = [
  { email: 'test@example.com', password: 'ValidPassword123!' },
  { email: 'user@test.com', password: 'SecurePass456!' },
  { email: 'admin@company.com', password: 'AdminPass789!' },
];

const sqlInjectionPayloads = [
  { email: "' OR '1'='1", password: 'test' },
  { email: "admin'--", password: 'test' },
  { email: "'; DROP TABLE users; --", password: 'test' },
];

const invalidPayloads = [
  { email: 'invalid-email', password: 'test' },
  { email: '', password: 'test' },
  { email: 'test@example.com', password: '' },
  { email: 'test@example.com', password: 'short' },
];

export default function () {
  group('Authentication Load Tests', () => {
    // Test 1: Successful login
    group('Login - Valid Credentials', () => {
      const user = testUsers[Math.floor(Math.random() * testUsers.length)];
      
      const response = http.post(`${BASE_URL}/api/auth/login`, 
        JSON.stringify({
          email: user.email,
          password: user.password,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      check(response, {
        'login successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has auth token': (r) => r.body.includes('token'),
        'response contains user': (r) => r.body.includes('email'),
      });

      sleep(1);
    });

    // Test 2: Invalid email validation
    group('Login - Invalid Email', () => {
      const response = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify({
          email: 'not-an-email',
          password: 'TestPassword123!',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      check(response, {
        'rejects invalid email': (r) => r.status === 400,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 3: SQL Injection payload - should be rejected
    group('Login - SQL Injection Attempt', () => {
      const payload = sqlInjectionPayloads[Math.floor(Math.random() * sqlInjectionPayloads.length)];
      
      const response = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify(payload),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      check(response, {
        'rejects SQL injection': (r) => r.status === 400 || r.status === 401,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'no database error': (r) => !r.body.includes('SQL') && !r.body.includes('syntax'),
      });

      sleep(0.5);
    });

    // Test 4: Register new user
    group('Register - New User', () => {
      const newEmail = `user_${Date.now() + Math.random()}@test.com`;
      
      const response = http.post(`${BASE_URL}/api/auth/register`,
        JSON.stringify({
          email: newEmail,
          password: 'NewPassword123!',
          confirmPassword: 'NewPassword123!',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      check(response, {
        'register successful': (r) => r.status === 201 || r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has auth token': (r) => r.body.includes('token'),
      });

      sleep(1);
    });

    // Test 5: Register with weak password
    group('Register - Weak Password', () => {
      const response = http.post(`${BASE_URL}/api/auth/register`,
        JSON.stringify({
          email: `weak_${Date.now()}@test.com`,
          password: '123',
          confirmPassword: '123',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      check(response, {
        'rejects weak password': (r) => r.status === 400,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 6: Logout
    group('Logout', () => {
      const loginResponse = http.post(`${BASE_URL}/api/auth/login`,
        JSON.stringify({
          email: testUsers[0].email,
          password: testUsers[0].password,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: '5s',
        }
      );

      let token = '';
      if (loginResponse.status === 200) {
        const body = JSON.parse(loginResponse.body);
        token = body.token || body.access_token;
      }

      if (token) {
        const logoutResponse = http.post(`${BASE_URL}/api/auth/logout`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            timeout: '5s',
          }
        );

        check(logoutResponse, {
          'logout successful': (r) => r.status === 200 || r.status === 204,
          'response time < 500ms': (r) => r.timings.duration < 500,
        });
      }

      sleep(1);
    });
  });
}

export function teardown(data) {
  console.log('✓ Authentication load test completed');
}
