import { FOODS_DATABASE } from './foodsData';
import type { FoodItem, FoodNutrition, CostCategory } from './foodsData';
import type { NutritionalResults, UserData } from './nutritionEngine';
import type { DietPhase, MealKey, DateKey, MealPortion, GeneratedMeal, DayPlan } from '../types/dietPlan';

/**
 * Unit types for food display - whole units instead of grams where appropriate
 */
export type FoodUnit = 'g' | 'uova' | 'vasetti' | 'quadrati' | 'cucchiai' | 'fette' | 'pz' | 'noci' | 'patate' | 'banane' | 'lamponi' | 'tofu' | 'tempeh';

/**
 * Ordina le porzioni secondo la struttura del pasto italiano.
 * L'ordine è: Primo (carboidrati), Secondo (proteine), Contorno (verdure),
 * Panificati, Frutta secca, Dessert (frutta).
 */
const sortPortionsByItalianMealStructure = (portions: MealPortion[]): MealPortion[] => {
  const orderMap: Record<string, number> = {
    // Primo piatti (carboidrati principali)
    'riso': 1, 'pasta': 1, 'cereali': 1, 'grano': 1, 'avena': 1, 'quinoa': 1, 'farro': 1, 'mais': 1, 'polenta': 1,
    // Secondi (proteine)
    'carne': 2, 'pesce': 2, 'pollo': 2, 'uova': 2, 'legumi': 2, 'tofu': 2, 'tempeh': 2, 'yogurt': 2, 'ricotta': 2, 'parmigiano': 2,
    // Contorni (verdure)
    'verdura': 3, 'insalata': 3, 'verdure': 3, 'zucchine': 3, 'melanzane': 3, 'spinaci': 3, 'broccoli': 3, 'cavolfiore': 3, 'finocchi': 3, 'carote': 3, 'peperoni': 3, 'pomodori': 3, 'rucola': 3,
    // Panificati
    'pane': 4, 'fette': 4, 'grissini': 4, 'crackers': 4,
    // Frutta secca
    'noci': 5, 'mandorle': 5, 'nocciole': 5, 'anacardi': 5, 'pistacchi': 5, 'semi': 5, 'chia': 5, 'zucca': 5, 'lino': 5, 'pinoli': 5,
    // Dessert (frutta)
    'frutta': 6, 'frutti': 6, 'mela': 6, 'pera': 6, 'banana': 6, 'arancia': 6, 'kiwi': 6, 'fragole': 6, 'mirtilli': 6, 'melone': 6, 'anguria': 6, 'pesche': 6, 'albicocche': 6, 'ciliegie': 6, 'uva': 6
  };
  
  return portions.sort((a, b) => {
    const aCategory = a.foodName.toLowerCase();
    const bCategory = b.foodName.toLowerCase();
    
    let aOrder = 99;
    let bOrder = 99;
    
    // Cerca l'ordine per categoria per entrambi gli alimenti
    for (const [category, order] of Object.entries(orderMap)) {
      if (aCategory.includes(category)) aOrder = order;
      if (bCategory.includes(category)) bOrder = order;
    }
    
    return aOrder - bOrder;
  });
};

/**
 * Esplicit meal keys arrays for each meal count (1-7)
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
 * Tariffe giornaliere di grassi per pasto (15-25g)
 * Basate su obiettivo 20-30% delle calorie giornaliere da grassi
 */
export const FAT_TARGET_MIN = 15;  // g per pasto
export const FAT_TARGET_MAX = 25;  // g per pasto
export const FAT_TARGET_MEDIAN = 20; // g per pasto

/**
 * Pool di alimenti per ruolo: solo low-FODMAP nella base; gli high-FODMAP
 * compaiono solo in fase 2/3 come reintroduzione testata.
 *
 * Per spuntini mattina/pomeriggio si usano solo carboidrati complessi (non patate).
 */
const POOLS: Record<SlotRole, string[]> = {
  carb: ['3', '15', '2', '16', '24', '18'], // Rimosso grano saraceno (17) - insolito per colazione italiana
  protein: ['33', '34', '13', '35', '36', '12', '57'], // Aggiunto tempeh (57) - 19g proteine
  fat: ['37', '38', '39', '40', '41', '68', '83'], // Aggiunte noci (68) e olio di sesamo/tahina (83) - grassi buoni e omega-3
  veg: ['5', '6', '19', '20', '21', '22', '25', '26'],
  fruit: ['9', '27', '28', '29', '30', '31'], // Papaia (52) rimossa - difficile da trovare/costosa in Italia
};

