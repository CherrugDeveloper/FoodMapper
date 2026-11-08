# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.41] - 2026-11-08

### Added
- Weight-dependent caffeine intake calculation based on EFSA scientific guidelines (3 mg/kg bw/day, adjusted for sensitive groups and pregnancy/hypertension).

### Changed
- Refined `NutritionalCalculator` layout to place each `InfoButton` directly next to its corresponding reference string.
- Standardized `InfoButton` theme and selection area styling to guarantee optimal contrast in light and dark modes.
- Consolidated separate caffeine scientific description and guideline strings into a unified EFSA explanatory string (`caffeine_plain_explanation`) across all locale files (`de`, `en`, `es`, `fr`, `it`).

## [2.12.40] - 2026-11-08

### Added
- Automated Git versioning, changelog generation, and documentation update workflow (`auto-git`).
- Enhanced notification permission handling and disclaimer storage with expiration and type validation.

### Changed
- Updated README.md and documentation following Utrecht University Workshop conventions.
- Fine-tuned `.gitignore` to exclude sensitive files and directories (`.env`, `.env.*`, `*.key`, `*.pem`, `*.cert`, `plans/`).

## [2.12.39] - 2026-11-07
### Added
- Initial modular architecture with PWA support, multi-language internationalization (i18next), and comprehensive nutritional calculation engines.
