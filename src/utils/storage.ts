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
      // Migration from v1 to v2: move ibs_disclaimer_accepted to foodmapper_ prefix
      if (currentVersion < 2) {
        const oldDisclaimer = localStorage.getItem('ibs_disclaimer_accepted');
        if (oldDisclaimer) {
          localStorage.setItem('foodmapper_disclaimer_accepted', oldDisclaimer);
          localStorage.removeItem('ibs_disclaimer_accepted');
        }
      }
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

// Disclaimer storage (now with foodmapper_ prefix)
export const disclaimerStorage = {
  get(): { accepted: boolean; expires: Date } | null {
    try {
      const raw = localStorage.getItem('foodmapper_disclaimer_accepted');
      if (!raw) return null;

      const data = JSON.parse(raw);
      if (data.accepted !== true || !(data.expires instanceof Date)) {
        return null;
      }

      if (data.expires < new Date()) {
        localStorage.removeItem('foodmapper_disclaimer_accepted');
        return null;
      }

      return data;
    } catch {
      return null;
    }
  },
  set(accepted: boolean): boolean {
    try {
      const expires = new Date();
      expires.setDate(expires.getDate() + 365); // 1 year expiration

      localStorage.setItem('foodmapper_disclaimer_accepted',
        JSON.stringify({ accepted, expires }));
      return true;
    } catch {
      return false;
    }
  },
  remove(): void {
    try {
      localStorage.removeItem('foodmapper_disclaimer_accepted');
    } catch {
      // Silently fail
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