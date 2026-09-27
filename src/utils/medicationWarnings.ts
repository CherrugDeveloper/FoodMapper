import type { AllergenKey } from './nutritionEngine';

export interface StructuredMedication {
  key: MedicationKey;
  brand: string;
  dose: number;
  unit: 'mg' | 'mcg' | 'UI';
  frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed';
  time: string; // HH:MM format
}

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
  levothyroxine: ['levotiroxina', 'eutirox', 'tirosint', 'levothyroxine', 'synthroid', 'levoxyl', 'unithroid'],
  antibiotics: ['antibiotico', 'antibiotics', 'amoxicillina', 'azitromicina', 'ciprofloxacina'],
  anticoagulants: ['warfarin', 'coumadin', 'apixaban', 'eliquis', 'rivaroxaban', 'eparina', 'heparin'],
  diuretics: ['diuretico', 'diuretics', 'furosemide', 'idroclorotiazide', 'spironolattone'],
  proton_pump_inhibitors: ['ppi', 'omeprazolo', 'esomeprazolo', 'pantoprazolo', 'lansoprazolo'],
  nsaids: ['nsaid', 'ibuprofene', 'naprossene', 'aspirina', 'aspirin', 'diclofenac'],
  other: []
};

/**
 * Mappa diretta keyword → brand per evitare array paralleli fragili.
 * Ogni keyword mappa al suo nome commerciale corrispondente.
 */
export const MEDICATION_KEYWORD_TO_BRAND = new Map<string, string>([
  // Metformin
  ['metformina', 'Glucophage'],
  ['metformin', 'Glucophage'],
  ['glucophage', 'Glucophage'],
  // Levothyroxine
  ['levotiroxina', 'Levotiroxina sodica'],
  ['eutirox', 'Eutirox'],
  ['tirosint', 'Tirosint'],
  ['levothyroxine', 'Levothyroxine'],
  ['synthroid', 'Synthroid'],
  ['levoxyl', 'Levoxyl'],
  ['unithroid', 'Unithroid'],
  // Antibiotics
  ['antibiotico', 'Augmentin'],
  ['antibiotics', 'Augmentin'],
  ['amoxicillina', 'Augmentin'],
  ['azitromicina', 'Zitromax'],
  ['ciprofloxacina', 'Ciproxin'],
  // Anticoagulants
  ['warfarin', 'Coumadin'],
  ['coumadin', 'Coumadin'],
  ['apixaban', 'Eliquis'],
  ['eliquis', 'Eliquis'],
  ['rivaroxaban', 'Xarelto'],
  ['eparina', 'Clexane'],
  ['heparin', 'Clexane'],
  // Diuretics
  ['diuretico', 'Lasix'],
  ['diuretics', 'Lasix'],
  ['furosemide', 'Lasix'],
  ['idroclorotiazide', 'Esidrex'],
  ['spironolattone', 'Aldactone'],
  // Proton Pump Inhibitors
  ['ppi', 'Losec'],
  ['omeprazolo', 'Losec'],
  ['esomeprazolo', 'Nexium'],
  ['pantoprazolo', 'Pantorc'],
  ['lansoprazolo', 'Zoton'],
  // NSAIDs
  ['nsaid', 'Brufen'],
  ['ibuprofene', 'Brufen'],
  ['naprossene', 'Aulin'],
  ['aspirina', 'Aspirina'],
  ['aspirin', 'Aspirina'],
  ['diclofenac', 'Voltaren']
]);

/**
 * @deprecated Usare MEDICATION_KEYWORD_TO_BRAND per nuovo codice.
 * Mantenuto per backward compatibility.
 */
export const MEDICATION_BRANDS: Record<Exclude<MedicationKey, 'other'>, string[]> = {
  metformin: ['Glucophage', 'Glucophage', 'Glucophage'],
  levothyroxine: ['Levotiroxina sodica', 'Eutirox', 'Tirosint', 'Levothyroxine', 'Synthroid', 'Levoxyl', 'Unithroid'],
  antibiotics: ['Augmentin', 'Zitromax', 'Ciproxin', 'Ciproxin', 'Ciproxin'],
  anticoagulants: ['Coumadin', 'Coumadin', 'Eliquis', 'Eliquis', 'Xarelto', 'Clexane', 'Clexane'],
  diuretics: ['Lasix', 'Lasix', 'Lasix', 'Esidrex', 'Aldactone'],
  proton_pump_inhibitors: ['Losec', 'Nexium', 'Pantorc', 'Zoton', 'Zoton'],
  nsaids: ['Brufen', 'Aulin', 'Aspirina', 'Aspirina', 'Voltaren', 'Voltaren']
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

    const matchedBrands = new Set<string>();

    keywords.forEach((keyword) => {
      if (normalized.includes(keyword.toLowerCase())) {
        const brand = MEDICATION_KEYWORD_TO_BRAND.get(keyword.toLowerCase());
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
    'mustard',
    'sesame',
    'lupins',
    'sulphites'
  ];
}
