import type { MealPortion, GeneratedMeal, DayPlan, DietPhase } from '../types/dietPlan';
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
  cucchiaini: 'cucchiaini',
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
  g: 0,
  uova: 50,
  vasetti: 0,
  quadrati: 0,
  cucchiai: 0,
  cucchiaini: 0,
  fette: 0,
  pz: 0,
  noci: 5,
  patate: 180,
  banane: 120,
  lamponi: 20,
  tofu: 125,
  tempeh: 100, // panetto medio
};

// Pesi specifici per alimenti con unità particolari
const FOOD_SPECIFIC_WEIGHTS = {
  mandorle: 5,      // 5g per mandorla
  zucchine: 150,    // 150g per zucchina media
  polenta: 100,     // 100g porzione standard
  pane: 40,         // 40g fetta media
  pasta: 75,        // 75g peso crudo
};

/** Formattazione porzione per copia (es: "3 uova", "7 pz") */
export const formatAmount = (p: { grams: number; unit?: FoodUnit; unitValue?: number }): string => {
  if (p.unitValue !== undefined && p.unit) {
    const label = unitLabels[p.unit] || p.unit;
    const isWholeUnit = WHOLE_UNITS.includes(p.unit);
    const value = isWholeUnit ? Math.round(p.unitValue) : formatNum(p.unitValue);
    const weight = WHOLE_UNIT_WEIGHTS[p.unit];
    if (isWholeUnit && weight) {
      return `${value} ${label} (da ~${weight}g)`;
    }
    return `${value} ${label}`;
  }
  return `${formatNum(Math.round(p.grams))}g`;
};

