/**
 * Authentication Helpers
 * Helper functions for login, logout, and session management
 */

import { Page, expect } from '@playwright/test';

export const TEST_USER = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123',
};

export const TEST_COMPANY_ID = '1'; // Demo company

/**
 * Login helper - navigates to login and authenticates
 */
export async function loginUser(page: Page, email = TEST_USER.email, password = TEST_USER.password) {
  await page.goto('http://localhost:3000/auth/signin');
  
  // Wait for login form
  await page.waitForSelector('input[name="email"]', { timeout: 5000 });
  
  // Fill credentials
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  // Click login
  await page.click('button:has-text("Sign in")');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await expect(page).toHaveURL(/dashboard/);
}

/**
 * Logout helper - logs out current user
 */
export async function logoutUser(page: Page) {
  await page.goto('http://localhost:3000/dashboard');
  
  // Click user menu
  await page.click('[data-testid="user-menu"]');
  
  // Click logout
  await page.click('text=Sign out');
  
  // Wait for redirect to home
  await page.waitForURL('**/auth/signin', { timeout: 5000 });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    await page.goto('http://localhost:3000/dashboard');
    return page.url().includes('/dashboard');
  } catch {
    return false;
  }
}

/**
 * Get auth token from session storage
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    const session = sessionStorage.getItem('auth_session');
    if (session) {
      return JSON.parse(session).access_token;
    }
    return null;
  });
}

/**
 * Clear all auth data
 */
export async function clearAuth(page: Page) {
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
}

/**
 * Wait for user to be authenticated
 */
export async function waitForAuth(page: Page, timeout = 10000) {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    const authenticated = await isAuthenticated(page);
    if (authenticated) {
      return true;
    }
    await page.waitForTimeout(500);
  }
  throw new Error('User authentication timeout');
}

/**
 * Switch to company
 */
export async function switchCompany(page: Page, companyId: string) {
  await page.goto(`http://localhost:3000/dashboard?company_id=${companyId}`);
  await page.waitForLoadState('networkidle');
}
