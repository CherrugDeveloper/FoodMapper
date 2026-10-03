import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set language to Italian for consistent test text
    await page.getByLabel('Language selector').selectOption('it');
  });

  test('should show medical disclaimer on first visit', async ({ page }) => {
    await expect(page.locator('text=Avviso Medico e Limitazione di Responsabilità')).toBeVisible();
    await expect(page.locator('button:has-text("Ho letto, compreso e accetto")')).toBeVisible();
  });

  test('should unlock app after accepting disclaimer', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️")')).toBeVisible();
  });

  test('should persist acceptance in localStorage', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    console.log('DEBUG: Disclaimer accepted, checking localStorage');
    const disclaimerAccepted = await page.evaluate(() => {
      return localStorage.getItem('foodmapper_disclaimer_accepted');
    });
    console.log('DEBUG: Disclaimer accepted value:', disclaimerAccepted);
    await page.reload();
    console.log('DEBUG: Page reloaded, checking disclaimer visibility');
    // Language preference is stored in localStorage, so it should persist
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Avviso Medico e Limitazione di Responsabilità')).not.toBeVisible();
  });

  test('should clear acceptance when localStorage is cleared', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByLabel('Language selector').selectOption('it');
    await expect(page.locator('text=Avviso Medico e Limitazione di Responsabilità')).toBeVisible();
  });
});