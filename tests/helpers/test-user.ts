/**
 * Test User Generator Helper
 * Creates deterministic test users for QA testing
 */

export interface TestUser {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'project_manager' | 'field_crew';
}

const DEFAULT_TEST_USER: TestUser = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123!',
  firstName: 'QA',
  lastName: 'Tester',
  role: 'admin',
};

const TEST_USERS = {
  admin: {
    email: 'admin@fieldcost.com',
    password: 'AdminPassword123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
  projectManager: {
    email: 'pm@fieldcost.com',
    password: 'PMPassword123!',
    firstName: 'Project',
    lastName: 'Manager',
    role: 'project_manager',
  },
  fieldCrew: {
    email: 'crew@fieldcost.com',
    password: 'CrewPassword123!',
    firstName: 'Field',
    lastName: 'Crew',
    role: 'field_crew',
  },
};

/**
 * Generate a unique test user with timestamp
 */
export function generateTestUser(overrides?: Partial<TestUser>): TestUser {
  const timestamp = Date.now();
  return {
    ...DEFAULT_TEST_USER,
    email: `qa_test_${timestamp}@fieldcost.com`,
    ...overrides,
  };
}

/**
 * Get predefined test user by role
 */
export function getTestUserByRole(role: 'admin' | 'project_manager' | 'field_crew'): TestUser {
  return TEST_USERS[role];
}

/**
 * Get default QA test user
 */
export function getDefaultTestUser(): TestUser {
  return DEFAULT_TEST_USER;
}

/**
 * Generate multiple test users
 */
export function generateTestUsers(count: number): TestUser[] {
  return Array.from({ length: count }, (_, i) => ({
    ...DEFAULT_TEST_USER,
    email: `qa_test_user_${i + 1}@fieldcost.com`,
    firstName: `Test${i + 1}`,
  }));
}

/**
 * Validate test user structure
 */
export function validateTestUser(user: TestUser): boolean {
  return (
    user.email &&
    user.password &&
    user.firstName &&
    user.lastName &&
    user.email.includes('@fieldcost.com')
  );
}
