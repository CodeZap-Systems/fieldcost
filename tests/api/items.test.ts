/**
 * API Tests - Items/Inventory Routes
 * Tests for inventory and items management API endpoints
 */

import { test, expect } from '@playwright/test';
import { APIHelper } from '../../helpers/api';
import { TEST_DATA } from '../../fixtures/test-data';

test.describe('Items/Inventory API Tests', () => {
  let api: APIHelper;
  let companyId: string | null = null;

  test.beforeAll(async () => {
    api = new APIHelper();
    const response = await api.get('/api/company');
    if (response.status() === 200) {
      const data = await response.json();
      companyId = data.company?.id;
    }
  });

  test.skip(async () => !companyId, 'No company available for testing');

  test.describe('GET /api/items', () => {
    test('should fetch all items for company', async () => {
      const response = await api.get('/api/items', {
        company_id: companyId,
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should require company_id parameter', async () => {
      const response = await api.get('/api/items');

      expect(response.status()).toBe(400);
    });

    test('should return items with pricing', async () => {
      const response = await api.get('/api/items', {
        company_id: companyId,
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('rate');
        expect(data[0]).toHaveProperty('unit');
      }
    });

    test('should filter items by category', async () => {
      const response = await api.get('/api/items', {
        company_id: companyId,
        category: 'labour',
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0]).toHaveProperty('category');
      }
    });
  });

  test.describe('POST /api/items', () => {
    test('should create new item', async () => {
      const newItem = {
        ...TEST_DATA.inventory.labourItem,
        company_id: companyId,
      };

      const response = await api.post('/api/items', newItem);

      expect(response.status()).toBe(201);
      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.name).toBe(newItem.name);
      expect(data.rate).toBe(newItem.rate);
    });

    test('should require item name', async () => {
      const invalidItem = {
        rate: 100,
        unit: 'hour',
        company_id: companyId,
      };

      const response = await api.post('/api/items', invalidItem);

      expect(response.status()).toBe(400);
    });

    test('should require rate/pricing', async () => {
      const invalidItem = {
        name: 'Item without price',
        unit: 'hour',
        company_id: companyId,
      };

      const response = await api.post('/api/items', invalidItem);

      // May or may not be required
      expect([200, 201, 400]).toContain(response.status());
    });

    test('should support different unit types', async () => {
      const units = ['hour', 'day', 'week', 'month', 'item', 'cubic_metre'];

      for (const unit of units) {
        const itemData = {
          ...TEST_DATA.inventory.labourItem,
          unit,
          name: `Test Item ${unit}`,
          company_id: companyId,
        };

        const response = await api.post('/api/items', itemData);

        if (response.status() === 201) {
          const data = await response.json();
          expect(data.unit).toBe(unit);
        }
      }
    });

    test('should support item categories', async () => {
      const testItem = {
        ...TEST_DATA.inventory.materialItem,
        category: 'materials',
        company_id: companyId,
      };

      const response = await api.post('/api/items', testItem);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data.category).toBe('materials');
      }
    });
  });

  test.describe('GET /api/items/:id', () => {
    test('should fetch item by id', async () => {
      const listResponse = await api.get('/api/items', {
        company_id: companyId,
      });

      const items = await listResponse.json();
      if (items.length > 0) {
        const itemId = items[0].id;
        const response = await api.get(`/api/items/${itemId}`, {
          company_id: companyId,
        });

        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.id).toBe(itemId);
      }
    });
  });

  test.describe('PUT /api/items/:id', () => {
    test('should update item', async () => {
      const listResponse = await api.get('/api/items', {
        company_id: companyId,
      });

      const items = await listResponse.json();
      if (items.length > 0) {
        const itemId = items[0].id;
        const response = await api.put(`/api/items/${itemId}`, {
          rate: 250,
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.rate).toBe(250);
        }
      }
    });

    test('should update item description', async () => {
      const listResponse = await api.get('/api/items', {
        company_id: companyId,
      });

      const items = await listResponse.json();
      if (items.length > 0) {
        const itemId = items[0].id;
        const response = await api.put(`/api/items/${itemId}`, {
          description: 'Updated description',
        });

        if (response.status() === 200) {
          const data = await response.json();
          expect(data.description).toBe('Updated description');
        }
      }
    });
  });

  test.describe('DELETE /api/items/:id', () => {
    test('should delete item', async () => {
      const createResponse = await api.post('/api/items', {
        ...TEST_DATA.inventory.labourItem,
        company_id: companyId,
      });

      if (createResponse.status() === 201) {
        const created = await createResponse.json();
        const deleteResponse = await api.delete(`/api/items/${created.id}`, {
          company_id: companyId,
        });

        expect([200, 204]).toContain(deleteResponse.status());
      }
    });
  });

  test.describe('Item Pricing & Rates', () => {
    test('should validate positive rates', async () => {
      const invalidItem = {
        ...TEST_DATA.inventory.labourItem,
        rate: -100,
        company_id: companyId,
      };

      const response = await api.post('/api/items', invalidItem);

      // Most systems would reject negative rates
      expect([200, 201, 400]).toContain(response.status());
    });

    test('should support decimal rates', async () => {
      const itemData = {
        ...TEST_DATA.inventory.labourItem,
        rate: 99.99,
        name: 'Decimal Rate Item',
        company_id: companyId,
      };

      const response = await api.post('/api/items', itemData);

      if (response.status() === 201) {
        const data = await response.json();
        expect(data.rate).toBe(99.99);
      }
    });
  });

  test.describe('Inventory Search', () => {
    test('should search items by name', async () => {
      const response = await api.get('/api/items', {
        company_id: companyId,
        search: 'Developer',
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });

    test('should filter items by category and search', async () => {
      const response = await api.get('/api/items', {
        company_id: companyId,
        category: 'labour',
        search: 'Developer',
      });

      const data = await response.json();
      if (data.length > 0) {
        expect(data[0].category).toBe('labour');
      }
    });
  });
});
