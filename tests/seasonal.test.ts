import { describe, it, expect, vi } from 'vitest';
import { generateDayPlan } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

const mockResults: NutritionalResults = {
  proteins: 150,
  fats: 70,
  carbs: 200,
  fiber: 25,
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

// Mock Date for November (inverno - lamponi non disponibili)
vi.setSystemTime(new Date('2026-11-15'));

describe('Seasonal Food Filtering', () => {
  describe('Inverno (novembre)', () => {
    it('NON deve generare lamponi perché non sono in stagione', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', undefined, 5);
      
      const allFoodNames = dayPlan.meals
        .flatMap(m => m.portions)
        .map(p => p.foodName.toLowerCase());
      
      // I lamponi non devono apparire in inverno
      expect(allFoodNames.some(name => name.includes('lampon'))).toBe(false);
    });

    it('deve usare Farina di Riso come alternativa carboidrato snack in inverno', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', undefined, 5);
      
      const snackMorningPortions = dayPlan.meals.find(m => m.key === 'spuntinoMattina')?.portions || [];
      const carbInMorningSnack = snackMorningPortions.find(p => 
        p.foodName.toLowerCase().includes('riso') || 
        p.foodName.toLowerCase().includes('polenta')
      );
      
      // La farina di riso deve essere disponibile come alternativa
      expect(carbInMorningSnack).toBeDefined();
    });

    it('NON deve duplicare la banana nello stesso pasto', () => {
      const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', undefined, 5);
      
      const snackMorningPortions = dayPlan.meals.find(m => m.key === 'spuntinoMattina')?.portions || [];
      const bananaCount = snackMorningPortions.filter(p => 
        p.foodName.toLowerCase().includes('banana')
      ).length;
      
      // La banana deve apparire una sola volta per pasto
      expect(bananaCount).toBeLessThanOrEqual(1);
    });
  });
});

// Ripristiniamo il tempo reale dopo i test
vi.useRealTimers();