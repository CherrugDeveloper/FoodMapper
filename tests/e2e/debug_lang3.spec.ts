import { test, expect } from '@playwright/test';

test('debug language selection with i18n change', async ({ page }) => {
  await page.goto('/');
  
  // Set German in localStorage BEFORE reload
  await page.evaluate(() => {
    localStorage.setItem('i18nextLng', 'de');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  // Check what language is actually set
  const currentLang = await page.evaluate(() => localStorage.getItem('i18nextLng'));
  console.log(`i18nextLng after reload: ${currentLang}`);
  
  // Use i18n.changeLanguage to set the language programmatically
  await page.evaluate(() => {
    // @ts-ignore - access i18n from window
    (window as any).i18n.changeLanguage('de');
  });
  await page.waitForTimeout(1000);
  
  // Check the language selector value
  const langSelector = page.getByLabel('Language selector');
  const options = await langSelector.locator('option').all();
  for (const opt of options) {
    console.log(`Option: value="${opt.getAttribute('value')}" text="${await opt.innerText()}"`);
  }
  
  // Try selecting German (should be already selected)
  await langSelector.first().selectOption('de');
  await page.waitForTimeout(1000);
  
  // Accept disclaimer
  await page.click('.fixed.inset-0.z-50 button');
  await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  
  // Now navigate to calc
  await page.goto('/calc');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('input[name="weightKg"]')).toBeVisible({ timeout: 15000 });
  
  // Check buttons after selecting German in disclaimer
  const allButtons = page.locator('button');
  const count = await allButtons.count();
  console.log(`\nTotal buttons after accepting disclaimer: ${count}`);
  
  for (let i = 0; i < count; i++) {
    const btn = allButtons.nth(i);
    const text = await btn.innerText();
    const type = await btn.getAttribute('type');
    console.log(`Button ${i}: text="${text}", type="${type}"`);
  }
  
  // Check specific calc btn
  const calcBtn = page.locator('button:has-text("Strukturellen Bedarf berechnen")');
  console.log(`\ncalcBtn visible: ${await calcBtn.isVisible()}`);
  console.log(`calcBtn count: ${await calcBtn.count()}`);
  
  const enBtn = page.locator('button:has-text("Calculate Structural Requirements")');
  console.log(`enBtn visible: ${await enBtn.isVisible()}`);
});