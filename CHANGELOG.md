# Changelog

## [v2.10.0] - 2026-11-03
### Added
- Updated vite-plugin-pwa to v2.0.0
- Updated dependencies and resolved npm deprecation warnings

### Changed
- Updated CI workflow with valid GitHub Actions versions compatible with Node.js 24

## [v2.9.13] - 2026-11-02
### Added
- Added medication reminder functionality with notification scheduling for medication tracking
- Added notification permission handling for medication reminders in `src/hooks/useNotificationPermission.ts`

### Changed
- Refactored medication selection UI to separate reminder system from selection interface
- Updated translation system to support medication reminder feature across all locales (en, it, de, es, fr)

## [v2.9.12] - 2026-11-02
### Fixed
- Fixed missing imports in [`src/components/MedicationSelector.tsx`](src/components/MedicationSelector.tsx:1) causing TypeScript errors: added `detectMedicationsWithBrands` from `medicationWarnings` and `InfoPopup` component

## [v2.9.11] - 2026-11-02
### Fixed
- Fixed unused `setRecognizedMeds` state in [`src/components/MedicationSelector.tsx`](src/components/MedicationSelector.tsx:37) causing ESLint error
- Fixed unused `items` and `totals` destructured variables in [`src/components/ShoppingList.tsx`](src/components/ShoppingList.tsx:44) causing ESLint errors
- Fixed `let` instead of `const` for `value` variable in [`src/hooks/useShoppingList.ts`](src/hooks/useShoppingList.ts:48) per `prefer-const` rule
- Fixed unused `weekGrams` assignment in [`src/hooks/useShoppingList.ts`](src/hooks/useShoppingList.ts:187) causing `no-useless-assignment` error

## [v2.9.10] - 2026-11-02
### Fixed
- Fixed unused `useRef` import in [`src/App.tsx`](src/App.tsx:1) causing ESLint error
- Refactored navigation event listener to module-level registration in [`src/App.tsx`](src/App.tsx:20) for synchronous readiness before any `navigateTo` call
- Added fallback navigation strategy using `window.location.href` in [`src/utils/navigation.ts`](src/utils/navigation.ts:61) when custom event dispatch fails
- Improved `navigateTo` function with comprehensive JSDoc documentation and proper error handling

### Changed
- Updated `navigateTo` signature to accept optional `fallback` parameter for controlling fallback behavior
- Removed duplicate `app-navigation` event listener registration in `AppContent` component, now using module-level listener with `useLayoutEffect` to update navigate ref
- Enhanced navigation reliability on GitHub Pages subpath with proper base path handling

## [v2.9.9] - 2026-11-02
### Added
- Added recipe navigation button in MealCard component linking each meal to its corresponding recipe
- Added meal count selector (3 or 4 meals/day) in DietPlan header with full pipeline support
- Added Italian translations for meal count selector and recipe view button

### Changed
- Updated mealGenerator to support configurable meal counts (3 or 4) with proper calorie/protein distribution
- Refactored useDietPlan hook to pass mealCount through generation pipeline
- Updated DietPlanState.userPreferences.mealCount type from number to 3 | 4 for type safety
- Fixed TypeScript build errors in useDietPlan.ts with proper mealCount type casting

## [v2.9.8] - 2026-11-02
### Added
- Added holiday detection and week indicator in DayNavigator component for diet plan navigation
- Added weekday names and holiday markers (🎄) for Italian holidays in day navigation buttons

### Changed
- Improved DayNavigator day button display to show weekday names instead of short month/day format
- Added week counter showing "Settimana X di Y" (Week X of Y) in diet plan navigation

## [v2.9.7] - 2026-11-02
### Changed
- Refactored tab navigation in DietPlan, ShoppingList, SleepDashboard, and WorkoutPlan components to use react-router-dom `useNavigate` instead of AppContext `setActiveTab`, enabling direct URL-based navigation.

## [v2.9.6] - 2026-11-01
### Added
- Added test suite in [`tests/breakfastRealism.test.ts`](tests/breakfastRealism.test.ts:1) to verify breakfast food pool constraints and realistic meal combinations.

