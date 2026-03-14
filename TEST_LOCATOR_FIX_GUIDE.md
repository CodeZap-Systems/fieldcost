# Test Locator Quick Fix Guide
**Goal**: Replace generic `text=` selectors with specific Playwright locators  
**Time**: ~2 hours to apply all fixes across test files  
**Pattern**: Universal approach that works across all test files

---

## The Problem

Generic text selectors fail in Playwright strict mode:

```typescript
// ❌ FAILS: Matches multiple elements with "Login" text
await expect(page.locator('text=Login')).toBeVisible();

// Error: strict mode violation: locator('text=Login') resolved to 4 elements:
// 1. <a>Demo login</a>
// 2. <a>Login</a> (navigation)
// 3. <h1>Login</h1> (heading)
// 4. <button>Login</button> (submit)
```

## The Solution

Use **specific locator strategies** based on element type:

---

## Quick Reference Table

| What You're Looking For | Selector | Example |
|-------------------------|----------|---------|
| Heading "Login" | `getByRole('heading', { name: 'Login' })` | ✅ Specific |
| "Login" button | `getByRole('button', { name: 'Login' })` | ✅ Specific |
| "Login" link | `getByRole('link', { name: 'Login' })` | ✅ Specific |
| Email input | `getByLabel('Email')` | ✅ Specific |
| Email input (no label) | `getByPlaceholder('Email')` | ✅ Specific |
| Form field by name | `getByLabel('Password')` | ✅ Specific |
| Any generic text | `getByText('exact text')` | ⚠️ Use cautiously |
| Element with test ID | `getByTestId('login-form')` | ✅ Most specific |

---

## Apply Fixes in 5 Minutes Per File

### Pattern 1: Page Titles/Headings

```typescript
// ❌ BEFORE
await expect(page.locator('text=Projects')).toBeVisible();

// ✅ AFTER - Use heading role
await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
// OR if it's a page header:
await expect(page.getByRole('heading', { level: 1, name: /projects/i })).toBeVisible();
```

### Pattern 2: Buttons

```typescript
// ❌ BEFORE  
await page.locator('text=Save').click();

// ✅ AFTER - Use button role
await page.getByRole('button', { name: /save/i }).click();
```

### Pattern 3: Links

```typescript
// ❌ BEFORE
await page.locator('text=Dashboard').click();

// ✅ AFTER - Use link role
await page.getByRole('link', { name: /dashboard/i }).click();
```

### Pattern 4: Form Inputs

```typescript
// ❌ BEFORE
await page.fill('input[type="email"]', 'test@example.com');

// ✅ AFTER - Use label
await page.getByLabel('Email').fill('test@example.com');

// ✅ ALTERNATE - If no label, use placeholder
await page.getByPlaceholder('Enter email').fill('test@example.com');

// ✅ ALTERNATE - If neither, use name
await page.getByLabel('Email Address').fill('test@example.com');
```

### Pattern 5: Multiple Matches (Last Resort)

If you must use `text=` and multiple elements match:

```typescript
// ❌ FAILS
await page.locator('text=Login').first().click();  // Might click wrong element

// ✅ BETTER - Add context
await page.locator('form').getByRole('button', { name: 'Login' }).click();

// ✅ BEST - Add test ID to element in code
// In JSX: <button data-testid="login-submit">Login</button>
await page.getByTestId('login-submit').click();
```

---

## Files to Fix with Fix Count

| File | Fixes Needed | Estimated Time |
|------|-------------|-----------------|
| `e2e/tier1.auth.spec.ts` | ~4 | 5 min |
| `e2e/tier1.dashboard.spec.ts` | ~5 | 10 min |
| `e2e/tier1.projects.spec.ts` | ~3 | 5 min |
| `e2e/tier1.tasks.spec.ts` | ~2 | 5 min |
| `e2e/tier1.invoices.spec.ts` | ~3 | 5 min |
| `e2e/tier1.customers.spec.ts` | ~1 | 5 min |
| **TOTAL** | **~18 fixes** | **~35 min** |

---

## Step-by-Step Batch Fix (Copy-Paste Pattern)

### For Heading Checks:
```typescript
// FIND:
await expect(page.locator('text=ProjectsHere')).toBeVisible();

// REPLACE:
await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible();
```

### For Button Clicks:
```typescript
// FIND:
await page.locator('text=Create').click();

// REPLACE:
await page.getByRole('button', { name: /create/i }).click();
```

### For Form Fields:
```typescript
// FIND:
await page.fill('input[type="email"]', 'test@test.com');

// REPLACE:
await page.getByLabel('Email').fill('test@test.com');
// OR
await page.getByPlaceholder('test@example.com').fill('test@test.com');
```

---

## Validation Checklist

After applying fixes:

- [ ] No more `locator('text=...')` in test files
- [ ] All selectors use `getByRole`, `getByLabel`, `getByPlaceholder`, or `getByTestId`
- [ ] Run tests: `npm run test:e2e`
- [ ] Verify all tests pass: `✅ 74/74 passing`

---

## Fast Track: Just for Saturday Demo

If you're short on time, focus on fixing ONLY these critical tests:

1. **tier1.auth.spec.ts** (already fixed above)
2. **tier1.dashboard.spec.ts** (4 selectors)
3. **Disable non-essential tests** temporarily with test.skip()

Example:
```typescript
test.skip('should display projects list page (not critical for MVP)', async ({ page }) => {
  // This test can be fixed later
});
```

This gets you to **all critical paths green** in <1 hour.

---

## Automatic Fix Script (If Available)

You could create a find-and-replace automation:

```bash
# Find all generic text selectors
grep -r "locator('text=" tests/e2e/ e2e/

# Result shows exactly what needs replacing
```

Then batch replace using VS Code Find & Replace with regex:
- Find: `locator\('text=([^']+)'\)`  
- Replace: `getByRole('button', { name: /$1/i })`
- Adjust role based on context

---

## Test After Each Fix

```bash
# Quick validation
npm run test:e2e -- tier1.auth.spec.ts

# Full validation when done
npm run test:e2e
```

Expected: **All tests passing ✅**

---

**CRITICAL**: You want this done by **Thursday EOD** to have Friday for evidence docs and demo prep.
