import { test, expect } from '@playwright/test';
import { prepareApp } from './fixtures';

test.describe('Diary Entry Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await prepareApp(page);
    await page.getByRole('button', { name: /📔/ }).click();
    await expect(page.getByRole('heading', { name: /Diario quotidiano/ })).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  test('should display diary tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Diario' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.removeItem('foodmapper_calc_results');
      localStorage.setItem('ibs_disclaimer_accepted', 'true');
    });
    await page.reload();
    await expect(page.locator('header')).toBeVisible();
    await page.getByRole('button', { name: /📔/ }).click();
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
