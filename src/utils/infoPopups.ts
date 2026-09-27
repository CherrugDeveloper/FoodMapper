import type { TFunction } from 'i18next';

export type InfoTextKey = string;

const INFO_KEYS = [
  // NutritionalCalculator - main fields
  'calc_weight',
  'calc_height',
  'calc_age',
  'calc_sex',
  'calc_activity',
  'calc_ibs',

  // Conditions
  'condition_diabetes_type1',
  'condition_diabetes_type2',
  'condition_hypertension',
  'condition_hypothyroidism',
  'condition_hyperthyroidism',
  'condition_celiac',
  'condition_pregnancy',
  'condition_menopause',
  'condition_pcos',

  // Allergens
  'allergen_gluten',
  'allergen_crustaceans',
  'allergen_eggs',
  'allergen_fish',
  'allergen_peanuts',
  'allergen_soy',
  'allergen_milk',
  'allergen_milk_fodmap',
  'allergen_tree_nuts',
  'allergen_celery',
  'allergen_mustard',
  'allergen_sesame',
  'allergen_lupins',
  'allergen_sulphites',

  // Diet goal / medications / bio hacking
  'diet_goal',
  'medications',
  'bio_hacking',

  // FoodFilter
  'filter_category',
  'filter_month',
  'fodmap_Fruttani',
  'fodmap_Lattosio',
  'fodmap_Fruttosio',
  'fodmap_Galattani',
  'fodmap_Polioli',
  'fodmap_high',
  'fodmap_low',

  // WorkoutPlan
  'workout_equipment_filter',
  'workout_generate_suggested',
  'workout_exercise_selector',

  // Recipes
  'recipe_servings',
  'recipe_ingredients',

  // ShoppingList
  'shopping_category',
  'shopping_quantity',

  // DietPlan
  'diet_phase',
  'diet_reintroduced',

  // Diary
  'diary_symptoms',
  'diary_transit',
] as const;

export type KnownInfoKey = typeof INFO_KEYS[number];

export function isKnownInfoKey(key: string): key is KnownInfoKey {
  return INFO_KEYS.includes(key as KnownInfoKey);
}

export function getInfoText(
  t: TFunction,
  key: InfoTextKey,
  locale: string
): string {
  const translationKey = `info.${key}`;
  const value = t(translationKey, { defaultValue: '', lng: locale }) as string;
  return value || '';
}

export function getAllInfoKeys(): readonly KnownInfoKey[] {
  return INFO_KEYS;
}
