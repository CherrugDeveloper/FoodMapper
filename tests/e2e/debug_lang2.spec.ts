import { test, expect } from '@playwright/test';
import {
  acceptDisclaimer,
  calculatorSubmitButton,
  openCalculator,
  prepareApp,
} from './fixtures';

/**
 * Regression test derived from the former `debug_lang2` script.
 *
 * The original spec set the language, tried the non-existent language selector,
 * then clicked `.fixed.inset-0.z-50 button` — a selector shared by 9 different
 * components (toasts, info popups, performance modal, ...), so it was ambiguous.
 * The dialog-scoped, localized accept button replaces it.
 */
test('disclaimer can be accepted in the seeded language and unlocks the german calculator', async ({
  page,
}) => {
  await prepareApp(page, 'de', { disclaimerAccepted: false });
  await acceptDisclaimer(page, 'de');

  await openCalculator(page);

  const submit = calculatorSubmitButton(page, 'de');
  await expect(submit).toBeVisible({ timeout: 20000 });
  await expect(submit).toHaveText('Strukturellen Bedarf berechnen');
});