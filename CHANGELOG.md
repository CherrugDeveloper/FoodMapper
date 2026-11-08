# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.50] - 2026-11-08

### Fixed
- Fixed i18n initialization language `undefined` fallback causing 404 errors on translation files in [`src/i18n.ts`](src/i18n.ts:24).
- Enhanced robust route and resource path resolution across PWA and SPA environments.

## [2.12.49] - 2026-11-07

### Added
- Added memoization to nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- Implemented [`useFoodSearch`](src/hooks/useFoodSearch.ts:1) hook for bilingual food search.
- Updated disclaimer storage with expiration and type validation in [`src/utils/storage.ts`](src/utils/storage.ts:1).
- Created comprehensive notification permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).

### Fixed
- GitHub Pages base routing in [`vite.config.ts`](vite.config.ts:1).
- Water reminder notification permission state management.
