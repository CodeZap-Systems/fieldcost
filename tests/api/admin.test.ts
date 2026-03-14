/**
 * API Tests for Admin/RBAC Endpoints
 */

import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { getDefaultTestUser, getTestUserByRole } from '@tests/helpers/test-user';
import { rbacTestData } from '@tests/fixtures/test-data';

const API_URL = process.env.API_URL || 'http://localhost:3000';
let adminToken: string;
let pmToken: string;

describe('API Admin/RBAC Tests', () => {
  
  beforeAll(async () => {
    // Get admin token
    const adminUser = getDefaultTestUser();
    const adminRes = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: adminUser.email,
        password: adminUser.password,
      });
    
    adminToken = adminRes.body.token;
    
    // Get PM token
    const pmUser = getTestUserByRole('project_manager');
    const pmRes = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: pmUser.email,
        password: pmUser.password,
      });
    
    pmToken = pmRes.body.token;
  });

  describe('GET /api/admin/users', () => {
    it('should list users for admin', async () => {
      const response = await request(API_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should deny access for non-admin user', async () => {
      const response = await request(API_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${pmToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/admin/roles/:userId', () => {
    it('should assign role to user', async () => {
      const response = await request(API_URL)
        .post('/api/admin/roles/user_id_123')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'project_manager' });
      
      expect(response.status).toBe(200) || expect(response.status).toBe(201);
    });

    it('should deny role assignment for non-admin', async () => {
      const response = await request(API_URL)
        .post('/api/admin/roles/user_id_123')
        .set('Authorization', `Bearer ${pmToken}`)
        .send({ role: 'project_manager' });
      
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/roles', () => {
    it('should list available roles', async () => {
      const response = await request(API_URL)
        .get('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return role objects with permissions', async () => {
      const response = await request(API_URL)
        .get('/api/admin/roles')
        .set('Authorization', `Bearer ${adminToken}`);
      
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('permissions');
      }
    });
  });

  describe('GET /api/admin/audit-logs', () => {
    it('should return audit logs for admin', async () => {
      const response = await request(API_URL)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should deny access for non-admin', async () => {
      const response = await request(API_URL)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${pmToken}`);
      
      expect(response.status).toBe(403);
    });

    it('should support filtering by action', async () => {
      const response = await request(API_URL)
        .get('/api/admin/audit-logs?action=CREATE')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
    });

    it('should support pagination', async () => {
      const response = await request(API_URL)
        .get('/api/admin/audit-logs?limit=50&offset=0')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/admin/subscription', () => {
    it('should create subscription plan for admin', async () => {
      const response = await request(API_URL)
        .post('/api/admin/subscription')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Premium Plan',
          price: 2999,
          tier: 'tier2',
        });
      
      expect(response.status).toBe(201) || expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });

    it('should deny subscription creation for non-admin', async () => {
      const response = await request(API_URL)
        .post('/api/admin/subscription')
        .set('Authorization', `Bearer ${pmToken}`)
        .send({
          name: 'Premium Plan',
          price: 2999,
          tier: 'tier2',
        });
      
      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/admin/subscription', () => {
    it('should list subscription plans', async () => {
      const response = await request(API_URL)
        .get('/api/admin/subscription')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/admin/metrics', () => {
    it('should return platform metrics for admin', async () => {
      const response = await request(API_URL)
        .get('/api/admin/metrics')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalUsers') || expect(response.body).toHaveProperty('mrrData');
    });

    it('should deny access for non-admin', async () => {
      const response = await request(API_URL)
        .get('/api/admin/metrics')
        .set('Authorization', `Bearer ${pmToken}`);
      
      expect(response.status).toBe(403);
    });
  });

  describe('Permission Verification', () => {
    it('should verify admin can access admin endpoints', async () => {
      const response = await request(API_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
    });

    it('should verify PM cannot delete users', async () => {
      const response = await request(API_URL)
        .delete('/api/admin/users/user_id_123')
        .set('Authorization', `Bearer ${pmToken}`);
      
      expect(response.status).toBe(403);
    });

    it('should verify field crew can only read assigned data', async () => {
      const crewUser = getTestUserByRole('field_crew');
      const crewRes = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: crewUser.email,
          password: crewUser.password,
        });
      
      const crewToken = crewRes.body.token;
      
      const response = await request(API_URL)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${crewToken}`);
      
      expect(response.status).toBe(403);
    });
  });
});
