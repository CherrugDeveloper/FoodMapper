# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.34] - 2026-11-07T22:35:00+01:00

### Fixed
- Resolve InfoPopup initial rendering flicker with double requestAnimationFrame for stable initial positioning ([be8d1df](https://github.com/cherrugdeveloper/FoodMapper/commit/be8d1df))
- Harden navigation utilities in `src/utils/navigation.ts` against race conditions with duplicate path checks
- Fix UI/i18n translation keys in InfoPopup, DayNavigator, and MealCard components
- Resolve day navigator badge display issues
- Fix meal card navigation and confirmation handlers synchronization with Diary
- Resolve InfoPopup PWA portable positioning with fixed coordinates

### Changed
- Improved InfoPopup initial rendering stability to prevent visual flickering

## [2.12.33] - 2026-11-07

### Fixed
- Resolve InfoPopup initial rendering, navigation race conditions, and documentation issues

## [2.12.32]

### Added
- Comprehensive UI/UX fixes and refinements across diet plan, diary, day navigator, and info popup

### Fixed
- Multiple UI component bug fixes and refinements

## [2.12.31]

### Fixed
- Component bug fixes and documentation updates

## [2.12.30]

### Added
- NutritionalCalculator i18n and caffeine calculator features

### Fixed
- Documentation updates and component bug fixes

## [2.12.28]

### Fixed
- DayNavigator calendar and PhaseProgress component calculations

## [2.12.27]

### Added
- Refactored DayNavigator with strict month grey-out, phase background tinting, independent weekend styling
- Saint/moon phase enrichment in calendar display

### Changed
- Improved calendar phase background styling and legend

## [2.12.21]

### Fixed
- PhaseProgress visibility and pre-start states
- Build validation improvements
- Pre-start phase badge and counter interpolation
- Sluggish selection handling

## [2.12.19]

### Added
- Past navigation capability in DayNavigator
- Month controls for calendar navigation
- Infinite maintenance phase support

## [2.12.16]

### Added
- Refactored phase progress visualization
- Toast notification improvements
- Day counters optimization

### Fixed
- Navigation race condition resolution

## [2.12.15] - Patch release

### Fixed
- Tab switching race conditions
- Toast notifications
- Weekend highlighting

## [2.12.13]

### Added
- Redesigned DayNavigator with full week multiples
- Prominent holiday indicators

## [2.12.12]

### Added
- Redesigned DayNavigator with week-per-row layout
- Expanded meal count selector

## [2.12.11]

### Maintenance
- Automated release and repository maintenance

## [2.12.10]

### Maintenance
- Automated release and repository maintenance

## [2.12.9]

### Changed
- README version update
- CI workflow improvements

## [2.12.8]

### Changed
- CHANGELOG, README, and version updates

## [2.12.7]

### Changed
- CHANGELOG, README, and CI workflow updates

## [2.12.5]

### Fixed
- Tab switching and toast notification issues
- Weekend highlighting corrections

## [2.12.4]

### Fixed
- Lint error resolution
- UI component fixes

## [2.12.3]

### Fixed
- PWA translation caching
- InfoPopup mobile fixes

## [2.12.0]

### Added
- Holiday detection in DayNavigator
- Week indicator support
- Recipe navigation
- Configurable meal count in diet plan

## [2.11.3]

### Changed
- Package-lock.json update

## [2.11.2]

### Changed
- Version, CHANGELOG, and README updates

## [2.11.1]

### Changed
- README hints and package.json version update
- CI workflow updates

## [2.10.0]

### Added
- Medication reminder functionality with notification scheduling

### Changed
- Vite-plugin-pwa update to v2.0.0

## [1.1.0]

### Changed
- Version, CHANGELOG, and README updates

[2.12.34]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.33...v2.12.34
[2.12.33]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.32...v2.12.33
[2.12.32]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.31...v2.12.32
[2.12.31]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.30...v2.12.31
[2.12.30]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.28...v2.12.30
[2.12.28]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.27...v2.12.28
[2.12.27]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.21...v2.12.27
[2.12.21]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.19...v2.12.21
[2.12.19]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.16...v2.12.19
[2.12.16]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.15...v2.12.16
[2.12.15]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.13...v2.12.15
[2.12.13]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.12...v2.12.13
[2.12.12]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.11...v2.12.12
[2.12.11]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.10...v2.12.11
[2.12.10]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.9...v2.12.10
[2.12.9]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.8...v2.12.9
[2.12.8]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.7...v2.12.8
[2.12.7]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.5...v2.12.7
[2.12.5]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.4...v2.12.5
[2.12.4]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.3...v2.12.4
[2.12.3]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.0...v2.12.3
[2.12.0]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.11.3...v2.12.0
[2.11.3]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.11.2...v2.11.3
[2.11.2]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.11.1...v2.11.2
[2.11.1]: https://github.com/cherrugdeveloper/FoodMapper/compare/v1.14.2...v2.11.1
[1.14.2]: https://github.com/cherrugdeveloper/FoodMapper/compare/v1.14.1...v1.14.2