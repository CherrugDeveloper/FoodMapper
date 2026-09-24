import { FOODS_DATABASE } from './foodsData';
import type { FoodItem, FoodNutrition, Micro } from './foodsData';
import type { NutritionalResults, UserData } from './nutritionEngine';

export type DietPhase = 'phase0' | 'phase1' | 'phase2' | 'phase3';
export type MealKey = 'colazione' | 'pranzo' | 'spuntino' | 'cena';

export interface MealPortion {
  food: FoodItem;
  grams: number;
  /** true per alimenti ad alto FODMAP reintrodotti in fase 3 (solo se tollerati) */
  reintroduced?: boolean;
  /** Gruppo FODMAP testato durante la fase 2 */
  testGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
}

export interface GeneratedMeal {
  mealKey: MealKey;
  portions: MealPortion[];
  totals: FoodNutrition;
  micros: Micro[];
}

export interface GeneratedDayPlan {
  meals: GeneratedMeal[];
  totals: FoodNutrition;
}

// Energia destinata a ciascun pasto sul fabbisogno giornaliero
const MEAL_KCAL_SHARE: Record<MealKey, number> = {
  colazione: 0.25,
  pranzo: 0.35,
  spuntino: 0.10,
  cena: 0.30
};

// Quota del target proteico giornaliero assegnata a ciascun pasto
const MEAL_PROTEIN_SHARE: Record<MealKey, number> = {
  colazione: 0.20,
  pranzo: 0.35,
  spuntino: 0.10,
  cena: 0.35
};

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

// Reintroduzioni facoltative per la fase 3 (porzione moderata, solo se tollerate)
const REINTRO_POOL = ['8', '11', '14', '1', '23', '32', '42', '7', '4', '10'];

const MEAL_SLOTS: Record<MealKey, SlotRole[]> = {
  colazione: ['carb', 'protein', 'fruit', 'fat'],
  pranzo: ['carb', 'protein', 'veg', 'fat'],
  spuntino: ['fruit', 'protein', 'fat'],
  cena: ['protein', 'carb', 'veg', 'fat']
};

// Limiti di porzione sensati per ruolo (grammi)
const GRAMS_RANGE: Record<SlotRole, [number, number]> = {
  carb: [40, 300],
  protein: [60, 260],
  fat: [5, 30],
  veg: [100, 250],
  fruit: [80, 200]
};

const foodById = (id: string): FoodItem => FOODS_DATABASE.find(f => f.id === id)!;

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
 * Genera un piano giornaliero ad hoc: porzioni in grammi calibrate sui target
 * calcolati (kcal del pasto, quota proteica), rispettando fase, condizioni e giorno.
 */
