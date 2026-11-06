# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepchangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v2.12.18] - 2026-11-06

### Added
- Centered toast notifications horizontally and text within in [`src/components/Toast.tsx`](src/components/Toast.tsx)
- Cleaned up raw strings in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx) with proper i18n translation keys
- Redesigned [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) to remove date ranges and day numbers from week headers, integrate formatted actual dates into day cards, and add month navigation controls
- Updated [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx) to dynamically calculate phase total duration (`PHASE_TOTAL_DAYS`) instead of hardcoded 7 days

## [v2.12.17] - 2026-11-06

### Added
- Added comprehensive diet meal count translations for German (`public/locales/de/translation.json`), Spanish (`public/locales/es/translation.json`), and French (`public/locales/fr/translation.json`) locales with scientific guidance messages for 1-7 meals per day options

## [v2.12.16] - 2026-11-06

### Added
- Rewrote info popup component in `src/components/dietPlan/PhaseProgress.tsx` with enhanced styling and robust i18n support
- Verified and optimized day counters across `src/components/dietPlan/PhaseProgress.tsx` and `src/components/DayNavigator.tsx`
- Ensured uniform size and styling for toast notifications in `src/components/Toast.tsx` and `src/hooks/useToast.ts`

### Fixed
- Fixed raw and untranslated string displays in `src/components/DietPlan.tsx`
- Fixed meal confirmation and day completion buttons in `src/components/dietPlan/MealCard.tsx` and `src/components/DietPlan.tsx`
- Resolved tab switching and navigation race conditions in `src/utils/navigation.ts` and `src/components/DietPlan.tsx`

## [v2.12.15] - 2026-11-06

### Patch Release
- Updated version to v2.12.15 for automated release
- No functional changes from v2.12.14

## [v2.12.14] - 2026-11-06

### Added
- Implemented meal count selector preference in `src/components/NutritionalCalculator.tsx` identical to DietPlan's meal count selector for consistent user preference synchronization
- Added comprehensive TypeScript type for `mealCount?: number` in `src/utils/nutritionEngine.ts` UserData interface
- Added toast notification warning feedback for low meal counts (1-2 meals) in NutritionalCalculator

### Fixed
- Fixed tab switching race conditions in `src/utils/navigation.ts` with 100ms throttling guard and resilient event dispatching
- Added navigation timestamp tracking (`lastNavTime`, `lastNavPath`) to prevent rapid-click navigation conflicts

## [v2.12.13] - 2026-11-06

### Changed
- Reorganized diet plan duration to 28 days (4 full weeks) in useDietPlan to ensure zero partial rows in DayNavigator
- Prominently highlighted holidays in DayNavigator with distinct red styling, 🎄 FESTIVO badge, and tooltips
- Removed redundant date picker input from DayNavigator for cleaner UI and streamlined navigation

### Fixed
- Moved recipe button from header to adjacent to meal confirmation button in `src/components/dietPlan/MealCard.tsx` for better ergonomics

## [v2.12.12] - 2026-11-06

### Changed
- Redesigned DayNavigator with week-per-row layout for better visual organization, featuring holiday highlighting with 🎄 emoji and active week indicators
- Expanded DietPlan meal count selector from 3|4 options to full 1-7 range for flexible meal planning
- Replaced WarningAlert component with inline contextual scientific guidance for meal count selections
- Improved DayNavigator accessibility with larger touch targets and grid-based responsive layout

## [v2.12.11] - 2026-11-06

### Changed
- Bumped version to v2.12.11 for automated release
- Regenerated CHANGELOG.md and README.md with updated documentation

## [v2.12.10] - 2026-11-06

### Changed
- Executed automated DevOps release and repository maintenance workflow
- Wrapped debug calorie test code in Vitest describe/it block structure for proper test organization

## [v2.12.9] - 2026-11-06

### Changed
- Updated `@playwright/test` to v1.64.1 and `playwright` to v1.64.1
- Added CI retries logic with `retries: process.env.CI ? 2 : 0` for E2E tests
- Increased action timeout from 12s to 15s and navigation timeout from 25s to 30s in Playwright config
- Increased Playwright test total timeout from 45s to 60s
- Deleted stale temporary files: `public/locales/en/translation.json.backup`

## [v2.12.8] - 2026-11-06

### Changed
- Optimized Playwright CI workflow to use container-based runner configuration
- Fixed CI workflow shard and result paths in `.github/workflows/ci.yml`

## [v2.12.7] - 2026-11-06

### Fixed
- Fixed InfoPopup PWA portable positioning with fixed coords and improved allergen button contrast in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:1)
- Updated `FodmapDetailsProps` to accept string | null for foodId in [`src/components/FodmapDetails.tsx`](src/components/FodmapDetails.tsx:1)

## [v2.12.6] - 2026-11-05

### Added
- Added `Header` component import and rendering in [`src/App.tsx`](src/App.tsx:3) for clearer app interface
- Added `data-testid="medical-disclaimer-dialog"` attribute to MedicalDisclaimer component for E2E test selection in [`src/components/MedicalDisclaimer.tsx`](src/components/MedicalDisclaimer.tsx:11)

### Changed
- Updated `disclaimerModal` locator in E2E fixtures to use `[data-testid="medical-disclaimer-dialog"]` selector instead of `getByRole('dialog')` for more reliable modal selection in [`tests/e2e/fixtures.ts`](tests/e2e/fixtures.ts:166)

## [v2.12.5] - 2026-11-05

