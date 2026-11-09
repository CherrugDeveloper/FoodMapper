# FoodMapper

A comprehensive food tracking and dietary management application for medical nutrition therapy, built with React 19, TypeScript, and Tailwind CSS.

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Advanced Features](#advanced-features)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Styling](#styling)
- [State Management](#state-management)
- [Internationalization](#internationalization)
- [Testing](#testing)
- [Browser Support](#browser-support)
- [Core Components](#core-components)
- [Contributing](#contributing)
- [License](#license)
- [Citation & Academic Attribution](#citation--academic-attribution)

## Project Overview

FoodMapper is an open-source Progressive Web App (PWA) designed for medical nutrition therapy, particularly for patients following specific dietary protocols such as Low FODMAP, IBS management, and other specialized diets. The application provides comprehensive tools for tracking food intake, calculating nutritional values, managing meal plans, and monitoring health metrics.

Key capabilities include:
- Bilingual food search with translated names and raw food names matching
- Nutritional calculations with EFSA-compliant guidelines
- Interactive calendar-based diet planning with phase tracking
- Sleep and exercise tracking integration
- Recipe management and shopping list generation
- Internationalization support for 5 languages (English, Italian, Spanish, French, German)

### Core Features

- **Food Database**: Extensive database of foods with nutritional information, FODMAP content, and allergen data
- **Nutritional Calculator**: Real-time nutrition calculation with weight-dependent EFSA guidance
- **Meal Planning**: Interactive calendar for planning meals across multiple diet phases
- **Dietary Guidelines**: Evidence-based recommendations for various medical diets
- **Progress Tracking**: Meal tracking, sleep monitoring, and exercise integration
- **Localization**: Full internationalization support with translated content in multiple languages

### Advanced Features

- **Progressive Web App**: Installable PWA with offline support and standalone mode
- **Dark Mode**: Toggle between light and dark color schemes for accessibility
- **Responsive Design**: Mobile-first responsive layout optimized for all screen sizes
- **Voice Notifications**: Configurable reminder system with permission handling
- **Data Export**: Ability to export tracking data for healthcare providers
- **Customizable Alerts**: Set up warnings for dietary violations and health metrics

## Installation

### Clone the repository

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
```

### Install dependencies

```bash
npm install
```

## Available Scripts

### Frontend

```bash
npm run dev
```
Runs the development server with hot module replacement at `http://localhost:5173`

```bash
npm run build
```
Builds the application for production with TypeScript compilation and Vite bundling

```bash
npm run preview
```
Serves the production build locally for testing

### Linting

```bash
npm run lint
```
Runs ESLint on all source files to check for code quality issues and style violations

### State Management

The application uses React Context API with custom hooks for state management:
- `useDietPlan` - Manages diet phase and day state
- `useNutritionCalculator` - Handles nutritional calculations and memoization
- `useFoodSearch` - Provides bilingual food search functionality
- `useNotificationPermission` - Manages browser notification permissions
- `useSleepTracking` - Handles sleep data and insights
- `useRecipes` - Manages recipe data and operations
- `useShoppingList` - Handles shopping list generation

### Internationalization

The application uses i18next for internationalization with HTTP backend for dynamic translation loading. Supported languages:
- English (en)
- Italian (it)
- Spanish (es)
- French (fr)
- German (de)

Language detection uses browser-based detection with fallback to English.

### Testing

```bash
npm test
```
Runs tests in watch mode with Vitest

```bash
npm run test:run
```
Runs all tests once in CI mode (120 tests across 17 test files)

```bash
npm run test:e2e
```
Runs Playwright end-to-end tests

```bash
npm run test:e2e:ui
```
Opens Playwright test runner with interactive UI

```bash
npm run test:ci
```
Runs Playwright tests with line reporter for CI pipelines

### Browser Support

- Chrome 100+
- Firefox 95+
- Safari 15+
- Edge 100+
- Mobile browsers (iOS Safari, Android Chrome)

### Core Components

The application features the following main components:

#### Diet Plan Components
- `DietPlan.tsx` - Main diet planning interface with meal tracking
- `PhaseProgress.tsx` - Visualizes progress through diet phases
- `MealCard.tsx` - Individual meal display and editing
- `DayNavigator.tsx` - Interactive calendar for day navigation

#### Dashboard Components
- `Diary.tsx` - Food diary and intake tracking
- `Recipes.tsx` - Recipe browsing and management
- `ShoppingList.tsx` - Shopping list generation from tracked foods
- `SleepDashboard.tsx` - Sleep tracking and insights
- `WorkoutPlan.tsx` - Exercise integration
- `NutritionalCalculator.tsx` - Real-time nutrition calculation

#### Utility Components
- `FoodFilter.tsx` - Bilingual food search with autocomplete
- `Header.tsx` - Application header with navigation
- `Toast.tsx` - Notification system
- `WarningAlert.tsx` - Dietary warning displays
- `InfoPopup.tsx` - Detailed information popups
- `DayNavigator.tsx` - Calendar-based date selection

## Contributing

Contributions are welcome! Please read the [AGENTS.md](AGENTS.md) file for development guidelines and workflow instructions.

### Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Run tests: `npm run test:run`
5. Run linter: `npm run lint`
6. Commit with conventional commits
7. Push to your fork
8. Create a pull request

### Code Standards

- TypeScript strict mode enabled
- ESLint with React hooks and refresh plugins
- Prettier for code formatting
- Semantic versioning for releases
- Follow Keep a Changelog format for CHANGELOG.md

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation & Academic Attribution

If you use FoodMapper in your research or clinical practice, please cite:

```bibtex
@software{foodmapper2024,
  author       = {Cherrugdeveloper},
  title        = {FoodMapper: A Medical Nutrition Therapy Application},
  year         = {2024},
  publisher    = {GitHub},
  version      = {2.12.59},
  url          = {https://github.com/cherrugdeveloper/FoodMapper}
}
```

For academic use in publications, please reference the project repository and include the version number used in your study.