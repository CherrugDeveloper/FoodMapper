# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [2.12.27] - 2026-11-07

### Added
- Implemented local storage-backed day notes, calendar events, and browser notification reminders with interactive modal editor in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Configured PWA manifest in [`public/manifest.json`](public/manifest.json:1) for headless / window-controls-overlay window mode.

### Changed
- Overhauled color contrast across phases and applied uniform rose weekend styling for both Saturday and Sunday in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Optimized [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) with React `memo` and instant date synchronization to eliminate day selection lag and double selection glitches.
- Fixed [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1) to correctly render phase progress bars, names, and accurate day counts.

## [2.12.26] - 2026-11-07

### Added
- Created calendar helper utilities for calculating Italian saints of the day and lunar phases in [`src/utils/calendarHelpers.ts`](src/utils/calendarHelpers.ts:1).

### Changed
- Refactored [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) to strictly grey out adjacent months, apply colored phase background tints without phase badges, ensure independent weekend highlighting, and enrich day cells with saint name and moon phase icons.

## [2.12.25] - 2026-11-07

### Fixed
- Fixed phaseDay calculation bug for Phase 1, 2, and 3 in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1).
- Optimized calendar grid re-render performance and eliminated lag in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Redesigned phase visual hierarchy with distinct background color tinting, phase pills (`F0`-`F3`), and an interactive Phase Legend in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Corrected phase day counters and total phase day lengths in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1).

## [2.12.24] - 2026-11-07

### Fixed
- Updated [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1) to render statically at all times, removing conditional null returns.
- Implemented robust fallback state handling for pre-start and uninitialized phase days.

## [2.12.23] - 2026-11-07

### Fixed
- Updated [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1) to render statically at all times, removing conditional null returns when `day` is null or pre-start.
- Implemented robust fallback state handling for pre-start and uninitialized phase days.
- Removed unused `PHASE_DESCRIPTIONS` dictionary to resolve TypeScript compilation warnings.

## [2.12.22] - 2026-11-06

### Fixed
- Fixed timezone-aware date calculations and day index logic in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:1) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1).
- Suppressed incorrect Phase badges and corrected counter translation interpolation in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Persisted visibility and pre-start states without negative values in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:1).
