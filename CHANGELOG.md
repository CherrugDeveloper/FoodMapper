# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## [2.12.45] - 2026-11-08

### Changed
- Harmonized [`InfoButton`](src/components/InfoPopup.tsx:14) styling and positioning across [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:52) and [`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1), attaching them directly to reference strings.
- Refactored [`InfoPopup`](src/components/InfoPopup.tsx:14) descriptive strings to be purely descriptive and explanatory without name-description prefixes.
- Converted EFSA dark chocolate 70% calculation in [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:600) from grams to integer multiples of 100g chocolate bars.
- Enhanced meal count selector in [`DietPlan.tsx`](src/components/DietPlan.tsx:13) with warning symbols and recommended choices.

### Fixed
- Removed duplicate heading "Medicinali assunti" in [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:455).
- Corrected raw string `medication_recognition_button`.
- Restored visual styling and fixed UI race condition on click in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:13) by synchronizing `selectedDate` state with `currentDayIndex` and `state.days` via `useEffect`.

## [2.12.44] - 2026-11-07

### Fixed
- Stabilized sleep tracker time calculations and persistence across modal resets.
- Fixed i18n initialization fallback and missing translation keys.
- Resolved build integrity checks and TypeScript compilation errors.
