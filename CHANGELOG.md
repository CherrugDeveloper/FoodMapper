## [2.12.107] - 2026-11-17
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts

## [2.12.106] - 2026-11-17
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts

## [2.12.105] - 2026-11-17
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts

## [2.12.105] - 2026-11-17
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts

## [2.12.105] - 2026-11-17
### Fixed
- **i18n E2E tests**: Improved waitForFunction polling interval for language detection (200ms interval during 15s timeout) to prevent state leakage and test timeouts

## [2.12.104] - 2026-11-17
### Fixed
- **MealGenerator**: Fixed protein distribution edge case when meal count is 0

### Changed
- **AppContext**: Optimized recalculation trigger for improved performance

### Added
- **i18n**: Added Spanish locale support for new dietary preferences

## [2.12.103] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.102] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.101] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.100] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.99] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.98] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.97] - 2026-11-17
### Fixed

### Changed

### Added

## [2.12.96] - 2026-11-17
### Fixed
- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

### Changed

### Added

## [2.12.95] - 2026-11-17
### Fixed
- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

### Changed

### Added

## [2.12.94] - 2026-11-17
### Fixed
- **CHANGELOG.md**: Added version 2.12.94 entry with structured categories (Fixed, Changed, Added)
- **README.md**: Added v2.12.94 bug fixes section following existing markdown conventions

### Changed

### Added

## [2.12.93] - 2026-11-16
### Fixed
- **MealGenerator**: Added `slotGrams` tracking variable for improved protein distribution monitoring

### Changed

### Added

## [2.12.92] - 2026-11-16
### Fixed
- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

### Changed

### Added

## [2.12.91] - 2026-11-16
### Fixed
- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

### Changed

### Added

## [2.12.90] - 2026-11-16
### Fixed
- **MealGenerator**: Fixed protein distribution normalization - daily protein total now exactly equals 100g target by applying scale factor `100 / totals.protein` after all meals calculated, preventing clampGrams from forcing each meal's protein minimum 100g

### Changed
- **AppContext**: Wrapped `useDietPlan()` in `useMemo()` to prevent infinite re-render loop (per AGENTS.md rule). This ensures stable dietPlan identity and proper cascading recalculation when nutritional requirements change.

### Added

## [2.12.88] - 2026-11-16
### Fixed

### Changed

### Added

## [2.12.87] - 2026-11-16
### Fixed
- **MealGenerator**: Changed `mealCount` default from 4 to 7, so day plans now generate 7 meals by default matching test expectations

- **Auto-Git Workflow**: Updated versioning, test verification, CHANGELOG generation, documentation updates, and secure staging workflow per auto-git protocol.

- **E2E Tests**: Split sequential multi-language calculator results test into independent test blocks in [`tests/e2e/i18n.spec.ts`](tests/e2e/i18n.spec.ts:238) to prevent state leakage and test timeouts.
