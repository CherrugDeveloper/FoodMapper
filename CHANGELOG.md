# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.59] - 2026-11-09

### Fixed
- Fixed DayNavigator import in DietPlan.tsx and updated documentation
- Fixed TypeScript import error in `src/components/DietPlan.tsx` by correcting DayNavigator import from named to default export
- Fixed unused import and `any` type in `tests/uiChanges.test.tsx` (removed unused `waitFor`, added proper `DateKey` type)
- Fixed unused variables and lint errors in `src/components/DayNavigator.tsx` (removed `isEditingStartDate`, `setNewStartDateInput`, `handleStartDateSubmit`)

### Changed
- Improved meal count buttons in DietPlan.tsx with simpler styling (number + symbol only)
- Harmonized dietary calculator warning icon colors (orange for high, amber/yellow for medium severity)
- Phase 0 Preparazione now has visible sky blue background color in calendar
- Phase 3 day number display capped at 21 to prevent overflow ("giorno fase x / 21" when x > 21)
- Phase background colors are now visible without day selection

[2.12.59]: https://github.com/marco/foodmapper/compare/v2.12.58...v2.12.59
[2.12.58]: https://github.com/marco/foodmapper/compare/v2.12.57...v2.12.58
[2.12.57]: https://github.com/marco/foodmapper/compare/v2.12.56...v2.12.57
[2.12.56]: https://github.com/marco/foodmapper/compare/v2.12.55...v2.12.56
[2.12.55]: https://github.com/marco/foodmapper/compare/v2.12.54...v2.12.55
[2.12.54]: https://github.com/marco/foodmapper/compare/v2.12.53...v2.12.54
[2.12.53]: https://github.com/marco/foodmapper/compare/v2.12.52...v2.12.53
[2.12.52]: https://github.com/marco/foodmapper/compare/v2.12.51...v2.12.52
[2.12.51]: https://github.com/marco/foodmapper/compare/v2.11.0...v2.12.51
[2.12.50]: https://github.com/marco/foodmapper/compare/v2.11.0...v2.12.50
[2.12.0]: https://github.com/marco/foodmapper/compare/v2.11.0...v2.12.0