import type { Micro } from './foodsData';

export type HealthCondition = 'celiac' | 'diabetes' | 'hypertension' | 'lactose_intolerance';

export interface UserData {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  biologicalSex: 'male' | 'female';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  ibsType: 'IBS-D' | 'IBS-C' | 'IBS-M' | 'unknown';
  conditions: HealthCondition[];
}

export interface NutritionalResults {
  proteins: number;
  fats: number;
  carbs: number;
  fiber: number;
  waterLiters: number;
  estimatedTotalEnergyKcal: number;
  recommendations: string; // chiave i18n (ibs_rec_*), non testo localizzato
  conditionNotes: HealthCondition[];
  // Fabbisogni giornalieri per microelementi (valori medi adulti)
  micronutrients: Record<Micro, number>;
}

export function calculateNutritionalNeeds(data: UserData): NutritionalResults {
  const { weightKg, heightCm, ageYears, biologicalSex, activityLevel, ibsType } = data;
  const conditions = data.conditions ?? [];

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
  const estimatedTdee = bmr * activityMultiplier;

  // Target proteico ottimizzato (linee guida ISSN)
  let proteinPerKg = 1.6;
  if (activityLevel === 'very_active') proteinPerKg = 2.0;
  const targetProteinsGrams = Math.round(weightKg * proteinPerKg);

  // Target grassi essenziali
  const fatPerKg = 0.9;
  const targetFatsGrams = Math.round(weightKg * fatPerKg);

  // Carboidrati per differenza energetica
  const proteinCalories = targetProteinsGrams * 4;
  const fatCalories = targetFatsGrams * 9;
  const remainingCalories = estimatedTdee - (proteinCalories + fatCalories);
  const targetCarbsGrams = Math.round(remainingCalories > 0 ? remainingCalories / 4 : 100);

  // Calcolo delle Fibre (Linee guida WGO: ~14g ogni 1000 kcal)
  let targetFiberGrams = Math.round((estimatedTdee / 1000) * 14);
  if (targetFiberGrams < 25) targetFiberGrams = 25;
  // Nel diabete il target fibra va verso il limite alto: migliora il controllo glicemico
  if (conditions.includes('diabetes') && targetFiberGrams < 30) targetFiberGrams = 30;
  if (targetFiberGrams > 35) targetFiberGrams = 35;

  // Calcolo idratazione (35ml per kg)
  const targetWaterLiters = Number(((weightKg * 35) / 1000).toFixed(2));

  // Chiave i18n della raccomandazione per sottotipo IBS
  const ibsRecommendationKey = `ibs_rec_${ibsType === 'unknown' ? 'unknown' : ibsType.slice(-1).toLowerCase()}`;

  // Fabbisogni giornalieri per microelementi (valori RDA medi per adulti)
  // Adattamenti basati su sesso, età e condizioni
  const isFemale = biologicalSex === 'female';
  const isAdult = ageYears >= 19;

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
    iodine: 150 // µg
  };

  return {
    proteins: targetProteinsGrams,
    fats: targetFatsGrams,
    carbs: targetCarbsGrams,
    fiber: targetFiberGrams,
    waterLiters: targetWaterLiters,
    estimatedTotalEnergyKcal: Math.round(estimatedTdee),
    recommendations: ibsRecommendationKey,
    conditionNotes: conditions,
    micronutrients
  };
}
