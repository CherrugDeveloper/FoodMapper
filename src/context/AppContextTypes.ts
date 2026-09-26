import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState, DayPlan, MealPortion } from '../types/dietPlan';

// Type for the full return value of useDietPlan hook
export interface DietPlanHookReturn {
  state: DietPlanState;
  currentDay: DayPlan | null;
  confirmMeal: (dayIndex: number, mealKey: string) => void;
  modifyMeal: (dayIndex: number, mealKey: string, modifications: Partial<MealPortion>[]) => void;
  completeDay: (dayIndex: number) => void;
  navigateDay: (delta: number) => void;
  navigateToDate: (targetDate: string) => void;
  updatePreferences: (preferences: Partial<DietPlanState['userPreferences']>) => void;
  isLoading: boolean;
}

export interface AppContextValue {
  calcResults: NutritionalResults | null;
  userData: UserData | null;
  dietPlan: DietPlanHookReturn | null;
  setCalcResults: (results: NutritionalResults) => void;
  setUserData: (data: UserData) => void;
  handleCalculate: (results: NutritionalResults, data: UserData) => void;
  setActiveTab: (tab: string) => void;
}