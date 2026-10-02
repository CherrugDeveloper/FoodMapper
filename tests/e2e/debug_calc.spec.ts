import { test, expect } from '@playwright/test';

test('debug german calc button', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('i18nextLng', 'de');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.locator('.fixed.inset-0.z-50').waitFor({ state: 'visible', timeout: 15000 });
  await page.getByLabel('Language selector').first().selectOption('de');
  await page.click('.fixed.inset-0.z-50 button');
  await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  await page.goto('/calc');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('input[name="weightKg"]')).toBeVisible({ timeout: 15000 });
  await page.locator('input[name="weightKg"]').fill('70');
  await page.locator('input[name="heightCm"]').fill('175');
  await page.locator('input[name="ageYears"]').fill('30');
  await page.selectOption('select[name="biologicalSex"]', 'male');
  await page.selectOption('select[name="activityLevel"]', 'moderately_active');
  await page.selectOption('select[name="ibsType"]', 'unknown');
  
  // Debug: check what buttons exist
  const allButtons = page.locator('button');
  const count = await allButtons.count();
  console.log(`Total buttons: ${count}`);
  
  for (let i = 0; i < count; i++) {
    const btn = allButtons.nth(i);
    const text = await btn.innerText();
    const type = await btn.getAttribute('type');
    console.log(`Button ${i}: text="${text}", type="${type}"`);
  }
  
  // Check for calc btn specifically
  const calcBtn = page.locator('button:has-text("Strukturellen Bedarf berechnen")');
  console.log(`calcBtn visible: ${await calcBtn.isVisible()}`);
  console.log(`calcBtn count: ${await calcBtn.count()}`);
  
  // Try type=submit
  const submitBtn = page.locator('button[type="submit"]');
  console.log(`submitBtn visible: ${await submitBtn.isVisible()}`);
  console.log(`submitBtn count: ${await submitBtn.count()}`);
  
  // Try has-text with English
  const enBtn = page.locator('button:has-text("Calculate Structural Requirements")');
  console.log(`enBtn visible: ${await enBtn.isVisible()}`);
});
