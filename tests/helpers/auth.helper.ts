import { Page, expect } from '@playwright/test';

export interface LoginCredentials {
  email: string;
  password: string;
}

export class AuthHelper {
  private baseURL: string;

  constructor(baseURL: string = 'https://fieldcost.vercel.app') {
    this.baseURL = baseURL;
  }

  /**
   * Login user via UI
   */
  async loginUI(page: Page, credentials: LoginCredentials) {
    await page.goto(`${this.baseURL}/login`);
    await page.fill('input[type="email"]', credentials.email);
    await page.fill('input[type="password"]', credentials.password);
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
  }

  /**
   * Register new user via UI
   */
  async registerUI(page: Page, email: string, password: string, companyName: string) {
    await page.goto(`${this.baseURL}/register`);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.fill('input[placeholder*="company" i]', companyName);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard or confirmation
    await page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  /**
   * Logout user
   */
  async logoutUI(page: Page) {
    // Click user menu or logout button
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Logout');
    await page.waitForURL('**/login', { timeout: 5000 });
  }

  /**
   * Get authentication token via API
   */
  async getAuthToken(credentials: LoginCredentials): Promise<string> {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    return data.token || data.session?.access_token;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(page: Page): Promise<boolean> {
    try {
      await page.goto(`${this.baseURL}/dashboard`, { timeout: 5000 });
      return !page.url().includes('/login');
    } catch {
      return false;
    }
  }

  /**
   * Wait for auth to complete
   */
  async waitForAuth(page: Page, timeoutMs: number = 10000) {
    await page.waitForURL('**/dashboard', { timeout: timeoutMs });
  }
}

export const testUser = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123',
};

export const testUser2 = {
  email: 'qa_test_user2@fieldcost.com',
  password: 'TestPassword123',
};
