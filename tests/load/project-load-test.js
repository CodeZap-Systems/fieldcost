/**
 * k6 Load Test - Project Management Endpoints
 * Tests project CRUD operations under load
 *
 * Run with:
 * k6 run tests/load/project-load-test.js
 *
 * Note: Requires demo users or auth tokens. This test uses demo login first.
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m30s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],

  thresholds: {
    'http_req_duration': [
      'p(95) < 500',
      'p(99) < 1000',
    ],
    'http_req_failed': ['rate < 0.1'],
    'checks': ['rate > 0.95'],
  },
};

// Helper to get demo user context
function getDemoUser() {
  const payload = JSON.stringify({
    company: `LoadTest Project ${__VU} ${Date.now()}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(`${BASE_URL}/api/demo`, payload, params);

  try {
    const body = JSON.parse(response.body);
    return {
      userId: body.demoUserId || `demo-user-${__VU}`,
      token: body.token || '',
      success: response.status < 300,
    };
  } catch (e) {
    return {
      userId: `demo-user-${__VU}`,
      token: '',
      success: false,
    };
  }
}

// Test: Create Project
export function createProject(userId, projectNumber) {
  group('Create Project (POST /api/projects)', function () {
    const payload = JSON.stringify({
      name: `Load Test Project ${__VU}-${projectNumber}`,
      description: `Performance test project for load testing`,
      location: 'Test Location',
      status: 'active',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.post(`${BASE_URL}/api/projects`, payload, params);

    check(response, {
      'create status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'create response time < 500ms': (r) => r.timings.duration < 500,
      'has project ID': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id !== undefined;
        } catch (e) {
          return false;
        }
      },
    });

    try {
      const body = JSON.parse(response.body);
      return body.id;
    } catch (e) {
      return null;
    }
  });
}

// Test: List Projects
export function listProjects(userId) {
  group('List Projects (GET /api/projects)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/projects`, params);

    check(response, {
      'list status is 200': (r) => r.status === 200,
      'list response time < 500ms': (r) => r.timings.duration < 500,
      'response is array or object': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body) || typeof body === 'object';
        } catch (e) {
          return false;
        }
      },
    });
  });
}

// Test: Update Project
export function updateProject(userId, projectId) {
  if (!projectId) return;

  group('Update Project (PATCH /api/projects/:id)', function () {
    const payload = JSON.stringify({
      status: 'in-progress',
      description: `Updated at ${new Date().toISOString()}`,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.patch(`${BASE_URL}/api/projects/${projectId}`, payload, params);

    check(response, {
      'update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'update response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Get Project Detail
export function getProjectDetail(userId, projectId) {
  if (!projectId) return;

  group('Get Project Detail (GET /api/projects/:id)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/projects/${projectId}`, params);

    check(response, {
      'get detail status is 200': (r) => r.status === 200,
      'get detail response time < 500ms': (r) => r.timings.duration < 500,
      'has project name': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.name !== undefined;
        } catch (e) {
          return false;
        }
      },
    });
  });
}

// Main test execution
export default function () {
  // Get demo user for this VU
  const demoUser = getDemoUser();
  if (!demoUser.success) {
    console.warn(`Failed to get demo user for VU ${__VU}`);
    sleep(1);
    return;
  }

  const userId = demoUser.userId;

  // Simulate project management workflow
  const projectId = createProject(userId, __ITER);
  sleep(1);

  listProjects(userId);
  sleep(1);

  if (projectId) {
    getProjectDetail(userId, projectId);
    sleep(1);

    updateProject(userId, projectId);
    sleep(1);
  }
}
