import { test, expect } from '@playwright/test';

test.describe('Diet Plan CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('🌐 Language:').selectOption('it');
    await page.click('button:has-text("Ho letto, compreso e accetto")');
  });

  test('should display diet plan tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Dieta' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByLabel('🌐 Language:').selectOption('it');
    await page.click('button:has-text("Ho letto, compreso e accetto")');
    await page.click('button:has-text("🍽️")');
    await expect(page.locator('text=Compila il calcolatore')).toBeVisible();
  });

  test('should navigate to diet plan tab', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();
  });

  test('should display diet plan title', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();
  });
});