/**
 * Pool specializzato per alimenti ricchi di omega-3 (ALA/EPA/DHA)
 * Inclusi solo alimenti low FODMAP con buona fonte di omega-3
 */
const OMEGA3_POOL = ['39', '68', '34']; // Semi chia (ALA 17000mg), noci (ALA 9080mg), sarde/sgombro (EPA/DHA 1800mg)

interface FodmapFilterOptions {
  phase: DietPhase;
  conditions: string[];
  phaseDay?: number;
  testGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
  userAllergens?: string[];
}

/**
 * Verifica se un alimento è adatto per la fase di dieta corrente
 * in base al livello FODMAP e alle condizioni utente
 */
const isFoodFodmapCompatible = (
  food: FoodItem,
  options: FodmapFilterOptions
): boolean => {
  const { phase, conditions, userAllergens = [] } = options;
  
  // Celiaco: nessun grano
  if (conditions.includes('celiac') && food.allergens?.includes('gluten')) {
    return false;
  }
  
  // Fase 0: tutti gli alimenti permessi
  if (phase === 'phase0' || phase === 'phase0-pre-start') {
    if (food.allergens && food.allergens.some(a => userAllergens.includes(a))) {
      return false;
    }
    // L'intollerante al lattosio non vede latte/formaggi freschi
    if (conditions.includes('lactose_intolerant') && food.allergens?.includes('milk')) {
      return false;
    }
    return true;
  }
  
  // Fase 1: solo low-FODMAP
  if (phase === 'phase1') {
    if (food.fodmapLevel !== 'low') {
      return false;
    }
    // Check allergeni
    if (food.allergens && food.allergens.some(a => userAllergens.includes(a))) {
      return false;
    }
    // L'intollerante al lattosio non vede latte/formaggi freschi
    if (conditions.includes('lactose_intolerant') && food.allergens?.includes('milk')) {
      return false;
    }
    return true;
  }
  
  // Fase 2: alimenti con test group specifico (solo se il giorno è del loro gruppo)
  if (phase === 'phase2') {
    if (food.fodmapLevel === 'high') {
      if (food.triggerGroup !== options.testGroup) {
        return false;
      }
    } else if (food.fodmapLevel === 'low') {
      // Low-FODMAP ok
    } else if (food.fodmapLevel === 'medium') {
      // Medium FODMAP consentiti solo se non sono in trigger group
      if (food.triggerGroup && food.triggerGroup !== options.testGroup) {
        return false;
      }
    }
    if (food.allergens && food.allergens.some(a => userAllergens.includes(a))) {
      return false;
    }
    // L'intollerante al lattosio non vede latte/formaggi freschi
    if (conditions.includes('lactose_intolerant') && food.allergens?.includes('milk')) {
      return false;
    }
    return true;
  }
  
  // Fase 3: tutti gli alimenti, salvo allergeni
  if (food.allergens && food.allergens.some(a => userAllergens.includes(a))) {
    return false;
  }
  // L'intollerante al lattosio non vede latte/formaggi freschi
  if (conditions.includes('lactose_intolerant') && food.allergens?.includes('milk')) {
    return false;
  }
  return true;
};

/**
 * Restituisce il testo alternativo per un alimento, rimuovendo il riferimento
 * "Gluten-Free" / "senza glutine" se l'utente NON è celiaco.
 * Questo evita di suggerire alternative senza glutine a chi non ne ha bisogno.
 */
export const getAlternativeText = (
  food: FoodItem,
  conditions: string[]
): string => {
  if (!food.alternative) return '';
  
  // Se l'utente è celiaco, mostra l'alternativa completa
  if (conditions.includes('celiac')) {
    return food.alternative;
  }
  
  // Se NON è celiaco, rimuovi riferimenti a "Gluten-Free" / "senza glutine"
  let alt = food.alternative;
  // Rimuovi "Gluten-Free" e varianti
  alt = alt.replace(/Gluten-Free/gi, '');
  alt = alt.replace(/senza glutine/gi, '');
  alt = alt.replace(/certificati?\s*/gi, '');
  // Pulisci spazi multipli e virgole/spazi finali
  alt = alt.replace(/\s{2,}/g, ' ').trim();
  alt = alt.replace(/,\s*$/, '').trim();
  alt = alt.replace(/\s*o\s*$/i, '').trim();
  
  return alt;
};

