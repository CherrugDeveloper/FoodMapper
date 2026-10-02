import { test, expect } from '@playwright/test';

test('debug language selector change', async ({ page }) => {
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
  
  // Accept disclaimer first
  await page.click('.fixed.inset-0.z-50 button');
  await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  console.log('Disclaimer accepted');
  
  // Now navigate to calc
  await page.goto('/calc');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('input[name="weightKg"]')).toBeVisible({ timeout: 15000 });
  console.log('Calculator loaded');
  
  // Check buttons BEFORE language change
  const allButtons = page.locator('button');
  const count = await allButtons.count();
  console.log(`\nTotal buttons BEFORE language change: ${count}`);
  
  for (let i = 0; i < count; i++) {
    const btn = allButtons.nth(i);
    const text = await btn.innerText();
    const type = await btn.getAttribute('type');
    console.log(`Button ${i}: text="${text}", type="${type}"`);
  }
  
  // Now change language to German via selector
  await page.getByLabel('Language selector').first().selectOption('de');
  await page.waitForTimeout(2000);
  
  // Check buttons AFTER language change
  const allButtons2 = page.locator('button');
  const count2 = await allButtons2.count();
  console.log(`\nTotal buttons AFTER language change: ${count2}`);
  
  for (let i = 0; i < count2; i++) {
    const btn = allButtons2.nth(i);
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