export function generateDayPlan(
  results: NutritionalResults,
  userData: UserData | null,
  phase: DietPhase,
  dayIndex = 0,
  phaseDay = 0
): GeneratedDayPlan {
  const conditions = userData?.conditions ?? [];
  const mealKeys = Object.keys(MEAL_KCAL_SHARE) as MealKey[];

  // Adattamenti per condizioni: il celiaco non vede frumento neppure in fase 3,
  // l'intollerante al lattosio non vede latte/formaggi freschi, l'iperteso evita
  // i formaggi stagionati come fonte proteica, il diabetico privilegia carboidrati
  // a basso carico glicemico (avena, quinoa, grano saraceno in testa al pool).
  const carbPool = conditions.includes('diabetes')
    ? POOLS.carb
    : [...POOLS.carb].reverse();
  const proteinPool = conditions.includes('hypertension')
    ? POOLS.protein.filter(id => id !== '12')
    : POOLS.protein;
  const reintroPool = REINTRO_POOL.filter(id =>
    !(conditions.includes('celiac') && id === '1') &&
    !(conditions.includes('lactose_intolerance') && id === '11')
  );

  const pickRotating = (pool: string[], index: number): FoodItem =>
    foodById(pool[index % pool.length]);

  const phase2TestGroup = phase === 'phase2' ? getPhase2TestGroup(phaseDay) : null;
  const testGroupIds = phase2TestGroup
    ? FOODS_DATABASE.filter(f => f.fodmapLevel === 'high' && f.triggerGroup === phase2TestGroup).map(f => f.id)
    : [];

  const meals: GeneratedMeal[] = mealKeys.map((mealKey, mealIdx) => {
    const mealKcal = results.estimatedTotalEnergyKcal * MEAL_KCAL_SHARE[mealKey];
    const proteinTarget = results.proteins * MEAL_PROTEIN_SHARE[mealKey];
    const portions: MealPortion[] = [];
    let usedKcal = 0;

    // Proteine: grammi ricavati dal target proteico del pasto
    const proteinFood = pickRotating(proteinPool, mealIdx + dayIndex * 2 + (phase === 'phase2' ? 1 : 0));
    const proteinGrams = clampGrams(proteinTarget / proteinFood.nutrition.protein * 100, 'protein');
    const proteinNutrition = scale(proteinFood.nutrition, proteinGrams);
    usedKcal += proteinNutrition.kcal;

    // Vegetali o frutta a porzione fissa, poi grassi calibrati sul target lipidico
    const slots = MEAL_SLOTS[mealKey];
    const slotGrams: Partial<Record<SlotRole, number>> = {};

    for (const role of slots) {
      if (role === 'protein') {
        slotGrams.protein = proteinGrams;
      } else if (role === 'veg' || role === 'fruit') {
        const food = pickRotating(
          role === 'veg' ? POOLS.veg : POOLS.fruit,
          mealIdx + dayIndex * 3 + (mealKey === 'spuntino' ? 2 : 0)
        );
        const grams = role === 'veg' ? 180 : 130;
        portions.push({ food, grams });
        usedKcal += scale(food.nutrition, grams).kcal;
      } else if (role === 'fat') {
        const food = pickRotating(POOLS.fat, mealIdx + dayIndex * 4 + (phase === 'phase3' ? 2 : 0));
        const grams = clampGrams((results.fats * MEAL_KCAL_SHARE[mealKey]) / food.nutrition.fats * 100 || 10, 'fat');
        portions.push({ food, grams });
        usedKcal += scale(food.nutrition, grams).kcal;
      }
    }

    // Carboidrati: riempiono l'energia residua del pasto
    if (slots.includes('carb')) {
      const carbFood = pickRotating(carbPool, mealIdx + dayIndex * 5 + (mealKey === 'cena' ? 3 : 0));
      const residualKcal = Math.max(mealKcal - usedKcal, 80);
      const grams = clampGrams(residualKcal / carbFood.nutrition.kcal * 100, 'carb');
      portions.unshift({ food: carbFood, grams }); // i carboidrati aprono il pasto
    }

    // Inserisci la proteina nella posizione definita dagli slot
    const proteinPortion: MealPortion = { food: proteinFood, grams: slotGrams.protein! };
    const proteinIdx = slots.indexOf('protein');
    portions.splice(Math.min(proteinIdx, portions.length), 0, proteinPortion);

    // Fase 2: test di reintroduzione del gruppo FODMAP assegnato al giorno
    if (phase2TestGroup && testGroupIds.length > 0) {
      const testFood = foodById(testGroupIds[dayIndex % testGroupIds.length]);
      portions.push({
        food: testFood,
        grams: 60,
        reintroduced: true,
        testGroup: phase2TestGroup
      });
    }

    // Fase 3: una reintroduzione facoltativa per pranzo e cena
    if (phase === 'phase3' && (mealKey === 'pranzo' || mealKey === 'cena') && reintroPool.length > 0) {
      const reintroFood = pickRotating(reintroPool, mealIdx + dayIndex);
      portions.push({ food: reintroFood, grams: 50, reintroduced: true });
    }

    const totals = portions.reduce((acc, p) => add(acc, scale(p.food.nutrition, p.grams)), emptyNutrition());
    const micros = [...new Set(portions.flatMap(p => p.food.micros ?? []))];

    return { mealKey, portions, totals, micros };
  });

  const totals = meals.reduce((acc, m) => add(acc, m.totals), emptyNutrition());
  return { meals, totals };
}
