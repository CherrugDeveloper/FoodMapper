# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: diary.spec.ts >> Diary Entry Persistence >> should show calculator prompt when no calculation exists
- Location: tests\e2e\diary.spec.ts:15:3

# Error details

```
TimeoutError: page.reload: Timeout 25000ms exceeded.
Call log:
  - waiting for navigation until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]: Loading…
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Diary Entry Persistence', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await page.getByLabel('Language selector').selectOption('it');
  7  |     await page.click('button:has-text("Ho letto, compreso e accetto")');
  8  |     await page.click('button:has-text("📔")');
  9  |   });
  10 | 
  11 |   test('should display diary tab', async ({ page }) => {
  12 |     await expect(page.getByRole('button', { name: 'Diario' })).toBeVisible();
  13 |   });
  14 | 
  15 |   test('should show calculator prompt when no calculation exists', async ({ page }) => {
  16 |     await page.evaluate(() => localStorage.clear());
> 17 |     await page.reload();
     |                ^ TimeoutError: page.reload: Timeout 25000ms exceeded.
  18 |     await page.getByLabel('Language selector').selectOption('it');
  19 |     await page.click('button:has-text("Ho letto, compreso e accetto")');
  20 |     await page.click('button:has-text("📔")');
  21 |     // The calculator prompt may not be visible immediately, just check the diary loaded
  22 |     await expect(page.getByRole('heading', { name: '📔 Diario quotidiano' })).toBeVisible();
  23 |   });
  24 | 
  25 |   test('should display water section', async ({ page }) => {
  26 |     await expect(page.getByRole('button', { name: '💧 Acqua' })).toBeVisible();
  27 |   });
  28 | 
  29 |   test('should display meals section', async ({ page }) => {
  30 |     await expect(page.locator('text=Pasti')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('should display symptoms section', async ({ page }) => {
  34 |     await expect(page.getByRole('button', { name: '🩺 Sintomi' })).toBeVisible();
  35 |   });
  36 | 
  37 |   test('should display notes section', async ({ page }) => {
  38 |     await expect(page.getByRole('heading', { name: 'Note' })).toBeVisible();
  39 |   });
  40 | });
```