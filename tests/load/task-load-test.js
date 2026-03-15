/**
 * k6 Load Test - Task Management Endpoints
 * Tests task creation, updates, and listing under load
 *
 * Run with:
 * k6 run tests/load/task-load-test.js
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

// Helper to get demo user and project
function getDemoUserWithProject() {
  // Create demo user
  const demoPayload = JSON.stringify({
    company: `LoadTest Task ${__VU} ${Date.now()}`,
  });

  const demoParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const demoResponse = http.post(`${BASE_URL}/api/demo`, demoPayload, demoParams);

  try {
    const body = JSON.parse(demoResponse.body);
    return {
      userId: body.demoUserId || `demo-user-${__VU}`,
      projectId: body.projects?.[0]?.id || 1,
      success: demoResponse.status < 300,
    };
  } catch (e) {
    return {
      userId: `demo-user-${__VU}`,
      projectId: 1,
      success: false,
    };
  }
}

// Test: Create Task
export function createTask(userId, projectId, taskNumber) {
  group('Create Task (POST /api/tasks)', function () {
    const payload = JSON.stringify({
      name: `Load Test Task ${__VU}-${taskNumber}`,
      description: `Performance test task`,
      project_id: projectId,
      status: 'todo',
      seconds: Math.floor(Math.random() * 3600) + 300, // 5 min to 1 hour
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.post(`${BASE_URL}/api/tasks`, payload, params);

    check(response, {
      'create status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'create response time < 500ms': (r) => r.timings.duration < 500,
      'has task ID': (r) => {
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

// Test: List Tasks
export function listTasks(userId) {
  group('List Tasks (GET /api/tasks)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/tasks`, params);

    check(response, {
      'list status is 200': (r) => r.status === 200,
      'list response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Update Task Status
export function updateTaskStatus(userId, taskId, newStatus) {
  if (!taskId) return;

  group('Update Task Status (PATCH /api/tasks/:id)', function () {
    const payload = JSON.stringify({
      status: newStatus,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId,
      },
    };

    const response = http.patch(`${BASE_URL}/api/tasks/${taskId}`, payload, params);

    check(response, {
      'update status is 2xx': (r) => r.status >= 200 && r.status < 300,
      'update response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Get Task Detail
export function getTaskDetail(userId, taskId) {
  if (!taskId) return;

  group('Get Task Detail (GET /api/tasks/:id)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.get(`${BASE_URL}/api/tasks/${taskId}`, params);

    check(response, {
      'get detail status is 200': (r) => r.status === 200,
      'get detail response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Test: Delete Task
export function deleteTask(userId, taskId) {
  if (!taskId) return;

  group('Delete Task (DELETE /api/tasks/:id)', function () {
    const params = {
      headers: {
        'X-User-ID': userId,
      },
    };

    const response = http.delete(`${BASE_URL}/api/tasks/${taskId}`, params);

    check(response, {
      'delete status is 2xx or 204': (r) => (r.status >= 200 && r.status < 300) || r.status === 204,
      'delete response time < 500ms': (r) => r.timings.duration < 500,
    });
  });
}

// Main test execution
export default function () {
  // Get demo user with project
  const context = getDemoUserWithProject();
  if (!context.success) {
    console.warn(`Failed to get demo context for VU ${__VU}`);
    sleep(1);
    return;
  }

  const { userId, projectId } = context;

  // Simulate task management workflow
  const taskId = createTask(userId, projectId, __ITER);
  sleep(0.5);

  listTasks(userId);
  sleep(0.5);

  if (taskId) {
    getTaskDetail(userId, taskId);
    sleep(0.5);

    // Update task status
    const statuses = ['todo', 'in-progress', 'done'];
    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
    updateTaskStatus(userId, taskId, newStatus);
    sleep(0.5);

    // Occasionally delete task
    if (__ITER % 5 === 0) {
      deleteTask(userId, taskId);
    }
  }
}
