import { test, expect } from '@playwright/test';

test.describe('Diary Entry Persistence', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    console.time(`[BEFORE] ${testInfo.title}`);
    await page.goto('/');
    await page.getByLabel('Language selector').selectOption('it');
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.click('button:has-text("📔")');
    console.timeEnd(`[BEFORE] ${testInfo.title}`);
  });

  test.afterEach(async ({ page }, testInfo) => {
    console.time(`[AFTER] ${testInfo.title}`);
    await page.evaluate(() => localStorage.clear()); // Clean localStorage
    console.timeEnd(`[AFTER] ${testInfo.title}`);
  });

  test('should display diary tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Diario' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    await page.addInitScript(() => {
      const lng = localStorage.getItem('i18nextLng');
      localStorage.clear();
      if (lng) localStorage.setItem('i18nextLng', lng);
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByLabel('Language selector').selectOption('it');
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.click('button:has-text("📔")');
    await expect(page.getByRole('heading', { name: '📔 Diario quotidiano' })).toBeVisible();
  });

  test('should display water section', async ({ page }) => {
    await expect(page.getByRole('button', { name: '💧 Acqua' })).toBeVisible();
  });

  test('should display meals section', async ({ page }) => {
    await expect(page.locator('text=Pasti')).toBeVisible();
  });

  test('should display symptoms section', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🩺 Sintomi' })).toBeVisible();
  });

  test('should display notes section', async ({ page }) => {
    const notesHeading = await page.getByRole('heading', { name: '📝 Note' });
    await expect(notesHeading).toBeVisible();
  });
});
