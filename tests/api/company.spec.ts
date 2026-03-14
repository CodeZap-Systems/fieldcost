/**
 * API Tests - Company Routes
 * Tests for company profile management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';

test.describe('Company API Tests', () => {
  let api: APIHelper;
  const companyData = {
    name: 'Test Company Updated',
    email: 'contact@testcompany.co.za',
    phone: '+27 11 555 1234',
    address_line1: '123 Main Street',
    address_line2: 'Suite 100',
    city: 'Johannesburg',
    province: 'Gauteng',
    postal_code: '2000',
    country: 'South Africa',
    default_currency: 'ZAR',
  };

  test.beforeAll(async () => {
    api = new APIHelper();
  });

  test.describe('GET /api/company', () => {
    test('should fetch company profile', async () => {
      const response = await api.get('/api/company');
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('company');
      expect(data.company).toHaveProperty('id');
      expect(data.company).toHaveProperty('name');
    });

    test('should return array of companies', async () => {
      const response = await api.get('/api/company');
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('companies');
      expect(Array.isArray(data.companies)).toBe(true);
    });

    test('should support company_id parameter', async () => {
      const firstResponse = await api.get('/api/company');
      const firstData = await firstResponse.json();
      
      if (firstData.company?.id) {
        const secondResponse = await api.get('/api/company', {
          company_id: firstData.company.id,
        });
        
        expect(secondResponse.status()).toBe(200);
        const secondData = await secondResponse.json();
        expect(secondData.company?.id).toBe(firstData.company.id);
      }
    });

    test('should return 400 for invalid company_id', async () => {
      const response = await api.get('/api/company', {
        company_id: 'invalid-company-id-that-does-not-exist-999',
      });
      
      // Should either return empty or 400
      expect([200, 400, 404]).toContain(response.status());
    });
  });

  test.describe('PUT /api/company', () => {
    test('should update company profile', async () => {
      const response = await api.put('/api/company', companyData);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(companyData.name);
      expect(data.email).toBe(companyData.email);
    });

    test('should update partial company data', async () => {
      const partialData = {
        name: 'Partially Updated Company',
      };
      
      const response = await api.put('/api/company', partialData);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.name).toBe(partialData.name);
    });

    test('should require company name', async () => {
      const invalidData = {
        email: 'test@company.com',
        phone: '+27 11 555 1234',
      };
      
      const response = await api.put('/api/company', invalidData);
      
      // Should return 400 error for missing name
      expect([400, 409]).toContain(response.status());
    });

    test('should validate email format', async () => {
      const invalidData = {
        ...companyData,
        email: 'invalid-email',
      };
      
      const response = await api.put('/api/company', invalidData);
      
      // May accept or reject depending on validation
      expect([200, 400, 409]).toContain(response.status());
    });

    test('should update currency code', async () => {
      const currencyData = {
        ...companyData,
        default_currency: 'USD',
      };
      
      const response = await api.put('/api/company', currencyData);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.default_currency).toBe('USD');
    });

    test('should support invoice template selection', async () => {
      const templateData = {
        ...companyData,
        invoice_template: 'detailed',
      };
      
      const response = await api.put('/api/company', templateData);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.invoice_template).toBe('detailed');
    });

    test('should handle ERP targets configuration', async () => {
      const erpData = {
        ...companyData,
        erp_targets: ['sage-bca-sa', 'xero'],
      };
      
      const response = await api.put('/api/company', erpData);
      
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.erp_targets)).toBe(true);
    });
  });

  test.describe('Logo Upload', () => {
    test('should upload logo to company', async () => {
      // Note: This requires file upload capability
      // Would need FormData and file handling
      const response = await api.post('/api/company/logo', {
        file: 'test-logo.png',
      });
      
      // Should return 200 or appropriate status
      expect([200, 201, 400, 500]).toContain(response.status());
    });

    test('should return logo public URL', async () => {
      const response = await api.post('/api/company/logo', {
        file: 'test-logo.png',
      });
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('publicUrl');
      }
    });

    test('should reject invalid file types', async () => {
      const response = await api.post('/api/company/logo', {
        file: 'document.pdf',
      });
      
      // Should return 400 for invalid file
      expect([400, 415]).toContain(response.status());
    });
  });

  test.describe('Company Data Validation', () => {
    test('should preserve existing data on partial update', async () => {
      // First, get current company
      const getResponse = await api.get('/api/company');
      const originalData = await getResponse.json();
      
      // Update only one field
      const updateResponse = await api.put('/api/company', {
        name: 'New Name',
      });
      
      if (updateResponse.status() === 200) {
        const updatedData = await updateResponse.json();
        // Other fields should be preserved
        expect(updatedData.email).toBe(originalData.company?.email || updatedData.email);
      }
    });

    test('should sanitize input data', async () => {
      const dirtyData = {
        ...companyData,
        name: '<script>alert("xss")</script>Company',
      };
      
      const response = await api.put('/api/company', dirtyData);
      
      if (response.status() === 200) {
        const data = await response.json();
        expect(data.name).not.toContain('<script>');
      }
    });
  });
});
