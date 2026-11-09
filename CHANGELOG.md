# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning ([SemVer](https://semver.org/spec/v2.0.0.html)).

## [2.12.56] - 2026-11-09

### Added
- Comprehensive test coverage in [`tests/uiChanges.test.tsx`](tests/uiChanges.test.tsx:1) validating weekend red borders, subtle modal button behavior, click event propagation isolation, and day selection navigation dispatch.

### Changed
- Replaced weekend ("wknd") textual badges with distinct red border styling (`border-2 border-red-500/80` for unselected days and `border-2 border-red-500 ring-2 ring-(--accent)/40` when selected) and accented day numbers in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:356).
- Redesigned the day details and metadata modal trigger button in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:400) to be subtle, unobtrusive (`opacity-40 hover:opacity-100 group-hover:opacity-75 hover:bg-(--accent)/15 hover:text-(--accent)`), and fully event-isolated via [`stopPropagation`](src/components/DayNavigator.tsx:403).

### Fixed
- Fixed persistent day selection synchronization bug in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:62) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:573) by correctly matching day index with relative date offset instead of array index and eliminating incorrect array length clamping.

## [2.12.55] - 2026-11-09

### Added
- Interactive day selection and persistent day metadata modal triggers in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Optimized month-based day grid rendering and memoization.

## [2.12.54] - 2026-11-09

### Fixed
- Resolved SPA deep-linking 404 resource errors by safely handling path restoration and base path slicing in [`index.html`](index.html:1) and [`public/404.html`](public/404.html:1).
- Eliminated i18next infinite re-initialization and re-render loops by replacing prototype event monkey-patching with standard listeners in [`src/i18n.ts`](src/i18n.ts:1) and [`src/main.tsx`](src/main.tsx:1).
- Configured robust history API fallback in [`vite.config.ts`](vite.config.ts:7).

## [2.12.53] - 2026-11-09

### Fixed
- Resolved resource 404 error on direct deep linking and SPA navigation by updating absolute script references to relative root references in [`index.html`](index.html:38).
- Improved robust path resolution across GitHub Pages fallback routing and static asset delivery.

## [2.12.52] - 2026-11-09

### Added
- Comprehensive test coverage for navigation, diet plan, sleep tracking, and i18n initialization.

### Fixed
- Stabilized browser navigation events and state synchronization across views.

## [2.12.51] - 2026-11-05

### Added
- Memoization to nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- [`useFoodSearch`](src/hooks/useFoodSearch.ts:1) hook for bilingual food search capabilities.
- Comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).

### Changed
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts:1).

## [2.12.5] - 2026-11-05

### Fixed
- Fixed disclaimer acceptance race condition and modal re-attachment during CI and automated testing runs in [`tests/e2e/fixtures.ts`](tests/e2e/fixtures.ts:1).

## [2.12.2] - 2026-11-05

### Changed
- Updated repository documentation, changelog, and bumped project version.

## [2.12.1] - 2026-11-05

### Fixed
- Enabled sourcemap generation and updated i18n translations across supported locales in [`vite.config.ts`](vite.config.ts:1).

## [2.12.0] - 2026-11-05

### Added
- Initial release of FoodMapper: IBS nutrition guide, trifasic diet planning, bilingual food database, recipe manager, shopping list, sleep tracker, workout planner, and educational hub.
- Full PWA support with offline caching and multi-language support (Italian, English, German, Spanish, French).

[2.12.56]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.55...v2.12.56
[2.12.55]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.54...v2.12.55
[2.12.54]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.53...v2.12.54
[2.12.53]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.52...v2.12.53
[2.12.52]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.51...v2.12.52
[2.12.51]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.5...v2.12.51
[2.12.5]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.2...v2.12.5
[2.12.2]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.1...v2.12.2
[2.12.1]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.0...v2.12.1
[2.12.0]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.0
