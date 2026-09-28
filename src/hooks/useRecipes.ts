import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Recipe, GeneratedMeal, MealKey } from '../types/dietPlan';
import type { UserData, HealthCondition } from '../utils/nutritionEngine';
import { FOODS_DATABASE } from '../utils/foodsData';

const RECIPES_STORAGE_KEY = 'foodmapper_recipes';

export interface UseRecipesOptions {
  sourceDayIndex?: number;
  sourceMealName?: string;
  userData?: UserData | null;
  showOnlyCompatible?: boolean;
}

interface RecipeCompatibility {
  isCompatible: boolean;
  problematicIngredients: string[];
  warnings: string[];
}

function checkRecipeCompatibility(recipe: Recipe, userData: UserData | null): RecipeCompatibility {
  if (!userData) {
    return { isCompatible: true, problematicIngredients: [], warnings: [] };
  }

  const problematicIngredients: string[] = [];
  const warnings: string[] = [];

  const conditions = userData.conditions ?? [];
  const allergens = userData.allergens ?? [];
  // Note: intolerances and preferences would need to be added to UserData type
  // For now we use conditions and allergens

  recipe.portions.forEach((portion) => {
    const food = FOODS_DATABASE.find((f) => f.id === portion.foodId);
    if (!food) return;

    // Check trigger groups (FODMAP) against conditions
    if (food.triggerGroup) {
      const conditionMap: Record<string, HealthCondition[]> = {
        Fruttani: ['celiac', 'diabetes_type1', 'diabetes_type2'],
        Lattosio: ['celiac'],
        Fruttosio: ['diabetes_type1', 'diabetes_type2'],
        Galattani: ['celiac'],
        Polioli: ['diabetes_type1', 'diabetes_type2'],
      };
      const relatedConditions = conditionMap[food.triggerGroup] ?? [];
      if (relatedConditions.some((c) => conditions.includes(c))) {
        problematicIngredients.push(`${portion.foodName} (${food.triggerGroup})`);
        warnings.push(`Contiene ${food.triggerGroup} - attenzione per ${relatedConditions.map(c => c.replace('_', ' ')).join(', ')}`);
      }
    }

    // Check allergens
    if (food.allergens) {
      food.allergens.forEach((allergen) => {
        if (allergens.includes(allergen)) {
          problematicIngredients.push(`${portion.foodName} (allergene: ${allergen})`);
          warnings.push(`Contiene allergene: ${allergen}`);
        }
      });
    }

    // Check for high FODMAP foods if user has IBS-related conditions
    if (food.fodmapLevel === 'high' && (conditions.includes('celiac') || conditions.includes('diabetes_type1') || conditions.includes('diabetes_type2'))) {
      problematicIngredients.push(`${portion.foodName} (FODMAP alto)`);
      warnings.push(`Alimento ad alto contenuto FODMAP`);
    }
  });

  return {
    isCompatible: problematicIngredients.length === 0,
    problematicIngredients,
    warnings,
  };
}

export function useRecipes(options: UseRecipesOptions = {}) {
  const { userData = null, showOnlyCompatible = false } = options;
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

  const filteredRecipes = useMemo(() => {
    if (!showOnlyCompatible || !userData) return recipes;
    return recipes.filter((recipe) => checkRecipeCompatibility(recipe, userData).isCompatible);
  }, [recipes, userData, showOnlyCompatible]);

  const groupedRecipes = useMemo(() => {
    return filteredRecipes.reduce<Record<MealKey, Recipe[]>>((groups, recipe) => {
      groups[recipe.mealType] = [...(groups[recipe.mealType] || []), recipe];
      return groups;
    }, {
      colazione: [],
      pranzo: [],
      spuntino: [],
      cena: [],
    });
  }, [filteredRecipes]);

  const getRecipeCompatibility = useCallback((recipe: Recipe) => {
    return checkRecipeCompatibility(recipe, userData);
  }, [userData]);

  return {
    recipes: filteredRecipes,
    allRecipes: recipes,
    groupedRecipes,
    saveFromMeal,
    addCustomRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeCompatibility,
  };
}
