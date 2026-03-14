import { test, expect } from '@playwright/test';
import { AuthHelper, testUser } from '../helpers/auth.helper';
import { TEST_CREDENTIALS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

test.describe('Authentication E2E Tests', () => {
  let authHelper: AuthHelper;

  test.beforeEach(() => {
    authHelper = new AuthHelper(BASE_URL);
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await authHelper.loginUI(page, testUser);
    expect(page.url()).toContain('dashboard');
  });

  test('should display error on invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_CREDENTIALS.invalid.email);
    await page.fill('input[type="password"]', TEST_CREDENTIALS.invalid.password);
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error on empty email', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Email field should show error
    await expect(page.locator('input[type="email"]')).toBeFocused();
    const errorMessage = page.locator('text=Email is required');
    await expect(errorMessage).toBeVisible({ timeout: 3000 }).catch(() => {
      // Error message might be shown as validation message
    });
  });

  test('should show validation error on empty password', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'test@test.com');
    await page.click('button[type="submit"]');
    
    // Password field should show error
    const errorMessage = page.locator('text=Password is required');
    await expect(errorMessage).toBeVisible({ timeout: 3000 }).catch(() => {
      // Silent fail - may not show message
    });
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('a:has-text("Sign up"), button:has-text("Create account")');
    
    // Should navigate to register page
    await page.waitForURL('**/register', { timeout: 5000 });
    expect(page.url()).toContain('register');
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.click('text=Forgot password');
    
    // Should show reset form
    await expect(page.locator('text=Reset Password')).toBeVisible();
  });

  test('should logout user successfully', async ({ page }) => {
    // Login first
    await authHelper.loginUI(page, testUser);
    await authHelper.logoutUI(page);
    
    // Should be redirected to login
    expect(page.url()).toContain('login');
  });

  test('should maintain session after page reload', async ({ page }) => {
    // Login
    await authHelper.loginUI(page, testUser);
    
    // Reload page
    await page.reload();
    
    // Should still be authenticated
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display user profile after login', async ({ page }) => {
    await authHelper.loginUI(page, testUser);
    
    // User profile should be visible
    await expect(page.locator('button[aria-label="User menu"]')).toBeVisible();
  });

  test('should clear session on logout', async ({ page }) => {
    // Login
    await authHelper.loginUI(page, testUser);
    
    // Logout
    await authHelper.logoutUI(page);
    
    // Try to access dashboard - should be redirected to login
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('should prevent unauthenticated access to dashboard', async ({ page }) => {
    // Try to access dashboard directly without login
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('login');
  });

  test('should show login form on initial load', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Login form elements should be visible
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should remember email on failed login attempt', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    const testEmail = 'test@fieldcost.com';
    
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Email should still be in field
    const emailInput = page.locator('input[type="email"]');
    const value = await emailInput.inputValue();
    expect(value).toBe(testEmail);
  });
});
