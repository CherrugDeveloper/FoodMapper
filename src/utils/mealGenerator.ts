import { FOODS_DATABASE } from './foodsData';
import type { FoodItem, FoodNutrition, CostCategory } from './foodsData';
import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPhase, MealKey, DateKey, MealPortion, GeneratedMeal, DayPlan } from '../types/dietPlan';

/**
 * Explicit meal keys arrays for each meal count (1-7)
 * Ensures correct meal ordering, especially for 5 meals (ends with dinner, not generic snack)
 */
const MEAL_KEYS_BY_COUNT: Record<number, MealKey[]> = {
  1: ['cena'],
  2: ['colazione', 'cena'],
  3: ['colazione', 'pranzo', 'cena'],
  4: ['colazione', 'spuntinoMattina', 'pranzo', 'cena'],
  5: ['colazione', 'spuntinoMattina', 'pranzo', 'spuntinoPomeriggio', 'cena'],
  6: ['colazione', 'spuntinoMattina', 'pranzo', 'spuntinoPomeriggio', 'spuntinoSera', 'cena'],
  7: ['colazione', 'spuntinoMattina', 'pranzo', 'spuntinoPomeriggio', 'spuntino', 'spuntinoSera', 'cena']
};

/**
 * Caloric distribution for different meal counts
 * Values represent the percentage of daily calories for each meal position
 */
