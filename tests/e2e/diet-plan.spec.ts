import { test, expect } from '@playwright/test';
import { prepareApp } from './fixtures';

test.describe('Diet Plan CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await prepareApp(page);
  });

  test('should display diet plan tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Dieta' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('ibs_disclaimer_accepted', 'true');
      localStorage.setItem('i18nextLng', 'it');
    });
    await page.reload();
    await expect(page.locator('header')).toBeVisible();
    await page.getByRole('button', { name: /🍽️/ }).click();
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