/**
 * Security Tests Setup
 * Configures security test environment
 */

import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: '.env.test' });

// Set test timeout for security tests
jest.setTimeout(45000);

// Test database must not be production
if (process.env.DATABASE_URL?.includes('production') || process.env.NODE_ENV === 'production') {
  throw new Error('⛔ SECURITY TESTS MUST NOT RUN AGAINST PRODUCTION DATABASE');
}

// Log security testing context
beforeAll(() => {
  console.log('\n🔒 Starting Security Test Suite');
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   API URL: ${process.env.NEXT_PUBLIC_API_URL}`);
  console.log('   Tests: Auth Security, API Security, Upload Security, RBAC Security\n');
});

afterAll(() => {
  console.log('\n✅ Security tests completed\n');
});

// Global error handler for security tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection in Security Tests:', reason);
});
