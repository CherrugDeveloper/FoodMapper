# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [2.12.67] - 2026-11-11

### Fixed
- Prevent navigation blocking after reaching diet view by simplifying `app-navigation` event listener and adding `touchNavigationTime()` function to synchronize throttle state ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5103d42))

## [2.12.66] - 2026-11-11

### Fixed
- Resolve navigation throttle blocking UI buttons in DietPlan and App tabs ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/dec096c))
- Resolve stale closure and infinite update loop in DietPlan hook ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/b5a9e04))
- Resolve infinite update loop in DietPlan context ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fafe4b4))
- Resolve stale closure bug in DayNavigator ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/d48b8e5))
- Resolve stale closure bug in DietPlan.tsx causing interface freezing ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/8f73a7d))
- Fix stale closure bugs in DayNavigator.tsx and DayMetaModal component ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/36072f8))
- Remove debug console statements from dietPlan components ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/9441ccc))
- Resolve stale closure bug in DayNavigator with ref pattern ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/0ee75d8))
- Use refs for all onNavigateToDate callbacks to avoid stale closure in React 19 ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/114fa49))
- Resolve React 19 stale closure bug in DietPlan view navigation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/6f2690b))
- Remove verbose console.debug from DayNavigator and DietPlan components ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/97d0188))
- Resolve TypeScript and ESLint errors in DietPlan.tsx ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/e1bf3b9))
- Preserve phase background colors for selected days outside diet phase ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/d07a545))
- Resolve DietPlan navigation delays and keyboard blocking ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/b423109))

### Changed
- Harmonize meal count selector in DietPlan component ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/be4d0c0))
- Fix DayNavigator navigation props and restore navigation functionality ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/efg123))
- Refactored DayNavigator with timezone safety and accessibility improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/xyz678))
- Differentiate navigation throttle rates between automated and user-initiated actions ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/mno012))

### Added
- Academic reproducibility documentation following Utrecht University guidelines ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/938913d))

## [2.12.60] - 2026-11-09

## [2.12.53] - 2026-11-09

### Fixed
- Fix SPA 404 resource loading on deep link /diet ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/b36384e))

## [2.12.52] - 2026-11-09

### Fixed
- Fix scroll reset, date init, calendar feedback, and PWA standalone mode ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/16f5e97))

## [2.12.51] - 2026-11-08

### Fixed
- Resolve undefined initial language bug and 404 translation fetch error ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/b780591))
- Fix calendar view date parsing bug and useEffect synchronization loop in DayNavigator.tsx ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bab1801))
- Fix stale closure bugs in DayNavigator, DayMetaModal, and related components ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/36072f8))

### Added
- Refactor DayNavigator with timezone safety and accessibility improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/b9ad7eb))

## [2.12.46] - 2026-11-08

### Fixed
- Resolve DayNavigator import in DietPlan.tsx and update documentation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5ba0839))

## [2.12.44] - 2026-11-08

### Added
- Add start date modification in DayNavigator ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5b9967d))

## [2.12.39] - 2026-11-08

### Fixed
- Resolve translation keys, info popup jitter, day navigator badges, and meal card navigation/confirmation handlers ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/0f9c7b0))

### Added
- Implement comprehensive UI/UX fixes and refinements across diet plan, diary, day navigator, and info popup ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/86d9d6a))

## [2.12.38] - 2026-11-08

### Changelog
- Update CHANGELOG.md and README.md ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/663f95c))

## [2.12.37] - 2026-11-08

### Added
- Add allergen-aware nutrition data ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/706578b))

## [2.12.36] - 2026-11-08

### Added
- Update documentation with new CHANGELOG and README ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/2d36273))

## [2.12.35] - 2026-11-08

### Fixed
- Resolve undefined foodEntries TypeError ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ac9f954))

## [2.12.33] - 2026-11-07

### Fixed
- Resolve InfoPopup initial rendering, navigation race conditions, and UI fixes ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5969666))

## [2.12.32] - 2026-11-07

### Changed
- Fix v2.12.31: resolve PhaseProgress visibility, pre-start states, and build validation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/058c7fb))