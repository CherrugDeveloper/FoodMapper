import { test, expect } from '@playwright/test';
import {
  acceptDisclaimer,
  calculatorSubmitButton,
  fillCalculatorForm,
  openCalculator,
  prepareApp,
} from './fixtures';

/**
 * Regression test derived from the former `debug_calc` script.
 *
 * The original spec only `console.log`-ed the buttons it could find, so it never
 * failed: it "passed" while timing out on the non-existent
 * `getByLabel('Language selector')` control. It now asserts the exact thing it
 * was trying to diagnose — that the German calculator renders the German
 * `calc_btn` label as the unique submit button of its form.
 */
test('german calculator renders the localized submit button', async ({ page }) => {
  await prepareApp(page, 'de', { disclaimerAccepted: false });
  await acceptDisclaimer(page, 'de');
  await openCalculator(page);

  await fillCalculatorForm(page);

  const submit = calculatorSubmitButton(page, 'de');
  await expect(submit).toBeVisible({ timeout: 20000 });
  await expect(submit).toHaveCount(1);
  await expect(submit).toHaveAttribute('type', 'submit');
  await expect(submit).toHaveText('Strukturellen Bedarf berechnen');

  // The English label must NOT leak into a German session: this is exactly the
  // bug the debug script was written to find.
  await expect(
    page.locator('button', { hasText: 'Calculate Structural Requirements' })
  ).toHaveCount(0);
});
