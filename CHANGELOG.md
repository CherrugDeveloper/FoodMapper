# Changelog

## [2.12.134] - 2026-11-23

### Fixed
- **PhaseProgress**: Fixed "Fase 0 - preparazione" display for days before phase 0 - now shows "Giorni dall'inizio fase 0" with day count badge
- **FoodsData**: Split "Riso Bianco e Integrale" (id: '2') into separate entries: "Riso Bianco" (id: '2') and "Riso Integrale" (id: '94')
- **RecipesData**: Updated "Pasta integrale con gamberi e pomodori" recipe to use new Riso Integrale (id: '94')
- **mealGenerator**: Added raspberries (id: '53') to snapToWholeUnits unitMap for count display (30g per pezzo)

### Added
- **i18n**: Added `diet_phase_pre_start_days` translation key in all 5 languages (it, en, es, fr, de)

## [2.12.133] - 2026-11-22

### Fixed
- **CI/CD**: Fixed invalid GitHub Actions versions (`@v6` → `@v4`/`@v5`) and added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var for Node.js 24 compatibility in CI pipeline
- **PhaseProgress**: Fixed duplicate "Pre-inizio" text when selecting days before phase 0
- **FoodsData**: Fixed egg naming from "Uova (2 medie ~100g)" to "Uova"
- **FoodsData**: Fixed Avena naming from "Avena in fiocchi (da cuocere per porridge)" to "Avena in fiocchi"
- **FoodsData**: Split merged "Arance e Mandarino" into separate Arance and Mandarino entries
- **MealGenerator**: Added banana quantization to whole units (~100g each)

## [2.12.131] - 2026-11-22

### Fixed
- **Meal Generator**: Fixed protein normalization to properly scale calories when protein target is exceeded - uses results.proteins target instead of hardcoded 100g, and scales carbs/fats proportionally to remaining calories

### Changed
- **Meal Generator**: Updated normalization logic to use results.proteins target and proportional macro scaling instead of uniform proteinScale

## [2.12.130] - 2026-11-22

### Added
- **Meal Generator**: Whole units support for foods (uova, vasetti, quadrati, cucchiai, fette, pz) via `snapToWholeUnits`, `getUnitGrams`, `getUnitType` helpers
- **Meal Generator**: Lactose intolerance filtering in `isFoodFodmapCompatible` - excludes foods with 'milk' allergen
- **Meal Generator**: `getAlternativeText` function removes "Gluten-Free"/"senza glutine" references for non-celiac users
- **Meal Generator**: Italian meal ordering via `sortPortionsByItalianMealStructure` (Primo → Secondo → Contorno → Panificati → Frutta secca → Dessert)
- **Meal Generator**: Removed quinoa (ID 15) from `SNACK_CARB_POOL`
- **Types**: Added `FoodUnit` type export and `unit`/`unitValue` optional fields to `MealPortion` interface
- **UI**: Copy UserData button in NutritionalCalculator.tsx with `id="copy-userdata-btn"`
- **UI**: MealCard portion display now shows units when available; copy includes unit text

### Fixed
- **PhaseProgress**: Fixed duplicate infopopup text when selecting days before phase 0 by using `useMemo` for `preStartBadgeLabel`
- **Meal Generator**: Fixed variable redeclaration conflicts (`proteinWhole`/`finalProteinGrams` → `proteinWholeUnits`/`finalProteinGrams2`)

### Changed
- **Meal Card**: Portion display and copy text now include unit information for whole-unit foods

## [2.12.129] - 2026-11-22

### Fixed
- **Types**: Fixed malformed `DayPlan` interface structure in `src/types/dietPlan.ts` - previously had duplicated/missing fields that broke TypeScript type checking
- **CI/CD**: Fixed GitHub Actions deployment errors - removed deprecated `--no-deprecation` NODE_OPTIONS flag and added explicit `artifact-name: github-pages` to resolve "No artifacts named 'github-pages' were found" error
- **CI/CD**: Added debug logging for dist directory verification in pages deployment job

