/**
 * FieldCost Task Management Load Test
 * 
 * Tests task CRUD endpoints under load
 * - 100 virtual users
 * - Ramp up over 30s, hold 60s, ramp down 30s
 * - Fail if response > 500ms
 * 
 * Run: k6 run tests/load/task-load-test.js
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '60s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    'checks': ['rate>0.95'],
  },
};

const authToken = 'Bearer qa_test_token';
const projectId = 'project_123';

const taskTemplates = [
  {
    title: 'Foundation Setup',
    description: 'Prepare and excavate foundation',
    priority: 'high',
    status: 'todo',
    projectId: projectId,
  },
  {
    title: 'Structural Work',
    description: 'Install steel frame and concrete',
    priority: 'high',
    status: 'todo',
    projectId: projectId,
  },
  {
    title: 'Electrical Installation',
    description: 'Run electrical wiring and install outlets',
    priority: 'medium',
    status: 'todo',
    projectId: projectId,
  },
  {
    title: 'Plumbing Setup',
    description: 'Install plumbing pipes and fixtures',
    priority: 'medium',
    status: 'todo',
    projectId: projectId,
  },
];

const taskIds = ['task_001', 'task_002', 'task_003', 'task_004', 'task_005'];
const assigneeIds = ['user_001', 'user_002', 'user_003'];

export default function () {
  group('Task Management Load Tests', () => {
    // Test 1: Create task
    group('Create Task', () => {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const payload = {
        ...template,
        title: `${template.title} ${Date.now()}`,
      };

      const response = http.post(
        `${BASE_URL}/api/tasks`,
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
        'has task id': (r) => r.body.includes('id'),
      });

      sleep(1);
    });

    // Test 2: List tasks
    group('List Tasks', () => {
      const response = http.get(
        `${BASE_URL}/api/tasks?projectId=${projectId}`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'list successful': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 3: Get task details
    group('Get Task Details', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];

      const response = http.get(
        `${BASE_URL}/api/tasks/${taskId}`,
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

    // Test 4: Update task
    group('Update Task', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];
      const updatePayload = {
        title: `Updated Task ${Date.now()}`,
        status: 'in_progress',
        priority: 'high',
      };

      const response = http.put(
        `${BASE_URL}/api/tasks/${taskId}`,
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

    // Test 5: Assign task to user
    group('Assign Task', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];
      const assigneeId = assigneeIds[Math.floor(Math.random() * assigneeIds.length)];

      const response = http.post(
        `${BASE_URL}/api/tasks/${taskId}/assign`,
        JSON.stringify({
          assignedTo: assigneeId,
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
        'assign successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 6: Mark task complete
    group('Complete Task', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];

      const response = http.post(
        `${BASE_URL}/api/tasks/${taskId}/complete`,
        JSON.stringify({
          status: 'completed',
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
        'complete successful': (r) => r.status === 200 || r.status === 404,
        'response time < 500ms': (r) => r.timings.duration < 500,
      });

      sleep(0.5);
    });

    // Test 7: Filter tasks by status
    group('Filter Tasks by Status', () => {
      const statuses = ['todo', 'in_progress', 'completed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const response = http.get(
        `${BASE_URL}/api/tasks?status=${status}`,
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

    // Test 8: Filter tasks by priority
    group('Filter Tasks by Priority', () => {
      const priorities = ['low', 'medium', 'high'];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];

      const response = http.get(
        `${BASE_URL}/api/tasks?priority=${priority}`,
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

    // Test 9: Get task report
    group('Get Task Report', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];

      const response = http.get(
        `${BASE_URL}/api/tasks/${taskId}/report`,
        {
          headers: { 'Authorization': authToken },
          timeout: '5s',
        }
      );

      check(response, {
        'report successful': (r) => r.status === 200 || r.status === 404,
        'response time < 1000ms': (r) => r.timings.duration < 1000,
      });

      sleep(0.5);
    });

    // Test 10: Delete task
    group('Delete Task', () => {
      const taskId = taskIds[Math.floor(Math.random() * taskIds.length)];

      const response = http.delete(
        `${BASE_URL}/api/tasks/${taskId}`,
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
  });
}

export function teardown(data) {
  console.log('✓ Task load test completed');
}
