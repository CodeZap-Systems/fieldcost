/**
 * FieldCost Project Creation Load Test
 * 
 * Tests project CRUD endpoints under load
 * - 100 virtual users
 * - Ramp up over 30s
 * - Hold for 60s
 * - Ramp down over 30s
 * - Fail if response > 500ms
 * 
 * Run: k6 run tests/load/project-load-test.js
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
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    'checks': ['rate>0.95'],
  },
};

// Test data
const authToken = 'Bearer qa_test_token';
const companyId = 'company_123';

const projectTemplates = [
  {
    name: 'Construction Project',
    description: 'Main construction phase',
    budget: 50000,
    companyId: companyId,
  },
  {
    name: 'Renovation Phase 2',
    description: 'Second phase of renovation',
    budget: 75000,
    companyId: companyId,
  },
  {
    name: 'Infrastructure Development',
    description: 'New infrastructure setup',
    budget: 100000,
    companyId: companyId,
  },
  {
    name: 'Interior Design',
    description: 'Interior finishing work',
    budget: 35000,
    companyId: companyId,
  },
];

const projectIds = ['proj_001', 'proj_002', 'proj_003', 'proj_004', 'proj_005'];

export default function () {
  group('Project Management Load Tests', () => {
    // Test 1: Create project
    group('Create Project', () => {
      const template = projectTemplates[Math.floor(Math.random() * projectTemplates.length)];
      const payload = {
        ...template,
        name: `${template.name} - Load Test ${Date.now()}`,
      };

      const response = http.post(
        `${BASE_URL}/api/projects`,
        JSON.stringify(payload),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'create successful': (r) => r.status === 201 || r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'has project id': (r) => r.body.includes('id'),
        'valid response': (r) => r.body.includes('name'),
      });

      sleep(1);
    });

    // Test 2: List projects
    group('List Projects', () => {
      const response = http.get(
        `${BASE_URL}/api/projects`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'list successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
        'returns array': (r) => r.body.includes('[') || r.body.includes('data'),
      });

      sleep(0.5);
    });

    // Test 3: Get single project
    group('Get Project Details', () => {
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];

      const response = http.get(
        `${BASE_URL}/api/projects/${projectId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'get successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 4: Update project
    group('Update Project', () => {
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
      const updatePayload = {
        name: `Updated Project ${Date.now()}`,
        description: 'Updated description',
        budget: 85000,
      };

      const response = http.put(
        `${BASE_URL}/api/projects/${projectId}`,
        JSON.stringify(updatePayload),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'update successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 5: Filter projects
    group('Filter Projects by Status', () => {
      const statuses = ['active', 'planning', 'completed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const response = http.get(
        `${BASE_URL}/api/projects?status=${status}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'filter successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 6: Search projects
    group('Search Projects', () => {
      const response = http.get(
        `${BASE_URL}/api/projects?search=construction`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'search successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 7: Generate project report
    group('Generate Project Report', () => {
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];

      const response = http.get(
        `${BASE_URL}/api/projects/${projectId}/report`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'report generated': (r) => r.status === 200 || r.status === 404,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
      });

      sleep(1);
    });

    // Test 8: Delete project
    group('Delete Project', () => {
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];

      const response = http.delete(
        `${BASE_URL}/api/projects/${projectId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'delete successful': (r) => r.status === 204 || r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 9: Invalid project creation (missing field)
    group('Create Project - Invalid Data', () => {
      const response = http.post(
        `${BASE_URL}/api/projects`,
        JSON.stringify({
          name: 'Invalid Project', // Missing budget and companyId
        }),
        {
          headers: {
            'Authorization': authToken,
            'Content-Type': 'application/json',
          },
          timeout: '5s',
        }
      );

      check(response, {
        'rejects invalid data': (r) => r.status === 400,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 10: Unauthorized project access
    group('Access Project - Unauthorized', () => {
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];

      const response = http.get(
        `${BASE_URL}/api/projects/${projectId}`,
        {
          headers: { 'Authorization': 'Bearer invalid_token' },
          timeout: '5s',
        }
      );

      check(response, {
        'denies unauthorized access': (r) => r.status === 401 || r.status === 403,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });
  });
}

export function teardown(data) {
  console.log('✓ Project load test completed');
}