/**
 * Applica il filtro FODMAP dinamico al pool di alimenti
 */
const filterPoolByFodmap = (
  pool: string[],
  options: FodmapFilterOptions
): string[] => {
  return pool.filter(foodId => {
    const food = FOODS_DATABASE.find(f => f.id === foodId);
    if (!food) return false;
    return isFoodFodmapCompatible(food, options);
  });
};

/**
 * Restituisce i pool di alimenti filtrati in base al mealSuitability per tipi di pasto specifici.
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
 * Gets the appropriate food pool for a specific meal type, filtering by mealSuitability
 * and FODMAP restrictions based on the current phase and user conditions.
 * Uses dedicated snack carb pool to avoid issues with buckwheat texture complaints.
 */
const getMealPool = (
  role: SlotRole,
  mealKey: MealKey,
  options?: {
    phase?: DietPhase;
    conditions?: string[];
    phaseDay?: number;
    testGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
    userAllergens?: string[];
  }
): string[] => {
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
  
  // Per gli snack, usa pool dedicato per proteine (esclude carne/pesce)
  if (role === 'protein' && mealType === 'snack') {
    let snackPool = SNACK_PROTEIN_POOL;
    // Apply FODMAP/allergen filtering if options provided
    if (options) {
      const fodmapOptions: FodmapFilterOptions = {
        phase: options.phase ?? 'phase1',
        conditions: options.conditions ?? [],
        phaseDay: options.phaseDay,
        testGroup: options.testGroup,
        userAllergens: options.userAllergens
      };
      snackPool = filterPoolByFodmap(snackPool, fodmapOptions);
    }
    return snackPool;
  }
  
  const pool = POOLS[role] ?? [];
  
  // Get base pool with meal suitability filtering
  let effectivePool = pool;
  if (mealType === 'breakfast') {
    effectivePool = filterPoolByMealSuitability(pool, 'breakfast');
  } else if (mealType === 'snack') {
    effectivePool = filterPoolByMealSuitability(pool, 'snack');
  }
  
  // Apply FODMAP filtering if options provided
  if (options) {
    const fodmapOptions: FodmapFilterOptions = {
      phase: options.phase ?? 'phase1',
      conditions: options.conditions ?? [],
      phaseDay: options.phaseDay,
      testGroup: options.testGroup,
      userAllergens: options.userAllergens
    };
    effectivePool = filterPoolByFodmap(effectivePool, fodmapOptions);
  }
  
  return effectivePool;
};

// Pool per spuntini: esclude carne (33) e pesce (34) che sono insoliti per spuntini
// Include solo yogurt greco e ricotta per porzioni proteiche
// Yogurt greco (36) e ricotta (92) sono pratici e gustosi per snack
// NOTA: l'ID '13' (Uova e Carne fresca) ha mealSuitability 'breakfast' e l'ID '12'
// (Parmigiano) ha 'lunch_dinner', quindi non sono adatti agli snack
// Tofu (35), tempeh (57) rimosse - non adatti a snack veloci/gustosi
const SNACK_PROTEIN_POOL = ['36', '92'];

// Pool per carboidrati negli snack: esclude grano saraceno per evitare complaint texture
// Usa pasta integrale (53) come alternativa più accettata
// NOTA: l'ID '24' (Patate) ha mealSuitability 'lunch_dinner', quindi non è adatto agli snack
// Quinoa (15) rimossa dal pool spuntini per evitare texture complaints e porzioni irrealistiche
// Riso rimosso dagli snack - preferibile pasta integrale o couscous
// Papaia (52) rimossa - difficile da trovare/costosa in Italia, sostituita con frutta comune
// Pool per carboidrati negli snack: esclude grano saraceno per evitare complaint texture
// Usa pasta integrale (53) come alternativa piu accettata
// NOTA: l'ID '24' (Patate) ha mealSuitability 'lunch_dinner', quindi non e adatto agli snack
const SNACK_CARB_POOL = ['53']; // Pasta integrale

