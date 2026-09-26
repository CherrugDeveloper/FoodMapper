import { validateNutritionalResults, validateUserData, validateDietPlanState } from './validation';
import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPlanState } from '../types/dietPlan';

const STORAGE_PREFIX = 'foodmapper_';

export const safeStorage = {
  get<T>(key: string, validator: (data: unknown) => data is T, fallback: T): T {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return validator(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  },
  
  set(key: string, value: unknown): boolean {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  },
  
  remove(key: string): void {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Silently fail
    }
  }
};

// Specific storage functions for type safety
export const calcStorage = {
  get(): NutritionalResults | null {
    return safeStorage.get('calc_results', validateNutritionalResults, null);
  },
  set(results: NutritionalResults): boolean {
    return safeStorage.set('calc_results', results);
  },
  remove(): void {
    safeStorage.remove('calc_results');
  }
};

export const userDataStorage = {
  get(): UserData | null {
    return safeStorage.get('user_data', validateUserData, null);
  },
  set(data: UserData): boolean {
    return safeStorage.set('user_data', data);
  },
  remove(): void {
    safeStorage.remove('user_data');
  }
};

export const dietPlanStorage = {
  get(): DietPlanState | null {
    return safeStorage.get('diet_plan', validateDietPlanState, null);
  },
  set(state: DietPlanState): boolean {
    return safeStorage.set('diet_plan', state);
  },
  remove(): void {
    safeStorage.remove('diet_plan');
  }
};