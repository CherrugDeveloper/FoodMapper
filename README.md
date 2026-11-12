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

## 📖 Reproducibility & Research

This project is designed with academic reproducibility in mind. All nutritional calculations are documented in [`src/utils/nutritionCalculator.ts`](src/utils/nutritionCalculator.ts) and validated against EFSA guidelines. The core logic for the FODMAP elimination phase follows established clinical protocols.

For detailed development patterns, refer to [`AGENTS.md`](AGENTS.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
