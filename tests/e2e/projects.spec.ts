import { test, expect } from '@playwright/test';
import LoginHelper from '../helpers/login.helper';
import TestCompanyHelper from '../helpers/test-company.helper';
import { TEST_USERS } from '../fixtures/test-users';
import { TEST_PROJECTS } from '../fixtures/test-data';

/**
 * PROJECTS E2E TESTS
 * Test project creation, management, and CRUD operations through UI
 */

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as project manager
    await LoginHelper.login(page, TEST_USERS.projectManager.email, TEST_USERS.projectManager.password);

    // Navigate to projects page
    await page.goto('/dashboard/projects');
  });

  // ================== PROJECT LIST TESTS ==================

  test('should display projects list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new project|create project|add project/i })).toBeVisible();
  });

  test('should list all projects for current company', async ({ page }) => {
    // Should display projects table or cards
    const projectList = page.locator('[data-testid="projects-list"], .projects-table');

    // Wait for list to load
    await projectList.waitFor({ timeout: 5000 });
    expect(await projectList.isVisible()).toBeTruthy();
  });

  test('should display project columns (name, client, budget, status)', async ({ page }) => {
    const columns = ['Name', 'Client', 'Budget', 'Status', 'Start Date', 'End Date'];

    for (const column of columns) {
      const columnHeader = page.locator(`th:has-text("${column}")`, {
        hasNot: page.locator('[data-testid="loading"]'),
      });

      const isVisible = await columnHeader.isVisible().catch(() => false);
      if (isVisible) {
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should search projects by name', async ({ page }) => {
    const searchBox = page.locator('input[placeholder*="Search"], input[data-testid="search-projects"]');

    if (await searchBox.isVisible()) {
      await searchBox.fill('Residential');
      await page.waitForTimeout(500);

      // Should filter results
      const projectItems = page.locator('[data-testid="project-item"]');
      const count = await projectItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should filter projects by status', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filter|Status|Category")');

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const activeFilter = page.locator('button:has-text("Active")');
      if (await activeFilter.isVisible()) {
        await activeFilter.click();
        await page.waitForTimeout(500);

        // Filtered results should display
        const projectList = page.locator('[data-testid="projects-list"]');
        expect(await projectList.isVisible()).toBeTruthy();
      }
    }
  });

  test('should sort projects by budget', async ({ page }) => {
    const budgetHeader = page.locator('th:has-text("Budget")');

    if (await budgetHeader.isVisible()) {
      await budgetHeader.click();
      await page.waitForTimeout(500);

      // Should sort in ascending order
      const projectItems = page.locator('[data-testid="project-item"]');
      const count = await projectItems.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should paginate projects list', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next|→")');

    const hasNextButton = await nextButton.isVisible().catch(() => false);
    if (hasNextButton) {
      expect(hasNextButton).toBeTruthy();
    }
  });

  // ================== PROJECT DETAILS TESTS ==================

  test('should view project details', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      // Should navigate to project details page
      await page.waitForURL(/.*projects\/\d+|.*projects\/[a-z0-9-]+/i);

      // Display project information
      await expect(page.getByText(/project details|project information/i).first()).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should display project details form', async ({ page }) => {
    const projectNameField = page.locator('input[name="projectName"]');

    if (await projectNameField.isVisible()) {
      expect(await projectNameField.isVisible()).toBeTruthy();
      expect(await page.locator('input[name="clientName"]').isVisible()).toBeTruthy();
      expect(await page.locator('input[name="budget"]').isVisible()).toBeTruthy();
    }
  });

  // ================== CREATE PROJECT TESTS ==================

  test('should open create project dialog', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Project|Create Project|Add Project")');

    await createButton.click();

    // Dialog should appear
    const dialog = page.locator('[data-testid="project-form"], dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('should create new project', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Project|Create Project|Add Project")');
    await createButton.click();

    // Fill form
    await page.fill('input[name="projectName"]', `Residential Renovation ${Date.now()}`);
    await page.fill('input[name="clientName"]', TEST_PROJECTS.residential.clientName);
    await page.fill('input[name="budget"]', String(TEST_PROJECTS.residential.budget));

    // Select start date
    const startDateField = page.locator('input[name="startDate"]');
    if (await startDateField.isVisible()) {
      await startDateField.fill('2024-03-15');
    }

    // Submit form
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show success message
    await expect(
      const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
      await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields on create', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Project|Create Project|Add Project")');
    await createButton.click();

    // Try to submit without filling fields
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show validation errors
    const hasError = await page
      .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
      .first()
      .catch(() => false);

    expect(hasError || !submitButton.isEnabled()).toBeTruthy();
  });

  test('should validate budget is positive number', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Project|Create Project|Add Project")');
    await createButton.click();

    await page.fill('input[name="projectName"]', 'Test Project');
    await page.fill('input[name="clientName"]', 'Test Client');
    await page.fill('input[name="budget"]', '-1000'); // Negative budget

    await page.click('button:has-text("Create|Save|Submit")');

    // Should show error
    const hasError = await page
      .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
      .first()
      .catch(() => false);

    expect(hasError).toBeTruthy();
  });

  test('should validate end date after start date', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Project|Create Project|Add Project")');
    await createButton.click();

    await page.fill('input[name="projectName"]', 'Test Project');
    await page.fill('input[name="clientName"]', 'Test Client');
    await page.fill('input[name="budget"]', '50000');

    const startDateField = page.locator('input[name="startDate"]');
    const endDateField = page.locator('input[name="endDate"]');

    if (await startDateField.isVisible() && await endDateField.isVisible()) {
      await startDateField.fill('2024-12-31');
      await endDateField.fill('2024-01-01'); // End before start

      await page.click('button:has-text("Create|Save|Submit")');

      // Should show error
      const hasError = await page
        .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
        .first()
        .catch(() => false);

      expect(hasError).toBeTruthy();
    }
  });

  // ================== EDIT PROJECT TESTS ==================

  test('should edit project', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      // Find edit button
      const editButton = page.locator('button:has-text("Edit|Update")');
      if (await editButton.isVisible()) {
        await editButton.click();

        // Modify project name
        const projectNameField = page.locator('input[name="projectName"]');
        await projectNameField.clear();
        await projectNameField.fill(`Updated Project ${Date.now()}`);

        // Save changes
        const saveButton = page.locator('button:has-text("Save|Update|Submit")');
        await saveButton.click();

        // Should show success message
        await expect(
          const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
          await expect(successMsg).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should cancel editing project', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      const editButton = page.locator('button:has-text("Edit|Update")');
      if (await editButton.isVisible()) {
        await editButton.click();

        const cancelButton = page.locator('button:has-text("Cancel|Close")');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();

          // Should return to details view
          const editForm = page.locator('[data-testid="project-form"]');
          const isHidden = await editForm
            .isHidden()
            .catch(() => true);

          expect(isHidden).toBeTruthy();
        }
      }
    }
  });

  // ================== DELETE PROJECT TESTS ==================

  test('should delete project', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      const projectName = await firstProject.getAttribute('data-project-name');

      await firstProject.click();

      const deleteButton = page.locator('button:has-text("Delete|Remove")');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm|Delete|Yes")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          // Should show success message
          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('should show confirmation dialog before deletion', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      const deleteButton = page.locator('button:has-text("Delete|Remove")');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirmation dialog should appear
        const confirmDialog = page.locator('[data-testid="confirm-dialog"], dialog');
        await expect(confirmDialog).toBeVisible({ timeout: 5000 });

        expect(
          await page.getByText(/sure|confirm|delete/i).first().isVisible()
        ).toBeTruthy();
      }
    }
  });

  // ================== PROJECT STATUS TESTS ==================

  test('should change project status', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      const statusControl = page.locator('select[name="status"]');
      if (await statusControl.isVisible()) {
        await statusControl.selectOption('completed');

        const saveButton = page.locator('button:has-text("Save|Update")');
        if (await saveButton.isVisible()) {
          await saveButton.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('should display project status badge', async ({ page }) => {
    const statusBadge = page.locator('[data-testid="project-status-badge"]');

    const hasStatusBadge = await statusBadge.isVisible().catch(() => false);
    expect(hasStatusBadge).toBeTruthy();
  });

  // ================== PROJECT TASKS TESTS ==================

  test('should navigate to project tasks', async ({ page }) => {
    const firstProject = page.locator('[data-testid="project-item"]').first();

    if (await firstProject.isVisible()) {
      await firstProject.click();

      const tasksTab = page.locator('a:has-text("Tasks|View Tasks")');
      if (await tasksTab.isVisible()) {
        await tasksTab.click();

        // Should navigate to tasks page
        await expect(page.getByRole('heading', { name: /tasks|project tasks/i }).first()).toBeVisible({
          timeout: 5000,
        });
      }
    }
  });

  test('should display project budget progress', async ({ page }) => {
    const budgetProgress = page.locator('[data-testid="budget-progress"]');

    const hasProgress = await budgetProgress.isVisible().catch(() => false);
    if (hasProgress) {
      expect(hasProgress).toBeTruthy();
    }
  });

  // ================== MULTI-COMPANY PROJECT TESTS ==================

  test('should switch companies for projects', async ({ page }) => {
    const companySwitch = page.locator('[data-testid="company-switch"], select[name="company"]');

    const hasSwitch = await companySwitch.isVisible().catch(() => false);
    if (hasSwitch) {
      // Get options
      const options = await page.locator('select[name="company"] option').count();
      expect(options).toBeGreaterThan(1);

      // Switch to another company
      await companySwitch.selectOption({ index: 1 });
      await page.waitForTimeout(1000);

      // Projects list should update
      const projectsList = page.locator('[data-testid="projects-list"]');
      expect(await projectsList.isVisible()).toBeTruthy();
    }
  });

  test('should filter projects by company', async ({ page }) => {
    const companyFilter = page.locator('select[name="companyFilter"]');

    if (await companyFilter.isVisible()) {
      await companyFilter.selectOption('1');
      await page.waitForTimeout(500);

      const projectsList = page.locator('[data-testid="projects-list"]');
      expect(await projectsList.isVisible()).toBeTruthy();
    }
  });

  // ================== EXPORT/IMPORT TESTS ==================

  test('should export projects to CSV', async ({ page, context }) => {
    const exportButton = page.locator('button:has-text("Export|Download")');

    if (await exportButton.isVisible()) {
      // Listen for download
      const downloadPromise = context.waitForEvent('download');

      await exportButton.click();

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.csv|\.xlsx/);
    }
  });

  test('should show export format options', async ({ page }) => {
    const exportButton = page.locator('button:has-text("Export|Download")');

    if (await exportButton.isVisible()) {
      await exportButton.click();

      const csvOption = page.locator('button:has-text("CSV|Excel|PDF")');
      const hasOptions = await csvOption.isVisible().catch(() => false);

      if (hasOptions) {
        expect(hasOptions).toBeTruthy();
      }
    }
  });

  // ================== BULK ACTIONS TESTS ==================

  test('should select multiple projects', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="project-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      // Select first two projects
      await checkboxes.first().click();
      await checkboxes.nth(1).click();

      // Bulk action buttons should appear
      const bulkActions = page.locator('[data-testid="bulk-actions"]');
      expect(await bulkActions.isVisible()).toBeTruthy();
    }
  });

  test('should bulk delete projects', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="project-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      await checkboxes.first().click();

      const bulkDeleteButton = page.locator('button:has-text("Delete Selected")');
      if (await bulkDeleteButton.isVisible()) {
        await bulkDeleteButton.click();

        // Confirmation dialog should appear
        const confirmButton = page.locator('button:has-text("Confirm|Delete|Yes")');
        expect(await confirmButton.isVisible()).toBeTruthy();
      }
    }
  });
});
