import type { Micro } from './foodsData';

export type HealthCondition =
  | 'celiac'
  | 'diabetes'
  | 'hypertension'
  | 'lactose_intolerance'
  | 'pregnancy'
  | 'hypothyroidism'
  | 'hyperthyroidism'
  | 'menopause'
  | 'pcos';

export type DietGoal = 'maintenance' | 'deficit' | 'surplus';

export interface UserData {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  biologicalSex: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  ibsType: 'IBS-D' | 'IBS-C' | 'IBS-M' | 'unknown';
  conditions: HealthCondition[];
  dietGoal?: DietGoal;
}

export interface NutritionalResults {
  proteins: number;
  fats: number;
  carbs: number;
  fiber: number;
  waterLiters: number;
  estimatedTotalEnergyKcal: number;
  /** Calorie target after diet-goal adjustment (may differ from estimated TDEE) */
  targetCaloriesKcal: number;
  recommendations: string; // chiave i18n (ibs_rec_*), non testo localizzato
  conditionNotes: HealthCondition[];
  // Fabbisogni giornalieri per microelementi (valori medi adulti)
  micronutrients: Record<Micro, number>;
}

const GOAL_ADJUSTMENTS: Record<DietGoal, number> = {
  maintenance: 0,
  deficit: -500,
  surplus: +500
};

