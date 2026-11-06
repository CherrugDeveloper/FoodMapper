# IBS Nutrition App

A comprehensive nutrition tracking and meal planning application designed to help users manage their dietary needs, track nutritional intake, and optimize their health.

## Version

Current version: `2.12.8`

## Recent Updates

### v2.12.8 (2026-11-06) - Patch Release
- Optimized Playwright CI workflow with container-based runner configuration in [`.github/workflows/ci.yml`](.github/workflows/ci.yml:1)

### v2.12.7 (2026-11-06) - Patch Release
- Fixed InfoPopup PWA portable positioning with fixed coords and improved allergen button contrast
- Updated FodmapDetailsProps to accept string | null for foodId

### v2.12.6 (2026-11-05) - Patch Release
- Added Header component import and rendering for clearer app interface

### v2.12.5 (2026-11-05) - Patch Release
- Added debug logging to `acceptDisclaimer` function in E2E test fixtures for better test debugging

### v2.12.4 (2026-11-05) - Patch Release
- Fixed `prefer-const` lint error in InfoPopup component

### v2.12.3 (2026-11-05) - Patch Release
- Fixed PWA translation caching on portable devices by adding cache-busting query parameter to translation URLs
- Fixed InfoPopup touch/click handling on mobile devices (prevented synthetic click double-toggle)
- Reduced PWA Workbox cache duration for translations from 30 days to 7 days

### v2.12.2 (2026-11-05) - Patch Release
- Fixed Italian translation typo "Aviso AI" to "Avviso AI"
- Fixed recipe button text in MealCard component
- Added missing translation keys for week navigation and estimated cost across all locales

## Features

- **Nutritional Tracking**: Log and analyze food intake with detailed nutritional breakdowns powered by memoized calculation pipelines in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1).
- **Meal Planning**: Generate personalized meal plans based on dietary requirements, including configurable daily meal counts (3 or 4) with calorie/protein distribution.
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
