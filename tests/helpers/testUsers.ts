/**
 * Test User Generator and Utilities
 * Provides helper functions for test user creation and management
 */

export interface TestUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'viewer';
}

export interface TestCompany {
  id: number;
  name: string;
  type: 'demo' | 'live';
  industry: string;
}

/**
 * Default test user for QA testing
 */
export const QA_TEST_USER: TestUser = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123',
  firstName: 'QA',
  lastName: 'Automation',
  role: 'admin',
};

/**
 * Generate a unique test user
 */
export function generateTestUser(overrides?: Partial<TestUser>): TestUser {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  return {
    email: `test_user_${timestamp}_${random}@fieldcost.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: `User_${timestamp}`,
    role: 'user',
    ...overrides,
  };
}

/**
 * Generate a test company
 */
export function generateTestCompany(overrides?: Partial<TestCompany>): TestCompany {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  
  return {
    id: Math.floor(Math.random() * 10000),
    name: `Test Company ${timestamp}`,
    type: 'live',
    industry: 'Construction',
    ...overrides,
  };
}

/**
 * Demo Company IDs
 */
export const DEMO_COMPANIES = {
  DEMO_COMPANY_ID: 8,
  LIVE_COMPANY_1: 13,
  LIVE_COMPANY_2: 14,
};

/**
 * Test data for multiple test scenarios
 */
export const TEST_DATA_SET = {
  USERS: {
    PRIMARY: QA_TEST_USER,
    SECONDARY: generateTestUser({ email: 'qa_secondary@fieldcost.com' }),
    VIEWER: generateTestUser({ role: 'viewer' }),
  },
  COMPANIES: {
    DEMO: DEMO_COMPANIES.DEMO_COMPANY_ID,
    LIVE_1: DEMO_COMPANIES.LIVE_COMPANY_1,
    LIVE_2: DEMO_COMPANIES.LIVE_COMPANY_2,
  },
};

/**
 * Extract initials from user name
 */
export function getUserInitials(user: TestUser): string {
  return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
}