### Added
- **Meal Generator**: Introduced `FAT_TARGET_MIN` (15g), `FAT_TARGET_MAX` (25g), and `FAT_TARGET_MEDIAN` (20g) constants for explicit fat target guidance
- **Meal Generator**: Implemented dynamic FODMAP filtering in `getMealPool()` function via new `filterPoolByFodmap()` helper
- **Meal Generator**: Added omega-3 detection to generated meal portions (`omega3Rich` flag on MealPortion)
- **Meal Generator**: Added `omega3Recommendations` to DayPlan suggesting omega-3 rich foods (Chia, Walnuts, Sardines)
- **Types**: Added optional `omega3Rich` field to `MealPortion` interface
- **Types**: Added optional `omega3Recommendations` field to `DayPlan` interface
- **Tests**: Added test 'should target 15-25g fats per meal' for fat target verification
- **Tests**: Added test 'should generate fat portions with reasonable grams' for portion validation
- **Tests**: Added test 'should generate omega-3 recommendations' for omega-3 guidance
- **Tests**: Added test 'should flag omega-3 rich foods in portions' for omega-3 portion detection
- **Tests**: Added test 'should filter out gluten for celiac users' for celiac FODMAP filtering
- **Tests**: Added test 'should filter out foods with allergens' for allergen filtering
- **Tests**: Added test 'should maintain fat target across different meal counts' for scalability
- **Tests**: Added test 'should target 20-25g proteins per meal' for protein target verification

### Changed
- **Meal Generator**: Enhanced `getMealPool()` to accept optional FODMAP filter options (phase, conditions, testGroup, userAllergens)
- **Meal Generator**: Improved fat portion logic to use FAT_TARGET_MIN/MAX/MEDIAN constants
- **Meal Generator**: Added omega-3 rich foods (Chia seeds, Walnuts, Sardines) tagging in generated plans
- **Types**: Updated `MealPortion` interface with `omega3Rich` optional boolean field
- **Types**: Updated `DayPlan` interface with `omega3Recommendations` optional string array field

### Tests
- All 20 mealGenerator tests pass successfully (12 existing + 8 new)

## [2.12.128] - 2026-11-22

### Fixed
- **Meal Generator**: Fixed critical bug where dietary fats were incorrectly calculated using fiber values instead of actual fat values (line 575: changed `fats: p.nutrition.fiber` to `fats: p.nutrition.fat`). This bug caused incorrect macronutrient calculations and meal planning.
- **Meal Generator**: Removed Patates (ID '24', `mealSuitability: 'lunch_dinner'`) from `SNACK_CARB_POOL` — it was incorrectly appearing in snacks
- **Meal Generator**: Removed Uova e Carne fresca (ID '13', `mealSuitability: 'breakfast'`) and Parmigiano (ID '12', `mealSuitability: 'lunch_dinner'`) from `SNACK_PROTEIN_POOL` — they were incorrectly appearing in snacks
- **AppContext**: Removed redundant `useMemo` wrapper around `useDietPlan` return value that prevented the diet plan from updating when `regenerateDays` modified internal state

### Added
- **Meal Generator**: Introduced `FAT_TARGET_MIN` (15g), `FAT_TARGET_MAX` (25g), and `FAT_TARGET_MEDIAN` (20g) constants for explicit fat target guidance
- **Meal Generator**: Implemented dynamic FODMAP filtering in `getMealPool()` function via new `filterPoolByFodmap()` helper
- **Meal Generator**: Added omega-3 detection to generated meal portions (`omega3Rich` flag on MealPortion)
- **Meal Generator**: Added `omega3Recommendations` to DayPlan suggesting omega-3 rich foods (Chia, Walnuts, Sardines)
- **Types**: Added optional `omega3Rich` field to `MealPortion` interface
- **Types**: Added optional `omega3Recommendations` field to `DayPlan` interface
- **Tests**: Added test 'should target 15-25g fats per meal' for fat target verification
- **Tests**: Added test 'should generate fat portions with reasonable grams' for portion validation
- **Tests**: Added test 'should generate omega-3 recommendations' for omega-3 guidance
- **Tests**: Added test 'should flag omega-3 rich foods in portions' for omega-3 portion detection
- **Tests**: Added test 'should filter out gluten for celiac users' for celiac FODMAP filtering
- **Tests**: Added test 'should filter out foods with allergens' for allergen filtering
- **Tests**: Added test 'should maintain fat target across different meal counts' for scalability
- **Tests**: Added test 'should target 20-25g proteins per meal' for protein target verification

