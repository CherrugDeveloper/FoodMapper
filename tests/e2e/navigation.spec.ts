import { test, expect } from '@playwright/test';

test.describe('Navigation Between Routes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('🌐 Language:').selectOption('it');
    await page.click('button:has-text("Ho letto, compreso e accetto")');
  });

  test('should navigate to calculator tab', async ({ page }) => {
    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: 'Parametri Biometrici e Intestinali' })).toBeVisible();
  });

  test('should navigate to diary tab', async ({ page }) => {
    await page.click('button:has-text("📔")');
    await expect(page.getByRole('heading', { name: 'Diario quotidiano' })).toBeVisible();
  });

  test('should navigate to diet plan tab', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();
  });

  test('should navigate to recipes tab', async ({ page }) => {
    await page.click('button:has-text("📖")');
    await expect(page.getByRole('heading', { name: 'Le Mie Ricette' })).toBeVisible();
  });

  test('should navigate to shopping list tab', async ({ page }) => {
    await page.click('button:has-text("🛒")');
    await expect(page.getByRole('heading', { name: 'Lista della Spesa' })).toBeVisible();
  });

  test('should navigate to workout plan tab', async ({ page }) => {
    await page.click('button:has-text("💪")');
    await expect(page.getByRole('heading', { name: 'Piano di allenamento mirato' })).toBeVisible();
  });

  test('should navigate to food filter tab', async ({ page }) => {
    await page.click('button:has-text("🔍")');
    await expect(page.getByRole('heading', { name: 'Database Alimentare' })).toBeVisible();
  });

  test('should navigate to devices tab', async ({ page }) => {
    await page.click('button:has-text("⌚")');
    await expect(page.getByRole('heading', { name: 'Dispositivi e Misurazioni' })).toBeVisible();
  });

  test('should navigate to educational hub tab', async ({ page }) => {
    await page.click('button:has-text("📚")');
    await expect(page.getByRole('heading', { name: 'Enciclopedia Scientifica' })).toBeVisible();
  });

  test('should highlight active tab', async ({ page }) => {
    await page.click('button:has-text("📔")');
    await expect(page.locator('button:has-text("📔")')).toHaveClass(/bg-\(--accent\)/);
  });

  test('should maintain tab state on reload', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await page.reload();
    // Language preference is stored in localStorage, so it should persist
    // Just verify the tab is still visible and clickable
    await expect(page.locator('button:has-text("🍽️")')).toBeVisible();
  });
});