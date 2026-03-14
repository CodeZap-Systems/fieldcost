/**
 * Authentication Helper - Playwright
 * Utilities for login, logout, and session management in E2E tests
 */

import { Page, expect } from '@playwright/test';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login user via form
 */
export async function loginUser(page: Page, credentials: LoginCredentials) {
  await page.goto('http://localhost:3000/auth/login');
  
  // Wait for form to load
  await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  
  // Fill credentials
  await page.locator('input[type="email"]').fill(credentials.email);
  await page.locator('input[type="password"]').fill(credentials.password);
  
  // Submit form
  await page.locator('button:has-text("Sign In")').click();
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await expect(page).toHaveURL(/\/dashboard/);
  
  return page;
}

/**
 * Register new user
 */
export async function registerUser(page: Page, userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
}) {
  await page.goto('http://localhost:3000/auth/register');
  
  // Wait for form to load
  await expect(page.locator('input[placeholder="First name"]')).toBeVisible({ timeout: 10000 });
  
  // Fill registration form
  await page.locator('input[placeholder="First name"]').fill(userData.firstName);
  await page.locator('input[placeholder="Last name"]').fill(userData.lastName);
  await page.locator('input[placeholder="Company name"]').fill(userData.companyName);
  await page.locator('input[type="email"]').fill(userData.email);
  await page.locator('input[type="password"]').first().fill(userData.password);
  await page.locator('input[type="password"]').last().fill(userData.password);
  
  // Accept terms
  const termsCheckbox = page.locator('input[type="checkbox"]');
  await termsCheckbox.check();
  
  // Submit
  await page.locator('button:has-text("Create Account")').click();
  
  // Wait for redirects (may go to verification or dashboard)
  try {
    await page.waitForURL(/\/(auth\/verify|dashboard)/, { timeout: 10000 });
  } catch {
    // Registration may require email verification
  }
  
  return page;
}

/**
 * Logout user
 */
export async function logoutUser(page: Page) {
  // Click user menu (usually top right)
  await page.locator('[role="button"]:has-text(/Profile|Menu|Settings/)').click();
  
  // Find and click logout
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
  
  // Expect redirect to login
  await page.waitForURL('**/auth/login', { timeout: 5000 });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    const response = await page.request.fetch('http://localhost:3000/api/company');
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Wait for authentication to complete
 */
export async function waitForAuth(page: Page, timeout = 10000) {
  let authenticated = false;
  const startTime = Date.now();
  
  while (!authenticated && Date.now() - startTime < timeout) {
    authenticated = await isAuthenticated(page);
    if (!authenticated) {
      await page.waitForTimeout(500);
    }
  }
  
  if (!authenticated) {
    throw new Error('Authentication timeout');
  }
}

/**
 * Get auth session from localStorage
 */
export async function getSessionToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    const session = localStorage.getItem('sb-session');
    return session ? JSON.parse(session).access_token : null;
  });
}
