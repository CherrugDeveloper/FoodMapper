# FoodMapper

[![Build and Deploy](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/deploy.yml/badge.svg)](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/deploy.yml)
[![E2E Tests](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/playwright.yml/badge.svg)](https://github.com/CherrugDeveloper/FoodMapper/actions/workflows/playwright.yml)

FoodMapper is a comprehensive, open-source nutrition and diet management application designed for academic reproducibility and individual wellness tracking. It provides specialized tools for diet planning, nutritional calculation, and lifestyle tracking with a focus on FODMAP sensitivity management.

## 🚀 Features

- **Diet Planner**: Advanced multi-phase diet planning with interactive calendar and meal tracking.
- **Nutritional Calculator**: Scientific calorie and macro-nutrient calculations using the Mifflin-St Jeor equation and EFSA standards.
- **Diary & Progress**: Daily food logging with localized search and nutritional breakdown.
- **Recipe Management**: Curated recipes with allergen filtering and FODMAP guidance.
- **Health Suite**: Sleep tracking, medication reminders, and workout planning integrations.
- **Multilingual Support**: Fully localized in English, Italian, German, Spanish, and French.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)
- **Internationalization**: [i18next](https://www.i18next.com/)

## 📋 Prerequisites

- Node.js >= 20.x
- npm >= 10.x

## 🔧 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CherrugDeveloper/FoodMapper.git
   cd FoodMapper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Development server**:
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   ```

## 🧪 Testing

The project maintains high coverage through both unit and end-to-end tests:

- **Unit/Integration Tests**: `npm run test:run`
- **E2E Tests**: `npm run test:e2e`
- **Linting**: `npm run lint`

## 📋 Changelog Viewer

The changelog viewer includes a search bar to filter entries by version, date, or content, and category filter buttons to narrow results by Features, Fixes, or Improvements. A filter summary shows how many entries match your criteria, and an empty state appears when no results found.

## 🎨 Bug Fixes (v2.12.87)

- **MealGenerator**: Changed `mealCount` default from 4 to 7, so day plans now generate 7 meals by default matching test expectations

- **Auto-Git Workflow**: Updated versioning, test verification, CHANGELOG generation, documentation updates, and secure staging workflow per auto-git protocol.

- **E2E Tests**: Split sequential multi-language calculator results test into independent test blocks in [`tests/e2e/i18n.spec.ts`](tests/e2e/i18n.spec.ts:238) to prevent state leakage and test timeouts.

## 🎨 Bug Fixes (v2.12.90)

- **MealGenerator**: Fixed protein distribution normalization - daily protein total now exactly equals 100g target by applying scale factor `100 / totals.protein` after all meals calculated, preventing `clampGrams` from forcing each meal's protein minimum 100g

## 🎨 Bug Fixes (v2.12.91)

- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

## 🎨 Bug Fixes (v2.12.92)

- **MealGenerator**: Fixed cumulative protein grams ReferenceError by removing undefined variable from meal generation loop

## 🎨 Bug Fixes (v2.12.93)

- **MealGenerator**: Added `slotGrams` tracking variable for improved protein distribution monitoring
- **Debug tests**: Updated type annotations from `any` to specific types for better type safety

## 🎨 Bug Fixes (v2.12.94)

- **CHANGELOG.md**: Added version 2.12.94 entry with structured categories (Fixed, Changed, Added)
- **README.md**: Added v2.12.94 bug fixes section following existing markdown conventions

## 🎨 Bug Fixes (v2.12.95)

- **Auto-Git Workflow**: Implemented fully autonomous Git versioning, test verification, CHANGELOG generation, semantic documentation updates, secure staging, and push workflow

## 🎨 Bug Fixes (v2.12.96)

- **CHANGELOG.md**: Added version 2.12.96 entry with structured categories (Fixed, Changed, Added)
- **README.md**: Added v2.12.96 bug fixes section following existing markdown conventions


## 🎨 Bug Fixes (v2.12.98)

- **Auto-Git Workflow**: Version bump to 2.12.98, CHANGELOG entry added, README updated with changes section, and git workflow completed

## 🎨 Bug Fixes (v2.12.99)

- **Version Bump**: Incremented version to 2.12.99 in package.json
- **CHANGELOG.md**: Added version 2.12.99 entry with structured categories (Fixed, Changed, Added)
- **README.md**: Added v2.12.99 bug fixes section following existing markdown conventions
