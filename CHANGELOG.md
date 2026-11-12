# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.69] - 2026-11-11

### Fixed
- Resolved navigation UI freeze in DietPlan component.
- Prevented navigation blocking after reaching diet view.
- Resolved navigation throttle blocking UI buttons in DietPlan and App tabs.
- Resolved stale closure and infinite update loop in DietPlan hook and context.
- Resolved navigation delays and keyboard blocking in DietPlan and DayMetaModal.
- Resolved stale closure bugs in DayNavigator component using ref pattern.
- Removed debug console statements from dietPlan components.

### Changed
- Removed unused import of `touchNavigationTime`.
- Refactored `DayNavigator` with timezone safety and a11y improvements.
- Updated documentation and git workflow.

### Added
- Documented event listener pattern in `AGENTS.md`.
