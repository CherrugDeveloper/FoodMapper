# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.5] - 2026-11-05

### Fixed
- PWA translation caching and InfoPopup mobile fixes ([e8e7869](https://github.com/CherrugDeveloper/FoodMapper/commit/e8e7869))

### Security
- Fixed InfoPopup not appearing on hover or click by resolving tooltip positioning and state dependency issues ([4a6bbaa](https://github.com/CherrugDeveloper/FoodMapper/commit/4a6bbaa))

## [2.12.4] - 2026-11-05

### Changed
- Improved allergen button contrast in InfoPopup ([a61d554](https://github.com/CherrugDeveloper/FoodMapper/commit/a61d554))

### Fixed
- InfoPopup PWA portable positioning with fixed coordinates ([a61d554](https://github.com/CherrugDeveloper/FoodMapper/commit/a61d554))

## [2.12.3] - 2026-11-05

### Fixed
- PWA InfoPopup and translation caching issues on portable devices ([e8e7869](https://github.com/CherrugDeveloper/FoodMapper/commit/e8e7869))

## [2.12.2] - 2026-11-05

### Fixed
- InfoPopup viewport positioning ([87c582f](https://github.com/CherrugDeveloper/FoodMapper/commit/87c582f))

### Changed
- Improved allergen button contrast

### Fixed
- Header removal to fix UI display issues

## [2.12.1] - 2026-11-05

### Added
- Complete application internationalization across food filters and phase diet modules ([b1e2036](https://github.com/CherrugDeveloper/FoodMapper/commit/b1e2036))

### Fixed
- Missing IBS dropdown options and results placeholder text translation

### Changed
- Migrated i18n to bundled JSON modules
- Implemented multi-language calculator layout
- Refactored i18n to use external JSON localization files and HTTP backend
- Implemented localized articles data structures
- Added language switcher header

## [2.12.0] - 2026-11-05

### Added
- Differential diagnosis article
- Bi-directional navigation links for PubMed articles
- Educational data component

### Fixed
- Localized educational article categories based on current active language
- Compiled scope errors in FoodFilter component localization

### Changed
- Updated PubMed source URLs to stable direct article links

## [2.11.2] - 2026-11-05

### Fixed
- Disclaimer acceptance race condition and modal re-attachment in CI ([5a25e52](https://github.com/CherrugDeveloper/FoodMapper/commit/5a25e52))

## [2.11.1] - 2026-11-05

### Added
- Initial project setup and core functionality

---

## [2.10.0] - Previous Release

### Features
- Tab-based navigation structure
- Diary tab with food tracking
- Workout plan tab
- Health conditions section
- Seasonality filter in food selection

### Technical
- Project internationalization framework
- Responsive design for multiple devices
- PWA (Progressive Web App) capabilities
- Build and deployment automation

---

## [2.9.0] - Pre-FoodMapper Release

### Original Features
- Nutritional needs calculation function
- Initial FoodMapper app structure for IBS nutrition management
- React-based frontend application
- TypeScript configuration for type safety