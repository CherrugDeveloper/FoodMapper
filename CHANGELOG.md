# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.66] - 2026-11-10

### Fixed

- Resolve stale closure bug in DietPlan.tsx causing interface freezing - removed unnecessary `useState` force update pattern, implemented `useRef` callback refs (`confirmMealRef`, `modifyMealRef`, `completeDayRef`) following DayNavigator.tsx pattern, added memoized `handleConfirmMeal` and `handleModifyMeal` callbacks with empty dependency arrays, simplified inline arrow functions to prevent re-renders
- Fix stale closure bug in DayNavigator.tsx - changed `onNavigateToDate` effect dependency array from `[state.startDate]` to `[]` to fix stale closure issue
- Fix stale closure bugs in DayNavigator.tsx DayMetaModal component - keyboard event handler now uses ref pattern with empty dependency array to prevent event listener re-registration issues that broke navigation keys when switching to DietPlan view
- Fix remaining stale closure issues in `DayMetaModal` by converting `handleBackdropClick`, close button, and cancel button to use `onCloseRef.current` for consistent stale closure prevention
- Resolve TypeScript TypeCheck and ESLint errors in `DietPlan.tsx` - removed unused `useMemo` import and reordered destructuring of `dietPlan` state to occur before callbacks that depend on it
- Preserve phase background colors when selecting days outside diet phase in `DayNavigator.tsx` - fixed CSS class conflict that was causing background colors to disappear
- Fix event propagation in `DayNavigator.tsx` - improved click handling
- Remove verbose console.debug statements from DietPlan components (MealCard.tsx, PhaseProgress.tsx, DaySummary.tsx)
- Fix SPA deep-linking 404 error and improve routing for GitHub Pages

### Changed

- Refactor diet plan day generation
- Improved event propagation in DietPlan component
- Redesigned meal count buttons with improved UI

## [2.12.63] - 2026-11-10

### Fixed

- Fix stale closure bug in DayNavigator.tsx navigation functions using ref pattern to access latest `results` and `userData` values instead of closure scope

### Changed

- CI/CD pipeline optimizations
- Repository maintenance

[2.12.66]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.66
[2.12.63]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.60...v2.12.63