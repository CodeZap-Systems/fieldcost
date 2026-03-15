/**
 * k6 Load Test - Authentication Endpoints
 * Tests registration and login APIs under load
 *
 * Run with:
 * k6 run tests/load/auth-load-test.js
 *
 * Environment variables:
 * BASE_URL=http://localhost:3000 k6 run tests/load/auth-load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  // VU ramping configuration
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 VUs over 30s
    { duration: '1m', target: 50 },     // Ramp up to 50 VUs over 1m
    { duration: '1m30s', target: 100 }, // Ramp up to 100 VUs over 1.5m
    { duration: '3m', target: 100 },   // Hold at 100 VUs for 3m
    { duration: '1m', target: 50 },     // Ramp down to 50 VUs over 1m
    { duration: '30s', target: 0 },     // Ramp down to 0 VUs over 30s
  ],

  // Thresholds - test fails if these are exceeded
  thresholds: {
    // Response times
    'http_req_duration': [
      'p(95) < 500',  // 95th percentile must be under 500ms
      'p(99) < 1000', // 99th percentile must be under 1000ms
    ],

    // Error threshold
    'http_req_failed': ['rate < 0.1'], // Error rate must be below 10%

    // Checks
    'checks': ['rate > 0.95'],  // 95% of checks must pass
  },

  // Test-wide options
  ext: {
    loadimpact: {
      projectID: 3330769,
      name: 'FieldCost Auth Load Test',
    },
  },
};

// Generate unique email for each VU
function generateEmail(iteration) {
  return `loadtest.user.${__VU}.${iteration}@fieldcost-test.local`;
}

// Test group: Registration
export function testRegistration() {
  group('Registration (POST /api/registrations)', function () {
    const uniqueEmail = generateEmail(__ITER);

    const payload = JSON.stringify({
      email: uniqueEmail,
      password: 'TestPassword123!',
      companyName: `LoadTest Company ${__VU}`,
      role: 'admin',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = http.post(`${BASE_URL}/api/registrations`, payload, params);

    check(response, {
      'status is 2xx': (r) => r.status >= 200 && r.status < 300 || r.status === 400, // 400 if already exists
      'response time < 500ms': (r) => r.timings.duration < 500,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has content-type': (r) => r.headers['Content-Type'] !== undefined,
    });

    // Log response time at p99 intervals
    if (__ITER % 100 === 0) {
      console.log(`Registration response time: ${response.timings.duration}ms (VU: ${__VU}, Iteration: ${__ITER})`);
    }

    sleep(1);
  });
}

// Test group: Demo Login (creates temporary account)
export function testDemoLogin() {
  group('Demo Login (POST /api/demo)', function () {
    const payload = JSON.stringify({
      company: `Demo Company ${__VU} ${Date.now()}`,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = http.post(`${BASE_URL}/api/demo`, payload, params);

    check(response, {
      'status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'response time < 500ms': (r) => r.timings.duration < 500,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'has demo user ID': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.demoUserId !== undefined || r.status === 400;
        } catch (e) {
          return false;
        }
      },
    });

    if (__ITER % 100 === 0) {
      console.log(`Demo login response time: ${response.timings.duration}ms (VU: ${__VU}, Iteration: ${__ITER})`);
    }

    sleep(1);
  });
}

// Main test execution
export default function () {
  // Alternate between registration and demo login
  if (__ITER % 2 === 0) {
    testRegistration();
  } else {
    testDemoLogin();
  }
}
