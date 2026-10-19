# Changelog

## [2.8.5] - 2026-10-19
### Fixed
- Fixed bug where on startup the site only showed tab buttons and rendered nothing else until page refresh by synchronously initializing `isAppUnlocked` from `disclaimerStorage.get()` in [`src/App.tsx`](src/App.tsx:75).

## [2.8.4] - 2026-10-19
### Fixed
- Fixed critical startup crash and E2E test failures caused by `AppContent` calling `useAppContext()` outside of `AppProvider` in [`src/App.tsx`](src/App.tsx:67).

## [2.8.3] - 2026-10-19
### Fixed
- Fixed E2E test failures by adding `role="dialog"` to the loading fallback container in [`src/components/MedicalDisclaimer.tsx`](src/components/MedicalDisclaimer.tsx:30) and clearing `DISCLAIMER_SEED_LATCH` in [`tests/e2e/auth.spec.ts`](tests/e2e/auth.spec.ts:16) `beforeEach` hook.

## [2.8.2] - 2026-10-18
### Fixed
- Fixed tab navigation in [`src/App.tsx`](src/App.tsx:1) and [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) to use [`navigateTo()`](src/utils/navigation.ts:29) utility from [`src/utils/navigation.ts`](src/utils/navigation.ts:1) instead of `useAppContext`, ensuring correct base path support (`/FoodMapper`) on GitHub Pages.

## [2.8.2] - 2026-10-18
### Fixed
- Fixed tab navigation (`handleSetActiveTab`) in [`src/context/AppContext.tsx`](src/context/AppContext.tsx:58) to use [`navigateTo()`](src/utils/navigation.ts:29) from [`src/utils/navigation.ts`](src/utils/navigation.ts:1), ensuring correct base path support (`/FoodMapper`) on GitHub Pages.

## [2.8.1] - 2026-10-18
### Fixed
- Fixed 404 Not Found error and routing issues on page reload and direct visits for GitHub Pages SPA sub-routes via query parameter fallback in [`public/404.html`](public/404.html:1), [`public/.nojekyll`](public/.nojekyll:1), and history state restoration in [`src/App.tsx`](src/App.tsx:1).

## [2.8.0] - 2026-10-18
### Fixed
- Fixed UI freeze and navigation lockup when clicking action buttons (like "vai a dieta") in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx) and context.
- Fixed 404 Not Found error on page reload for SPA routes via robust query parameter routing fallback in [`public/404.html`](public/404.html), history state restoration in [`src/App.tsx`](src/App.tsx), and Netlify/Vercel rewrite configurations (`_redirects` / `vercel.json`).

## [2.7.9] - 2026-10-16
### Changed
- Updated GitHub Actions CI workflow to deploy to GitHub Pages on push to `main` branch.
- Renamed `deploy-preview` job to `deploy` in [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
- Updated `homepage` URL in [`package.json`](package.json) to match the new repository `CherrugDeveloper/FoodMapper`.

## [2.7.8] - 2026-10-15
### Added
- Restored [`check_keys.cjs`](check_keys.cjs) at the repository root to ensure robust translation key verification across all locales.

### Fixed
- Resolved `MODULE_NOT_FOUND` error when executing localization checks in CI pipelines.

### Improvements
- Enhanced translation key validation script to audit missing or extra translation keys automatically.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.7.8] - 2026-10-15

### Fixed
- Restored missing [`check_keys.cjs`](check_keys.cjs:1) script at the repository root to resolve `MODULE_NOT_FOUND` errors during CI translation key audits.

### Fixed
- Verified codebase and workflow integrity passing all linter and type checks.

## [2.7.6] - 2026-10-15

### Improved
- Cleaned up redundant deployment workflows and optimized CI workflow concurrency, caching, and artifact uploads in [`ci.yml`](.github/workflows/ci.yml).

## [2.7.5] - 2026-10-15

### Fixed
- Fixed GitHub Pages deployment accessibility by adding the missing [`actions/configure-pages@v5`](.github/workflows/Deploy.yml) setup step in [`Deploy.yml`](.github/workflows/Deploy.yml).

## [2.7.3] - 2026-10-15

### Added
- Added runtime schema validation for localStorage storage utilities in `src/utils/storage.ts`.

### Fixed
- Verified zero errors/warnings on ESLint and TypeScript checks, and all unit tests passed successfully.

## [2.6.9] - 2026-10-14

### Fixed
- Fixed Playwright E2E mobile viewport selector failure for the Diary button in `tests/e2e/diary.spec.ts` by robustly checking element visibility and falling back to the mobile icon selector.

## [2.6.8] - 2026-10-14

### Added
- Implemented robust mobile navigation and viewport visibility checks across E2E test suite.

## [2.6.7] - 2026-10-14

### Fixed
- Fixed locale and translation keys for robust multilingual support across English, Italian, German, Spanish, and French.

## [2.6.6] - 2026-10-14

### Added
- Added comprehensive E2E test coverage for navigation, diet plan generation, and i18n localization.

## [2.6.5] - 2026-10-14

### Added
- Implemented memoization in nutritional calculation pipeline and bilingual food search hooks.
- Added comprehensive notification permission handling and disclaimer validation logic.
