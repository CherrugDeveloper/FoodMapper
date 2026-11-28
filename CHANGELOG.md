## [2.12.176] - 2026-11-28

### Fixed
- **MealCard**: `generateRecipeName` no longer incorrectly includes "frutta secca" when meal contains only seeds (e.g., "semi di zucca") — separated `hasSeeds` from `hasNuts`; `hasNuts` now only matches true nuts (mandorle, noci, nocciole, anacardi, pistacchi)
- **MealCard**: `generateRecipeName` no longer triggers fruit-based names from "banana verde" alone — removed `'banana'` from `hasFruit` detection
- **MealCard**: `generateInstructions` no longer references hardcoded ingredients not in the meal (removed "salsa di soia e zenzero" from tofu instructions)
- **MealCard**: Removed redundant "Consumare subito per massimizzare freschezza e digeribilità" appended to every auto-generated recipe
- **RecipeDetail**: "Torna al pasto" button now navigates back to the specific MealCard in DietPlan (via `scrollToMeal` state) instead of always going to DietPlan top
- **RecipeDetail**: Removed non-functional "Salva al pasto" button and `handleSaveToMealPlan` (recipe is already part of the meal)

### Added
- **DietPlan**: Added `useLocation` hook and scroll-to-meal logic — when navigating back from RecipeDetail, the page smoothly scrolls to the originating MealCard
- **MealCard**: Added optional `id` prop applied to root div for scroll targeting

## [2.12.175] - 2026-11-28

### Fixed
- **MealCard**: `generateInstructions` now uses meal-type-specific blocks (COLAZIONE, SPUNTINI, PRANZO/CENA) instead of duplicate conditions — previously SPUNTINI conditions were duplicated from COLAZIONE section
- **MealCard**: `generateInstructions` now accepts `mealKey` parameter to enable proper meal-type routing
- **MealCard**: `generateRecipeName` now produces creative, meal-type-specific names (e.g., "Frittata di verdure con pane tostato", "Pasta con pesce e verdure", "Porridge di avena con frutta e frutta secca") instead of generic ingredient lists
- **MealCard**: Strict recipe matching logic — only returns predefined recipes when ALL recipe ingredients are in the meal (recipe ⊆ meal), otherwise auto-generates recipe from meal's actual ingredients

### Added
- **MealCard**: `findMatchingRecipe` now requires `recipePurity >= 1.0` (ALL recipe ingredients must be in the meal), with meal coverage not required
- **MealCard**: `generateRecipeName` produces creative names based on meal type and ingredient combinations
- **MealCard**: `generateInstructions` produces cohesive, ingredient-specific cooking sequences for each meal type

## [2.12.174] - 2026-11-28

### Fixed
- **MealCard**: `findMatchingRecipe` returned predefined recipes with ingredients not in the current meal (e.g., "spaghetti alle zucchine e menta" for a meal with petto di pollo, zucchine, pane integrale, mandorle) — added `mealCoverage >= 0.75` and `recipePurity >= 0.7` thresholds to require good ingredient overlap
- **RecipeDetail**: Inconsistent number rounding across nutritional displays — added `roundNutrition()` utility for consistent precision: calories/sodium as integers, macros at 1 decimal, micros at 2 decimals when < 1

### Added
- **MealCard**: Strict recipe matching logic — only returns predefined recipes when meal ingredients are well-represented AND recipe doesn't introduce many foreign ingredients; otherwise auto-generates recipe from meal's actual ingredients
- **RecipeDetail**: `roundNutrition()` function applied to Macro Summary Cards, Tab Nutrition, Macro Totali, Lista Ingredienti, FoodDetailModal Nutrition Details and Portion Info

## [2.12.173] - 2026-11-27

### Fixed
- **WorkoutDayCard**: Exercise names displayed in English due to non-existent i18n keys `workout_${id}_name` — fixed to use existing `workout_${id}` keys in both select options and alt text
- **WorkoutPlan**: Workout plan proposed only one exercise type per day — `planToDayPlans` now preserves all exercises from `buildPersonalizedPlan` output; `buildSuggestedPlan` and `handleExerciseChange` now populate the `exercises` array
- **MealCard**: `handleViewIngredientRecipe` navigated to any recipe containing the ingredient regardless of meal context — now only navigates if the clicked food is part of the current meal's recipe (`currentRecipe`); no navigation otherwise

