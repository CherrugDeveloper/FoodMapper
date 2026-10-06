import { expect, Locator, Page } from '@playwright/test';

/** localStorage key that gates the app behind the medical disclaimer. */
export const DISCLAIMER_STORAGE_KEY = 'ibs_disclaimer_accepted';

/** localStorage key managed by i18next-browser-languagedetector. */
export const LANGUAGE_STORAGE_KEY = 'i18nextLng';

/**
 * `sessionStorage` latch that makes the disclaimer seed init script fire exactly
 * once per browser context instead of on every navigation. See `seedDisclaimer`.
 */
export const DISCLAIMER_SEED_LATCH = 'e2e_disclaimer_seeded';

export type SupportedLanguage = 'it' | 'en' | 'de' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['it', 'en', 'de', 'es', 'fr'];

/**
 * Verbatim `disclaimer.accept` strings from public/locales/*\/translation.json.
 * Used to build a dialog-scoped, unambiguous accept-button locator.
 */
export const ACCEPT_LABEL: Record<SupportedLanguage, string> = {
  it: 'Ho letto, compreso e accetto',
  en: 'I have read, understood and accept',
  de: 'Ich habe gelesen, verstanden und akzeptiere',
  es: 'He leído, comprendido y acepto',
  fr: "J'ai lu, compris et j'accepte",
};

/**
 * Verbatim `disclaimer.title` strings (used by tests that assert the heading).
 *
 * These MUST stay byte-identical to `public/locales/*\/translation.json`.
 * Earlier values were invented paraphrases ("Important Disclaimer" for `en`)
 * and never matched the rendered heading, so any assertion built on them
 * would have failed for a reason unrelated to the behaviour under test.
 */
export const DISCLAIMER_TITLE: Record<SupportedLanguage, string> = {
  it: 'Avviso Medico e Limitazione di Responsabilità',
  en: 'Medical Disclaimer and Limitation of Liability',
  de: 'Medizinischer Hinweis und Haftungsausschluss',
  es: 'Aviso Médico y Limitación de Responsabilidad',
  fr: 'Avis Médical et Limitation de Responsabilité',
};

/** Verbatim `calc_btn` strings (submit button of NutritionalCalculator). */
export const CALC_BTN_LABEL: Record<SupportedLanguage, string> = {
  it: 'Calcola Fabbisogno Strutturale',
  en: 'Calculate Structural Requirements',
  de: 'Strukturellen Bedarf berechnen',
  es: 'Calcular requerimientos estructurales',
  fr: 'Calculer les besoins structurels',
};

/** Verbatim `report_title` strings (results column heading). */
export const REPORT_TITLE: Record<SupportedLanguage, string> = {
  it: '📊 Report fabbisogno',
  en: '📊 Requirements report',
  de: '📊 Bedarfsbericht',
  es: '📊 Informe de requerimientos',
  fr: '📊 Rapport de besoins',
};

function normalizeLanguage(language?: string): SupportedLanguage {
  const short = (language ?? 'it').slice(0, 2).toLowerCase();
  return (SUPPORTED_LANGUAGES as string[]).includes(short)
    ? (short as SupportedLanguage)
    : 'it';
}

/* -------------------------------------------------------------------------- */
/* Seeding (runs before the first document script executes)                     */
/* -------------------------------------------------------------------------- */

/**
 * Seeds `localStorage.i18nextLng` through an init script so the very first
 * render already uses the requested language.
 *
 * This replaces the previous `page.evaluate(...)` + `page.reload()` dance,
 * which raced against `main.tsx` (i18next had already resolved the language
 * from the detector before the evaluate ran, so the app kept the old language)
 * and required a full reload to take effect.
 */
export async function seedLanguage(page: Page, language: string): Promise<void> {
  await page.addInitScript(
    ({ key, value }) => {
      window.localStorage.setItem(key, value);
    },
    { key: LANGUAGE_STORAGE_KEY, value: normalizeLanguage(language) }
  );
}

/**
 * Seeds the disclaimer gate. Pass `false` to force the modal to appear on the
 * first visit (default behaviour of a fresh browser profile).
 *
 * CRITICAL: the init script is armed with a `sessionStorage` latch so it fires
 * **once per browser context**, not once per navigation.
 *
 * `page.addInitScript` re-runs on *every* document load. Without the latch,
 * `seedDisclaimer(page, false)` deleted `ibs_disclaimer_accepted` again on the
 * `page.goto('/calc')` performed by `openCalculator()`, re-opening the modal
 * right after `acceptDisclaimer()` had persisted acceptance — so the lazy
 * `[data-testid="nutritional-calculator"]` chunk never mounted and
 * `waitForCalculator` timed out for a reason that had nothing to do with i18n.
 *
 * `sessionStorage` survives same-tab navigations and is scoped to the
 * Playwright `BrowserContext`, so each test still starts from a clean latch.
 */
