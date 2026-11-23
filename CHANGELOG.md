## [2.12.135] - 2026-11-23

### Fixed
- **foodsData**: Renamed food id '35' from "Tofu sodo (tipo firm/extra-firm)" to "Tofu" in all 5 languages (it, en, es, fr, de)
- **i18n**: Added `back_to_diet` and `back_to_list` translation keys in all 5 languages
- **i18n**: Added `diet_phase3_label` translation key in all 5 languages
- **DietPlan**: `formatAmount` now shows whole units for uova, noci, patate, banane, lamponi, tofu, tempeh instead of rounded decimals
- **RecipeDetail**: Added "Back to diet" button alongside "Back to recipes" for easier navigation
- **MealCard**: Improved `findMatchingRecipe` with ingredient overlap scoring; removed rounding from unit/gram display
- **PhaseProgress**: Phase 3 now shows "Fase 3 - Personalizzazione" label and "+X giorni dall'inizio fase 3" badge; pre-start days show negative day count

## [2.12.134] - 2026-11-23

### Fixed
- **PhaseProgress**: Fixed pre-start badge to show only day number (removed redundant "giorni dall'inizio fase 0" text)
- **PhaseProgress**: Added phase 3 personalization days display showing "Giorni personalizzazione X" instead of "/∞"
- **mealGenerator**: Updated unit mappings:
  - Tempeh (id '57'): changed from unitGrams 150 to 100 (panetti)
  - Banana (id '29'): changed from unitGrams 100 to 120 (conteggi)
  - Pomodori (id '22'): added with unitGrams 150 (conteggi)
  - Patate (id '24'): added with unitGrams 180 (conteggi)
- **mealGenerator**: Fixed undefined variable `maxFatFromCalories` - replaced with inline calculation `mealKcal * 0.35 / 9`
- **i18n**: Added `diet_phase_personalization_days` translation key in all 5 languages (it, en, es, fr, de)
- **mealGenerator**: Added Lamponi (id '53') and Arance (id '15') to whole units support

## [2.12.133] - 2026-11-22

### Fixed
- **CI/CD**: Fixed invalid GitHub Actions versions (`@v6` → `@v4`/`@v5`) and added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var for Node.js 24 compatibility in CI pipeline
- **PhaseProgress**: Fixed duplicate "Pre-inizio" text when selecting days before phase 0
- **FoodsData**: Fixed egg naming from "Uova (2 medie ~100g)" to "Uova"
- **FoodsData**: Fixed Avena naming from "Avena in fiocchi (da cuocere per porridge)" to "Avena in fiocchi"
- **MealGenerator**: Added banana quantization to whole units (~100g each)

## [2.12.131] - 2026-11-22

### Fixed
- **Meal Generator**: Fixed protein normalization to properly scale calories when protein target is exceeded - uses results.proteins target instead of hardcoded 100g, and scales carbs/fats proportionally to remaining calories

### Changed
- **Meal Generator**: Updated normalization logic to use results.proteins target and proportional macro scaling instead of uniform proteinScale

## [2.12.130]

### Fixed
- **PhaseProgress**: Fixed duplicate infopopup text when selecting days before phase 0 by using `useMemo` for `preStartBadgeLabel`
- **Meal Generator**: Fixed variable redeclaration conflicts (`proteinWhole`/`finalProteinGrams` → `proteinWholeUnits`/`finalProteinGrams2`)

## [2.12.129]

### Fixed
- **Types**: Fixed malformed `DayPlan` interface structure in `src/types/dietPlan.ts` - previously had duplicated/missing fields that broke TypeScript type checking
- **CI/CD**: Fixed GitHub Actions deployment errors - removed deprecated `--no-deprecation` NODE_OPTIONS flag and added explicit `artifact-name: github-pages` to resolve "No artifacts named 'github-pages' were found" error
- **CI/CD**: Added debug logging for dist directory verification in pages deployment job

## [2.12.128]

