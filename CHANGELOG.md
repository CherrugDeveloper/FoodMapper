# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.44] - 2026-11-08
### Changed
- Refined UI styling, interactive state transitions, and button accessibility attributes in [`DayNavigator.tsx`](src/components/DayNavigator.tsx).

## [2.12.43] - 2026-11-08
### Added
- Start date modification support in [`DayNavigator.tsx`](src/components/DayNavigator.tsx) via a lightweight inline toggleable control.

### Fixed
- Unused `updateStartDate` variable in [`DietPlan.tsx`](src/components/DietPlan.tsx) resolved by passing it to [`DayNavigator.tsx`](src/components/DayNavigator.tsx).

## [2.12.42] - 2026-11-08
### Fixed
- UI harmonization between [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx) and [`DietPlan.tsx`](src/components/DietPlan.tsx).
- Missing `onNavigate` prop in [`DayNavigator.tsx`](src/components/DayNavigator.tsx) within [`DietPlan.tsx`](src/components/DietPlan.tsx).
