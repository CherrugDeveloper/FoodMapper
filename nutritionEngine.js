/**
 * Motore di calcolo per il fabbisogno nutrizionale strutturale (Evidence-Based)
 * Rifiuta il conteggio calorico ossessivo, si focalizza sui macronutrienti e sui bisogni dell'intestino.
 */

export function calculateNutritionalNeeds({ weightKg, heightCm, ageYears, biologicalSex, activityLevel, ibsType }) {
  // 1. Calcolo del Metabolismo Basale stimato (Equazione di Mifflin-St Jeor)
  // Serve unicamente come base scientifica per calcolare la proporzione delle fibre
  let bmr = 0;
  if (biologicalSex === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }

  // Moltiplicatore di attività (PAL)
  const palMultipliers = {
    sedentary: 1.2,       // Lavoro d'ufficio, poco movimento
    lightly_active: 1.375, // Camminate leggere, 1-3 giorni di attività
    moderately_active: 1.55, // Attività moderata, 3-5 giorni a settimana
    very_active: 1.725     // Attività intensa quotidiana
  };

  const activityMultiplier = palMultipliers[activityLevel] || 1.2;
  const estimatedTdee = bmr * activityMultiplier;

  // 2. Calcolo dei Macronutrienti Strutturali (Indipendenti dalle calorie)
  // Target proteico ottimizzato per la sintesi proteica e la sazietà
  let proteinPerKg = 1.6; // Base scientifica ottimale per la massa magra
  if (activityLevel === 'very_active') proteinPerKg = 2.0;
  
  const targetProteinsGrams = Math.round(weightKg * proteinPerKg);

  // Target grassi essenziali per la salute ormonale ed enzimatica
  const fatPerKg = 0.9; 
  const targetFatsGrams = Math.round(weightKg * fatPerKg);

  // 3. Calcolo dei Carboidrati Residui
  // Nota: I carboidrati vengono calcolati per differenza energetica per coprire il TDEE rimanente,
  // garantendo che l'utente non vada in un deficit calorico estremo non voluto.
  const proteinCalories = targetProteinsGrams * 4;
  const fatCalories = targetFatsGrams * 9;
  const remainingCalories = estimatedTdee - (proteinCalories + fatCalories);
  const targetCarbsGrams = Math.round(remainingCalories > 0 ? remainingCalories / 4 : 100);

  // 4. Calcolo delle Fibre e dell'Acqua (Specifici per l'IBS)
  // Linee guida: ~14g di fibre ogni 1000 kcal stimate
  let targetFiberGrams = Math.round((estimatedTdee / 1000) * 14);
  // Cap di sicurezza per evitare shock intestinali iniziali
  if (targetFiberGrams < 25) targetFiberGrams = 25;
  if (targetFiberGrams > 38) targetFiberGrams = 35; 

  // Calcolo idratazione (35ml per kg)
  const targetWaterLiters = Number(((weightKg * 35) / 1000).toFixed(2));

  // 5. Note Cliniche personalizzate in base al sottotipo di IBS
  let ibsRecommendations = "";
  switch(ibsType) {
    case 'IBS-D': // Diarrea prevalente
      ibsRecommendations = "Focus su fibre prevalentemente solubili (avena, psillio, carote). Evitare picchi di grassi in un solo pasto che accelerano il riflesso gastrocolico.";
      break;
    case 'IBS-C': // Stipsi prevalente
      ibsRecommendations = "Garantire il target idrico rigorosamente. Incrementare gradualmente le fibre (sia solubili che insolubili da fonti low-FODMAP) per aumentare la massa fecale.";
      break;
    case 'IBS-M': // Alternata/Mista
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
    recommendations: ibsRecommendations
  };
}
