import type { FoodItem, Micro } from './foodsData';
import type { NutritionalResults } from './nutritionEngine';

// Memoization utility for utility functions (not React hooks)
export const memoize = <T, U>(fn: (input: T) => U): (input: T) => U => {
  const cache: Map<T, U> = new Map();
  return (input: T) => {
    if (cache.has(input)) {
      return cache.get(input);
    }
    const result = fn(input);
    cache.set(input, result);
    return result;
  };
};

// Calculate total nutrition
const calculateTotalNutrition = (foodEntries: Array<{ food: FoodItem; grams: number }>) => {
  const totals: {
    totalKcal: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    totalFiber: number;
    totalSodium: number;
    micronutrients: {
      potassium: number;
      magnesium: number;
      calcium: number;
      iron: number;
      zinc: number;
      folate: number;
      vitamin_a: number;
      vitamin_c: number;
      vitamin_d: number;
      vitamin_e: number;
      b12: number;
      omega3: number;
      selenium: number;
      iodine: number;
      vitamin_k: number;
      vitamin_b6: number;
      manganese: number;
      copper: number;
      phosphorus: number;
    };
  } = {
    totalKcal: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFiber: 0,
    totalSodium: 0,
    micronutrients: { ...Object.fromEntries(Object.keys(Micro).map(key => [key, 0])) },
  };

  const multiplier = foodEntries.find(entry => entry.food.id === foodEntries[0].food.id)?.grams || 1;

  foodEntries.forEach((entry) => {
    const food = entry.food;
    const multiplier = entry.grams / 100;

    totals.totalKcal += food.nutrition.calories * multiplier;
    totals.totalProtein += food.nutrition.protein * multiplier;
    totals.totalCarbs += food.nutrition.carbs * multiplier;
    totals.totalFats += food.nutrition.fats * multiplier;
    totals.totalFiber += food.nutrition.fiber * multiplier;

    // Microelementi
    if (food.nutrition.micronutrients) {
      const micros = food.nutrition.micronutrients;
      if (micros.potassium) totals.micronutrients.potassium += micros.potassium * multiplier;
      if (micros.magnesium) totals.micronutrients.magnesium += micros.magnesium * multiplier;
      if (micros.calcium) totals.micronutrients.calcium += micros.calcium * multiplier;
      if (micros.iron) totals.micronutrients.iron += micros.iron * multiplier;
      if (micros.zinc) totals.micronutrients.zinc += micros.zinc * multiplier;
      if (micros.folate) totals.micronutrients.folate += micros.folate * multiplier;
      if (micros.vitamin_a) totals.micronutrients.vitamin_a += micros.vitamin_a * multiplier;
      if (micros.vitamin_c) totals.micronutrients.vitamin_c += micros.vitamin_c * multiplier;
      if (micros.vitamin_d) totals.micronutrients.vitamin_d += micros.vitamin_d * multiplier;
      if (micros.vitamin_e) totals.micronutrients.vitamin_e += micros.vitamin_e * multiplier;
      if (micros.b12) totals.micronutrients.b12 += micros.b12 * multiplier;
      if (micros.omega3) totals.micronutrients.omega3 += micros.omega3 * multiplier;
      if (micros.selenium) totals.micronutrients.selenium += micros.selenium * multiplier;
      if (micros.iodine) totals.micronutrients.iodine += micros.iodine * multiplier;
      if (micros.sodium) totals.micronutrients.sodium += micros.sodium * multiplier;
      if (micros.vitamin_k) totals.micronutrients.vitamin_k += micros.vitamin_k * multiplier;
      if (micros.vitamin_b6) totals.micronutrients.vitamin_b6 += micros.vitamin_b6 * multiplier;
      if (micros.manganese) totals.micronutrients.manganese += micros.manganese * multiplier;
      if (micros.copper) totals.micronutrients.copper += micros.copper * multiplier;
      if (micros.phosphorus) totals.micronutrients.phosphorus += micros.phosphorus * multiplier;
    }

    // Sodio
    if (food.nutrition.micronutrients?.sodium) {
      totals.totalSodium += food.nutrition.micronutrients.sodium * multiplier;
    }
  });

  return totals;
};