### Fixed
- Fixed disclaimer acceptance race condition and modal re-attachment under CI load in [`tests/e2e/fixtures.ts`](tests/e2e/fixtures.ts:288) by re-fetching button on each retry attempt and using force click
- Added debug logging to `acceptDisclaimer` function in [`tests/e2e/fixtures.ts`](tests/e2e/fixtures.ts:289) for better E2E test debugging

## [v2.12.4] - 2026-11-05

### Fixed
- Fixed `prefer-const` lint error in InfoPopup component

## [v2.12.3] - 2026-11-05

### Fixed
- Fixed PWA translation caching on portable devices by adding cache-busting query parameter `?v=2` to translation URLs in [`src/i18n.ts`](src/i18n.ts:44)
- Fixed InfoPopup touch/click handling on mobile devices using ref-based touch state tracking to prevent synthetic click double-toggle in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:1)
- Reduced PWA Workbox cache duration for translations from 30 days to 7 days in [`vite.config.ts`](vite.config.ts:88)
- Added `TRANSLATION_VERSION` constant for cache busting in [`src/i18n.ts`](src/i18n.ts:31)

## [v2.12.2] - 2026-11-05

### Fixed
- Fixed Italian translation typo "Aviso AI" to "Avviso AI" in [`public/locales/it/translation.json`](public/locales/it/translation.json:9)
- Fixed recipe button text in MealCard component to use new translation key in [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx:106)
- Added missing translation keys for week navigation and estimated cost across all locales (en, it, de, es, fr) in [`public/locales/*/translation.json`](public/locales/)
- Fixed E2E test assertions to match updated UI text in [`tests/e2e/diary.spec.ts`](tests/e2e/diary.spec.ts:47) and [`tests/e2e/navigation.spec.ts`](tests/e2e/navigation.spec.ts:17)

## [v2.12.1] - 2026-11-05

### Fixed
- Fixed build configuration to enable sourcemap generation for production builds

## [v2.12.0] - 2026-11-05

### Added
- Redesigned InfoPopup with comprehensive touch device support (long press, quick tap detection, touch move cancellation) in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx:1)
- Added Italian translations for workout preferences and focus areas in [`public/locales/it/translation.json`](public/locales/it/translation.json:1)
- Added `defaultValue` fallbacks for workout translation keys in [`src/components/WorkoutPlan.tsx`](src/components/WorkoutPlan.tsx:1)
- Added memoization to nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1)
- Implemented `useFoodSearch` hook for bilingual food search in [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1)
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts:1)
- Created comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1)

### Changed
- Optimized CI workflow to use `libasound2t64` instead of `libasound2` for Ubuntu 24.04 compatibility in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)

## [v2.11.3] - 2026-11-05

### Chore
- Fixed CI workflow shard configuration and Playwright test result paths in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)
- Fixed CI workflow to use `libasound2t64` instead of `libasound2` for Ubuntu 24.04 compatibility in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)
- Updated Playwright container image version to v1.64.1-noble
- Updated CHANGELOG, README, and version

## [v2.11.2] - 2026-11-05

### Chore
- Fixed CI workflow shard configuration and Playwright test result paths in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)
- Updated CHANGELOG, README, and version to v2.11.2

## [v2.11.1] - 2026-11-05

### Added
- Completed German translation file with all 1425+ keys matching English structure
- Completed Italian translation file with all 1425+ keys matching English structure

## [v2.11.0] - 2026-11-05

### Fixed
- Resolved InfoPopup touch handling on iOS, updated i18n translation structure, and fixed Diary responsive horizontal cutting
- Added missing medication_recognition_button translation keys
- Removed unused setHorizontalShift reference

### Security
- Addressed npm audit warnings and install script security considerations

## [v2.10.4] - 2026-11-05

### Fixed
- Corrected Spanish and French i18n translations for diet view and recipe components

## [v2.10.3] - 2026-11-05

### Fixed
- Updated CI workflow with valid GitHub Actions versions compatible with Node.js 24
- Suppressed Playwright deprecation warnings in CI workflow

## [v1.1.0] - 2026-11-05

### Added
- Added Playwright browser caching via actions/cache@v5.1.0 with restore-keys fallback for faster CI builds, cached browsers located at `~/.cache/ms-playwright` with cache key including playwright version and config hash in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:180)
- Set E2E job timeout-minutes to 45 to accommodate multi-shard Playwright test execution in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:144)
- Updated CI/CD workflow with valid GitHub Actions versions compatible with Node.js 24 and suppressed deprecation warnings

[Unreleased]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.16...HEAD
[v2.12.17]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.16...v2.12.17
[v2.12.16]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.15...v2.12.16
[v2.12.15]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.14...v2.12.15
[v2.12.14]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.13...v2.12.14
[v2.12.13]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.12...v2.12.13
[v2.12.12]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.11...v2.12.12
[v2.12.11]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.10...v2.12.11
[v2.12.10]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.9...v2.12.10
[v2.12.9]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.8...v2.12.9
[v2.12.8]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.7...v2.12.8
[v2.12.7]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.6...v2.12.7
[v2.12.6]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.5...v2.12.6
[v2.12.5]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.4...v2.12.5
[v2.12.4]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.3...v2.12.4
[v2.12.3]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.2...v2.12.3
[v2.12.2]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.1...v2.12.2
[v2.12.1]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.0...v2.12.1
[v2.12.0]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.11.3...v2.12.0
[v2.11.3]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.11.2...v2.11.3
