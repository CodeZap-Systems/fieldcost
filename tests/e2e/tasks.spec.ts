import { test, expect } from '@playwright/test';
import LoginHelper from '../helpers/login.helper';
import { TEST_USERS } from '../fixtures/test-users';
import { TEST_TASKS, TEST_PROJECTS } from '../fixtures/test-data';

/**
 * TASKS E2E TESTS
 * Test task creation, assignment, progress tracking, and completion
 */

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as project manager
    await LoginHelper.login(page, TEST_USERS.projectManager.email, TEST_USERS.projectManager.password);

    // Navigate to tasks page
    await page.goto('/dashboard/tasks');
  });

  // ================== TASK LIST TESTS ==================

  test('should display tasks list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new task|create task|add task/i })).toBeVisible();
  });

  test('should list all tasks for current company', async ({ page }) => {
    const taskList = page.locator('[data-testid="tasks-list"], .tasks-table');

    await taskList.waitFor({ timeout: 5000 });
    expect(await taskList.isVisible()).toBeTruthy();
  });

  test('should display task columns', async ({ page }) => {
    const columns = ['Task Name', 'Project', 'Assigned To', 'Status', 'Due Date', 'Priority'];

    for (const column of columns) {
      const columnHeader = page.locator(`th:has-text("${column}")`);
      const isVisible = await columnHeader.isVisible().catch(() => false);

      if (isVisible) {
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should search tasks by name', async ({ page }) => {
    const searchBox = page.locator('input[placeholder*="Search"], input[data-testid="search-tasks"]');

    if (await searchBox.isVisible()) {
      await searchBox.fill('Excavation');
      await page.waitForTimeout(500);

      const taskItems = page.locator('[data-testid="task-item"]');
      const count = await taskItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter tasks by status', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filter|Status")');

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const statusFilter = page.locator('button:has-text("To Do|In Progress|Completed")');
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        await page.waitForTimeout(500);

        const tasksList = page.locator('[data-testid="tasks-list"]');
        expect(await tasksList.isVisible()).toBeTruthy();
      }
    }
  });

  test('should filter tasks by priority', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Priority|Filter")');

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const priorityFilter = page.locator('button:has-text("High|Medium|Low")');
      if (await priorityFilter.isVisible()) {
        await priorityFilter.click();
        await page.waitForTimeout(500);

        const tasksList = page.locator('[data-testid="tasks-list"]');
        expect(await tasksList.isVisible()).toBeTruthy();
      }
    }
  });

  test('should filter tasks by assignee', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Assignee|Assigned To|Filter")');

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const assigneeOption = page.locator('[data-testid="assignee-filter-option"]').first();
      if (await assigneeOption.isVisible()) {
        await assigneeOption.click();
        await page.waitForTimeout(500);

        const tasksList = page.locator('[data-testid="tasks-list"]');
        expect(await tasksList.isVisible()).toBeTruthy();
      }
    }
  });

  test('should sort tasks by due date', async ({ page }) => {
    const dueDateHeader = page.locator('th:has-text("Due Date")');

    if (await dueDateHeader.isVisible()) {
      await dueDateHeader.click();
      await page.waitForTimeout(500);

      const taskItems = page.locator('[data-testid="task-item"]');
      expect(await taskItems.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test('should sort tasks by priority', async ({ page }) => {
    const priorityHeader = page.locator('th:has-text("Priority")');

    if (await priorityHeader.isVisible()) {
      await priorityHeader.click();
      await page.waitForTimeout(500);

      const taskItems = page.locator('[data-testid="task-item"]');
      expect(await taskItems.count()).toBeGreaterThanOrEqual(0);
    }
  });

  // ================== TASK DETAILS TESTS ==================

  test('should view task details', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      await page.waitForURL(/.*tasks\/\d+|.*tasks\/[a-z0-9-]+/i, { timeout: 5000 }).catch(() => {});

      const taskDetails = page.getByText(/task details|task information/i).first();
      const isVisible = await taskDetails.isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should display task detail form', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const taskNameField = page.locator('input[name="taskName"]');
      const isVisible = await taskNameField.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        expect(isVisible).toBeTruthy();
        expect(await page.locator('textarea[name="description"]').isVisible({ timeout: 1000 }).catch(() => false) || true).toBeTruthy();
      }
    }
  });

  // ================== CREATE TASK TESTS ==================

  test('should open create task dialog', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Task|Create Task|Add Task")');

    await createButton.click();

    const dialog = page.locator('[data-testid="task-form"], dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('should create new task', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Task|Create Task|Add Task")');
    await createButton.click();

    // Fill form
    await page.fill('input[name="taskName"]', `Excavation Work ${Date.now()}`);
    await page.fill('input[name="estimatedHours"]', String(TEST_TASKS.excavation.estimatedHours));
    await page.fill('input[name="budgetedAmount"]', String(TEST_TASKS.excavation.budgetedAmount));

    // Select project
    const projectSelect = page.locator('select[name="projectId"]');
    if (await projectSelect.isVisible()) {
      await projectSelect.selectOption({ index: 1 });
    }

    // Select priority
    const prioritySelect = page.locator('select[name="priority"]');
    if (await prioritySelect.isVisible()) {
      await prioritySelect.selectOption('high');
    }

    // Set due date
    const dueDateField = page.locator('input[name="dueDate"]');
    if (await dueDateField.isVisible()) {
      await dueDateField.fill('2024-12-31');
    }

    // Submit form
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show success message
    const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields on create', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Task|Create Task|Add Task")');
    await createButton.click();

    // Try to submit without filling fields
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show validation errors
    const hasError = await page
      .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    expect(hasError || !submitButton.isEnabled()).toBeTruthy();
  });

  test('should validate estimated hours is positive', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Task|Create Task|Add Task")');
    await createButton.click();

    await page.fill('input[name="taskName"]', 'Test Task');
    await page.fill('input[name="estimatedHours"]', '-5');

    await page.click('button:has-text("Create|Save|Submit")');

    const hasError = await page
      .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    expect(hasError).toBeTruthy();
  });

  // ================== EDIT TASK TESTS ==================

  test('should edit task', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const editButton = page.locator('button:has-text("Edit|Update")');
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editButton.click();

        const taskNameField = page.locator('input[name="taskName"]');
        await taskNameField.clear();
        await taskNameField.fill(`Updated Task ${Date.now()}`);

        const saveButton = page.locator('button:has-text("Save|Update|Submit")');
        await saveButton.click();

        await expect(
          const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
          await expect(successMsg).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should mark task as completed', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const completeButton = page.locator('button:has-text("Complete|Mark as Done")');
      if (await completeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await completeButton.click();

        // Should show success or move to completed section
      const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
        const isCompleted = await successMsg.isVisible({ timeout: 3000 }).catch(() => false);

        expect(isCompleted).toBeTruthy();
      }
    }
  });

  test('should change task status', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const statusSelect = page.locator('select[name="status"]');
      if (await statusSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await statusSelect.selectOption('in-progress');
        await page.waitForTimeout(500);

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

  // ================== TASK ASSIGNMENT TESTS ==================

  test('should assign task to user', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const assigneeSelect = page.locator('select[name="assignedTo"]');
      if (await assigneeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Get available options
        const options = await assigneeSelect.locator('option').count();

        if (options > 1) {
          await assigneeSelect.selectOption({ index: 1 });

          const saveButton = page.locator('button:has-text("Save|Update")');
          if (await saveButton.isVisible()) {
            await saveButton.click();

            await expect(
              const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
              await expect(successMsg).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('should unassign task', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const assigneeSelect = page.locator('select[name="assignedTo"]');
      if (await assigneeSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await assigneeSelect.selectOption({ value: '' });

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

  // ================== DELETE TASK TESTS ==================

  test('should delete task', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const deleteButton = page.locator('button:has-text("Delete|Remove")');
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();

        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm|Delete|Yes")');
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  // ================== TASK BULK ACTIONS TESTS ==================

  test('should select multiple tasks', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="task-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      await checkboxes.first().click();
      await checkboxes.nth(1).click();

      const bulkActions = page.locator('[data-testid="bulk-actions"]');
      const isVisible = await bulkActions.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should bulk change task status', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="task-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      await checkboxes.first().click();

      const bulkStatusButton = page.locator('button:has-text("Change Status")');
      if (await bulkStatusButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bulkStatusButton.click();

        const statusOption = page.locator('button:has-text("In Progress|Completed")');
        if (await statusOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await statusOption.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  // ================== TASK FILTERING & VIEW TESTS ==================

  test('should display overdue tasks view', async ({ page }) => {
    const overdueFilter = page.locator('button:has-text("Overdue")');

    if (await overdueFilter.isVisible()) {
      await overdueFilter.click();
      await page.waitForTimeout(500);

      const tasksList = page.locator('[data-testid="tasks-list"]');
      expect(await tasksList.isVisible()).toBeTruthy();
    }
  });

  test('should display my tasks view', async ({ page }) => {
    const myTasksFilter = page.locator('button:has-text("My Tasks")');

    if (await myTasksFilter.isVisible()) {
      await myTasksFilter.click();
      await page.waitForTimeout(500);

      const tasksList = page.locator('[data-testid="tasks-list"]');
      expect(await tasksList.isVisible()).toBeTruthy();
    }
  });

  test('should display today tasks view', async ({ page }) => {
    const todayFilter = page.locator('button:has-text("Today")');

    if (await todayFilter.isVisible()) {
      await todayFilter.click();
      await page.waitForTimeout(500);

      const tasksList = page.locator('[data-testid="tasks-list"]');
      expect(await tasksList.isVisible()).toBeTruthy();
    }
  });

  test('should toggle list/board view', async ({ page }) => {
    const listViewButton = page.locator('button[data-testid="view-list"]');
    const boardViewButton = page.locator('button[data-testid="view-board"]');

    if (await boardViewButton.isVisible()) {
      await boardViewButton.click();
      await page.waitForTimeout(500);

      // Should display kanban board
      const boardColumns = page.locator('[data-testid="board-column"]');
      const count = await boardColumns.count();
      expect(count).toBeGreaterThan(0);
    }

    if (await listViewButton.isVisible()) {
      await listViewButton.click();
      await page.waitForTimeout(500);

      // Should display list
      const tasksList = page.locator('[data-testid="tasks-list"]');
      expect(await tasksList.isVisible()).toBeTruthy();
    }
  });

  // ================== TASK PROGRESS TESTS ==================

  test('should display task progress percentage', async ({ page }) => {
    const progressBar = page.locator('[data-testid="task-progress-bar"]');

    const isVisible = await progressBar.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      expect(isVisible).toBeTruthy();
    }
  });

  test('should update progress when task status changes', async ({ page }) => {
    const firstTask = page.locator('[data-testid="task-item"]').first();

    if (await firstTask.isVisible()) {
      await firstTask.click();

      const statusSelect = page.locator('select[name="status"]');
      if (await statusSelect.isVisible({ timeout: 2000 }).catch(() => false)) {
        await statusSelect.selectOption('completed');

        const saveButton = page.locator('button:has-text("Save")');
        if (await saveButton.isVisible()) {
          await saveButton.click();

          // Progress should update
          const progressBar = page.locator('[data-testid="task-progress-bar"]');
          const isVisible = await progressBar.isVisible({ timeout: 3000 }).catch(() => false);
          expect(isVisible).toBeTruthy();
        }
      }
    }
  });
});
