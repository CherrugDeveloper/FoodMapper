# DietPlan Architecture - Comprehensive Day-by-Day Meal Planning System

## Overview
Transform `DietPlan.tsx` from a static phase-based schema display into a comprehensive day-by-day meal planning system covering Day 0 through Phase 3 (reintegration) of the low-FODMAP diet, with meal confirmation/modification capabilities, persistence, and two new components: Recipes and ShoppingList.

## Current State Analysis

### Key Files
- **DietPlan.tsx** - Current: single-day preview per phase, IT/EN only, read-only, no persistence
- **mealGenerator.ts** - Current: `generateDayPlan()` without day index, produces identical days
- **NutritionalCalculator.tsx** - Calculates nutritional needs via `nutritionEngine.ts`
- **App.tsx** - Tab navigation with global state (calcResults, userData)
- **Diary.tsx** - Reference for localStorage persistence patterns
- **i18n.ts + 5 locale files** - Translation infrastructure (IT, EN, ES, DE, FR)

### Identified Gaps
1. **Language support**: DietPlan only handles IT/EN, falls back to EN for ES/DE/FR
2. **Day indexing**: No day parameter in meal generation → same day repeated
3. **Phase 2 incomplete**: Descriptive only, no 3-day test implementation
4. **No meal interaction**: Read-only display, no confirm/modify
5. **No persistence**: Diet plans not saved to localStorage
6. **Missing components**: No Recipes or ShoppingList components
7. **Translation gaps**: Missing keys for new features in all 5 languages

## Architecture Design

### 1. Shared Data Models

```typescript
// src/types/dietPlan.ts (new file)
export type DietPhase = 'phase0' | 'phase1' | 'phase2' | 'phase3';

export interface MealPortion {
  foodId: string;
  foodName: string;
  grams: number;
  nutrition: FoodNutrition;
  isConfirmed: boolean;
  isModified: boolean;
  originalGrams?: number;
  originalFoodId?: string;
}

export interface GeneratedMeal {
  name: string;
  key: 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner';
  portions: MealPortion[];
  totalNutrition: FoodNutrition;
  isConfirmed: boolean;
  confirmedAt?: string; // ISO date
}

export interface DayPlan {
  dayIndex: number; // 0-based from diet start
  phase: DietPhase;
  phaseDay: number; // 0-based within phase
  date: string; // ISO date (YYYY-MM-DD)
  meals: GeneratedMeal[];
  dailyTotals: FoodNutrition;
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
  mealType: GeneratedMeal['key'];
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
  unit: 'g' | 'ml' | 'pcs';
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
```

### 2. Phase Protocol Definition

| Phase | Name | Duration | Purpose | Day Range |
|-------|------|----------|---------|-----------|
| Phase 0 | Preparation | 7 days | Baseline, elimination prep | Day 0-6 |
| Phase 1 | Strict Elimination | 21 days | Full low-FODMAP | Day 7-27 |
| Phase 2 | Reintroduction Tests | 21 days | 3-day test per FODMAP group | Day 28-48 |
| Phase 3 | Personalization | Ongoing | Long-term personalized diet | Day 49+ |

**Phase 2 Structure (7 FODMAP groups × 3 days each = 21 days):**
1. Fructose (Days 28-30)
2. Lactose (Days 31-33)
3. Fructans (Days 34-36)
4. Galactans/GOS (Days 37-39)
5. Polyols - Sorbitol (Days 40-42)
6. Polyols - Mannitol (Days 43-45)
7. Combined/Challenge (Days 46-48)

### 3. Meal Generation Enhancement

**Current `generateDayPlan(results, userData, phase)` → New `generateDayPlan(results, userData, phase, dayIndex, dietPlanState)`**

Key changes:
- Add `dayIndex` parameter for deterministic rotation
- Add `dietPlanState` for user preferences/exclusions
- Implement food rotation algorithm using dayIndex as seed
- Phase 2: inject test food for specific FODMAP group on test days
- Respect confirmed/modified meals from previous days

### 4. Persistence Strategy

**Storage Key**: `ibs-diet-plan-{userId}` (derive from userData hash or use fixed key)

**Structure**:
```json
{
  "version": 1,
  "startDate": "2026-01-15",
  "currentDayIndex": 15,
  "days": [...],
  "userPreferences": {...},
  "recipes": [...],
  "shoppingLists": [...]
}
```

**Sync Strategy**: 
- Load on DietPlan mount
- Save on: meal confirm, meal modify, day complete, preference change
- Debounce saves (300ms)
- Handle migration for version changes

### 5. Component Architecture

