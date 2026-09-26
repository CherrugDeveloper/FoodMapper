import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Recipe, GeneratedMeal, MealKey } from '../types/dietPlan';

const RECIPES_STORAGE_KEY = 'ibs-diet-plan-recipes';

export interface UseRecipesOptions {
  sourceDayIndex?: number;
  sourceMealName?: string;
}

export function useRecipes(options: UseRecipesOptions = {}) {
  void options;
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(RECIPES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Recipe[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
    } catch {
      // Storage may be full or unavailable; the in-memory state remains functional.
    }
  }, [recipes]);

  const saveFromMeal = useCallback((meal: Pick<GeneratedMeal, 'name' | 'key' | 'portions'> & {
    sourceDayIndex: number;
    sourceMealName?: string;
  }) => {
    const now = new Date().toISOString();
    const recipe: Recipe = {
      id: `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: meal.name,
      mealType: meal.key,
      portions: meal.portions.map((portion) => ({
        foodId: portion.foodId,
        foodName: portion.foodName,
        grams: portion.grams,
        nutrition: portion.nutrition,
        isConfirmed: portion.isConfirmed ?? false,
        isModified: portion.isModified ?? false,
      })),
      instructions: ['Preparare ogni porzione seguendo le indicazioni del piano alimentare. Aggiustare le quantità in base alla tolleranza individuale.'],
      prepTimeMinutes: 10,
      cookTimeMinutes: 15,
      difficulty: 'easy',
      tags: ['piano-alimentare', 'giorno'],
      sourceDayIndex: meal.sourceDayIndex,
      isCustom: false,
      servings: 1,
      createdAt: now,
      updatedAt: now,
    };
    setRecipes((prev) => [recipe, ...prev]);
    return recipe;
  }, []);

  const addCustomRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      isCustom: true,
      createdAt: now,
      updatedAt: now,
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    return newRecipe;
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes((prev) => prev.map((recipe) => (
      recipe.id === id ? { ...recipe, ...updates, updatedAt: new Date().toISOString() } : recipe
    )));
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }, []);

  const groupedRecipes = useMemo(() => {
    return recipes.reduce<Record<MealKey, Recipe[]>>((groups, recipe) => {
      groups[recipe.mealType] = [...(groups[recipe.mealType] || []), recipe];
      return groups;
    }, {
      colazione: [],
      pranzo: [],
      spuntino: [],
      cena: [],
    });
  }, [recipes]);

  return {
    recipes,
    groupedRecipes,
    saveFromMeal,
    addCustomRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