### Added
- **WorkoutDayCard**: Multi-exercise list UI displaying all exercises for a day when `plan.exercises.length > 1`, with per-exercise duration

## [2.12.172] - 2026-11-27

### Changed
- **MealCard**: Header now displays the recipe name (found or auto-generated) instead of the plain meal name; clicking navigates to `RecipeDetail`
- **MealCard**: Removed hardcoded bulgur/pasta/riso exclusion from colazione recipe generation — relies on `mealSuitability: 'lunch_dinner'` via `filterPoolByMealSuitability()` in `mealGenerator.ts`
- **MealCard**: Improved `handleViewIngredientRecipe` matching — exact match first, then partial match with minimum 3-character length to avoid false positives
- **WorkoutDayCard**: Replaced raw strings (`plan.activity`, `🔥 ~{caloriesBurned} kcal`, `'No instructions available'`, category/difficulty/intensity) with i18n keys and fallbacks
- **WorkoutSummary**: Replaced raw strings (`generatedPlan.notes`, `kcal`, intensity) with i18n keys and fallbacks

### Added
- **MealCard**: `findOrCreateRecipeForMeal` creates virtual recipes from meal portions when no predefined recipe matches
- **MealCard**: `generateRecipeName` generates descriptive recipe names from meal ingredients
- **MealCard**: `generateInstructions` generates basic cooking instructions from meal ingredients
- **WorkoutDayCard**: Exercise GIF/Figure display with i18n support
- **WorkoutSummary**: Weekly calorie calculation and display

## [2.12.171] - 2026-11-26

### Fixed
- **i18n**: Missing translation keys for workout exercises, categories, and equipment types
- **WorkoutPlan**: Equipment filter not properly initialized from saved settings
- **MealCard**: Recipe navigation not working for custom/auto-generated recipes

### Added
- **i18n**: Complete translation coverage for all 5 languages (it, en, de, es, fr)
- **WorkoutPlan**: Equipment filter with multi-select support
- **MealCard**: Temp recipe storage pattern for auto-generated recipes

## [2.12.170] - 2026-11-25

### Fixed
- **MealGenerator**: Fat calculation using wrong property name (`fats` vs `fat`)
- **MealGenerator**: Double-scaling bug in fat portion generation
- **NutritionCalculator**: Wrong property name (`totalFat` vs `totalFats`)
- **RecipesData**: `createPortion()` using wrong property name (`fats` vs `fat`)

### Added
- **FoodsData**: New food IDs (43, 44, 60, 65, 66) for recipe compatibility
- **MealGenerator**: Omega-3 recommendations for fish and nuts
- **MealGenerator**: Seasonality filtering for fruits and vegetables

## [2.12.168] - 2026-11-24

### Fixed
- **MealGenerator**: Breakfast fat pool filtering to exclude EVO oil
- **MealGenerator**: Meal suitability filtering for lunch/dinner only foods
- **MealGenerator**: Portion size threshold (IRRELEVANT_THRESHOLD_GRAMS = 5)

### Added
- **MealGenerator**: Unit type support for precise measurements (cucchiaini, cucchiai)
- **MealGenerator**: Food separation for similar items (mais fresco vs polenta)
- **MealGenerator**: Temp recipe pattern for virtual recipes

## [2.12.166] - 2026-11-23

### Fixed
- **Navigation**: React Router v7 compatibility with CustomEvent fallback
- **DayNavigator**: Calendar day matching using dayIndex instead of date string
- **i18n**: HttpBackend loading only active language bundle

### Added
- **Navigation**: `navigateTo()` utility with CustomEvent dispatch
- **DayNavigator**: Double-click to change start date
- **i18n**: Translation version cache-busting

## [2.12.164] - 2026-11-22

### Fixed
- **Tailwind**: Vertical spacing using logical properties (margin-block-*)
- **FoodFilter**: Matching both localized names and raw food names
- **FoodsData**: Missing `sugar` field in nutrition objects

### Added
- **FoodFilter**: Improved search with localized name support
- **FoodsData**: Complete nutrition data for all foods
- **RecipesData**: Recipe database with 50+ predefined recipes