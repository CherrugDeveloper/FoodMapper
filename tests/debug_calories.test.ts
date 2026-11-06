import { generateDayPlan } from '../src/utils/mealGenerator';
import type { NutritionalResults, UserData } from '../src/utils/nutritionEngine';

const mockResults: NutritionalResults = {
  proteins: 100,
  fats: 70,
  carbs: 250,
  fiber: 30,
  waterLiters: 2.5,
  estimatedTotalEnergyKcal: 2000,
  targetCaloriesKcal: 2000,
  recommendations: 'ibs_rec_d',
  conditionNotes: [],
  micronutrients: {
    potassium: 3500,
    magnesium: 400,
    calcium: 1000,
    iron: 18,
    zinc: 11,
    folate: 400,
    vitamin_a: 900,
    vitamin_c: 90,
    vitamin_d: 20,
    vitamin_e: 15,
    b12: 2.4,
    omega3: 1.6,
    selenium: 55,
    iodine: 150,
    sodium: 2300,
    vitamin_k: 120,
    vitamin_b6: 1.7,
    manganese: 2.3,
    copper: 0.9,
    phosphorus: 1000
  }
};

const mockUserData: UserData = {
  weightKg: 70,
  heightCm: 175,
  ageYears: 30,
  biologicalSex: 'male',
  activityLevel: 'moderately_active',
  ibsType: 'IBS-D',
  conditions: [],
  allergens: [],
  medications: []
};

const dayPlan = generateDayPlan(mockResults, mockUserData, 'phase0', 0, 0);

console.log('=== Daily Totals ===');
console.log('Calories:', dayPlan.dailyTotals.calories);
console.log('Protein:', dayPlan.dailyTotals.protein);
console.log('Carbs:', dayPlan.dailyTotals.carbs);
console.log('Fat:', dayPlan.dailyTotals.fat);
console.log('');

console.log('=== Meals Breakdown ===');
let totalCalories = 0;
for (const meal of dayPlan.meals) {
  console.log(`\n${meal.name} (${meal.key}):`);
  console.log(`  Total: ${meal.totalNutrition.calories} kcal`);
  console.log(`    Protein: ${meal.totalNutrition.protein}g, Carbs: ${meal.totalNutrition.carbs}g, Fat: ${meal.totalNutrition.fat}g`);
  for (const p of meal.portions) {
    console.log(`  - ${p.foodName}: ${p.grams}g = ${p.nutrition.calories} kcal (${p.nutrition.protein}p/${p.nutrition.carbs}c/${p.nutrition.fat}f)`);
  }
  totalCalories += meal.totalNutrition.calories;
}
console.log('\n=== Sum of meal calories:', totalCalories, '===');