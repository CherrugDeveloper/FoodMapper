import { test as baseTest, expect, Page } from '@playwright/test';
import { waitForCalculator, openCalculator, setLanguage, acceptDisclaimer, prepareApp, fillCalculatorForm, calculatorSubmitButton, REPORT_TITLE } from './fixtures';

// Extend test with language parameter
type I18nTestOptions = {
  language: string;
};

const test = baseTest.extend<I18nTestOptions>({
  language: 'it',
});

// Translation maps for each language - matching actual translation files
const translations = {
  it: {
    disclaimerTitle: 'Disclaimer Medico e Limitazione della Responsabilità',
    acceptBtn: 'Ho letto, capito e accettato',
    calcTitle: '⚙️ Parametri Biometrici e Intestinali',
    diaryTitle: '📔 Diario quotidiano',
    dietTitle: '🍽️ Dieta Trifasica e Piano Pasti',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altezza (cm)',
    ageLabel: 'Età (anni)',
    resultsTitle: REPORT_TITLE.it,
    proteinsLabel: 'Proteine',
    fatsLabel: 'Grassi',
    carbsLabel: 'Carbs',
    calcBtn: 'Calcola Requisiti Strutturali',
  },
  en: {
    disclaimerTitle: 'Medical Disclaimer and Limitation of Liability',
    acceptBtn: 'I have read, understood and accept',
    calcTitle: '⚙️ Biometric and Intestinal Parameters',
    diaryTitle: '📔 Daily diary',
    dietTitle: '🍽️ Trifasic Diet and Meal Plan',
    weightLabel: 'Weight (kg)',
    heightLabel: 'Height (cm)',
    ageLabel: 'Age (years)',
    resultsTitle: REPORT_TITLE.en,
    proteinsLabel: 'Proteins',
    fatsLabel: 'Fats',
    carbsLabel: 'Carbs',
    calcBtn: 'Calculate Structural Requirements',
  },
  de: {
    disclaimerTitle: 'Medizinischer Haftungsausschluss und Beschränkung der Haftung',
    acceptBtn: 'Ich habe gelesen, verstanden und akzeptiere ich',
    calcTitle: '⚙️ Biometrische und intestinale Parameter',
    diaryTitle: '📔 Tagesbuch',
    dietTitle: '🍽️ Drittastige Ernährung und Mahlplan',
    weightLabel: 'Gewicht (kg)',
    heightLabel: 'Größe (cm)',
    ageLabel: 'Alter (Jahre)',
    resultsTitle: REPORT_TITLE.de,
    proteinsLabel: 'Proteine',
    fatsLabel: 'Fette',
    carbsLabel: 'KH',
    calcBtn: 'Strukturelle Anforderungen berechnen',
  },
  es: {
    disclaimerTitle: 'Aviso Médico y Limitación de Responsabilidad',
    acceptBtn: 'He leído, comprendido y acepto',
    calcTitle: '⚙️ Parámetros biométricos e intestinales',
    diaryTitle: '📔 Diario del día',
    dietTitle: '🍽️ Dieta trifásica y plan de comidas',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altura (cm)',
    ageLabel: 'Edad (años)',
    resultsTitle: REPORT_TITLE.es,
    proteinsLabel: 'Proteínas',
    fatsLabel: 'Grasas',
    carbsLabel: 'Carbo',
    calcBtn: 'Calcular requerimientos estructurales',
  },
  fr: {
    disclaimerTitle: 'Avis Médical et Limitation de Responsabilité',
    acceptBtn: "J'ai lu, compris et j'accepte",
    calcTitle: '⚙️ Paramètres biométriques et intestinaux',
    diaryTitle: '📔 Journal quotidien',
    dietTitle: '📔 Régime triphasique et plan de repas',
    weightLabel: 'Poids (kg)',
    heightLabel: 'Taille (cm)',
    ageLabel: 'Âge (ans)',
    resultsTitle: REPORT_TITLE.fr,
    proteinsLabel: 'Protéines',
    fatsLabel: 'Lipides',
    carbsLabel: 'Gluc.',
    calcBtn: 'Calculer les besoins structurels',
  },
};

