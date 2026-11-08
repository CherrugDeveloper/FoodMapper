# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning.

## [2.12.47] - 2026-11-08

### Added
- Monthly calendar grid view in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1) with month navigation controls (< / >), saints of the day, moon phases, weekends/holidays, diet phases, and interactive user notes, birthdays, events, and menstrual cycle tracking.

### Changed
- Redesigned daily meals section in [`DietPlan.tsx`](src/components/DietPlan.tsx:1) and [`MealCard.tsx`](src/components/dietPlan/MealCard.tsx:1) for a clean, structured, and intuitive layout.

### Fixed
- Resolved UI click responsiveness freeze bug by rendering exclusively the current month's calendar grid days in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1).

## [2.12.46] - 2026-11-08

### Changed
- Unified InfoButton styling and positioning across [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1) and [`InfoPopup.tsx`](src/components/InfoPopup.tsx:1).
- Redesigned meals-per-day selection control in [`DietPlan.tsx`](src/components/DietPlan.tsx:1) with a modern 7-column grid layout and clean badges.
- Stripped calendar-style clutter and extraneous metadata from [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Resolved button interaction freeze bug in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1) by directly calling navigation handlers.
- Updated Italian and English translation files ([`translation.json`](public/locales/it/translation.json:1)) with comprehensive, non-repetitive tooltip texts.

### Fixed
- Fixed UI interaction freeze defect on date selection buttons in [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1).
- Removed redundant "Medicinali assunti" heading below allergen selection in [`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1).
