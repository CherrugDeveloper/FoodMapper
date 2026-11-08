# FoodMapper

## Overview
FoodMapper is a state-of-the-art nutritional planning and tracking web application designed to generate personalized dietary plans, track food intake, monitor symptoms (such as IBS), manage fitness and workout integration, and provide educational resources in a multi-language environment.

## Key Features
- Personalized nutritional calculations (Mifflin-St Jeor equation, BMR, TDEE, macro distribution).
- Advanced diet planning with configurable meal counts (1 to 7 meals per day) and phase tracking.
- Interactive DayNavigator with holiday detection, quick day switching, and date picking.
- Comprehensive food search (bilingual matching) and shopping list generation.
- Medication recognition, warnings, and biological/metabolic educational hub.
- Full offline support and PWA capabilities.

## Project Structure
- `src/components/`: React UI components (DietPlan, DayNavigator, NutritionalCalculator, Diary, Recipes, ShoppingList, etc.)
- `src/context/`: Application state and context providers.
- `src/hooks/`: Custom React hooks for fitness integration, food search, notifications, diet plan management.
- `src/utils/`: Nutritional calculation engines, data repositories, storage handlers, and helpers.
- `tests/`: Vitest test suites and Playwright E2E tests.

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Installation & Setup
```bash
# Clone repository
git clone https://github.com/your-username/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Run development server
npm run dev
```

## Available Scripts
- `npm run dev` - Start Vite development server
- `npm test` - Run Vitest test suite
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint code checks
- `npm run e2e` - Run Playwright E2E tests
