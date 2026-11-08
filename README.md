# FoodMapper

FoodMapper is an advanced, bilingual dietary planning, nutritional calculation, and lifestyle tracking web application built with React, Vite, TypeScript, and Tailwind CSS. It empowers users with personalized diet phase management, macro-nutrient calculation engines, workout planning, sleep tracking, and daily journaling capabilities.

## Features

- **Personalized Diet Plans**: Phase-based dietary progression (Phase 0 to Phase 3) tailored to individual biometrics and caloric needs.
- **Interactive Day Calendar & Navigator**: [`src/components/DayNavigator.tsx`](src/components/DayNavigator.tsx) provides monthly calendar navigation with weekend indicators, moon phases, saint days, Italian holidays, and activity/metadata modal logging.
- **Nutritional Calculation Engine**: Powered by optimized calculators in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts) and [`src/utils/mealGenerator.ts`](src/utils/mealGenerator.ts).
- **Bilingual Food Search**: [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts) ensures seamless bilingual food filtering.
- **Sleep & Workout Tracking**: Comprehensive sleep tracking, fitness integration, and workout management.
- **Multi-language Support**: Fully localized with i18next across Italian, English, French, Spanish, and German.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/FoodMapper.git
cd FoodMapper
npm install
```

### Running the Development Server

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

## Computational Reproducibility & Architecture

FoodMapper adheres to rigorous software engineering and reproducibility standards. All diet calculations, meal generation algorithms, and UI components are thoroughly tested via Vitest.

## License

MIT License. See [`LICENSE`](LICENSE) for details.