### Changed
- **Meal Generator**: Enhanced `getMealPool()` to accept optional FODMAP filter options (phase, conditions, testGroup, userAllergens)
- **Meal Generator**: Improved fat portion logic to use FAT_TARGET_MIN/MAX/MEDIAN constants
- **Meal Generator**: Added omega-3 rich foods (Chia seeds, Walnuts, Sardines) tagging in generated plans
- **Types**: Updated `MealPortion` interface with `omega3Rich` optional boolean field
- **Types**: Updated `DayPlan` interface with `omega3Recommendations` optional string array field

### Tests
- All 20 mealGenerator tests pass successfully (12 existing + 8 new)

## [2.12.127] - 2026-11-22

### Fixed
- **AppContext**: Removed redundant `useMemo` wrapper around `useDietPlan` return value that prevented the diet plan from updating when `regenerateDays` modified internal state. The diet now correctly regenerates when the user presses "Calcola fabbisogno strutturale" in the Nutritional Calculator
- **Meal Generator**: Removed Patates (ID '24', `mealSuitability: 'lunch_dinner'`) from `SNACK_CARB_POOL` — it was incorrectly appearing in snacks (e.g. potatoes + yogurt in morning snack)
- **Meal Generator**: Removed Uova e Carne fresca (ID '13', `mealSuitability: 'breakfast'`) and Parmigiano (ID '12', `mealSuitability: 'lunch_dinner'`) from `SNACK_PROTEIN_POOL` — they were incorrectly appearing in snacks (e.g. rice + parmesan in afternoon snack)

### Changed
- **Foods Data**: Clarified food names for better practical understanding:
  - `Avena in fiocchi` → `Avena in fiocchi (da cuocere per porridge)`
  - `Uova e Carne fresca` → `Uova (2 medie ~100g)`
  - `Tofu sodo` → `Tofu sodo (tipo firm/extra-firm)`
  - `Parmigiano Reggiano / Grana Padano` → `Parmigiano Reggiano (grattugiato)`
  - `Yogurt greco senza lattosio` → `Yogurt greco (senza lattosio)`

## [2.12.126] - 2026-11-21

### Added
- **Foods Data**: Added Ricotta vaccina (ID '92') to food database with 11g protein/100g, suitable for breakfast, snack, and lunch_dinner
- **Meal Generator**: Added Ricotta (ID '92') to SNACK_PROTEIN_POOL for improved protein variety in snacks

### Changed
- **Meal Generator**: Increased MIN_SNAP_PROTEIN_GRAMS from 20g to 25g for more satisfying snack protein portions
- **Meal Generator**: Expanded SNACK_PROTEIN_POOL to include Tempeh (57) and Ricotta (92) alongside existing options

## [2.12.125] - 2026-11-21

### Fixed
- **i18n**: Added missing translation keys to Spanish and French language files for consistency across all 5 supported languages (en, de, es, fr, it)
  - Added `info.info_meal_plan` and `info.info_meal_plan_desc` for Meal Plan information tooltip
  - Added `info.info_phase_3_intro` and `info.info_phase_3_intro_desc` for Phase 3 introduction tooltip
  - Added `medication_recognition_button` to English translations (already existed in de, es, fr, it)

## [2.12.124] - 2026-11-21

### Fixed
- **ESLint**: Removed 7 unused variables to fix linting warnings in `mealGenerator.ts` and `breakfastRealism.test.ts`
  - Removed `BREAKFAST_PROTEIN_POOL`, `BREAKFAST_FAT_POOL`, `BREAKFAST_CARB_POOL` unused constants
  - Removed `getFilteredSortedPool`, `getSustainablePool`, `poolToRoleType`, `POOLS_OPTIMIZED` unused functions
  - Removed `NEW_FOODS_NOT_FOR_BREAKFAST` unused test array
  - Removed unused `mealKey` parameter from `pickRotating` function
  - Removed unused `carbPool` variable in `generateDayPlan` function
- **Tests**: All 144 unit tests pass successfully
- **CI/CD**: Zero ESLint errors after cleanup