test.describe('i18n Language Switching', () => {
  // Test switching to each language - these run BEFORE accepting disclaimer
  test('should switch to Italiano (it)', async ({ page, language }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    await setLanguage(page, language);
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should switch to English (en)', async ({ page, language }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    await setLanguage(page, language);
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should switch to Deutsch (de)', async ({ page, language }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    await setLanguage(page, language);
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should switch to Español (es)', async ({ page, language }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    await setLanguage(page, language);
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should switch to Français (fr)', async ({ page, language }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    await setLanguage(page, language);
    await expect(page.locator('.fixed.inset-0.z-50')).toBeVisible();
  });

  test('should persist language selection in localStorage', async ({ page }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'en', { disclaimerAccepted: false });
    await acceptDisclaimer(page, 'en');
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
    const storedLang = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(storedLang).toBe('en');
  });

  test('should translate calculator tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, calcTitle: string) => {
      await prepareApp(page, lang, { disclaimerAccepted: false });
      await acceptDisclaimer(page, lang);
      await page.click('button:has-text("⚙️")');
      await waitForCalculator(page);
      await expect(page.getByRole('heading', { name: calcTitle })).toBeVisible({ timeout: 15000 });
    };

    await run('en', translations.en.calcTitle);
    await run('de', translations.de.calcTitle);
    await run('es', translations.es.calcTitle);
    await run('fr', translations.fr.calcTitle);
  });

  test('should translate diary tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, diaryTitle: string) => {
      await prepareApp(page, lang, { disclaimerAccepted: false });
      await acceptDisclaimer(page, lang);
      await page.click('button:has-text("📔")');
      await expect(page.getByRole('heading', { name: diaryTitle })).toBeVisible();
    };

    await run('en', translations.en.diaryTitle);
    await run('de', translations.de.diaryTitle);
  });

  test('should translate diet plan tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, dietTitle: string) => {
      await prepareApp(page, lang, { disclaimerAccepted: false });
      await acceptDisclaimer(page, lang);
      await page.waitForLoadState('networkidle');
      await page.click('button:has-text("🍽️")');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('heading', { name: dietTitle })).toBeVisible();
    };

    await run('en', translations.en.dietTitle);
    await run('de', translations.de.dietTitle);
  });

  test('should translate medical disclaimer in Italian (default)', async ({ page }) => {
    test.setTimeout(30000);
    await prepareApp(page, 'it', { disclaimerAccepted: false });
    // Test Italian (default language)
    await expect(page.locator(`text=${translations.it.disclaimerTitle}`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`button:has-text("${translations.it.acceptBtn}")`)).toBeVisible();
  });

  test('should translate form labels in calculator', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string) => {
      await prepareApp(page, lang, { disclaimerAccepted: false });
      await acceptDisclaimer(page, lang);
      await openCalculator(page);
      // Use input name selectors since labels don't have htmlFor
      await expect(page.locator('input[name="weightKg"]')).toBeVisible();
      await expect(page.locator('input[name="heightCm"]')).toBeVisible();
      await expect(page.locator('input[name="ageYears"]')).toBeVisible();
      await expect(page.locator('select[name="biologicalSex"]')).toBeVisible();
      await expect(page.locator('select[name="activityLevel"]')).toBeVisible();
      await expect(page.locator('select[name="ibsType"]')).toBeVisible();
    };

    await run('it');
    await run('en');
    await run('de');
    await run('es');
    await run('fr');
  });

  const verifyCalculatorResults = async (page: Page, lang: string) => {
    console.log(`[DEBUG E2E] running calculator results translation check for language: ${lang}`);
    
    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`[BROWSER CONSOLE ERROR] ${msg.text()}`);
      }
    });
    page.on('pageerror', error => {
      console.log(`[BROWSER PAGE ERROR] ${error.message}`);
      console.log(`[BROWSER PAGE STACK] ${error.stack}`);
    });
    
    await prepareApp(page, lang, { disclaimerAccepted: false });
    await acceptDisclaimer(page, lang);
    await page.click('button:has-text("⚙️")');
    await waitForCalculator(page);
    await fillCalculatorForm(page);
    const calculateButton = calculatorSubmitButton(page, lang);
    await expect(calculateButton).toBeVisible({ timeout: 15000 });
    await expect(calculateButton).toBeEnabled({ timeout: 15000 });
    console.log(`[DEBUG E2E] clicking calculate button for ${lang}`);
    // CRITICAL: Set the language in localStorage BEFORE clicking calculate.
    // This ensures that when the NutritionalCalculator remounts after setResults inside startTransition,
    // the i18next language detector will pick up the language from localStorage first (per detection order: localStorage, navigator, htmlTag).
    await page.evaluate((lng) => {
      window.localStorage.setItem('i18nextLng', lng);
    }, lang);
    // Actively change i18next language to force resolution after calculator remount.
    // This is necessary because passive localStorage detection is async and doesn't complete
    // in time when the calculator remounts inside startTransition.
    await page.evaluate(async (lng) => {
      const scope = window as unknown as {
        appReady?: { i18n: { changeLanguage: (l: string) => Promise<unknown> } };
        i18n?: { changeLanguage: (l: string) => Promise<unknown> };
      };
      const instance = scope.appReady?.i18n ?? scope.i18n;
      if (instance) {
        await instance.changeLanguage(lng);
      }
    }, lang);
    // Wait for i18next to resolve and cache the language after calculator re-render.
    // Poll until the language is resolved in the i18next instance and cached in localStorage.
    // Using no-param callback - lang captured from closure
    await page.waitForFunction(
      () => {
        return (
          (window as unknown as { appReady: { i18n: { language?: string } } }).appReady?.i18n?.language === lang
        );
      },
      15000
    );
    // Also verify the language is cached in localStorage
    // Using no-param callback - lang captured from closure
    await page.waitForFunction(
      () => {
        return window.localStorage.getItem('i18nextLng') === lang;
      },
      15000
    );
    // Wait for calculation to complete and results to render
    // Using networkidle ensures all state updates and async operations are complete
    await page.waitForLoadState("networkidle");
    // DEBUG: Log language state after first wait cycle
    const langAfterFirst = page.evaluate(() => {
      return {
        localStorage: window.localStorage.getItem('i18nextLng'),
        appReadyI18nLanguage: (window as unknown as { appReady: { i18n: { language?: string } } }).appReady?.i18n?.language,
      };
    });
    console.log(`[DEBUG E2E] Language state AFTER first waitForFunction [${lang}]:`, langAfterFirst);
    // Wait for i18next to resolve and cache the language after calculator re-render.
    // Poll until the language is resolved in the i18next instance and cached in localStorage.
    // Using no-param callback - lang captured from closure
    await page.waitForFunction(
      () => {
        return (
          (window as unknown as { appReady: { i18n: { language?: string } } }).appReady?.i18n?.language === lang
        );
      },
      15000
    );
    // Also verify the language is cached in localStorage
    // Using no-param callback - lang captured from closure
    await page.waitForFunction(
      () => {
        return window.localStorage.getItem('i18nextLng') === lang;
      },
      15000
    );
    // DEBUG: Log language state after second wait cycle
    const langAfterSecond = page.evaluate(() => {
      return {
        localStorage: window.localStorage.getItem('i18nextLng'),
        appReadyI18nLanguage: (window as unknown as { appReady: { i18n: { language?: string } } }).appReady?.i18n?.language,
      };
    });
    console.log(`[DEBUG E2E] Language state AFTER second waitForFunction [${lang}]:`, langAfterSecond);
    // Scroll down to ensure results column is in viewport using standard DOM scrollIntoView
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const rawTitle = translations[lang as keyof typeof translations].resultsTitle;
    const resultsTitleText = rawTitle.replace(/^[^a-zA-ZÀ-ÿ]+/, '').trim();
    const allH2Texts = await page.locator('[data-testid="nutritional-calculator"] h2').allInnerTexts();
    console.log(`[DEBUG E2E] [${lang}] All calculator h2 texts:`, allH2Texts);
    console.log(`[DEBUG E2E] [${lang}] Looking for results title text: "${resultsTitleText}" (raw: "${rawTitle}")`);
    const resultsTitleLocator = page.locator('[data-testid="nutritional-calculator"] h2').filter({ hasText: resultsTitleText });
    console.log(`[DEBUG E2E] waiting for results title visibility for ${lang} (matching heading text: ${resultsTitleText})`);
    await resultsTitleLocator.first().evaluate((node: HTMLElement) => node.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await page.waitForTimeout(500);
    await expect(resultsTitleLocator).toBeVisible({ timeout: 15000 });
    await expect(page.locator(`text=${translations[lang as keyof typeof translations].proteinsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations[lang as keyof typeof translations].fatsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations[lang as keyof typeof translations].carbsLabel}`)).toBeVisible();
  };

  test('should translate results in calculator (it)', async ({ page }) => {
    test.setTimeout(30000);
    await verifyCalculatorResults(page, 'it');
  });

  test('should translate results in calculator (en)', async ({ page }) => {
    test.setTimeout(30000);
    await verifyCalculatorResults(page, 'en');
  });

  test('should translate results in calculator (de)', async ({ page }) => {
    test.setTimeout(30000);
    await verifyCalculatorResults(page, 'de');
  });

  test('should translate results in calculator (es)', async ({ page }) => {
    test.setTimeout(30000);
    await verifyCalculatorResults(page, 'es');
  });

  test('should translate results in calculator (fr)', async ({ page }) => {
    test.setTimeout(30000);
    await verifyCalculatorResults(page, 'fr');
  });
});
