export type DietPhase = 'phase0' | 'phase1' | 'phase2' | 'phase3';

export type MealKey = 'colazione' | 'pranzo' | 'spuntino' | 'cena';

export interface MealPortion {
  foodId: string;
  foodName: string;
  grams: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  isConfirmed: boolean;
  isModified: boolean;
  originalGrams?: number;
  originalFoodId?: string;
  reintroduced?: boolean;
  testGroup?: 'Fruttani' | 'Lattosio' | 'Fruttosio' | 'Galattani' | 'Polioli';
}

export interface GeneratedMeal {
  name: string;
  key: MealKey;
  portions: MealPortion[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  isConfirmed: boolean;
  confirmedAt?: string; // ISO date
}

export interface DayPlan {
  dayIndex: number; // 0-based from diet start
  phase: DietPhase;
  phaseDay: number; // 0-based within phase
  date: string; // ISO date (YYYY-MM-DD)
  meals: GeneratedMeal[];
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface DietPlanState {
  startDate: string; // ISO date
  currentDayIndex: number;
  days: DayPlan[];
  userPreferences: {
    excludedFoods: string[];
    preferredFoods: string[];
    portionMultiplier: number; // 0.8 - 1.2
  };
}

export interface Recipe {
  id: string;
  name: string;
  mealType: MealKey;
  portions: MealPortion[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[]; // 'vegetarian', 'gluten-free', 'batch-cook', etc.
  sourceDayIndex: number; // which day this recipe came from
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  foodId: string;
  foodName: string;
  category: string;
  totalGrams: number;
  unit: 'g' | 'ml' | 'pcs' | 'kg';
  estimatedCost?: number;
  daysNeeded: number[]; // day indices
  isPurchased: boolean;
  purchasedAt?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  dateRange: { start: string; end: string }; // ISO dates
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}