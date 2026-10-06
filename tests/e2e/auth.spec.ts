import { test, expect } from '@playwright/test';
import {
  DISCLAIMER_STORAGE_KEY,
  acceptDisclaimer,
  disclaimerAcceptButton,
  disclaimerModal,
  seedDisclaimer,
  seedLanguage,
  waitForAppReady,
} from './fixtures';

const ACCEPT_IT = 'Ho letto, compreso e accetto';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Language and disclaimer state are seeded through init scripts so they are
    // in place *before* the first document script runs. The previous
    // `goto -> evaluate -> selectOption` sequence raced against `main.tsx`,
    // which resolves i18next synchronously at startup, and relied on a
    // `getByLabel('Language selector')` control that does not exist in the UI.
    await seedLanguage(page, 'it');
    // `seedDisclaimer` is internally latched to fire once per browser context,
    // so the gate is reset exactly once per test and the acceptance written by
    // `acceptDisclaimer` survives the `page.reload()` calls inside these tests.
    await seedDisclaimer(page, false);
    await page.goto('/');
    await waitForAppReady(page);
  });

  test('should show medical disclaimer on first visit', async ({ page }) => {
    await expect(disclaimerModal(page)).toBeVisible();
    await expect(disclaimerModal(page).getByRole('heading', { name: /Avviso Medico/ })).toBeVisible();
    await expect(disclaimerModal(page).getByRole('button', { name: ACCEPT_IT })).toBeVisible();
  });

  test('should unlock app after accepting disclaimer', async ({ page }) => {
    await acceptDisclaimer(page, 'it');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('button:has-text("⚙️")')).toBeVisible();
  });

  test('should persist acceptance in localStorage', async ({ page }) => {
    await acceptDisclaimer(page, 'it');
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await expect
      .poll(() => page.evaluate((key) => localStorage.getItem(key), DISCLAIMER_STORAGE_KEY), {
        timeout: 15000,
      })
      .toBe('true');
    await page.reload();
    await waitForAppReady(page);
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await expect(disclaimerModal(page)).toHaveCount(0);
  });

  test('should clear acceptance when localStorage is cleared', async ({ page }) => {
    await acceptDisclaimer(page, 'it');
    await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    await page.evaluate((key) => localStorage.removeItem(key), DISCLAIMER_STORAGE_KEY);
    await page.reload();
    await waitForAppReady(page);
    await expect(disclaimerModal(page)).toBeVisible();
    await expect(disclaimerModal(page).getByRole('heading', { name: /Avviso Medico/ })).toBeVisible();
    // The button must be reachable through the dialog-scoped locator used by
    // the helper, which is the regression guard for the old ambiguous
    // `.fixed.inset-0.z-50 button` click.
    await expect(disclaimerAcceptButton(page, 'it')).toBeVisible();
  });
});