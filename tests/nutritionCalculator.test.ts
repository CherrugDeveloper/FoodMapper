import { describe, it, expect, vi } from 'vitest';
import { calculateTotalNutrition, analyzeNutritionStatus } from '../src/utils/nutritionCalculator';
import type { NutritionalResults } from '../src/utils/nutritionEngine';
import type { FoodItem, Micro } from '../src/utils/foodsData';
import type { DailyNutritionSummary, NutritionAnalysis } from '../src/utils/nutritionCalculator';

describe('nutritionCalculator.ts - High Priority Fixes', () => {
  const mockFoodItem: FoodItem = {
    id: '1',
    name: 'Test Food',
    category: 'Carboidrati/Cereali',
    fodmapLevel: 'low',
    nutrition: {
      kcal: 100,
      protein: 10,
      carbs: 20,
      fats: 5,
      fiber: 3,
      micronutrients: {
        potassium: 200,
        magnesium: 50,
        calcium: 100,
        iron: 2,
        zinc: 1,
        folate: 50,
        vitamin_a: 100,
        vitamin_c: 10,
        vitamin_d: 2,
        vitamin_e: 1,
        b12: 0.5,
        omega3: 100,
        selenium: 10,
        iodine: 20,
        sodium: 50,
      },
    },
  };

  const mockResults: NutritionalResults = {
    proteins: 100,
    fats: 70,
    carbs: 250,
    fiber: 30,
    waterLiters: 2.5,
    estimatedTotalEnergyKcal: 2000,
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
    } as Record<Micro, number>,
  };

  describe('NutritionalResults.micronutrients is Record<Micro, number>', () => {
    it('calculateTotalNutrition returns DailyNutritionSummary with Record<Micro, number>', () => {
      const result = calculateTotalNutrition([{ food: mockFoodItem, grams: 100 }]);
      
      // Verify all Micro keys are present
      const microKeys: Micro[] = [
        'potassium', 'magnesium', 'calcium', 'iron', 'zinc', 'folate',
        'vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'b12',
        'omega3', 'selenium', 'iodine'
      ];
      
      microKeys.forEach(key => {
        expect(result.micronutrients).toHaveProperty(key);
        expect(typeof result.micronutrients[key]).toBe('number');
      });
      
      // Verify it's a Record<Micro, number>
      expect(result.micronutrients).toEqual(expect.objectContaining(
        microKeys.reduce((acc, key) => ({ ...acc, [key]: expect.any(Number) }), {})
      ));
    });

    it('analyzeNutritionStatus accepts Record<Micro, number> for micros', () => {
      const current: DailyNutritionSummary = {
        totalKcal: 2000,
        totalProtein: 100,
        totalCarbs: 250,
        totalFats: 70,
        totalFiber: 30,
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
        } as Record<Micro, number>,
        sodium: 2000,
      };
      
      const analysis = analyzeNutritionStatus(current, mockResults);
      
      // Verify micros analysis has all Micro keys
      const microKeys: Micro[] = [
        'potassium', 'magnesium', 'calcium', 'iron', 'zinc', 'folate',
        'vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'b12',
        'omega3', 'selenium', 'iodine'
      ];
      
      microKeys.forEach(key => {
        expect(analysis.micros).toHaveProperty(key);
        expect(analysis.micros[key]).toHaveProperty('current');
        expect(analysis.micros[key]).toHaveProperty('target');
        expect(analysis.micros[key]).toHaveProperty('percentage');
        expect(analysis.micros[key]).toHaveProperty('status');
        expect(['deficient', 'adequate', 'excess']).toContain(analysis.micros[key].status);
      });
    });

    it('micronutrients calculation scales correctly with grams', () => {
      // 50g should give half the micronutrients
      const result100g = calculateTotalNutrition([{ food: mockFoodItem, grams: 100 }]);
      const result50g = calculateTotalNutrition([{ food: mockFoodItem, grams: 50 }]);
      
      const microKeys: Micro[] = [
        'potassium', 'magnesium', 'calcium', 'iron', 'zinc', 'folate',
        'vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'b12',
        'omega3', 'selenium', 'iodine'
      ];
      
      microKeys.forEach(key => {
        expect(result50g.micronutrients[key]).toBeCloseTo(result100g.micronutrients[key] / 2, 1);
      });
    });

    it('handles missing micronutrients gracefully', () => {
      const foodWithoutMicros: FoodItem = {
        ...mockFoodItem,
        nutrition: {
          ...mockFoodItem.nutrition,
          micronutrients: undefined,
        },
      };
      
      const result = calculateTotalNutrition([{ food: foodWithoutMicros, grams: 100 }]);
      
      // All micronutrients should be 0
      const microKeys: Micro[] = [
        'potassium', 'magnesium', 'calcium', 'iron', 'zinc', 'folate',
        'vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'b12',
        'omega3', 'selenium', 'iodine'
      ];
      
      microKeys.forEach(key => {
        expect(result.micronutrients[key]).toBe(0);
      });
    });

    it('handles partial micronutrients', () => {
      const foodWithPartialMicros: FoodItem = {
        ...mockFoodItem,
        nutrition: {
          ...mockFoodItem.nutrition,
          micronutrients: {
            potassium: 200,
            magnesium: 50,
            // Missing other micros
          },
        },
      };
      
      const result = calculateTotalNutrition([{ food: foodWithPartialMicros, grams: 100 }]);
      
      expect(result.micronutrients.potassium).toBe(200);
      expect(result.micronutrients.magnesium).toBe(50);
      expect(result.micronutrients.calcium).toBe(0);
      expect(result.micronutrients.iron).toBe(0);
    });
  });
});