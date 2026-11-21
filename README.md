# FoodMapper

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
- **Calculator**: Added optional chaining (?.) to prevent useEffect crashes on undefined lengths
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