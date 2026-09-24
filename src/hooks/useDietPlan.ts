import { useState, useCallback } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState, DayPlan, GeneratedMeal, MealPortion, DateKey } from '../types/dietPlan';
import { generateDayPlan } from '../utils/mealGenerator';

const STORAGE_KEY = 'ibs-diet-plan';
const VERSION = 1;
const MAX_DAYS_AHEAD = 365; // Generate up to 1 year ahead
const DAYS_TO_GENERATE_AHEAD = 30; // Generate 30 days ahead when needed

/** Helper to get day index from date string */
const getDayIndexFromDate = (date: DateKey, startDate: DateKey): number => {
  const start = new Date(startDate);
  const target = new Date(date);
  const diffTime = target.getTime() - start.getTime();
  return Math.floor(diffTime / (24 * 60 * 60 * 1000));
};


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
  userData: UserData | null,
  startDate: string
): DayPlan => {
  const phase = getPhaseForDay(dayIndex);
  const phaseDay = dayIndex - (phase === 'phase0' ? 0 : 7);
  const generated = generateDayPlan(results, userData, phase, dayIndex, phaseDay);

  // Calculate actual date based on startDate + dayIndex
  const date = new Date(
    new Date(startDate).getTime() + dayIndex * 24 * 60 * 60 * 1000
  ).toISOString().split('T')[0];

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
    date,
    meals,
    dailyTotals,
    isCompleted: false,
  };
};

const ensureDaysGenerated = (
  state: DietPlanState,
  results: NutritionalResults | null,
  userData: UserData | null,
  targetDate?: DateKey
): DietPlanState => {
  if (!results || !state.startDate) return state;

  const currentDate = new Date();
  const startDate = new Date(state.startDate);
  const daysElapsed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
  );

  // If targetDate is provided, calculate the target day index
  let targetLength = state.days.length;
  if (targetDate) {
    const targetDayIndex = getDayIndexFromDate(targetDate, state.startDate);
    targetLength = Math.max(targetLength, targetDayIndex + 1);
  }

  // Generate days up to max(daysElapsed + DAYS_TO_GENERATE_AHEAD, targetLength)
  const calculatedTargetLength = Math.min(
    Math.max(daysElapsed + DAYS_TO_GENERATE_AHEAD, targetLength),
    MAX_DAYS_AHEAD
  );

  if (state.days.length >= calculatedTargetLength) return state;

  const newDays = [...state.days];
  for (let i = state.days.length; i < calculatedTargetLength; i++) {
    try {
      newDays.push(generateDayPlanForDay(i, results, userData, state.startDate));
    } catch (error) {
      console.error(`Failed to generate day ${i}:`, error);
      break;
    }
  }

  return {
    ...state,
    days: newDays,
  };
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
      // Generate initial days if results are available
      if (results) {
        initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate);
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
          initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate);
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
        initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate);
      }
      return initialState;
    }
  });

  const generateAllDaysForInitialLoad = (
    results: NutritionalResults,
    userData: UserData | null,
    startDate: string
  ): DayPlan[] => {
    const newDays: DayPlan[] = [];
    for (let i = 0; i < Math.min(DAYS_TO_GENERATE_AHEAD, MAX_DAYS_AHEAD); i++) {
      try {
        newDays.push(generateDayPlanForDay(i, results, userData, startDate));
      } catch (error) {
        console.error(`Failed to generate day ${i}:`, error);
        break;
      }
    }
    return newDays;
  };

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
      // Ensure we have the day generated
      const updatedState = ensureDaysGenerated(prev, results, userData);
      const newDays = [...updatedState.days];
      const day = newDays[dayIndex];
      if (!day) return updatedState;

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

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);

  const modifyMeal = useCallback((dayIndex: number, mealKey: string, modifications: Partial<MealPortion>[]) => {
    setState(prev => {
      // Ensure we have the day generated
      const updatedState = ensureDaysGenerated(prev, results, userData);
      const newDays = [...updatedState.days];
      const day = newDays[dayIndex];
      if (!day) return updatedState;

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

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);

  const completeDay = useCallback((dayIndex: number) => {
    setState(prev => {
      // Ensure we have the day generated
      const updatedState = ensureDaysGenerated(prev, results, userData);
      const newDays = [...updatedState.days];
      const day = newDays[dayIndex];
      if (!day) return updatedState;

      newDays[dayIndex] = {
        ...day,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);


  const navigateDay = useCallback((delta: number) => {
    setState(prev => {
      // Ensure we have enough days for navigation
      let updatedState = ensureDaysGenerated(prev, results, userData);
      
      // Calculate new day index with bounds checking
      let newDayIndex = prev.currentDayIndex + delta;
      
      // If navigating forward beyond current days, generate more days
      if (newDayIndex >= updatedState.days.length && results) {
        // Generate days up to the target index
        const targetIndex = Math.min(newDayIndex, MAX_DAYS_AHEAD - 1);
        while (updatedState.days.length <= targetIndex) {
          const dayIndexToGenerate = updatedState.days.length;
          try {
            updatedState.days.push(
              generateDayPlanForDay(dayIndexToGenerate, results, userData, updatedState.startDate)
            );
          } catch (error) {
            console.error(`Failed to generate day ${dayIndexToGenerate}:`, error);
            break;
          }
        }
      }
      
      // Clamp to valid range
      newDayIndex = Math.max(0, Math.min(newDayIndex, updatedState.days.length - 1));
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);

  const navigateToDate = useCallback((targetDate: DateKey) => {
    setState(prev => {
      // Ensure we have the day generated for the target date
      let updatedState = ensureDaysGenerated(prev, results, userData, targetDate);
      
      // Calculate day index from target date
      const targetDayIndex = getDayIndexFromDate(targetDate, updatedState.startDate);
      
      // Clamp to valid range
      const newDayIndex = Math.max(0, Math.min(targetDayIndex, updatedState.days.length - 1));
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);

  const updatePreferences = useCallback((preferences: Partial<DietPlanState['userPreferences']>) => {
    setState(prev => {
      // Ensure we have days generated with current preferences
      let updatedState = ensureDaysGenerated(prev, results, userData);
      
      const updatedPreferences = {
        ...prev.userPreferences,
        ...preferences,
      };
      
      // If portion multiplier changed, we need to regenerate days
      if (preferences.portionMultiplier !== undefined &&
          preferences.portionMultiplier !== prev.userPreferences.portionMultiplier && results) {
        // Regenerate all days with new preferences
        updatedState.days = generateAllDaysForInitialLoad(results, userData, updatedState.startDate);
      }
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        userPreferences: updatedPreferences,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, saveState]);

  // Ensure state is up-to-date with current results
  const updatedStateWithResults = ensureDaysGenerated(state, results, userData);
  
  const currentDay = updatedStateWithResults.days[updatedStateWithResults.currentDayIndex] || null;

  return {
    state: updatedStateWithResults,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    updatePreferences,
    isLoading: updatedStateWithResults.days.length === 0 && !!results,
  };
}
