# IBS Nutrition App

A comprehensive nutrition tracking and meal planning application designed to help users manage their dietary needs, track nutritional intake, and optimize their health.

## Version

Current version: `2.12.30`

## Recent Updates

### v2.12.30 (2026-11-07) - Patch Release
- Added scientific safe caffeine limit and equivalent counter (EFSA guidelines) in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:569)
- Migrated hardcoded Italian toast messages and select options in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:82) to fully localized i18n keys
- Enhanced [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx:48) with robust test coverage and build verification

### v2.12.29 (2026-11-07) - Patch Release
- Updated CHANGELOG.md following Keep a Changelog conventions
- Generated README.md using documentation patterns
- Bumped version in package.json

### v2.12.28 (2026-11-07) - Patch Release
- PWA headless mode and enhanced PhaseProgress v2.12.27 support

### v2.12.27 (2026-11-07) - Minor Release
- Implemented local storage-backed day notes, calendar events, and browser notification reminders with interactive modal editor
- Configured PWA manifest for headless / window-controls-overlay window mode
- Overhauled color contrast across phases and applied uniform rose weekend styling
- Optimized DayNavigator with React memo and instant date synchronization
- Fixed PhaseProgress to correctly render phase progress bars, names, and accurate day counts

### v2.12.21 (2026-11-07) - Patch Release
- Resolved PhaseProgress visibility, pre-start states, and build validation
- Fixed phaseDay calculation and counter interpolation
- Fixed local timezone date parsing and today calculation

### v2.12.19 (2026-11-07) - Minor Release
- Added past calendar navigation with 60-day history support
- Implemented month navigation controls (prev/next month)
- Enabled infinite maintenance phase (MAX_DAYS_AHEAD: 3650 days)
- Redesigned DayNavigator into full monthly calendar

### v2.12.16 (2026-11-07) - Minor Release
- Released with refactored phase progress, toast notification fixes, day counters optimization

### v2.12.15 (2026-11-07) - Patch Release
- Resolved tab switching race conditions and weekend highlighting
- Fixed navigation reload race condition

## Features

- **Nutritional Tracking**: Log and analyze food intake with detailed nutritional breakdowns powered by memoized calculation pipelines in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- **Meal Planning**: Generate personalized meal plans based on dietary requirements, including configurable daily meal counts (3-7) with calorie/protein distribution.
- **Bilingual Food Search**: Search and filter foods in multiple languages (supporting both translated names and raw food names) via [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1).
- **Calendar Navigation**: Full monthly calendar with weekend styling, saint/moon phase enrichment, and month navigation controls.
- **Day Notes & Reminders**: Local storage-backed day notes with browser notification reminders via interactive modal editor.
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
  ```bash
  npm run dev
  ```

- Build for production:
  ```bash
  npm run build
  ```

- Run tests:
  ```bash
  npm run test:run
  ```

- Run E2E tests:
  ```bash
  npm run test:e2e
  ```

## Key Hooks & Utilities

- **Hooks**:
  - [`useFoodSearch`](src/hooks/useFoodSearch.ts:1): Encapsulates bilingual food search functionality.
  - [`useNotificationPermission`](src/hooks/useNotificationPermission.ts:1): Manages browser notification permissions and timers.
  - [`usePhaseProgress`](src/components/dietPlan/PhaseProgress.tsx:1): Renders phase progress bars with accurate day counts.

- **Utilities**:
  - [`storage.ts`](src/utils/storage.ts:1): Secure storage with runtime schema validation and expiration.
  - [`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1): Memoized nutritional calculation pipeline for high performance.
  - [`navigation.ts`](src/utils/navigation.ts:1): Base-path-aware navigation handling for GitHub Pages deployment.
  - [`calendarHelpers.ts`](src/utils/calendarHelpers.ts:1): Italian saint and lunar phase calculations.

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

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE:1) file for details.

## Changelog

Full version history and change log are maintained in [`CHANGELOG.md`](CHANGELOG.md:1).