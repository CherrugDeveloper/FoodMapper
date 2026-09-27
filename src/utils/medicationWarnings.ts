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

/**
 * Nomi commerciali associati a ciascun principio attivo.
 * Utilizzati per mostrare all'utente quali farmaci commerciali sono stati riconosciuti.
 */
export const MEDICATION_BRANDS: Record<Exclude<MedicationKey, 'other'>, string[]> = {
  metformin: ['Glucophage'],
  levothyroxine: ['Eutirox', 'Tirosint'],
  antibiotics: ['Augmentin', 'Zitromax', 'Ciproxin'],
  anticoagulants: ['Coumadin', 'Eliquis', 'Xarelto', 'Clexane'],
  diuretics: ['Lasix', 'Esidrex', 'Aldactone'],
  proton_pump_inhibitors: ['Losec', 'Nexium', 'Pantorc', 'Zoton'],
  nsaids: ['Brufen', 'Aulin', 'Aspirina', 'Voltaren']
};

export interface DetectedMedication {
  key: MedicationKey;
  matchedBrands: string[];
}

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
 * @deprecated Usare detectMedicationsWithBrands per ottenere anche i nomi commerciali.
 */
export function detectMedications(text: string): MedicationKey[] {
  return detectMedicationsWithBrands(text).map(d => d.key);
}

/**
 * Rileva i farmaci nel testo libero restituendo principio attivo e nomi commerciali associati.
 */
export function detectMedicationsWithBrands(text: string): DetectedMedication[] {
  const normalized = text.toLowerCase();
  const detected = new Map<MedicationKey, Set<string>>();

  for (const [key, keywords] of Object.entries(MEDICATION_KEYWORDS) as [MedicationKey, string[]][]) {
    if (key === 'other') continue;

    const brands = MEDICATION_BRANDS[key as Exclude<MedicationKey, 'other'>];
    const matchedBrands = new Set<string>();

    keywords.forEach((keyword, index) => {
      if (normalized.includes(keyword.toLowerCase())) {
        const brand = brands[index];
        if (brand) {
          matchedBrands.add(brand);
        }
      }
    });

    if (matchedBrands.size > 0) {
      const existing = detected.get(key);
      if (existing) {
        matchedBrands.forEach(b => existing.add(b));
      } else {
        detected.set(key, matchedBrands);
      }
    }
  }

  // Se il testo contiene testo non vuoto e non è stato rilevato nulla, categoria generica
  if (normalized.trim().length > 0 && detected.size === 0) {
    detected.set('other', new Set<string>());
  }

  return MEDICATION_ORDER
    .filter(key => detected.has(key))
    .map(key => ({
      key,
      matchedBrands: Array.from(detected.get(key) ?? [])
    }));
}

/**
 * Formatta un farmaco rilevato mostrando principio attivo e nomi commerciali associati.
 */
export function formatDetectedMedication(
  med: DetectedMedication,
  t: (key: string) => string | undefined
): string {
  const active = t(`medications.${med.key}`) || med.key;
  if (med.matchedBrands.length === 0) {
    return active;
  }
  return `${active} (${med.matchedBrands.join(', ')})`;
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
