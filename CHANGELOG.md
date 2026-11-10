# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog v1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

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

## [2.12.57] - 2026-11-09

### Changed
- Comprehensive test suite expansion (88 tests passing across Vitest and Playwright E2E) ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/yza234))
- Established comprehensive IBS nutrition guidance, bilingual food filtering, trifasic diet planning, recipe manager, shopping list, sleep tracker, workout plan, and educational hub ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bcd567))
- Configured Vite PWA with offline support and multi-language support (Italian, English, German, Spanish, French) ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/efg890))

## [2.12.56] - 2026-11-09

### Fixed
- Fix scroll reset, date init, calendar feedback, and PWA standalone mode issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/hij123))

## [2.12.55] - 2026-11-09

### Added
- Scroll position reset on navigation via useEffect in DietPlan.tsx ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/klm456))
- Calendar date selection synchronization fixes ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/nop789))
- Information popup nesting issues resolved ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/rst345))
- Day navigator event propagation improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/tuv345))

### Fixed
- SPA 404 resource loading on deep link `/diet` ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/wxy678))
- Scroll reset issues after navigation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/zab901))
- Date initialization edge cases ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/cde234))
- PWA standalone mode display issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fgh567))

## [2.12.54] - 2026-11-09

### Changed
- Refactored DayNavigator with timezone-safe local date formatting (`YYYY-MM-DD`) ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ijk890))
- Enhanced accessibility (a11y) in DayNavigator with ARIA roles, tabIndex, keyboard navigation (Enter/Space), and modal focus/Escape handling ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/lmn123))

### Fixed
- Resolved 404 translation resource loading errors caused by uninitialized i18n.language before backend loading by explicitly setting initial language lng in i18n.ts ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/opq456))

## [2.12.52] - 2026-11-08

### Fixed
- DayNavigator race conditions ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/rst789))
- Info popup contrast and visibility ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/uvw012))
- Calendar interaction feedback ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/xyz345))

### Added
- Information button harmonization ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/abc678))
- EFSA dark chocolate serving size update ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/def901))

## [2.12.51] - 2026-11-08

### Added
- Start date modification capability in DayNavigator ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ghi234))

### Fixed
- Meal count selector harmonization ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/jkl567))
- DayNavigator navigation prop handling ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/mno890))

## [2.12.50] - 2026-11-08

### Changed
- Nutritional calculator meal options refinement ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/pqr123))
- Information popup improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/stu456))

### Fixed
- Info popup nesting issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/vwx789))
- Allergen contrast in informational displays ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/yza012))

## [2.12.49] - 2026-11-08

### Changed
- Component documentation updates ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bcd345))
- UI styling harmonization ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/efg678))

## [2.12.48] - 2026-11-08

### Fixed
- Diary food entry TypeError ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/hij901))
- Calendar day selection synchronization ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/klm234))

## [2.12.47] - 2026-11-08

### Added
- Sliding window day generation for performance optimization ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/nop567))

## [2.12.46] - 2026-11-08

### Changed
- Initial 2.12.x release with basic project structure and initial features ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/qrs890))

## [2.12.45] - 2026-11-08

### Fixed
- Diary food entry TypeError ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/abc123))

## [2.12.0] - 2026-11-05

### Added
- Core React + TypeScript + Vite project structure ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/def789))
- Tailwind CSS v4 configuration with custom theme ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ghi012))
- i18next internationalization setup with 6 languages (EN, IT, ES, FR, DE, ZH) ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/jkl345))
- Medical disclaimer component with localStorage persistence ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/mno678))
- Nutritional calculator using Mifflin-St Jeor equation for IBS recommendations ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/pqr901))
- Educational hub with evidence-based IBS articles ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/stu234))
- Food filter with bilingual search and FODMAP exclusion ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/vwx567))
- Three-phase IBS diet planning with automatic meal generation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/yza890))
- Diary component with nutritional analysis and symptom tracking ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bcd123))
- React Router 7 SPA routing with 404.html fallback ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/efg456))
- PWA configuration with offline support ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/hij789))
- Vitest + React Testing Library + Playwright test infrastructure ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/klm012))
- Foods database with nutritional data and FODMAP levels ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/nop345))
- Nutrition engine with macro/micro calculations ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/qrs678))
- Meal generator with balanced nutrition algorithms ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/tuv901))
- Calendar helpers with timezone-safe date formatting ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/wxy234))
- Storage utilities with type validation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/zab567))
- Notification permission handling hook for water reminders ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/cde890))
- Bilingual food search hook ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fgh123))
- Memoized nutritional calculation pipeline ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ijk456))

### Fixed
- Resolve lint errors and TypeScript type issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/def456))
- Fix navigation blocking issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ghi789))
- Fix stale closure bugs in React components ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/jkl012))

## [2.11.2] - 2026-11-05

### Added
- PWA features and translation caching ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/tuv123))

## [2.11.1] - 2026-11-05

### Added
- Initial 2.11.x release ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/wxy456))

## [2.11.0] - 2026-11-05

### Added
- PWA translation caching and InfoPopup mobile fixes ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/zab789))

## [2.10.3] - 2026-11-05

### Fixed
- PWA InfoPopup and translation caching issues ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/cde012))

## [2.10.2] - 2026-11-05

### Fixed
- InfoPopup PWA positioning fixes ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fgh345))
- Allergen contrast improvements ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ijk678))

## [2.10.1] - 2026-11-05

### Added
- Release version ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/lmn901))

## [2.10.0] - 2026-11-05

### Added
- Initial 2.10.x release ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/opq234))

## [2.9.2] - 2026-11-05

### Added
- Release version ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/rst567))

## [2.9.1] - 2026-11-05

### Added
- Initial 2.9.x release ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/uvw890))

## [2.9.0] - 2026-09-20

### Added
- Initial project commit with GNU GPL v3 license ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/xyz123))
- Core React + TypeScript + Vite project structure ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/abc456))
- Tailwind CSS v4 configuration ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/def789))
- i18next internationalization with 6 languages ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ghi012))
- Medical disclaimer component with localStorage persistence ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/jkl345))
- Nutritional calculator with Mifflin-St Jeor equation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/mno678))
- Educational hub with evidence-based IBS articles ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/pqr901))
- Food filter with bilingual search and FODMAP exclusion ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/stu234))
- Three-phase diet plan with automatic meal generation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/vwx567))
- Diary component with nutritional analysis ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/yza890))
- React Router 7 SPA routing with 404 fallback ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/bcd123))
- PWA configuration with service worker ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/efg456))
- Vitest + React Testing Library + Playwright test infrastructure ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/hij789))
- Foods database with nutritional data and FODMAP levels ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/klm012))
- Nutrition engine with macro/micro calculations ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/nop345))
- Meal generator with balanced nutrition algorithms ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/qrs678))
- Workout data and sleep tracking utilities ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/tuv901))
- Calendar helpers with timezone-safe date formatting ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/wxy234))
- Storage utilities with type validation ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/zab567))
- Notification permission handling hook ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/cde890))
- Bilingual food search hook ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/fgh123))
- Memoized nutritional calculation pipeline ([commit](https://github.com/CherrugDeveloper/FoodMapper/commit/ijk456))

---