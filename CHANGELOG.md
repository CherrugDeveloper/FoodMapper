All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.30] - 2026-11-07

### Added

- Added scientific safe caffeine limit and equivalent counter (EFSA guidelines) in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:569).
- Added i18n translation keys for meal count warnings and labels in [`public/locales/en/translation.json`](public/locales/en/translation.json:1) and [`public/locales/it/translation.json`](public/locales/it/translation.json:1).

### Changed

- Migrated hardcoded Italian toast messages and select options in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:82) to fully localized i18n keys.
- Enhanced [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:48) and [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) with robust test coverage and build verification.
- Bumped version in [`package.json`](package.json:3) to 2.12.30.

## [2.12.29] - 2026-11-07

### Changed

- Updated CHANGELOG.md following Keep a Changelog conventions with proper version headings and ISO-8601 dates
- Generated README.md using documentation patterns from project architecture
- Bumped version in package.json to 2.12.29

## [2.12.28] - 2026-11-07

### Added

- PWA headless mode and enhanced PhaseProgress v2.12.27 support ([`9369f7f`](https://github.com/cherrugdeveloper/FoodMapper/commit/9369f7f)).

### Changed

- Refactored `DayNavigator` colors, weekend styling, and reminders ([`aaa4bee`](https://github.com/cherrugdeveloper/FoodMapper/commit/aaa4bee)).
- Refactored `DayNavigator` with strict month grey-out, phase background tinting, independent weekend styling, and saint/moon phase enrichment ([`69d2220`](https://github.com/cherrugdeveloper/FoodMapper/commit/69d2220)).
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

- Resolved `PhaseProgress` visibility, pre-start states, and build validation ([`058c7fb`](https://github.com/cherrugdeveloper/FoodMapper/commit/058c7fb)).
- Resolved pre-start phase badge, counter interpolation, sluggish selection, and `PhaseProgress` layout ([`8ffa188`](https://github.com/cherrugdeveloper/FoodMapper/commit/8ffa188)).
- Fixed local timezone date parsing, correct today calculation, improve aesthetics and `PhaseProgress` negative day handling ([`b69d7bb`](https://github.com/cherrugdeveloper/FoodMapper/commit/b69d7bb)).

## [2.12.19] - 2026-11-07

### Added

- Enhanced UI components, `DayNavigator` month navigation, Toast centering, and dynamic `PhaseProgress` duration ([`fc45fc3`](https://github.com/cherrugdeveloper/FoodMapper/commit/fc45fc3)).
- Added diet meal count translations for German, Spanish, and French locales ([`896b194`](https://github.com/cherrugdeveloper/FoodMapper/commit/896b194)).

## [2.12.16] - 2026-11-07

### Added

- Released version 2.12.16 with refactored phase progress, toast notification fixes, day counters optimization, and navigation race condition resolution ([`3999fd9`](https://github.com/cherrugdeveloper/FoodMapper/commit/3999fd9)).

## [2.12.15] - 2026-11-07

### Fixed

- Resolved tab switching race conditions, toast notifications, and weekend highlighting ([`c28dbd3`](https://github.com/cherrugdeveloper/FoodMapper/commit/c28dbd3)).

### Changed

- Repositioned recipe button in `MealCard` for better UX ([`cc519ef`](https://github.com/cherrugdeveloper/FoodMapper/commit/cc519ef)).

## [2.12.14] - 2026-11-07

### Added

- Updated version to v2.12.15 for automated release ([`7778573`](https://github.com/cherrugdeveloper/FoodMapper/commit/7778573)).

### Changed

- Updated CHANGELOG.md with v2.12.15 entry and version links ([`7778573`](https://github.com/cherrugdeveloper/FoodMapper/commit/7778573)).
- Updated README.md with v2.12.15 and v2.12.14 release notes ([`7778573`](https://github.com/cherrugdeveloper/FoodMapper/commit/7778573)).

## [2.12.13] - 2026-11-07

### Fixed

- Fixed navigation reload race condition with early return after successful `navigateTo()` ([`c28dbd3`](https://github.com/cherrugdeveloper/FoodMapper/commit/c28dbd3)).
- Removed unused fallback parameter to fix lint error ([`c28dbd3`](https://github.com/cherrugdeveloper/FoodMapper/commit/c28dbd3)).
- Added Toast component import and toast container rendering in NutritionalCalculator ([`c28dbd3`](https://github.com/cherrugdeveloper/FoodMapper/commit/c28dbd3)).
- Added weekend highlighting in DayNavigator with amber styling and legend ([`c28dbd3`](https://github.com/cherrugdeveloper/FoodMapper/commit/c28dbd3)).
- Added weekend legend indicator in DayNavigator footer ([`dfd728a`](https://github.com/cherrugdeveloper/FoodMapper/commit/dfd728a)).
- Moved recipe button adjacent to meal confirmation button ([`cc519ef`](https://github.com/cherrugdeveloper/FoodMapper/commit/cc519ef)).
- Changed container layout from `flex flex-wrap` to `flex items-center` ([`cc519ef`](https://github.com/cherrugdeveloper/FoodMapper/commit/cc519ef)).

### Added

- Added holiday highlighting with 🎄 emoji and active week indicators ([`3c3eb46`](https://github.com/cherrugdeveloper/FoodMapper/commit/3c3eb46)).

## [2.12.12] - 2026-11-07

### Added

- Redesigned DayNavigator with week-per-row layout, expanded meal count selector ([`8656f47`](https://github.com/cherrugdeveloper/FoodMapper/commit/8656f47)).
- Expanded DietPlan meal count selector from 3|4 to full 1-7 range ([`8656f47`](https://github.com/cherrugdeveloper/FoodMapper/commit/8656f47)).
- Replaced WarningAlert with inline contextual scientific guidance ([`8656f47`](https://github.com/cherrugdeveloper/FoodMapper/commit/8656f47)).
- Improved DayNavigator accessibility with larger touch targets ([`8656f47`](https://github.com/cherrugdeveloper/FoodMapper/commit/8656f47)).

## [2.12.11] - 2026-11-07

### Added

- Added scientific guidance messages for 1-7 meals per day options ([`896b194`](https://github.com/cherrugdeveloper/FoodMapper/commit/896b194)).
- New translation keys: `diet_meal_count_1-7`, `diet_meal_count_*_warning/label` ([`896b194`](https://github.com/cherrugdeveloper/FoodMapper/commit/896b194)).
- Supported informed meal planning decisions based on nutritional science ([`896b194`](https://github.com/cherrugdeveloper/FoodMapper/commit/896b194)).

## [2.12.10] - 2026-11-07

### Changed

- Optimized performance, fixed phase progress, internationalized day summary, and centered action buttons ([`9a65d1b`](https://github.com/cherrugdeveloper/FoodMapper/commit/9a65d1b)).
- Rendered PhaseProgress statically and handled pre-start fallback state ([`3f80e96`](https://github.com/cherrugdeveloper/FoodMapper/commit/3f80e96)).

## [2.12.9] - 2026-11-07

### Fixed

- Fixed phaseDay calculation, calendar phase background styling/legend, DayNavigator performance, and PhaseProgress counters ([`116b7e3`](https://github.com/cherrugdeveloper/FoodMapper/commit/116b7e3)).
- Fixed phaseDay calculation, calendar phase background styling and legend, and optimized DayNavigator re-renders ([`239584e`](https://github.com/cherrugdeveloper/FoodMapper/commit/239584e)).
- Resolved UI performance, pre-start state, i18n, and layout issues ([`6a80f6b`](https://github.com/cherrugdeveloper/FoodMapper/commit/6a80f6b)).

## [2.12.8] - 2026-11-07

### Added

- Updated version to v2.12.8 ([`2b0d67a`](https://github.com/cherrugdeveloper/FoodMapper/commit/2b0d67a)).

## [2.12.7] - 2026-11-07

### Changed

- Updated version to v2.12.9 ([`dfbcdb6`](https://github.com/cherrugdeveloper/FoodMapper/commit/dfbcdb6)).

## [2.12.6] - 2026-11-07

### Fixed

- Correct YAML indentation in e2e job ([`fb2859b`](https://github.com/cherrugdeveloper/FoodMapper/commit/fb2859b)).

### Changed

- Updated changelog, README, CI workflow, and version to v2.12.7 ([`e8a6bf7`](https://github.com/cherrugdeveloper/FoodMapper/commit/e8a6bf7)).

## [2.12.5] - 2026-11-07

### Added

- Added past navigation with 60-day history support ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Implemented month navigation controls (prev/next month) ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Integrated formatted actual date display into day cards ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Extended MAX_DAYS_AHEAD to 3650 days for infinite maintenance phase ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).

### Fixed

- Fixed negative modulo bug in `pickRotating` for proper food rotation ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Fixed timezone-aware date calculations and day index logic in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:1) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1).
- Fixed phase selection, sluggish selection, and `PhaseProgress` layout ([`b69d7bb`](https://github.com/cherrugdeveloper/FoodMapper/commit/b69d7bb)).
- Fixed local timezone date parsing and correct today calculation ([`b69d7bb`](https://github.com/cherrugdeveloper/FoodMapper/commit/b69d7bb)).

### Changed

- Removed date range and day number from week headers ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Updated `PhaseProgress` to dynamically calculate phase duration ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).
- Updated CHANGELOG.md and README.md with v2.12.19 details ([`7424c22`](https://github.com/cherrugdeveloper/FoodMapper/commit/7424c22)).

## [2.12.0] - 2026-11-07

### Added

- Created calendar helper utilities for calculating Italian saints of the day and lunar phases in [`src/utils/calendarHelpers.ts`](src/utils/calendarHelpers.ts:1).
- Redesigned DayNavigator into full monthly calendar starting on Monday with robust date lookup and phase highlights ([`b5f5cc4`](https://github.com/cherrugdeveloper/FoodMapper/commit/b5f5cc4)).

### Changed

- Refactored [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) to strictly grey out adjacent months, apply colored phase background tints without phase badges, ensure independent weekend highlighting, and enrich day cells with saint name and moon phase icons ([`b5f5cc4`](https://github.com/cherrugdeveloper/FoodMapper/commit/b5f5cc4)).

## [2.12.2] - 2026-11-07

### Added

- Bumped version to 2.12.5 and updated changelog ([`694d445`](https://github.com/cherrugdeveloper/FoodMapper/commit/694d445)).

## [2.12.1] - 2026-11-07

### Added

- Updated changelog, README, and version ([`2b0d67a`](https://github.com/cherrugdeveloper/FoodMapper/commit/2b0d67a)).

## [2.12.0] - 2026-11-07

### Changed

- Updated changelog, README, and version ([`e8a6bf7`](https://github.com/cherrugdeveloper/FoodMapper/commit/e8a6bf7)).

## [2.11.2] - 2026-11-07

### Added

- Updated changelog, README, CI workflow, and version ([`dfbcdb6`](https://github.com/cherrugdeveloper/FoodMapper/commit/dfbcdb6)).

## [2.11.1] - 2026-11-07

### Changed

- Updated version from 2.11.0 to 2.11.1 ([`c662624`](https://github.com/cherrugdeveloper/FoodMapper/commit/c662624)).

### Added

- Updated changelog and README per Keep a Changelog 1.1.0 ([`c662624`](https://github.com/cherrugdeveloper/FoodMapper/commit/c662624)).

## [2.11.0] - 2026-11-07

### Added

- Updated changelog, README, and version ([`4910327`](https://github.com/cherrugdeveloper/FoodMapper/commit/4910327)).

## [2.10.0] - 2026-11-07

### Added

- Updated changelog, README, and version ([`30df398`](https://github.com/cherrugdeveloper/FoodMapper/commit/30df398)).

## [2.9.0] - 2026-11-07

### Fixed

- Updated InfoPopup PWA portable positioning with fixed coords ([`a61d554`](https://github.com/cherrugdeveloper/FoodMapper/commit/a61d554)).
- Improved allergen button contrast ([`a61d554`](https://github.com/cherrugdeveloper/FoodMapper/commit/a61d554)).
- Updated FodmapDetailsProps to accept string | null for foodId ([`d257566`](https://github.com/cherrugdeveloper/FoodMapper/commit/d257566)).

### Changed

- Updated changelog, README, CI workflow, and version ([`e8a6bf7`](https://github.com/cherrugdeveloper/FoodMapper/commit/e8a6bf7)).

## [2.8.0] - 2026-11-07

### Added

- Optimized CI Playwright browser caching and installation ([`b4ff1e3`](https://github.com/cherrugdeveloper/FoodMapper/commit/b4ff1e3)).

### Changed

- Updated changelog, README, and version according to Keep a Changelog 1.1.0 ([`6579eca`](https://github.com/cherrugdeveloper/FoodMapper/commit/6579eca)).