# FoodMapper

FoodMapper is a comprehensive, multilingual progressive web application (PWA) designed for advanced dietary planning, nutritional calculation, macro/micronutrient tracking, workout logging, sleep tracking, and educational health insights.

## Project Structure & Architecture

- [`src/App.tsx`](src/App.tsx) - Root application component with routing and state providers.
- [`src/context/AppContext.tsx`](src/context/AppContext.tsx) - Central application state management.
- [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts) - Diet plan management featuring high-performance sliding window day generation.
- [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) - Calendar navigation and day selector component.
- [`src/components/dietPlan/PhaseProgress.tsx`](src/components/dietPlan/PhaseProgress.tsx) - Diet phase progress indicator.
- [`src/components/dietPlan/MealCard.tsx`](src/components/dietPlan/MealCard.tsx) - Interactive meal card with confirmation handling.
- [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx) - Advanced nutritional calculator and info popups.
- [`public/locales/it/translation.json`](public/locales/it/translation.json) - Italian localization resources.

## Installation & Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run test suite
npm test

# Build for production
npm run build
```

## Reproducibility & Testing

All tests are implemented using Vitest and React Testing Library:
- Run unit and integration tests: `npm test`
- Run end-to-end tests: `npm run test:e2e`