### Changed
- Refactored breakfast meal generation in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:60) with dedicated breakfast protein and fat pools.

## [v2.9.5] - 2026-10-29
### Added
- Updated [`README.md`](README.md:1) to comprehensively document latest architectural patterns, [`useFoodSearch`](src/hooks/useFoodSearch.ts:1), [`useNotificationPermission`](src/hooks/useNotificationPermission.ts:1), [`storage.ts`](src/utils/storage.ts:1), [`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1), tab switching fixes, and CI pipeline fixes.

## [v2.9.4] - 2026-10-29
### Fixed
- Fixed tab navigation switching and active state matching in [`src/App.tsx`](src/App.tsx:86) and [`src/utils/navigation.ts`](src/utils/navigation.ts:23).
- Made scrollbars invisible across modern browsers while preserving scrolling capability in [`src/App.css`](src/App.css:164) and [`src/index.css`](src/index.css:40).

## [v2.9.3] - 2026-10-29
### Fixed
- Fixed TypeScript `TS2591` compile issue in [`src/context/AppContext.tsx`](src/context/AppContext.tsx:73) by migrating from `process.env.NODE_ENV` to Vite's `import.meta.env.MODE`.
- Improved inline alignment of the tooltip container in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:145) with `self-center`.
- Cleaned up duplicate React package declarations in [`package.json`](package.json:21).

### Changed
- Bumped `actions/upload-pages-artifact` to `@v4` in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:241) to suppress Node 20 deprecation warnings.
- Cleaned up obsolete plan documents and root screenshot artifacts.

## [v2.9.2] - 2026-10-28
### Fixed
- Bumped `actions/upload-pages-artifact` from `@v3` to `@v4` in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:241) to eliminate Node.js 20 deprecation warnings on GitHub Actions runners.

## [v2.9.1] - 2026-10-28
### Changed
- Redesigned [`InfoPopup`](src/components/InfoPopup.tsx) from fullscreen modal to inline tooltip positioned near the trigger button.
- Fixed info button icon stretching in [`InfoPopup`](src/components/InfoPopup.tsx).
- Popup now shows/hides immediately on mouse hover (removed delayed logic).

## [v2.9.0] - 2026-10-28
### Fixed
- Restored hover delay mechanism for InfoPopup component in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx) to prevent instant popup close when moving mouse from button to popup area (250ms delay with isHoveringRef tracking).

## [v2.8.9] - 2026-10-19
### Added
- Added detailed debug logging for storage initialization in [`src/context/AppContext.tsx`](src/context/AppContext.tsx:16) and i18n resource loading in [`src/main.tsx`](src/main.tsx:47).

### Changed
- Cleaned up obsolete utility scripts like [`scripts/auto-git.sh`](scripts/auto-git.sh:1).

## [v2.8.8] - 2026-10-19
### Fixed
- Fixed GitHub Pages CI/CD workflow execution and artifact deployment by stabilizing GitHub Action versions and correcting deployment job conditional in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:210).

## [v2.8.7] - 2026-10-19
### Fixed
- Fixed 404 translation fetch errors on GitHub Pages subpath by dynamically prepending `getBasePath()` to i18next backend `loadPath` in [`src/i18n.ts`](src/i18n.ts:32).

## [v2.8.6] - 2026-10-19
### Fixed
- Fixed bug where on startup the site only showed tab buttons and rendered nothing else until page refresh by synchronously initializing `isAppUnlocked` from `disclaimerStorage.get()` in [`src/App.tsx`](src/App.tsx:75).

## [v2.8.5] - 2026-10-19
### Fixed
- Fixed critical startup crash and E2E test failures caused by `AppContent` calling `useAppContext()` outside of `AppProvider` in [`src/App.tsx`](src/App.tsx:67).

## [v2.8.4] - 2026-10-19
### Fixed
- Fixed E2E test failures by adding `role="dialog"` to the loading fallback container in [`src/components/MedicalDisclaimer.tsx`](src/components/MedicalDisclaimer.tsx:30) and clearing `DISCLAIMER_SEED_LATCH` in [`tests/e2e/auth.spec.ts`](tests/e2e/auth.spec.ts:16) `beforeEach` hook.

## [v2.8.3] - 2026-10-18
### Fixed
- Fixed tab navigation in [`src/App.tsx`](src/App.tsx:1) and [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) to use [`navigateTo()`](src/utils/navigation.ts:29) utility from [`src/utils/navigation.ts`](src/utils/navigation.ts:1) instead of `useAppContext`, ensuring correct base path support (`/FoodMapper`) on GitHub Pages.
- Fixed tab navigation (`handleSetActiveTab`) in [`src/context/AppContext.tsx`](src/context/AppContext.tsx:58) to use [`navigateTo()`](src/utils/navigation.ts:29) from [`src/utils/navigation.ts`](src/utils/navigation.ts:1), ensuring correct base path support (`/FoodMapper`) on GitHub Pages.

## [v2.8.2] - 2026-10-18
### Fixed
- Fixed 404 Not Found error and routing issues on page reload and direct visits for GitHub Pages SPA sub-routes via query parameter fallback in [`public/404.html`](public/404.html:1), [`public/.nojekyll`](public/.nojekyll:1), and history state restoration in [`src/App.tsx`](src/App.tsx:1).

## [v2.8.1] - 2026-10-18
### Fixed
- Fixed UI freeze and navigation lockup when clicking action buttons (like "vai a dieta") in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx) and context.
- Fixed 404 Not Found error on page reload for SPA routes via robust query parameter routing fallback in [`public/404.html`](public/404.html), history state restoration in [`src/App.tsx`](src/App.tsx), and Netlify/Vercel rewrite configurations (`_redirects` / `vercel.json`).

## [v2.8.0] - 2026-10-16
### Changed
- Updated GitHub Actions CI workflow to deploy to GitHub Pages on push to `main` branch.
- Renamed `deploy-preview` job to `deploy` in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- Updated `homepage` URL in [`package.json`](package.json) to match the new repository `CherrugDeveloper/FoodMapper`.

## [v2.7.9] - 2026-10-15
### Added
- Restored [`check_keys.cjs`](check_keys.cjs) at the repository root to ensure robust translation key verification across all locales.

### Fixed
- Resolved `MODULE_NOT_FOUND` error when executing localization checks in CI pipelines.

### Improvements
- Enhanced translation key validation script to audit missing or extra translation keys automatically.

## [v2.7.8] - 2026-10-15
### Improved
- Cleaned up redundant deployment workflows and optimized CI workflow concurrency, caching, and artifact uploads in [`ci.yml`](.github/workflows/ci.yml).

## [v2.7.7] - 2026-10-15
### Fixed
- Fixed GitHub Pages deployment accessibility by adding the missing [`actions/configure-pages@v5`](.github/workflows/Deploy.yml) setup step in [`Deploy.yml`](.github/workflows/Deploy.yml).

## [v2.7.6] - 2026-10-15
### Added
- Added runtime schema validation for localStorage storage utilities in `src/utils/storage.ts`.

### Fixed
- Verified zero errors/warnings on ESLint and TypeScript checks, and all unit tests passed successfully.

## [v2.7.5] - 2026-10-14
### Fixed
- Fixed Playwright E2E mobile viewport selector failure for the Diary button in `tests/e2e/diary.spec.ts` by robustly checking element visibility and falling back to the mobile icon selector.

## [v2.7.4] - 2026-10-14
### Added
- Implemented robust mobile navigation and viewport visibility checks across E2E test suite.

## [v2.7.3] - 2026-10-14
### Fixed
- Fixed locale and translation keys for robust multilingual support across English, Italian, German, Spanish, and French.

## [v2.7.2] - 2026-10-14
### Added
- Added comprehensive E2E test coverage for navigation, diet plan generation, and i18n localization.

## [v2.7.1] - 2026-10-14
### Added
- Implemented memoization in nutritional calculation pipeline and bilingual food search hooks.
- Added comprehensive notification permission handling and disclaimer validation logic.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
