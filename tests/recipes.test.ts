import { describe, it, expect, vi } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));
import { renderHook, act } from '@testing-library/react';
import { useRecipes } from '../src/hooks/useRecipes';
import {
  RECIPES_DATABASE,
  calculateRecipeMacros,
  isRecipeLowFODMAP,
  getRecipeSeasons,
  getRecipeProteins,
} from '../src/utils/recipesData';
import type { Recipe } from '../src/types/dietPlan';

describe('Recipe System', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('recipesData', () => {
    it('should have at least 20 predefined recipes', () => {
      expect(RECIPES_DATABASE.length).toBeGreaterThanOrEqual(20);
    });

    it('should cover all main meal categories', () => {
      const mealTypes = new Set(RECIPES_DATABASE.map(r => r.mealType));
      expect(mealTypes.has('colazione')).toBe(true);
      expect(mealTypes.has('pranzo')).toBe(true);
      expect(mealTypes.has('cena')).toBe(true);
      expect(mealTypes.has('spuntino')).toBe(true);
    });

    it('should calculate macros correctly', () => {
      const recipe = RECIPES_DATABASE[0];
      const macros = calculateRecipeMacros(recipe);
      
      expect(macros.total.calories).toBeGreaterThan(0);
      expect(macros.total.protein).toBeGreaterThan(0);
      expect(macros.total.carbs).toBeGreaterThan(0);
      expect(macros.total.fat).toBeGreaterThan(0);
      
      expect(macros.perServing.calories).toBe(Math.round(macros.total.calories / recipe.servings));
    });

    it('should identify low-FODMAP recipes', () => {
      // Find a recipe with known low-FODMAP ingredients
      const lowFodmapRecipe = RECIPES_DATABASE.find(r => r.tags.includes('low-fodmap'));
      expect(lowFodmapRecipe).toBeDefined();
      if (lowFodmapRecipe) {
        expect(isRecipeLowFODMAP(lowFodmapRecipe)).toBe(true);
      }
    });

    it('should extract seasonality months', () => {
      const seasonalRecipe = RECIPES_DATABASE.find(r => r.name.includes('Zucchine'));
      expect(seasonalRecipe).toBeDefined();
      if (seasonalRecipe) {
        const seasons = getRecipeSeasons(seasonalRecipe);
        expect(seasons.length).toBeGreaterThan(0);
      }
    });

    it('should extract main proteins', () => {
      const fishRecipe = RECIPES_DATABASE.find(r => r.name.includes('Branzino'));
      expect(fishRecipe).toBeDefined();
      if (fishRecipe) {
        const proteins = getRecipeProteins(fishRecipe);
        expect(proteins.length).toBeGreaterThan(0);
      }
    });
  });

  describe('useRecipes Hook', () => {
    it('should initialize with empty custom recipes if localStorage is empty', () => {
      const { result } = renderHook(() => useRecipes());
      expect(result.current.recipes).toEqual([]);
    });

    it('should add a custom recipe and persist to localStorage', () => {
      const { result } = renderHook(() => useRecipes());

      const newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Test Custom Recipe',
        mealType: 'pranzo',
        servings: 2,
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        difficulty: 'easy',
        tags: ['custom', 'test'],
        isCustom: true,
        sourceDayIndex: -1,
        portions: [
          {
            foodId: '2',
            foodName: 'Riso Bianco e Integrale',
            grams: 150,
            nutrition: { calories: 540, protein: 10, carbs: 120, fat: 0.6, fiber: 2, sugar: 0, sodium: 7.5 },
            isConfirmed: false,
            isModified: false,
          },
        ],
        instructions: ['Test step 1', 'Test step 2'],
      };

      act(() => {
        result.current.addCustomRecipe(newRecipe);
      });

      expect(result.current.recipes.length).toBe(1);
      expect(result.current.recipes[0].name).toBe('Test Custom Recipe');
      expect(result.current.recipes[0].isCustom).toBe(true);

      const saved = JSON.parse(localStorage.getItem('foodmapper_recipes') || '[]');
      expect(saved.length).toBe(1);
      expect(saved[0].name).toBe('Test Custom Recipe');
    });

    it('should update a custom recipe', () => {
      const { result } = renderHook(() => useRecipes());

      let createdId = '';
      act(() => {
        const created = result.current.addCustomRecipe({
          name: 'Original Name',
          mealType: 'pranzo',
          servings: 1,
          prepTimeMinutes: 5,
          cookTimeMinutes: 5,
          difficulty: 'easy',
          tags: [],
          isCustom: true,
          sourceDayIndex: -1,
          portions: [],
          instructions: [],
        });
        createdId = created.id;
      });

      act(() => {
        result.current.updateRecipe(createdId, { name: 'Updated Name' });
      });

      expect(result.current.recipes[0].name).toBe('Updated Name');
    });

    it('should delete a custom recipe', () => {
      const { result } = renderHook(() => useRecipes());

      let createdId = '';
      act(() => {
        const created = result.current.addCustomRecipe({
          name: 'To Delete',
          mealType: 'pranzo',
          servings: 1,
          prepTimeMinutes: 5,
          cookTimeMinutes: 5,
          difficulty: 'easy',
          tags: [],
          isCustom: true,
          sourceDayIndex: -1,
          portions: [],
          instructions: [],
        });
        createdId = created.id;
      });

      expect(result.current.recipes.length).toBe(1);

      act(() => {
        result.current.deleteRecipe(createdId);
      });

      expect(result.current.recipes.length).toBe(0);
    });
  });
});