# FoodMapper

FoodMapper is a sophisticated React application designed for advanced nutritional tracking, dietary planning, bio-hacking insights, and medical nutritional calculations.

## Key Features

- **Nutritional Calculator**: Biometric analysis, caloric needs (Mifflin-St Jeor), macronutrient distribution, and health condition management.
- **Diet Plan Generator**: Customizable meal distribution across 3 to 7 meals per day, phase progression, and daily tracking.
- **Day Navigator**: Clean day-by-day navigation for meal management and diary logging.
- **Educational Hub**: Deep-dive articles on nutrition, metabolism, and FODMAP protocols.
- **Sleep & Workout Tracking**: Sleep tracking, chronotype advice, and guided workout routines.
- **Internationalization**: Bilingual search and multi-language support (English, Italian, German, French, Spanish).

## Project Structure

- [`src/components/`](src/components/:1) - React UI components ([`NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx:1), [`DietPlan.tsx`](src/components/DietPlan.tsx:1), [`DayNavigator.tsx`](src/components/DayNavigator.tsx:1), etc.)
- [`src/hooks/`](src/hooks/:1) - Custom React hooks ([`useDietPlan.ts`](src/hooks/useDietPlan.ts:1), [`useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1), etc.)
- [`src/utils/`](src/utils/:1) - Nutritional engines, calculators, and data stores ([`nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1), [`mealGenerator.ts`](src/utils/mealGenerator.ts:1))
- [`public/locales/`](public/locales/:1) - Localization translation JSON files ([`translation.json`](public/locales/it/translation.json:1))
- [`tests/`](tests/:1) - Comprehensive Vitest and Playwright test suites

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Available Scripts

- [`npm test`](package.json:16) - Run test suite with Vitest
- [`npm run test:run`](package.json:17) - Run tests once
- [`npm run build`](package.json:13) - Type-check and build for production
- [`npm run lint`](package.json:14) - Lint codebase with ESLint

## License

This project is licensed under the MIT License - see the [`LICENSE`](LICENSE:1) file for details.
