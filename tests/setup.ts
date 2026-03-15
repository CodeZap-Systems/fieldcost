/**
 * Test Setup File (Vitest Configuration)
 * Global test configuration and helpers for Vitest
 */
import { beforeAll, afterAll, vi } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

// Configure timeout for all tests (30 seconds)
if (typeof globalThis !== 'undefined' && globalThis) {
  (globalThis as any).testTimeout = 30000;
}

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

export {};
