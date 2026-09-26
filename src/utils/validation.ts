import type { NutritionalResults, UserData, HealthCondition, AllergenKey, DietGoal } from './nutritionEngine';
import type { DietPlanState } from '../types/dietPlan';

const VALID_CONDITIONS: HealthCondition[] = [
  'celiac',
  'diabetes',
  'hypertension',
  'pregnancy',
  'hypothyroidism',
  'hyperthyroidism',
  'menopause',
  'pcos'
];

const VALID_ALLERGENS: AllergenKey[] = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'tree_nuts',
  'celery',
  'mustard',
  'sesame',
  'lupins',
  'sulphites'
];

const VALID_DIET_GOALS: DietGoal[] = ['maintenance', 'deficit', 'surplus'];

function isHealthCondition(value: unknown): value is HealthCondition {
  return typeof value === 'string' && VALID_CONDITIONS.includes(value as HealthCondition);
}

function isAllergenKey(value: unknown): value is AllergenKey {
  return typeof value === 'string' && VALID_ALLERGENS.includes(value as AllergenKey);
}

function isDietGoal(value: unknown): value is DietGoal {
  return typeof value === 'string' && VALID_DIET_GOALS.includes(value as DietGoal);
}

export function validateNutritionalResults(data: unknown): data is NutritionalResults {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return typeof obj.proteins === 'number' &&
         typeof obj.fats === 'number' &&
         typeof obj.carbs === 'number' &&
         typeof obj.fiber === 'number' &&
         typeof obj.waterLiters === 'number' &&
         typeof obj.estimatedTotalEnergyKcal === 'number' &&
         (typeof obj.targetCaloriesKcal === 'undefined' || typeof obj.targetCaloriesKcal === 'number');
}

export function validateUserData(data: unknown): data is UserData {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;

  const hasValidBiometrics =
    typeof obj.weightKg === 'number' &&
    typeof obj.heightCm === 'number' &&
    typeof obj.ageYears === 'number' &&
    (obj.biologicalSex === 'male' || obj.biologicalSex === 'female');

  if (!hasValidBiometrics) return false;

  // Se presente, le condizioni devono essere un array di HealthCondition valide
  if (obj.conditions !== undefined) {
    if (!Array.isArray(obj.conditions)) return false;
    if (!obj.conditions.every(isHealthCondition)) return false;
  }

  // Se presente, allergens deve essere un array di AllergenKey valide
  if (obj.allergens !== undefined) {
    if (!Array.isArray(obj.allergens)) return false;
    if (!obj.allergens.every(isAllergenKey)) return false;
  }

  // Se presente, medications deve essere una stringa
  if (obj.medications !== undefined && typeof obj.medications !== 'string') {
    return false;
  }

  // Se presente, bioHacking deve essere un booleano
  if (obj.bioHacking !== undefined && typeof obj.bioHacking !== 'boolean') {
    return false;
  }

  // Se presente, dietGoal deve essere valido
  if (obj.dietGoal !== undefined && !isDietGoal(obj.dietGoal)) {
    return false;
  }

  return true;
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
