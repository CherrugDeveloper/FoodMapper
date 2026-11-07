# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.35] - 2026-11-07

### Fixed
- Fixed [`TypeError: Cannot read properties of undefined (reading 'length')`](src/components/Diary.tsx:44) in [`src/components/Diary.tsx`](src/components/Diary.tsx:44) when loading legacy `localStorage` entries lacking `foodEntries`.
- Implemented robust deep sanitization and normalization for stored diary entries.

## [2.12.34] - 2026-11-07

### Added
- Added memoization to nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- Implemented [`useFoodSearch`](src/hooks/useFoodSearch.ts:1) hook for bilingual food search.
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts:1).
- Created comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).

### Fixed
- Resolved Node.js punycode deprecation warning.
- Hardened button interactions against race conditions.
- Added diet start date indicator and user editability controls in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Fixed "Conferma pasto" synchronization and persistence in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1) and [`src/components/Diary.tsx`](src/components/Diary.tsx:1).
