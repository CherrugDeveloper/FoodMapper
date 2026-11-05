import { test, expect } from '@playwright/test';
import {
  calculatorSubmitButton,
  openCalculator,
  prepareApp,
  setLanguage,
  CALC_BTN_LABEL,
} from './fixtures';

/**
 * Regression test derived from the former `debug_lang4` script.
 *
 * The original spec pre-accepted the disclaimer in `localStorage`, clicked the
 * ambiguous `.fixed.inset-0.z-50 button`, and then tried to switch language
 * through the non-existent `getByLabel('Language selector')` before dumping
 * button inventories to the console. Nothing was asserted, so it never caught
 * the regression it was written for. This compares the calculator's submit
 * button before and after a runtime language switch.
 */
test('calculator submit button relabels after a language switch', async ({ page }) => {
  await prepareApp(page, 'de');
  await openCalculator(page);

  await expect(calculatorSubmitButton(page, 'de')).toHaveText(CALC_BTN_LABEL.de);

  await setLanguage(page, 'en');

  await expect(calculatorSubmitButton(page, 'en')).toHaveText(
    CALC_BTN_LABEL.en
  );
  await expect(calculatorSubmitButton(page, 'de')).toHaveCount(0);
});