export async function seedDisclaimer(page: Page, accepted = true): Promise<void> {
  await page.addInitScript(
    ({ key, value, latch }) => {
      if (window.sessionStorage.getItem(latch)) return;
      window.sessionStorage.setItem(latch, 'true');
      if (value) {
        window.localStorage.setItem(key, 'true');
      } else {
        window.localStorage.removeItem(key);
      }
    },
    { key: DISCLAIMER_STORAGE_KEY, value: accepted, latch: DISCLAIMER_SEED_LATCH }
  );
}

/* -------------------------------------------------------------------------- */
/* Readiness waits                                                            */
/* -------------------------------------------------------------------------- */

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
    { timeout: 20000 }
  );
}

/**
 * Waits for the NutritionalCalculator lazy component to be present in the DOM.
 * Call this after accepting the disclaimer and navigating to the ⚙️ Calculator tab.
 */
export async function waitForCalculator(page: Page): Promise<void> {
  await page
    .locator('[data-testid="nutritional-calculator"]')
    .waitFor({ state: 'visible', timeout: 20000 });
}

/** Alias kept for back-compat with existing tests. */
export async function waitForI18n(page: Page): Promise<void> {
  await waitForAppReady(page);
}

/* -------------------------------------------------------------------------- */
/* Locators (dialog-scoped to avoid strict-mode / ambiguity failures)           */
/* -------------------------------------------------------------------------- */

export function disclaimerModal(page: Page): Locator {
  return page.getByRole('dialog');
}

/**
 * Dialog-scoped accept button.
 *
 * `.fixed.inset-0.z-50` is shared by 9 different components (toasts, info
 * popups, performance modal, ...), so `page.click('.fixed.inset-0.z-50 button')`
 * resolved to multiple/none elements and timed out. Scoping to
 * `[role="dialog"]` + the localized accessible name is unique and stable.
 */
export function disclaimerAcceptButton(
  page: Page,
  language?: string
): Locator {
  return disclaimerModal(page).getByRole('button', {
    name: ACCEPT_LABEL[normalizeLanguage(language)],
    exact: true,
  });
}

/** Submit button of the nutritional calculator, scoped to the calculator root. */
export function calculatorSubmitButton(page: Page, language?: string): Locator {
  return page
    .locator('[data-testid="nutritional-calculator"] form')
    .getByRole('button', {
      name: CALC_BTN_LABEL[normalizeLanguage(language)],
      exact: true,
    });
}

/* -------------------------------------------------------------------------- */
/* Runtime language switching                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Changes the language at runtime through the i18next instance exposed by
 * `src/main.tsx` (`window.appReady.i18n`, with `window.i18n` as fallback).
 *
 * The app has **no** language selector control: `getByLabel('Language selector')`
 * never matched anything (0 elements) which is what caused every
 * `TimeoutError: locator.selectOption` in the debug specs. This helper is the
 * supported way to drive language changes.
 *
 * NOTE: `document.documentElement.lang` is NOT used as a signal here. i18next is
 * configured without an `htmlTag` attribute setter, so `<html lang>` stays at the
 * static `lang="it"` from index.html and never reflects the active language.
 */
export async function setLanguage(page: Page, language: string): Promise<void> {
  const target = normalizeLanguage(language);
  await waitForAppReady(page);

  await page.evaluate(async (lng) => {
    const scope = window as unknown as {
      appReady?: { i18n: { changeLanguage: (l: string) => Promise<unknown> } };
      i18n?: { changeLanguage: (l: string) => Promise<unknown> };
    };
    const instance = scope.appReady?.i18n ?? scope.i18n;
    if (!instance) throw new Error('i18next instance is not exposed on window');
    await instance.changeLanguage(lng);
    // The detector caches to localStorage asynchronously; set it eagerly so the
    // value is deterministic even when detection order prefers `navigator`.
    window.localStorage.setItem('i18nextLng', lng);
  }, target);

  // i18next emits `languageChanged` asynchronously; poll the resolved language
  // and the cache key instead of relying on a DOM attribute that never changes.
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { appReady?: { i18n: { language?: string } } }).appReady?.i18n?.language ?? null), {
      timeout: 15000,
    })
    .toBe(target);

  await expect
    .poll(
      () => page.evaluate((key) => window.localStorage.getItem(key), LANGUAGE_STORAGE_KEY),
      { timeout: 15000 }
    )
    .toBe(target);
}

/** Reads the language i18next currently resolved. */
export async function getCurrentLanguage(page: Page): Promise<string> {
  return page.evaluate(
    () => (window as unknown as { appReady?: { i18n?: { language?: string } } }).appReady?.i18n?.language ?? 'unknown'
  );
}

/* -------------------------------------------------------------------------- */
/* Composite flows (each step explicitly awaited)                               */
/* -------------------------------------------------------------------------- */

/**
 * Seeds language + disclaimer, navigates to `/` and waits for readiness.
 * Use this instead of `goto` + `evaluate` + `reload`.
 */
export async function prepareApp(
  page: Page,
  language = 'it',
  { disclaimerAccepted = true }: { disclaimerAccepted?: boolean } = {}
): Promise<void> {
  await seedLanguage(page, language);
  await seedDisclaimer(page, disclaimerAccepted);
  await page.goto('/');
  await waitForAppReady(page);

  if (disclaimerAccepted) {
    // The app shell (header) is rendered by AppContent only once unlocked.
    await expect(page.locator('header')).toBeVisible({ timeout: 20000 });
  }
}

