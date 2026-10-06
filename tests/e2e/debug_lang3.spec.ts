import { test, expect } from '@playwright/test';
import {
  calculatorSubmitButton,
  getCurrentLanguage,
  openCalculator,
  prepareApp,
  setLanguage,
} from './fixtures';

/**
 * Regression test derived from the former `debug_lang3` script.
 *
 * The original spec called `window.i18n.changeLanguage('de')` — the one
 * genuinely supported way to change the language — but then chained a
 * `getByLabel('Language selector')` lookup and an ambiguous
 * `.fixed.inset-0.z-50 button` click, which timed out before the behaviour under
 * test could ever be observed. This asserts the runtime language switch directly.
 */
test('runtime language change relabels the calculator', async ({ page }) => {
  await prepareApp(page, 'it');
  await openCalculator(page);

  // Baseline: Italian session.
  await expect(calculatorSubmitButton(page, 'it')).toBeVisible({ timeout: 20000 });

  await setLanguage(page, 'de');

  await expect.poll(() => getCurrentLanguage(page), { timeout: 15000 }).toBe('de');
  await expect(calculatorSubmitButton(page, 'de')).toBeVisible({ timeout: 20000 });
  await expect(calculatorSubmitButton(page, 'it')).toHaveCount(0);
});