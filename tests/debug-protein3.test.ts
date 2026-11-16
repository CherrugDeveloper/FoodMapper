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
    potassium: 3500, magnesium: 400, calcium: 1000, iron: 18,
    zinc: 15, folate: 400, vitamin_a: 900, vitamin_c: 90,
    vitamin_d: 20, vitamin_e: 15, b12: 2.4, omega3: 1.6,
    selenium: 55, iodine: 150, sodium: 2300, vitamin_k: 120,
    vitamin_b6: 1.7, manganese: 2.3, copper: 0.9, phosphorus: 1000
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

describe('debug protein distribution v3', () => {
  it('should debug protein distribution with per-meal target enforcement', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', undefined, 7);
    console.log('Daily protein total:', dayPlan.dailyTotals.protein);
    console.log('Expected: ~100g');
    console.log('Difference:', Math.abs(dayPlan.dailyTotals.protein - 100));
    
    // Print per-meal protein with all foods
    dayPlan.meals.forEach((meal, i) => {
      console.log(`\nMeal ${i+1} (${meal.key}):`);
      let mealProtein = 0;
      meal.portions.forEach((p, j) => {
        const pProtein = p.nutrition.protein;
        mealProtein += pProtein;
        console.log(`  Portion ${j+1}: ${p.foodName}, protein=${pProtein.toFixed(1)}g, grams=${p.grams}`);
      });
      console.log(`  Meal total protein: ${mealProtein.toFixed(1)}g`);
    });
    
    // The test assertion
    expect(dayPlan.dailyTotals.protein).toBeCloseTo(100, -1);
  });
});
