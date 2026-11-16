import { describe, it, expect } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';

describe('Debug fat generation', () => {
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

  it('debug fat generation with 30% cap', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
    const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
    
    console.log('Breakfast portions:');
    breakfast?.portions.forEach((p: any, i: number) => {
      console.log(`  Portion ${i}: ${p.foodId} (${p.foodName}), ${p.grams}g, kcal:${p.nutrition.kcal}, fat:${p.nutrition.fat}g`);
    });
    
    console.log('\\nBreakfast total nutrition:', JSON.stringify(breakfast?.totalNutrition));
    console.log('\\nDaily totals fat:', dayPlan.dailyTotals.fat);
    console.log('Daily totals calories:', dayPlan.dailyTotals.calories);
    
    // Check fat pool usage
    const fatPool = ['38', '39', '40', '41', '72'];
    const usedFatIds = breakfast?.portions.filter((p: any) => fatPool.includes(p.foodId));
    console.log('\\nFat pool IDs used:', usedFatIds?.map((p: any) => p.foodId));
  });
});
