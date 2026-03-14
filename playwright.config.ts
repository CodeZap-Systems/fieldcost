import { defineConfig, devices } from '@playwright/test';

/**
 * FieldCost Playwright Test Configuration
 * Tier-based E2E testing (TIER 1, TIER 2, TIER 3)
 */

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  /* Ignore example test */
  testIgnore: '**/example.spec.ts',

  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Global timeout */
  timeout: 30000,
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/playwright-results.json' }],
    ['junit', { outputFile: 'test-results/playwright-results.xml' }],
    ['list'],
  ],

  /* Shared settings for all the projects */
  use: {
    baseURL: 'http://localhost:3000',
    /* Collect trace on every test */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for tier-based testing */
  projects: [
    // TIER 1 Tests (Chrome only)
    {
      name: 'tier1',
      testMatch: '**/tier1*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // TIER 2 Tests (Chrome only)
    {
      name: 'tier2',
      testMatch: '**/tier2*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // TIER 3 Tests (Chrome only)
    {
      name: 'tier3',
      testMatch: '**/tier3*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    // Desktop browsers
    {
      name: 'chromium',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers
    {
      name: 'Mobile Chrome',
      testMatch: '**/*.spec.ts',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      testMatch: '**/*.spec.ts',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
