import { test, expect } from '@playwright/test';
import {
  calculatorSubmitButton,
  getCurrentLanguage,
  openCalculator,
  prepareApp,
  setLanguage,
} from './fixtures';

/**
 * Regression tests derived from the former `debug_lang` script.
 *
 * The original spec listed `<option>` elements of a `getByLabel('Language selector')`
 * control that does not exist in the app, then only `console.log`-ed the result —
 * so it never asserted anything and timed out instead. The app has no language
 * selector UI: the language is resolved by i18next-browser-languagedetector from
 * `localStorage.i18nextLng`. These tests assert that mechanism actually works.
 */

/** Seeding `i18nextLng` produces a German session with the app already unlocked. */
test('seeding i18nextLng yields a german session', async ({ page }) => {
  await prepareApp(page, 'de');

  await expect.poll(() => getCurrentLanguage(page), { timeout: 15000 }).toBe('de');
  await expect(page.locator('nav')).toBeVisible({ timeout: 20000 });
});

/**
 * The language must survive a full reload — the exact behaviour the original
 * script probed via `localStorage.setItem` + `page.reload()` — and the German
 * calculator must still be German afterwards.
 */
test('language persists across reload and applies to the calculator', async ({ page }) => {
  await prepareApp(page, 'de');
  await page.reload();

  await expect.poll(() => getCurrentLanguage(page), { timeout: 15000 }).toBe('de');

  await openCalculator(page);
  await expect(calculatorSubmitButton(page, 'de')).toBeVisible({ timeout: 20000 });
});

/**
 * `changeLanguage` must be reachable from a test, because it is the only
 * supported way to drive a language change (no selector control exists).
 */
test('language can be switched at runtime', async ({ page }) => {
  await prepareApp(page, 'it');

  await openCalculator(page);
  await expect(calculatorSubmitButton(page, 'it')).toBeVisible({ timeout: 20000 });

  await setLanguage(page, 'de');

  await expect(calculatorSubmitButton(page, 'de')).toBeVisible({ timeout: 20000 });
  await expect(calculatorSubmitButton(page, 'it')).toHaveCount(0);
});