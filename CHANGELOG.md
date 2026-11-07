# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.31] - 2026-11-07

### Added
- Implemented robust meal confirmation handler (`confirmMeal`) and portion-scaled updates in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts) and [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx:177).
- Added direct navigation for recipes (`/recipes`) and shopping list (`/shopping`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).
- Added day completion action handler (`completeDay`) in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).

### Changed
- Overhauled phase and day calculation logic in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:41) to accurately track past, current, and future diet phases and days.
- Formatted InfoPopups and cleaned up raw translation strings in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx) and translation files.
- Rounded espresso and tea cup calculations to integer values in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx).
- Removed `Math.min(100, ...)` capping from water and calorie percentage calculations in [`src/components/Diary.tsx`](src/components/Diary.tsx).
- Added click-outside-to-close behavior for the Day Notes & Reminder modal backdrop in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx).

### Fixed
- Fixed day index lookups supporting negative day offsets (`-DAYS_IN_PAST`) in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts).
- Resolved unit test assertions and portion calculation scaling in [`tests/useDietPlan.test.ts`](tests/useDietPlan.test.ts).
