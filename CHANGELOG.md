# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.60] - 2026-11-10

### Changed

- Refactored diet plan day generation to be demand-based instead of pre-loading
- DayCalendar now generates days dynamically only on month switch
- Removed pre-loading of 30 days in past and 180 days ahead
- `DAYS_TO_GENERATE_AHEAD` changed from 28 to 60 days

### Fixed

- Fixed event propagation bug in DayNavigator where `onNavigate` and `onClick` stop working after interaction
- Removed `stopImmediatePropagation()` calls that were blocking event handlers
- Phase 3 display now correctly shows "x/∞" with infinity symbol instead of "Giorno x/21"

## [2.12.59] - 2026-11-09

### Fixed

- Resolved DayNavigator import in DietPlan.tsx

## [2.12.58] - 2026-11-09

### Fixed

- Removed unused navigateDay from DayNavigator component props

## [2.12.57] - 2026-11-08

### Fixed

- Removed unused activeMeta variable in DayNavigator

## [2.12.56] - 2026-11-08

### Fixed

- Fixed DayNavigator calendar and PhaseProgress component calculations

## [2.12.55] - 2026-11-07

### Fixed

- Fixed phaseDay calculation, calendar phase background styling/legend
- Fixed pre-start phase badge, counter interpolation, sluggish selection

## [2.12.54] - 2026-11-07

### Fixed

- Fixed UI performance, pre-start state, i18n and layout issues
- Fixed diet-plan: render PhaseProgress statically and handle pre-start fallback state

## [2.12.53] - 2026-11-06

### Fixed

- Fixed Spa 404 resource loading on deep link /diet
- Updated docs and changelog

## [2.12.52] - 2026-11-06

### Fixed

- Fixed scroll reset, date init, calendar feedback
- Fixed PWA standalone mode

## [2.12.51] - 2026-11-08

### Changed

- Refactored DayNavigator with timezone safety and accessibility improvements
- Updated documentation

## [2.12.50] - 2026-11-08

### Fixed

- Fixed undefined initial language bug and 404 translation fetch error

## [2.12.49] - 2026-11-08

### Fixed

- Fixed saint name truncation
- Updated weekend badges to wknd
- Resolved day selection logic

## [2.12.48] - 2026-11-08

### Added

- Weekend badges to calendar view
- Saint name display on calendar days

### Fixed

- Day selection logic and visual indicators

## [2.12.47] - 2026-11-08

### Added

- Exclusive phase background colors in calendar
- Moon phase indicators
- Weekend styling enhancements

### Changed

- Refactored DayNavigator with month view grid

## [2.12.46] - 2026-11-08

### Fixed

- DayNavigator interaction fix
- Component refactorings
- Updated info tooltips

## [2.12.45] - 2026-11-08

### Changed

- Harmonized InfoButton and cleaned InfoPopup
- Enhanced DietPlan meal count selector
- Fixed DayNavigator race conditions

## [2.12.44] - 2026-11-08

## [2.12.43] - 2026-11-08

### Fixed

- Added start date modification in DayNavigator
- Fixed lint errors

## [2.12.42] - 2026-11-08

### Fixed

- Harmonized meal count selector
- Fixed DayNavigator onNavigate prop
- Restored all navigation functionality

## [2.12.41] - 2026-11-08

### Changed

- Refined NutritionalCalculator layout
- Weight-dependent EFSA caffeine calculations

## [2.12.40] - 2026-11-08

### Added

- Comprehensive navigation test location provider with ancestorOrigins support

### Fixed

- Test environment detection
- Tab switching race conditions

[2.12.60]: https://github.com/cherrugdeveloper/FoodMapper/compare/v2.12.59...v2.12.60