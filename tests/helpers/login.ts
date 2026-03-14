/**
 * Playwright Login Helper
 * Reusable login utility for E2E tests
 */

import { Page, expect } from '@playwright/test';
import { TestUser } from './test-user';

/**
 * Login a user via the UI
 * Navigates to login page, fills credentials, submits form
 */
export async function loginUser(page: Page, user: TestUser): Promise<void> {
  // Navigate to login page
  await page.goto('http://localhost:3000/auth/login');
  
  // Wait for form to load
  await page.waitForSelector('input[type="email"]', { state: 'visible' });
  
  // Fill email
  await page.fill('input[type="email"]', user.email);
  
  // Fill password
  await page.fill('input[type="password"]', user.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Verify we're logged in
  await expect(page).toHaveURL(/.*dashboard/);
}

/**
 * Register a new user via the UI
 */
export async function registerUser(page: Page, user: TestUser): Promise<void> {
  // Navigate to register page
  await page.goto('http://localhost:3000/auth/register');
  
  // Wait for form to load
  await page.waitForSelector('input[type="email"]', { state: 'visible' });
  
  // Fill first name
  await page.fill('input[name="firstName"]', user.firstName);
  
  // Fill last name
  await page.fill('input[name="lastName"]', user.lastName);
  
  // Fill email
  await page.fill('input[type="email"]', user.email);
  
  // Fill password
  await page.fill('input[type="password"]', user.password);
  
  // Confirm password
  await page.fill('input[name="confirmPassword"]', user.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for redirect or success message
  await page.waitForURL(/.*dashboard|.*login/, { timeout: 10000 });
}

/**
 * Logout user
 */
export async function logoutUser(page: Page): Promise<void> {
  // Click profile menu
  await page.click('[data-testid="profile-menu"]');
  
  // Wait for menu to appear
  await page.waitForSelector('[data-testid="logout-button"]', { state: 'visible' });
  
  // Click logout
  await page.click('[data-testid="logout-button"]');
  
  // Verify redirect to login
  await page.waitForURL('**/auth/login', { timeout: 5000 });
  await expect(page).toHaveURL(/.*auth\/login/);
}

/**
 * Verify user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector('[data-testid="profile-menu"]', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Login and verify session
 */
export async function loginAndVerify(page: Page, user: TestUser): Promise<void> {
  await loginUser(page, user);
  const loggedIn = await isLoggedIn(page);
  if (!loggedIn) {
    throw new Error('Login failed - session not established');
  }
}

/**
 * Clear auth tokens (for cleanup)
 */
export async function clearAuthTokens(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get auth session from storage
 */
export async function getAuthSession(page: Page): Promise<any> {
  return page.evaluate(() => {
    return {
      token: localStorage.getItem('supabase.auth.token'),
      user: localStorage.getItem('supabase.auth.user'),
    };
  });
}
