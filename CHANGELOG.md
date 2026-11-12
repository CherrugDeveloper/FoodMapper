# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.70] - 2026-11-12

### Fixed
- Resolve navigation UI freeze in `DietPlan.tsx` by ensuring the `app-navigation` event listener is registered after context hooks are initialized, preventing block-scoped variable errors.
- Correct JSDOM test environment behavior for custom events by ensuring `window.dispatchEvent` mocks trigger listeners synchronously.
- Resolve navigation button responsiveness issues in `DietPlan` component after route transitions.

### Changed
- Refactor `navigateTo` utility to remove redundant `fallback` options and optimize internal state management.
- Update `AGENTS.md` with strict rules for event listener registration and cleanup patterns in React components.

### Removed
- Unused `touchNavigationTime` utility and associated imports to improve bundle size and maintainability.

## [2.12.69] - 2026-11-12

### Changed
- Standardize documentation and configuration for automated git workflows.

## [2.12.68] - 2026-11-11

### Fixed
- Resolve stale event listener issues in navigation logic preventing correct UI updates.

### Added
- Documented event listener patterns in `AGENTS.md` to prevent future regressions in component lifecycle management.

## [2.12.67] - 2026-11-11

### Fixed
- Resolve navigation throttle blocking that was freezing UI buttons in `DietPlan` and main navigation tabs.
- Prevent navigation blocking after reaching the diet view by resetting internal throttle states.

## [2.12.66] - 2026-11-10

### Fixed
- Resolve stale closure and infinite update loops in `DietPlan` hooks and context.
- Fix navigation delays and keyboard blocking in `DietPlan` and `DayMetaModal` components.

## [2.12.63] - 2026-11-10

### Fixed
- Resolve React 19 stale closure bugs in `DietPlan` view navigation using ref patterns for callbacks.
- Fix date parsing bugs and `useEffect` synchronization loops in `DayNavigator.tsx`.

## [2.12.60] - 2026-11-09

### Added
- Comprehensive navigation test location provider with `ancestorOrigins` support for better test environment detection.

### Fixed
- Resolve `DayNavigator` import issues and TypeScript type errors in `DietPlan.tsx`.
- Refresh `recentDays` after reset actions in Diary and Diet Plan views.

## [2.12.53] - 2026-11-09

### Fixed
- Resolve SPA deep-linking 404 errors by improving base path handling and `i18next` re-initialization logic.
- Fix scroll reset and date initialization in PWA standalone mode.

## [2.12.51] - 2026-11-08

### Changed
- Refactor `DayNavigator` with timezone safety and accessibility improvements.
- Redesign `DayNavigator` with interactive monthly calendar grid and Monday start.

## [2.12.40] - 2026-11-08

### Added
- Weight-dependent EFSA caffeine calculations in `NutritionalCalculator`.
- Weekend badges and exclusive phase background colors in calendar views.

### Fixed
- Resolve `InfoPopup` nesting issues and improve allergen contrast.
- Fix date clamping and event propagation in `DayNavigator`.
