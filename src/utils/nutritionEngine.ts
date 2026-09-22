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
  recommendations: string;
  conditionNotes: HealthCondition[];
}

export function calculateNutritionalNeeds(data: UserData): NutritionalResults {
  const { weightKg, heightCm, ageYears, biologicalSex, activityLevel, ibsType } = data;
  const conditions = data.conditions ?? [];

  // Calcolo del Metabolismo Basale (Mifflin-St Jeor)
  let bmr = 0;
  if (biologicalSex === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }

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

  // Note cliniche personalizzate IBS
  let ibsRecommendations = "";
  switch(ibsType) {
    case 'IBS-D':
      ibsRecommendations = "Focus su fibre prevalentemente solubili (avena, psillio, carote). Evitare picchi di grassi in un solo pasto che accelerano il riflesso gastrocolico.";
      break;
    case 'IBS-C':
      ibsRecommendations = "Garantire il target idrico rigorosamente. Incrementare gradualmente le fibre (sia solubili che insolubili da fonti low-FODMAP) per aumentare la massa fecale.";
      break;
    case 'IBS-M':
      ibsRecommendations = "Mantenere un diario dei sintomi regolare. Introdurre i cambiamenti di fibre in modo molto graduale.";
      break;
    default:
      ibsRecommendations = "Seguire la progressione trifasica della dieta Low-FODMAP sotto la guida del software.";
  }

  return {
    proteins: targetProteinsGrams,
    fats: targetFatsGrams,
    carbs: targetCarbsGrams,
    fiber: targetFiberGrams,
    waterLiters: targetWaterLiters,
    estimatedTotalEnergyKcal: Math.round(estimatedTdee),
    recommendations: ibsRecommendations,
    conditionNotes: conditions
  };
}
