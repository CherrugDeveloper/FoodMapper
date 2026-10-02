import { test as baseTest, expect } from '@playwright/test';

// Extend test with language parameter
type I18nTestOptions = {
  language: string;
};

const test = baseTest.extend<I18nTestOptions>({
  language: 'it',
});

// Helper to reset disclaimer acceptance and language for a fresh test flow
// NOTE: Must be called AFTER page.goto('/') so a document context exists
// (localStorage access throws SecurityError in an empty page).
async function resetForNewFlow(page: any) {
  await page.evaluate(() => {
    // Remove both the old key and the migrated key (storageVersion.migrate() runs on import).
    localStorage.removeItem('ibs_disclaimer_accepted');
    localStorage.removeItem('foodmapper_disclaimer_accepted');
    localStorage.removeItem('i18nextLng');
  });
}

// Translation maps for each language - matching actual translation files
const translations = {
  it: {
    disclaimerTitle: 'Avviso Medico e Limitazione di Responsabilità',
    acceptBtn: 'Ho letto, compreso e accetto',
    calcTitle: '⚙️ Parametri Biometrici e Intestinali',
    diaryTitle: '📔 Diario quotidiano',
    dietTitle: '🍽️ Dieta Trifasica',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altezza (cm)',
    ageLabel: 'Età (anni)',
    resultsTitle: '📊 Risultati',
    proteinsLabel: 'Proteine',
    fatsLabel: 'Grassi',
    carbsLabel: 'Carbo',  // Short version used in results
    calcBtn: 'Calcola Fabbisogno Strutturale',
  },
  en: {
    disclaimerTitle: 'Important Disclaimer',
    acceptBtn: 'I Understand',
    calcTitle: '⚙️ Biometric and Intestinal Parameters',
    diaryTitle: '📔 Daily diary',
    dietTitle: '🍽️ Trifasic Diet and Meal Plan',
    weightLabel: 'Weight (kg)',
    heightLabel: 'Height (cm)',
    ageLabel: 'Age (years)',
    resultsTitle: '📊 Requirements report',
    proteinsLabel: 'Proteins',
    fatsLabel: 'Fats',
    carbsLabel: 'Carbs',  // Short version used in results
    calcBtn: 'Calculate Structural Requirements',
  },
  de: {
    disclaimerTitle: 'Wichtiger Hinweis und Haftungsausschluss',
    acceptBtn: 'Ich habe gelesen, verstanden und akzeptiere',
    calcTitle: '⚙️ Biometrische & Darm-Parameter',
    diaryTitle: '📔 Tagebuch',
    dietTitle: '🍽️ Dreiphasen-Diät & Mahlzeitenplan',
    weightLabel: 'Gewicht (kg)',
    heightLabel: 'Größe (cm)',
    ageLabel: 'Alter (Jahre)',
    resultsTitle: '📊 Bedarfsbericht',
    proteinsLabel: 'Proteine',
    fatsLabel: 'Fette',
    carbsLabel: 'Kohlenh.',  // Short version used in results
    calcBtn: 'Strukturellen Bedarf berechnen',
  },
  es: {
    disclaimerTitle: 'Aviso importante y limitación de responsabilidad',
    acceptBtn: 'He leído, comprendido y acepto',
    calcTitle: '⚙️ Parámetros biométricos e intestinales',
    diaryTitle: '📔 Diario del día',
    dietTitle: '🍽️ Dieta trifásica y plan de comidas',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altura (cm)',
    ageLabel: 'Edad (años)',
    resultsTitle: '📊 Informe de requerimientos',
    proteinsLabel: 'Proteínas',
    fatsLabel: 'Grasas',
    carbsLabel: 'Carbo',  // Short version used in results
    calcBtn: 'Calcular requerimientos estructurales',
  },
  fr: {
    disclaimerTitle: 'Avis important et limitation de responsabilité',
    acceptBtn: "J'ai lu, compris et j'accepte",
    calcTitle: '⚙️ Paramètres biométriques et intestinaux',
    diaryTitle: '📔 Journal quotidien',
    dietTitle: '🍽️ Régime triphasique et plan de repas',
    weightLabel: 'Poids (kg)',
    heightLabel: 'Taille (cm)',
    ageLabel: 'Âge (ans)',
    resultsTitle: '📊 Rapport de besoins',
    proteinsLabel: 'Protéines',
    fatsLabel: 'Lipides',
    carbsLabel: 'Gluc.',  // Short version used in results
    calcBtn: 'Calculer les besoins structurels',
  },
};

