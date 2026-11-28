# FoodMapper

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Current Release (v2.12.175)](#current-release-v212175)
- [Previous Release (v2.12.174)](#previous-release-v212174)
- [Previous Release (v2.12.173)](#previous-release-v212173)
- [Previous Release (v2.12.172)](#previous-release-v212172)
- [Previous Release (v2.12.171)](#previous-release-v212171)
- [Previous Release (v2.12.170)](#previous-release-v212170)
- [Previous Release (v2.12.168)](#previous-release-v212168)
- [Previous Release (v2.12.166)](#previous-release-v212166)
- [Previous Release (v2.12.164)](#previous-release-v212164)
- [Previous Features](#previous-features)
- [Technology Stack](#technology-stack)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

## Overview

FoodMapper is a comprehensive nutrition and fitness tracking application.

### Key Capabilities

- **Diet Tracking**: Comprehensive meal planning and nutritional tracking
- **Workout Plans**: Personalized exercise recommendations based on user data
- **Multi-language Support**: Available in Italian, English, German, French, and Spanish

### Current Release (v2.12.175)

- **MealCard generateRecipeName**: Now produces creative, meal-type-specific names (e.g., "Frittata di verdure con pane tostato", "Pasta con pesce e verdure", "Porridge di avena con frutta e frutta secca") instead of generic ingredient lists like "uova + 3 ingredienti"
- **MealCard generateInstructions**: Now produces cohesive, ingredient-specific cooking sequences for each meal type (COLAZIONE, SPUNTINI, PRANZO/CENA) instead of duplicate conditions and generic templates
- **MealCard findMatchingRecipe**: Now requires `recipePurity >= 1.0` (ALL recipe ingredients must be in the meal), with meal coverage not required — prevents recipes with foreign ingredients from being matched

### Previous Release (v2.12.174)

- **MealCard strict recipe matching**: `findMatchingRecipe` now requires `mealCoverage >= 0.75` and `recipePurity >= 0.7` — prevents predefined recipes with foreign ingredients (e.g., "spaghetti alle zucchine e menta") from being matched to unrelated meals; falls back to auto-generating a recipe from the meal's actual ingredients
- **RecipeDetail consistent rounding**: Added `roundNutrition()` utility — calories/sodium as integers, macros at 1 decimal, micros at 2 decimals when < 1 — applied across Macro Summary Cards, Tab Nutrition, Macro Totali, ingredient list and FoodDetailModal

### Previous Release (v2.12.173)

- **WorkoutDayCard i18n fix**: Exercise names displayed in English due to non-existent i18n keys `workout_${id}_name` — fixed to use existing `workout_${id}` keys in both select options and alt text
- **WorkoutPlan multi-exercise support**: Workout plan proposed only one exercise type per day — `planToDayPlans` now preserves all exercises from `buildPersonalizedPlan` output; `buildSuggestedPlan` and `handleExerciseChange` now populate the `exercises` array
- **WorkoutDayCard multi-exercise display**: Added multi-exercise list UI showing all exercises for a day when `plan.exercises.length > 1`, with per-exercise duration
- **MealCard conditional recipe navigation**: `handleViewIngredientRecipe` now only navigates if the clicked food is part of the current meal's recipe (`currentRecipe`); no navigation otherwise

### Previous Release (v2.12.172)

- **MealCard recipe name display**: Header shows the recipe name (found or auto-generated) instead of the plain meal name; clicking navigates to `RecipeDetail`
- **Bulgur fix without hardcoding**: Removed hardcoded bulgur/pasta/riso exclusion from colazione recipe generation — relies on `mealSuitability: 'lunch_dinner'` via `filterPoolByMealSuitability()`
- **Improved ingredient→recipe matching**: `handleViewIngredientRecipe` uses exact match first, then partial match with minimum 3-character length to avoid false positives
- **8 new recipes**: Porridge di Riso con Mela e Cannella, Frittata di Zucchine e Menta, Insalata di Riso con Tonno e Pomodorini, Vellutata di Zucca e Patate, Merluzzo al Pomodoro con Olive, Yogurt con Frutta Secca e Miele, Bruschette con Pomodorini e Basilico
- **Workout components i18n**: Replaced raw strings in `WorkoutDayCard` and `WorkoutSummary` with proper translation keys and fallbacks
- **New translation keys**: `workout_generated_plan_notes`, `workout_no_instructions`, `unit_kcal`, `workout_intensity_label`, `workout_activity_label` added to all 5 locale files (it/en/de/es/fr)

### Previous Release (v2.12.171)

- **MealCard recipe generation**: Auto-generates recipes from meal ingredients when no match found; bulgur excluded from colazione; meal name clickable to view recipe
- **Recipes & RecipeDetail temp recipe support**: Temporary recipes from MealCard persist in localStorage and display in recipe list
- **ShoppingList i18n fix**: Corrected week label path `shopping_week` → `shopping.week`; added kg conversion for quantities ≥ 1000g
- **FoodFilter 404 fix**: Added `{ defaultValue }` fallback to food name translations; resolved chunk loading error
- **Workout components i18n**: All equipment filters, settings dropdowns, and summary labels use proper translation keys in 5 languages
- **New translation key**: `diet_click_for_recipe` added to all locale files (it/en/de/es/fr)

### Previous Release (v2.12.170)

- **Refactored WorkoutPlan component structure**: Extracted `useWorkoutPlan` custom hook, `WorkoutSettingsPanel`, `WorkoutDayCard` and `WorkoutSummary` subcomponents for improved maintainability

### Previous Release (v2.12.168)

- **Fixed ShoppingList raw strings**: Replaced hardcoded Italian text with i18n translation keys in all 5 languages (it, en, fr, de, es)
- **Fixed ShoppingList name/quantity alignment**: Added unitValue to ShoppingListItem/CustomShoppingListItem, updated aggregation to sum grams and unitValue per foodId
- **Fixed ShoppingList price estimation**: Added COST_PER_100G mapping and calculated estimatedCost from food costCategory × quantity

### Previous Release (v2.12.166)

- **Fixed Semi di Chia display**: Whole-unit foods now show minimum 1 unit instead of "0 cucchiai" when portion is below threshold
- **Enhanced unit guards**: All special unit displays protected against zero-count output

### Previous Features

- **Workout Plans**: Personalized exercise recommendations based on user data
- **Diet Phases**: Supports elimination, reintroduction, and customization phases with proper food rotation
- **Nutritional Tracking**: Calculates calories, macros, and micronutrients for each meal
- **Multi-language Support**: Available in Italian, English, German, French, and Spanish

## Technology Stack

- React 19 + TypeScript + Tailwind CSS v4
- Vite build tool
- i18next for internationalization
- Vitest for testing

## Testing

- Run unit tests: `npm run test:run`
- Run end-to-end tests: `npm run test:e2e`

## Project Structure

- `src/components/`: React components
- `src/hooks/`: Custom React hooks
- `src/utils/`: Utility functions and data
- `src/types/`: TypeScript type definitions
- `tests/`: Test files

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed release history.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License.
