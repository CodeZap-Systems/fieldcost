import request from 'supertest';
import { TEST_USERS } from '../fixtures/test-users';
import { TEST_PROJECTS } from '../fixtures/test-data';

/**
 * PROJECTS API TESTS
 * Test REST API endpoints for project management (CRUD, filters, reports)
 */

const API_URL = 'http://localhost:3000';

describe('Projects API', () => {
  let authToken: string;
  let projectId: string;
  let companyId: string;

  beforeAll(async () => {
    // Login as project manager to get auth token
    const loginResponse = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: TEST_USERS.projectManager.email,
        password: TEST_USERS.projectManager.password,
      });

    authToken = loginResponse.body.token;
    companyId = loginResponse.body.user.companyId || 'default-company';
  });

  // ================== LIST PROJECTS TESTS ==================

  describe('GET /api/projects', () => {
    test('should get all projects', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('projects');
      expect(Array.isArray(response.body.projects)).toBeTruthy();
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
    });

    test('should return projects with correct structure', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.projects.length > 0) {
        const project = response.body.projects[0];
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('clientName');
        expect(project).toHaveProperty('budget');
        expect(project).toHaveProperty('status');
        expect(project).toHaveProperty('startDate');
        expect(project).toHaveProperty('endDate');
      }
    });

    test('should return 401 without authorization', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should paginate projects list', async () => {
      const response = await request(API_URL)
        .get('/api/projects?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(response.body.projects.length).toBeLessThanOrEqual(10);
    });

    test('should filter projects by status', async () => {
      const response = await request(API_URL)
        .get('/api/projects?status=active')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.projects.length > 0) {
        response.body.projects.forEach((project: any) => {
          expect(project.status).toMatch(/active|ongoing|in_progress/i);
        });
      }
    });

    test('should search projects by name', async () => {
      const response = await request(API_URL)
        .get(`/api/projects?search=Residential`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.projects.length > 0) {
        response.body.projects.forEach((project: any) => {
          expect(project.name.toLowerCase()).toContain('residential');
        });
      }
    });

    test('should filter projects by client', async () => {
      const response = await request(API_URL)
        .get(`/api/projects?clientName=Smith`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body.projects)).toBeTruthy();
    });

    test('should sort projects by name', async () => {
      const response = await request(API_URL)
        .get('/api/projects?sortBy=name&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.projects.length > 1) {
        for (let i = 0; i < response.body.projects.length - 1; i++) {
          const current = response.body.projects[i].name;
          const next = response.body.projects[i + 1].name;
          expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
        }
      }
    });

    test('should sort projects by budget descending', async () => {
      const response = await request(API_URL)
        .get('/api/projects?sortBy=budget&sortOrder=desc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (response.body.projects.length > 1) {
        for (let i = 0; i < response.body.projects.length - 1; i++) {
          expect(response.body.projects[i].budget).toBeGreaterThanOrEqual(
            response.body.projects[i + 1].budget
          );
        }
      }
    });

    test('should return empty array if no projects match filter', async () => {
      const response = await request(API_URL)
        .get('/api/projects?search=NonExistentProject')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.projects).toEqual([]);
    });
  });

  // ================== GET PROJECT BY ID TESTS ==================

  describe('GET /api/projects/:id', () => {
    test('should get project by id', async () => {
      // First get a project
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toBe(projectId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('clientName');
        expect(response.body).toHaveProperty('budget');
      }
    });

    test('should return 404 for non-existent project', async () => {
      const response = await request(API_URL)
        .get('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not found|does not exist/i);
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .get('/api/projects/some-id')
        .expect(401);
    });

    test('should include project tasks in response', async () => {
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        const projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}?include=tasks`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('tasks');
        expect(Array.isArray(response.body.tasks)).toBeTruthy();
      }
    });
  });

  // ================== CREATE PROJECT TESTS ==================

  describe('POST /api/projects', () => {
    test('should create new project', async () => {
      const newProject = {
        name: `Test Project ${Date.now()}`,
        clientName: TEST_PROJECTS.residential.clientName,
        description: 'Test project description',
        budget: TEST_PROJECTS.residential.budget,
        startDate: '2024-03-15',
        endDate: '2024-09-15',
        status: 'active',
      };

      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProject)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newProject.name);
      expect(response.body.clientName).toBe(newProject.clientName);
      expect(response.body.budget).toBe(newProject.budget);
      expect(response.body.status).toBe(newProject.status);

      projectId = response.body.id;
    });

    test('should return 400 with missing project name', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          clientName: 'Test Client',
          budget: 50000,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/name|required/i);
    });

    test('should return 400 with missing client name', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          budget: 50000,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/client|required/i);
    });

    test('should return 400 with negative budget', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          clientName: 'Test Client',
          budget: -5000,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/budget|positive|greater/i);
    });

    test('should return 400 with invalid date range', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          clientName: 'Test Client',
          budget: 50000,
          startDate: '2024-12-31',
          endDate: '2024-01-01', // End before start
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/date|after|before/i);
    });

    test('should return 401 without authorization', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .send({
          name: 'Test Project',
          clientName: 'Test Client',
          budget: 50000,
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });

    test('should create project with tag', async () => {
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Tagged Project ${Date.now()}`,
          clientName: 'Test Client',
          budget: 50000,
          tags: ['residential', 'urgent'],
        })
        .expect(201);

      expect(response.body.tags).toContain('residential');
      expect(response.body.tags).toContain('urgent');
    });
  });

  // ================== UPDATE PROJECT TESTS ==================

  describe('PUT /api/projects/:id', () => {
    beforeAll(async () => {
      // Create a project to update
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Update Test ${Date.now()}`,
          clientName: 'Test Client',
          budget: 50000,
        })
        .expect(201);

      projectId = response.body.id;
    });

    test('should update project', async () => {
      const updates = {
        name: `Updated Project ${Date.now()}`,
        budget: 75000,
        status: 'on-hold',
      };

      const response = await request(API_URL)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
      expect(response.body.budget).toBe(updates.budget);
      expect(response.body.status).toBe(updates.status);
    });

    test('should return 404 for non-existent project', async () => {
      const response = await request(API_URL)
        .put('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
        })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('should return 400 with invalid budget', async () => {
      const response = await request(API_URL)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          budget: -10000,
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    test('should allow partial updates', async () => {
      const response = await request(API_URL)
        .put(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          budget: 100000,
        })
        .expect(200);

      expect(response.body.budget).toBe(100000);
      // Other fields should remain unchanged
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .put(`/api/projects/${projectId}`)
        .send({
          name: 'Updated Name',
        })
        .expect(401);
    });
  });

  // ================== DELETE PROJECT TESTS ==================

  describe('DELETE /api/projects/:id', () => {
    let deleteProjectId: string;

    beforeAll(async () => {
      // Create a project to delete
      const response = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Delete Test ${Date.now()}`,
          clientName: 'Test Client',
          budget: 50000,
        })
        .expect(201);

      deleteProjectId = response.body.id;
    });

    test('should delete project', async () => {
      const response = await request(API_URL)
        .delete(`/api/projects/${deleteProjectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/deleted|removed|success/i);
    });

    test('should return 404 when deleting non-existent project', async () => {
      const response = await request(API_URL)
        .delete('/api/projects/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    test('should return 401 without authorization', async () => {
      await request(API_URL)
        .delete(`/api/projects/${projectId}`)
        .expect(401);
    });

    test('should not be able to access deleted project', async () => {
      // Delete the project first
      const createResponse = await request(API_URL)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: `Verify Delete ${Date.now()}`,
          clientName: 'Test Client',
          budget: 50000,
        })
        .expect(201);

      const projectToDelete = createResponse.body.id;

      // Delete it
      await request(API_URL)
        .delete(`/api/projects/${projectToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Try to access it
      const getResponse = await request(API_URL)
        .get(`/api/projects/${projectToDelete}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(getResponse.body).toHaveProperty('message');
    });
  });

  // ================== PROJECT BUDGET TESTS ==================

  describe('GET /api/projects/:id/budget', () => {
    test('should get project budget summary', async () => {
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        const projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}/budget`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('allocated');
        expect(response.body).toHaveProperty('spent');
        expect(response.body).toHaveProperty('remaining');
        expect(response.body.allocated).toBeGreaterThanOrEqual(0);
      }
    });

    test('should reflect task costs in budget spending', async () => {
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        const projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}/budget`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        // Spent should be >= 0
        expect(response.body.spent).toBeGreaterThanOrEqual(0);
        // Remaining should equal allocated - spent
        expect(response.body.remaining).toBe(
          response.body.allocated - response.body.spent
        );
      }
    });
  });

  // ================== PROJECT REPORT TESTS ==================

  describe('GET /api/projects/:id/report', () => {
    test('should get project progress report', async () => {
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        const projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}/report`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('totalTasks');
        expect(response.body).toHaveProperty('completedTasks');
        expect(response.body).toHaveProperty('progressPercentage');
        expect(response.body).toHaveProperty('budgetStatus');
      }
    });

    test('should calculate correct progress percentage', async () => {
      const listResponse = await request(API_URL)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (listResponse.body.projects.length > 0) {
        const projectId = listResponse.body.projects[0].id;

        const response = await request(API_URL)
          .get(`/api/projects/${projectId}/report`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        const expectedProgress =
          response.body.totalTasks > 0
            ? (response.body.completedTasks / response.body.totalTasks) * 100
            : 0;

        expect(response.body.progressPercentage).toBe(expectedProgress);
      }
    });
  });
});
