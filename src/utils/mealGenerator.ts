import { FOODS_DATABASE } from './foodsData';
import type { FoodItem, FoodNutrition } from './foodsData';
import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPhase, MealKey, DateKey, MealPortion, GeneratedMeal, DayPlan } from '../types/dietPlan';

/**
 * Meal order for dynamic meal generation
 * Maps meal positions to MealKey values
 */
const MEAL_ORDER: MealKey[] = [
  'colazione', 'spuntinoMattina', 'pranzo', 'spuntinoPomeriggio', 'spuntino', 'spuntinoSera', 'cena'
];

/**
 * Caloric distribution for different meal counts
 * Values represent the percentage of daily calories for each meal position
 */
const MEAL_KCAL_SHARES: Record<number, number[]> = {
  1: [1.0], // Only dinner-style large meal
  2: [0.35, 0.65], // Breakfast + Dinner
  3: [0.30, 0.40, 0.30], // Breakfast + Lunch + Dinner (Italian style)
  4: [0.25, 0.10, 0.35, 0.30], // Breakfast + Snack + Lunch + Dinner
  5: [0.20, 0.08, 0.30, 0.07, 0.35], // Breakfast + Morning Snack + Lunch + Afternoon Snack + Dinner
  6: [0.18, 0.07, 0.28, 0.06, 0.25, 0.16], // With evening snack
  7: [0.15, 0.06, 0.25, 0.05, 0.20, 0.15, 0.14] // Full day with all snacks
};

/**
 * Protein distribution for different meal counts
 */
const MEAL_PROTEIN_SHARES: Record<number, number[]> = {
  1: [1.0],
  2: [0.30, 0.70],
  3: [0.25, 0.40, 0.35],
  4: [0.20, 0.10, 0.35, 0.35],
  5: [0.18, 0.07, 0.30, 0.05, 0.40],
  6: [0.15, 0.06, 0.28, 0.04, 0.30, 0.17],
  7: [0.12, 0.05, 0.25, 0.04, 0.20, 0.15, 0.19]
};

/**
 * Slot roles for each meal position
 */
type SlotRole = 'carb' | 'protein' | 'fat' | 'veg' | 'fruit';

// Pool di alimenti per ruolo: solo low-FODMAP nella base; gli high-FODMAP
// compaiono solo in fase 2/3 come reintroduzione testata.
const POOLS: Record<SlotRole, string[]> = {
  carb: ['3', '15', '17', '2', '16', '24', '18'],
  protein: ['33', '34', '13', '35', '36', '12'],
  fat: ['37', '38', '39', '40', '41'],
  veg: ['5', '6', '19', '20', '21', '22', '25', '26'],
  fruit: ['9', '27', '28', '29', '30', '31']
};

// Pool specifici per colazione: proteine e grassi più plausibili al mattino
const BREAKFAST_PROTEIN_POOL = ['13', '36', '35'];
const BREAKFAST_FAT_POOL = ['38', '39', '40', '41'];

// Reintroduzioni facoltative per la fase 3 (porzione moderata, solo se tollerate)
const REINTRO_POOL = ['8', '11', '14', '1', '23', '32', '42', '7', '4', '10'];

// Limiti di porzione sensati per ruolo (grammi)
const GRAMS_RANGE: Record<SlotRole, [number, number]> = {
  carb: [40, 300],
  protein: [60, 260],
  fat: [5, 30],
  veg: [100, 250],
  fruit: [80, 200]
};

const foodById = (id: string): FoodItem | undefined => FOODS_DATABASE.find(f => f.id === id);

const emptyNutrition = (): FoodNutrition => ({ kcal: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });

const scale = (n: FoodNutrition, grams: number): FoodNutrition => ({
  kcal: Math.round(n.kcal * grams / 100),
  protein: Math.round(n.protein * grams / 100 * 10) / 10,
  carbs: Math.round(n.carbs * grams / 100 * 10) / 10,
  fats: Math.round(n.fats * grams / 100 * 10) / 10,
  fiber: Math.round(n.fiber * grams / 100 * 10) / 10
});

const add = (a: FoodNutrition, b: FoodNutrition): FoodNutrition => ({
  kcal: a.kcal + b.kcal,
  protein: Math.round((a.protein + b.protein) * 10) / 10,
  carbs: Math.round((a.carbs + b.carbs) * 10) / 10,
  fats: Math.round((a.fats + b.fats) * 10) / 10,
  fiber: Math.round((a.fiber + b.fiber) * 10) / 10
});