### Fixed
- **Meal Generator**: Fixed critical bug where dietary fats were incorrectly calculated using fiber values instead of actual fat values (line 575: changed `fats: p.nutrition.fiber` to `fats: p.nutrition.fat`). This bug caused incorrect macronutrient calculations and meal planning.
- **Meal Generator**: Removed Patates (ID '24') from `SNACK_CARB_POOL` (was `lunch_dinner`-only) — no more potatoes + yogurt in morning snacks
- **Meal Generator**: Removed Uova e Carne fresca (ID '13') and Parmigiano (ID '12') from `SNACK_PROTEIN_POOL` — no more rice + parmesan in afternoon snacks
- **Foods Data**: Clarified food names (avena da cuocere, uova 2 medie ~100g, tofu firm/extra-firm, parmigiano grattugiato, yogurt greco senza lattosio)

## [2.12.127]

### Fixed
- **AppContext**: Fixed diet plan not regenerating when pressing "Calcola fabbisogno strutturale" — removed redundant `useMemo` wrapper around `useDietPlan` that blocked state updates from `regenerateDays`
- **Meal Generator**: Removed Patates (ID '24') from `SNACK_CARB_POOL` (was `lunch_dinner`-only) — no more potatoes + yogurt in morning snacks
- **Meal Generator**: Removed Uova e Carne fresca (ID '13') and Parmigiano (ID '12') from `SNACK_PROTEIN_POOL` — no more rice + parmesan in afternoon snacks
- **Foods Data**: Clarified food names (avena da cuocere, uova 2 medie ~100g, tofu firm/extra-firm, parmigiano grattugiato, yogurt greco senza lattosio)

## [2.12.126]

### Fixed
- **Foods Data**: Added Ricotta vaccina (ID '92') to food database with 11g protein/100g, suitable for breakfast, snack, and lunch_dinner
- **Meal Generator**: Added Ricotta (ID '92') to SNACK_PROTEIN_POOL for improved protein variety in snacks

## [2.12.124]

### Fixed
- **ESLint**: Fixed linting warnings by removing 7 unused variables in `mealGenerator.ts` and `breakfastRealism.test.ts`
  - Removed `BREAKFAST_PROTEIN_POOL`, `BREAKFAST_FAT_POOL`, `BREAKFAST_CARB_POOL` unused constants
  - Removed `getFilteredSortedPool`, `getSustainablePool`, `poolToRoleType`, `POOLS_OPTIMIZED` unused functions
  - Removed `NEW_FOODS_NOT_FOR_BREAKFAST` unused test array

## [2.12.123]

### Fixed
- **Foods Data**: Fixed breakfast realism by adding 'breakfast' to Olive (ID 72) mealSuitability, ensuring breakfast meals properly filter using mealSuitability field to allow olives as a breakfast fat option

## [2.12.121]

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by adding explicit `needs: [build, e2e]` dependency to deploy job and `if-no-files-found: error` to artifact download steps
- **React Hooks**: Fixed critical crash caused by calling `useDietPlan` hook inside `useMemo` - violated React Rules of Hooks causing infinite re-render loop
- **i18n**: Added `i18n.isInitialized` guard in `src/main.tsx` to prevent race condition where 'initialized' event was already emitted before listener was attached
- **MedicationSelector**: Added null-safety guards for `.length` accesses to prevent "Cannot read properties of undefined (reading 'length')" crash
- **E2E Tests**: Added missing `calculateButton.click()` in `verifyCalculatorResults()` test helper function
- **E2E Tests**: Fixed Italian translations in test expectations - corrected `report_proteins` to "Proteine", `report_fats` to "Grassi", `report_carbs_short` to "Carb"
- **Language Switching**: Implemented proper remount strategy on language change using `languageKey` counter and `language-changed` event dispatch
- **App**: Extracted disclaimer acceptance state to AppContext and added proper language change detection

## [2.12.119]

### Fixed
- **Files**: Added trailing newline to NutritionalCalculator.tsx for Git compliance