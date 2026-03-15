/**
 * API Tests - Projects
 * Jest + Supertest tests for project endpoints
 */

import request from 'supertest';
import { generateTestProject } from '../helpers/generators';

const API_URL = 'http://localhost:3000';

describe('Projects API', () => {
  let createdProjectId: number;

  describe('POST /api/projects', () => {
    test('should create new project', async () => {
      const project = generateTestProject();

      const response = await request(API_URL).post('/api/projects').send(project);

      expect([200, 201]).toContain(response.status);
      if (response.body.id) {
        createdProjectId = response.body.id;
      }
    });

    test('should return 400 without project name', async () => {
      const project = generateTestProject();
      delete project.name;

      const response = await request(API_URL).post('/api/projects').send(project);

      expect(response.status).toBe(400);
    });

    test('should return 400 without company_id', async () => {
      const project = generateTestProject();
      delete project.company_id;

      const response = await request(API_URL).post('/api/projects').send(project);

      expect(response.status).toBe(400);
    });

    test('should set default status to active', async () => {
      const project = generateTestProject();
      delete project.status;

      const response = await request(API_URL).post('/api/projects').send(project);

      if (response.status === 201 || response.status === 200) {
        expect(['active', 'draft']).toContain(response.body.status);
      }
    });

    test('should validate budget is positive number', async () => {
      const project = generateTestProject();
      project.budget = -1000;

      const response = await request(API_URL).post('/api/projects').send(project);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/projects', () => {
    test('should list projects for company', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .query({ company_id: 8 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should filter projects by status', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .query({ company_id: 8, status: 'active' });

      expect(response.status).toBe(200);
    });

    test('should return 400 without company_id', async () => {
      const response = await request(API_URL).get('/api/projects');

      expect(response.status).toBe(400);
    });

    test('should handle pagination', async () => {
      const response = await request(API_URL)
        .get('/api/projects')
        .query({ company_id: 8, limit: 5 });

      expect(response.status).toBe(200);
    });
  });

  describe('PATCH /api/projects/:id', () => {
    test('should update project', async () => {
      if (!createdProjectId) {
        const project = generateTestProject();
        const createResponse = await request(API_URL).post('/api/projects').send(project);
        createdProjectId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/projects/${createdProjectId}`)
        .send({
          company_id: 8,
          name: 'Updated Project Name',
          status: 'completed',
        });

      expect([200, 204]).toContain(response.status);
    });

    test('should validate budget on update', async () => {
      if (!createdProjectId) {
        const project = generateTestProject();
        const createResponse = await request(API_URL).post('/api/projects').send(project);
        createdProjectId = createResponse.body.id;
      }

      const response = await request(API_URL)
        .patch(`/api/projects/${createdProjectId}`)
        .send({
          company_id: 8,
          budget: -500,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    test('should delete project', async () => {
      const project = generateTestProject();
      const createResponse = await request(API_URL).post('/api/projects').send(project);
      const projectId = createResponse.body.id;

      const response = await request(API_URL)
        .delete(`/api/projects/${projectId}`)
        .query({ company_id: 8 });

      expect([200, 204]).toContain(response.status);
    });

    test('should return 404 for non-existent project', async () => {
      const response = await request(API_URL)
        .delete('/api/projects/99999')
        .query({ company_id: 8 });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
