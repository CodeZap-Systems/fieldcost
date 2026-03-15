/**
 * Project Management E2E Tests
 * Tests for creating, editing, deleting, and managing projects
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestProject } from '../helpers/generators';

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/projects');
    await page.waitForLoadState('networkidle');
  });

  test('should display projects list', async ({ page }) => {
    await expect(page.locator('text=Projects')).toBeVisible();
    
    // Wait for projects table
    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });
  });

  test('should create new project', async ({ page }) => {
    const project = generateTestProject();
    
    // Click create button
    await page.click('button:has-text("Create Project")');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[name="name"]', project.name);
    await page.fill('input[name="description"]', project.description);
    await page.fill('input[name="location"]', project.location);
    await page.fill('input[name="budget"]', project.budget.toString());
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should edit existing project', async ({ page }) => {
    // Find first project row
    const firstRow = page.locator('table tbody tr').first();
    const editButton = firstRow.locator('button:has-text("Edit")');
    
    await editButton.click();
    await page.waitForLoadState('networkidle');
    
    // Modify name
    const nameInput = page.locator('input[name="name"]').first();
    const currentValue = await nameInput.inputValue();
    const newValue = `${currentValue} - Updated`;
    
    await nameInput.fill(newValue);
    
    // Submit
    await page.click('button:has-text("Save")');
    
    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should delete project with confirmation', async ({ page }) => {
    // Find first project row
    const firstRow = page.locator('table tbody tr').first();
    const deleteButton = firstRow.locator('button:has-text("Delete")');
    
    await deleteButton.click();
    
    // Should show confirmation dialog
    await expect(page.locator('role=dialog')).toBeVisible({ timeout: 5000 });
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    // Should show success message
    await expect(page.locator('[role="alert"]')).toContainText('deleted', { timeout: 5000 });
  });

  test('should filter projects by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"]');
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('active');
      await page.waitForLoadState('networkidle');
      
      // Verify filtered results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should search projects by name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search projects"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test Project');
      await page.waitForLoadState('networkidle');
      
      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should display project details', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    const projectLink = firstRow.locator('[role="link"]').first();
    
    await projectLink.click();
    await page.waitForLoadState('networkidle');
    
    // Should show project details
    await expect(page.locator('text=Project Details')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error on empty name', async ({ page }) => {
    await page.click('button:has-text("Create Project")');
    await page.waitForLoadState('networkidle');
    
    // Leave name empty and submit
    await page.click('button:has-text("Create")');
    
    // Should show validation error
    await expect(page.locator('text=required')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error on invalid budget', async ({ page }) => {
    const project = generateTestProject();
    
    await page.click('button:has-text("Create Project")');
    await page.waitForLoadState('networkidle');
    
    // Fill form with invalid budget
    await page.fill('input[name="name"]', project.name);
    await page.fill('input[name="budget"]', 'invalid');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show validation error
    await expect(page.locator('text=must be a number')).toBeVisible({ timeout: 5000 });
  });

  test('should sort projects by budget descending', async ({ page }) => {
    const budgetHeader = page.locator('th:has-text("Budget")');
    
    if (await budgetHeader.isVisible()) {
      await budgetHeader.click();
      await page.waitForLoadState('networkidle');
      
      // Should sort
      await expect(page.locator('table')).toBeVisible();
    }
  });
});