/** Pulisce il nome dell'alimento per una visualizzazione più pulita */
export const cleanFoodName = (name: string): string => {
  let cleaned = name
    .replace(/ certificati$/i, '')
    .replace(/Gluten-Free/gi, 'senza glutine');

  // Rimuovi parentesi con informazioni compound tipo "(mix, max ~30g)"
  cleaned = cleaned.replace(/\s*\(mix[^)]*\)/gi, '');
  cleaned = cleaned.replace(/\s*\(max\s*~?\d+g\)/gi, '');
  cleaned = cleaned.replace(/\s*\(mix[^)]*\)/gi, '');

  // Trasforma "banana (soda, non matura)" in "banana verde"
  if (/\(soda,?\s*non\s*matura\)/i.test(cleaned)) {
    cleaned = cleaned.replace(/\([^)]*\)/g, '').trim() + ' verde';
  }

  // Rimuovi parentesi doppie tipo "Olio di Sesamo (olio di sesamo)"
  cleaned = cleaned.replace(/\(([^)]+)\)/gi, (match, p1) => {
    const withoutParens = cleaned.replace(/\s*\([^)]*\)/g, '').trim();
    const normalizedP1 = p1.toLowerCase().replace(/\s+/g, '');
    const normalizedWithoutParens = withoutParens.toLowerCase().replace(/\s+/g, '');
    // Se il contenuto della parentesi è lo stesso del nome esterno (o viceversa)
    if (normalizedP1 === normalizedWithoutParens ||
        normalizedP1 === normalizedWithoutParens.replace('di', '').replace('e', '')) {
      return ''; // Rimuovi la parentesi se ripete il nome
    }
    return match;
  });

  // Rimuovi suffix (mix, max ~Xg) da Semi di Zucca e simili
  cleaned = cleaned.replace(/\s*\(mix[^)]*\)/gi, '');

  return cleaned.trim();
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

  // Tofu: 125g per panetto
  if (foodName.includes('tofu')) {
    const count = Math.round(portion.grams / 125);
    return count === 1 ? '1 panetto' : `${count} panetti`;
  }

  // Tempeh: 100g per panetto
  if (foodName.includes('tempeh')) {
    const count = Math.round(portion.grams / 100);
    return count === 1 ? '1 panetto' : `${count} panetti`;
  }

  // Walnuts (noci): 5g each
  if (foodName.includes('noci') || foodName.includes('walnut')) {
    const count = Math.round(portion.grams / 5);
    return count === 1 ? '1 noce' : `${count} noci`;
  }

  // Hazelnuts (nocciole): 5g each
  if (foodName.includes('nocciola') || foodName.includes('hazelnut')) {
    const count = Math.round(portion.grams / 5);
    return count === 1 ? '1 nocciola' : `${count} nocciole`;
  }

  // Mandorle: 5g each
  if (foodName.includes('mandorl')) {
    const count = Math.round(portion.grams / FOOD_SPECIFIC_WEIGHTS.mandorle);
    return count === 1 ? '1 mandorla' : `${count} mandorle`;
  }

  // Zucchine: 150g each
  if (foodName.includes('zucchin')) {
    const count = Math.round(portion.grams / FOOD_SPECIFIC_WEIGHTS.zucchine);
    return count === 1 ? '1 zucchina' : `${count} zucchine`;
  }

  // Mais/Polenta: 100g porzione standard
  if (foodName.includes('mais') || foodName.includes('polenta')) {
    const count = Math.round(portion.grams / FOOD_SPECIFIC_WEIGHTS.polenta);
    return count === 1 ? '1 polenta di mais' : `${count} polenti di mais`;
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

/** Mapping fasi dieta in italiano */
const PHASE_LABELS_IT: Record<DietPhase, string> = {
  phase0: 'Fase 0 - Preparazione',
  'phase0-pre-start': 'Nessuna fase in atto',
  phase1: 'Fase 1 - Eliminazione',
  phase2: 'Fase 2 - Reintroduzione',
  phase3: 'Fase 3 - Personalizzazione',
};

/** Formattazione tutti i pasti di una giornata per copia */
export const formatAllMealsForCopy = (
  currentDay: DayPlan,
  dayNameMap: Record<string, string>,
  options?: { useReadableUnits?: boolean }
): string => {
  const fmtAmount = options?.useReadableUnits ? getUnitDisplay : formatAmount;

  // Ottieni la fase del giorno
  const phaseLabel = PHASE_LABELS_IT[currentDay.phase] || 'Fase 0 - Preparazione';

  let fullText = `📋 PASTI GIORNALIARIO - ${currentDay.date}\n`;
  fullText += `📅 ${phaseLabel}\n\n`;

  currentDay.meals.forEach(meal => {
    const mealDisplayName = dayNameMap[meal.key] || meal.key;
    fullText += `${mealDisplayName}:\n`;

    // Filtra porzioni con quantità zero
    // Escludi porzioni dove la quantità reale è 0 (grams = 0 e unitValue = 0 o undefined)
    meal.portions
      .filter(p => {
        // Se grams è 0, verifica se c'è una quantità valida
        if (p.grams === 0) {
          // unitValue deve essere definito e > 0 per essere valido
          if (p.unitValue === undefined || p.unitValue === 0) return false;
        }
        // Per unità intere con unitValue = 0, escludi esplicitamente
        if (p.unitValue !== undefined && p.unitValue === 0) return false;
        // Filtro aggiuntivo: escludi cucchiai con grammi = 0
        if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
        return true;
      })
      .forEach(p => {
        const cleanName = cleanFoodName(p.foodName);
        const lower = p.foodName.toLowerCase();
        let displayName = cleanName;
        let amountStr = fmtAmount(p);

        // Patata: peso atteso (da ~180g)
        if (lower.includes('patata')) {
          displayName = `${cleanName} (da ~180g)`;
        }
        // Tempeh/Tofu: (da ~100g) alla fine della quantità
        else if (lower.includes('tempeh') || lower.includes('tofu')) {
          const weight = lower.includes('tempeh') ? 100 : 125;
          amountStr = `${amountStr} (da ~${weight}g)`;
        }
        // Peperoni: numero invece di grammi, con peso atteso
        else if (lower.includes('peperone')) {
          const pepperCount = Math.max(1, Math.round(p.grams / 150));
          amountStr = `${pepperCount === 1 ? '1 peperone' : `${pepperCount} peperoni`} (da ~150g)`;
        }
        // Banane: "banana verde" con peso atteso
        else if (lower.includes('banan')) {
          const bananaCount = Math.max(1, Math.round(p.grams / 120));
          amountStr = `${bananaCount === 1 ? '1 banana' : `${bananaCount} banane`} (da ~120g)`;
        }
        // Pasta: aggiungi peso atteso crudo
        else if (lower.includes('pasta')) {
          amountStr = `${amountStr} (da ~75g crudo)`;
        }
        // Olive: separa verdi/nere
        else if (lower.includes('oliva')) {
          const hasVerde = lower.includes('verde');
          const hasNera = lower.includes('nera');
          if (hasVerde && hasNera) {
            displayName = `${cleanName} (verdi e nere)`;
          } else if (hasVerde) {
            displayName = `${cleanName} (verdi)`;
          } else if (hasNera) {
            displayName = `${cleanName} (nere)`;
          }
        }
        // Olio di sesamo / Tahina: separa
        else if (lower.includes('sesamo') || lower.includes('tahina')) {
          if (lower.includes('olio')) {
            displayName = `${cleanName} (olio di sesamo)`;
          } else if (lower.includes('tahina')) {
            displayName = `${cleanName} (tahina)`;
          }
        }

        fullText += `  - ${displayName}: ${amountStr}\n`;
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

/** Formattazione pasto singolo per copia */
export const formatMealForCopy = (
  meal: GeneratedMeal,
  mealDisplayName: string,
  phase?: DietPhase
): string => {
  const phaseLine = phase ? `📅 ${PHASE_LABELS_IT[phase] || PHASE_LABELS_IT['phase0-pre-start']}\n` : '';
  
  const ingredientsList = meal.portions
    .filter(p => {
      // Escludi porzioni con grams = 0 e nessun unitValue valido
      if (p.grams === 0) {
        if (p.unitValue === undefined || p.unitValue === 0) return false;
      }
      // Per unità con unitValue = 0, escludi esplicitamente
      if (p.unitValue !== undefined && p.unitValue === 0) return false;
      // Escludi cucchiai con grammi = 0
      if (p.unit?.includes('cucchiai') && p.grams === 0) return false;
      return true;
    })
    .map(p => {
      const cleanName = cleanFoodName(p.foodName);
      const lower = p.foodName.toLowerCase();
      let displayName = cleanName;
      let amountStr = getUnitDisplay(p);

      // Patata: peso atteso (da ~180g)
      if (lower.includes('patata')) {
        displayName = `${cleanName} (da ~180g)`;
      }
      // Tempeh/Tofu: (da ~100g) alla fine della quantità
      else if (lower.includes('tempeh') || lower.includes('tofu')) {
        const weight = lower.includes('tempeh') ? 100 : 125;
        amountStr = `${amountStr} (da ~${weight}g)`;
      }
      // Peperoni: numero invece di grammi, con peso atteso
      else if (lower.includes('peperone')) {
        const pepperCount = Math.max(1, Math.round(p.grams / 150));
        amountStr = `${pepperCount === 1 ? '1 peperone' : `${pepperCount} peperoni`} (da ~150g)`;
      }
      // Banane: "banana verde" con peso atteso
      else if (lower.includes('banan')) {
        const bananaCount = Math.max(1, Math.round(p.grams / 120));
        amountStr = `${bananaCount === 1 ? '1 banana' : `${bananaCount} banane`} (da ~120g)`;
      }
      // Pasta: aggiungi peso atteso crudo
      else if (lower.includes('pasta')) {
        amountStr = `${amountStr} (da ~75g crudo)`;
      }
      // Olive: separa verdi/nere
      else if (lower.includes('oliva')) {
        const hasVerde = lower.includes('verde');
        const hasNera = lower.includes('nera');
        if (hasVerde && hasNera) {
          displayName = `${cleanName} (verdi e nere)`;
        } else if (hasVerde) {
          displayName = `${cleanName} (verdi)`;
        } else if (hasNera) {
          displayName = `${cleanName} (nere)`;
        }
      }
      // Olio di sesamo / Tahina: separa
      else if (lower.includes('sesamo') || lower.includes('tahina')) {
        if (lower.includes('olio')) {
          displayName = `${cleanName} (olio di sesamo)`;
        } else if (lower.includes('tahina')) {
          displayName = `${cleanName} (tahina)`;
        }
      }

      return `  - ${displayName}: ${amountStr}`;
    }).join('\n');

  const nutritionStr = [
    `${formatNum(meal.totalNutrition.calories)} kcal`,
    `${formatNum(meal.totalNutrition.protein)}g proteine`,
    `${formatNum(meal.totalNutrition.carbs)}g carboidrati`,
    `${formatNum(meal.totalNutrition.fat)}g grassi`,
  ].join(', ');

  return `${phaseLine}${mealDisplayName}\n${ingredientsList}\n  Totale: ${nutritionStr}`;
};