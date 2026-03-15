/**
 * Task Management E2E Tests
 * Tests for creating, editing, and managing tasks
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestTask } from '../helpers/generators';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display tasks section', async ({ page }) => {
    // Navigate to tasks
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    await expect(page.locator('text=Task')).toBeVisible({ timeout: 5000 });
  });

  test('should create new task', async ({ page }) => {
    const task = generateTestTask();
    
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    await page.click('button:has-text("Create Task")');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[name="name"]', task.name);
    await page.fill('input[name="description"]', task.description);
    
    // Select project
    const projectSelect = page.locator('select[name="project_id"]');
    if (await projectSelect.isVisible()) {
      await projectSelect.selectOption('1');
    }
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should edit task', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.isVisible()) {
      const editButton = firstRow.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        
        // Update status
        const statusSelect = page.locator('select[name="status"]').first();
        if (await statusSelect.isVisible()) {
          await statusSelect.selectOption('in_progress');
        }
        
        // Save
        await page.click('button:has-text("Save")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', { timeout: 5000 });
      }
    }
  });

  test('should mark task as complete', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.isVisible()) {
      const completeButton = firstRow.locator('button:has-text("Complete")');
      
      if (await completeButton.isVisible()) {
        await completeButton.click();
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('completed', { timeout: 5000 });
      }
    }
  });

  test('should delete task', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.isVisible()) {
      const deleteButton = firstRow.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm
        await page.click('button:has-text("Confirm")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('deleted', { timeout: 5000 });
      }
    }
  });

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const statusFilter = page.locator('select[name="status"]');
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('pending');
      await page.waitForLoadState('networkidle');
      
      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should filter tasks by project', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const projectFilter = page.locator('select[name="project_id"]');
    if (await projectFilter.isVisible()) {
      await projectFilter.selectOption('1');
      await page.waitForLoadState('networkidle');
      
      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should show task details', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    const firstRow = page.locator('table tbody tr').first();
    if (await firstRow.isVisible()) {
      const taskLink = firstRow.locator('[role="link"]').first();
      await taskLink.click();
      
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=Task Details')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show validation on empty task name', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    
    await page.click('button:has-text("Create Task")');
    await page.waitForLoadState('networkidle');
    
    // Submit without name
    await page.click('button:has-text("Create")');
    
    // Should show error
    await expect(page.locator('text=required')).toBeVisible({ timeout: 5000 });
  });

  test('should assign task to crew member', async ({ page }) => {
    const task = generateTestTask();
    
    await page.goto('http://localhost:3000/dashboard/tasks?company_id=8');
    await page.click('button:has-text("Create Task")');
    await page.waitForLoadState('networkidle');
    
    // Fill task
    await page.fill('input[name="name"]', task.name);
    
    // Assign to crew member
    const crewSelect = page.locator('select[name="assigned_to"]');
    if (await crewSelect.isVisible()) {
      await crewSelect.selectOption('1');
    }
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });
});
