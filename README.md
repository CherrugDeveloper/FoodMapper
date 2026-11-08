# FoodMapper

FoodMapper is a sophisticated progressive web application (PWA) designed for personalized IBS (Irritable Bowel Syndrome) dietary management, nutritional calculation, symptom tracking, meal planning, and educational resources.

## Overview

FoodMapper provides comprehensive clinical and nutritional tools to help individuals manage their dietary intake, track meals, monitor sleep and symptoms, and explore evidence-based IBS educational content. Built with React, TypeScript, Tailwind CSS, and Vite, it supports internationalization (English, Italian, French, German, Spanish) and offline capabilities.

## Features

- **Personalized Diet Plan**: Tailored phase-based diet planning with [`src/hooks/useDietPlan.ts`](src/hooks/useDietPlan.ts) and [`src/components/DietPlan.tsx`](src/components/DietPlan.tsx).
- **Nutritional Calculator**: Advanced calculation engine for daily caloric needs, macronutrients, and micronutrients in [`src/components/NutritionalCalculator.tsx`](src/components/NutritionalCalculator.tsx).
- **Interactive Diary & Tracking**: Comprehensive food diary, sleep tracking, and symptom logging.
- **Bilingual Food Search**: Dual-language search supporting both translated names and raw food identifiers via [`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts).
- **Educational Hub**: Curated medical and nutritional articles with multi-language support in [`src/content/`](src/content/).
- **Multi-language Support**: Full internationalization via `i18next` (`en`, `it`, `fr`, `de`, `es`).

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool**: Vite
- **Testing**: Vitest & Playwright

## Installation & Setup

Prerequisites: Node.js (v18+) and npm.

```bash
# Clone the repository
git clone https://github.com/CherrugDeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Start development server
npm run dev
```

## Running Tests

FoodMapper includes comprehensive unit, integration, and end-to-end test suites:

```bash
# Run unit tests
npm test

# Run unit tests once
npm run test:run

# Run Playwright E2E tests
npm run test:e2e
```

## Reproducibility & Build

To build the project for production:

```bash
npm run build
```

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
