# FoodMapper

A FODMAP-friendly diet planning application for managing IBS and digestive health through personalized meal planning.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Changelog](#changelog)

## Overview

FoodMapper is a web application designed to help individuals following a Low FODMAP diet create and manage personalized meal plans. The application provides intelligent food selection, nutritional calculations, and diet phase management for IBS sufferers.

### Key Capabilities

- **Personalized Meal Generation**: Creates daily meal plans based on individual nutritional needs, allergens, and dietary preferences
- **FODMAP Diet Support**: Implements Monash University FODMAP guidelines for safe food selection
- **Diet Phases**: Supports elimination, reintroduction, and customization phases with proper food rotation
- **Nutritional Tracking**: Calculates calories, macros, and micronutrients for each meal
- **Multi-language Support**: Available in Italian, English, German, French, and Spanish

## Features

### Current Release (v2.12.173)

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

### Previous Release (v2.12.164)

- **Expanded Protein Options**: Added separate entries for Petto di Pollo (ID 33) and Petto di Tacchino (ID 100) for more precise meal planning
- **Enhanced Fat Pool**: Updated breakfast fat options with omega-3 rich foods (walnuts, olives, tahina)
- **Improved Meal Suitability**: Riso Bianco and Riso Integrale now suitable for breakfast
- **Optimized SNACK_CARB_POOL**: Better seasonal availability with Lamponi and Riso Integrale
- **Added 5 missing food items**: Sciroppo d'acero (ID 43), Zenzero fresco (ID 44), Curcuma in polvere (ID 60), Acqua minerale (ID 65), Latte di avena (ID 66) - referenced by recipesData.ts
- **Added cucchiaini unit**: Support for precise oil/spice measurements in meal copy formatting

### Previous Features

- Multi-phase diet support (Elimination, Reintroduction, Customization)
- Food database with 100+ FODMAP-compliant items
- Meal filtering by FODMAP level, allergens, and suitability
- Copy-paste friendly meal formatting
- Responsive design for all devices

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + React Router 7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **State Management** | React Context + Hooks |
| **Internationalization** | react-i18next 17 |
| **Date Handling** | Native JavaScript Date API |
| **Testing** | Vitest, React Testing Library, Playwright |
| **CI/CD** | GitHub Actions, GitHub Pages |

## Installation

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 10+ or pnpm/yarn (via npm overrides)

### Setup

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts Vite development server with HMR |
| `npm run build` | Type-checks and builds production bundle |
| `npm run lint` | Runs ESLint code analysis |
| `npm run preview` | Preview production build locally |
| `npm run test` | Starts Vitest test runner in watch mode |
| `npm run test:run` | Runs all tests once (CI) |
| `npm run test:e2e` | Runs Playwright end-to-end tests |
| `npm run test:ci` | Runs e2e tests in CI mode |

### Database Structure

The application uses a structured food database (`src/utils/foodsData.ts`) with entries containing:
- FODMAP classification level
- Nutritional information per 100g
- Seasonal availability (months)
- Meal suitability ratings
- Allergen identification

## Building

```bash
# Production build
npm run build

# Output location
dist/
```

**Note**: Do not modify `vite.config.ts` line 114 (`base: './'`) as this is required for GitHub Pages deep-linking.

## Testing

The project maintains comprehensive test coverage across 19 test files with 163+ tests:

```bash
# Run unit tests
npm run test:run

# Run end-to-end tests
npm run test:e2e
```

### Test Coverage Areas

- Meal generation logic
- Zero-portion filtering
- Seasonal food availability
- FODMAP compliance
- Nutrition calculations
- Phase transitions
- Allergen handling

## Project Structure

```
FoodMapper/
├── public/              # Static assets and locales
├── src/
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions and data
│   ├── App.tsx          # Main application
│   └── main.tsx         # Entry point
├── tests/               # Test files (co-located with source)
└── vite.config.ts       # Vite configuration
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes grouped by version.

## Contributing

1. Run `npm run lint` before committing
2. Ensure all tests pass: `npm run test:run`
3. Build must succeed: `npm run build`
4. Follow the project's TypeScript strict mode requirements

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

For issues and feature requests, please open a GitHub issue.