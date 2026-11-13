import { useState, useCallback, useRef, useEffect } from 'react';
import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState, DayPlan, GeneratedMeal, MealPortion, DateKey, MealKey } from '../types/dietPlan';
import { generateDayPlan, getDateFromDayIndex, getDayIndexFromDate } from '../utils/mealGenerator';
import { FOODS_DATABASE } from '../utils/foodsData';

const STORAGE_KEY = 'foodmapper_diet_plan';
const DIARY_STORAGE_KEY = 'foodmapper_diary_v1';
const VERSION = 1;
const MAX_DAYS_AHEAD = 3650; // Generate up to 10 years ahead for infinite maintenance
const DAYS_TO_GENERATE_AHEAD = 60; // Generate 60 days ahead dynamically on demand

// Map Italian MealKey to Diary MealField
// Morning snacks (spuntinoMattina) → breakfast, afternoon snacks (spuntinoPomeriggio) → snack, evening snacks (spuntinoSera) → dinner
const mealKeyToMealField: Record<MealKey, 'breakfast' | 'lunch' | 'snack' | 'dinner'> = {
  colazione: 'breakfast',
  spuntinoMattina: 'breakfast', // Morning snack maps to breakfast in diary
  pranzo: 'lunch',
  spuntinoPomeriggio: 'snack', // Afternoon snack maps to snack in diary
  spuntino: 'snack',
  spuntinoSera: 'dinner', // Evening snack maps to dinner in diary
  cena: 'dinner',
};

interface DiaryFoodEntry {
  foodId: string;
  food: typeof FOODS_DATABASE[number];
  grams: number;
}

interface DiaryStore {
  [dateKey: string]: {
    meals: Record<'breakfast' | 'lunch' | 'snack' | 'dinner', string>;
    foodEntries: Record<'breakfast' | 'lunch' | 'snack' | 'dinner', DiaryFoodEntry[]>;
    [key: string]: unknown;
  };
}

// Store format includes version field
interface StoredDietPlanState extends DietPlanState {
  version: number;
}

