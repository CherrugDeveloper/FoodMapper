# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [2.12.51] - 2026-11-08

### Fixed
- Refactored [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) to use timezone-safe local date formatting (`YYYY-MM-DD`) and resolved date-parsing edge cases.
- Enhanced accessibility (a11y) in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1) with ARIA roles, `tabIndex`, keyboard navigation (`Enter` / `Space`), and modal focus/Escape handling.

## [2.12.50] - 2026-11-08

### Fixed
- Resolved 404 translation resource loading errors caused by uninitialized `i18n.language` (`undefined`) before backend loading by explicitly setting initial language `lng` in [`src/i18n.ts`](src/i18n.ts:1).

## [2.12.0] - 2026-11-08

### Added
- Implemented memoization in nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- Implemented `useFoodSearch` hook for bilingual food search in [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1).
- Created comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).

### Changed
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts:1).
- Expanded comprehensive test suite across Vitest and Playwright E2E.
