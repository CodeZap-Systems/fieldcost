/**
 * Login Helper
 * Utility functions for authentication testing
 */

import { Page, expect } from '@playwright/test';

export class LoginHelper {
  /**
   * Log in a user
   */
  static async login(page: Page, email: string, password: string) {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  }

  /**
   * Log in and wait for dashboard to load
   */
  static async loginAndWait(
    page: Page,
    email: string,
    password: string
  ) {
    await this.login(page, email, password);
    // Verify dashboard is visible
    await expect(page).toHaveURL(/.*dashboard/);
  }

  /**
   * Check if user is logged in
   */
  static async isLoggedIn(page: Page): Promise<boolean> {
    try {
      // Check if we can access protected route
      await page.goto('/dashboard');
      return page.url().includes('/dashboard');
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  static async logout(page: Page) {
    // Look for logout button in menu
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout-button"]');
    
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    } else {
      // Try user menu
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-menu-item"]');
    }

    // Wait for redirect to login
    await page.waitForURL('/auth/login', { timeout: 5000 });
  }

  /**
   * Register a new user
   */
  static async register(
    page: Page,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    companyName: string
  ) {
    await page.goto('/auth/register');

    // Fill registration form
    await page.fill('input[name="firstName"]', firstName);
    await page.fill('input[name="lastName"]', lastName);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="companyName"]', companyName);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to login or dashboard
    await page.waitForNavigation({ timeout: 10000 });
  }

  /**
   * Reset password flow
   */
  static async resetPassword(page: Page, email: string, newPassword: string) {
    await page.goto('/auth/reset-password');

    // Enter email
    await page.fill('input[name="email"]', email);
    await page.click('button:has-text("Send Reset Link")');

    // Wait for success message
    await expect(page.locator('text=Check your email')).toBeVisible();
  }

  /**
   * Wait for authentication token
   */
  static async waitForToken(page: Page, timeout = 5000) {
    await page.waitForFunction(
      () => {
        const token = localStorage.getItem('auth_token');
        return token !== null && token !== '';
      },
      { timeout }
    );
  }

  /**
   * Get authentication token from localStorage
   */
  static async getToken(page: Page): Promise<string | null> {
    return page.evaluate(() => localStorage.getItem('auth_token'));
  }

  /**
   * Set authentication token in localStorage
   */
  static async setToken(page: Page, token: string) {
    await page.evaluate((authToken) => {
      localStorage.setItem('auth_token', authToken);
    }, token);
  }

  /**
   * Clear all authentication data
   */
  static async clearAuth(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

export default LoginHelper;
