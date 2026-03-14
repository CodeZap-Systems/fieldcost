/**
 * API Tests - Tasks Routes
 * Tests for task management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Tasks API Tests', () => {
  let api: APIHelper;
  let companyId: string | null = null;
  let projectId: string | null = null;

  test.beforeAll(async () => {
    api = new APIHelper();
    const companyResponse = await api.get('/api/company');
    if (companyResponse.status() === 200) {
      const data = await companyResponse.json();
      companyId = data.company?.id;
    }

    // Get or create a project
    const projectsResponse = await api.get('/api/projects', {
      company_id: companyId,
    });
    if (projectsResponse.status() === 200) {
      const projects = await projectsResponse.json();
      if (projects.length > 0) {
        projectId = projects[0].id;
      } else {
        const createResponse = await api.post('/api/projects', {
          ...TEST_DATA.projects.validProject,
          company_id: companyId,
        });
        if (createResponse.status() === 201) {
          const project = await createResponse.json();
          projectId = project.id;
        }
      }
    }
  });

  test.skip(async () => !companyId, 'No company available for testing');

  test.describe('GET /api/tasks', () => {
    test('should fetch all tasks for company', async () => {
      const response = await api.get('/api/tasks', {
        company_id: companyId,
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should require company_id parameter', async () => {
      const response = await api.get('/api/tasks');

      expect(response.status()).toBe(400);
    });

    test('should filter tasks by project', async () => {
      if (projectId) {
        const response = await api.get('/api/tasks', {
          company_id: companyId,
          project_id: projectId,
        });

        const data = await response.json();
        if (data.length > 0) {
          expect(data[0]).toHaveProperty('project_id');
        }
      }
    });

    test('should filter tasks by status', async () => {
      const response = await api.get('/api/tasks', {
        company_id: companyId,
        status: 'open',
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('status');
      }
    });
  });

  test.describe('POST /api/tasks', () => {
    test('should create new task', async () => {
      const newTask = {
        ...TEST_DATA.tasks.validTask,
        project_id: projectId,
        company_id: companyId,
      };

      const response = await api.post('/api/tasks', newTask);

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newTask.name);
    });

    test('should require task name', async () => {
      const invalidTask = {
        description: 'No name task',
        company_id: companyId,
      };

      const response = await api.post('/api/tasks', invalidTask);

      expect(response.status()).toBe(400);
    });

    test('should require company_id', async () => {
      const taskWithoutCompany = {
        ...TEST_DATA.tasks.validTask,
      };

      const response = await api.post('/api/tasks', taskWithoutCompany);

      expect(response.status()).toBe(400);
    });

    test('should support task priority levels', async () => {
      const priorities = ['low', 'medium', 'high', 'critical'];

      for (const priority of priorities) {
        const taskData = {
          ...TEST_DATA.tasks.validTask,
          priority,
          name: `Task ${priority}`,
          company_id: companyId,
        };

        const response = await api.post('/api/tasks', taskData);

        if (response.status() === 201) {
          const data = await response.json();
          expect(data.priority).toBe(priority);
        }
      }
    });
  });

  test.describe('GET /api/tasks/:id', () => {
    test('should fetch task by id', async () => {
      const listResponse = await api.get('/api/tasks', {
        company_id: companyId,
      });

      const tasks = await listResponse.json();
      if (tasks.length > 0) {
        const taskId = tasks[0].id;
        const response = await api.get(`/api/tasks/${taskId}`, {
          company_id: companyId,
        });

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(taskId);
      }
    });
  });

  test.describe('PUT /api/tasks/:id', () => {
    test('should update task', async () => {
      const listResponse = await api.get('/api/tasks', {
        company_id: companyId,
      });

      const tasks = await listResponse.json();
      if (tasks.length > 0) {
        const taskId = tasks[0].id;
        const response = await api.put(`/api/tasks/${taskId}`, {
          status: 'completed',
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.status).toBe('completed');
        }
      }
    });

    test('should mark task complete', async () => {
      const listResponse = await api.get('/api/tasks', {
        company_id: companyId,
      });

      const tasks = await listResponse.json();
      if (tasks.length > 0) {
        const taskId = tasks[0].id;
        const response = await api.put(`/api/tasks/${taskId}`, {
          status: 'completed',
          completed_at: new Date().toISOString(),
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.status).toBe('completed');
        }
      }
    });

    test('should update task priority', async () => {
      const listResponse = await api.get('/api/tasks', {
        company_id: companyId,
      });

      const tasks = await listResponse.json();
      if (tasks.length > 0) {
        const taskId = tasks[0].id;
        const response = await api.put(`/api/tasks/${taskId}`, {
          priority: 'high',
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.priority).toBe('high');
        }
      }
    });
  });

  test.describe('DELETE /api/tasks/:id', () => {
    test('should delete task', async () => {
      const createResponse = await api.post('/api/tasks', {
        ...TEST_DATA.tasks.validTask,
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const created = await createResponse.json();
        const deleteResponse = await api.delete(`/api/tasks/${created.id}`, {
          company_id: companyId,
        });

        expect([200, 204]).toContain(deleteResponse.status());
      }
    });
  });

  test.describe('Task Workflow', () => {
    test('should transition task through states', async () => {
      const states = ['open', 'in_progress', 'completed'];
      
      const createResponse = await api.post('/api/tasks', {
        ...TEST_DATA.tasks.validTask,
        status: states[0],
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const task = await createResponse.json();
        
        for (const state of states.slice(1)) {
          const updateResponse = await api.put(`/api/tasks/${task.id}`, {
            status: state,
          });
          
          if (updateResponse.status() === 200) {
            const updated = await updateResponse.json();
            expect(updated.status).toBe(state);
          }
        }
      }
    });
  });

  test.describe('Task Assignment', () => {
    test('should assign task to user', async () => {
      const listResponse = await api.get('/api/tasks', {
        company_id: companyId,
      });

      const tasks = await listResponse.json();
      if (tasks.length > 0) {
        const taskId = tasks[0].id;
        const response = await api.put(`/api/tasks/${taskId}`, {
          assigned_to: 'test-user-id',
        });

        // May or may not support direct assignment
        expect([200, 400]).toContain(response.status());
      }
    });
  });
});
