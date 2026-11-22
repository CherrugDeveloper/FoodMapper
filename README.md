# FoodMapper

## 🐛 Bug Fixes (v2.12.129)

- **Types**: Fixed malformed `DayPlan` interface structure in `src/types/dietPlan.ts` - previously had duplicated/missing fields that broke TypeScript type checking

## 🐛 Bug Fixes (v2.12.128)

- **Meal Generator**: Fixed critical bug where dietary fats were incorrectly calculated using fiber values instead of actual fat values (line 575: changed `fats: p.nutrition.fiber` to `fats: p.nutrition.fat`). This bug caused incorrect macronutrient calculations and meal planning.
- **Meal Generator**: Removed Patates (ID '24') from `SNACK_CARB_POOL` (was `lunch_dinner`-only) — no more potatoes + yogurt in morning snacks
- **Meal Generator**: Removed Uova e Carne fresca (ID '13') and Parmigiano (ID '12') from `SNACK_PROTEIN_POOL` — no more rice + parmesan in afternoon snacks
- **Foods Data**: Clarified food names (avena da cuocere, uova 2 medie ~100g, tofu firm/extra-firm, parmigiano grattugiato, yogurt greco senza lattosio)

## 🐛 Bug Fixes (v2.12.127)

- **AppContext**: Fixed diet plan not regenerating when pressing "Calcola fabbisogno strutturale" — removed redundant `useMemo` wrapper around `useDietPlan` that blocked state updates from `regenerateDays`
- **Meal Generator**: Removed Patates (ID '24') from `SNACK_CARB_POOL` (was `lunch_dinner`-only) — no more potatoes + yogurt in morning snacks
- **Meal Generator**: Removed Uova e Carne fresca (ID '13') and Parmigiano (ID '12') from `SNACK_PROTEIN_POOL` — no more rice + parmesan in afternoon snacks
- **Foods Data**: Clarified food names (avena da cuocere, uova 2 medie ~100g, tofu firm/extra-firm, parmigiano grattugiato, yogurt greco senza lattosio)

## 🐛 Bug Fixes (v2.12.126)

- **Foods Data**: Added Ricotta vaccina (ID '92') to food database with 11g protein/100g, suitable for breakfast, snack, and lunch_dinner
- **Meal Generator**: Added Ricotta (ID '92') to SNACK_PROTEIN_POOL for improved protein variety in snacks

## 🐛 Bug Fixes (v2.12.124)

- **ESLint**: Fixed linting warnings by removing 7 unused variables in `mealGenerator.ts` and `breakfastRealism.test.ts`
  - Removed `BREAKFAST_PROTEIN_POOL`, `BREAKFAST_FAT_POOL`, `BREAKFAST_CARB_POOL` unused constants
  - Removed `getFilteredSortedPool`, `getSustainablePool`, `poolToRoleType`, `POOLS_OPTIMIZED` unused functions
  - Removed `NEW_FOODS_NOT_FOR_BREAKFAST` unused test array

## 🐛 Bug Fixes (v2.12.123)

- **Foods Data**: Fixed breakfast realism by adding 'breakfast' to Olive (ID 72) mealSuitability, ensuring breakfast meals properly filter using mealSuitability field to allow olives as a breakfast fat option

## 🐛 Bug Fixes (v2.12.121)

- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by adding explicit `needs: [build, e2e]` dependency to deploy job and `if-no-files-found: error` to artifact download steps

## 🐛 Bug Fixes (v2.12.120)

- **React Hooks**: Fixed critical crash caused by calling `useDietPlan` hook inside `useMemo` - violated React Rules of Hooks causing infinite re-render loop
- **i18n**: Added `i18n.isInitialized` guard in `src/main.tsx` to prevent race condition where 'initialized' event was already emitted before listener was attached
- **MedicationSelector**: Added null-safety guards for `.length` accesses to prevent "Cannot read properties of undefined (reading 'length')" crash
- **E2E Tests**: Added missing `calculateButton.click()` in `verifyCalculatorResults()` test helper function
- **E2E Tests**: Fixed Italian translations in test expectations - corrected `report_proteins` to "Proteine", `report_fats` to "Grassi", `report_carbs_short` to "Carb"
- **Language Switching**: Implemented proper remount strategy on language change using `languageKey` counter and `language-changed` event dispatch
- **App**: Extracted disclaimer acceptance state to AppContext and added proper language change detection

## 🐛 Bug Fixes (v2.12.119)

- **Files**: Added trailing newline to NutritionalCalculator.tsx for Git compliance

## 🐛 Bug Fixes (v2.12.118)

- **E2E Tests**: Fixed 10 failing i18n calculator translation tests (it, en, de, es, fr)
- **Calculator**: Added optional chaining (?. operator) to prevent useEffect crashes on undefined lengths
- **CI**: Removed retry system - set --retries=0 in .github/workflows/ci.yml and playwright.config.ts

## 🎨 Features

### i18n Multi-language Support
- 🇮🇹 Italiano (default)
- 🇬🇧 English
- 🇩🇪 Deutsch
- 🇪🇸 Español
- 🇫🇷 Français

### Core Features
- Nutritional calculator with macro tracking
- Diet planning with phase-based meal generation
- Diary for food entry tracking
- Recipe management
- Shopping list generation
- Workout planning
- Sleep tracking
- Food allergy and medication warnings

### Meal Generator Improvements (v2.12.129)
- **Fat Target Constants**: `FAT_TARGET_MIN` (15g), `FAT_TARGET_MAX` (25g), `FAT_TARGET_MEDIAN` (20g) per meal for consistent fat distribution
- **Dynamic FODMAP Filtering**: Implemented `filterPoolByFodmap()` function to filter food pools based on diet phase, conditions (celiac, hypertension, etc.), and user allergens
- **Omega-3 Recommendations**: Added omega-3 detection to generated meal portions and `omega3Recommendations` to DayPlan suggesting omega-3 rich foods (Chia, Walnuts, Sardines)
- **Enhanced Meal Suitability**: Improved `getMealPool()` to accept optional FODMAP filter options (phase, conditions, testGroup, userAllergens)
- **Type Improvements**: Added `omega3Rich` optional field to `MealPortion` interface and `omega3Recommendations` to `DayPlan` interface