// Quantità minima per entrate proteiche negli snack (grams)
// Aumentato da 20g a 25g per porzioni più soddisfacenti
// Tofu e uova vengono usati in porzioni più piccole, ma devono avere un minimo significativo
const MIN_SNAP_PROTEIN_GRAMS = 10;

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
}

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
 * Arrotonda le quantità a incrementi pratici (5g per cereali/legumi, 10g per grassi)
 * per evitare valori troppo precisi come 123g.
 */
const roundToPracticalGrams = (grams: number, increment: number = 5): number =>
  Math.round(grams / increment) * increment;

/**
 * Converte i grammi in unità intere quando l'alimento supporta porzioni intere
 * (uova, yogurt in vasetti da 125g, cioccolato in quadrati, ecc.)
 * Ritorna il valore in unità e la conversione in grammi equivalenti.
 */
const snapToWholeUnits = (foodId: string, grams: number): { units: number; grams: number } => {
  const unitMap: Record<string, { unit: FoodUnit; unitGrams: number; min: number; max: number }> = {
    '13': { unit: 'uova', unitGrams: 50, min: 2, max: 4 }, // Min 2 uova (100g) per porzione
    '35': { unit: 'pz', unitGrams: 150, min: 1, max: 2 }, // Tofu: panetto intero ~150g
    '57': { unit: 'pz', unitGrams: 100, min: 1, max: 2 }, // Tempeh: panetto intero ~100g
    '29': { unit: 'pz', unitGrams: 120, min: 1, max: 3 }, // Banana: pezzo intero ~120g
    '36': { unit: 'vasetti', unitGrams: 125, min: 1, max: 2 },
    '92': { unit: 'vasetti', unitGrams: 125, min: 1, max: 2 },
    '41': { unit: 'quadrati', unitGrams: 10, min: 1, max: 3 },
    '37': { unit: 'cucchiai', unitGrams: 10, min: 1, max: 3 },
    '83': { unit: 'cucchiai', unitGrams: 10, min: 1, max: 2 },
    '67': { unit: 'cucchiai', unitGrams: 10, min: 1, max: 2 },
    '1': { unit: 'fette', unitGrams: 50, min: 1, max: 4 },
    '18': { unit: 'fette', unitGrams: 50, min: 1, max: 4 },
    '38': { unit: 'pz', unitGrams: 1, min: 5, max: 20 },
    '68': { unit: 'pz', unitGrams: 5, min: 2, max: 8 },
    '39': { unit: 'cucchiai', unitGrams: 12, min: 1, max: 2 },
    '40': { unit: 'cucchiai', unitGrams: 10, min: 1, max: 2 },
    '72': { unit: 'pz', unitGrams: 3, min: 5, max: 20 },
    '73': { unit: 'cucchiai', unitGrams: 8, min: 1, max: 2 },
    '22': { unit: 'pz', unitGrams: 150, min: 1, max: 3 }, // Pomodori: conteggi (150g)
    '24': { unit: 'pz', unitGrams: 180, min: 1, max: 3 }, // Patate: conteggi (180g)
    '53': { unit: 'pz', unitGrams: 20, min: 1, max: 3 }, // Lamponi: conteggi (circa 10-12 lamponi per 20g)
    '15': { unit: 'pz', unitGrams: 150, min: 1, max: 2 }, // Arance: pezzo intero ~150g
  };
  
  const entry = unitMap[foodId];
  if (!entry) {
    return { units: Math.round(grams), grams };
  }
  
  const rawUnits = grams / entry.unitGrams;
  const units = rawUnits < entry.min ? 0 : Math.max(entry.min, Math.min(entry.max, Math.round(rawUnits)));
  const snappedGrams = units > 0 ? units * entry.unitGrams : Math.round(grams);
  
  return { units, grams: snappedGrams };
};

/**
 * Restituisce i grammi per unità per un alimento specifico
 */
