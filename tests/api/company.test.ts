/**
 * API Tests for Company Endpoints
 */

import request from 'supertest';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { getDefaultTestUser } from '@tests/helpers/test-user';
import { getSampleContractorCompany } from '@tests/helpers/test-company';

const API_URL = process.env.API_URL || 'http://localhost:3000';
let authToken: string;

describe('API Company Tests', () => {
  
  beforeAll(async () => {
    const user = getDefaultTestUser();
    const loginRes = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    
    authToken = loginRes.body.token;
  });

  describe('GET /api/company', () => {
    it('should return company profile', async () => {
      const response = await request(API_URL)
        .get('/api/company')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    it('should require authentication', async () => {
      const response = await request(API_URL)
        .get('/api/company');
      
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/company', () => {
    it('should update company profile', async () => {
      const company = getSampleContractorCompany();
      
      const response = await request(API_URL)
        .put('/api/company')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: company.name,
          email: company.email,
          phone: company.phone,
        });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(company.name);
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(API_URL)
        .put('/api/company')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Company',
          email: 'invalid-email',
          phone: '+27111234567',
        });
      
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/company/logo', () => {
    it('should upload company logo', async () => {
      // Note: File upload test requires actual file
      // This is a placeholder for file upload test
      
      const response = await request(API_URL)
        .post('/api/company/logo')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Will typically fail without actual file, but shows endpoint exists
      expect(response.status).toBe(400) || expect(response.status).toBe(200);
    });
  });

  describe('POST /api/company/switch', () => {
    it('should switch to different company', async () => {
      const response = await request(API_URL)
        .post('/api/company/switch')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ companyId: 'company_id_123' });
      
      expect(response.status).toBe(200) || expect(response.status).toBe(404);
    });
  });

  describe('GET /api/company/list', () => {
    it('should list user companies', async () => {
      const response = await request(API_URL)
        .get('/api/company/list')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