/**
 * Waits for the disclaimer dialog, clicks the localized accept button and waits
 * for the app shell (header + nav) to unlock. Retries on transient failures
 * such as the modal being re-rendered mid-click.
 */
export async function acceptDisclaimer(page: Page, language?: string): Promise<void> {
  const dialog = disclaimerModal(page);
  // `role="dialog"` is only rendered once i18next has initialised (MedicalDisclaimer
  // renders a spinner-only overlay while `!i18n.isInitialized`), hence the explicit wait.
  await dialog.waitFor({ state: 'visible', timeout: 20000 });

  const button = disclaimerAcceptButton(page, language);
  await button.waitFor({ state: 'visible', timeout: 20000 });

  await withRetry(
    async () => {
      await button.click({ timeout: 10000 });
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('nav')).toBeVisible({ timeout: 15000 });
    },
    { attempts: 3, delayMs: 300 }
  );

  await expect(disclaimerModal(page)).toHaveCount(0, { timeout: 15000 });
  await expect
    .poll(() => page.evaluate((key) => window.localStorage.getItem(key), DISCLAIMER_STORAGE_KEY), {
      timeout: 15000,
    })
    .toBe('true');
}

/**
 * Navigates to the calculator route and waits for the lazy chunk to render.
 */
export async function openCalculator(page: Page): Promise<void> {
  await page.goto('/calc');
  await waitForCalculator(page);
}

export interface CalculatorFormValues {
  weightKg?: string | number;
  heightCm?: string | number;
  ageYears?: string | number;
  biologicalSex?: 'male' | 'female';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  ibsType?: 'unknown' | 'IBS-D' | 'IBS-C' | 'IBS-M';
}

const DEFAULT_FORM_VALUES: Required<
  Pick<
    CalculatorFormValues,
    'weightKg' | 'heightCm' | 'ageYears' | 'biologicalSex' | 'activityLevel' | 'ibsType'
  >
> = {
  weightKg: '70',
  heightCm: '175',
  ageYears: '30',
  biologicalSex: 'male',
  activityLevel: 'moderately_active',
  ibsType: 'unknown',
};

/**
 * Fills the calculator form, awaiting each field before interacting so the
 * auto-saved draft re-render (`foodmapper_calculator_draft`) cannot detach a
 * locator mid-action.
 */
export async function fillCalculatorForm(
  page: Page,
  values: CalculatorFormValues = {}
): Promise<void> {
  const data = { ...DEFAULT_FORM_VALUES, ...values };

  const weight = page.locator('input[name="weightKg"]');
  const height = page.locator('input[name="heightCm"]');
  const age = page.locator('input[name="ageYears"]');
  const sex = page.locator('select[name="biologicalSex"]');
  const activity = page.locator('select[name="activityLevel"]');
  const ibs = page.locator('select[name="ibsType"]');

  await weight.waitFor({ state: 'visible', timeout: 20000 });
  await weight.fill(String(data.weightKg));
  await expect(weight).toHaveValue(String(data.weightKg));

  await height.fill(String(data.heightCm));
  await expect(height).toHaveValue(String(data.heightCm));

  await age.fill(String(data.ageYears));
  await expect(age).toHaveValue(String(data.ageYears));

  await sex.selectOption(data.biologicalSex);
  await expect(sex).toHaveValue(data.biologicalSex);

  await activity.selectOption(data.activityLevel);
  await expect(activity).toHaveValue(data.activityLevel);

  await ibs.selectOption(data.ibsType);
  await expect(ibs).toHaveValue(data.ibsType);
}

/* -------------------------------------------------------------------------- */
/* Retry helper                                                               */
/* -------------------------------------------------------------------------- */

export interface RetryOptions {
  /** Total number of attempts (>= 1). Default 3. */
  attempts?: number;
  /** Delay between attempts in ms. Default 250. */
  delayMs?: number;
  /** Abort retrying early when this returns false. */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Retries transient Playwright failures (element detached, strict-mode
 * violations caused by a re-render, navigation races) without swallowing the
 * final error: the last failure is always re-thrown.
 *
 * Timeouts produced by genuinely missing elements are retried too (bounded by
 * `attempts`), so a missing selector still fails the test — just later and
 * with a clearer stack.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  { attempts = 3, delayMs = 250, shouldRetry = () => true }: RetryOptions = {}
): Promise<T> {
  const total = Math.max(1, attempts);
  let lastError: unknown;

  for (let attempt = 1; attempt <= total; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === total || !shouldRetry(error)) break;
      await sleepBetweenAttempts(delayMs);
    }
  }

  throw lastError;
}

/** Sleeps `delayMs` plus up to 50% jitter so parallel retries don't resynchronise. */
function sleepBetweenAttempts(delayMs: number): Promise<void> {
  const jitter = Math.floor(delayMs / 2);
  return new Promise((resolve) =>
    setTimeout(resolve, delayMs + Math.floor(Math.random() * (jitter + 1)))
  );
}
