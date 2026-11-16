### Fixed

### Changed

### Added
## [2.12.90] - 2026-11-16

### Fixed
- **MealGenerator**: Fixed protein distribution normalization - daily protein total now exactly equals 100g target by applying scale factor `100 / totals.protein` after all meals calculated, preventing clampGrams from forcing each meal's protein minimum 100g

### Changed
- **AppContext**: Wrapped `useDietPlan()` in `useMemo()` to prevent infinite re-render loop (per AGENTS.md rule). This ensures stable dietPlan identity and proper cascading recalculation when nutritional requirements change.

### Added

## [2.12.91] - 2026-11-16

### Fixed
- **AppContext**: Wrapped `useDietPlan()` in `useMemo()` to prevent infinite re-render loop (per AGENTS.md rule)

### Changed

### Added

## [2.12.93] - 2026-11-16

### Fixed
- **MealGenerator**: Added `slotGrams` tracking variable for improved protein distribution monitoring
- **Debug tests**: Updated type annotations from `any` to specific types for better type safety

### Changed

### Added

## [2.12.92] - 2026-11-16

### Fixed
- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

### Changed

### Added

## [2.12.88] - 2026-11-16
