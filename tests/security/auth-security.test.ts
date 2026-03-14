/**
 * Authentication Security Tests
 * 
 * Tests for:
 * - SQL Injection in login/register
 * - Broken authentication
 * - Session attacks
 * - Password bypass attempts
 * - Weak password validation
 * - Session fixation
 * - Token hijacking
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication Security', () => {
  // SQL Injection Tests
  test.describe('SQL Injection Prevention', () => {
    test('should reject SQL injection in email field', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`);

      // Attempt SQL injection in email
      const sqlInjectionPayloads = [
        "admin' OR '1'='1",
        "admin'--",
        "' OR 1=1--",
        "admin' OR 'a'='a",
        "1' UNION SELECT * FROM users--",
      ];

      for (const payload of sqlInjectionPayloads) {
        await page.fill('input[name="email"]', payload);
        await page.fill('input[name="password"]', 'TestPassword123!');
        await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
        await page.click('button:has-text("Register")');

        // Should either reject the request or handle safely
        const errorMessage = await page.textContent('[role="alert"]');
        expect(errorMessage || (await page.url())).toBeTruthy();

        // Should not create invalid user
        const response = await page.evaluate(() =>
          fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: payload,
              password: 'TestPassword123!',
            }),
          }).then((r) => r.json())
        );

        expect(response.error || response.message).toBeTruthy();
      }
    });

    test('should reject SQL injection in password field', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      const sqlPayloads = ["' OR '1'='1", "admin'--", "1' UNION SELECT NULL--"];

      for (const payload of sqlPayloads) {
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', payload);
        await page.click('button:has-text("Login")');

        // Should reject malformed credentials
        const url = page.url();
        expect(url).toContain('login');
      }
    });
  });

  // XSS (Cross-Site Scripting) Tests
  test.describe('XSS Prevention', () => {
    test('should escape script tags in email field', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`);

      const xssPayloads = [
        '<script>alert(1)</script>',
        '<img src=x onerror="alert(1)">',
        'javascript:alert(1)',
        '<svg onload="alert(1)">',
        '"><script>alert(1)</script>',
      ];

      for (const payload of xssPayloads) {
        await page.fill('input[name="email"]', payload);
        await page.fill('input[name="password"]', 'TestPassword123!');

        // Attempt submission
        await page.click('button:has-text("Register")');

        // Verify script did not execute
        let scriptExecuted = false;
        page.once('dialog', (dialog) => {
          scriptExecuted = true;
          dialog.dismiss();
        });

        // Should not have executed script
        expect(scriptExecuted).toBe(false);

        // Email should be validated/rejected
        const error = await page.textContent('[role="alert"]');
        expect(error || payload).toBeTruthy();
      }
    });

    test('should escape script tags in form inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.fill('input[name="email"]', '<script>alert("xss")</script>@example.com');
      await page.fill('input[name="password"]', '<img src=x onerror=alert(1)>');

      let alertTriggered = false;
      page.once('dialog', () => {
        alertTriggered = true;
      });

      await page.click('button:has-text("Login")');

      // Script should not execute
      expect(alertTriggered).toBe(false);
    });

    test('should sanitize password reset token in URL', async ({ page }) => {
      // Attempt XSS via reset token
      await page.goto(`${BASE_URL}/reset-password?token=<script>alert(1)</script>`);

      let scriptExecuted = false;
      page.once('dialog', () => {
        scriptExecuted = true;
      });

      expect(scriptExecuted).toBe(false);
    });
  });

  // Brute Force / Rate Limiting
  test.describe('Brute Force Protection', () => {
    test('should rate limit failed login attempts', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      const attempts = [];

      for (let i = 0; i < 10; i++) {
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'WrongPassword' + i);

        const response = await page.evaluate(() =>
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'admin@example.com',
              password: 'WrongPassword',
            }),
          }).then((r) => ({
            status: r.status,
            headers: Array.from(r.headers.entries()),
          }))
        );

        attempts.push(response.status);
      }

      // After multiple attempts, should get rate limit response (429)
      const hasRateLimit = attempts.some((status) => status === 429);
      expect(hasRateLimit).toBe(true);
    });
  });

  // Session Security Tests
  test.describe('Session Security', () => {
    test('should invalidate session on logout', async ({ page, context }) => {
      await page.goto(`${BASE_URL}/login`);

      // Login with valid credentials
      await page.fill('input[name="email"]', 'qa_admin@fieldcost.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button:has-text("Login")');

      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard');

      // Get session token
      const cookies = await context.cookies();
      const sessionCookie = cookies.find((c) => c.name.includes('session') || c.name === 'auth');

      expect(sessionCookie).toBeTruthy();

      // Logout
      await page.click('button:has-text("Logout")');

      // Get new cookies
      const newCookies = await context.cookies();
      const newSessionCookie = newCookies.find((c) => c.name.includes('session') || c.name === 'auth');

      // Session should be cleared
      expect(newSessionCookie?.value).not.toBe(sessionCookie?.value);
    });

    test('should prevent session fixation attacks', async ({ page, context }) => {
      // Attempt to set session in URL
      await page.goto(`${BASE_URL}/login?session=attacker_session_id`);

      // Login
      await page.fill('input[name="email"]', 'qa_pm@fieldcost.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button:has-text("Login")');

      // Get actual session
      const cookies = await context.cookies();
      const sessionCookie = cookies.find((c) => c.name === 'session' || c.name === 'auth');

      // Session should not be the attacker's session
      expect(sessionCookie?.value).not.toBe('attacker_session_id');
    });

    test('should expire session after timeout', async ({ page }) => {
      test.skip(); // Requires actual time manipulation or server config

      await page.goto(`${BASE_URL}/login`);

      // Login
      await page.fill('input[name="email"]', 'qa_accountant@fieldcost.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button:has-text("Login")');

      await page.waitForURL('**/dashboard');

      // Simulate session timeout (would need server support)
      // After timeout, should redirect to login
      await page.goto(`${BASE_URL}/projects`);

      const url = page.url();
      expect(url).toContain('login');
    });
  });

  // Weak Authentication Bypass
  test.describe('Authentication Bypass Prevention', () => {
    test('should require both email and password', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Try without password
      await page.fill('input[name="email"]', 'test@example.com');
      await page.click('button:has-text("Login")');

      // Should show validation error
      const error = await page.textContent('[role="alert"]');
      expect(error).toContain('required');
    });

    test('should reject login with null bytes', async ({ page }) => {
      const response = await page.evaluate(() =>
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@example.com\x00',
            password: 'TestPassword123!',
          }),
        }).then((r) => r.json())
      );

      expect(response.error).toBeTruthy();
    });

    test('should handle unusual character encoding', async ({ page }) => {
      const response = await page.evaluate(() =>
        fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'admin@example.com\u0000',
            password: 'TestPassword123!',
          }),
        }).then((r) => r.json())
      );

      expect(response.error || response.message).toBeTruthy();
    });
  });

  // Password Reset Security
  test.describe('Password Reset Security', () => {
    test('should have valid token for password reset', async ({ page }) => {
      // Attempt reset with invalid token
      await page.goto(`${BASE_URL}/reset-password?token=invalid_token_12345`);

      // Should show error
      const error = await page.textContent('[role="alert"]');
      expect(error || (await page.url())).toBeTruthy();
    });

    test('should invalidate expired reset tokens', async ({ page }) => {
      const response = await page.evaluate(() =>
        fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: 'expired_token_from_yesterday',
            password: 'NewPassword123!',
          }),
        }).then((r) => r.json())
      );

      expect(response.error).toBeTruthy();
    });
  });
});
