import { validateNutritionalResults, validateUserData, validateDietPlanState } from './validation';
import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPlanState } from '../types/dietPlan';

const STORAGE_PREFIX = 'foodmapper_';
const STORAGE_VERSION_KEY = 'foodmapper_storage_version';
const CURRENT_STORAGE_VERSION = 2;

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

// Version management for migrations
export const storageVersion = {
  get(): number {
    try {
      const raw = localStorage.getItem(STORAGE_VERSION_KEY);
      return raw ? parseInt(raw, 10) : 1;
    } catch {
      return 1;
    }
  },
  set(version: number): void {
    try {
      localStorage.setItem(STORAGE_VERSION_KEY, String(version));
    } catch {
      // Silently fail
    }
  },
  migrate(): void {
    const currentVersion = storageVersion.get();
    if (currentVersion < CURRENT_STORAGE_VERSION) {
      storageVersion.set(CURRENT_STORAGE_VERSION);
    }
  }
};

// Run migration on import
storageVersion.migrate();

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

// Disclaimer storage
export const disclaimerStorage = {
  get(): { accepted: boolean } | null {
    try {
      const raw = localStorage.getItem('ibs_disclaimer_accepted');
      if (raw === 'true') {
        return { accepted: true };
      }
      return null;
    } catch {
      return null;
    }
  },
  set(accepted: boolean): boolean {
    try {
      if (accepted) {
        localStorage.setItem('ibs_disclaimer_accepted', 'true');
      } else {
        localStorage.removeItem('ibs_disclaimer_accepted');
      }
      return true;
    } catch (error) {
      console.error("DEBUG: Error setting disclaimer:", error);
      return false;
    }
  },
  remove(): void {
    try {
      localStorage.removeItem('ibs_disclaimer_accepted');
    } catch (error) {
      console.error("DEBUG: Error removing disclaimer:", error);
    }
  }
};

// Diet start date storage
export const dietStartDateStorage = {
  get(): string | null {
    try {
      const raw = localStorage.getItem('foodmapper_diet_start_date');
      return raw || null;
    } catch {
      return null;
    }
  },
  set(date: string): boolean {
    try {
      localStorage.setItem('foodmapper_diet_start_date', date);
      return true;
    } catch {
      return false;
    }
  },
  remove(): void {
    try {
      localStorage.removeItem('foodmapper_diet_start_date');
    } catch {
      // Silently fail
    }
  }
};