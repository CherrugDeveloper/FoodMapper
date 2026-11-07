# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.34] - 2026-11-07

### Fixed

- Fixed water percentage capping in Diary.tsx - removed arbitrary `Math.min(100, ...)` capping that prevented displaying values over 100%.
- Fixed day navigator click-outside-to-close behavior for the Day Notes & Reminder modal backdrop in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx).

## [2.12.33] - 2026-11-07

### Fixed

- Fixed InfoPopup initial rendering with double requestAnimationFrame pattern to eliminate position jitter.
- Fixed navigation race conditions in routing and tab switching.

## [2.12.32] - 2026-11-07

### Added

- Added quick preset buttons (birthdays, cycle, medical visits, blood tests, travel) to Day Notes & Reminder modal in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx).
- Added visual phase progress bar with percentage-based width in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx).
- Added day completion action handler (`completeDay`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).
- Added direct navigation for recipes (`/recipes`) and shopping list (`/shopping`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).
- Added direct navigation for recipes (`/recipes`) and shopping list (`/shopping`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).

### Changed

- Improved InfoPopup positioning stability using double requestAnimationFrame to eliminate layout jitter in [`src/components/InfoPopup.tsx`](src/components/InfoPopup.tsx).
- Updated shopping list button translation key and German translation support in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx) and locale files.
- Resized and repositioned MealCard action buttons (confirm, view recipe, edit portions) for optimal mobile and desktop UX in [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx).

### Fixed

- Fixed grayed-out day click in calendar view to automatically switch calendar view to that month in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx).
- Fixed raw translation strings in `DaySummary.tsx` and quick summary targets in `Diary.tsx`.

## [2.12.31] - 2026-11-07

### Fixed

- Restored `totalPhaseDays` definition in PhaseProgress.tsx for TypeScript compilation success.

### Changed

- Updated CHANGELOG.md following Keep a Changelog 1.1.0 conventions.
- Generated README.md using documentation patterns from project architecture.
- Bumped version in package.json to 2.12.31.

## [2.12.30] - 2026-11-07

### Added

- Added scientific safe caffeine limit and equivalent counter (EFSA guidelines) in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:569).
- Added i18n translation keys for meal count warnings and labels in [`public/locales/en/translation.json`](public/locales/en/translation.json:1) and [`public/locales/it/translation.json`](public/locales/it/translation.json:1).

### Changed

- Migrated hardcoded Italian toast messages and select options in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:82) to fully localized i18n keys.
- Enhanced [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:48) and [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) with robust test coverage and build verification.
- Bumped version in [`package.json`](package.json:3) to 2.12.30.

## [2.12.29] - 2026-11-07

### Added

- Implemented robust meal confirmation handler (`confirmMeal`) and portion-scaled updates in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts) and [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx:177).
- Added direct navigation for recipes (`/recipes`) and shopping list (`/shopping`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).

## [2.12.28] - 2026-11-07

### Added

- PWA headless mode and enhanced PhaseProgress v2.12.27 support.

### Changed

- Refactored DayNavigator colors, weekend styling, and reminders.
- Refactored DayNavigator with strict month grey-out, phase background tinting, independent weekend styling, and saint/moon phase enrichment.
- Removed redundant changelog entry for version 2.12.26 (was a duplicate).

## [2.12.27] - 2026-11-07

### Added

- Implemented local storage-backed day notes, calendar events, and browser notification reminders with interactive modal editor in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Configured PWA manifest in [`public/manifest.json`](public/manifest.json:1) for headless / window-controls-overlay window mode.

### Changed

- Overhauled color contrast across phases and applied uniform rose weekend styling for both Saturday and Sunday in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Optimized [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) with React `memo` and instant date synchronization to eliminate day selection lag and double selection glitches.
- Fixed [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1) to correctly render phase progress bars, names, and accurate day counts.

## [2.12.21] - 2026-11-07

### Fixed

- Resolved `PhaseProgress` visibility, pre-start states, and build validation.
- Resolved pre-start phase badge, counter interpolation, sluggish selection, and `PhaseProgress` layout.
- Fixed local timezone date parsing, correct today calculation, improve aesthetics and `PhaseProgress` negative day handling.

## [2.12.19] - 2026-11-07

### Added

- Enhanced UI components, `DayNavigator` month navigation, Toast centering, and dynamic `PhaseProgress` duration.
- Added diet meal count translations for German, Spanish, and French locales.

## [2.12.16] - 2026-11-07

### Added

- Released version 2.12.16 with refactored phase progress, toast notification fixes, day counters optimization, and navigation race condition resolution.

