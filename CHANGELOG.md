# Changelog

## [2.12.123] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by renaming artifact from `github-pages` to `build-artifact` and ensuring all jobs (build, e2e, deploy) use the same artifact name
- **CI/CD**: Removed duplicate ESLint execution from build job (already runs in lint job)
- **CI/CD**: Removed e2e from deploy job dependencies - deploy now only waits for build to succeed, allowing faster deployments
- **CI/CD**: Added timeout-minutes: 10 to deploy job to prevent hanging

## [2.12.122] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by removing duplicate artifact download from deploy job - the artifact is now used directly from the build job
- **CI/CD**: Removed duplicate ESLint execution from build job (already runs in lint job)

## [2.12.121] - 2026-11-21

### Fixed
- **CI/CD**: Fixed "Multiple artifacts named 'github-pages' were unexpectedly found" error by adding explicit `needs: [build, e2e]` dependency to deploy job and `if-no-files-found: error` to artifact download steps

## [2.12.120] - 2026-11-21

### Fixed
- **React Hooks**: Fixed critical crash caused by calling `useDietPlan` hook inside `useMemo` - violated React Rules of Hooks causing infinite re-render loop
- **i18n**: Added `i18n.isInitialized` guard in `src/main.tsx` to prevent race condition where 'initialized' event was already emitted before listener was attached
- **MedicationSelector**: Added null-safety guards for `.length` accesses to prevent "Cannot read properties of undefined (reading 'length')" crash
- **E2E Tests**: Added missing `calculateButton.click()` in `verifyCalculatorResults()` test helper function
- **E2E Tests**: Fixed Italian translations in test expectations - corrected `report_proteins` to "Proteine", `report_fats` to "Grassi", `report_carbs_short` to "Carb"
- **Language Switching**: Implemented proper remount strategy on language change using `languageKey` counter and `language-changed` event dispatch
- **App**: Extracted disclaimer acceptance state to AppContext and added proper language change detection

### Changed
- **App**: Reorganized imports in `src/App.tsx` for consistency
- **AppContext**: Added `forceDisclaimer`, `currentLanguage`, `languageKey` props to AppProvider for proper language change handling
- **AppContext**: Moved `handleAcceptDisclaimer` callback and `isDisclaimerAccepted` state into context
- **MedicationSelector**: Fixed `brandsForSelected` to handle empty array case when no medication selected

### Tests
- All 144 unit tests pass
- All 32 i18n E2E tests pass

## [2.12.119] - 2026-11-20
### Fixed
- **Files**: Added trailing newline to NutritionalCalculator.tsx for Git compliance

## [2.12.118] - 2026-11-19
### Fixed
- **E2E Tests**: Fixed 10 failing i18n calculator translation tests (it, en, de, es, fr)
- **Calculator**: Added optional chaining (?.) to prevent useEffect crashes on undefined lengths
- **CI**: Removed retry system - set --retries=0 in .github/workflows/ci.yml and playwright.config.ts

## [2.12.117] - 2026-11-19
### Fixed
- **E2E Tests**: Fixed 10 failing i18n calculator translation tests (it, en, de, es, fr)
- **Calculator**: Added optional chaining (?.) to prevent useEffect crashes on undefined lengths
- **CI**: Removed retry system - set --retries=0 in .github/workflows/ci.yml and playwright.config.ts

## [2.12.116] - 2026-11-19
### Fixed
- **PWA / TypeScript**: Replaced invalid dependency vite-pwa with vite-plugin-pwa to resolve virtual:pwa-register and vite-plugin-pwa type declaration errors

## [2.12.115] - 2026-11-19
### Fixed
- **Dependencies**: Updated @testing-library/user-event to ^14.6.13 and vite-pwa to ^1.0.2
- **Tests**: Fixed userEvent import in tests/uiChanges.test.tsx to use named export

## [2.12.114] - 2026-11-19
### Fixed
- **Tests**: Verified all 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors
- **Git**: Repository state verified and ready for version bump

## [2.12.113] - 2026-11-18
### Fixed
- **Tests**: Verified all 144 tests pass successfully with vitest run
- **ESLint**: Code linting passes with zero errors
- **Git**: Repository state verified and ready for version bump

## [2.12.113] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles

## [2.12.112] - 2026-11-18
### Fixed
- **ESLint**: Fixed unused 'lang' parameter in tests/e2e/i18n.spec.ts waitForFunction callback

## [2.12.111] - 2026-11-18
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Changed
- **Vitest configuration**: Updated pool strategy from 'vmThreads' to 'forks' for improved stability and to resolve Vitest 5 module binding issues
- **i18n test structure**: Refactored translation map structure and enhanced language parameter handling for better test reliability
- **Calculator results verification**: Added comprehensive translation coverage for all supported languages in calculator results
- **Language state verification**: Improved consistency in language state verification across test cycles