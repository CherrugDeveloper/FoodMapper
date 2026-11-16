import { describe, it } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';

describe('Debug fat pool selection', () => {
  const mockResults: NutritionalResults = {
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

  const mockUserData: UserData = {
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

  it('debug fat pool selection with 30% cap', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
    const breakfast = dayPlan.meals.find(m => m.key === 'colazione');
    
    console.log('All breakfast portions:');
    breakfast?.portions.forEach((p, i) => {
      console.log(`  Portion ${i}: ${p.foodId} (${p.foodName}), ${p.grams}g, kcal:${p.nutrition.kcal}, fat:${p.nutrition.fat}g`);
    });
    
    console.log('\\nBreakdown by role:');
    const roles = breakfast?.portions.map((p) => p.foodId).filter((f: string, i: number, arr: string[]) => 
      arr.indexOf(f) === i // unique
    );
    console.log('Unique food IDs:', roles);
    
    // Check what pool each belongs to
    const BREAKFAST_FAT_POOL = ['38', '39', '40', '41', '72'];
    const fatPortions = breakfast?.portions.filter((p) => BREAKFAST_FAT_POOL.includes(p.foodId));
    console.log('Fat pool portions:', fatPortions?.map((p) => `${p.foodId} (${p.foodName}), ${p.grams}g`));
  });
});
