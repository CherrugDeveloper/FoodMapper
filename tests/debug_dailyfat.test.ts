import { describe, it, expect } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';

describe('Debug daily fat distribution', () => {
  const mockResults: any = {
    proteins: 100,
    fats: 70,
    carbs: 250,
    fiber: 30,
    waterLiters: 2.5,
    estimatedTotalEnergyKcal: 2000,
    targetCaloriesKcal: 2000,
    recommendations: 'ibs_rec_d',
    conditionNotes: []
  };

  const mockUserData: any = {
    weightKg: 70,
    heightCm: 175,
    ageYears: 30,
    biologicalSex: 'male',
    activityLevel: 'moderately_active',
    ibsType: 'IBS-D',
    conditions: [],
    allergens: [],
    medications: []
  };

  it('debug daily fat across all meals', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
    
    console.log('All meals:');
    dayPlan.meals.forEach((m: any, i: number) => {
      console.log(`\nMeal ${i} (${m.key}):`);
      m.portions.forEach((p: any, j: number) => {
        console.log(`  Portion ${j}: ${p.foodId} (${p.foodName}), ${p.grams}g, fat:${p.nutrition.fat}g, kcal:${p.nutrition.kcal}`);
      });
      console.log(`  Meal total fat: ${m.totalNutrition?.fat}g, calories: ${m.totalNutrition?.calories}`);
    });
    
    console.log('\nDaily totals:');
    console.log('  Fat:', dayPlan.dailyTotals.fat);
    console.log('  Calories:', dayPlan.dailyTotals.calories);
    
    // Check fat per meal
    console.log('\nFat per meal:');
    dayPlan.meals.forEach((m: any, i: number) => {
      const fatPool = ['38', '39', '40', '41', '72'];
      const fatPortions = m.portions.filter((p: any) => fatPool.includes(p.foodId));
      console.log(`  Meal ${i} (${m.key}): ${fatPortions.length} fat portions, total fat: ${fatPortions.reduce((sum: number, p: any) => sum + p.nutrition.fat, 0)}g`);
    });
  });
});
