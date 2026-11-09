# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.59] - 2026-11-09

### Fixed
- Fixed DayNavigator import in DietPlan.tsx - corrected from named to default export
- Fixed TypeScript import error in `src/components/DietPlan.tsx`
- Fixed unused import and `any` type in `tests/uiChanges.test.tsx` (removed unused `waitFor`, added proper `DateKey` type)
- Fixed unused variables and lint errors in `src/components/DayNavigator.tsx` (removed `isEditingStartDate`, `setNewStartDateInput`, `handleStartDateSubmit`)
- Fixed calendar day selection desync and enhanced weekend indicator styling
- Fixed SPA deep-linking 404 error and i18next re-initialization loop

### Changed
- Improved meal count buttons in DietPlan.tsx with simpler styling (number + symbol only)
- Harmonized dietary calculator warning icon colors (orange for high, amber/yellow for medium severity)
- Enhanced navigation event handler with error recovery in `src/App.tsx`
- Added test location provider for better testability in `src/utils/navigation.ts`

### Added
- Added comprehensive navigation tests in `tests/navigation.test.ts` (27 test cases)

[2.12.59]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.58...v2.12.59
[2.12.58]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.57...v2.12.58
[2.12.57]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.56...v2.12.57
[2.12.56]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.55...v2.12.56
[2.12.55]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.54...v2.12.55
[2.12.54]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.53...v2.12.54
[2.12.53]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.52...v2.12.53
[2.12.52]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.51...v2.12.52
[2.12.51]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.50...v2.12.51
[2.12.50]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.49...v2.12.50
[2.12.49]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.48...v2.12.49
[2.12.48]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.47...v2.12.48
[2.12.47]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.46...v2.12.47
[2.12.46]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.45...v2.12.46
[2.12.45]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.44...v2.12.45
[2.12.44]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.43...v2.12.44
[2.12.43]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.42...v2.12.43
[2.12.42]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.41...v2.12.42
[2.12.41]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.40...v2.12.41
[2.12.40]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.39...v2.12.40
[2.12.39]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.38...v2.12.39
[2.12.38]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.37...v2.12.38
[2.12.37]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.36...v2.12.37
[2.12.36]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.35...v2.12.36
[2.12.35]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.34...v2.12.35
[2.12.34]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.33...v2.12.34
[2.12.33]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.32...v2.12.33
[2.12.32]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.31...v2.12.32
[2.12.31]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.30...v2.12.31
[2.12.30]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.29...v2.12.30
[2.12.29]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.28...v2.12.29
[2.12.28]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.27...v2.12.28
[2.12.27]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.26...v2.12.27
[2.12.26]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.25...v2.12.26
[2.12.25]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.24...v2.12.25
[2.12.24]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.23...v2.12.24
[2.12.23]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.22...v2.12.23
[2.12.22]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.21...v2.12.22
[2.12.21]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.20...v2.12.21
[2.12.20]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.19...v2.12.20
[2.12.19]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.18...v2.12.19
[2.12.18]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.17...v2.12.18
[2.12.17]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.16...v2.12.17
[2.12.16]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.15...v2.12.16
[2.12.15]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.14...v2.12.15
[2.12.14]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.13...v2.12.14
[2.12.13]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.12...v2.12.13
[2.12.12]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.11...v2.12.12
[2.12.11]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.10...v2.12.11
[2.12.10]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.9...v2.12.10
[2.12.9]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.8...v2.12.9
[2.12.8]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.7...v2.12.8
[2.12.7]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.6...v2.12.7
[2.12.6]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.5...v2.12.6
[2.12.5]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.11.1...v2.12.5
[2.11.2]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.11.1...v2.11.2
[2.11.1]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.10.0...v2.11.1