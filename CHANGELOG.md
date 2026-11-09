# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.57] - 2026-11-09

### Fixed
- Fixed unused variables and lint errors in `src/components/DayNavigator.tsx` (removed `isEditingStartDate`, `setNewStartDateInput`, `handleStartDateSubmit`).
- Fixed TypeScript import error in `src/components/DietPlan.tsx` by correcting DayNavigator import from named to default export.
- Fixed unused import and `any` type in `tests/uiChanges.test.tsx` (removed unused `waitFor`, added proper `DateKey` type).

## [2.12.56] - 2026-11-09

### Changed
- Replaced weekend textual badges with distinct red border styling (`border-2 border-red-500/80` for unselected days and `border-2 border-red-500 ring-2 ring-(--accent)/40` when selected) and accented day numbers in `src/components/DayNavigator.tsx`.
- Redesigned the day details and metadata modal trigger button in `src/components/DayNavigator.tsx` to be subtle, unobtrusive (`opacity-40 hover:opacity-100 group-hover:opacity-75 hover:bg-(--accent)/15 hover:text-(--accent)`), and fully event-isolated via `stopPropagation`.

### Fixed
- Resolved persistent day selection synchronization bug in `src/components/DayNavigator.tsx` and `src/hooks/useDietPlan.ts` by correctly matching day index with relative date offset instead of array index and eliminating incorrect array length clamping.
- Fixed TypeScript typing in test file by replacing `as any` with proper `DateKey` type.

## [2.12.55] - 2026-11-09

### Added
- Interactive day selection and persistent day metadata modal triggers in `src/components/DayNavigator.tsx`.
- Optimized month-based day grid rendering and memoization.
- Comprehensive test coverage in `tests/uiChanges.test.tsx` validating weekend red borders, subtle modal button behavior, click event propagation isolation, and day selection navigation dispatch.

### Fixed
- Stabilized browser navigation events and state synchronization across views.

## [2.12.54] - 2026-11-09

### Fixed
- Enabled sourcemap generation and updated i18n translations across supported locales in `vite.config.ts`.

## [2.12.53] - 2026-11-09

### Fixed
- Resolved SPA deep-linking 404 resource errors by safely handling path restoration and base path slicing in `index.html` and `public/404.html`.
- Eliminated i18next infinite re-initialization and re-render loops by replacing prototype event monkey-patching with standard listeners in `src/i18n.ts` and `src/main.tsx`.
- Configured robust history API fallback in `vite.config.ts`.

## [2.12.52] - 2026-11-09

### Fixed
- Resolved resource 404 error on direct deep linking and SPA navigation by updating absolute script references to relative root references in `index.html`.
- Improved robust path resolution across GitHub Pages fallback routing and static asset delivery.

## [2.12.51] - 2026-11-09

### Added
- Initial release of FoodMapper: IBS nutrition guide, trifasic diet planning, bilingual food database, recipe manager, shopping list, sleep tracker, workout planner, and educational hub.
- Full PWA support with offline caching and multi-language support (English, Italian, Spanish, French, German).
- Nutritional calculator with EFSA-compliant recommendations.
- Comprehensive testing suite with Vitest and React Testing Library.

## [2.12.50] - 2026-10-01

### Added
- Core application functionality with diet planning, diary tracking, and nutrition analysis.

## [2.12.0] - 2026-10-01

### Added
- Initial public release of FoodMapper application.

[2.12.57]: https://github.com/marco/foodmapper/compare/v2.12.56...v2.12.57
[2.12.56]: https://github.com/marco/foodmapper/compare/v2.12.55...v2.12.56
[2.12.55]: https://github.com/marco/foodmapper/compare/v2.12.54...v2.12.55
[2.12.54]: https://github.com/marco/foodmapper/compare/v2.12.53...v2.12.53
[2.12.53]: https://github.com/marco/foodmapper/compare/v2.12.52...v2.12.53
[2.12.52]: https://github.com/marco/foodmapper/compare/v2.12.51...v2.12.52
[2.12.51]: https://github.com/marco/foodmapper/compare/v2.12.50...v2.12.51
[2.12.50]: https://github.com/marco/foodmapper/compare/v2.11.0...v2.12.0
[2.12.0]: https://github.com/marco/foodmapper/compare/v2.11.0...v2.12.0