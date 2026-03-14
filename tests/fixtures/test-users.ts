/**
 * Test User Fixtures
 * Mock user data for testing
 */

export const TEST_USERS = {
  qaUser: {
    email: 'qa_test_user@fieldcost.com',
    password: 'TestPassword123',
    firstName: 'QA',
    lastName: 'Tester',
    companyName: 'QA Test Company',
    role: 'admin',
  },
  projectManager: {
    email: 'pm_user@fieldcost.com',
    password: 'PMPassword123',
    firstName: 'Project',
    lastName: 'Manager',
    role: 'project_manager',
  },
  fieldWorker: {
    email: 'field_worker@fieldcost.com',
    password: 'FieldPassword123',
    firstName: 'Field',
    lastName: 'Worker',
    role: 'field_worker',
  },
  accountant: {
    email: 'accountant@fieldcost.com',
    password: 'AcctPassword123',
    firstName: 'Accounts',
    lastName: 'Person',
    role: 'accountant',
  },
  supervisor: {
    email: 'supervisor@fieldcost.com',
    password: 'SuperPassword123',
    firstName: 'Super',
    lastName: 'Visor',
    role: 'supervisor',
  },
};

export const INVALID_CREDENTIALS = {
  wrongPassword: {
    email: 'qa_test_user@fieldcost.com',
    password: 'WrongPassword123',
  },
  invalidEmail: {
    email: 'invalid@nonexistent.com',
    password: 'TestPassword123',
  },
  emptyEmail: {
    email: '',
    password: 'TestPassword123',
  },
  emptyPassword: {
    email: 'qa_test_user@fieldcost.com',
    password: '',
  },
};

export const PASSWORD_RESET_DATA = {
  newPassword: 'NewPassword456',
  email: 'qa_test_user@fieldcost.com',
};
