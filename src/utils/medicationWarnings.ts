import type { AllergenKey } from './nutritionEngine';

export type MedicationKey =
  | 'metformin'
  | 'levothyroxine'
  | 'antibiotics'
  | 'anticoagulants'
  | 'diuretics'
  | 'proton_pump_inhibitors'
  | 'nsaids'
  | 'other';

export interface MedicationWarning {
  key: MedicationKey;
  label: string;
  warning: string;
}

export const MEDICATION_KEYWORDS: Record<MedicationKey, string[]> = {
  metformin: ['metformina', 'metformin', 'glucophage'],
  levothyroxine: ['levotiroxina', 'levothyroxine', 'eutirox', 'tirosint'],
  antibiotics: ['antibiotico', 'antibiotics', 'amoxicillina', 'azitromicina', 'ciprofloxacina'],
  anticoagulants: ['warfarin', 'coumadin', 'eparina', 'heparin', 'apixaban', 'rivaroxaban'],
  diuretics: ['diuretico', 'diuretics', 'furosemide', 'idroclorotiazide', 'spironolattone'],
  proton_pump_inhibitors: ['ppi', 'omeprazolo', 'esomeprazolo', 'pantoprazolo', 'lansoprazolo'],
  nsaids: ['nsaid', 'ibuprofene', 'naprossene', 'aspirina', 'aspirin', 'diclofenac'],
  other: []
};

export const MEDICATION_ORDER: MedicationKey[] = [
  'metformin',
  'levothyroxine',
  'antibiotics',
  'anticoagulants',
  'diuretics',
  'proton_pump_inhibitors',
  'nsaids',
  'other'
];

/**
 * Restituisce le chiavi dei farmaci rilevati nel testo libero inserito dall'utente.
 */
export function detectMedications(text: string): MedicationKey[] {
  const normalized = text.toLowerCase();
  const detected = new Set<MedicationKey>();

  for (const [key, keywords] of Object.entries(MEDICATION_KEYWORDS) as [MedicationKey, string[]][]) {
    if (key === 'other') continue;
    if (keywords.some(k => normalized.includes(k))) {
      detected.add(key);
    }
  }

  // Se il testo contiene testo non vuoto e non è stato rilevato nulla, categoria generica
  if (normalized.trim().length > 0 && detected.size === 0) {
    detected.add('other');
  }

  return Array.from(detected);
}

/**
 * Traduce le chiavi allergene nella forma localizzata tramite i18n.
 * Utilizzato da componenti React con t('allergens.{key}').
 */
export function allergenKeys(): AllergenKey[] {
  return [
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
}