const clampGrams = (grams: number, role: SlotRole): number =>
  Math.round(Math.min(GRAMS_RANGE[role][1], Math.max(GRAMS_RANGE[role][0], grams)));

/**
 * Determina il gruppo FODMAP testato in un giorno specifico della fase 2.
 * Ogni gruppo viene testato per 3 giorni consecutivi.
 */
export function getPhase2TestGroup(phaseDay: number): 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli' | null {
  const groups: Array<'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli'> = [
    'Fruttani', 'Lattosio', 'Fruttosio', 'Galattani', 'Polioli'
  ];
  const groupIndex = Math.floor(phaseDay / 3);
  return groups[groupIndex] ?? null;
}

/**
 * Gets a human-readable name for the meal key
 */
const getMealName = (mealKey: MealKey): string => {
  const names: Record<MealKey, string> = {
    'colazione': 'colazione',
    'spuntinoMattina': 'spuntino mattina',
    'pranzo': 'pranzo',
    'spuntinoPomeriggio': 'spuntino pomeriggio',
    'spuntino': 'spuntino',
    'spuntinoSera': 'spuntino sera',
    'cena': 'cena'
  };
  return names[mealKey];
};

/**
 * Checks if a meal key represents a breakfast-style meal
 */
const isBreakfastMeal = (mealKey: MealKey): boolean => {
  return mealKey === 'colazione';
};

/**
 * Checks if a meal key represents a snack-style meal
 */
const isSnackMealType = (mealKey: MealKey): boolean => {
  return mealKey.includes('spuntino');
};

/**
 * Checks if a meal key represents a main meal (not a snack)
 */
const isMainMealType = (mealKey: MealKey): boolean => {
  return mealKey === 'colazione' || mealKey === 'pranzo' || mealKey === 'cena';
};

/**
 * Determines the slot roles for a given meal key
 */
const getMealSlots = (mealKey: MealKey): SlotRole[] => {
  switch (mealKey) {
    case 'colazione':
      return ['carb', 'protein', 'fruit', 'fat'];
    case 'pranzo':
      return ['carb', 'protein', 'veg', 'fat'];
    case 'cena':
      return ['protein', 'carb', 'veg', 'fat'];
    case 'spuntino':
      return ['fruit', 'protein', 'fat'];
    case 'spuntinoMattina':
      return ['carb', 'protein', 'fruit'];
    case 'spuntinoPomeriggio':
      // Added carb slot to fill remaining calories when no dessert is served
      return ['carb', 'protein', 'fat'];
    case 'spuntinoSera':
      return ['fruit', 'protein', 'fat'];
    default:
      return ['carb', 'protein', 'veg', 'fat'];
  }
};

/**
 * Generates a day plan with dynamic meal count (1-7 meals)
 * @param mealCount - Number of meals per day (1-7)
 */
