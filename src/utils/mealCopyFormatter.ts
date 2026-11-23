import type { MealPortion, GeneratedMeal, DayPlan } from '../types/dietPlan';
import type { FoodUnit } from '../types/dietPlan';

export interface CopyNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FormattedMeal {
  displayName: string;
  portions: Array<{ foodName: string; display: string }>;
  nutrition: CopyNutrition;
}

// Helper per formattare numeri
export const formatNum = (n: number, d = 0): string => {
  if (!isFinite(n)) return '0';
  return n.toFixed(d);
};

// Mapping unità a etichette italiane
export const unitLabels: Record<FoodUnit, string> = {
  'g': 'g',
  'uova': 'uova',
  'vasetti': 'vasetti',
  'quadrati': 'quadrati',
  'cucchiai': 'cucchiai',
  'fette': 'fette',
  'pz': 'pz',
  'noci': 'noci',
  'patate': 'patate',
  'banane': 'banane',
  'lamponi': 'lamponi',
  'tofu': 'tofu',
  'tempeh': 'tempeh'
};

// Formattazione porzione per copia
export const formatAmount = (p: { grams: number; unit?: FoodUnit; unitValue?: number }): string => {
  if (p.unitValue !== undefined && p.unit) {
    const label = unitLabels[p.unit] || p.unit;
    const wholeUnits: FoodUnit[] = ['uova', 'noci', 'patate', 'banane', 'lamponi', 'tofu', 'tempeh'];
    const isWholeUnit = wholeUnits.includes(p.unit);
    const value = isWholeUnit ? Math.round(p.unitValue) : formatNum(p.unitValue);
    return `${value} ${label}`;
  }
  return `${formatNum(Math.round(p.grams))}g`;
};

// Get unit display for copy operation (special handling for specific foods)
export const getUnitDisplay = (portion: MealPortion): string => {
  const foodName = portion.foodName.toLowerCase();
  
  if (foodName.includes('aranc')) {
    const units = Math.round(portion.grams / 150);
    return units === 1 ? '1 arancia' : `${units} arance`;
  }
  if (foodName.includes('chia') || foodName.includes('semi di chia')) {
    const tbsp = Math.round(portion.grams / 12);
    return tbsp === 1 ? '1 cucchiaio' : `${tbsp} cucchiai`;
  }
  if (foodName.includes('banan')) {
    const units = Math.round(portion.grams / 120);
    return units === 1 ? '1 banana' : `${units} banane`;
  }
  if (foodName.includes('patat')) {
    const units = Math.round(portion.grams / 180);
    return units === 1 ? '1 patata' : `${units} patate`;
  }
  if (foodName.includes('tofu')) {
    const units = Math.round(portion.grams / 150);
    return units === 1 ? '1 panetto di tofu' : `${units} panetti di tofu`;
  }
  if (foodName.includes('tempeh')) {
    const units = Math.round(portion.grams / 100);
    return units === 1 ? '1 panetto di tempeh' : `${units} panetti di tempeh`;
  }
  if (foodName.includes('noc')) {
    const units = Math.round(portion.grams / 5);
    return units === 1 ? '1 noccia' : `${units} nocciole`;
  }
  if (foodName.includes('lampon') || foodName.includes('raspberry')) {
    const units = Math.round(portion.grams / 20);
    return units === 1 ? '1 lamponi' : `${units} lamponi`;
  }
  
  if (portion.unit && portion.unitValue) {
    return `${portion.unitValue} ${unitLabels[portion.unit] || portion.unit}`;
  }
  return `${portion.grams}g`;
};

// Formattazione esatta per numeri (senza arrotondamento)
export const formatExact = (n: number): string => {
  if (!isFinite(n)) return '0';
  return n.toString();
};

// Formattazione pasto singolo per copia
export const formatMealForCopy = (
  meal: GeneratedMeal,
  mealDisplayName: string
): string => {
  const ingredientsList = meal.portions.map(p => {
    return `  - ${p.foodName}: ${getUnitDisplay(p)}`;
  }).join('\n');

  return `${mealDisplayName}\n  ${ingredientsList}\n  Totale: ${formatExact(meal.totalNutrition.calories)} kcal, ${formatExact(meal.totalNutrition.protein)}g proteine, ${formatExact(meal.totalNutrition.carbs)}g carboidrati, ${formatExact(meal.totalNutrition.fat)}g grassi`;
};

// Formattazione tutti i pasti di una giornata per copia
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
    
    meal.portions.forEach(p => {
      fullText += `  - ${p.foodName}: ${fmtAmount(p)}\n`;
    });
    
    fullText += `  Totale: ${formatNum(meal.totalNutrition.calories)} kcal, ${formatNum(meal.totalNutrition.protein)}g proteine, ${formatNum(meal.totalNutrition.carbs)}g carboidrati, ${formatNum(meal.totalNutrition.fat)}g grassi\n\n`;
  });

  // Add daily totals
  fullText += `========================================\n`;
  fullText += `TOTALE GIORNO:\n`;
  fullText += `  ${formatNum(currentDay.dailyTotals.calories)} kcal, ${formatNum(currentDay.dailyTotals.protein)}g proteine, ${formatNum(currentDay.dailyTotals.carbs)}g carboidrati, ${formatNum(currentDay.dailyTotals.fat)}g grassi`;

  return fullText;
};