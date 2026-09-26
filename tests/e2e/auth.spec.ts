import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Set language to Italian for consistent test text
    await page.getByLabel('🌐 Language:').selectOption('it');
  });

  test('should show medical disclaimer on first visit', async ({ page }) => {
    await expect(page.locator('text=Avviso Importante e Limitazione di Responsabilità')).toBeVisible();
    await expect(page.locator('button:has-text("Ho letto, compreso e accetto")')).toBeVisible();
  });

  test('should unlock app after accepting disclaimer', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️")')).toBeVisible();
  });

  test('should persist acceptance in localStorage', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.reload();
    // Language preference is stored in localStorage, so it should persist
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=Avviso Importante e Limitazione di Responsabilità')).not.toBeVisible();
  });

  test('should clear acceptance when localStorage is cleared', async ({ page }) => {
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByLabel('🌐 Language:').selectOption('it');
    await expect(page.locator('text=Avviso Importante e Limitazione di Responsabilità')).toBeVisible();
  });
});