export const getUnitGrams = (foodId: string): number => {
  const unitMap: Record<string, number> = {
    '13': 50,   // Uova: 50g each
    '35': 150,  // Tofu: 150g panetto
    '57': 100,  // Tempeh: 100g panetto
    '29': 120,  // Banana: 120g pezzo
    '36': 125,  // Yogurt: 125g vasetto
    '92': 125,  // Ricotta: 125g vasetto
    '41': 10,   // Cioccolato: 10g quadrato
    '37': 10,   // Olio EVO: 10g cucchiaio
    '83': 10,   // Olio Sesamo/Tahina: 10g cucchiaio
    '67': 10,   // Ghee: 10g cucchiaio
    '1': 50,    // Pane: 50g fetta
    '18': 50,   // Pane GF: 50g fetta
    '38': 1,    // Mandorle: 1g each
    '68': 5,    // Noci: 5g each
    '39': 12,   // Semi Chia: 12g cucchiaio
    '40': 10,   // Semi Zucca: 10g cucchiaio
    '72': 3,    // Olive: 3g each
    '73': 8,    // Pinoli: 8g cucchiaio
    '22': 150,  // Pomodori: 150g conteggio
    '24': 180,  // Patate: 180g conteggio
    '15': 150,  // Arance: 150g pezzo
  };
  return unitMap[foodId] || 1;
};

/**
 * Restituisce il tipo di unità per un alimento specifico
 */
export const getUnitType = (foodId: string): FoodUnit => {
  const unitMap: Record<string, FoodUnit> = {
    '13': 'uova',
    '35': 'pz',
    '57': 'pz',
    '29': 'pz',
    '36': 'vasetti',
    '92': 'vasetti',
    '41': 'quadrati',
    '37': 'cucchiai',
    '83': 'cucchiai',
    '67': 'cucchiai',
    '1': 'fette',
    '18': 'fette',
    '38': 'pz',
    '68': 'pz',
    '39': 'cucchiai',
    '40': 'cucchiai',
    '72': 'pz',
    '73': 'cucchiai',
    '22': 'pz', // Pomodori
    '24': 'pz', // Patate
    '53': 'pz', // Lamponi
    '15': 'pz', // Arance
  };
  return unitMap[foodId] || 'g';
};

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
 * Genera raccomandazioni omega-3 per il giorno
 * Restituisce gli ID degli alimenti ricchi di omega-3 che non sono stati già usati
 */
const getOmega3Recommendations = (
  usedFoodIds: Set<string>,
  mealCount: 1 | 2 | 3 | 4 | 5 | 6 | 7
): string[] => {
  const omega3InPool: string[] = [];
  
  // Aggiungi almeno un alimento omega-3 ogni 2-3 pasti
  const omega3Meals = Math.max(1, Math.floor(OMEGA3_POOL.length / mealCount));
  
  for (let i = 0; i < omega3Meals && omega3InPool.length < OMEGA3_POOL.length; i++) {
    const idx = i * 2;
    if (idx < OMEGA3_POOL.length && !usedFoodIds.has(OMEGA3_POOL[idx])) {
      omega3InPool.push(OMEGA3_POOL[idx]);
    }
  }
  
  return omega3InPool;
};

