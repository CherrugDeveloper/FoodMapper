# FoodMapper

FoodMapper is an advanced, multilingual nutritional tracking, diet planning, bio-hacking, and wellness application built with React, Vite, Tailwind CSS, and TypeScript. It provides comprehensive nutritional calculations, meal planning, medication tracking, sleep tracking, and educational resources adhering to EFSA guidelines.

## Key Features

- **Nutritional & Caloric Calculator**: Personalized macros, calories, and health condition adjustments based on scientific formulas (Mifflin-St Jeor, EFSA guidelines).
- **Diet Plan Management**: Dynamic meal plan generation with phase tracking, meal count customization, warning symbols, and recommended choices.
- **Day & Calendar Navigation**: Seamless daily navigation, holiday detection, diary logging, and race-condition resilient state management.
- **Medication & Supplement Tracker**: Structured medication logging, warnings, and intelligent recognition.
- **Sleep & Bio-Hacking Dashboard**: Sleep tracking, sleep sounds, advice, and bio-hacking insights.
- **Multilingual Support**: Fully localized in English, Italian, French, Spanish, and German using `i18next`.

## Project Structure

```text
src/
├── assets/          # Images and static assets
├── components/      # UI components (DietPlan, NutritionalCalculator, DayNavigator, etc.)
├── content/         # Markdown educational articles in multiple languages
├── context/         # React Context providers and state definitions
├── hooks/           # Custom React hooks (useDietPlan, useFoodSearch, etc.)
├── types/           # TypeScript interfaces and type definitions
├── utils/           # Calculators, storage utilities, calendar helpers, food data
tests/               # Vitest unit and integration test suites, Playwright E2E tests
```

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- npm or yarn

## Installation

```bash
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper
npm install
```

## Run Development Server

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start Vite development server
- `npm run build`: Type-check (`tsc -b`) and build for production
- `npm run lint`: Run ESLint checks
- `npm run test`: Run Vitest unit tests in watch mode
- `npm run test:run`: Run Vitest test suite once
- `npm run test:e2e`: Run Playwright end-to-end tests
- `npm run test:ci`: Run CI E2E tests

## License

MIT
