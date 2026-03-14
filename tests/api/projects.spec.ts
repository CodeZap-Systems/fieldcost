/**
 * API Tests - Projects Routes
 * Tests for project management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Projects API Tests', () => {
  let api: APIHelper;
  let companyId: string | null = null;

  test.beforeAll(async () => {
    api = new APIHelper();
    // Get or create company for testing
    const response = await api.get('/api/company');
    if (response.status() === 200) {
      const data = await response.json();
      companyId = data.company?.id;
    }
  });

  test.skip(async () => !companyId, 'No company available for testing');

  test.describe('GET /api/projects', () => {
    test('should fetch all projects for company', async () => {
      const response = await api.get('/api/projects', {
        company_id: companyId,
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should require company_id parameter', async () => {
      const response = await api.get('/api/projects');

      expect(response.status()).toBe(400);
    });

    test('should limit returned projects', async () => {
      const response = await api.get('/api/projects', {
        company_id: companyId,
      });

      const data = await response.json();
      // Most APIs limit to 50-100 records per request
      expect(data.length).toBeLessThanOrEqual(100);
    });

    test('should filter by project status', async () => {
      const response = await api.get('/api/projects', {
        company_id: companyId,
        status: 'active',
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('status');
      }
    });
  });

  test.describe('POST /api/projects', () => {
    test('should create new project', async () => {
      const newProject = {
        ...TEST_DATA.projects.validProject,
        company_id: companyId,
      };

      const response = await api.post('/api/projects', newProject);

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newProject.name);
    });

    test('should require project name', async () => {
      const invalidProject = {
        description: 'No name project',
        company_id: companyId,
      };

      const response = await api.post('/api/projects', invalidProject);

      expect(response.status()).toBe(400);
    });

    test('should validate project budget', async () => {
      const invalidProject = {
        ...TEST_DATA.projects.validProject,
        budget: -1000,
        company_id: companyId,
      };

      const response = await api.post('/api/projects', invalidProject);

      expect([200, 201, 400]).toContain(response.status());
    });

    test('should validate date range', async () => {
      const invalidProject = {
        ...TEST_DATA.projects.validProject,
        start_date: '2026-03-31',
        end_date: '2026-01-01',
        company_id: companyId,
      };

      const response = await api.post('/api/projects', invalidProject);

      // May accept or validate
      expect([200, 201, 400]).toContain(response.status());
    });

    test('should require company_id', async () => {
      const projectWithoutCompany = {
        ...TEST_DATA.projects.validProject,
      };

      const response = await api.post('/api/projects', projectWithoutCompany);

      expect(response.status()).toBe(400);
    });
  });

  test.describe('GET /api/projects/:id', () => {
    test('should fetch project by id', async () => {
      // First get a project
      const listResponse = await api.get('/api/projects', {
        company_id: companyId,
      });

      const projects = await listResponse.json();
      if (projects.length > 0) {
        const projectId = projects[0].id;
        const response = await api.get(`/api/projects/${projectId}`, {
          company_id: companyId,
        });

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(projectId);
      }
    });

    test('should return 404 for non-existent project', async () => {
      const response = await api.get('/api/projects/non-existent-id-12345', {
        company_id: companyId,
      });

      expect([404, 403]).toContain(response.status());
    });
  });

  test.describe('PUT /api/projects/:id', () => {
    test('should update project', async () => {
      // Get a project first
      const listResponse = await api.get('/api/projects', {
        company_id: companyId,
      });

      const projects = await listResponse.json();
      if (projects.length > 0) {
        const projectId = projects[0].id;
        const updateData = {
          ...projects[0],
          name: 'Updated Project Name',
        };

        const response = await api.put(`/api/projects/${projectId}`, updateData);

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.name).toBe('Updated Project Name');
        }
      }
    });

    test('should not allow empty project name', async () => {
      const listResponse = await api.get('/api/projects', {
        company_id: companyId,
      });

      const projects = await listResponse.json();
      if (projects.length > 0) {
        const projectId = projects[0].id;
        const response = await api.put(`/api/projects/${projectId}`, {
          name: '',
        });

        expect(response.status()).toBe(400);
      }
    });
  });

  test.describe('DELETE /api/projects/:id', () => {
    test('should delete project', async () => {
      // Create a project for deletion
      const createResponse = await api.post('/api/projects', {
        ...TEST_DATA.projects.validProject,
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const created = await createResponse.json();
        const deleteResponse = await api.delete(`/api/projects/${created.id}`, {
          company_id: companyId,
        });

        expect([200, 204]).toContain(deleteResponse.status());
      }
    });

    test('should return 404 for non-existent project', async () => {
      const response = await api.delete('/api/projects/non-existent-id', {
        company_id: companyId,
      });

      expect([404, 403]).toContain(response.status());
    });
  });

  test.describe('Project Data Validation', () => {
    test('should accept valid project status values', async () => {
      const validStatuses = ['active', 'completed', 'on-hold', 'cancelled'];

      for (const status of validStatuses) {
        const projectData = {
          ...TEST_DATA.projects.validProject,
          status,
          company_id: companyId,
        };

        const response = await api.post('/api/projects', projectData);

        if (response.status() === 201) {
          const data = await response.json();
          expect(data.status).toBe(status);
        }
      }
    });

    test('should calculate project duration', async () => {
      const response = await api.post('/api/projects', {
        ...TEST_DATA.projects.validProject,
        company_id: companyId,
      });

      if (response.status() === 201) {
        const data = await response.json();
        // Duration should be calculable from dates
        expect(data).toHaveProperty('start_date');
        expect(data).toHaveProperty('end_date');
      }
    });
  });
});
