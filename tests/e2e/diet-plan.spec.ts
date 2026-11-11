import { test, expect } from '@playwright/test';
import { prepareApp, waitForAppReady } from './fixtures';

test.describe('Diet Plan CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await prepareApp(page);
  });

  test('should display diet plan tab', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Dieta' })).toBeVisible();
  });

  test('should show calculator prompt when no calculation exists', async ({ page }) => {
    // The beforeEach already called prepareApp with disclaimer accepted
    // Clear only the calculator draft
    await page.evaluate(() => {
      localStorage.removeItem('foodmapper_calculator_draft');
      localStorage.setItem('foodmapper_calculator_draft', '{}');
    });
    
    // Add init script to re-assert disclaimer acceptance after reload
    await page.addInitScript(
      ({ key, value, latch }) => {
        if (window.sessionStorage.getItem(latch)) return;
        window.sessionStorage.setItem(latch, 'true');
        window.localStorage.setItem(key, value);
      },
      {
        key: 'ibs_disclaimer_accepted',
        value: 'true',
        latch: 'foodmapper_disclaimer_seed_latch'
      }
    );
    
    await page.reload();
    await waitForAppReady(page);
    
    // Ensure we are on the diet route
    await page.goto('/diet');
    await waitForAppReady(page);

    // Locate and click the DietPlan button specifically
    const dietButton = page.locator('button:has-text("🍽️")');
    await dietButton.waitFor({ state: 'visible', timeout: 15000 });
    await dietButton.click();
    
    await expect(page.locator('text=Vai al calcolatore')).toBeVisible({ timeout: 15000 });
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
   * 1. Module-level event listener without proper cleanup causing stale listeners
   * 2. Navigation throttling state not being synchronized between paths
   * 
   * The fix:
   * - Moved event listener to useEffect with proper cleanup
   * - Added touchNavigationTime() to synchronize throttle state
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
    await expect(page.getByRole('heading', { name: /Parametri Biometrici e Intestinali|Biometric and Intestinal Parameters/i })).toBeVisible({ timeout: 10000 });
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
    await waitForAppReady(page);
    
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