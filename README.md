# FoodMapper

FoodMapper is a high-performance Progressive Web Application (PWA) designed to provide comprehensive IBS (Irritable Bowel Syndrome) nutritional guidance, trifasic diet planning, bilingual food filtering, dynamic recipe management, smart shopping lists, sleep tracking, workout planning, and an educational hub.

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Installation & Getting Started](#installation--getting-started)
- [Available Scripts](#available-scripts)
- [Internationalization & Localization](#internationalization--localization)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Trifasic Diet Planning**: Structured dietary phases tailored for gut health and IBS symptom management.
- **Bilingual Food Search**: Dual-language search engine matching translated food names and raw database keys ([`src/hooks/useFoodSearch.ts`](src/hooks/useFoodSearch.ts:1)).
- **Nutritional Calculation Pipeline**: Memoized calculation engine for accurate macronutrient and micronutrient tracking ([`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts:1)).
- **Recipe Manager & Shopping List**: Custom recipes with integrated ingredient aggregation and automated shopping list generation.
- **Sleep & Workout Tracker**: Advanced tracking tools for sleep quality, circadian advice, and structured workout routines.
- **Educational Hub**: Markdown-based articles providing deep insights into gut biology, nutrition science, and metabolic health.
- **PWA & Offline Support**: Service worker integration for seamless offline usability across mobile and desktop devices.

---

## Architecture & Tech Stack

- **Frontend Framework**: React 19 (`react`, `react-dom`) with TypeScript.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **Routing & State**: React Router (`react-router-dom`) with custom React Context API (`src/context/AppContext.tsx`).
- **Internationalization**: i18next (`i18next`, `i18next-browser-languagedetector`, `i18next-http-backend`).
- **Build Tool**: Vite (`vite`) with GitHub Pages SPA fallback routing.
- **Testing Framework**: Vitest & Playwright (`vitest`, `@playwright/test`).

---

## Installation & Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/cherrugdeveloper/FoodMapper.git
cd FoodMapper

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Available Scripts

In the project directory, you can run:

- [`npm run dev`](package.json:12) - Starts the Vite development server with history API fallback.
- [`npm run build`](package.json:13) - Type-checks code with TypeScript and builds for production.
- [`npm run preview`](package.json:15) - Locally previews the production build.
- [`npm test`](package.json:16) - Runs the Vitest unit test suite.
- [`npm run test:run`](package.json:17) - Executes Vitest tests once.
- [`npm run test:e2e`](package.json:18) - Executes Playwright end-to-end tests.

---

## Internationalization & Localization

FoodMapper supports multi-language localization (Italian, English, German, Spanish, French). Translation files are loaded asynchronously via [`i18next-http-backend`](src/i18n.ts:1) from [`public/locales/`](public/locales/en/translation.json:1).

---

## Testing & Quality Assurance

The project maintains rigorous test coverage spanning unit tests (`tests/`) and end-to-end browser tests (`tests/e2e/`). Run the test suite with:

```bash
npm test
```

---

## Deployment

FoodMapper is automatically configured for deployment on GitHub Pages with SPA fallback redirection via [`index.html`](index.html:1) and [`public/404.html`](public/404.html:1).

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE:1) for more information.
