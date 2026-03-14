/**
 * Test setup - runs before all tests
 */

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.BASE_URL = process.env.BASE_URL || 'https://fieldcost.vercel.app';

// Mock timers if needed
jest.useFakeTimers().useRealTimers();

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs in tests unless explicitly needed
const originalLog = console.log;
const originalError = console.error;

beforeAll(() => {
  // Can be customized based on environment
  if (process.env.SUPPRESS_LOGS === 'true') {
    console.log = jest.fn();
    console.error = jest.fn();
  }
});

afterAll(() => {
  console.log = originalLog;
  console.error = originalError;
});