## [2.12.15] - 2026-11-07

### Added

- Updated version to v2.12.15 for automated release.

### Changed

- Updated CHANGELOG.md with v2.12.15 entry and version links.
- Updated README.md with v2.12.15 and v2.12.14 release notes.

## [2.12.14] - 2026-11-07

### Fixed

- Resolved tab switching race conditions, toast notifications, and weekend highlighting.
- Fixed navigation reload race condition with early return after successful `navigateTo()`.
- Removed unused fallback parameter to fix lint error.
- Added Toast component import and toast container rendering in NutritionalCalculator.
- Added weekend highlighting in DayNavigator with amber styling and legend.
- Added weekend legend indicator in DayNavigator footer.
- Moved recipe button adjacent to meal confirmation button.
- Changed container layout from `flex flex-wrap` to `flex items-center`.

### Added

- Added holiday highlighting with 🎄 emoji and active week indicators.

## [2.12.12] - 2026-11-07

### Added

- Redesigned DayNavigator with week-per-row layout, expanded meal count selector.
- Expanded DietPlan meal count selector from 3|4 to full 1-7 range.
- Replaced WarningAlert with inline contextual scientific guidance.
- Improved DayNavigator accessibility with larger touch targets.

## [2.12.11] - 2026-11-07

### Added

- Added scientific guidance messages for 1-7 meals per day options.
- New translation keys: `diet_meal_count_1-7`, `diet_meal_count_*_warning/label`.
- Supported informed meal planning decisions based on nutritional science.

## [2.12.10] - 2026-11-07

### Changed

- Optimized performance, fixed phase progress, internationalized day summary, and centered action buttons.
- Rendered PhaseProgress statically and handled pre-start fallback state.

## [2.12.9] - 2026-11-07

### Fixed

- Fixed phaseDay calculation, calendar phase background styling/legend, DayNavigator performance, and PhaseProgress counters.
- Fixed phaseDay calculation, calendar phase background styling and legend, and optimized DayNavigator re-renders.
- Resolved UI performance, pre-start state, i18n, and layout issues.

## [2.12.8] - 2026-11-07

### Added

- Updated version to v2.12.8.

## [2.12.7] - 2026-11-07

### Changed

- Updated version to v2.12.9.

## [2.12.6] - 2026-11-07

### Fixed

- Correct YAML indentation in e2e job.

### Changed

- Updated changelog, README, CI workflow, and version to v2.12.7.

## [2.12.5] - 2026-11-07

### Added

- Added past navigation with 60-day history support.
- Implemented month navigation controls (prev/next month).
- Integrated formatted actual date display into day cards.
- Extended MAX_DAYS_AHEAD to 3650 days for infinite maintenance phase.

### Fixed

- Fixed negative modulo bug in `pickRotating` for proper food rotation.
- Fixed timezone-aware date calculations and day index logic in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:1) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1).
- Fixed phase selection, sluggish selection, and `PhaseProgress` layout.
- Fixed local timezone date parsing and correct today calculation.

### Changed

- Removed date range and day number from week headers.
- Updated `PhaseProgress` to dynamically calculate phase duration.
- Updated CHANGELOG.md and README.md with v2.12.19 details.

## [2.12.2] - 2026-11-07

### Added

- Bumped version to 2.12.5 and updated changelog.

## [2.12.1] - 2026-11-07

### Added

- Updated changelog, README, and version.

## [2.12.0] - 2026-11-07

### Added

- Updated changelog, README, and version.

## [2.11.2] - 2026-11-07

### Added

- Updated changelog, README, CI workflow, and version.

## [2.11.1] - 2026-11-07

### Changed

- Updated version from 2.11.0 to 2.11.1.

### Added

- Updated changelog and README per Keep a Changelog 1.1.0.

## [2.11.0] - 2026-11-07

### Added

- Updated changelog, README, and version.

## [2.10.0] - 2026-11-07

### Added

- Updated changelog, README, and version.

## [2.9.0] - 2026-11-07

### Fixed

- Fixed day index lookups supporting negative day offsets (`-DAYS_IN_PAST`) in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts).
- Resolved unit test assertions and portion calculation scaling in [`tests/useDietPlan.test.ts`](tests/useDietPlan.test.ts).

### Changed

- Updated changelog, README, CI workflow, and version.

## [2.8.0] - 2026-11-07

### Added

- Optimized CI Playwright browser caching and installation.

### Changed

- Updated changelog, README, and version according to Keep a Changelog 1.1.0.