/**
 * Genera un giorno pianificazione con numero dinamico di pasti (1-7)
 * Priorità sui costi bassi e stagionali per migliore sostenibilità.
 * @param mealCount - Numero di pasti per giorno (1-7)
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

  // Track food IDs already used in this day to prevent repetition
  const usedFoodIds = new Set<string>();

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
    let safeIndex = ((index % sortedPool.length) + sortedPool.length) % sortedPool.length;
    
    // Skip foods already used in this day
    let foodId = sortedPool[safeIndex];
    const maxAttempts = sortedPool.length + 1;
    let attempts = 0;
    while (usedFoodIds.has(foodId) && attempts < maxAttempts) {
      attempts++;
      safeIndex = ((safeIndex + 1) % sortedPool.length + sortedPool.length) % sortedPool.length;
      foodId = sortedPool[safeIndex];
    }
    
    const food = foodById(foodId);
    if (!food) {
      throw new Error(`Food not found for ID: ${foodId}`);
    }
    // Mark this food as used for the rest of the day
    usedFoodIds.add(foodId);
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
    };

    // Determine if this is breakfast or snack based on meal key
    const isBreakfast = isBreakfastMeal(mealKey);
    const isSnack = isSnackMealType(mealKey);
    
    // Get effective protein pool with FODMAP filtering
    const effectiveProteinPool = isBreakfast
      ? getMealPool('protein', mealKey, { phase, conditions, phaseDay, testGroup: safePhase2TestGroup, userAllergens })
      : isSnack
        ? getMealPool('protein', mealKey, { phase, conditions, phaseDay, testGroup: safePhase2TestGroup, userAllergens })
        : proteinPool;

    // Get slot definitions for this meal
    const slots = getMealSlots(mealKey);

    // Proteine: grammi ricavati dal target proteico del pasto
    // Negli snack, forziamo una quantità minima di proteine per evitare porzioni troppo piccole
    const proteinFood = pickRotating(effectiveProteinPool, mealIdx + dayIndex * 2 + (phase === 'phase2' ? 1 : 0));
    const rawProteinGrams = proteinTarget;
    const proteinGrams = isSnack && rawProteinGrams < MIN_SNAP_PROTEIN_GRAMS
      ? MIN_SNAP_PROTEIN_GRAMS
      : roundToPracticalGrams(rawProteinGrams);
    
    // Convert protein target to food grams needed
    const proteinPer100g = proteinFood.nutrition.protein;
    const rawFoodGrams = proteinPer100g > 0 ? (proteinGrams / proteinPer100g) * 100 : 0;
    
    // Converte in unità intere per alimenti con porzioni intere (uova, yogurt, ricotta)
    const proteinWholeUnits = snapToWholeUnits(proteinFood.id, rawFoodGrams);
    // Use the actual snapped amount for tracking (not capped at target)
    const finalProteinGrams = proteinWholeUnits.grams;
    
    const proteinNutrition = scale(proteinFood.nutrition, finalProteinGrams);
    usedKcal += proteinNutrition.kcal;
    mealFatGrams += proteinNutrition.fats;




    for (const role of slots) {
      if (role === 'protein') {
        slotGrams.protein = finalProteinGrams;
      } else if (role === 'veg' || role === 'fruit') {
        const mealPool = getMealPool(role, mealKey, { phase, conditions, phaseDay, testGroup: safePhase2TestGroup, userAllergens });
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
        // Solo aggiungi verdura/frutta se ci sono grammi validi
        if (grams > 0) {
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
      } else if (role === 'fat') {
        const effectiveFatPool = getMealPool('fat', mealKey, { phase, conditions, phaseDay, testGroup: safePhase2TestGroup, userAllergens });
        const food = pickRotating(effectiveFatPool, mealIdx + dayIndex * 4 + (phase === 'phase3' ? 2 : 0));

        // Nuova logica: obiettivo 15-25g di grassi per pasto
        // Calcoliamo i grassi necessari rispetto al target giornaliero
        const totalFatGrams = results.fats;
        const mealFatTarget = totalFatGrams / mealCount; // Target medio per pasto
        
        // Rispetto al range target 15-25g
        const targetFatGrams = Math.min(
          FAT_TARGET_MAX,
          Math.max(FAT_TARGET_MIN, mealFatTarget)
        );
        
        // Calcoliamo i grassi mancanti
        const remainingFatNeeded = Math.max(targetFatGrams - mealFatGrams, 0);
        
        // Calcoliamo i grassi effettivi
        // Priorità: raggiungere il target, ma non esagerare con le calorie
        const effectiveFatGrams = Math.min(
          remainingFatNeeded,

          mealKcal * 0.35 / 9 // Max 35% di pasto in grassi
        );

        // Solo aggiungi grassi se c'è reale capacità calorica
        const effectiveFatGramsFinal = Math.max(effectiveFatGrams, 0);
        
        // Converte in unità intere per alimenti con porzioni intere
        const fatWhole = snapToWholeUnits(food.id, effectiveFatGramsFinal);
        const finalFatGrams = fatWhole.units > 0 ? fatWhole.grams : roundToPracticalGrams(effectiveFatGramsFinal, 5);
        
        if (finalFatGrams > 0) {
          const nutrition = {
            calories: Math.round(food.nutrition.kcal * finalFatGrams / 100),
            protein: Math.round(food.nutrition.protein * finalFatGrams / 100 * 10) / 10,
            carbs: Math.round(food.nutrition.carbs * finalFatGrams / 100 * 10) / 10,
            fat: Math.round(food.nutrition.fats * finalFatGrams / 100 * 10) / 10,
            fiber: Math.round(food.nutrition.fiber * finalFatGrams / 100 * 10) / 10,
            sugar: 0,
            sodium: food.nutrition.micronutrients?.sodium ? Math.round(food.nutrition.micronutrients.sodium * finalFatGrams / 100) : 0
          };
          mealFatGrams += nutrition.fat;
          portions.push({
            foodId: food.id,
            foodName: food.name,
            grams: finalFatGrams,
            nutrition,
            isConfirmed: false,
            isModified: false,
            // Etichetta omega-3 se appartenente al pool
            omega3Rich: OMEGA3_POOL.includes(food.id),
            // Mostra unità per grassi (cucchiai, ecc.)
            unit: getUnitType(food.id),
            unitValue: fatWhole.units
          });
          usedKcal += scale(food.nutrition, finalFatGrams).kcal;
        }
      }
    }

    // Carboidrati: riempieno l'energia residua del pasto
    // Usa pool specifico per tipo di pasto (colazione esclude patate)
    if (slots.includes('carb')) {
      const effectiveCarbPool = getMealPool('carb', mealKey, { phase, conditions, phaseDay, testGroup: safePhase2TestGroup, userAllergens });
      const carbFood = pickRotating(effectiveCarbPool, mealIdx + dayIndex * 5 + (mealIdx === mealCount - 1 && mealCount >= 2 ? 3 : 0));
      const residualKcal = Math.max(mealKcal - usedKcal, 0);
      const rawGrams = clampGrams(residualKcal / carbFood.nutrition.kcal * 100, 'carb');
      // Converte in unità intere per alimenti con porzioni intere (pane, ecc.)
      const carbWhole = snapToWholeUnits(carbFood.id, rawGrams);
      const finalCarbGrams = carbWhole.units > 0 ? carbWhole.units * getUnitGrams(carbFood.id) : roundToPracticalGrams(rawGrams);
      
      // Solo aggiungi carboidrati se ci sono grammi validi
      if (finalCarbGrams > 0) {
        portions.unshift({
          foodId: carbFood.id,
          foodName: carbFood.name,
          grams: finalCarbGrams,
          nutrition: {
            calories: Math.round(carbFood.nutrition.kcal * finalCarbGrams / 100),
            protein: Math.round(carbFood.nutrition.protein * finalCarbGrams / 100 * 10) / 10,
            carbs: Math.round(carbFood.nutrition.carbs * finalCarbGrams / 100 * 10) / 10,
            fat: Math.round(carbFood.nutrition.fats * finalCarbGrams / 100 * 10) / 10,
            fiber: Math.round(carbFood.nutrition.fiber * finalCarbGrams / 100 * 10) / 10,
            sugar: 0,
            sodium: carbFood.nutrition.micronutrients?.sodium ? Math.round(carbFood.nutrition.micronutrients.sodium * finalCarbGrams / 100) : 0
          },
          isConfirmed: false,
          isModified: false,
          // Mostra unità per carboidrati (fette di pane, ecc.)
          unit: carbWhole.units > 0 ? getUnitType(carbFood.id) : undefined,
          unitValue: carbWhole.units > 0 ? carbWhole.units : undefined
        }); // i carboidrati aprono il pasto
        
        // Aggiungi acqua per il porridge alla colazione
        if (carbFood.id === '3') {
          portions.push({
            foodId: '65',
            foodName: 'Acqua',
            grams: 200,
            nutrition: {
              calories: 0,
              protein: 0,
              carbs: 0,
              fat: 0,
              fiber: 0,
              sugar: 0,
              sodium: 0
            },
            isConfirmed: false,
            isModified: false
          });
        }
      }
    }

    // Inserisci la proteina nella posizione definita dagli slot
    // Riusa i valori già calcolati nel blocco proteine iniziale (finalProteinGrams, proteinWholeUnits)
    const proteinPortion: MealPortion = {
      foodId: proteinFood.id,
      foodName: proteinFood.name,
      grams: finalProteinGrams,
      nutrition: {
        calories: Math.round(proteinFood.nutrition.kcal * finalProteinGrams / 100),
        protein: Math.round(proteinFood.nutrition.protein * finalProteinGrams / 100 * 10) / 10,
        carbs: Math.round(proteinFood.nutrition.carbs * finalProteinGrams / 100 * 10) / 10,
        fat: Math.round(proteinFood.nutrition.fats * finalProteinGrams / 100 * 10) / 10,
        fiber: Math.round(proteinFood.nutrition.fiber * finalProteinGrams / 100 * 10) / 10,
        sugar: 0,
        sodium: proteinFood.nutrition.micronutrients?.sodium ? Math.round(proteinFood.nutrition.micronutrients.sodium * finalProteinGrams / 100) : 0
      },
      isConfirmed: false,
      isModified: false,
      // Mostra unità per proteine (uova, vasetti)
      unit: proteinWholeUnits.units > 0 ? getUnitType(proteinFood.id) : undefined,
      unitValue: proteinWholeUnits.units > 0 ? proteinWholeUnits.units : undefined
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
      const reintroWhole = snapToWholeUnits(reintroFood.id, 50);
      portions.push({
        foodId: reintroFood.id,
        foodName: reintroFood.name,
        grams: reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50,
        nutrition: {
          calories: Math.round(reintroFood.nutrition.kcal * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100),
          protein: Math.round(reintroFood.nutrition.protein * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100 * 10) / 10,
          carbs: Math.round(reintroFood.nutrition.carbs * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100 * 10) / 10,
          fat: Math.round(reintroFood.nutrition.fats * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100 * 10) / 10,
          fiber: Math.round(reintroFood.nutrition.fiber * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100 * 10) / 10,
          sugar: 0,
          sodium: reintroFood.nutrition.micronutrients?.sodium ? Math.round(reintroFood.nutrition.micronutrients.sodium * (reintroWhole.units > 0 ? reintroWhole.units * getUnitGrams(reintroFood.id) : 50) / 100) : 0
        },
        isConfirmed: false,
        isModified: false,
        reintroduced: true,
        // Mostra unità per reintroduzioni
        unit: reintroWhole.units > 0 ? getUnitType(reintroFood.id) : undefined,
        unitValue: reintroWhole.units > 0 ? reintroWhole.units : undefined
      });
    }

    // Ordina le porzioni secondo la struttura del pasto italiano:
    // 1. Primo (carboidrati: riso, pasta, cereali)
    // 2. Secondo (proteine: carne, pesce, uova, legumi)
    // 3. Contorno (verdure)
    // 4. Panificati (pane, prodotti da forno)
    // 5. Frutta secca (noci, mandorle, semi)
    // 6. Dessert (frutta, yogurt, dolci)
    const orderedPortions = sortPortionsByItalianMealStructure(portions);

    const totals = orderedPortions.reduce((acc, p) => add(acc, scale(
      { kcal: p.nutrition.calories, protein: p.nutrition.protein, carbs: p.nutrition.carbs, fats: p.nutrition.fat, fiber: p.nutrition.fiber },
      100
    )), emptyNutrition());

    return {
      name: getMealName(mealKey).charAt(0).toUpperCase() + getMealName(mealKey).slice(1),
      key: mealKey,
      portions: orderedPortions,
      totalNutrition: {
        calories: totals.kcal,
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fats,
        fiber: totals.fiber,
        sugar: 0,
        sodium: orderedPortions.reduce((sum, p) => sum + p.nutrition.sodium, 0)
      },
      isConfirmed: false
    };
  });

  // Calcola omega-3 recommendations per il giorno
  const omega3UsedFoodIds = new Set<string>();
  meals.forEach(meal => {
    meal.portions.forEach(p => omega3UsedFoodIds.add(p.foodId));
  });
  const omega3Recommend = getOmega3Recommendations(omega3UsedFoodIds, mealCount);

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
  // Use results.proteins (the actual target) instead of hardcoded 100
  const proteinScale = results.proteins / totals.protein;
  const normalizedProtein = Math.round(totals.protein * proteinScale * 10) / 10;

  // Calculate remaining calories after protein (4 kcal per gram of protein)
  const proteinCalories = normalizedProtein * 4;
  const remainingCalories = Math.max(results.targetCaloriesKcal - proteinCalories, 0);

  // Scale carbs and fats proportionally to match remaining calories
  // Carbs: 4 kcal/g, Fats: 9 kcal/g
  const totalMacroCalories = totals.carbs * 4 + totals.fats * 9;
  const macroScale = totalMacroCalories > 0 ? remainingCalories / totalMacroCalories : 1;

  const normalizedCarbs = Math.round(totals.carbs * macroScale * 10) / 10;
  const normalizedFats = Math.round(totals.fats * macroScale * 10) / 10;
  const normalizedFiber = Math.round(totals.fiber * macroScale * 10) / 10;
  const normalizedKcal = Math.round((normalizedProtein * 4 + normalizedCarbs * 4 + normalizedFats * 9) * 10) / 10;

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
    omega3Recommendations: omega3Recommend.length > 0 ? omega3Recommend : undefined,
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