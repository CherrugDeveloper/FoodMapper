import { useState, useCallback } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState, DayPlan, GeneratedMeal, MealPortion, DateKey } from '../types/dietPlan';
import { generateDayPlan, getDateFromDayIndex, getDayIndexFromDate } from '../utils/mealGenerator';

const STORAGE_KEY = 'foodmapper_diet_plan';
const VERSION = 1;
const MAX_DAYS_AHEAD = 3650; // Generate up to 10 years ahead for infinite maintenance
const DAYS_TO_GENERATE_AHEAD = 28; // Generate 28 days (4 full weeks) ahead to avoid partial rows
const DAYS_IN_PAST = 60; // Generate up to 60 days in the past



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
  startDate: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 4
): DayPlan => {
  const phase = getPhaseForDay(dayIndex);
  let phaseDay = 0;
  if (phase === 'phase0') {
    phaseDay = Math.max(0, dayIndex);
  } else if (phase === 'phase1') {
    phaseDay = Math.max(0, dayIndex - 7);
  } else if (phase === 'phase2') {
    phaseDay = Math.max(0, dayIndex - 28);
  } else {
    phaseDay = Math.max(0, dayIndex - 49);
  }
  const generated = generateDayPlan(results, userData, phase, dayIndex, phaseDay, startDate, mealCount);

  // Calculate actual date based on startDate + dayIndex
  const date = getDateFromDayIndex(dayIndex, startDate);

  const meals: GeneratedMeal[] = generated.meals.map(generatedMeal => {
    const portions: MealPortion[] = generatedMeal.portions.map(p => ({
      foodId: p.foodId,
      foodName: p.foodName,
      grams: p.grams,
      nutrition: p.nutrition,
      isConfirmed: false,
      isModified: false,
      originalGrams: p.grams,
      originalFoodId: p.foodId,
      reintroduced: p.reintroduced,
      testGroup: p.testGroup,
    }));

    return {
      name: generatedMeal.name,
      key: generatedMeal.key,
      portions,
      totalNutrition: generatedMeal.totalNutrition,
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


const generateAllDaysForInitialLoad = (
  results: NutritionalResults,
  userData: UserData | null,
  startDate: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 4
): DayPlan[] => {
  const newDays: DayPlan[] = [];
  for (let i = -DAYS_IN_PAST; i < MAX_DAYS_AHEAD; i++) {
    try {
      newDays.push(generateDayPlanForDay(i, results, userData, startDate, mealCount));
    } catch (error) {
      console.error(`Failed to generate day ${i}:`, error);
      break;
    }
  }
  return newDays;
};

export function useDietPlan(
  results: NutritionalResults | null,
  userData: UserData | null,
  dietStartDate: string | null
) {
  const [state, setState] = useState<DietPlanState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Use dietStartDate from context, fallback to today
    const effectiveStartDate = dietStartDate || new Date().toISOString().split('T')[0];
    
    const today = new Date().toISOString().split('T')[0];
    const initialDayIndex = Math.max(-DAYS_IN_PAST, Math.min(getDayIndexFromDate(today, effectiveStartDate), MAX_DAYS_AHEAD - 1));

    if (!stored) {
      const initialState: DietPlanState = {
        startDate: effectiveStartDate,
        currentDayIndex: initialDayIndex,
        days: [],
        userPreferences: {
          excludedFoods: [],
          preferredFoods: [],
          portionMultiplier: 1.0,
          mealCount: 4,
        },
      };
      // Generate initial days if results are available
      if (results) {
        initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate, initialState.userPreferences.mealCount);
      }
      return initialState;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed.version !== VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        const initialState: DietPlanState = {
          startDate: effectiveStartDate,
          currentDayIndex: initialDayIndex,
          days: [],
          userPreferences: {
            excludedFoods: [],
            preferredFoods: [],
            portionMultiplier: 1.0,
            mealCount: 4,
          },
        };
        if (results) {
          initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate, initialState.userPreferences.mealCount);
        }
        return initialState;
      }
      if (results && parsed.days && parsed.days.length > 0 && parsed.days[0].dayIndex > -DAYS_IN_PAST) {
        parsed.days = generateAllDaysForInitialLoad(results, userData, parsed.startDate, parsed.userPreferences?.mealCount || 4);
      }
      return parsed as DietPlanState;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      const initialState: DietPlanState = {
        startDate: effectiveStartDate,
        currentDayIndex: initialDayIndex,
        days: [],
        userPreferences: {
          excludedFoods: [],
          preferredFoods: [],
          portionMultiplier: 1.0,
          mealCount: 4,
        },
      };
      if (results) {
        initialState.days = generateAllDaysForInitialLoad(results, userData, initialState.startDate, initialState.userPreferences.mealCount);
      }
      return initialState;
    }
  });

  // Memoize the ensureDaysGenerated function to prevent unnecessary recalculations
  const memoizedEnsureDaysGenerated = useCallback((
    state: DietPlanState,
    results: NutritionalResults | null,
    userData: UserData | null,
    targetDate?: DateKey,
    saveState?: (newState: DietPlanState) => void
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

    // Generate days up to max(daysElapsed + DAYS_TO_GENERATE_AHEAD, targetLength), allowing dynamic expansion for infinite maintenance
    const effectiveMaxDays = Math.max(MAX_DAYS_AHEAD, targetLength + 365);
    const calculatedTargetLength = Math.min(
      Math.max(daysElapsed + DAYS_TO_GENERATE_AHEAD, targetLength),
      effectiveMaxDays
    );

    if (state.days.length >= calculatedTargetLength) return state;

    const mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = state.userPreferences.mealCount || 4;
    const newDays = [...state.days];
    for (let i = state.days.length; i < calculatedTargetLength; i++) {
      try {
        newDays.push(generateDayPlanForDay(i, results, userData, state.startDate, mealCount));
      } catch (error) {
        console.error(`Failed to generate day ${i}:`, error);
        break;
      }
    }

    const newState = {
      ...state,
      days: newDays,
    };

    // Persist immediately if saveState is provided
    if (saveState) {
      saveState(newState);
    }

    return newState;
  }, []);

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

  const regenerateDays = useCallback((
    newResults: NutritionalResults,
    newUserData: UserData | null
  ) => {
    setState(prev => {
      // Always regenerate days when results change to ensure meal targets match current nutritional goals
      const mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = prev.userPreferences.mealCount || 4;
      const generatedDays = generateAllDaysForInitialLoad(newResults, newUserData, prev.startDate, mealCount);
      const newState = {
        ...prev,
        days: generatedDays,
      };
      saveState(newState);
      return newState;
    });
  }, [saveState]);

  const confirmMeal = useCallback((dayIndex: number, mealKey: string) => {
    setState(prev => {
      // Ensure we have the day generated
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData);
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
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);

  const modifyMeal = useCallback((dayIndex: number, mealKey: string, modifications: Partial<MealPortion>[]) => {
    setState(prev => {
      // Ensure we have the day generated
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData);
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
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);

  const completeDay = useCallback((dayIndex: number) => {
    setState(prev => {
      // Ensure we have the day generated
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData);
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
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);


  const navigateDay = useCallback((delta: number) => {
    setState(prev => {
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData);
      let newDayIndex = prev.currentDayIndex + delta;
      
      newDayIndex = Math.max(-DAYS_IN_PAST, Math.min(newDayIndex, updatedState.days.length - 1));
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);

  const navigateToDate = useCallback((targetDate: DateKey) => {
    setState(prev => {
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData, targetDate);
      const targetDayIndex = getDayIndexFromDate(targetDate, updatedState.startDate);
      
      const newDayIndex = Math.max(-DAYS_IN_PAST, Math.min(targetDayIndex, updatedState.days.length - 1));
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);

  const updatePreferences = useCallback((preferences: Partial<DietPlanState['userPreferences']>) => {
    setState(prev => {
      // Ensure we have days generated with current preferences
      const updatedState = memoizedEnsureDaysGenerated(prev, results, userData);
      
      const updatedPreferences = {
        ...prev.userPreferences,
        ...preferences,
      };
      
      // If portion multiplier or mealCount changed, we need to regenerate days
      const mealCountChanged = preferences.mealCount !== undefined &&
          preferences.mealCount !== prev.userPreferences.mealCount;
      const portionMultiplierChanged = preferences.portionMultiplier !== undefined &&
          preferences.portionMultiplier !== prev.userPreferences.portionMultiplier;
      
      if ((mealCountChanged || portionMultiplierChanged) && results) {
        // Regenerate all days with new preferences
        const newMealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = preferences.mealCount ?? prev.userPreferences.mealCount;
        updatedState.days = generateAllDaysForInitialLoad(results, userData, updatedState.startDate, newMealCount);
      }
      
      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        userPreferences: updatedPreferences,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [results, userData, memoizedEnsureDaysGenerated, saveState]);

  // Ensure state is up-to-date with current results and persist generated days
  // This is now done in a useEffect to avoid render-time side effects
  const currentDay = state.days[state.currentDayIndex] || null;

  return {
    state,
    currentDay,
    confirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    updatePreferences,
    regenerateDays,
    isLoading: state.days.length === 0 && !!results,
  };
}