export function generateDayPlan(
  results: NutritionalResults,
  userData: UserData | null,
  phase: DietPhase,
  dayIndex = 0,
  phaseDay = 0,
  startDate?: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 4
): DayPlan {
  const conditions = userData?.conditions ?? [];

  // Get meal keys based on meal count
  const mealKeys: MealKey[] = MEAL_ORDER.slice(0, mealCount);

  // Get kcal and protein shares for this meal count
  const kcalShares = MEAL_KCAL_SHARES[mealCount];
  const proteinShares = MEAL_PROTEIN_SHARES[mealCount];

  // Adattamenti per condizioni: il celiaco non vede frumento neppure in fase 3,
  // l'intollerante al lattosio non vede latte/formaggi freschi, l'iperteso evita
  // i formaggi stagionati come fonte proteica, il diabetico privilegia carboidrati
  // a basso carico glicemico (avena, quinoa, grano saraceno in testa al pool).
  const carbPool = (conditions.includes('diabetes_type1') || conditions.includes('diabetes_type2'))
    ? POOLS.carb
    : [...POOLS.carb].reverse();
  const proteinPool = conditions.includes('hypertension')
    ? POOLS.protein.filter(id => id !== '12')
    : POOLS.protein;
  const userAllergens = userData?.allergens ?? [];
  const reintroPool = REINTRO_POOL.filter(id => {
    if (conditions.includes('celiac') && id === '1') return false;
    const food = FOODS_DATABASE.find(f => f.id === id);
    if (food?.allergens && food.allergens.some(a => userAllergens.includes(a))) return false;
    return true;
  });

  const pickRotating = (pool: string[], index: number): FoodItem => {
    const safeIndex = ((index % pool.length) + pool.length) % pool.length;
    const food = foodById(pool[safeIndex]);
    if (!food) {
      throw new Error(`Food not found for ID: ${pool[safeIndex]}`);
    }
    return food;
  };

  const phase2TestGroup = phase === 'phase2' ? getPhase2TestGroup(phaseDay) : null;
  const testGroupIds = phase2TestGroup
    ? FOODS_DATABASE.filter(f => f.fodmapLevel === 'high' && f.triggerGroup === phase2TestGroup).map(f => f.id)
    : [];

  // Ensure phase2TestGroup is not null when used as string later
  const safePhase2TestGroup = phase2TestGroup ?? undefined;

  // Track fat already contributed by other slots

  const meals: GeneratedMeal[] = mealKeys.map((mealKey, mealIdx) => {
  const mealKcal = results.targetCaloriesKcal * kcalShares[mealIdx];
  const proteinTarget = results.proteins * proteinShares[mealIdx];
  const portions: MealPortion[] = [];
  let usedKcal = 0;
  let mealFatGrams = 0;

  // Determine if this is breakfast based on meal key
  const isBreakfast = isBreakfastMeal(mealKey);
  const effectiveProteinPool = isBreakfast ? BREAKFAST_PROTEIN_POOL : proteinPool;

  // Get slot definitions for this meal
  const slots = getMealSlots(mealKey);

  // Proteine: grammi ricavati dal target proteico del pasto
  const proteinFood = pickRotating(effectiveProteinPool, mealIdx + dayIndex * 2 + (phase === 'phase2' ? 1 : 0));
  const proteinGrams = clampGrams(proteinTarget / proteinFood.nutrition.protein * 100, 'protein');
  const proteinNutrition = scale(proteinFood.nutrition, proteinGrams);
  usedKcal += proteinNutrition.kcal;
  mealFatGrams += proteinNutrition.fats;

  const slotGrams: Partial<Record<SlotRole, number>> = {};

  for (const role of slots) {
    if (role === 'protein') {
      slotGrams.protein = proteinGrams;
    } else if (role === 'veg' || role === 'fruit') {
      const food = pickRotating(
        role === 'veg' ? POOLS.veg : POOLS.fruit,
        mealIdx + dayIndex * 3 + (isSnackMealType(mealKey) ? 2 : 0)
      );
      const grams = role === 'veg' ? 180 : 130;
      const nutrition = {
        calories: Math.round(food.nutrition.kcal * grams / 100),
        protein: Math.round(food.nutrition.protein * grams / 100 * 10) / 10,
        carbs: Math.round(food.nutrition.carbs * grams / 100 * 10) / 10,
        fat: Math.round(food.nutrition.fats * grams / 100 * 10) / 10,
        fiber: Math.round(food.nutrition.fiber * grams / 100 * 10) / 10,
        sugar: 0,
        sodium: food.nutrition.micronutrients?.sodium ? Math.round(food.nutrition.micronutrients.sodium * grams / 100) : 0
      };
      mealFatGrams += nutrition.fat;
      portions.push({
        foodId: food.id,
        foodName: food.name,
        grams,
        nutrition,
        isConfirmed: false,
        isModified: false
      });
      usedKcal += scale(food.nutrition, grams).kcal;
    } else if (role === 'fat') {
      const effectiveFatPool = isBreakfast ? BREAKFAST_FAT_POOL : POOLS.fat;
      const food = pickRotating(effectiveFatPool, mealIdx + dayIndex * 4 + (phase === 'phase3' ? 2 : 0));
      
      // Calculate fat based on remaining calories after other slots
      // We target ~15% of meal calories from fat (9 cal/g)
      // But we also need to meet daily fat target
      const totalFatGrams = results.fats;
      const mealFatTarget = totalFatGrams / mealCount;
      const remainingFatNeeded = Math.max(mealFatTarget - mealFatGrams, 0);
      
      // Calculate fat from remaining calories (max 15% of kcal from fat)
      const maxFatFromCalories = Math.max((mealKcal - usedKcal) / 9, 0);
      
      // Calculate effective fat needed - only when there's calorie capacity
      const effectiveFatNeeded = Math.min(
        remainingFatNeeded,
        maxFatFromCalories,
        mealKcal * 0.15 / 9 // Max 15% of meal calories from fat
      );
      
      // Only add fat food when there's actual calorie capacity
      // Minimum 2g from fat foods for satiety/quality, but only if we have room
      // Don't force calories beyond meal target
      const effectiveFatGrams = Math.max(effectiveFatNeeded, 2);
      
      // Clamp fat to not exceed remaining calories
      const availableCalories = mealKcal - usedKcal;
      const finalFatGrams = Math.min(effectiveFatGrams, availableCalories / 9);
      
      if (finalFatGrams >= 2 || effectiveFatNeeded >= 2) {
        const foodFatPercent = food.nutrition.fats / 100;
        const grams = clampGrams((finalFatGrams / foodFatPercent) * 100, 'fat');
        const nutrition = {
          calories: Math.round(food.nutrition.kcal * grams / 100),
          protein: Math.round(food.nutrition.protein * grams / 100 * 10) / 10,
          carbs: Math.round(food.nutrition.carbs * grams / 100 * 10) / 10,
          fat: Math.round(food.nutrition.fats * grams / 100 * 10) / 10,
          fiber: Math.round(food.nutrition.fiber * grams / 100 * 10) / 10,
          sugar: 0,
          sodium: food.nutrition.micronutrients?.sodium ? Math.round(food.nutrition.micronutrients.sodium * grams / 100) : 0
        };
        mealFatGrams += nutrition.fat;
        portions.push({
          foodId: food.id,
          foodName: food.name,
          grams,
          nutrition,
          isConfirmed: false,
          isModified: false
        });
        usedKcal += scale(food.nutrition, grams).kcal;
      }
    }
  }

    // Carboidrati: riempiono l'energia residua del pasto
    if (slots.includes('carb')) {
      const carbFood = pickRotating(carbPool, mealIdx + dayIndex * 5 + (mealIdx === mealCount - 1 && mealCount >= 2 ? 3 : 0));
      const residualKcal = Math.max(mealKcal - usedKcal, 0);
      const grams = clampGrams(residualKcal / carbFood.nutrition.kcal * 100, 'carb');
      portions.unshift({
        foodId: carbFood.id,
        foodName: carbFood.name,
        grams,
        nutrition: {
          calories: Math.round(carbFood.nutrition.kcal * grams / 100),
          protein: Math.round(carbFood.nutrition.protein * grams / 100 * 10) / 10,
          carbs: Math.round(carbFood.nutrition.carbs * grams / 100 * 10) / 10,
          fat: Math.round(carbFood.nutrition.fats * grams / 100 * 10) / 10,
          fiber: Math.round(carbFood.nutrition.fiber * grams / 100 * 10) / 10,
          sugar: 0,
          sodium: carbFood.nutrition.micronutrients?.sodium ? Math.round(carbFood.nutrition.micronutrients.sodium * grams / 100) : 0
        },
        isConfirmed: false,
        isModified: false
      }); // i carboidrati aprono il pasto
    }

    // Inserisci la proteina nella posizione definita dagli slot
    const proteinPortion: MealPortion = {
      foodId: proteinFood.id,
      foodName: proteinFood.name,
      grams: slotGrams.protein!,
      nutrition: {
        calories: Math.round(proteinFood.nutrition.kcal * slotGrams.protein! / 100),
        protein: Math.round(proteinFood.nutrition.protein * slotGrams.protein! / 100 * 10) / 10,
        carbs: Math.round(proteinFood.nutrition.carbs * slotGrams.protein! / 100 * 10) / 10,
        fat: Math.round(proteinFood.nutrition.fats * slotGrams.protein! / 100 * 10) / 10,
        fiber: Math.round(proteinFood.nutrition.fiber * slotGrams.protein! / 100 * 10) / 10,
        sugar: 0,
        sodium: proteinFood.nutrition.micronutrients?.sodium ? Math.round(proteinFood.nutrition.micronutrients.sodium * slotGrams.protein! / 100) : 0
      },
      isConfirmed: false,
      isModified: false
    };
    const proteinIdx = slots.indexOf('protein');
    portions.splice(Math.min(proteinIdx, portions.length), 0, proteinPortion);

    // Fase 2: test di reintroduzione del gruppo FODMAP assegnato al giorno
    if (safePhase2TestGroup && testGroupIds.length > 0) {
      const testFood = foodById(testGroupIds[dayIndex % testGroupIds.length]);
      if (testFood) {
        portions.push({
          foodId: testFood.id,
          foodName: testFood.name,
          grams: 60,
          nutrition: {
            calories: Math.round(testFood.nutrition.kcal * 60 / 100),
            protein: Math.round(testFood.nutrition.protein * 60 / 100 * 10) / 10,
            carbs: Math.round(testFood.nutrition.carbs * 60 / 100 * 10) / 10,
            fat: Math.round(testFood.nutrition.fats * 60 / 100 * 10) / 10,
            fiber: Math.round(testFood.nutrition.fiber * 60 / 100 * 10) / 10,
            sugar: 0,
            sodium: testFood.nutrition.micronutrients?.sodium ? Math.round(testFood.nutrition.micronutrients.sodium * 60 / 100) : 0
          },
          isConfirmed: false,
          isModified: false,
          reintroduced: true,
          testGroup: safePhase2TestGroup
        });
      }
    }

    // Fase 3: una reintroduzione facoltativa per pranzo e cena (main meals only)
    if (phase === 'phase3' && isMainMealType(mealKey) && reintroPool.length > 0) {
      const reintroFood = pickRotating(reintroPool, mealIdx + dayIndex);
      portions.push({
        foodId: reintroFood.id,
        foodName: reintroFood.name,
        grams: 50,
        nutrition: {
          calories: Math.round(reintroFood.nutrition.kcal * 50 / 100),
          protein: Math.round(reintroFood.nutrition.protein * 50 / 100 * 10) / 10,
          carbs: Math.round(reintroFood.nutrition.carbs * 50 / 100 * 10) / 10,
          fat: Math.round(reintroFood.nutrition.fats * 50 / 100 * 10) / 10,
          fiber: Math.round(reintroFood.nutrition.fiber * 50 / 100 * 10) / 10,
          sugar: 0,
          sodium: reintroFood.nutrition.micronutrients?.sodium ? Math.round(reintroFood.nutrition.micronutrients.sodium * 50 / 100) : 0
        },
        isConfirmed: false,
        isModified: false,
        reintroduced: true
      });
    }

    const totals = portions.reduce((acc, p) => add(acc, scale(
      { kcal: p.nutrition.calories, protein: p.nutrition.protein, carbs: p.nutrition.carbs, fats: p.nutrition.fat, fiber: p.nutrition.fiber },
      100
    )), emptyNutrition());

    return {
      name: getMealName(mealKey).charAt(0).toUpperCase() + getMealName(mealKey).slice(1),
      key: mealKey,
      portions,
      totalNutrition: {
        calories: totals.kcal,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fats,
        fiber: totals.fiber,
        sugar: 0,
        sodium: portions.reduce((sum, p) => sum + p.nutrition.sodium, 0)
      },
      isConfirmed: false
    };
  });

  const totals = meals.reduce((acc, m) => add(acc, {
    kcal: m.totalNutrition.calories,
    protein: m.totalNutrition.protein,
    carbs: m.totalNutrition.carbs,
    fats: m.totalNutrition.fat,
    fiber: m.totalNutrition.fiber
  }), emptyNutrition());

  // Use provided startDate or fallback to today
  const effectiveStartDate = startDate || new Date().toISOString().split('T')[0];

  return {
    dayIndex,
    phase,
    phaseDay,
    date: getDateFromDayIndex(dayIndex, effectiveStartDate),
    meals,
    dailyTotals: {
      calories: totals.kcal,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fats,
      fiber: totals.fiber,
      sugar: 0,
      sodium: meals.reduce((sum, m) => sum + m.totalNutrition.sodium, 0)
    },
    isCompleted: false
  };
}

/**
 * Calculates the day index from a target date and the diet start date.
 * @param date - Target date in ISO format (YYYY-MM-DD)
 * @param startDate - Diet start date in ISO format (YYYY-MM-DD)
 * @returns The 0-based day index from the start date
 */
const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export function getDayIndexFromDate(date: DateKey, startDate: DateKey): number {
  const start = parseLocalDate(startDate);
  const target = parseLocalDate(date);
  const diffTime = target.getTime() - start.getTime();
  return Math.round(diffTime / (24 * 60 * 60 * 1000));
}

/**
 * Calculates the date string from a day index and the diet start date.
 * @param dayIndex - 0-based day index from the start date
 * @param startDate - Diet start date in ISO format (YYYY-MM-DD)
 * @returns The ISO date string (YYYY-MM-DD) for the given day index
 */
export function getDateFromDayIndex(dayIndex: number, startDate: DateKey): DateKey {
  const start = parseLocalDate(startDate);
  const target = new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayIndex);
  const y = target.getFullYear();
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const d = String(target.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
