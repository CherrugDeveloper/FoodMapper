# FoodMapper

FoodMapper is a sophisticated React application designed for dietary planning, FODMAP tracking, symptom logging, nutritional analysis, and wellness monitoring.

## Project Overview

FoodMapper helps users navigate elimination and reintroduction phases of specialized diets, track daily meals, monitor water intake, analyze micro- and macro-nutrients, and record health metrics over time.

## Features

- **Diet Planning & Phases**: Manage Prep, Elimination, Reintroduction, and Maintenance phases with intuitive day navigation (`src/components/DayNavigator.tsx`).
- **Food Database & Search**: Bilingual food search (`src/hooks/useFoodSearch.ts`) across a comprehensive nutritional database (`src/utils/foodsData.ts`).
- **Nutritional Engine**: Advanced calculations (`src/utils/nutritionCalculator.ts`, [`src/utils/nutritionEngine.ts`](src/utils/nutritionEngine.ts:1)) for macros and micronutrients with deficiency/excess analysis.
- **Symptom & Transit Tracking**: Record daily symptoms, stool transit scores, bowel movements, and water intake (`src/components/Diary.tsx`).
- **Internationalization**: Multilingual support (Italian, English, German, Spanish, French) via i18next (`src/i18n.ts`).
- **PWA & Offline Support**: Progressive Web App capabilities with service worker caching.

## Requirements

- Node.js (v18+ recommended)
- npm or pnpm

## Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper
npm install
```

## Running the Development Server

Start the local development server with Vite:

```bash
npm run dev
```

## Running Tests

Execute unit tests with Vitest:

```bash
npm run test:run
```

Run end-to-end tests with Playwright:

```bash
npm run test:e2e
```

## Building for Production

Build the production-ready bundle and run type checking:

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE:1) file for details.
