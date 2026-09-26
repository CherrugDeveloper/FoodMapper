import type { NutritionalResults, UserData } from '../utils/nutritionEngine';
import type { DietPlanState } from '../types/dietPlan';

export interface AppContextValue {
  calcResults: NutritionalResults | null;
  userData: UserData | null;
  dietPlan: DietPlanState | null;
  setCalcResults: (results: NutritionalResults) => void;
  setUserData: (data: UserData) => void;
  handleCalculate: (results: NutritionalResults, data: UserData) => void;
}