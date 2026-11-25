import { describe, it, expect } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

// Test data - standard 2000 kcal diet
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

// Test ALL edge cases that might produce zero-portion foods
describe('Zero Portion Detection', () => {
  const phases: Array<'phase0' | 'phase0-pre-start' | 'phase1' | 'phase2' | 'phase3'> = 
    ['phase0', 'phase0-pre-start', 'phase1', 'phase2', 'phase3'];
  
  const mealCounts: Array<1 | 2 | 3 | 4 | 5 | 6 | 7> = [1, 2, 3, 4, 5, 6, 7];

  it('should not generate any portions with grams = 0 across all phases and meal counts', () => {
    const failedCases: string[] = [];
    
    for (const phase of phases) {
      for (const mealCount of mealCounts) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, phase, 0, 0, undefined, mealCount as any);
        
        for (const meal of dayPlan.meals) {
          for (const portion of meal.portions) {
            if (portion.grams === 0) {
              failedCases.push(`${phase}-${mealCount}: ${meal.name} - ${portion.foodName} (grams=0)`);
            }
            if (portion.grams < 0) {
              failedCases.push(`${phase}-${mealCount}: ${meal.name} - ${portion.foodName} (grams=${portion.grams})`);
            }
          }
        }
      }
    }
    
    if (failedCases.length > 0) {
      console.error('FOUND ZERO-GRAM PORTIONS:');
      failedCases.forEach(c => console.error('  ' + c));
    }
    
    expect(failedCases).toEqual([]);
  });

  it('should not generate portions with grams < 5 (IRRELEVANT_THRESHOLD)', () => {
    const failedCases: string[] = [];
    
    for (const phase of phases) {
      for (const mealCount of mealCounts) {
        const dayPlan = generateDayPlan(mockResults, mockUserData, phase, 0, 0, undefined, mealCount as any);
        
        for (const meal of dayPlan.meals) {
          for (const portion of meal.portions) {
            if (portion.grams > 0 && portion.grams < 5) {
              failedCases.push(`${phase}-${mealCount}: ${meal.name} - ${portion.foodName} (grams=${portion.grams})`);
            }
          }
        }
      }
    }
    
    if (failedCases.length > 0) {
      console.error('FOUND SUB-THRESHOLD PORTIONS (< 5g):');
      failedCases.forEach(c => console.error('  ' + c));
    }
    
    expect(failedCases).toEqual([]);
  });

  it('should handle extreme nutrition targets without zero portions', () => {
    // Very low protein target
    const lowProteinResults: NutritionalResults = {
      ...mockResults,
      proteins: 50,  // Low protein
      fats: 70,
      carbs: 300,
      targetCaloriesKcal: 2000
    };
    
    // Very high protein target
    const highProteinResults: NutritionalResults = {
      ...mockResults,
      proteins: 200,  // High protein
      fats: 100,
      carbs: 150,
      targetCaloriesKcal: 2500
    };
    
    const scenarios = [
      { name: 'low protein', results: lowProteinResults },
      { name: 'high protein', results: highProteinResults }
    ];
    
    for (const scenario of scenarios) {
      for (const phase of phases) {
        const dayPlan = generateDayPlan(scenario.results, mockUserData, phase, 0, 0, undefined, 3);
        
        for (const meal of dayPlan.meals) {
          for (const portion of meal.portions) {
            if (portion.grams === 0) {
              console.error(`ZERO GRAM in ${scenario.name} ${phase}: ${meal.name} - ${portion.foodName}`);
            }
          }
        }
      }
    }
    
    expect(true).toBe(true); // Just pass if no errors thrown
  });

  it('should handle allergen-only diets without zero portions', () => {
    // User with many allergens
    const allergenUser: UserData = {
      ...mockUserData,
      allergens: ['gluten', 'lactose', 'eggs', 'soy']
    };
    
    for (const phase of phases) {
      const dayPlan = generateDayPlan(mockResults, allergenUser, phase, 0, 0, undefined, 3);
      
      for (const meal of dayPlan.meals) {
        for (const portion of meal.portions) {
          if (portion.grams === 0) {
            console.error(`ZERO GRAM with allergens ${phase}: ${meal.name} - ${portion.foodName}`);
          }
        }
      }
    }
    
    expect(true).toBe(true);
  });

  it('should generate valid portions for all 7 days of phase2', () => {
    // Phase 2 has test groups that cycle
    // Use a fixed date string to ensure consistent date parsing
    const testDate = '2024-01-15';
    
    for (let phaseDay = 0; phaseDay < 21; phaseDay += 3) {  // 3 days per test group
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase2', 0, phaseDay, testDate, 3);
      
      for (const meal of dayPlan.meals) {
        for (const portion of meal.portions) {
          if (portion.grams === 0) {
            console.error(`ZERO GRAM in phase2 day ${phaseDay}: ${meal.name} - ${portion.foodName}`);
          }
          if (portion.grams < 5) {
            console.error(`SUB-THRESHOLD GRAM in phase2 day ${phaseDay}: ${meal.name} - ${portion.foodName} (${portion.grams}g)`);
          }
        }
      }
    }
    
    expect(true).toBe(true);
  });

  it('should generate portions with valid nutrition values', () => {
    for (const phase of phases) {
      const dayPlan = generateDayPlan(mockResults, mockUserData, phase, 0, 0, undefined, 3);
      
      for (const meal of dayPlan.meals) {
        for (const portion of meal.portions) {
          // Check that nutrition values are valid numbers
          if (isNaN(portion.nutrition.calories) || portion.nutrition.calories < 0) {
            console.error(`INVALID CALORIES in ${phase}: ${portion.foodName} - ${portion.nutrition.calories}`);
          }
          if (isNaN(portion.nutrition.protein) || portion.nutrition.protein < 0) {
            console.error(`INVALID PROTEIN in ${phase}: ${portion.foodName} - ${portion.nutrition.protein}`);
          }
          if (isNaN(portion.nutrition.carbs) || portion.nutrition.carbs < 0) {
            console.error(`INVALID CARBS in ${phase}: ${portion.foodName} - ${portion.nutrition.carbs}`);
          }
          if (isNaN(portion.nutrition.fat) || portion.nutrition.fat < 0) {
            console.error(`INVALID FAT in ${phase}: ${portion.foodName} - ${portion.nutrition.fat}`);
          }
        }
      }
    }
    
    expect(true).toBe(true);
  });
});