const loadDiaryStore = (): DiaryStore => {
  try {
    const raw = localStorage.getItem(DIARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveDiaryEntry = (dateKey: string, mealField: 'breakfast' | 'lunch' | 'snack' | 'dinner', newFoodEntry: DiaryFoodEntry) => {
  const store = loadDiaryStore();
  if (!store[dateKey]) {
    store[dateKey] = {
      meals: { breakfast: '', lunch: '', snack: '', dinner: '' },
      foodEntries: { breakfast: [], lunch: [], snack: [], dinner: [] },
    };
  }
  if (!store[dateKey].foodEntries[mealField]) {
    store[dateKey].foodEntries[mealField] = [];
  }
  store[dateKey].foodEntries[mealField] = [...store[dateKey].foodEntries[mealField], newFoodEntry];
  localStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(store));
};

const toISODate = (d: Date): string => d.toISOString().split('T')[0];

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
  const phaseDay = phase === 'phase0'
    ? Math.max(0, dayIndex)
    : phase === 'phase1'
    ? Math.max(0, dayIndex - 7)
    : phase === 'phase2'
    ? Math.max(0, dayIndex - 28)
    : Math.max(0, dayIndex - 49);
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


const generateDaysWindow = (
  startIdx: number,
  endIdx: number,
  results: NutritionalResults,
  userData: UserData | null,
  startDate: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 4
): DayPlan[] => {
  const newDays: DayPlan[] = [];
  for (let i = startIdx; i <= endIdx; i++) {
    try {
      newDays.push(generateDayPlanForDay(i, results, userData, startDate, mealCount));
    } catch (error) {
      console.error(`Failed to generate day ${i}:`, error);
      break;
    }
  }
  return newDays;
};

const generateInitialDaysWindow = (
  results: NutritionalResults,
  userData: UserData | null,
  startDate: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 4,
  centerDayIndex: number = 0
): DayPlan[] => {
  // Generate only 60 days ahead, no days in past
  const startIdx = centerDayIndex;
  const endIdx = Math.min(MAX_DAYS_AHEAD, centerDayIndex + DAYS_TO_GENERATE_AHEAD);
  return generateDaysWindow(startIdx, endIdx, results, userData, startDate, mealCount);
};

export function useDietPlan(
  results: NutritionalResults | null,
  userData: UserData | null,
  dietStartDate: string | null
) {
  // Refs to avoid stale closure issues in React 19
  const resultsRef = useRef(results);
  const userDataRef = useRef(userData);
  
  // Update refs when values change
  resultsRef.current = results;
  userDataRef.current = userData;

  // Track whether we loaded from localStorage (to preserve stored currentDayIndex)
  const loadedFromStorageRef = useRef<boolean>(false);

  // Memoize the saveState function first so it can be used throughout
  const saveState = useCallback((newState: DietPlanState) => {
    try {
      const stateToSave: StoredDietPlanState = {
        ...newState,
        version: VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save diet plan:', error);
    }
  }, []);

  // Initialize state with defaults - NO heavy generation here to avoid blocking render
  const [state, setState] = useState<DietPlanState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const effectiveStartDate = dietStartDate || new Date().toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const initialDayIndex = Math.max(0, Math.min(getDayIndexFromDate(today, effectiveStartDate), MAX_DAYS_AHEAD - 1));

    if (!stored) {
      return {
        startDate: effectiveStartDate,
        currentDayIndex: initialDayIndex,
        days: [], // Empty days - will be populated in useEffect
        userPreferences: {
          excludedFoods: [],
          preferredFoods: [],
          portionMultiplier: 1.0,
          mealCount: 4,
        },
      };
    }

    try {
      const parsed = JSON.parse(stored) as StoredDietPlanState;
      if (parsed.version !== VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return {
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
      }
      // Mark that we loaded from storage
      loadedFromStorageRef.current = true;
      // Validate stored state has required fields
      const hydratedState: DietPlanState = {
        startDate: parsed.startDate || effectiveStartDate,
        currentDayIndex: parsed.currentDayIndex ?? initialDayIndex,
        days: parsed.days ?? [],
        userPreferences: {
          excludedFoods: parsed.userPreferences?.excludedFoods ?? [],
          preferredFoods: parsed.userPreferences?.preferredFoods ?? [],
          portionMultiplier: parsed.userPreferences?.portionMultiplier ?? 1.0,
          mealCount: parsed.userPreferences?.mealCount ?? 4,
        },
      };
      return hydratedState;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return {
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
    }
  });

  // Effect to generate initial days window after first render (avoids blocking render phase)
  useEffect(() => {
    if (!results || !state.startDate) return;

    // If days are already populated from storage, nothing to do
    if (state.days.length > 0) return;

    const mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = state.userPreferences.mealCount || 4;

    // Check if we loaded state from localStorage
    // If days array is empty but we had stored state, preserve the currentDayIndex
    const wasLoadedFromStorage = loadedFromStorageRef.current;

    if (wasLoadedFromStorage) {
      // Days from storage were empty, but currentDayIndex was preserved from storage
      // Just generate days using the stored currentDayIndex as center
      const generatedDays = generateInitialDaysWindow(results, userData, state.startDate, mealCount, state.currentDayIndex);
      setState(prev => {
        const updatedState: DietPlanState = {
          ...prev,
          days: generatedDays,
        };
        saveState(updatedState);
        return updatedState;
      });
      return;
    }

    // Brand new initialization - calculate initialDayIndex based on today
    const today = new Date().toISOString().split('T')[0];
    const initialDayIndex = Math.max(0, Math.min(getDayIndexFromDate(today, state.startDate), MAX_DAYS_AHEAD - 1));

    // Generate initial days window (this is still synchronous but happens after render)
    const generatedDays = generateInitialDaysWindow(results, userData, state.startDate, mealCount, initialDayIndex);
    setState(prev => {
      const updatedState: DietPlanState = {
        ...prev,
        days: generatedDays,
        currentDayIndex: initialDayIndex,
      };
      saveState(updatedState);
      return updatedState;
    });
  }, [results, state.startDate, state.userPreferences.mealCount, saveState, userData]);

  // Memoize the ensureDaysGenerated function to prevent unnecessary recalculations using sliding window
  // Uses refs internally to avoid stale closure issues with React 19
  const memoizedEnsureDaysGenerated = useCallback((
    state: DietPlanState,
    targetDate?: DateKey,
    saveStateFn?: (newState: DietPlanState) => void
  ): DietPlanState => {
    const currentResults = resultsRef.current;
    const currentUserData = userDataRef.current;
    if (!currentResults || !state.startDate) return state;

    let targetDayIndex = state.currentDayIndex;
    if (targetDate) {
      targetDayIndex = getDayIndexFromDate(targetDate, state.startDate);
    }

    const minExisting = state.days.length > 0 ? Math.min(...state.days.map(d => d.dayIndex)) : targetDayIndex;
    const maxExisting = state.days.length > 0 ? Math.max(...state.days.map(d => d.dayIndex)) : targetDayIndex;

    // Generate days on month switch: 30 days before and 60 days after the target
    const neededMin = Math.min(minExisting, targetDayIndex - 30);
    const neededMax = Math.max(maxExisting, targetDayIndex + 60);

    if (state.days.length > 0 && minExisting <= neededMin && maxExisting >= neededMax) {
      return state;
    }

    const mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = state.userPreferences.mealCount || 4;
    const existingMap = new Map<number, DayPlan>();
    state.days.forEach(d => existingMap.set(d.dayIndex, d));

    const newDays: DayPlan[] = [];
    for (let i = neededMin; i <= neededMax; i++) {
      if (existingMap.has(i)) {
        newDays.push(existingMap.get(i)!);
      } else {
        try {
          newDays.push(generateDayPlanForDay(i, currentResults, currentUserData, state.startDate, mealCount));
        } catch (error) {
          console.error(`Failed to generate day ${i}:`, error);
        }
      }
    }

    const newState = {
      ...state,
      days: newDays,
    };

    if (saveStateFn) {
      saveStateFn(newState);
    }

    return newState;
  }, [saveState]);

  const regenerateDays = useCallback((
    newResults: NutritionalResults,
    newUserData: UserData | null
  ) => {
    setState(prev => {
      // Always regenerate days window when results change to ensure meal targets match current nutritional goals
      const mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = prev.userPreferences.mealCount || 4;
      const generatedDays = generateInitialDaysWindow(newResults, newUserData, prev.startDate, mealCount, prev.currentDayIndex);
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
      // Find the day directly from prev.days (days should already be generated)
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.dayIndex === dayIndex);
      if (dayIdx === -1) return prev;
      const day = newDays[dayIdx];

      const newMeals = day.meals.map(meal => {
        if (meal.key === mealKey) {
          // Sync food entries to diary before marking as confirmed
          const dateKey = toISODate(new Date(day.date));
          const mealField = mealKeyToMealField[mealKey as MealKey];
          
          if (mealField) {
            meal.portions.forEach(portion => {
              const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
              if (food) {
                const foodEntry: DiaryFoodEntry = {
                  foodId: portion.foodId,
                  food,
                  grams: portion.grams,
                };
                saveDiaryEntry(dateKey, mealField, foodEntry);
              }
            });
          }
          
          return {
            ...meal,
            isConfirmed: true,
            confirmedAt: new Date().toISOString(),
          };
        }
        return meal;
      });

      newDays[dayIdx] = {
        ...day,
        meals: newMeals,
      };

      const updatedStateFinal: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [saveState]);

  const unconfirmMeal = useCallback((dayIndex: number, mealKey: string) => {
    setState(prev => {
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.dayIndex === dayIndex);
      if (dayIdx === -1) return prev;
      const day = newDays[dayIdx];

      const newMeals = day.meals.map(meal => {
        if (meal.key === mealKey) {
          return {
            ...meal,
            isConfirmed: false,
            confirmedAt: undefined,
          };
        }
        return meal;
      });

      newDays[dayIdx] = {
        ...day,
        meals: newMeals,
      };

      const updatedStateFinal: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [saveState]);

  const modifyMeal = useCallback((dayIndex: number, mealKey: string, modifications: Partial<MealPortion>[]) => {
    setState(prev => {
      // Find the day directly from prev.days (days should already be generated)
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.dayIndex === dayIndex);
      if (dayIdx === -1) return prev;
      const day = newDays[dayIdx];

      const newMeals = day.meals.map(meal => {
        if (meal.key === mealKey) {
          const newPortions = meal.portions.map((portion, idx) => {
            if (modifications[idx]) {
              const mod = modifications[idx];
              const newGrams = mod.grams !== undefined ? mod.grams : portion.grams;
              const oldGrams = portion.grams > 0 ? portion.grams : 100;
              const ratio = newGrams / oldGrams;
              const originalGrams = portion.originalGrams !== undefined ? portion.originalGrams : portion.grams;
              
              const newNutrition = {
                calories: Math.round(portion.nutrition.calories * ratio),
                protein: Math.round(portion.nutrition.protein * ratio * 10) / 10,
                carbs: Math.round(portion.nutrition.carbs * ratio * 10) / 10,
                fat: Math.round(portion.nutrition.fat * ratio * 10) / 10,
                fiber: Math.round(portion.nutrition.fiber * ratio * 10) / 10,
                sugar: Math.round(portion.nutrition.sugar * ratio * 10) / 10,
                sodium: Math.round(portion.nutrition.sodium * ratio),
              };

              const isModified = newGrams !== originalGrams;

              return {
                ...portion,
                ...mod,
                grams: newGrams,
                nutrition: newNutrition,
                originalGrams,
                isModified,
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

      newDays[dayIdx] = {
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
        ...prev,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [saveState]);

  const completeDay = useCallback((dayIndex: number) => {
    setState(prev => {
      // Find the day directly from prev.days (days should already be generated)
      const newDays = [...prev.days];
      const dayIdx = newDays.findIndex(d => d.dayIndex === dayIndex);
      if (dayIdx === -1) return prev;
      const day = newDays[dayIdx];

      // Sync any unconfirmed meals to diary before marking day as completed
      const dateKey = toISODate(new Date(day.date));
      
      const newMeals = day.meals.map(meal => {
        const mealField = mealKeyToMealField[meal.key as MealKey];
        if (mealField) {
          meal.portions.forEach(portion => {
            const food = FOODS_DATABASE.find(f => f.id === portion.foodId);
            if (food) {
              const foodEntry: DiaryFoodEntry = {
                foodId: portion.foodId,
                food,
                grams: portion.grams,
              };
              // Check if this food entry already exists in diary for this meal field
              const store = loadDiaryStore();
              const existingEntry = store[dateKey]?.foodEntries[mealField]?.find(
                (e: DiaryFoodEntry) => e.foodId === portion.foodId
              );
              
              if (!existingEntry) {
                saveDiaryEntry(dateKey, mealField, foodEntry);
              }
            }
          });
        }
        return {
          ...meal,
          isConfirmed: true,
          confirmedAt: meal.confirmedAt || new Date().toISOString(),
        };
      });

      newDays[dayIdx] = {
        ...day,
        meals: newMeals,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      };

      const updatedStateFinal: DietPlanState = {
        ...prev,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [saveState]);


  const navigateDay = useCallback((delta: number) => {
    setState(prev => {
      const updatedState = memoizedEnsureDaysGenerated(prev);
      let newDayIndex = prev.currentDayIndex + delta;

      newDayIndex = Math.max(0, newDayIndex);

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: newDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [memoizedEnsureDaysGenerated, saveState]);

  const navigateToDate = useCallback((targetDate: DateKey) => {
    setState(prev => {
      const updatedState = memoizedEnsureDaysGenerated(prev, targetDate);
      const targetDay = updatedState.days.find(d => d.date === targetDate);
      const targetDayIndex = targetDay ? targetDay.dayIndex : getDayIndexFromDate(targetDate, updatedState.startDate);

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        currentDayIndex: targetDayIndex,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [memoizedEnsureDaysGenerated, saveState]);

  const updateStartDate = useCallback((newStartDate: string) => {
    setState(prev => {
      const currentResults = resultsRef.current;
      const currentUserData = userDataRef.current;
      const mealCount = prev.userPreferences.mealCount || 4;
      const todayStr = toISODate(new Date());
      const targetDayIndex = getDayIndexFromDate(todayStr, newStartDate);
      const newDays = currentResults ? generateInitialDaysWindow(currentResults, currentUserData, newStartDate, mealCount, targetDayIndex) : prev.days;
      const updatedStateFinal: DietPlanState = {
        ...prev,
        startDate: newStartDate,
        currentDayIndex: targetDayIndex,
        days: newDays,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [saveState]);

  const updatePreferences = useCallback((preferences: Partial<DietPlanState['userPreferences']>) => {
    setState(prev => {
      // Ensure we have days generated with current preferences
      const updatedState = memoizedEnsureDaysGenerated(prev);

      const updatedPreferences = {
        ...prev.userPreferences,
        ...preferences,
      };

      // If portion multiplier or mealCount changed, we need to regenerate days window
      const mealCountChanged = preferences.mealCount !== undefined &&
          preferences.mealCount !== prev.userPreferences.mealCount;
      const portionMultiplierChanged = preferences.portionMultiplier !== undefined &&
          preferences.portionMultiplier !== prev.userPreferences.portionMultiplier;

      if ((mealCountChanged || portionMultiplierChanged) && resultsRef.current) {
        // Regenerate days window with new preferences
        const newMealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = preferences.mealCount ?? prev.userPreferences.mealCount;
        updatedState.days = generateInitialDaysWindow(resultsRef.current, userDataRef.current, updatedState.startDate, newMealCount, updatedState.currentDayIndex);
      }

      const updatedStateFinal: DietPlanState = {
        ...updatedState,
        userPreferences: updatedPreferences,
      };
      saveState(updatedStateFinal);
      return updatedStateFinal;
    });
  }, [memoizedEnsureDaysGenerated, saveState]);

  // Ensure state is up-to-date with current results and persist generated days
  // This is now done in a useEffect to avoid render-time side effects
  const currentDay = state.days.find(d => d.dayIndex === state.currentDayIndex) || state.days[0] || null;

  return {
    state,
    currentDay,
    confirmMeal,
    unconfirmMeal,
    modifyMeal,
    completeDay,
    navigateDay,
    navigateToDate,
    updatePreferences,
    updateStartDate,
    regenerateDays,
    isLoading: state.days.length === 0 && !!results,
  };
}
