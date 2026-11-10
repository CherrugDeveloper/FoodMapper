# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.63] - 2026-11-10

### Fixed

- Resolve React 19 stale closure bug in DietPlan view navigation functions (`navigateDay`, `navigateToDate`, `updateStartDate`, `updatePreferences`) by using refs to access latest `results` and `userData` values instead of closure scope
- Remove verbose console.debug statements from DayNavigator.tsx and DietPlan.tsx components

## [2.12.62] - 2026-11-10

### Fixed

- Resolve TypeScript TypeCheck and ESLint errors in `DietPlan.tsx` - removed unused `useMemo` import and reordered destructuring of `dietPlan` state to occur before callbacks that depend on it
- Preserve phase background colors when selecting days outside diet phase in `DayNavigator.tsx` - fixed CSS class conflict that was causing background colors to disappear
- Fix event propagation in `DayNavigator.tsx` - improved click handling with debug statements for better traceability

## [2.12.61] - 2026-11-10

### Changed

- Refactored diet plan day generation
- Improved event propagation in DietPlan component
- Redesigned meal count buttons with improved UI

## [2.12.60] - 2026-11-09

### Fixed

- Resolve TypeScript and ESLint errors in DietPlan.tsx
- Preserve phase background colors for selected days outside diet phase

### Changed

- Refactor diet plan day generation and fix event propagation
- Redesign meal count buttons

## [2.12.53] - 2026-11-09

### Fixed

- SPA deep-linking 404 error
- i18next re-initialization loop
- DayNavigator calendar phase background styling

### Changed

- Calendar redesign with interactive day selection
- Weekend indicator styling enhancements
- Diet plan phase progress visualization
- PhaseProgress visibility and pre-start states

## [2.12.46] - 2026-11-08

### Added

- Comprehensive navigation test location provider with ancestorOrigins support

### Fixed

- DayNavigator import in DietPlan.tsx
- Unused variables and TypeScript type errors
- Day selection desync in calendar
- InfoPopup nesting and positioning

### Changed

- Harmonize meal count selector UI
- Refresh recentDays after reset actions
- Redesign DayNavigator with interactive features

## [2.12.44] - 2026-11-08

### Added

- Start date modification in DayNavigator
- Diet meal count translations for German, Spanish, and French locales

### Fixed

- Missing translation key synchronization

### Changed

- Changelog updates

## [2.12.40] - 2026-11-08

### Fixed

- InfoPopup PWA portable positioning
- FodmapDetailsProps type handling
- Tab switching race conditions

### Changed

- UI components harmonization
- DayNavigator optimizations
- Translation updates across locales

## [2.12.39] - 2026-11-08

### Added

- Diet meal count translations for German, Spanish, and French locales

### Fixed

- Missing translation key synchronization

### Changed

- Changelog updates

## [2.12.38] - 2026-11-08

### Changed

- CI/CD pipeline optimizations
- Repository maintenance

[2.12.63]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.62...v2.12.63
[2.12.62]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.61...v2.12.62
[2.12.61]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.61
[2.12.60]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.53...v2.12.60
[2.12.53]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.46...v2.12.53
[2.12.46]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.44...v2.12.46
[2.12.44]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.40...v2.12.44
[2.12.40]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.39...v2.12.40
[2.12.39]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.38...v2.12.39
[2.12.38]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.36...v2.12.38