## [2.12.123] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by renaming artifact from `github-pages` to `build-artifact` and ensuring all jobs (build, e2e, deploy) use the same artifact name
- **CI/CD**: Removed duplicate ESLint execution from build job (already runs in lint job)
- **CI/CD**: Removed e2e from deploy job dependencies - deploy now only waits for build to succeed, allowing faster deployments
- **CI/CD**: Added timeout-minutes: 10 to deploy job to prevent hanging
- **Foods Data**: Fixed breakfast realism by adding 'breakfast' to Olive (ID 72) mealSuitability, ensuring breakfast meals properly filter using mealSuitability field

## [2.12.122] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by removing duplicate artifact download from deploy job - the artifact is now used directly from the build job
- **CI/CD**: Removed duplicate ESLint execution from build job (already runs in lint job)

## [2.12.121] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by adding explicit `needs: [build, e2e]` dependency to deploy job and `if-no-files-found: error` to artifact download steps

## [2.12.120] - 2026-11-21

### Fixed
- **React Hooks**: Fixed critical crash caused by calling `useDietPlan` hook inside `useMemo` - violated React Rules of Hooks causing infinite re-render loop
- **i18n**: Added `i18n.isInitialized` guard in `src/main.tsx` to prevent race condition where 'initialized' event was already emitted before listener was attached
- **MedicationSelector**: Added null-safety guards for `.length` accesses to prevent "Cannot read properties of undefined (reading 'length')" crash
- **E2E Tests**: Added missing `calculateButton.click()` in `verifyCalculatorResults()` test helper function
- **E2E Tests**: Fixed Italian translations in test expectations - corrected `report_proteins` to "Proteine", `report_fats` to "Grassi", `report_carbs_short` to "Carb"
- **Language Switching**: Implemented proper remount strategy on language change using `languageKey` counter and `language-changed` event dispatch
- **App**: Extracted disclaimer acceptance state to AppContext and added proper language change detection

### Changed
- **App**: Reorganized imports in `src/App.tsx` for consistency
- **AppContext**: Added `forceDisclaimer`, `currentLanguage`, `languageKey` props to AppProvider for proper language change handling
- **AppContext**: Moved `handleAcceptDisclaimer` callback and `isDisclaimerAccepted` state into context
- **MedicationSelector**: Fixed `brandsForSelected` to handle empty array case when no medication selected

### Tests
- All 144 unit tests pass
- All 32 i18n E2E tests pass

## [2.12.119] - 2026-11-20
### Fixed
- **Files**: Added trailing newline to NutritionalCalculator.tsx for Git compliance

## [2.12.118] - 2026-11-19
### Fixed
- **E2E Tests**: Fixed 10 failing i18n calculator translation tests (it, en, de, es, fr)
- **Calculator**: Added optional chaining (?. operator) to prevent useEffect crashes on undefined lengths
- **CI**: Removed retry system - set --retries=0 in .github/workflows/ci.yml and playwright.config.ts

## [2.12.117] - 2026-11-19
### Fixed
- **E2E Tests**: Fixed 10 failing i18n calculator translation tests (it, en, de, es, fr)
- **Calculator**: Added optional chaining (?. operator) to prevent useEffect crashes on undefined lengths
- **CI**: Removed retry system - set --retries=0 in .github/workflows/ci.yml and playwright.config.ts

## [2.12.116] - 2026-11-19
### Fixed
- **PWA / TypeScript**: Replaced invalid dependency vite-pwa with vite-plugin-pwa to resolve virtual:pwa-register and vite-plugin-pwa type declaration errors

## [2.12.115] - 2026-11-19
### Fixed
- **Dependencies**: Updated @testing-library/user-event to ^14.6.13 and vite-pwa to ^1.0.2
- **Tests**: Fixed userEvent import in tests/uiChanges.test.tsx to use named export

## [2.12.114] - 2026-11-19
### Fixed
- **Tests**: Verified all 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors
- **Git**: Repository state verified and ready for version bump

## [2.12.113] - 2026-11-18
### Fixed
- **Tests**: Verified all 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors
- **Git**: Repository state verified and ready for version bump

## [2.12.113] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles

## [2.12.112] - 2026-11-18
### Fixed
- **ESLint**: Fixed unused 'lang' parameter in tests/e2e/i18n.spec.ts waitForFunction callback

## [2.12.111] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles