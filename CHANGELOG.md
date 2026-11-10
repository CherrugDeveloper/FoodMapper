# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.61] - 2026-11-10

### Fixed
- Resolve TypeScript TypeCheck and ESLint errors in `DietPlan.tsx` - removed unused `useMemo` import and reordered destructuring of `dietPlan` state to occur before callbacks that depend on it
- Preserve phase background colors when selecting days outside diet phase in `DayNavigator.tsx` - fixed CSS class conflict that was causing background colors to disappear
- Fix event propagation in `DayNavigator.tsx` - improved click handling with debug statements for better traceability

## [2.12.60] - 2025-01-15

### Added
- Initial comprehensive diet plan interface with meal tracking and navigation components

[2.12.60]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.61
[v2.12.60]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.60