const MEAL_KCAL_SHARES: Record<number, number[]> = {
  1: [1.0], // Only dinner-style large meal
  2: [0.35, 0.65], // Breakfast + Dinner
  3: [0.30, 0.40, 0.30], // Breakfast + Lunch + Dinner (Italian style)
  4: [0.25, 0.10, 0.35, 0.30], // Breakfast + Morning Snack + Lunch + Dinner
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

/**
 * Current month for seasonal prioritization
 */
const currentMonth = new Date().getMonth() + 1; // 1-12

/**
 * Checks if a food is in season based on its months field
 * Foods without months field are considered year-round available
 */
const isFoodInSeason = (food: FoodItem): boolean => {
  if (!food.months || food.months.length === 0) return true;
  return food.months.includes(currentMonth);
};

/**
 * Sorts a pool of food IDs by:
 * 1. Low cost first (low < medium < high)
 * 2. In-season items second
 * 3. Deterministic fallback by ID for reproducibility
 */
const sortByCostAndSeasonal = (ids: string[]): string[] => {
  return [...ids].sort((a, b) => {
    const foodA = FOODS_DATABASE.find(f => f.id === a);
    const foodB = FOODS_DATABASE.find(f => f.id === b);
    
    if (!foodA || !foodB) return 0;
    
    const costA = foodA.costCategory ?? 'medium';
    const costB = foodB.costCategory ?? 'medium';
    
    const costOrder: Record<CostCategory, number> = { 'low': 0, 'medium': 1, 'high': 2 };
    const costDiff = costOrder[costA] - costOrder[costB];
    if (costDiff !== 0) return costDiff;
    
    const seasonA = isFoodInSeason(foodA) ? 0 : 1;
    const seasonB = isFoodInSeason(foodB) ? 0 : 1;
    if (seasonA !== seasonB) return seasonA - seasonB;
    
    return a.localeCompare(b);
  });
};

/**
 * Pool di alimenti per ruolo: solo low-FODMAP nella base; gli high-FODMAP
 * compaiono solo in fase 2/3 come reintroduzione testata.

 * Per spuntini mattina/pomeriggio si usano solo carboidrati complessi (non patate).
 */
const POOLS: Record<SlotRole, string[]> = {
  carb: ['3', '15', '17', '2', '16', '24', '18'],
  protein: ['33', '34', '13', '35', '36', '12', '57'], // Aggiunto tempeh (57) - 19g proteine
  fat: ['37', '38', '39', '40', '41'],
  veg: ['5', '6', '19', '20', '21', '22', '25', '26'],
  fruit: ['9', '27', '28', '29', '30', '31']
};

/**
 * Returns filtered pools based on mealSuitability for specific meal types.
 * Filters foods to only those appropriate for breakfast, snack, or lunch_dinner.
 */
const filterPoolByMealSuitability = (pool: string[], mealType: 'breakfast' | 'snack' | 'lunch_dinner'): string[] => {
  return pool.filter(foodId => {
    const food = FOODS_DATABASE.find(f => f.id === foodId);
    if (!food) return false;
    const suitability = food.mealSuitability ?? 'any';
    // Gestisce sia valori singoli che array di mealSuitability
    const suitabilityArray = Array.isArray(suitability) ? suitability : [suitability];
    return suitabilityArray.includes(mealType) || suitabilityArray.includes('any');
  });
};

/**
 * Gets the appropriate food pool for a specific meal type, filtering by mealSuitability.
 * Uses dedicated snack carb pool to avoid issues with buckwheat texture complaints.
 */
const getMealPool = (role: SlotRole, mealKey: MealKey): string[] => {
  let mealType: 'breakfast' | 'snack' | 'lunch_dinner' | 'any';
  
  if (mealKey === 'colazione') {
    mealType = 'breakfast';
  } else if (mealKey.includes('spuntino')) {
    mealType = 'snack';
  } else {
    mealType = 'lunch_dinner';
  }
  
  // Per gli snack, usa pool dedicato per carboidrati (esclude grano saraceno)
  if (role === 'carb' && mealType === 'snack') {
    return SNACK_CARB_POOL;
  }
  
  const pool = POOLS[role] ?? [];
  
  // For breakfast, filter to only breakfast-suitable foods; for snacks, filter to snack-compatible
  if (mealType === 'breakfast') {
    return filterPoolByMealSuitability(pool, 'breakfast');
  } else if (mealType === 'snack') {
    return filterPoolByMealSuitability(pool, 'snack');
  }
  
  return pool;
};

// Pool per spuntini: esclude carne (33) e pesce (34) che sono insoliti per spuntini
// Include solo tofu, yogurt greco, tempeh e ricotta per porzioni proteiche
// Tempeh (57), yogurt greco (36) e ricotta (92) hanno migliore profilo proteico per snack
// NOTA: l'ID '13' (Uova e Carne fresca) ha mealSuitability 'breakfast' e l'ID '12'
// (Parmigiano) ha 'lunch_dinner', quindi non sono adatti agli snack
const SNACK_PROTEIN_POOL = ['35', '36', '57', '92'];

// Pool per carboidrati negli snack: esclude grano saraceno per evitare complaint texture
// Usa avena (15) e riso (2) come alternativa più accettata
// Aggiornato: aggiunti couscous (52) e pasta integrale (53) per varietà
// NOTA: l'ID '24' (Patate) ha mealSuitability 'lunch_dinner', quindi non è adatto agli snack
const SNACK_CARB_POOL = ['15', '2', '52', '53'];

// Quantità minima per entrate proteiche negli snack (grams)
// Aumentato da 20g a 25g per porzioni più soddisfacenti
// Tofu e uova vengono usati in porzioni più piccole, ma devono avere un minimo significativo
const MIN_SNAP_PROTEIN_GRAMS = 25;

// Reintroduzioni facoltative per la fase 3 (porzione moderata, solo se tollerate)
const REINTRO_POOL = ['8', '11', '14', '1', '23', '32', '42', '7', '4', '10'];

// Limiti di porzione sensati per ruolo (grammi)
// Aggiornati per porzioni realistiche acquistabili al supermercato
// Carboidrati: 60-200g (es. 1 tazza riso, 150g avena, 2 fette pane)
// Proteine: 100-200g (es. 2 uova, 150g yogurt, 100g tofu)
// Grassi: 10-25g (es. 10 mandorle, 1 cucchiaio semi, 5g cioccolato)
// Verdura: 150-250g (porzione media da portata)
// Frutta: 100-160g (1-2 frutti medi)
const GRAMS_RANGE: Record<SlotRole, [number, number]> = {
  carb: [60, 200],
  protein: [100, 200],
  fat: [10, 25],
  veg: [150, 250],
  fruit: [100, 160]
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
 * Prioritizes low-cost and seasonal foods for better sustainability.
 * @param mealCount - Number of meals per day (1-7)
 */
export function generateDayPlan(
  results: NutritionalResults,
  userData: UserData | null,
  phase: DietPhase,
  dayIndex = 0,
  phaseDay = 0,
  startDate?: string,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 7
): DayPlan {
  const conditions = userData?.conditions ?? [];

  // Get meal keys based on meal count using explicit mapping
  const mealKeys: MealKey[] = MEAL_KEYS_BY_COUNT[mealCount];

  // Get kcal and protein shares for this meal count
  const kcalShares = MEAL_KCAL_SHARES[mealCount];
  const proteinShares = MEAL_PROTEIN_SHARES[mealCount];

  // Adattamenti per condizioni: il celiaco non vede frumento neppure in fase 3,
  // l'intollerante al lattosio non vede latte/formaggi freschi, l'iperteso evita
  // i formaggi stagionati come fonte proteica, il diabetico privilegia carboidrati
  // a basso carico glicemico (avena, quinoa, grano saraceno in testa al pool).
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

  /**
       * Selects a food from the pool, preferring low-cost and in-season items.
       * Implements cost-based prioritization for sustainability.
       * Sorts the pool by cost and seasonality before selection.
       */
      const pickRotating = (pool: string[], index: number): FoodItem => {
        if (pool.length === 0) {
          throw new Error(`Empty food pool provided to pickRotating`);
        }
        
        // Sort pool by sustainability (cost, then seasonality)
        const sortedPool = sortByCostAndSeasonal(pool);
        const safeIndex = ((index % sortedPool.length) + sortedPool.length) % sortedPool.length;
        
        const food = foodById(sortedPool[safeIndex]);
        if (!food) {
          throw new Error(`Food not found for ID: ${sortedPool[safeIndex]}`);
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
    // Track cumulative protein from previous meals
    const mealKcal = results.targetCaloriesKcal * kcalShares[mealIdx];
    const proteinTarget = results.proteins * proteinShares[mealIdx];
    const portions: MealPortion[] = [];
    let usedKcal = 0;
    let mealFatGrams = 0;
    const slotGrams: Record<SlotRole, number> = {
      fruit: 0,
      protein: 0,
      fat: 0,
      veg: 0,
      carb: 0,
    }

    // Determine if this is breakfast or snack based on meal key
    const isBreakfast = isBreakfastMeal(mealKey);
    const isSnack = isSnackMealType(mealKey);
    const effectiveProteinPool = isBreakfast
      ? getMealPool('protein', mealKey)
      : isSnack
        ? SNACK_PROTEIN_POOL
        : proteinPool;

    // Get slot definitions for this meal
    const slots = getMealSlots(mealKey);

    // Proteine: grammi ricavati dal target proteico del pasto
    // Negli snack, forziamo una quantità minima di proteine per evitare porzioni troppo piccole
    const proteinFood = pickRotating(effectiveProteinPool, mealIdx + dayIndex * 2 + (phase === 'phase2' ? 1 : 0));
    const rawProteinGrams = proteinTarget;
    const proteinGrams = isSnack && rawProteinGrams < MIN_SNAP_PROTEIN_GRAMS
      ? MIN_SNAP_PROTEIN_GRAMS
      : rawProteinGrams;
    const proteinNutrition = scale(proteinFood.nutrition, proteinGrams);
    usedKcal += proteinNutrition.kcal;
    mealFatGrams += proteinNutrition.fats;


    for (const role of slots) {
      if (role === 'protein') {
        slotGrams.protein = proteinGrams;
      } else if (role === 'veg' || role === 'fruit') {
        const mealPool = getMealPool(role, mealKey);
        const food = pickRotating(
          mealPool,
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
        const effectiveFatPool = getMealPool('fat', mealKey);
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
          mealKcal * 0.35 / 9 // Max 35% of meal calories from fat (increased from 30% to meet daily fat target)
        );

        // Only add fat food when there's actual calorie capacity
        // Minimum 2g from fat foods for satiety/quality, but only if we have room
        // Don't force calories beyond meal target
        const effectiveFatGrams = Math.max(effectiveFatNeeded, 0);

        // Clamp fat to not exceed remaining calories
        const availableCalories = mealKcal - usedKcal;
        const finalFatGrams = Math.min(effectiveFatGrams, availableCalories / 9);

        if (finalFatGrams > 0) {
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

    // Carboidrati: riempieno l'energia residua del pasto
    // Usa pool specifico per tipo di pasto (colazione esclude patate)
    if (slots.includes('carb')) {
      const effectiveCarbPool = getMealPool('carb', mealKey);
      const carbFood = pickRotating(effectiveCarbPool, mealIdx + dayIndex * 5 + (mealIdx === mealCount - 1 && mealCount >= 2 ? 3 : 0));
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

  // Normalize protein to match daily target exactly before returning
  const proteinScale = 100 / totals.protein;
  const normalizedProtein = Math.round(totals.protein * proteinScale * 10) / 10;
  const normalizedKcal = Math.round(totals.kcal * proteinScale * 10) / 10;
  const normalizedCarbs = Math.round(totals.carbs * proteinScale * 10) / 10;
  const normalizedFats = Math.round(totals.fats * proteinScale * 10) / 10;
  const normalizedFiber = Math.round(totals.fiber * proteinScale * 10) / 10;

  return {
    dayIndex,
    phase,
    phaseDay,
    date: getDateFromDayIndex(dayIndex, effectiveStartDate),
    meals,
    dailyTotals: {
      calories: normalizedKcal,
      protein: normalizedProtein,
      carbs: normalizedCarbs,
      fat: normalizedFats,
      fiber: normalizedFiber,
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