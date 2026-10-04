import { test, expect } from '@playwright/test';
import { disclaimerModal, waitForAppReady } from './fixtures';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Init scripts run before every navigation, including reloads. Only reset
      // the independent test context once so acceptance can persist in tests.
      if (!sessionStorage.getItem('e2e_auth_initialized')) {
        localStorage.removeItem('ibs_disclaimer_accepted');
        localStorage.setItem('i18nextLng', 'it');
        sessionStorage.setItem('e2e_auth_initialized', 'true');
      }
    });
    await page.goto('/');
    await waitForAppReady(page);
    await disclaimerModal(page).getByLabel('Language selector').selectOption('it');
  });

  test('should show medical disclaimer on first visit', async ({ page }) => {
    await expect(disclaimerModal(page)).toBeVisible();
    await expect(disclaimerModal(page).getByRole('heading', { name: /Avviso Medico/ })).toBeVisible();
    await expect(disclaimerModal(page).getByRole('button', { name: 'Ho letto, compreso e accetto' })).toBeVisible();
  });

  test('should unlock app after accepting disclaimer', async ({ page }) => {
    await disclaimerModal(page).getByRole('button', { name: 'Ho letto, compreso e accetto' }).click();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️")')).toBeVisible();
  });

  test('should persist acceptance in localStorage', async ({ page }) => {
    await disclaimerModal(page).getByRole('button', { name: 'Ho letto, compreso e accetto' }).click();
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await expect.poll(() => page.evaluate(() => localStorage.getItem('ibs_disclaimer_accepted'))).toBe('true');
    await page.reload();
    await waitForAppReady(page);
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await expect(disclaimerModal(page)).not.toBeVisible();
  });

  test('should clear acceptance when localStorage is cleared', async ({ page }) => {
    await disclaimerModal(page).getByRole('button', { name: 'Ho letto, compreso e accetto' }).click();
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await page.evaluate(() => localStorage.removeItem('ibs_disclaimer_accepted'));
    await page.reload();
    await waitForAppReady(page);
    await expect(disclaimerModal(page)).toBeVisible();
    await expect(disclaimerModal(page).getByRole('heading', { name: /Avviso Medico/ })).toBeVisible();
  });
});