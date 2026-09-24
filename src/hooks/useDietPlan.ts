import { useState, useCallback } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState, DayPlan, GeneratedMeal, MealPortion } from '../types/dietPlan';
import { generateDayPlan } from '../utils/mealGenerator';

const STORAGE_KEY = 'ibs-diet-plan';
const VERSION = 1;
const MAX_DAYS = 60;

const nutritionFromFood = (nutrition: {
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  micronutrients?: { sodium?: number };
}): MealPortion['nutrition'] => ({
  calories: nutrition.kcal,
  protein: nutrition.protein,
  carbs: nutrition.carbs,
  fat: nutrition.fats,
  fiber: nutrition.fiber,
  sugar: nutrition.carbs * 0.1,
  sodium: nutrition.micronutrients?.sodium ?? 0,
});

const getPhaseForDay = (dayIndex: number): 'phase0' | 'phase1' | 'phase2' | 'phase3' => {
  if (dayIndex < 7) return 'phase0';
  if (dayIndex < 28) return 'phase1';
  if (dayIndex < 49) return 'phase2';
  return 'phase3';
};

const generateDayPlanForDay = (
  dayIndex: number,
  results: NutritionalResults,
  userData: UserData | null
): DayPlan => {
  const phase = getPhaseForDay(dayIndex);
  const phaseDay = dayIndex - (phase === 'phase0' ? 0 : 7);
  const generated = generateDayPlan(results, userData, phase, dayIndex, phaseDay);

  const meals: GeneratedMeal[] = generated.meals.map(generatedMeal => {
    const portions: MealPortion[] = generatedMeal.portions.map(p => ({
      foodId: p.food.id,
      foodName: p.food.name,
      grams: p.grams,
      nutrition: nutritionFromFood(p.food.nutrition),
      isConfirmed: false,
      isModified: false,
      originalGrams: p.grams,
      originalFoodId: p.food.id,
      reintroduced: p.reintroduced,
      testGroup: p.testGroup,
    }));

    return {
      name: generatedMeal.mealKey,
      key: generatedMeal.mealKey,
      portions,
      totalNutrition: nutritionFromFood(generatedMeal.totals),
      isConfirmed: false,
    };
  });

  const dailyTotals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.totalNutrition.calories,
    protein: acc.protein + meal.totalNutrition.protein,
    carbs: acc.carbs + meal.totalNutrition.carbs,
    fat: acc.fat + meal.totalNutrition.fat,
    fiber: acc.fiber + meal.totalNutrition.fiber,
    sugar: acc.sugar + meal.totalNutrition.sugar,
    sodium: acc.sodium + meal.totalNutrition.sodium,
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  });

  return {
    dayIndex,
    phase,
    phaseDay,
    date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    meals,
    dailyTotals,
    isCompleted: false,
  };
};

const generateAllDays = (
  results: NutritionalResults,
  userData: UserData | null
): DayPlan[] => {
  const newDays: DayPlan[] = [];
  for (let i = 0; i < MAX_DAYS; i++) {
    try {
      newDays.push(generateDayPlanForDay(i, results, userData));
    } catch (error) {
      console.error(`Failed to generate day ${i}:`, error);
      break;
    }
  }
  return newDays;
};

