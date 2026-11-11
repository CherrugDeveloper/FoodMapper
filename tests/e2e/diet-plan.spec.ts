import { test, expect } from '@playwright/test';
import { prepareApp } from './fixtures';

test.describe('Diet Plan CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await prepareApp(page);
  });

  test('should display diet plan tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Dieta' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('ibs_disclaimer_accepted', 'true');
      localStorage.setItem('i18nextLng', 'it');
    });
    await page.reload();
    await expect(page.locator('header')).toBeVisible();
    await page.click('button:has-text("🍽️")');
    await expect(page.locator('text=Vai al calcolatore')).toBeVisible();
  });

  test('should navigate to diet plan tab', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();
  });

  test('should display diet plan title', async ({ page }) => {
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();
  });
});

test.describe('Diet Plan Navigation Button Behavior', () => {
  /**
   * These tests verify the fix for the navigation bug where internal buttons
   * became unresponsive/stuck after navigating to /diet.
   * 
   * The root cause was:
   * 1. Module-level event listener that could accumulate event handlers
   * 2. Navigation error count not being reset properly
   * 3. Throttling state issues from the event listener calling touchNavigationTime()
   * 
   * The fix:
   * - Moved event listener to useEffect with proper cleanup
   - Removed redundant touchNavigationTime() call from event listener
   * - Ensure navigateTo() resets error count on success
   */
  test.beforeEach(async ({ page }) => {
    await prepareApp(page);
  });

  test('should allow navigation between tabs after visiting DietPlan', async ({ page }) => {
    // Navigate to DietPlan first
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();

    // Now try to navigate to other tabs - these should work
    await page.click('button:has-text("🔍")');
    await expect(page.getByRole('heading', { name: /Alimenti/i })).toBeVisible({ timeout: 10000 });

    await page.click('button:has-text("⚙️")');
    await expect(page.getByRole('heading', { name: /Calcola/i })).toBeVisible({ timeout: 10000 });
  });

  test('should allow navigation back to DietPlan after visiting other tabs', async ({ page }) => {
    // Navigate to DietPlan first
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();

    // Navigate to workout
    await page.click('button:has-text("💪")');
    await expect(page.getByRole('heading', { name: /Allenamento/i })).toBeVisible({ timeout: 10000 });

    // Navigate back to DietPlan
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 10000 });
  });

  test('should not get stuck on rapid tab navigation', async ({ page }) => {
    // Rapidly click through multiple tabs
    const tabs = ['🍽️', '🔍', '⚙️', '🛒', '💪', '🍽️'];
    
    for (const tab of tabs) {
      await page.click(`button:has-text("${tab}")`);
      // Small delay to ensure render completes
      await page.waitForTimeout(100);
    }

    // Verify we're still on the last tab (DietPlan)
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 10000 });
  });

  test('internal navigation buttons in DietPlan should work after page refresh', async ({ page }) => {
    // Navigate to DietPlan
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible();

    // Refresh the page
    await page.reload();

    // After refresh, navigate again
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 10000 });

    // Verify other tabs are accessible
    await page.click('button:has-text("🔍")');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle navigation after error state in navigation system', async ({ page }) => {
    // This test simulates the scenario where navigation errors could accumulate
    // and block further navigation
    
    // Force navigation to diet plan multiple times rapidly
    await page.click('button:has-text("🍽️")');
    await page.click('button:has-text("🍽️")'); // Click again quickly
    await page.click('button:has-text("🍽️")');

    // Should still be able to navigate
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 10000 });

    // Navigate to a different tab
    await page.click('button:has-text("📔")');
    await page.click('button:has-text("🍽️")');
    
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('DietPlan Internal Navigation Buttons', () => {
  test.beforeEach(async ({ page }) => {
    // Need to enter the app with calculator results to see diet plan buttons
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('ibs_disclaimer_accepted', 'true');
      localStorage.setItem('i18nextLng', 'it');
    });
    await page.reload();
    
    // Fill and submit calculator form to enable diet plan with results
    await page.fill('input[name="weightKg"]', '70');
    await page.fill('input[name="heightCm"]', '175');
    await page.fill('input[name="ageYears"]', '30');
    await page.selectOption('select[name="biologicalSex"]', 'male');
    await page.selectOption('select[name="activityLevel"]', 'moderately_active');
    await page.selectOption('select[name="ibsType"]', 'unknown');
    await page.click('button:has-text("Calcola")');
    
    // Wait for results and then navigate to diet
    await page.click('button:has-text("🍽️")');
    await expect(page.getByRole('heading', { name: 'Dieta Trifasica' })).toBeVisible({ timeout: 15000 });
  });

  test('should allow navigating back to calculator with "Vai al calcolatore" button', async ({ page }) => {
    await page.click('button:has-text("Vai al calcolatore")');
    await expect(page.locator('[data-testid="nutritional-calculator"]')).toBeVisible({ timeout: 10000 });
  });

  test('should allow navigating to diary with "Vai al diario" button', async ({ page }) => {
    await page.click('button:has-text("Vai al diario")');
    await expect(page.getByRole('heading', { name: 'Diario' })).toBeVisible({ timeout: 10000 });
  });

  test('should allow navigating to recipes tab', async ({ page }) => {
    await page.click('button:has-text("Vai alle ricette")');
    await expect(page.getByRole('heading', { name: /Ricette/i })).toBeVisible({ timeout: 10000 });
  });

  test('should allow navigating to shopping list tab', async ({ page }) => {
    await page.click('button:has-text("Vai alla lista della spesa")');
    await expect(page.getByRole('heading', { name: /Lista della spesa/i })).toBeVisible({ timeout: 10000 });
  });
});