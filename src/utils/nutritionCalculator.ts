import type { FoodItem, Micro } from './foodsData';
import type { NutritionalResults } from './nutritionEngine';

export interface DailyNutritionSummary {
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  micronutrients: Record<Micro, number>;
}

export interface NutritionStatus {
  current: number;
  target: number;
  percentage: number;
  status: 'deficient' | 'adequate' | 'excess';
}

export interface NutritionAnalysis {
  macros: {
    protein: NutritionStatus;
    carbs: NutritionStatus;
    fats: NutritionStatus;
    fiber: NutritionStatus;
    kcal: NutritionStatus;
  };
  micros: Record<Micro, NutritionStatus>;
  warnings: string[];
}

/**
 * Calcola i nutrienti totali da una lista di alimenti con quantità
 */
export function calculateTotalNutrition(foodEntries: Array<{ food: FoodItem; grams: number }>): DailyNutritionSummary {
  const totals: DailyNutritionSummary = {
    totalKcal: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFiber: 0,
    micronutrients: {
      potassium: 0,
      magnesium: 0,
      calcium: 0,
      iron: 0,
      zinc: 0,
      folate: 0,
      vitamin_a: 0,
      vitamin_c: 0,
      vitamin_d: 0,
      vitamin_e: 0,
      b12: 0,
      omega3: 0,
      selenium: 0,
      iodine: 0
    }
  };

  for (const entry of foodEntries) {
    const { food, grams } = entry;
    const multiplier = grams / 100; // i valori sono per 100g

    totals.totalKcal += food.nutrition.kcal * multiplier;
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
    }
  }

  return totals;
}

/**
 * Calcola lo stato nutrizionale rispetto ai fabbisogni giornalieri
 */
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
      current: Math.round(currentValue * 10) / 10,
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
    iodine: analyze(current.micronutrients.iodine, targets.micronutrients.iodine, 0.2)
  };

  // Genera avvisi per carenze significative
  if (macros.protein.status === 'deficient') {
    warnings.push('protein_deficiency');
  }
  if (macros.fiber.status === 'deficient') {
    warnings.push('fiber_deficiency');
  }
  if (micros.iron.status === 'deficient') {
    warnings.push('iron_deficiency');
  }
  if (micros.vitamin_d.status === 'deficient') {
    warnings.push('vitamin_d_deficiency');
  }
  if (micros.calcium.status === 'deficient') {
    warnings.push('calcium_deficiency');
  }

  return { macros, micros, warnings };
}
