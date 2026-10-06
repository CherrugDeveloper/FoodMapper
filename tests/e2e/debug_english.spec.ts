import { test, expect } from '@playwright/test';
import {
  acceptDisclaimer,
  calculatorSubmitButton,
  fillCalculatorForm,
  openCalculator,
  prepareApp,
} from './fixtures';

/**
 * Regression test derived from the former `debug_english` script.
 *
 * The original spec only logged button texts/counts and used the ambiguous
 * `.fixed.inset-0.z-50 button` click, so it never asserted anything meaningful.
 * It now asserts the English calculator submit button, which is the behaviour
 * the debug script was investigating.
 */
test('english calculator renders the localized submit button', async ({ page }) => {
  await prepareApp(page, 'en', { disclaimerAccepted: false });
  await acceptDisclaimer(page, 'en');
  await openCalculator(page);

  await fillCalculatorForm(page);

  const submit = calculatorSubmitButton(page, 'en');
  await expect(submit).toBeVisible({ timeout: 20000 });
  await expect(submit).toHaveCount(1);
  await expect(submit).toHaveText('Calculate Structural Requirements');

  await expect(
    page.locator('button', { hasText: 'Strukturellen Bedarf berechnen' })
  ).toHaveCount(0);
});