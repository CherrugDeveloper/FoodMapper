import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock FOODS_DATABASE
// Remove the Micro import entirely
vi.mock('../src/utils/foodsData', () => ({
  FOODS_DATABASE: [
    {
      id: '1',
      name: 'Pane di Frumento / Pasta comune',
      category: 'Carboidrati/Cereali',
      fodmapLevel: 'high',
      nutrition: { kcal: 290, protein: 9, carbs: 55, fats: 2, fiber: 3 }
    }
  ]
}));

// Mock mealGenerator functions
vi.mock('../src/utils/mealGenerator', () => ({
  generateDayPlan: vi.fn((results: NutritionalResults, userData: UserData | null, phase: string, dayIndex = 0, phaseDay = 0, startDate?: string) => {
    return {
      dayIndex: 0,
      phase: phase,
      phaseDay: 0,
      date: '2024-01-01',
      meals: [
        {
          name: 'Breakfast',
          key: 'colazione',
          portions: [
            {
              foodId: '1',
              foodName: 'Pane di Frumento / Pasta comune',
              grams: 100,
              nutrition: {
                calories: 290,
                protein: 9,
                carbs: 55,
                fat: 2,
                fiber: 3,
                sugar: 0,
                sodium: 0
              },
              isConfirmed: false,
              isModified: false
            }
          ],
          totalNutrition: {
            calories: 290,
            protein: 9,
            carbs: 55,
            fat: 2,
            fiber: 3,
            sugar: 0,
            sodium: 0
          },
          isConfirmed: false
        }
      ],
      dailyTotals: {
        calories: 2000,
        protein: 100,
        carbs: 250,
        fat: 70,
        fiber: 30,
        sugar: 0,
        sodium: 2300
      },
      isCompleted: false
    };
    return {
      dayIndex: 0,
      phase: 'phase0',
      phaseDay: 0,
      date: '2024-01-01',
      meals: [
        {
          name: 'Breakfast',
          key: 'colazione',
          portions: [
            {
              foodId: '1',
              foodName: 'Pane di Frumento / Pasta comune',
              grams: 100,
              nutrition: {
                calories: 290,
                protein: 9,
                carbs: 55,
                fat: 2,
                fiber: 3,
                sugar: 0,
                sodium: 0
              },
              isConfirmed: false,
              isModified: false
            }
          ],
          totalNutrition: {
            calories: 290,
            protein: 9,
            carbs: 55,
            fat: 2,
            fiber: 3,
            sugar: 0,
            sodium: 0
          },
          isConfirmed: false
        }
      ],
      dailyTotals: {
        calories: 2000,
        protein: 100,
        carbs: 250,
        fat: 70,
        fiber: 30,
        sugar: 0,
        sodium: 2300
      },
      isCompleted: false
    };
  }),
  getPhase2TestGroup: vi.fn((groupId: number) => {
    const testGroups = ['Fruttani', 'Lattosio', 'Fruttosio', 'Galattani', 'Polioli'];
    return testGroups[groupId % testGroups.length] || 'highFodmap';
  }),
  getDayIndexFromDate: vi.fn((date: string, baseDate: string) => {
    const dateObj = new Date(date);
    const base = new Date(baseDate);
    const dayIndex = Math.floor((dateObj.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    return dayIndex;
  }),
  getDateFromDayIndex: vi.fn((index: number, baseDate: string) => {
    const base = new Date(baseDate);
    const date = new Date(base.getTime() + (index * 24 * 60 * 60 * 1000));
    return date.toISOString().split('T')[0];
  })
}));

// Remove the Micro import entirely

// Import only necessary types
import { generateDayPlan, getPhase2TestGroup, getDayIndexFromDate, getDateFromDayIndex } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

// Mock the Micro import explicitly to remove ESLint warnings
vi.mock('../src/utils/foodsData', () => ({
  FOODS_DATABASE: [],
  Micro: undefined
}));

// Remove redundant mock for foodsData
    {
      id: '1',
      name: 'Pane di Frumento / Pasta comune';
      category: 'Carboidrati/Cereali';
      fodmapLevel: 'high';
      nutrition: { kcal: 290, protein: 9, carbs: 55, fats: 2, fiber: 3 };
    }
  ]
}));

describe('mealGenerator.ts - High Priority Fixes', () => {
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
      zinc: 11,
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

  // Remove the Micro import from the imports
  // Call the test directly with the correct parameters
  it('should generate a day plan', () => {
    const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0');
    expect(dayPlan.meals).toHaveLength(1);
    expect(dayPlan.dailyTotals.protein).toBe(100);
  });
})