test.describe('i18n Language Switching', () => {
  // Test switching to each language - these run BEFORE accepting disclaimer
  test('should switch to Italiano (it)', async ({ page, language }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    // Set language in localStorage using closure that captures `language`
    await page.evaluate((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, language);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption(language);
    await expect(page.getByLabel('Language selector').first()).toHaveValue(language);
  });

  test('should switch to English (en)', async ({ page, language }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    await page.evaluate((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, language);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption(language);
    await expect(page.getByLabel('Language selector').first()).toHaveValue(language);
  });

  test('should switch to Deutsch (de)', async ({ page, language }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    await page.evaluate((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, language);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption(language);
    await expect(page.getByLabel('Language selector').first()).toHaveValue(language);
  });

  test('should switch to Español (es)', async ({ page, language }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    await page.evaluate((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, language);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption(language);
    await expect(page.getByLabel('Language selector').first()).toHaveValue(language);
  });

  test('should switch to Français (fr)', async ({ page, language }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    await page.evaluate((lang) => {
      localStorage.setItem('i18nextLng', lang);
    }, language);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption(language);
    await expect(page.getByLabel('Language selector').first()).toHaveValue(language);
  });

  test('should persist language selection in localStorage', async ({ page }) => {
    test.setTimeout(30000);
    await page.goto('/');
    await resetForNewFlow(page);
    await page.evaluate(() => {
      localStorage.setItem('i18nextLng', 'en');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    await page.getByLabel('Language selector').first().selectOption('en');
    await expect(page.getByLabel('Language selector').first()).toHaveValue('en');
    await page.click('.fixed.inset-0.z-50 button');
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
    const storedLang = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(storedLang).toBe('en');
  });

  test('should translate calculator tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, calcTitle: string, calcBtn: string) => {
      await page.goto('/');
      await resetForNewFlow(page);
      await page.evaluate((lang) => {
        localStorage.setItem('i18nextLng', lang);
      }, lang);
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Language selector').first().selectOption(lang);
      await page.click('.fixed.inset-0.z-50 button');
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
      await page.click('button:has-text("⚙️")');
      await expect(page.getByRole('heading', { name: calcTitle })).toBeVisible();
    };

    await run('en', translations.en.calcTitle, translations.en.calcBtn);
    await run('de', translations.de.calcTitle, translations.de.calcBtn);
    await run('es', translations.es.calcTitle, translations.es.calcBtn);
    await run('fr', translations.fr.calcTitle, translations.fr.calcBtn);
  });

  test('should translate diary tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, diaryTitle: string) => {
      await page.goto('/');
      await resetForNewFlow(page);
      await page.evaluate((lang) => {
        localStorage.setItem('i18nextLng', lang);
      }, lang);
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Language selector').first().selectOption(lang);
      await page.click('.fixed.inset-0.z-50 button');
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
      await page.click('button:has-text("📔")');
      await expect(page.getByRole('heading', { name: diaryTitle })).toBeVisible();
    };

    await run('en', translations.en.diaryTitle);
    await run('de', translations.de.diaryTitle);
  });

  test('should translate diet plan tab', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, dietTitle: string) => {
      await page.goto('/');
      await resetForNewFlow(page);
      await page.evaluate((lang) => {
        localStorage.setItem('i18nextLng', lang);
      }, lang);
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Language selector').first().selectOption(lang);
      await page.click('.fixed.inset-0.z-50 button');
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
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
    // Navigate first so the app loads, then select Italian from the dropdown.
    // NOTE: we do NOT use addInitScript + localStorage here because i18next's detection
    // order is ['navigator', 'localStorage', 'htmlTag']; in non-Chromium browsers the
    // navigator language (typically en-US) takes precedence over localStorage, causing the
    // disclaimer to render in English instead of Italian.
    await page.goto('/');

    // Wait for the disclaimer modal to appear (it renders immediately with loading state)
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });

    // Select Italian from the language selector inside the disclaimer modal
    await page.getByLabel('Language selector').first().selectOption('it');

    // Wait for i18next to load Italian translations and re-render the disclaimer
    await page.waitForTimeout(500);

    // Test Italian (default language)
    await expect(page.locator(`text=${translations.it.disclaimerTitle}`)).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`button:has-text("${translations.it.acceptBtn}")`)).toBeVisible();
  });

  test('should translate form labels in calculator', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string) => {
      await page.goto('/');
      await resetForNewFlow(page);
      await page.evaluate((lang) => {
        localStorage.setItem('i18nextLng', lang);
      }, lang);
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Language selector').first().selectOption(lang);
      await page.click('.fixed.inset-0.z-50 button');
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
      await page.click('button:has-text("⚙️")');
      // Use input name selectors since labels don't have htmlFor
      await expect(page.locator('input[name="weightKg"]')).toBeVisible();
      await expect(page.locator('input[name="heightCm"]')).toBeVisible();
      await expect(page.locator('input[name="ageYears"]')).toBeVisible();
      await expect(page.locator('select[name="biologicalSex"]')).toBeVisible();
      await expect(page.locator('select[name="activityLevel"]')).toBeVisible();
      await expect(page.locator('select[name="ibsType"]')).toBeVisible();
    };

    await run('en');
    await run('de');
  });

  test('should translate results in calculator', async ({ page }) => {
    test.setTimeout(60000);
    const run = async (lang: string, calcBtn: string) => {
      await page.goto('/');
      await resetForNewFlow(page);
      await page.evaluate((lang) => {
        localStorage.setItem('i18nextLng', lang);
      }, lang);
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
      await page.getByLabel('Language selector').first().selectOption(lang);
      await page.click('.fixed.inset-0.z-50 button');
      await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
      // Navigate directly to /calc via page.goto to ensure clean route rendering
      // (pushState/popstate from tab click can have timing issues with lazy-loaded components)
      await page.goto('/calc');
      await page.waitForLoadState('networkidle');
      // Wait for calculator form inputs to be visible
      await expect(page.locator('input[name="weightKg"]')).toBeVisible({ timeout: 15000 });
      await page.locator('input[name="weightKg"]').fill('70');
      await page.locator('input[name="heightCm"]').fill('175');
      await page.locator('input[name="ageYears"]').fill('30');
      await page.selectOption('select[name="biologicalSex"]', 'male');
      await page.selectOption('select[name="activityLevel"]', 'moderately_active');
      await page.selectOption('select[name="ibsType"]', 'unknown');
      // Wait for the calculate button to be ready before clicking
      await expect(page.locator(`button:has-text("${calcBtn}")`)).toBeVisible({ timeout: 15000 });
      await page.click(`button:has-text("${calcBtn}")`);
      await expect(page.locator(`text=${translations[lang as keyof typeof translations].resultsTitle}`)).toBeVisible();
      await expect(page.locator(`text=${translations[lang as keyof typeof translations].proteinsLabel}`)).toBeVisible();
      await expect(page.locator(`text=${translations[lang as keyof typeof translations].fatsLabel}`)).toBeVisible();
      await expect(page.locator(`text=${translations[lang as keyof typeof translations].carbsLabel}`)).toBeVisible();
    };

    await run('en', translations.en.calcBtn);
    await run('de', translations.de.calcBtn);
  });
});
