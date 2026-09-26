import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPlanState } from '../types/dietPlan';

export function validateNutritionalResults(data: unknown): data is NutritionalResults {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.proteins === 'number' &&
         typeof obj.fats === 'number' &&
         typeof obj.carbs === 'number' &&
         typeof obj.fiber === 'number' &&
         typeof obj.waterLiters === 'number' &&
         typeof obj.estimatedTotalEnergyKcal === 'number';
}

export function validateUserData(data: unknown): data is UserData {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.weightKg === 'number' &&
         typeof obj.heightCm === 'number' &&
         typeof obj.ageYears === 'number' &&
         (obj.biologicalSex === 'male' || obj.biologicalSex === 'female');
}

export function validateDietPlanState(data: unknown): data is DietPlanState {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.startDate === 'string' &&
         typeof obj.currentDayIndex === 'number' &&
         Array.isArray(obj.days);
}

export function sanitizeNumber(value: unknown, fallback = 0): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return typeof num === 'number' && isFinite(num) ? num : fallback;
}

export function sanitizeString(value: unknown, maxLength = 1000): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLength);
}

export function sanitizeArray<T>(value: unknown, itemValidator: (item: unknown) => item is T, fallback: T[] = []): T[] {
  if (!Array.isArray(value)) return fallback;
  return value.filter(itemValidator);
}