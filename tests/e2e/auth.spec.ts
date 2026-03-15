/**
 * Authentication E2E Tests
 * Tests for user registration, login, logout, and session management
 */

import { test, expect } from '@playwright/test';
import { loginUser, logoutUser, isAuthenticated, TEST_USER } from '../helpers/auth';

test.describe('Authentication Flows', () => {
  test('should login with valid credentials', async ({ page }) => {
    await loginUser(page);
    
    // Verify logged in
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
    
    // Verify dashboard is visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should display error on invalid password', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', 'wrongpassword');
    
    await page.click('button:has-text("Sign in")');
    
    // Should show error
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('should display error on non-existent user', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', TEST_USER.password);
    
    await page.click('button:has-text("Sign in")');
    
    // Should show error
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    await loginUser(page);
    await expect(page).toHaveURL(/dashboard/);
    
    await logoutUser(page);
    
    // Should redirect to signin
    await expect(page).toHaveURL(/auth\/signin/);
  });

  test('should prevent access to dashboard without login', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    
    // Should redirect to signin
    await expect(page).toHaveURL(/auth\/signin/, { timeout: 10000 });
  });

  test('should maintain session across page refresh', async ({ page }) => {
    await loginUser(page);
    
    // Refresh page
    await page.reload();
    
    // Should still be authenticated
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);
  });

  test('email field should be required', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    
    await page.fill('input[name="password"]', TEST_USER.password);
    const emailInput = page.locator('input[name="email"]');
    
    // Should have required attribute
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('password field should be required', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    
    await page.fill('input[name="email"]', TEST_USER.email);
    const passwordInput = page.locator('input[name="password"]');
    
    // Should have required attribute
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/signin');
    
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    const submitButton = page.locator('button:has-text("Sign in")');
    await submitButton.click();
    
    // Button should show loading state
    await expect(submitButton).toHaveAttribute('disabled', '');
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    await loginUser(page);
    
    // Should be on dashboard
    expect(page.url()).toContain('/dashboard');
  });
});
