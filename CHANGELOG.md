# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [2.12.66] - 2026-11-10

### Fixed
- Resolve stale closure bugs in DietPlan.tsx using `useRef` patterns for React 19 compatibility
- Fix infinite update loop in DietPlan context by removing `userData` from dependency array
- Remove verbose console.debug statements from DaySummary, MealCard, and PhaseProgress components

## [2.12.65] - 2026-11-10

### Fixed
- Fix stale closure bug in DayNavigator with ref pattern for `onNavigateToDate` callback
- Remove unused console.debug statements from nutrition calculation components

## [2.12.64] - 2026-11-10

### Fixed
- Fix calendar day selection desync and enhance weekend indicator styling
- Resolve TypeScript and ESLint errors in DietPlan.tsx
- Fix SPA deep-linking 404 error and i18next re-initialization loop

## [2.12.63] - 2026-11-10

### Changed
- Update documentation and regenerate CHANGELOG.md from git log
- Harmonize meal count selector in DietPlan component
- Fix DayNavigator navigation props and restore navigation functionality

### Fixed
- Resolve undefined initial language bug in i18n
- Fix date parsing bug in DayNavigator calendar view

## [2.12.62] - 2026-11-10

### Changed
- Update `@types/jsdom` to v30.1.1
- Update README.md with Utrecht University reproducibility conventions

## [2.12.60] - 2026-11-10

### Added
- Comprehensive navigation test location provider with ancestorOrigins support
- Academic reproducibility documentation following Utrecht University guidelines

### Fixed
- DayNavigator import resolution in DietPlan.tsx
- Calendar day selection desync issues
- Weekend indicator styling improvements
- Information popup nesting and contrast fixes
- Day navigator event handling improvements

### Changed
- Refactored DayNavigator with timezone safety and accessibility improvements
- Updated info tooltips and component documentation

## [2.12.53] - 2026-11-09

### Fixed
- SPA 404 resource loading on deep link `/diet`
- Scroll reset issues after navigation
- Date initialization edge cases
- PWA standalone mode display issues

## [2.12.52] - 2026-11-08

### Fixed
- Scroll position reset on navigation
- Calendar date selection synchronization
- Information popup nesting issues
- Day navigator event propagation

## [2.12.51] - 2026-11-08

### Changed
- Redesigned DayNavigator with interactive day selection
- Updated weekend badge styling (wknd abbreviation)

## [2.12.46] - 2026-11-08

### Fixed
- DayNavigator race conditions
- Info popup contrast and visibility
- Calendar interaction feedback

### Added
- Information button harmonization
- EFSA dark chocolate serving size update

## [2.12.44] - 2026-11-08

### Added
- Start date modification capability in DayNavigator

### Fixed
- Meal count selector harmonization
- DayNavigator navigation prop handling

## [2.12.40] - 2026-11-08

### Changed
- Nutritional calculator meal options refinement
- Information popup improvements

### Fixed
- Info popup nesting issues
- Allergen contrast in informational displays

## [2.12.39] - 2026-11-08

### Changed
- Component documentation updates
- UI styling harmonization

## [2.12.38] - 2026-11-08

### Fixed
- Diary food entry TypeError
- Calendar day selection synchronization

## [2.12.36] - 2026-11-08

### Added
- Sliding window day generation for performance optimization

## [2.11.2] - 2026-11-08

### Added
- Basic project structure and initial features

---

[2.12.66]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.66
[2.12.65]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.65
[2.12.64]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.64
[2.12.63]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.63
[2.12.62]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.62
[2.12.60]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.60
[2.12.53]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.53
[2.12.52]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.52
[2.12.51]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.51
[2.12.46]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.46
[2.12.44]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.44
[2.12.40]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.40
[2.12.39]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.39
[2.12.38]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.38
[2.12.36]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.36