export function useDietPlan(
  results: NutritionalResults | null,
  userData: UserData | null
) {
  const [state, setState] = useState<DietPlanState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initialState: DietPlanState = {
        startDate: new Date().toISOString().split('T')[0],
        currentDayIndex: 0,
        days: [],
        userPreferences: {
          excludedFoods: [],
          preferredFoods: [],
          portionMultiplier: 1.0,
        },
      };
      // Generate days immediately if results are available
      if (results) {
        initialState.days = generateAllDays(results, userData);
      }
      return initialState;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.version !== VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        const initialState: DietPlanState = {
          startDate: new Date().toISOString().split('T')[0],
          currentDayIndex: 0,
          days: [],
          userPreferences: {
            excludedFoods: [],
            preferredFoods: [],
            portionMultiplier: 1.0,
          },
        };
        if (results) {
          initialState.days = generateAllDays(results, userData);
        }
        return initialState;
      }
      return parsed as DietPlanState;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      const initialState: DietPlanState = {
        startDate: new Date().toISOString().split('T')[0],
        currentDayIndex: 0,
        days: [],
        userPreferences: {
          excludedFoods: [],
          preferredFoods: [],
          portionMultiplier: 1.0,
        },
      };
      if (results) {
        initialState.days = generateAllDays(results, userData);
      }
      return initialState;
    }
  });

  const saveState = useCallback((newState: DietPlanState) => {
    try {
      const stateToSave = {
        ...newState,
        version: VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save diet plan:', error);
    }
  }, []);


  const confirmMeal = useCallback((dayIndex: number, mealKey: string) => {
    setState(prev => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      if (!day) return prev;

      const newMeals = day.meals.map(meal => {
        if (meal.key === mealKey) {
          return {
            ...meal,
            isConfirmed: true,
            confirmedAt: new Date().toISOString(),
          };
        }
        return meal;
      });

      newDays[dayIndex] = {
        ...day,
        meals: newMeals,
      };

      const updatedState: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [saveState]);

  const modifyMeal = useCallback((dayIndex: number, mealKey: string, modifications: Partial<MealPortion>[]) => {
    setState(prev => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      if (!day) return prev;

      const newMeals = day.meals.map(meal => {
        if (meal.key === mealKey) {
          const newPortions = meal.portions.map((portion, idx) => {
            if (modifications[idx]) {
              return {
                ...portion,
                ...modifications[idx],
                isModified: true,
              };
            }
            return portion;
          });

          const newTotals = newPortions.reduce((acc, p) => ({
            calories: acc.calories + p.nutrition.calories,
            protein: acc.protein + p.nutrition.protein,
            carbs: acc.carbs + p.nutrition.carbs,
            fat: acc.fat + p.nutrition.fat,
            fiber: acc.fiber + p.nutrition.fiber,
            sugar: acc.sugar + p.nutrition.sugar,
            sodium: acc.sodium + p.nutrition.sodium,
          }), {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            fiber: 0,
            sugar: 0,
            sodium: 0,
          });

          return {
            ...meal,
            portions: newPortions,
            totalNutrition: newTotals,
          };
        }
        return meal;
      });

      newDays[dayIndex] = {
        ...day,
        meals: newMeals,
        dailyTotals: newMeals.reduce((acc, meal) => ({
          calories: acc.calories + meal.totalNutrition.calories,
          protein: acc.protein + meal.totalNutrition.protein,
          carbs: acc.carbs + meal.totalNutrition.carbs,
          fat: acc.fat + meal.totalNutrition.fat,
          fiber: acc.fiber + meal.totalNutrition.fiber,
          sugar: acc.sugar + meal.totalNutrition.sugar,
          sodium: acc.sodium + meal.totalNutrition.sodium,
        }), {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          sugar: 0,
          sodium: 0,
        }),
      };

      const updatedState: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [saveState]);

  const completeDay = useCallback((dayIndex: number) => {
    setState(prev => {
      const newDays = [...prev.days];
      const day = newDays[dayIndex];
      if (!day) return prev;

      newDays[dayIndex] = {
        ...day,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };

      const updatedState: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [saveState]);

  const navigateDay = useCallback((delta: number) => {
    setState(prev => {
      const newDayIndex = Math.max(0, Math.min(prev.days.length - 1, prev.currentDayIndex + delta));
      const updatedState: DietPlanState = {
        ...prev,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [saveState]);

  const updatePreferences = useCallback((preferences: Partial<DietPlanState['userPreferences']>) => {
    setState(prev => {
      const updatedPreferences = {
        ...prev.userPreferences,
        ...preferences,
      };

      const updatedState: DietPlanState = {
        ...prev,
        userPreferences: updatedPreferences,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [saveState]);


  const currentDay = state.days[state.currentDayIndex] || null;

  return {
    state,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    updatePreferences,
    isLoading: state.days.length === 0 && !!results,
  };
}
