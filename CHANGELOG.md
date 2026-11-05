# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepchangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v2.12.1] - 2026-11-05

### Fix
- Fixed build configuration to enable sourcemap generation for production builds

## [v2.12.0] - 2026-11-05

### Feat
- Redesigned InfoPopup with comprehensive touch device support (long press, quick tap detection, touch move cancellation) in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:1)
- Added Italian translations for workout preferences and focus areas in [`public/locales/it/translation.json`](public/locales/it/translation.json:1)
- Added `defaultValue` fallbacks for workout translation keys in [`src/components/WorkoutPlan.tsx`](src/components/WorkoutPlan.tsx:1)

### Fix
- Fixed exercise GIF URLs in [`src/utils/exerciseGifHelpers.ts`](src/utils/exerciseGifHelpers.ts:1) replacing placeholder URLs with real Giphy URLs
- Fixed CI workflow to use `libasound2t64` instead of `libasound2` for Ubuntu 24.04 compatibility in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)

## [v2.11.3] - 2026-11-05

### Chore
- Fix CI workflow shard and result paths in [`github/workflows/ci.yml`](.github/workflows/ci.yml:1)
- Fix CI workflow to use `libasound2t64` instead of `libasound2` for Ubuntu 24.04 compatibility in [`github/workflows/ci.yml`](.github/workflows/ci.yml:1)
- Update CHANGELOG, README, and version

## [v2.11.2] - 2026-11-05

### Chore
- Fixed CI workflow shard configuration and Playwright test result paths in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:208)

### Fixed
- Fixed GitHub Actions workflow to use `actions/upload-artifact@v7.0.2` instead of deprecated `@v4.6.2` for better compatibility with Node.js 24
- Added `continue-on-error: true` to artifact upload steps for improved workflow resilience

## [v2.11.1] - 2026-11-04

### Fixed
- Fixed E2E test assertions to match updated Italian UI text: "Diario di oggi" instead of "Diario quotidiano", "Come ti senti" instead of "Sintomi", "Note libere" instead of "Note" in [`tests/e2e/diary.spec.ts`](tests/e2e/diary.spec.ts:47) and [`tests/e2e/navigation.spec.ts`](tests/e2e/navigation.spec.ts:17)
- Fixed workout plan tab navigation test text: "💪 Il tuo piano allenamento" in [`tests/e2e/navigation.spec.ts`](tests/e2e/navigation.spec.ts:38)

### Changed
- Updated CI workflow to remove obsolete `PLAYWRIGHT_BROWSERS_PATH` environment variable
- Added `PLAYWRIGHT_SKIP_BUILD: '1'` environment variable to E2E test jobs for faster test execution

## [v2.11.0] - 2026-11-04

### Added
- **Auto-git** workflow execution: automated git commit-and-push with repository cleanup, CHANGELOG.md repair, documentation updates, and history optimization
- Removed corrupted CHANGELOG.md merge conflict markers and duplicate v2.10.0 entries
- Created clean changelog structure with proper version ordering

## [v2.10.1] - 2026-11-03

### Added
- Auto-git workflow execution: repository cleanup, CHANGELOG update, conventional commit, git history optimization, and sync/push to remote

## [v2.10.0] - 2026-11-03

### Added
- Updated vite-plugin-pwa to v2.0.0
- Updated dependencies and resolved npm deprecation warnings

### Changed
- Updated CI workflow with valid GitHub Actions versions compatible with Node.js 24

## [v2.9.13] - 2026-11-02

### Added
- Added medication reminder functionality with notification scheduling for medication tracking
- Added notification permission handling for medication reminders in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1)

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
- Added holiday detection and week indicator in DayNavigator component with proper date formatting

## [v2.9.7] - 2026-11-02

### Fixed
- Redesigned InfoPopup as inline tooltip with immediate hover show/hide, added `z-index` to prevent overlay issues in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:1)
- Fixed hover delay restoration for InfoPopup to prevent instant close on mouse leave
- Resolved AppContext TypeScript error and refined InfoPopup alignment in [`src/App.tsx`](src/App.tsx:1)

## [v2.9.6] - 2026-11-02

### Changed
- Simplified app branding and header UI for cleaner interface

## [v2.9.5] - 2026-11-02

### Fixed
- Resolved tab switching navigation and hide scrollbars in [`src/App.tsx`](src/App.tsx:1)

## [v2.9.4] - 2026-11-02

### Fixed
- Fixed useRef import and unused i18n variable in food search

## [v2.9.3] - 2026-11-02

### Changed
- Improved navigation reliability and tab state persistence

## [v2.9.2] - 2026-11-02

### Fixed
- Fixed infinite loops and re-render issues in AppContext and useSleepTracking

## [v2.9.1] - 2026-11-02

### Changed
- Updated README.md with latest architecture documentation

## [v2.9.0] - 2026-10-19

### Added
- Added InfoPopup tooltip redesign and hover behavior improvements

## [v2.8.9] - 2026-10-19

### Fixed
- Fixed InfoPopup hover delay regression

## [v2.8.8] - 2026-10-19

### Changed
- Updated CHANGELOG.md with InfoPopup hover fix, added debug logging to AppContext and main, cleaned up obsolete auto-git script

## [v2.8.7] - 2026-10-19

### Fixed
- Fixed GitHub Pages CI/CD workflow execution and artifact deployment by stabilizing GitHub Action versions and correcting deployment job conditional in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:210).

## [v2.8.6] - 2026-10-19

### Fixed
- Fixed 404 translation fetch errors on GitHub Pages subpath by dynamically prepending `getBasePath()` to i18next backend `loadPath` in [`src/i18n.ts`](src/i18n.ts:32).

## [v2.8.5] - 2026-10-19

### Fixed
- Fixed TypeScript errors in useFoodSearch hook

## [v2.8.4] - 2026-10-19

### Fixed
- Fixed AppContext infinite loop and improved sleep tracking stability

## [v2.8.3] - 2026-10-19

### Fixed
- Fixed medical disclaimer role and session latch issues in [`src/context/AppContext.tsx`](src/context/AppContext.tsx:1)
- Bumped version to 2.8.3

## [v2.8.2] - 2026-10-19

### Added
- Added comprehensive changelog system with localization support

## [v2.8.1] - 2026-10-19

### Fixed
- Fixed workout plan component rendering issues

## [v2.8.0] - 2026-10-19

### Added
- Added workout plan generation and tracking features
- Added sleep tracking and sleep sounds functionality

## [v2.7.0] - 2026-10-15

### Added
- Added recipe management and meal planning features

## [v2.6.0] - 2026-10-10

### Added
- Added medication tracking functionality

## [v2.5.0] - 2026-10-05

### Added
- Initial public release with core features
