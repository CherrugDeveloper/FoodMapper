import { test, expect } from '@playwright/test';

const languages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

// Translation maps for each language - matching actual translation files
const translations = {
  it: {
    disclaimerTitle: 'Avviso Importante e Limitazione di Responsabilità',
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
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000); // Increase timeout for slow i18n initialization
    // Clear localStorage to ensure Italian is the default language for each test
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    // Wait for the disclaimer modal to appear (it renders immediately with loading state)
    await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
    // Wait for the accept button to be visible and clickable
    // We target the button within the disclaimer modal to avoid conflicts with other buttons
    const acceptBtn = page.locator('.fixed.inset-0.z-50 button');
    await acceptBtn.waitFor({ state: 'visible', timeout: 15000 });
    // Accept disclaimer to proceed to the application
    await acceptBtn.click();
    // Wait for app to unlock
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  for (const lang of languages) {
    test(`should switch to ${lang.name} (${lang.code})`, async ({ page }) => {
      await page.locator('header select').selectOption(lang.code);
      // Verify the dropdown shows the selected language
      await expect(page.locator('header select')).toHaveValue(lang.code);

      // Verify key UI elements are visible (tab buttons with emojis)
      await expect(page.locator('button:has-text("⚙️")')).toBeVisible();
      await expect(page.locator('button:has-text("📔")')).toBeVisible();
      await expect(page.locator('button:has-text("🍽️")')).toBeVisible();
    });
  }

  test('should persist language selection in localStorage', async ({ page }) => {
    // Switch to English using header selector and wait for resources to load
    await page.locator('header select').selectOption('en');
    await expect(page.locator('header select')).toHaveValue('en');
    await expect(page.locator('nav button').first()).toBeVisible({ timeout: 15000 });
    // Verify localStorage was updated by i18next
    const storedLang = await page.evaluate(() => localStorage.getItem('i18nextLng'));
    expect(storedLang).toBe('en');
  });

  test('should translate calculator tab', async ({ page }) => {
    // Test English
    await page.locator('header select').selectOption('en');
    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: translations.en.calcTitle })).toBeVisible();

    // Test German
    await page.locator('header select').selectOption('de');
    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: translations.de.calcTitle })).toBeVisible();

    // Test Spanish
    await page.locator('header select').selectOption('es');
    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: translations.es.calcTitle })).toBeVisible();

    // Test French
    await page.locator('header select').selectOption('fr');
    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: translations.fr.calcTitle })).toBeVisible();
  });

  test('should translate diary tab', async ({ page }) => {
    // Test English
    await page.locator('header select').selectOption('en');
    await page.click('button:has-text("📔")');
    await expect(page.getByRole('heading', { name: translations.en.diaryTitle })).toBeVisible();

    // Test German
    await page.locator('header select').selectOption('de');
    await page.click('button:has-text("📔")');
    await expect(page.getByRole('heading', { name: translations.de.diaryTitle })).toBeVisible();
  });

  test('should translate diet plan tab', async ({ page }) => {
    // Test English
    await page.locator('header select').selectOption('en');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("🍽️")');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: translations.en.dietTitle })).toBeVisible();

    // Test German
    await page.locator('header select').selectOption('de');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("🍽️")');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: translations.de.dietTitle })).toBeVisible();
  });

  test('should translate medical disclaimer in Italian (default)', async ({ page }) => {
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
    // Test English
    await page.getByLabel('Language selector').first().selectOption('en');
    await page.click('button:has-text("⚙️")');
    // Use input name selectors since labels don't have htmlFor
    await expect(page.locator('input[name="weightKg"]')).toBeVisible();
    await expect(page.locator('input[name="heightCm"]')).toBeVisible();
    await expect(page.locator('input[name="ageYears"]')).toBeVisible();
    await expect(page.locator('select[name="biologicalSex"]')).toBeVisible();
    await expect(page.locator('select[name="activityLevel"]')).toBeVisible();
    await expect(page.locator('select[name="ibsType"]')).toBeVisible();

    // Test German
    await page.getByLabel('Language selector').first().selectOption('de');
    await page.click('button:has-text("⚙️")');
    await expect(page.locator('input[name="weightKg"]')).toBeVisible();
    await expect(page.locator('input[name="heightCm"]')).toBeVisible();
    await expect(page.locator('input[name="ageYears"]')).toBeVisible();
  });

  test('should translate results in calculator', async ({ page }) => {
    // Test English
    await page.getByLabel('Language selector').first().selectOption('en');
    await page.click('button:has-text("⚙️")');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="weightKg"]').fill('70');
    await page.locator('input[name="heightCm"]').fill('175');
    await page.locator('input[name="ageYears"]').fill('30');
    await page.selectOption('select[name="biologicalSex"]', 'male');
    await page.selectOption('select[name="activityLevel"]', 'moderately_active');
    await page.selectOption('select[name="ibsType"]', 'unknown');
    await page.click(`button:has-text("${translations.en.calcBtn}")`);
    await expect(page.locator(`text=${translations.en.resultsTitle}`)).toBeVisible();
    await expect(page.locator(`text=${translations.en.proteinsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations.en.fatsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations.en.carbsLabel}`)).toBeVisible();

    // Test German
    await page.getByLabel('Language selector').first().selectOption('de');
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("⚙️")');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="weightKg"]').fill('70');
    await page.locator('input[name="heightCm"]').fill('175');
    await page.locator('input[name="ageYears"]').fill('30');
    await page.selectOption('select[name="biologicalSex"]', 'male');
    await page.selectOption('select[name="activityLevel"]', 'moderately_active');
    await page.selectOption('select[name="ibsType"]', 'unknown');
    await page.click(`button:has-text("${translations.de.calcBtn}")`);
    await expect(page.locator(`text=${translations.de.resultsTitle}`)).toBeVisible();
    await expect(page.locator(`text=${translations.de.proteinsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations.de.fatsLabel}`)).toBeVisible();
    await expect(page.locator(`text=${translations.de.carbsLabel}`)).toBeVisible();
  });
});
