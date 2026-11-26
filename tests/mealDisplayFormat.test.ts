import { describe, it, expect } from 'vitest';
import { formatMealForCopy, getUnitDisplay } from '../src/utils/mealCopyFormatter';
import type { MealPortion, GeneratedMeal } from '../src/types/dietPlan';

/**
 * Helper per costruire una MealPortion di test con valori di default sensati.
 */
const makePortion = (overrides: Partial<MealPortion> & { foodName: string; grams: number }): MealPortion => ({
  foodId: '0',
  foodName: overrides.foodName,
  grams: overrides.grams,
  nutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  },
  isConfirmed: false,
  isModified: false,
  ...overrides,
});

/**
 * Helper per costruire un GeneratedMeal di test a partire da un array di porzioni.
 */
const makeMeal = (portions: MealPortion[]): GeneratedMeal => ({
  name: 'Pasto',
  key: 'pranzo',
  portions,
  totalNutrition: {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  },
  isConfirmed: false,
});

describe('Meal display formatting fixes', () => {
  describe('Patata: peso atteso reale (da ~Xg)', () => {
    it('mostra il peso reale della porzione, non un valore hardcoded', () => {
      const meal = makeMeal([makePortion({ foodName: 'Patate', grams: 180 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('1 patata (da ~180g)');
    });

    it('usa il peso effettivo quando la porzione è diversa da 180g', () => {
      const meal = makeMeal([makePortion({ foodName: 'Patate', grams: 360 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('2 patate (da ~360g)');
    });
  });

  describe('Arancia: peso atteso reale (da ~Xg)', () => {
    it('mostra il peso reale della porzione', () => {
      const meal = makeMeal([makePortion({ foodName: 'Arance', grams: 150 })]);
      const text = formatMealForCopy(meal, 'Colazione');
      expect(text).toContain('1 arancia (da ~150g)');
    });
  });

  describe('Peperoni: numero intero + peso atteso', () => {
    it('mostra il numero di peperoni invece dei grammi', () => {
      const meal = makeMeal([makePortion({ foodName: 'Peperoni rossi', grams: 150 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('1 peperone (da ~150g)');
    });

    it('mostra più peperoni per porzioni grandi', () => {
      const meal = makeMeal([makePortion({ foodName: 'Peperoni', grams: 300 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('2 peperoni (da ~300g)');
    });
  });

  describe('Melanzane: numero intero + peso atteso', () => {
    it('mostra il numero di melanzane invece dei grammi', () => {
      const meal = makeMeal([makePortion({ foodName: 'Melanzane', grams: 200 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('1 melanzana (da ~200g)');
    });
  });

  describe('Cioccolato: quadretti invece di grammi', () => {
    it('mostra i quadretti per il cioccolato fondente', () => {
      const meal = makeMeal([makePortion({ foodName: 'Cioccolato fondente', grams: 20 })]);
      const text = formatMealForCopy(meal, 'Spuntino');
      expect(text).toContain('2 quadretti (da ~20g)');
    });

    it('mostra 1 quadretto per 10g', () => {
      const meal = makeMeal([makePortion({ foodName: 'Cioccolato fondente', grams: 10 })]);
      const text = formatMealForCopy(meal, 'Spuntino');
      expect(text).toContain('1 quadretto (da ~10g)');
    });
  });

  describe('Petto di pollo: no precisione al grammo', () => {
    it('arrotonda a multipli di 10g', () => {
      const meal = makeMeal([makePortion({ foodName: 'Petto di pollo', grams: 241 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('~240g');
      expect(text).not.toContain('241g');
    });

    it('arrotonda correttamente 247g a 250g', () => {
      const meal = makeMeal([makePortion({ foodName: 'Petto di pollo', grams: 247 })]);
      const text = formatMealForCopy(meal, 'Pranzo');
      expect(text).toContain('~250g');
    });
  });

  describe('Porzioni con quantità nulla', () => {
    it('non mostra porzioni con grams=0 e unitValue=0', () => {
      const meal = makeMeal([
        makePortion({ foodName: 'Semi di Chia', grams: 0, unit: 'cucchiai', unitValue: 0 }),
        makePortion({ foodName: 'Riso', grams: 80 }),
      ]);
      const text = formatMealForCopy(meal, 'Colazione');
      expect(text).not.toContain('Semi di Chia');
      expect(text).toContain('Riso');
    });

    it('non mostra porzioni con grams=0 senza unitValue', () => {
      const meal = makeMeal([
        makePortion({ foodName: 'Semi di Chia', grams: 0 }),
        makePortion({ foodName: 'Riso', grams: 80 }),
      ]);
      const text = formatMealForCopy(meal, 'Colazione');
      expect(text).not.toContain('Semi di Chia');
    });
  });

  describe('getUnitDisplay per MealCard', () => {
    it('mostra quadretti per il cioccolato', () => {
      const portion = makePortion({ foodName: 'Cioccolato fondente', grams: 20 });
      expect(getUnitDisplay(portion)).toBe('2 quadretti');
    });

    it('mostra melanzane intere', () => {
      const portion = makePortion({ foodName: 'Melanzane', grams: 200 });
      expect(getUnitDisplay(portion)).toBe('1 melanzana');
    });

    it('arrotonda il petto di pollo a 10g', () => {
      const portion = makePortion({ foodName: 'Petto di pollo', grams: 241 });
      expect(getUnitDisplay(portion)).toBe('240g');
    });
  });
});
