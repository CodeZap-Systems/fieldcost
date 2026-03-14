import request from 'supertest';
import { TEST_USERS } from '../fixtures/test-users';
import { TEST_PROJECTS, TEST_TASKS } from '../fixtures/test-data';

/**
 * TASKS API TESTS
 * Test REST API endpoints for task management (CRUD, assignment, status)
 */

const API_URL = 'http://localhost:3000';

describe('Tasks API', () => {
  let authToken: string;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    // Login to get auth token
    const loginResponse = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: TEST_USERS.projectManager.email,
        password: TEST_USERS.projectManager.password,
      });

    authToken = loginResponse.body.token;

    // Create a project for task testing
    const projectResponse = await request(API_URL)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: `Test Project for Tasks ${Date.now()}`,
        clientName: 'Test Client',
        budget: 100000,
      });

    projectId = projectResponse.body.id;
  });

  // ================== LIST TASKS TESTS ==================

  describe('GET /api/tasks', () => {
    test('should get all tasks', async () => {
      const response = await request(API_URL)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBeTruthy();
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });

    test('should return tasks with correct structure', async () => {
      const response = await request(API_URL)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 0) {
        const task = response.body.tasks[0];
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('name');
        expect(task).toHaveProperty('projectId');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('priority');
        expect(task).toHaveProperty('estimatedHours');
      }
    });

    test('should return 401 without authorization', async () => {
      const response = await request(API_URL)
        .get('/api/tasks')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should paginate tasks', async () => {
      const response = await request(API_URL)
        .get('/api/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
    });

    test('should filter tasks by project', async () => {
      const response = await request(API_URL)
        .get(`/api/tasks?projectId=${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 0) {
        response.body.tasks.forEach((task: any) => {
          expect(task.projectId).toBe(projectId);
        });
      }
    });

    test('should filter tasks by status', async () => {
      const response = await request(API_URL)
        .get('/api/tasks?status=todo')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 0) {
        response.body.tasks.forEach((task: any) => {
          expect(['todo', 'to-do', 'todo']).toContain(task.status.toLowerCase());
        });
      }
    });

    test('should filter tasks by priority', async () => {
      const response = await request(API_URL)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 0) {
        response.body.tasks.forEach((task: any) => {
          expect(task.priority.toLowerCase()).toBe('high');
        });
      }
    });

    test('should filter tasks by assignee', async () => {
      const response = await request(API_URL)
        .get(`/api/tasks?assignedTo=${TEST_USERS.fieldWorker.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.tasks)).toBeTruthy();
    });

    test('should search tasks by name', async () => {
      const response = await request(API_URL)
        .get('/api/tasks?search=Excavation')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 0) {
        response.body.tasks.forEach((task: any) => {
          expect(task.name.toLowerCase()).toContain('excavation');
        });
      }
    });

    test('should sort tasks by due date', async () => {
      const response = await request(API_URL)
        .get('/api/tasks?sortBy=dueDate&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 1) {
        for (let i = 0; i < response.body.tasks.length - 1; i++) {
          const current = new Date(response.body.tasks[i].dueDate);
          const next = new Date(response.body.tasks[i + 1].dueDate);
          expect(current.getTime()).toBeLessThanOrEqual(next.getTime());
        }
      }
    });

    test('should sort tasks by priority', async () => {
      const priorityValue = (priority: string) => {
        const map: { [key: string]: number } = { high: 3, medium: 2, low: 1 };
        return map[priority.toLowerCase()] || 0;
      };

      const response = await request(API_URL)
        .get('/api/tasks?sortBy=priority&sortOrder=desc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.tasks.length > 1) {
        for (let i = 0; i < response.body.tasks.length - 1; i++) {
          expect(priorityValue(response.body.tasks[i].priority)).toBeGreaterThanOrEqual(
            priorityValue(response.body.tasks[i + 1].priority)
          );
        }
      }
    });
  });

  // ================== GET TASK BY ID TESTS ==================

  describe('GET /api/tasks/:id', () => {
    test('should get task by id', async () => {
      // First create a task
      const createResponse = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Get Test ${Date.now()}`,
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 8,
          budgetedAmount: 1000,
        })
        .expect(201);

      taskId = createResponse.body.id;

      // Then get it
      const response = await request(API_URL)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('projectId');
      expect(response.body).toHaveProperty('status');
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(API_URL)
        .get('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found|does not exist/i);
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .get('/api/tasks/some-id')
        .expect(401);
    });
  });

  // ================== CREATE TASK TESTS ==================

  describe('POST /api/tasks', () => {
    test('should create new task', async () => {
      const newTask = {
        name: `Excavation Work ${Date.now()}`,
        projectId: projectId,
        priority: 'high',
        estimatedHours: TEST_TASKS.excavation.estimatedHours,
        budgetedAmount: TEST_TASKS.excavation.budgetedAmount,
        description: 'Foundation excavation work',
      };

      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newTask.name);
      expect(response.body.projectId).toBe(newTask.projectId);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.estimatedHours).toBe(newTask.estimatedHours);

      taskId = response.body.id;
    });

    test('should create task with default status todo', async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Default Status Test ${Date.now()}`,
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(201);

      expect(['todo', 'to-do', 'TODO']).toContain(response.body.status.toUpperCase());
    });

    test('should return 400 with missing task name', async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/name|required/i);
    });

    test('should return 400 with missing project id', async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Task',
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/project|required/i);
    });

    test('should return 400 with negative estimated hours', async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Task',
          projectId: projectId,
          priority: 'medium',
          estimatedHours: -5,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/hours|positive|greater/i);
    });

    test('should validate priority values', async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Task',
          projectId: projectId,
          priority: 'invalid-priority',
          estimatedHours: 4,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/priority|invalid/i);
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .post('/api/tasks')
        .send({
          name: 'Test Task',
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(401);
    });

    test('should create task with due date', async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Task with Due Date ${Date.now()}`,
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
          dueDate: dueDate.toISOString().split('T')[0],
        })
        .expect(201);

      expect(response.body).toHaveProperty('dueDate');
    });
  });

  // ================== UPDATE TASK TESTS ==================

  describe('PUT /api/tasks/:id', () => {
    beforeAll(async () => {
      // Create a task to update
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Update Test ${Date.now()}`,
          projectId: projectId,
          priority: 'low',
          estimatedHours: 2,
        })
        .expect(201);

      taskId = response.body.id;
    });

    test('should update task', async () => {
      const updates = {
        name: `Updated Task ${Date.now()}`,
        priority: 'high',
        estimatedHours: 8,
      };

      const response = await request(API_URL)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.priority).toBe(updates.priority);
      expect(response.body.estimatedHours).toBe(updates.estimatedHours);
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(API_URL)
        .put('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('should allow partial updates', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          estimatedHours: 16,
        })
        .expect(200);

      expect(response.body.estimatedHours).toBe(16);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('id');
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .put(`/api/tasks/${taskId}`)
        .send({
          name: 'Updated Name',
        })
        .expect(401);
    });
  });

  // ================== TASK STATUS TESTS ==================

  describe('PUT /api/tasks/:id/status', () => {
    let statusTaskId: string;

    beforeAll(async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Status Test ${Date.now()}`,
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(201);

      statusTaskId = response.body.id;
    });

    test('should change task status to in-progress', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${statusTaskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'in-progress',
        })
        .expect(200);

      expect(['in-progress', 'in_progress', 'inprogress']).toContain(
        response.body.status.toLowerCase().replace('_', '-')
      );
    });

    test('should change task status to completed', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${statusTaskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'completed',
        })
        .expect(200);

      expect(['completed', 'done']).toContain(response.body.status.toLowerCase());
    });

    test('should return 400 with invalid status', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${statusTaskId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid-status',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ================== TASK ASSIGNMENT TESTS ==================

  describe('PUT /api/tasks/:id/assign', () => {
    let assignTaskId: string;

    beforeAll(async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Assignment Test ${Date.now()}`,
          projectId: projectId,
          priority: 'medium',
          estimatedHours: 4,
        })
        .expect(201);

      assignTaskId = response.body.id;
    });

    test('should assign task to user', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${assignTaskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignedTo: TEST_USERS.fieldWorker.id,
        })
        .expect(200);

      expect(response.body.assignedTo).toBe(TEST_USERS.fieldWorker.id);
    });

    test('should unassign task', async () => {
      const response = await request(API_URL)
        .put(`/api/tasks/${assignTaskId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignedTo: null,
        })
        .expect(200);

      expect(response.body.assignedTo).toBeNull();
    });

    test('should return 404 for non-existent task', async () => {
      const response = await request(API_URL)
        .put('/api/tasks/non-existent-id/assign')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          assignedTo: TEST_USERS.fieldWorker.id,
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  // ================== DELETE TASK TESTS ==================

  describe('DELETE /api/tasks/:id', () => {
    let deleteTaskId: string;

    beforeAll(async () => {
      const response = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Delete Test ${Date.now()}`,
          projectId: projectId,
          priority: 'low',
          estimatedHours: 1,
        })
        .expect(201);

      deleteTaskId = response.body.id;
    });

    test('should delete task', async () => {
      const response = await request(API_URL)
        .delete(`/api/tasks/${deleteTaskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/deleted|removed|success/i);
    });

    test('should return 404 when deleting non-existent task', async () => {
      const response = await request(API_URL)
        .delete('/api/tasks/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('should not be able to access deleted task', async () => {
      // Create and delete
      const createResponse = await request(API_URL)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Verify Delete ${Date.now()}`,
          projectId: projectId,
          priority: 'low',
          estimatedHours: 1,
        })
        .expect(201);

      const taskToDelete = createResponse.body.id;

      await request(API_URL)
        .delete(`/api/tasks/${taskToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Try to access
      await request(API_URL)
        .get(`/api/tasks/${taskToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .delete(`/api/tasks/${taskId}`)
        .expect(401);
    });
  });

  // ================== TASK STATISTICS TESTS ==================

  describe('GET /api/tasks/statistics', () => {
    test('should get task statistics', async () => {
      const response = await request(API_URL)
        .get('/api/tasks/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalTasks');
      expect(response.body).toHaveProperty('completedTasks');
      expect(response.body).toHaveProperty('inProgressTasks');
      expect(response.body).toHaveProperty('todoTasks');
      expect(response.body).toHaveProperty('overdueTasks');
    });

    test('should calculate correct percentages', async () => {
      const response = await request(API_URL)
        .get('/api/tasks/statistics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.totalTasks > 0) {
        const completionRate =
          (response.body.completedTasks / response.body.totalTasks) * 100;
        expect(response.body.completionPercentage).toBe(completionRate);
      }
    });
  });

  // ================== PROJECT TASKS TESTS ==================

  describe('GET /api/projects/:projectId/tasks', () => {
    test('should get tasks for specific project', async () => {
      const response = await request(API_URL)
        .get(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBeTruthy();

      if (response.body.length > 0) {
        response.body.forEach((task: any) => {
          expect(task.projectId).toBe(projectId);
        });
      }
    });

    test('should return 404 for non-existent project', async () => {
      const response = await request(API_URL)
        .get('/api/projects/non-existent-id/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
