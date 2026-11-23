import type { MealPortion, GeneratedMeal, DayPlan } from '../types/dietPlan';
import type { FoodUnit } from '../types/dietPlan';

export interface CopyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface FormattedMeal {
  displayName: string;
  portions: Array<{ foodName: string; display: string }>;
  nutrition: CopyNutrition;
}

/** Formattazione numeri - restituisce stringa senza arrotondamento */
export const formatExact = (n: number): string => {
  if (!isFinite(n)) return '0';
  return n.toString();
};

/** Formattazione numeri con precisione decimale opzionale */
export const formatNum = (n: number, d = 0): string => {
  if (!isFinite(n)) return '0';
  return n.toFixed(d);
};

/** Mapping unità a etichette italiane */
export const unitLabels: Record<FoodUnit, string> = {
  g: 'g',
  uova: 'uova',
  vasetti: 'vasetti',
  quadrati: 'quadrati',
  cucchiai: 'cucchiai',
  fette: 'fette',
  pz: 'pz',
  noci: 'noci',
  patate: 'patate',
  banane: 'banane',
  lamponi: 'lamponi',
  tofu: 'tofu',
  tempeh: 'tempeh',
};

/** Unità intere che mostrano valore arrotondato */
const WHOLE_UNITS: FoodUnit[] = ['uova', 'noci', 'patate', 'banane', 'lamponi', 'tofu', 'tempeh'];

/** Pesi riferimento per unità whole (grammi per unità) */
const WHOLE_UNIT_WEIGHTS: Record<FoodUnit, number> = {
  uova: 50,
  noci: 5,
  patate: 180,
  banane: 120,
  lamponi: 20,
  tofu: 150,
  tempeh: 100, // panetto medio
};

/** Formattazione porzione per copia (es: "3 uova", "7 pz") */
export const formatAmount = (p: { grams: number; unit?: FoodUnit; unitValue?: number }): string => {
  if (p.unitValue !== undefined && p.unit) {
    const label = unitLabels[p.unit] || p.unit;
    const isWholeUnit = WHOLE_UNITS.includes(p.unit);
    const value = isWholeUnit ? Math.round(p.unitValue) : formatNum(p.unitValue);
    const weight = WHOLE_UNIT_WEIGHTS[p.unit];
    if (isWholeUnit && weight) {
      return `${value} ${label} (~${weight}g)`;
    }
    return `${value} ${label}`;
  }
  return `${formatNum(Math.round(p.grams))}g`;
};

/** Ottiene il display unità per ingredienti specifici */
const getSpecialUnitDisplay = (portion: MealPortion): string | null => {
  const foodName = portion.foodName.toLowerCase();

  // Arance: 150g each
  if (foodName.includes('aranc')) {
    const count = Math.round(portion.grams / 150);
    return count === 1 ? '1 arancia' : `${count} arance`;
  }

  // Semi di chia: 12g each
  if (foodName.includes('chia') || foodName.includes('semi di chia')) {
    const count = Math.round(portion.grams / 12);
    return count === 1 ? '1 cucchiaio' : `${count} cucchiai`;
  }

  // Banane: 120g each
  if (foodName.includes('banan')) {
    const count = Math.round(portion.grams / 120);
    return count === 1 ? '1 banana' : `${count} banane`;
  }

  // Patate: 180g each
  if (foodName.includes('patat')) {
    const count = Math.round(portion.grams / 180);
    return count === 1 ? '1 patata' : `${count} patate`;
  }

  // Tofu: 150g per panetto
  if (foodName.includes('tofu')) {
    const count = Math.round(portion.grams / 150);
    return count === 1 ? '1 panetto' : `${count} panetti`;
  }

  // Tempeh: 100g per panetto
  if (foodName.includes('tempeh')) {
    const count = Math.round(portion.grams / 100);
    return count === 1 ? '1 panetto' : `${count} panetti`;
  }

  // Noci: 5g each
  if (foodName.includes('noc')) {
    const count = Math.round(portion.grams / 5);
    return count === 1 ? '1 noccia' : `${count} nocciole`;
  }

  // Lamponi: 20g each
  if (foodName.includes('lampon') || foodName.includes('raspberry')) {
    const count = Math.round(portion.grams / 20);
    return count === 1 ? '1 lamponi' : `${count} lamponi`;
  }

  return null;
};

/** Get unit display for copy operation (special handling for specific foods) */
export const getUnitDisplay = (portion: MealPortion): string => {
  const specialDisplay = getSpecialUnitDisplay(portion);
  if (specialDisplay) {
    return specialDisplay;
  }

  if (portion.unit && portion.unitValue !== undefined) {
    const label = unitLabels[portion.unit] || portion.unit;
    return `${portion.unitValue} ${label}`;
  }
  return `${portion.grams}g`;
};

/** Formattazione pasto singolo per copia */
export const formatMealForCopy = (
  meal: GeneratedMeal,
  mealDisplayName: string
): string => {
  const ingredientsList = meal.portions
    .filter(p => p.grams > 0)
    .map(p => {
      const display = getUnitDisplay(p);
      return `  - ${p.foodName}: ${display}`;
    })
    .join('\n');

  const nutritionStr = [
    `${formatExact(meal.totalNutrition.calories)} kcal`,
    `${formatExact(meal.totalNutrition.protein)}g proteine`,
    `${formatExact(meal.totalNutrition.carbs)}g carboidrati`,
    `${formatExact(meal.totalNutrition.fat)}g grassi`,
  ].join(', ');

  return `${mealDisplayName}\n  ${ingredientsList}\n  Totale: ${nutritionStr}`;
};

/** Formattazione tutti i pasti di una giornata per copia */
export const formatAllMealsForCopy = (
  currentDay: DayPlan,
  dayNameMap: Record<string, string>,
  options?: { useReadableUnits?: boolean }
): string => {
  const fmtAmount = options?.useReadableUnits ? getUnitDisplay : formatAmount;

  let fullText = `📋 PASTI GIORNALIARIO - ${currentDay.date}\n\n`;

  currentDay.meals.forEach(meal => {
    const mealDisplayName = dayNameMap[meal.key] || meal.key;
    fullText += `${mealDisplayName}:\n`;

    meal.portions
      .filter(p => p.grams > 0)
      .forEach(p => {
        fullText += `  - ${p.foodName}: ${fmtAmount(p)}\n`;
      });

    const nutritionStr = [
      `${formatNum(meal.totalNutrition.calories)} kcal`,
      `${formatNum(meal.totalNutrition.protein)}g proteine`,
      `${formatNum(meal.totalNutrition.carbs)}g carboidrati`,
      `${formatNum(meal.totalNutrition.fat)}g grassi`,
    ].join(', ');

    fullText += `  Totale: ${nutritionStr}\n\n`;
  });

  // Add daily totals
  fullText += `========================================\n`;
  fullText += `TOTALE GIORNO:\n`;

  const dailyTotalsStr = [
    `${formatNum(currentDay.dailyTotals.calories)} kcal`,
    `${formatNum(currentDay.dailyTotals.protein)}g proteine`,
    `${formatNum(currentDay.dailyTotals.carbs)}g carboidrati`,
    `${formatNum(currentDay.dailyTotals.fat)}g grassi`,
  ].join(', ');

  fullText += `  ${dailyTotalsStr}`;

  return fullText;
};