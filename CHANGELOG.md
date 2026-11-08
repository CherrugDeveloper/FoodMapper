# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.49] - 2026-11-08
### Changed
- Updated [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) calendar UI and interactivity:
  - Weekends are now indicated using dedicated badges.
  - Diet phases are distinguished exclusively by background colors.
  - Configured phase start date support via [`onUpdateStartDate`](src/components/DayNavigator.tsx:45).
  - Clicking on any non-phase day automatically opens the metadata/activity modal.
  - Fixed moon phase text truncation by removing `truncate` from [`moon.name`](src/components/DayNavigator.tsx:285).

## [2.12.48] - 2026-11-06
### Added
- Memoization to nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts).
- Implemented [`useFoodSearch`](src/hooks/useFoodSearch.ts) hook for bilingual food search.
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts).
- Created comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts).
