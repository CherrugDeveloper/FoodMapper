# IBS Nutrition App

A comprehensive nutrition tracking and meal planning application designed to help users manage their dietary needs, track nutritional intake, and optimize their health.

## Version

Current version: `2.12.21`

## Recent Updates

### v2.12.21 (2026-11-07) - Patch Release
- **PhaseProgress Visibility & Pre-Start States**: Ensured `PhaseProgress` component correctly persists visibility and handles pre-start states without negative values or `null` returns in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx)
- **Timezone-aware Day Calculations**: Refined timezone-safe date parsing and day index calculations across [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts)

### v2.12.20 (2026-11-07) - Patch Release
- **Pre-Start Badge Suppression**: Suppressed incorrect `P0` phase badges on pre-start days in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:156)
- **Counter Translation Interpolation**: Fixed raw string interpolation in day counter in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:314)
- **Day Selection Performance**: Optimized calendar day selections with `useMemo` for `daysMap` in [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx:60)
- **PhaseProgress Pre-Start Handling**: Resolved negative day index issues and persisted component visibility in [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:28)
- **Timezone-Safe Date Parsing**: Implemented robust local date parsing (`parseLocalDate`) in [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts:483) and [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts:1)

### v2.12.19 (2026-11-06) - Patch Release
- **Past Calendar Navigation**: Enabled navigation to past dates in diet plan calendar with 60-day history support
- **Month Navigation**: Added month navigation controls (prev/next month) in DayNavigator
- **Date Display**: Integrated formatted actual date display into day cards
- **Fixed**: Negative modulo bug in `pickRotating` function for proper food rotation
- **Fixed**: Test assertion updated to verify `currentDayIndex` changes
- **Extended**: MAX_DAYS_AHEAD extended to 3650 days for infinite maintenance phase continuation

### v2.12.18 (2026-11-06) - Minor Release
- Centered toast notifications horizontally and text within in [`src/components/Toast.tsx`](src/components/Toast.tsx)
- Cleaned up raw strings in [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx) with proper i18n translation keys
- Redesigned [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) to remove date ranges and day numbers from week headers, integrate formatted actual dates into day cards, and add month navigation controls
- Updated [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx) to dynamically calculate phase total duration instead of hardcoded 7 days

### v2.12.17 (2026-11-06) - Minor Release
- Added comprehensive diet meal count translations for German, Spanish, and French locales with scientific guidance messages for 1-7 meals per day options

## Features

- **Nutritional Tracking**: Log and analyze food intake with detailed nutritional breakdowns powered by memoized calculation pipelines in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- **Meal Planning**: Generate personalized meal plans based on dietary requirements, including configurable daily meal counts (1-7) with calorie/protein distribution.
- **Bilingual Food Search**: Search and filter foods in multiple languages (supporting both translated names and raw food names) via [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1).
- **Notification Reminders**: Set up reminders for medication, water intake, and health tasks with comprehensive permission handling in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).
- **Disclaimer Management**: Language-specific disclaimers with type validation and expiration checks in [`src/utils/storage.ts`](src/utils/storage.ts:1).
- **Tab Navigation & Routing**: Seamless tab switching and SPA support on GitHub Pages via [`src/App.tsx`](src/App.tsx:86) and [`src/utils/navigation.ts`](src/utils/navigation.ts:23).
- **Sleep & Workout Tracking**: Sleep tracking, sleep sounds, and workout plan generation.
- **CI/CD Pipeline**: Optimized GitHub Actions workflows in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:241) suppressing deprecation warnings.

## Installation

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/CherrugDeveloper/FoodMapper.git
   cd FoodMapper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### Running the Application

- Start the development server:
  ```
  npm run dev
  ```

- Build for production:
  ```
  npm run build
  ```

- Run tests:
  ```
  npm run test:run
  ```

## Key Hooks & Utilities

- **Hooks**:
  - [`useFoodSearch`](src/hooks/useFoodSearch.ts:1): Encapsulates bilingual food search functionality.
  - [`useNotificationPermission`](src/hooks/useNotificationPermission.ts:1): Manages browser notification permissions and timers.
  - [`useDisclaimerGate`](src/context/AppContext.tsx:1): Isolates language context and disclaimer acceptance.

- **Utilities**:
  - [`storage.ts`](src/utils/storage.ts:1): Secure storage with runtime schema validation and expiration.
  - [`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1): Memoized nutritional calculation pipeline for high performance.
  - [`navigation.ts`](src/utils/navigation.ts:1): Base-path-aware navigation handling for GitHub Pages deployment.

## Architecture Improvements

### New Patterns Implemented

- **Memoization**: Added to the nutritional calculation pipeline in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1) to optimize performance.
- **Bilingual Matching**: Implemented in [`FoodFilter`](src/components/FoodFilter.tsx:1) and [`useFoodSearch`](src/hooks/useFoodSearch.ts:1) for accurate food search across languages.
- **Notification Permissions**: Comprehensive handling of `Notification.requestPermission()` states and feature detection in [`src/hooks/useNotificationPermission.ts`](src/hooks/useNotificationPermission.ts:1).
- **Disclaimer Storage**: Updated with runtime type validation and expiration checks in [`src/utils/storage.ts`](src/utils/storage.ts:1).
- **Tab Navigation & SPA Routing**: Fixed tab switching bugs and routing fallbacks in [`src/App.tsx`](src/App.tsx:86), [`src/utils/navigation.ts`](src/utils/navigation.ts:23), and [`public/404.html`](public/404.html:1).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

### Code Style

- Follow the existing TypeScript and ESLint configurations.
- Ensure all hooks adhere to established architectural patterns.
- Use consistent naming conventions and strict type safety.

### Documentation Updates

When updating version strings in README.md, the documentation-writer should be consulted to ensure proper formatting and consistency.

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE:1) file for details.

## Changelog

Full version history and change log are maintained in [`CHANGELOG.md`](CHANGELOG.md:1).
