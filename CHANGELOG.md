# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.36] - 2026-11-08

### Added
- Visible diet start date indicator badge and inline editable date input in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1) and [`useDietPlan.ts`](src/hooks/useDietPlan.ts:1).
- Risk level indicators (optimal, discouraged, dangerous) for meal-per-day choices in [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1).

### Changed
- Extended meal confirmation toast notification duration to 8 seconds in [`useToast.ts`](src/hooks/useToast.ts:1).
- Enhanced [`PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1) reactivity.
- Refined [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) info popup texts and allergen selection background contrast.

### Fixed
- Fixed navigation buttons locking issue after meal confirmation by removing the sticky `isNavigating` re-entrancy lock in [`navigation.ts`](src/utils/navigation.ts:1).
