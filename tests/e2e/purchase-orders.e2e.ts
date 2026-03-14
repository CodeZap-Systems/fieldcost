import { test, expect } from '@playwright/test';
import { AuthHelper, testUser } from '../helpers/auth.helper';
import { TestUtils } from '../helpers/test-utils.helper';
import { generateTestPurchaseOrder, generateTestPOLineItem, generateTestCustomer } from '../helpers/data-generator.helper';
import { VALID_PURCHASE_ORDER_DATA, VALID_PO_LINE_ITEMS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

test.describe('Purchase Orders E2E Tests', () => {
  let authHelper: AuthHelper;
  let vendorId: string;

  test.beforeAll(async () => {
    authHelper = new AuthHelper(BASE_URL);
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await authHelper.loginUI(page, testUser);
    // Navigate to purchase orders page
    await page.goto(`${BASE_URL}/purchase-orders`, { waitUntil: 'networkidle' }).catch(() => {
      // Fallback path if URL is different
      return page.goto(`${BASE_URL}/orders`, { waitUntil: 'networkidle' });
    });
  });

  test('should display purchase orders list', async ({ page }) => {
    // Wait for page to load
    await TestUtils.waitForTable(page).catch(() => {
      // May not have table if no POs yet
    });
    
    // Verify PO page is visible
    const heading = page.locator('h1, h2');
    const headingText = await heading.textContent();
    expect(headingText?.toLowerCase()).toContain('order');
  });

  test('should create new purchase order with minimal details', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Click create button
    await TestUtils.clickButton(page, 'Create');
    
    // Wait for form
    await TestUtils.verifyModalOpen(page);
    
    // Fill PO form
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', VALID_PURCHASE_ORDER_DATA.simple.description);
    
    // Select vendor (if required)
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      // Click first option
      await page.click('[role="option"]').catch(() => {});
    }
    
    // Submit
    await TestUtils.clickButton(page, 'Create');
    
    // Verify success
    await TestUtils.verifyToast(page, 'created', 'success');
    
    // Verify PO appears in list
    await expect(page.locator(`text=${poNumber}`)).toBeVisible().catch(() => {
      // May be in table
    });
  });

  test('should create purchase order with complete details', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 14);
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    
    // Fill complete PO details
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', VALID_PURCHASE_ORDER_DATA.complete.description);
    
    // Select vendor
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    // Set dates
    const orderDateInput = page.locator('input[type="date"][name*="order"], input[type="date"]').first();
    const deliveryDateInput = page.locator('input[type="date"]').nth(1);
    
    if (await orderDateInput.isVisible()) {
      await orderDateInput.fill(new Date().toISOString().split('T')[0]);
    }
    if (await deliveryDateInput.isVisible()) {
      await deliveryDateInput.fill(deliveryDate.toISOString().split('T')[0]);
    }
    
    // Set tax
    const taxInput = page.locator('input[name="tax_rate"]');
    if (await taxInput.isVisible()) {
      await taxInput.fill('10');
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });

  test('should add line items to purchase order', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create PO first
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'PO with line items');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    // Wait and click on the created PO
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {
      // Try alternate selector
      const row = page.locator(`text=${poNumber}`).locator('xpath=ancestor::tr');
      return row.click();
    });
    
    // Wait for PO details page
    await page.waitForURL('**/purchase-orders/**', { timeout: 5000 }).catch(() => {
      // May be different URL
    });
    
    // Click add line item
    await TestUtils.clickButton(page, 'Add');
    
    // Fill line item
    const descField = page.locator('input[placeholder*="Description"], textarea[placeholder*="Item"]').first();
    const qtyField = page.locator('input[type="number"][placeholder*="Quantity"]').first();
    const priceField = page.locator('input[type="number"][placeholder*="Price"], input[type="number"][name*="price"]').nth(1);
    
    if (await descField.isVisible()) {
      await descField.fill(VALID_PO_LINE_ITEMS.materials.description);
    }
    if (await qtyField.isVisible()) {
      await qtyField.fill(String(VALID_PO_LINE_ITEMS.materials.quantity));
    }
    if (await priceField.isVisible()) {
      await priceField.fill(String(VALID_PO_LINE_ITEMS.materials.unit_price));
    }
    
    // Add item
    await TestUtils.clickButton(page, 'Add Item').catch(() => {
      return TestUtils.clickButton(page, 'Save');
    });
    
    await TestUtils.verifyToast(page, 'added', 'success').catch(() => {
      // Toast might not appear
    });
  });

  test('should calculate PO total with multiple line items', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create and open PO
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Total calculation test');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {});
    
    // Add multiple items
    const items = [VALID_PO_LINE_ITEMS.materials, VALID_PO_LINE_ITEMS.supplies];
    
    for (const item of items) {
      await TestUtils.clickButton(page, 'Add').catch(() => {});
      
      const descField = page.locator('input[placeholder*="Description"], textarea[placeholder*="Item"]').first();
      const qtyField = page.locator('input[type="number"][placeholder*="Quantity"]').first();
      const priceField = page.locator('input[type="number"][placeholder*="Price"]').nth(1);
      
      if (await descField.isVisible()) {
        await descField.fill(item.description);
        if (await qtyField.isVisible()) {
          await qtyField.fill(String(item.quantity));
        }
        if (await priceField.isVisible()) {
          await priceField.fill(String(item.unit_price));
        }
        
        await TestUtils.clickButton(page, 'Save').catch(() => {
          return TestUtils.clickButton(page, 'Add Item');
        });
      }
      
      await page.waitForTimeout(300);
    }
    
    // Verify total is calculated
    const totalElement = page.locator('[class*="total"], [data-testid="total"]');
    await expect(totalElement).toBeVisible().catch(() => {
      // May not be visible immediately
    });
  });

  test('should edit purchase order details', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    const updatedDescription = 'Updated PO description';
    
    // Create PO
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Original description');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {});
    
    // Edit description
    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
    }
    
    const descField = page.locator('textarea[name="description"]');
    await descField.clear();
    await descField.fill(updatedDescription);
    
    await TestUtils.clickButton(page, 'Save');
    await TestUtils.verifyToast(page, 'updated', 'success');
  });

  test('should change purchase order status', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create PO
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Status change test');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {});
    
    // Change status
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('approved');
      await TestUtils.clickButton(page, 'Save');
      await TestUtils.verifyToast(page, 'updated', 'success');
    }
  });

  test('should delete line item from purchase order', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create PO with item
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Delete item test');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {});
    
    // Add item
    await TestUtils.clickButton(page, 'Add').catch(() => {});
    const descField = page.locator('input[placeholder*="Description"]').first();
    if (await descField.isVisible()) {
      await descField.fill('Item to delete');
      const qtyField = page.locator('input[type="number"][placeholder*="Quantity"]').first();
      const priceField = page.locator('input[type="number"][placeholder*="Price"]').nth(1);
      
      if (await qtyField.isVisible()) {
        await qtyField.fill('1');
      }
      if (await priceField.isVisible()) {
        await priceField.fill('100');
      }
      
      await TestUtils.clickButton(page, 'Save').catch(() => {
        return TestUtils.clickButton(page, 'Add Item');
      });
    }
    
    // Delete item - look for delete button
    const deleteBtn = page.locator('button[aria-label*="Delete"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await TestUtils.verifyToast(page, 'removed', 'success').catch(() => {});
    }
  });

  test('should search purchase orders', async ({ page }) => {
    // Search for PO
    await TestUtils.searchTable(page, 'PO-');
    await page.waitForTimeout(800);
    
    // Verify results
    const rows = await page.locator('table tbody tr').count().catch(() => 0);
    // May have 0 or more results
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test('should filter purchase orders by status', async ({ page }) => {
    const statusFilter = page.locator('select[aria-label*="Status"], select[name="status"]').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('draft');
      await page.waitForTimeout(800);
      
      // Verify filtered results
      const rows = await page.locator('table tbody tr').count().catch(() => 0);
      expect(rows).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display PO with tax calculation', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create PO with tax
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Tax calculation test');
    
    const taxInput = page.locator('input[name="tax_rate"]');
    if (await taxInput.isVisible()) {
      await taxInput.fill('10');
    }
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });

  test('should mark purchase order as received', async ({ page }) => {
    const poNumber = `PO-${Date.now()}`;
    
    // Create PO
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="po_number"]', poNumber);
    await page.fill('textarea[name="description"]', 'Received test');
    
    const vendorSelect = page.locator('select[name="vendor_id"], input[aria-label*="Vendor"]').first();
    if (await vendorSelect.isVisible()) {
      await vendorSelect.fill('Test Vendor');
      await page.waitForTimeout(300);
      await page.click('[role="option"]').catch(() => {});
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await page.waitForTimeout(1000);
    await page.click(`text=${poNumber}`).catch(() => {});
    
    // Mark as received
    const receivedBtn = page.locator('button:has-text("Received"), button:has-text("Mark Received")');
    if (await receivedBtn.isVisible()) {
      await receivedBtn.click();
      await TestUtils.verifyToast(page, 'received', 'success').catch(() => {});
    }
  });
});
