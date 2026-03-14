/**
 * Jest API Test Setup
 * Runs before all API tests
 * 
 * This setup:
 * 1. Configures test environment variables
 * 2. Seeds test data via /api/test/seed endpoint
 * 3. Creates global test utilities
 * 4. Sets test timeouts
 */

import supertest from 'supertest';
import fetch from 'node-fetch';

// Set test environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key';
// NODE_ENV is read-only, so skip setting it in build

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Global test timeout
jest.setTimeout(30000);

// Create global request agent for all tests
export const request = supertest(API_BASE_URL);

// Mock console warnings/errors (optional)
const originalWarn = console.warn;
const originalError = console.error;

/**
 * Seed test data via API endpoint
 */
async function seedTestData() {
  try {
    console.log('\n🌱 Seeding test data via API...');

    const response = await (fetch as any)(`${API_BASE_URL}/api/test/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Test data seeded successfully');

      // Store credentials globally
      if (data.testCredentials) {
        (global as any).testCredentials = data.testCredentials;
      }

      return data;
    } else {
      console.warn(`⚠️  Seed endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.warn('⚠️  Could not seed test data:', error instanceof Error ? error.message : error);
  }
}

// Setup: Run before all tests
beforeAll(async () => {
  console.warn = jest.fn(originalWarn);
  console.error = jest.fn(originalError);

  // Seed test data
  if (process.env.TEST_SEED_ENABLED !== 'false') {
    await seedTestData();
  }

  // Attach globals
  (global as any).request = request;
  (global as any).API_BASE_URL = API_BASE_URL;
});

// Cleanup: Run after all tests
afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Export request for test imports
declare global {
  namespace NodeJS {
    interface Global {
      request: supertest.Agent;
      API_BASE_URL: string;
      testCredentials?: any;
    }
  }
}