```
App.tsx
├── NutritionalCalculator (tab: calc)
├── Diary (tab: diary)
├── DietPlan (tab: diet) ← MAIN MODIFICATION
│   ├── DayNavigator (new sub-component)
│   ├── PhaseProgress (new sub-component)
│   ├── MealCard (new sub-component) - confirm/modify UI
│   └── DaySummary (new sub-component)
├── Recipes (tab: recipes) ← NEW COMPONENT
│   ├── RecipeList
│   ├── RecipeDetail
│   └── RecipeBuilder (from confirmed meals)
├── ShoppingList (tab: shopping) ← NEW COMPONENT
│   ├── ListSelector
│   ├── ItemList
│   └── CategoryGroup
├── WorkoutPlan (tab: workout)
├── FoodFilter (tab: foods)
├── Devices (tab: devices)
└── EducationalHub (tab: hub)
```

### 6. Translation Keys to Add

**New namespace: `dietPlan`**
- Navigation: `day`, `phase`, `previousDay`, `nextDay`, `goToDay`, `today`
- Actions: `confirmMeal`, `modifyMeal`, `resetMeal`, `completeDay`, `undoComplete`
- Status: `confirmed`, `modified`, `pending`, `completed`, `inProgress`
- Phase2: `testDay`, `testFood`, `symptomTracking`, `toleranceResult`
- Recipes: `recipe`, `ingredients`, `instructions`, `prepTime`, `cookTime`, `difficulty`, `saveAsRecipe`, `createRecipe`
- Shopping: `shoppingList`, `addToList`, `markPurchased`, `totalItems`, `estimatedCost`, `byCategory`
- Persistence: `savePlan`, `loadPlan`, `resetPlan`, `exportPlan`, `importPlan`

**New namespace: `phases`** (extend existing)
- `phase0.name`, `phase0.description`, `phase0.duration`
- `phase1.name`, `phase1.description`, `phase1.duration`
- `phase2.name`, `phase2.description`, `phase2.duration`, `phase2.groups`
- `phase3.name`, `phase3.description`, `phase3.duration`

**New namespace: `fodmapGroups`**
- `fructose`, `lactose`, `fructans`, `galactans`, `sorbitol`, `mannitol`, `combined`

### 7. File Operations

**New Files:**
- `src/types/dietPlan.ts` - Shared types
- `src/components/Recipes.tsx` - Recipes tab
- `src/components/ShoppingList.tsx` - ShoppingList tab
- `src/components/dietPlan/DayNavigator.tsx` - Day navigation
- `src/components/dietPlan/MealCard.tsx` - Meal interaction card
- `src/components/dietPlan/PhaseProgress.tsx` - Phase progress bar
- `src/components/dietPlan/DaySummary.tsx` - Daily nutrition summary
- `src/hooks/useDietPlan.ts` - Custom hook for diet plan state/persistence
- `src/hooks/useRecipes.ts` - Custom hook for recipes
- `src/hooks/useShoppingList.ts` - Custom hook for shopping lists
- `src/utils/phase2Generator.ts` - Phase 2 reintroduction logic

**Modified Files:**
- `src/components/DietPlan.tsx` - Complete rewrite
- `src/utils/mealGenerator.ts` - Add dayIndex, rotation, phase2 support
- `src/App.tsx` - Add Recipes and ShoppingList tabs, pass props
- `src/i18n.ts` - Verify all namespaces loaded
- All 5 locale files - Add new translation keys

**Potentially Superfluous Files (to evaluate):**
- `src/components/Devices.tsx` - Check if used
- `src/components/ExerciseFigure.tsx` - Check if used
- `src/content/*.md` - Educational content, verify if used in EducationalHub
- `repomix-output.xml` - Likely build artifact
- `progetto.txt` - Project notes, verify if needed

## Implementation Sequence

1. **Types & Utilities** (Foundation)
   - Create `src/types/dietPlan.ts`
   - Extend `mealGenerator.ts` with dayIndex, rotation, phase2
   - Create `phase2Generator.ts`

2. **Persistence Hook**
   - Create `useDietPlan.ts` with localStorage sync

3. **DietPlan Sub-components**
   - DayNavigator, MealCard, PhaseProgress, DaySummary

4. **Main DietPlan.tsx Rewrite**
   - Integrate sub-components
   - Connect to useDietPlan hook
   - Handle day navigation, meal confirm/modify

5. **Recipes Component**
   - Create Recipes.tsx with useRecipes hook
   - Recipe generation from confirmed meals

6. **ShoppingList Component**
   - Create ShoppingList.tsx with useShoppingList hook
   - Aggregation from selected day range

7. **App.tsx Integration**
   - Add tabs, pass shared state

8. **Translations**
   - Add all new keys to 5 locale files

9. **Cleanup & Validation**
   - Evaluate/remove superfluous files
   - TypeScript build, lint, runtime test