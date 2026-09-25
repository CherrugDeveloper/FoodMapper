import { describe, it, expect, vi } from 'vitest';
import { 
  generateDayPlan, 
  getPhase2TestGroup, 
  getDayIndexFromDate, 
  getDateFromDayIndex 
} from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';
import type { DayPlan, MealPortion, DietPhase, MealKey, DateKey } from '../src/types/dietPlan';
import type { Micro } from '../src/utils/foodsData';

describe('mealGenerator.ts - High Priority Fixes', () => {
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

  const mockUserData: UserData = {
    weightKg: 75,
    heightCm: 180,
    ageYears: 30,
    biologicalSex: 'male',
    activityLevel: 'moderately_active',
    ibsType: 'IBS-D',
    conditions: [],
  };

  describe('Return types match types/dietPlan.ts (DayPlan, MealPortion)', () => {
    it('generateDayPlan returns DayPlan type', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      // Verify DayPlan structure
      expect(dayPlan).toHaveProperty('dayIndex');
      expect(dayPlan).toHaveProperty('phase');
      expect(dayPlan).toHaveProperty('phaseDay');
      expect(dayPlan).toHaveProperty('date');
      expect(dayPlan).toHaveProperty('meals');
      expect(dayPlan).toHaveProperty('dailyTotals');
      expect(dayPlan).toHaveProperty('isCompleted');
      
      // Verify types
      expect(typeof dayPlan.dayIndex).toBe('number');
      expect(['phase0', 'phase1', 'phase2', 'phase3']).toContain(dayPlan.phase);
      expect(typeof dayPlan.phaseDay).toBe('number');
      expect(typeof dayPlan.date).toBe('string');
      expect(Array.isArray(dayPlan.meals)).toBe(true);
      expect(typeof dayPlan.isCompleted).toBe('boolean');
    });

    it('generateDayPlan meals have correct GeneratedMeal structure', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      dayPlan.meals.forEach(meal => {
        expect(meal).toHaveProperty('name');
        expect(meal).toHaveProperty('key');
        expect(meal).toHaveProperty('portions');
        expect(meal).toHaveProperty('totalNutrition');
        expect(meal).toHaveProperty('isConfirmed');
        
        expect(typeof meal.name).toBe('string');
        expect(['colazione', 'pranzo', 'spuntino', 'cena']).toContain(meal.key);
        expect(Array.isArray(meal.portions)).toBe(true);
        expect(typeof meal.isConfirmed).toBe('boolean');
      });
    });

    it('generateDayPlan portions have correct MealPortion structure', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      dayPlan.meals.forEach(meal => {
        meal.portions.forEach(portion => {
          expect(portion).toHaveProperty('foodId');
          expect(portion).toHaveProperty('foodName');
          expect(portion).toHaveProperty('grams');
          expect(portion).toHaveProperty('nutrition');
          expect(portion).toHaveProperty('isConfirmed');
          expect(portion).toHaveProperty('isModified');
          
          expect(typeof portion.foodId).toBe('string');
          expect(typeof portion.foodName).toBe('string');
          expect(typeof portion.grams).toBe('number');
          expect(typeof portion.isConfirmed).toBe('boolean');
          expect(typeof portion.isModified).toBe('boolean');
          
          // Verify nutrition structure
          expect(portion.nutrition).toHaveProperty('calories');
          expect(portion.nutrition).toHaveProperty('protein');
          expect(portion.nutrition).toHaveProperty('carbs');
          expect(portion.nutrition).toHaveProperty('fat');
          expect(portion.nutrition).toHaveProperty('fiber');
          expect(portion.nutrition).toHaveProperty('sugar');
          expect(portion.nutrition).toHaveProperty('sodium');
        });
      });
    });

    it('dailyTotals has correct structure', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);
      
      expect(dayPlan.dailyTotals).toHaveProperty('calories');
      expect(dayPlan.dailyTotals).toHaveProperty('protein');
      expect(dayPlan.dailyTotals).toHaveProperty('carbs');
      expect(dayPlan.dailyTotals).toHaveProperty('fat');
      expect(dayPlan.dailyTotals).toHaveProperty('fiber');
      expect(dayPlan.dailyTotals).toHaveProperty('sugar');
      expect(dayPlan.dailyTotals).toHaveProperty('sodium');
      
      expect(typeof dayPlan.dailyTotals.calories).toBe('number');
      expect(typeof dayPlan.dailyTotals.protein).toBe('number');
      expect(typeof dayPlan.dailyTotals.carbs).toBe('number');
      expect(typeof dayPlan.dailyTotals.fat).toBe('number');
      expect(typeof dayPlan.dailyTotals.fiber).toBe('number');
      expect(typeof dayPlan.dailyTotals.sugar).toBe('number');
      expect(typeof dayPlan.dailyTotals.sodium).toBe('number');
    });
  });

  describe('foodById has null check, does not crash on missing ID', () => {
    it('getPhase2TestGroup handles null return properly', () => {
      // Test that getPhase2TestGroup returns null for out-of-range phaseDay
      const result = getPhase2TestGroup(100); // Way beyond the 5 groups * 3 days = 15 days
      expect(result).toBeNull();
    });

    it('getPhase2TestGroup returns correct groups for valid phaseDay', () => {
      expect(getPhase2TestGroup(0)).toBe('Fruttani');
      expect(getPhase2TestGroup(1)).toBe('Fruttani');
      expect(getPhase2TestGroup(2)).toBe('Fruttani');
      expect(getPhase2TestGroup(3)).toBe('Lattosio');
      expect(getPhase2TestGroup(5)).toBe('Lattosio');
      expect(getPhase2TestGroup(6)).toBe('Fruttosio');
      expect(getPhase2TestGroup(8)).toBe('Fruttosio');
      expect(getPhase2TestGroup(9)).toBe('Galattani');
      expect(getPhase2TestGroup(11)).toBe('Galattani');
      expect(getPhase2TestGroup(12)).toBe('Polioli');
      expect(getPhase2TestGroup(14)).toBe('Polioli');
    });

    it('generateDayPlan handles phase2 with test group correctly', () => {
      // This should not throw even if testGroupIds is empty
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase2', 0, 0);
      expect(dayPlan).toBeDefined();
      expect(dayPlan.phase).toBe('phase2');
    });

    it('generateDayPlan handles phase3 with reintroductions', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase3', 0, 0);
      expect(dayPlan).toBeDefined();
      expect(dayPlan.phase).toBe('phase3');
    });
  });

  describe('Date utilities', () => {
    it('getDayIndexFromDate calculates correct day index', () => {
      expect(getDayIndexFromDate('2024-01-01', '2024-01-01')).toBe(0);
      expect(getDayIndexFromDate('2024-01-02', '2024-01-01')).toBe(1);
      expect(getDayIndexFromDate('2024-01-15', '2024-01-01')).toBe(14);
    });

    it('getDateFromDayIndex calculates correct date', () => {
      expect(getDateFromDayIndex(0, '2024-01-01')).toBe('2024-01-01');
      expect(getDateFromDayIndex(1, '2024-01-01')).toBe('2024-01-02');
      expect(getDateFromDayIndex(14, '2024-01-01')).toBe('2024-01-15');
    });
  });
});