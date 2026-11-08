# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.12.37] - 2026-11-08

### Fixed
- Fixed interface freezing and main-thread blocking when interacting with [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) and [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx) by replacing massive upfront day generation with sliding window lazy generation in [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts).
- Fixed UI freezing on meal confirmation in [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx).
- Updated and refined nutritional calculator info popup texts in [`public/locales/it/translation.json`](public/locales/it/translation.json).
