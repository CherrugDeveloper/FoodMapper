# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to Semantic Versioning ([SemVer](https://semver.org/spec/v2.0.0.html)).

## [2.12.57] - 2026-11-09

### Fixed
- Resolved persistent day selection synchronization bug in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:62) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:573) by correctly matching day index with relative date offset instead of array index and eliminating incorrect array length clamping.
- Resolved SPA deep-linking 404 resource errors by safely handling path restoration and base path slicing in [`index.html`](index.html:1) and [`public/404.html`](public/404.html:1).
- Eliminated i18next infinite re-initialization and re-render loops by replacing prototype event monkey-patching with standard listeners in [`src/i18n.ts`](src/i18n.ts:1) and [`src/main.tsx`](src/main.tsx:1).
- Configured robust history API fallback in [`vite.config.ts`](vite.config.ts:7).

## [2.12.56] - 2026-11-09

### Added
- Redesigned the day details and metadata modal trigger button in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:400) to be subtle, unobtrusive (`opacity-40 hover:opacity-100 group-hover:opacity-75 hover:bg-(--accent)/15 hover:text-(--accent)`), and fully event-isolated via [`stopPropagation`](src/components/DayNavigator.tsx:403).

## [2.12.55] - 2026-11-09

### Fixed
- Resolved persistent day selection synchronization bug in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:62) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:573) by correctly matching day index with relative date offset instead of array index and eliminating incorrect array length clamping.

## [2.12.54] - 2026-11-09

### Fixed
- Enabled sourcemap generation and updated i18n translations across supported locales in [`vite.config.ts`](vite.config.ts:1).

## [2.12.0] - 2026-10-01

### Added
- Initial release of FoodMapper: IBS nutrition guide, trifasic diet planning, bilingual food database, recipe manager, shopping list, sleep tracker, workout planner, and educational hub.
- Full PWA support with offline caching and multi-language support (Italian, English, German, Spanish, French).

[2.12.57]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.56...v2.12.57
[2.12.56]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.55...v2.12.56
[2.12.55]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.54...v2.12.55
[2.12.54]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.53...v2.12.54
[2.12.53]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.52...v2.12.53
[2.12.52]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.51...v2.12.52
[2.12.51]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.50...v2.12.51
[2.12.50]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.49...v2.12.50
[2.12.49]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.48...v2.12.49
[2.12.48]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.47...v2.12.48
[2.12.47]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.46...v2.12.47
[2.12.46]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.45...v2.12.46
[2.12.45]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.44...v2.12.45
[2.12.44]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.43...v2.12.44
[2.12.43]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.42...v2.12.43
[2.12.42]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.41...v2.12.42
[2.12.41]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.40...v2.12.41
[2.12.40]: https://github.com/CherrugDeveloper/FoodMapper/compare/v2.12.0...v2.12.40
[2.12.0]: https://github.com/CherrugDeveloper/FoodMapper/releases/tag/v2.12.0