export function calculateNutritionalNeeds(data: UserData): NutritionalResults {
  const { weightKg, heightCm, ageYears, biologicalSex, activityLevel, ibsType } = data;
  const conditions = data.conditions ?? [];
  const dietGoal: DietGoal = data.dietGoal ?? 'maintenance';

  // Calcolo del Metabolismo Basale (Mifflin-St Jeor)
  const bmr = biologicalSex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;

  const palMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };

  const activityMultiplier = palMultipliers[activityLevel] || 1.2;
  let estimatedTdee = bmr * activityMultiplier;

  // Target proteico ottimizzato (linee guida ISSN)
  let proteinPerKg: number;
  if (conditions.includes('pregnancy')) {
    proteinPerKg = 1.8; // Increased from 1.6 to 1.8 g/kg
  } else if (activityLevel === 'very_active') {
    proteinPerKg = 2.0;
  } else {
    proteinPerKg = 1.6;
  }
  const targetProteinsGrams = Math.round(weightKg * proteinPerKg);

  // Target grassi essenziali
  const fatPerKg = 0.9;
  const targetFatsGrams = Math.round(weightKg * fatPerKg);

  // Calcolo idratazione (35ml per kg)
  const targetWaterLiters = Number(((weightKg * 35) / 1000).toFixed(2));

  // Chiave i18n della raccomandazione per sottotipo IBS
  const ibsRecommendationKey = `ibs_rec_${ibsType === 'unknown' ? 'unknown' : ibsType.slice(-1).toLowerCase()}`;

  // Fabbisogni giornalieri per microelementi (valori RDA medi per adulti)
  // Adattamenti basati su sesso, età e condizioni
  const isFemale = biologicalSex === 'female';
  const isAdult = ageYears >= 19;

  // Condizioni specifiche
  const isPregnant = conditions.includes('pregnancy');
  const isHypothyroid = conditions.includes('hypothyroidism');
  const isHyperthyroid = conditions.includes('hyperthyroidism');
  const isMenopause = conditions.includes('menopause');

  // Adattamenti calorici per condizioni mediche (applicati al TDEE stimato)
  if (isPregnant) {
    estimatedTdee += 300;
  }

  if (isHypothyroid) {
    estimatedTdee *= 0.93; // Riduce il TDEE del ~7%
  }

  if (isHyperthyroid) {
    estimatedTdee *= 1.07; // Aumenta il TDEE del ~7%
  }

  if (isMenopause) {
    estimatedTdee *= 0.95; // Riduce leggermente il TDEE (~5%)
  }

  // Minimum calorie limits for safety
  const minCalories = biologicalSex === 'female' ? 1200 : 1500;
  if (estimatedTdee < minCalories) {
    estimatedTdee = minCalories;
  }

  // Applica obiettivo dietetico scelto (deficit/isocalorico/surplus)
  let targetCalories = estimatedTdee + GOAL_ADJUSTMENTS[dietGoal];
  if (targetCalories < minCalories) {
    targetCalories = minCalories;
  }

  // Carboidrati per differenza energetica sul target calorico finale
  const proteinCalories = targetProteinsGrams * 4;
  const fatCalories = targetFatsGrams * 9;
  const remainingCalories = targetCalories - (proteinCalories + fatCalories);
  const targetCarbsGrams = Math.round(remainingCalories > 0 ? remainingCalories / 4 : 100);

  // Recalculate fiber con le calorie stimate (TDEE, non obiettivo dietetico)
  let targetFiberGrams = Math.round((estimatedTdee / 1000) * 14);
  if (targetFiberGrams < 25) targetFiberGrams = 25;
  // Nel diabete il target fibra va verso il limite alto: migliora il controllo glicemico
  if (conditions.includes('diabetes') && targetFiberGrams < 30) targetFiberGrams = 30;
  // PCOS: stesso approccio del diabete per controllo insulina
  if (conditions.includes('pcos') && targetFiberGrams < 30) targetFiberGrams = 30;
  if (targetFiberGrams > 35) targetFiberGrams = 35;

  // Fabbisogni giornalieri per microelementi (valori RDA medi per adulti)
  // Adattamenti basati su sesso, età e condizioni
  const micronutrients: Record<Micro, number> = {
    potassium: 3500,  // mg (AI Adequate Intake)
    magnesium: isAdult ? (isFemale ? 310 : 400) : (isFemale ? 240 : 410), // mg
    calcium: isAdult ? (isFemale ? 1000 : 1000) : (isFemale ? 1300 : 1300), // mg
    iron: isAdult ? (isFemale ? 18 : 8) : (isFemale ? 15 : 11), // mg
    zinc: isAdult ? (isFemale ? 8 : 11) : (isFemale ? 9 : 11), // mg
    folate: 400,  // µg DFE
    vitamin_a: isAdult ? (isFemale ? 700 : 900) : (isFemale ? 700 : 900), // µg RAE
    vitamin_c: isAdult ? 90 : 75, // mg
    vitamin_d: 15, // µg (AI)
    vitamin_e: 15, // mg
    b12: 2.4, // µg
    omega3: 1000, // mg EPA+DHA (raccomandazione minima)
    selenium: 55, // µg
    iodine: 150, // µg
    sodium: 2300, // mg (UL / limite prudenziale)
    vitamin_k: isAdult ? (isFemale ? 90 : 120) : 60, // µg
    vitamin_b6: isAdult ? 1.3 : 1.0, // mg
    manganese: isAdult ? (isFemale ? 1.8 : 2.3) : 1.6, // mg
    copper: 0.9, // mg
    phosphorus: 700 // mg
  };

  // Adjust micronutrients for pregnancy
  if (isPregnant) {
    micronutrients.folate = 600; // Increased folate for pregnancy
    micronutrients.iron = 27;    // Increased iron for pregnancy
    micronutrients.calcium = 1300; // Increased calcium for pregnancy
    micronutrients.iodine = 220;   // Increased iodine for pregnancy
  }

  // Adjust micronutrients for thyroid conditions
  if (isHypothyroid || isHyperthyroid) {
    // Hypothyroidism often benefits from increased selenium and zinc
    // But we need to be careful with iodine (too much can be harmful)
    micronutrients.iodine = 150; // Keep standard, but note food recommendations should avoid excess
    micronutrients.selenium = 70; // Slightly increased selenium
    micronutrients.zinc = isAdult ? (isFemale ? 10 : 13) : (isFemale ? 10 : 13); // Slightly increased zinc
  }

  // Menopausa: incremento calcio/vitamina D per salute ossea
  if (isMenopause) {
    micronutrients.calcium = 1200;
    micronutrients.vitamin_d = 20;
  }

  return {
    proteins: targetProteinsGrams,
    fats: targetFatsGrams,
    carbs: targetCarbsGrams,
    fiber: targetFiberGrams,
    waterLiters: targetWaterLiters,
    estimatedTotalEnergyKcal: Math.round(estimatedTdee),
    targetCaloriesKcal: Math.round(targetCalories),
    recommendations: ibsRecommendationKey,
    conditionNotes: conditions,
    micronutrients
  };
}