// Memoized version for utility functions
export const useCalculateTotalNutrition = (foodEntries: Array<{ food: FoodItem; grams: number }>) => {
  const memoizedResult = memoize(calculateTotalNutrition, foodEntries);
  return memoizedResult(foodEntries);
};

// Rest of the file remains unchanged

// Add memoized version of the function

// Analyze nutrition status
export function analyzeNutritionStatus(
  current: DailyNutritionSummary,
  targets: NutritionalResults
): NutritionAnalysis {
  const warnings: string[] = [];

  const analyze = (currentValue: number, targetValue: number, tolerance: number = 0.2): NutritionStatus => {
    const percentage = (currentValue / targetValue) * 100;
    let status: 'deficient' | 'adequate' | 'excess';

    if (percentage < (1 - tolerance) * 100) {
      status = 'deficient';
    } else if (percentage > (1 + tolerance) * 100) {
      status = 'excess';
    } else {
      status = 'adequate';
    }

    return {
      current: currentValue, // Keep original precision, will be formatted in UI
      target: targetValue,
      percentage: Math.round(percentage),
      status
    };
  };

  const macros = {
    protein: analyze(current.totalProtein, targets.proteins),
    carbs: analyze(current.totalCarbs, targets.carbs),
    fats: analyze(current.totalFats, targets.fats),
    fiber: analyze(current.totalFiber, targets.fiber, 0.15), // tolleranza più stretta per fibre
    kcal: analyze(current.totalKcal, targets.estimatedTotalEnergyKcal, 0.1) // tolleranza molto stretta per kcal
  };

  const micros: Record<Micro, NutritionStatus> = {
    potassium: analyze(current.micronutrients.potassium, targets.micronutrients.potassium, 0.2),
    magnesium: analyze(current.micronutrients.magnesium, targets.micronutrients.magnesium, 0.2),
    calcium: analyze(current.micronutrients.calcium, targets.micronutrients.calcium, 0.2),
    iron: analyze(current.micronutrients.iron, targets.micronutrients.iron, 0.2),
    zinc: analyze(current.micronutrients.zinc, targets.micronutrients.zinc, 0.2),
    folate: analyze(current.micronutrients.folate, targets.micronutrients.folate, 0.2),
    vitamin_a: analyze(current.micronutrients.vitamin_a, targets.micronutrients.vitamin_a, 0.2),
    vitamin_c: analyze(current.micronutrients.vitamin_c, targets.micronutrients.vitamin_c, 0.2),
    vitamin_d: analyze(current.micronutrients.vitamin_d, targets.micronutrients.vitamin_d, 0.2),
    vitamin_e: analyze(current.micronutrients.vitamin_e, targets.micronutrients.vitamin_e, 0.2),
    b12: analyze(current.micronutrients.b12, targets.micronutrients.b12, 0.2),
    omega3: analyze(current.micronutrients.omega3, targets.micronutrients.omega3, 0.2),
    selenium: analyze(current.micronutrients.selenium, targets.micronutrients.selenium, 0.2),
    iodine: analyze(current.micronutrients.iodine, targets.micronutrients.iodine, 0.2),
    vitamin_k: analyze(current.micronutrients.vitamin_k, targets.micronutrients.vitamin_k, 0.2),
    vitamin_b6: analyze(current.micronutrients.vitamin_b6, targets.micronutrients.vitamin_b6, 0.2),
    manganese: analyze(current.micronutrients.manganese, targets.micronutrients.manganese, 0.2),
    copper: analyze(current.micronutrients.copper, targets.micronutrients.copper, 0.2),
    phosphorus: analyze(current.micronutrients.phosphorus, targets.micronutrients.phosphorus, 0.2),
  };

  return {
    macros,
    micros,
    warnings
  };
}
