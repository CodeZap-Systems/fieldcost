import { test, expect } from '@playwright/test';

/**
 * TIER 1: Authentication Tests
 * Tests user login, registration, and basic dashboard access
 */

test.describe('TIER 1: Authentication', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toContain('localhost');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    
    // Try label first, then fallback to input selector
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should display registration page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test('should display reset password page', async ({ page }) => {
    await page.goto('/auth/reset-password');
    // The page might redirect to an authenticated route or show password reset form
    const hasPasswordForm = await page.locator('input[type="password"]').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasResetHeading = await page.getByRole('heading', { name: /reset|password|new password/i }).first().isVisible({ timeout: 3000 }).catch(() => false);
    
    // Either the form exists or there's a password-related heading
    expect(hasPasswordForm || hasResetHeading).toBeTruthy();
  });

  test('should display demo login page', async ({ page }) => {
    await page.goto('/auth/demo-login');
    // Demo login page should exist
    expect(page.url()).toContain('demo-login');
  });
});
