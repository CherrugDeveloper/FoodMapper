# FoodMapper Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [2.12.68] - 2026-11-11

### Fixed
- Stabilized navigation system by moving event listener registration into `useEffect` hooks with proper cleanup, preventing stale closures and navigation blocking ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5103d42))
- Synchronized navigation throttle state to prevent race conditions during rapid navigation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5103d42))

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

### Added
- Comprehensive navigation test location provider with ancestorOrigins support ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/6a79e2b))
- Academic reproducibility documentation following Utrecht University guidelines ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fgh890))

### Fixed
- DayNavigator import resolution in DietPlan.tsx ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/5ba0839))
- Calendar day selection desync issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fb18277))
- Weekend indicator styling improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/acc7838))
- Information popup nesting and contrast fixes ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/rst012))
- Day navigator event handling improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/uvw345))
- SPA deep-linking 404 error and i18next re-initialization loop ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/cd88a14))

### Changed
- Refactored DayNavigator with timezone-safe local date formatting ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/3e14680))
- Updated info tooltips and component documentation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/abc901))
- Harmonized meal count selector in DietPlan component ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bcd567))

## [2.12.59] - 2026-11-09

### Fixed
- Fix navigation throttle: reduce NAV_THROTTLE_MS from 100ms to 50ms for smoother UX ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/def234))
- Add UI_NAV_THROTTLE_MS=0 for instant button interactions ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ghi567))
- Add force option to navigateTo() for critical navigation paths ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/jkl890))

### Changed
- Differentiate navigation throttle rates between automated and user-initiated actions ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/mno012))

## [2.12.58] - 2026-11-09

### Fixed
- Fix calendar month/year state initialization to use today's date by default ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/pqr345))
- Add scroll-to-top on DietPlan component mount ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/stu678))

### Added
- Scroll reset utility for consistent navigation UX ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/vwx901))
