import { expect, Page } from '@playwright/test';

export const DISCLAIMER_STORAGE_KEY = 'ibs_disclaimer_accepted';

export async function prepareApp(page: Page, language = 'it'): Promise<void> {
  await page.addInitScript(({ disclaimerKey, selectedLanguage }) => {
    localStorage.setItem(disclaimerKey, 'true');
    localStorage.setItem('i18nextLng', selectedLanguage);
  }, { disclaimerKey: DISCLAIMER_STORAGE_KEY, selectedLanguage: language });

  await page.goto('/');
  await waitForAppReady(page);
  await expect(page.locator('header')).toBeVisible();
}

/**
 * Waits for the app's i18n system to be fully initialised.
 * This is signalled by `document.documentElement.dataset.i18nReady === 'true'`
 * which is set in src/main.tsx after i18next resolves.
 *
 * NOTE: does NOT wait for any lazy-loaded route component (e.g. NutritionalCalculator)
 * because those are only mounted after disclaimer acceptance AND tab navigation.
 * Use `waitForCalculator` for tests that interact with the calculator.
 */
export async function waitForAppReady(page: Page): Promise<void> {
  await page.waitForFunction(
    () => document.documentElement.dataset.i18nReady === 'true',
    { timeout: 15000 }
  );
}

/**
 * Waits for the NutritionalCalculator lazy component to be present in the DOM.
 * Call this after accepting the disclaimer and navigating to the ⚙️ Calculator tab.
 */
export async function waitForCalculator(page: Page): Promise<void> {
  await page.locator('[data-testid="nutritional-calculator"]').waitFor({ state: 'visible', timeout: 15000 });
}

/** Alias kept for back-compat with existing tests. */
export async function waitForI18n(page: Page): Promise<void> {
  await waitForAppReady(page);
}

export function disclaimerModal(page: Page) {
  return page.getByRole('dialog');
}
