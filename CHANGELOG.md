# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [2.12.23] - 2026-11-07

### Fixed
- Updated [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx) to render statically at all times, removing conditional null returns when `day` is null or pre-start.
- Implemented robust fallback state handling for pre-start and uninitialized phase days in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx).
- Removed unused `PHASE_DESCRIPTIONS` dictionary to resolve TypeScript compilation warnings.

## [2.12.22] - 2026-11-06

### Fixed
- Fixed timezone-aware date calculations and day index logic in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts).
- Suppressed incorrect Phase badges and corrected counter translation interpolation in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx).
- Persisted visibility and pre-start states without negative values in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx).
