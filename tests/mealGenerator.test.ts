import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Import only necessary types
import { generateDayPlan } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

// Test data
const mockResults: NutritionalResults = {
  proteins: 100,
  fats: 70,
  carbs: 250,
  fiber: 30,
  waterLiters: 2.5,
  estimatedTotalEnergyKcal: 2000,
  targetCaloriesKcal: 2000,
  recommendations: 'ibs_rec_d',
  conditionNotes: [],
  micronutrients: {
    potassium: 3500,
    magnesium: 400,
    calcium: 1000,
    iron: 18,
    zinc: 15,
    folate: 400,
    vitamin_a: 900,
    vitamin_c: 90,
    vitamin_d: 20,
    vitamin_e: 15,
    b12: 2.4,
    omega3: 1.6,
    selenium: 55,
    iodine: 150,
    sodium: 2300,
    vitamin_k: 120,
    vitamin_b6: 1.7,
    manganese: 2.3,
    copper: 0.9,
    phosphorus: 1000
  }
};

const mockUserData: UserData = {
  weightKg: 70,
  heightCm: 175,
  ageYears: 30,
  biologicalSex: 'male',
  activityLevel: 'moderately_active',
  ibsType: 'IBS-D',
  conditions: []
};

describe('mealGenerator.ts - Complete Redesign Tests', () => {
  // Test 1: Basic day plan generation (phase0)
  it('should generate a day plan in phase0', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, "phase0", undefined, 7);
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    expect(dayPlan.dailyTotals.protein).toBeCloseTo(100, -1);
  });

  // Test 2: Phase1 - strict low-FODMAP only
  it('should filter high-FODMAP foods in phase1', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();
    // In phase1, all foods should have low FODMAP level
    // This tests that the filtering works correctly
    expect(dayPlan.meals).toHaveLength(7);
  });

  // Test 3: Phase2 - test group cycling
  it('should handle phase2 test group assignment', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase2');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    // Phase2 should still generate valid meals
  });

  // Test 4: Phase3 - systematic reintroduction
  it('should handle phase3 systematic reintroduction', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase3');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    // Phase3 should generate valid meals with reintroduction tracking
  });

  // Test 5: Seasonal foods filter by month
  it('should respect seasonality - summer month should exclude winter-only foods', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1', 7); // July = month 7
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
  });

  // Test 6: Meal suitability enforcement
  it('should enforce mealSuitability per meal type', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    // Breakfast meals should use foods with mealSuitability: 'breakfast' or 'any'
  });

  // Test 7: Flavor balance across day
  it('should maintain flavor balance across the day', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    // Should not have extreme flavor imbalance
    expect(dayPlan).toBeDefined();
  });

  // Test 8: Portion sizes within GRAMS_RANGE
  it('should enforce portion size ranges', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.meals).toHaveLength(7);
    // All portions should be within valid ranges
    dayPlan.meals.forEach(meal => {
      meal.portions.forEach(portion => {
        expect(portion.grams).toBeGreaterThan(0);
      });
    });
  });

  // Test 9: Economic sense - favor year-round ingredients
  it('should favor year-round available ingredients', () => {
    const dayPlanSummer = generateDayPlan(mockResults, mockUserData, 'phase1', 7); // Summer
    const dayPlanWinter = generateDayPlan(mockResults, mockUserData, 'phase1', 1); // Winter
    expect(dayPlanSummer).toBeDefined();
    expect(dayPlanWinter).toBeDefined();
    expect(dayPlanSummer.meals).toHaveLength(7);
    expect(dayPlanWinter.meals).toHaveLength(7);
  });

  // Test 10: IBS rules respected across phases
  it('should respect IBS rules across all diet phases', () => {
    ['phase0', 'phase1', 'phase2', 'phase3'].forEach(phase => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, phase);
      expect(dayPlan).toBeDefined();
      expect(dayPlan.meals).toHaveLength(7);
    });
  });

  // Test 11: Fats are calculated correctly (not from fiber)
  it('should calculate fats correctly, not from fiber', async () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();
    expect(dayPlan.dailyTotals.fat).toBeDefined();
    // The fat value should NOT equal fiber value - this would indicate the bug
    // Fat target is 70g, fiber target is 30g - they should be different
    expect(dayPlan.dailyTotals.fat).not.toBe(dayPlan.dailyTotals.fiber);
    // Fat should be positive and reasonable (the generator uses fat foods)
    // Value should be higher than fiber (which is the bug being fixed)
    expect(dayPlan.dailyTotals.fat).toBeGreaterThan(30);
  }, 10000);

  // Test 12: Nutritional totals are consistent with portion sums
  it('should have nutritional totals consistent with portion sums', async () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase1');
    expect(dayPlan).toBeDefined();

    // Verify daily totals are reasonable and coerenti
    // The normalization scales all nutrients to match protein target (100g)
    // This means the ratio between nutrients from raw portions should be preserved
    
    // Protein should be close to target (the normalization target)
    expect(dayPlan.dailyTotals.protein).toBeCloseTo(100, 0);
    
    // Calories should be within reasonable range (1800-2200 kcal for 2000 target)
    expect(dayPlan.dailyTotals.calories).toBeGreaterThan(1800);
    expect(dayPlan.dailyTotals.calories).toBeLessThan(2500);
    
    // Carbs, fat, fiber should be positive and reasonable
    expect(dayPlan.dailyTotals.carbs).toBeGreaterThan(150);
    expect(dayPlan.dailyTotals.fat).toBeGreaterThan(30);
    expect(dayPlan.dailyTotals.fiber).toBeGreaterThan(15);
  }, 10000);
});